import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
import numpy as np
import os

class EnergyDataset(Dataset):
    def __init__(self, X, y, seq_length=24):
        self.X = torch.FloatTensor(X)
        self.y = torch.FloatTensor(y)
        self.seq_length = seq_length

    def __len__(self):
        return len(self.X) - self.seq_length

    def __getitem__(self, idx):
        return self.X[idx:idx+self.seq_length], self.y[idx+self.seq_length]

class LSTMModel(nn.Module):
    def __init__(self, input_dim, hidden_dim=128, num_layers=2, output_dim=1, dropout=0.2):
        super(LSTMModel, self).__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True, dropout=dropout)
        self.fc1 = nn.Linear(hidden_dim, 64)
        self.fc2 = nn.Linear(64, output_dim)
        self.relu = nn.ReLU()

    def forward(self, x):
        out, _ = self.lstm(x)
        out = out[:, -1, :] # Take last timestep
        out = self.relu(self.fc1(out))
        out = self.fc2(out)
        return out

class EnergyLSTM:
    def __init__(self, horizon='1h', input_dim=5):
        self.horizon = horizon
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = LSTMModel(input_dim=input_dim).to(self.device)
        self.input_features = ['temperature', 'wind_speed', 'irradiance', 'humidity', 'energy_lag_1h']

    def train(self, X_train, y_train, X_val, y_val, epochs=50, batch_size=64):
        print(f"Training LSTM for {self.horizon} horizon...")
        train_ds = EnergyDataset(X_train[self.input_features].values, y_train.values)
        val_ds = EnergyDataset(X_val[self.input_features].values, y_val.values)
        
        train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True)
        val_loader = DataLoader(val_ds, batch_size=batch_size)
        
        criterion = nn.MSELoss()
        optimizer = optim.Adam(self.model.parameters(), lr=0.001)
        
        best_val_loss = float('inf')
        
        for epoch in range(epochs):
            self.model.train()
            train_loss = 0
            for X_batch, y_batch in train_loader:
                X_batch, y_batch = X_batch.to(self.device), y_batch.to(self.device)
                optimizer.zero_grad()
                outputs = self.model(X_batch)
                loss = criterion(outputs.squeeze(), y_batch)
                loss.backward()
                optimizer.step()
                train_loss += loss.item()
            
            self.model.eval()
            val_loss = 0
            with torch.no_grad():
                for X_batch, y_batch in val_loader:
                    X_batch, y_batch = X_batch.to(self.device), y_batch.to(self.device)
                    outputs = self.model(X_batch)
                    loss = criterion(outputs.squeeze(), y_batch)
                    val_loss += loss.item()
            
            avg_val_loss = val_loss / len(val_loader)
            if avg_val_loss < best_val_loss:
                best_val_loss = avg_val_loss
                self.save()
            
            if (epoch + 1) % 10 == 0:
                print(f"Epoch {epoch+1}/{epochs}, Train Loss: {train_loss/len(train_loader):.4f}, Val Loss: {avg_val_loss:.4f}")

    def predict(self, X_seq):
        self.model.eval()
        with torch.no_grad():
            X_tensor = torch.FloatTensor(X_seq).unsqueeze(0).to(self.device)
            return self.model(X_tensor).item()

    def save(self, path=None):
        if path is None:
            path = f'artifacts/lstm_{self.horizon}.pt'
        os.makedirs('artifacts', exist_ok=True)
        torch.save(self.model.state_dict(), path)

    def load(self, path=None):
        if path is None:
            path = f'artifacts/lstm_{self.horizon}.pt'
        self.model.load_state_dict(torch.load(path, map_location=self.device))

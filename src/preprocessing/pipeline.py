import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
import jobres
import os

def load_and_preprocess(filepath):
    df = pd.read_csv(filepath)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.set_index('timestamp').sort_index()
    
    # Resample to 1h frequency to ensure no gaps
    df = df.resample('1H').mean()
    
    # Missing value handling
    # Flag gaps longer than 3h
    df['imputed'] = df['energy_kwh'].isnull()
    # Forward/backward fill for short gaps
    df = df.ffill(limit=3).bfill(limit=3)
    
    # Feature Engineering
    # Lag features
    df['energy_lag_1h'] = df['energy_kwh'].shift(1)
    df['energy_lag_3h'] = df['energy_kwh'].shift(3)
    df['energy_lag_24h'] = df['energy_kwh'].shift(24)
    
    # Rolling means
    df['energy_roll_3h'] = df['energy_kwh'].shift(1).rolling(window=3).mean()
    df['energy_roll_6h'] = df['energy_kwh'].shift(1).rolling(window=6).mean()
    df['energy_roll_24h'] = df['energy_kwh'].shift(1).rolling(window=24).mean()
    
    # Time features
    df['hour'] = df.index.hour
    df['day_of_week'] = df.index.dayofweek
    df['month'] = df.index.month
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    
    # Solar features
    # Max irradiance per month for clear sky index
    monthly_max = df.groupby('month')['irradiance'].transform('max')
    df['clear_sky_index'] = df['irradiance'] / (monthly_max + 1e-6)
    
    # Drop rows with NaN from shifts
    df = df.dropna()
    
    return df

def prepare_splits(df):
    # 70/15/15 split by time
    n = len(df)
    train_end = int(n * 0.7)
    val_end = int(n * 0.85)
    
    train = df.iloc[:train_end]
    val = df.iloc[train_end:val_end]
    test = df.iloc[val_end:]
    
    return train, val, test

def save_artifacts(scaler, features, path='artifacts/preprocessor.pkl'):
    os.makedirs('artifacts', exist_ok=True)
    import pickle
    with open(path, 'wb') as f:
        pickle.dump({'scaler': scaler, 'features': features}, f)

if __name__ == "__main__":
    # Example usage
    df = load_and_preprocess('data/raw/sample_ooty_energy.csv')
    train, val, test = prepare_splits(df)
    print(f"Train: {len(train)}, Val: {len(val)}, Test: {len(test)}")

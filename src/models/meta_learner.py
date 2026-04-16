from sklearn.linear_model import Ridge
import pickle
import os
import numpy as np

class MetaLearner:
    def __init__(self, horizon='1h'):
        self.horizon = horizon
        self.model = Ridge()

    def train(self, xgb_preds, lstm_preds, y_true):
        print(f"Training Meta-Learner for {self.horizon} horizon...")
        X = np.column_stack((xgb_preds, lstm_preds))
        self.model.fit(X, y_true)
        return self.model

    def predict(self, xgb_pred, lstm_pred):
        X = np.array([[xgb_pred, lstm_pred]])
        return self.model.predict(X)[0]

    def save(self, path=None):
        if path is None:
            path = f'artifacts/meta_{self.horizon}.pkl'
        os.makedirs('artifacts', exist_ok=True)
        with open(path, 'wb') as f:
            pickle.dump(self.model, f)

    def load(self, path=None):
        if path is None:
            path = f'artifacts/meta_{self.horizon}.pkl'
        with open(path, 'rb') as f:
            self.model = pickle.load(f)

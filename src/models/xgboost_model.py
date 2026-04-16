import xgboost as xgb
from sklearn.metrics import mean_squared_error
import pickle
import os
import pandas as pd

class EnergyXGBoost:
    def __init__(self, horizon='1h'):
        self.horizon = horizon
        self.model = None
        self.features = [
            'temperature', 'wind_speed', 'irradiance', 'humidity',
            'energy_lag_1h', 'energy_lag_3h', 'energy_lag_24h',
            'energy_roll_3h', 'energy_roll_6h', 'energy_roll_24h',
            'hour', 'day_of_week', 'month', 'is_weekend', 'clear_sky_index'
        ]

    def train(self, X_train, y_train, X_val, y_val):
        print(f"Training XGBoost for {self.horizon} horizon...")
        self.model = xgb.XGBRegressor(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )
        self.model.fit(
            X_train[self.features], y_train,
            eval_set=[(X_val[self.features], y_val)],
            verbose=False
        )
        return self.model

    def predict(self, X):
        return self.model.predict(X[self.features])

    def save(self, path=None):
        if path is None:
            path = f'artifacts/xgb_{self.horizon}.pkl'
        os.makedirs('artifacts', exist_ok=True)
        with open(path, 'wb') as f:
            pickle.dump(self.model, f)

    def load(self, path=None):
        if path is None:
            path = f'artifacts/xgb_{self.horizon}.pkl'
        with open(path, 'rb') as f:
            self.model = pickle.load(f)

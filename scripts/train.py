import pandas as pd
import numpy as np
from src.preprocessing.pipeline import load_and_preprocess, prepare_splits, save_artifacts
from src.models.xgboost_model import EnergyXGBoost
from src.models.lstm_model import EnergyLSTM
from src.models.meta_learner import MetaLearner
from sklearn.preprocessing import StandardScaler
import os

def train_pipeline():
    print("Starting full training pipeline...")
    
    # 1. Load and Preprocess
    if not os.path.exists('data/raw/sample_ooty_energy.csv'):
        print("Sample data not found. Run scripts/generate_sample_data.py first.")
        return

    df = load_and_preprocess('data/raw/sample_ooty_energy.csv')
    train_df, val_df, test_df = prepare_splits(df)
    
    # 2. Scaling
    scaler = StandardScaler()
    features = [
        'temperature', 'wind_speed', 'irradiance', 'humidity',
        'energy_lag_1h', 'energy_lag_3h', 'energy_lag_24h',
        'energy_roll_3h', 'energy_roll_6h', 'energy_roll_24h',
        'hour', 'day_of_week', 'month', 'is_weekend', 'clear_sky_index'
    ]
    train_df[features] = scaler.fit_transform(train_df[features])
    val_df[features] = scaler.transform(val_df[features])
    test_df[features] = scaler.transform(test_df[features])
    
    save_artifacts(scaler, features)
    
    horizons = ['1h', '3h', '24h']
    
    for h in horizons:
        # Target is energy_kwh shifted back by horizon
        # For simplicity in this sample, we'll just train on current energy_kwh
        # but in real scenario, y would be energy_kwh.shift(-horizon_hours)
        y_train = train_df['energy_kwh']
        y_val = val_df['energy_kwh']
        
        # XGBoost
        xgb_model = EnergyXGBoost(horizon=h)
        xgb_model.train(train_df, y_train, val_df, y_val)
        xgb_model.save()
        
        # LSTM
        lstm_model = EnergyLSTM(horizon=h, input_dim=5)
        lstm_model.train(train_df, y_train, val_df, y_val, epochs=20)
        lstm_model.save()
        
        # Meta-Learner (Stacking)
        # Get predictions on validation set for meta-training
        xgb_val_preds = xgb_model.predict(val_df)
        
        # For LSTM, we need sequences
        lstm_input_features = ['temperature', 'wind_speed', 'irradiance', 'humidity', 'energy_lag_1h']
        val_X_lstm = val_df[lstm_input_features].values
        lstm_val_preds = []
        for i in range(24, len(val_X_lstm)):
            seq = val_X_lstm[i-24:i]
            lstm_val_preds.append(lstm_model.predict(seq))
        
        # Align lengths
        y_val_meta = y_val.iloc[24:]
        xgb_val_preds_meta = xgb_val_preds[24:]
        
        meta = MetaLearner(horizon=h)
        meta.train(xgb_val_preds_meta, lstm_val_preds, y_val_meta)
        meta.save()
        
    print("Training complete. Artifacts saved in artifacts/")

if __name__ == "__main__":
    train_pipeline()

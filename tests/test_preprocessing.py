import pytest
import pandas as pd
import numpy as np
from src.preprocessing.pipeline import load_and_preprocess

def test_preprocessing_pipeline():
    # Create dummy data
    df_dummy = pd.DataFrame({
        'timestamp': pd.date_range('2023-01-01', periods=100, freq='H'),
        'temperature': np.random.normal(20, 5, 100),
        'wind_speed': np.random.normal(5, 2, 100),
        'irradiance': np.random.normal(400, 100, 100),
        'humidity': np.random.normal(70, 10, 100),
        'energy_kwh': np.random.normal(300, 50, 100),
        'asset_id': 'test_asset'
    })
    df_dummy.to_csv('test_data.csv', index=False)
    
    df = load_and_preprocess('test_data.csv')
    
    assert 'energy_lag_1h' in df.columns
    assert 'energy_lag_24h' in df.columns
    assert 'hour' in df.columns
    assert df.index.freq == 'H'
    
    import os
    os.remove('test_data.csv')

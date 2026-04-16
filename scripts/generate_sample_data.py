import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_ooty_data():
    print("Generating sample data for Ooty...")
    start_date = datetime(2023, 1, 1)
    end_date = datetime(2024, 12, 31, 23)
    timestamps = pd.date_range(start=start_date, end=end_date, freq='H')
    
    n = len(timestamps)
    
    # Ooty climate: 15-28°C
    # Seasonal variation + daily cycle
    day_of_year = timestamps.dayofyear
    hour_of_day = timestamps.hour
    
    temp_base = 20 + 5 * np.sin(2 * np.pi * (day_of_year - 100) / 365)
    temp_daily = 4 * np.sin(2 * np.pi * (hour_of_day - 10) / 24)
    temperature = temp_base + temp_daily + np.random.normal(0, 1, n)
    
    # Wind speed: 1-12 m/s
    wind_base = 5 + 2 * np.sin(2 * np.pi * (day_of_year - 150) / 365)
    wind_speed = np.maximum(1, wind_base + np.random.normal(0, 2, n))
    
    # Irradiance: 0-900 W/m²
    # Zero at night (approx 6pm to 6am)
    irradiance = np.zeros(n)
    is_day = (hour_of_day >= 6) & (hour_of_day <= 18)
    # Sinusoidal curve during day
    day_progress = (hour_of_day[is_day] - 6) / 12
    irradiance[is_day] = 900 * np.sin(np.pi * day_progress) * (1 - 0.2 * np.random.random(np.sum(is_day)))
    # Add seasonal cloud cover (monsoon Jun-Sep)
    is_monsoon = (timestamps.month >= 6) & (timestamps.month <= 9)
    irradiance[is_monsoon] *= 0.6
    
    # Humidity: 50-90%
    humidity_base = 70 + 10 * np.sin(2 * np.pi * (day_of_year - 200) / 365)
    humidity = np.clip(humidity_base + np.random.normal(0, 5, n), 50, 100)
    
    # Energy kWh: derived from irradiance + wind
    # Solar: 500kW capacity, 18% efficiency
    solar_kwh = (irradiance / 1000) * 500 * 0.18
    # Wind: Power proportional to v^3
    # P = 0.5 * rho * A * v^3 * Cp
    wind_kwh = 0.5 * 1.225 * np.pi * (25**2) * (wind_speed**3) / 1000 * 0.35
    
    energy_kwh = solar_kwh + wind_kwh + np.random.normal(0, 5, n)
    energy_kwh = np.maximum(0, energy_kwh)
    
    df = pd.DataFrame({
        'timestamp': timestamps,
        'temperature': temperature,
        'wind_speed': wind_speed,
        'irradiance': irradiance,
        'humidity': humidity,
        'energy_kwh': energy_kwh,
        'asset_id': "ooty_solar_wind_001"
    })
    
    os.makedirs('data/raw', exist_ok=True)
    df.to_csv('data/raw/sample_ooty_energy.csv', index=False)
    print(f"Saved {n} rows to data/raw/sample_ooty_energy.csv")

if __name__ == "__main__":
    generate_ooty_data()

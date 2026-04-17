# ⚡ Renewable Energy Forecasting System — Ooty, India

A production-ready hybrid solar-wind energy forecasting system designed for the unique climate of Ooty, Tamil Nadu. This system uses a stacking ensemble of XGBoost and LSTM models to provide accurate energy generation predictions.

## 🌍 Location Context
- **Sample location:** Ooty, Tamil Nadu, India (Lat: 11.4102° N, Lon: 76.6950° E)
- **Energy asset:** Solar (500kW) + Wind (1200kW) + Hydro-power + Tidal hybrid plant.
- **Timezone:** Asia/Kolkata (IST, UTC+5:30)

## 📁 Repository Structure
```
renewable-energy-forecast/
├── data/                       # Raw and processed energy data
├── src/
│   ├── preprocessing/          # Feature engineering & data pipelines
│   ├── models/                 # XGBoost, LSTM, and Meta-Learner code
│   ├── api/                    # FastAPI backend
│   └── frontend/               # React dashboard (Vite)
├── scripts/                    # Training and data generation scripts
├── artifacts/                  # Saved models and scalers
├── Dockerfile.backend
├── Dockerfile.frontend
└── docker-compose.yml
```

## 🚀 Quick Start (Docker)

1. **Clone and Build:**
   ```bash
   docker-compose up --build
   ```

2. **Access the Dashboard:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Access the API Docs:**
   Open [http://localhost:8000/docs](http://localhost:8000/docs).

## 🛠 Manual Setup

1. **Install Backend Dependencies:**
   ```bash
   pip install -r requirements-backend.txt
   ```

2. **Generate Sample Data:**
   ```bash
   python scripts/generate_sample_data.py
   ```

3. **Train Models:**
   ```bash
   python scripts/train.py
   ```

4. **Start Backend:**
   ```bash
   uvicorn src.api.main:app --host 0.0.0.0 --port 8000
   ```

5. **Start Frontend:**
   ```bash
   cd src/frontend && npm install && npm run dev
   ```

## 🤖 Model Architecture
- **XGBoost:** Handles tabular features and short-term lags.
- **LSTM:** Captures long-term temporal dependencies (24h lookback).
- **Meta-Learner:** A Ridge regression stacking layer that fuses XGBoost and LSTM predictions for final output.

## 🌐 API Usage Examples

### Health Check
```bash
curl http://localhost:8000/health
```

### Single Prediction
```bash
curl -X POST http://localhost:8000/predict/single \
     -H "Authorization: Bearer dev-secret-ooty-2025" \
     -H "Content-Type: application/json" \
     -d '{
       "timestamp": "2025-01-15T10:00:00+05:30",
       "features": {"temperature": 18.5, "wind_speed": 4.2, "irradiance": 620, "humidity": 72},
       "horizon": "3h"
     }'
```

## ✅ License
Apache-2.0

Live link
https://renewable-energy-forecast-system-403592674840.us-west1.run.app/

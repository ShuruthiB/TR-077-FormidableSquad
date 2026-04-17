# ⚡ Renewable Energy Forecasting System — Multi-Location Support

A production-ready hybrid solar-wind energy forecasting system designed to work across multiple geographic locations. This system uses a stacking ensemble of XGBoost and LSTM models to provide accurate and scalable energy generation predictions.

---

## 🌍 Location Context

* **Supported Regions:** Any city or region with available weather and energy data
* **Example Deployment:** Ooty, Tamil Nadu, India
* **Energy Assets:** Solar + Wind hybrid systems (scalable to other sources)
* **Timezone:** Configurable (default: Asia/Kolkata - IST)

---

## 🚀 Key Features

* 📊 **Energy Forecasting** using hybrid ML models (LSTM + XGBoost)

* 🌐 **Multi-location support** (not limited to a single city)

* ⚡ **Energy category support**:

  * Solar ☀️
  * Wind 🌬️
  * Hydro 💧 *(extendable)*

* 📈 **Graphical Data Visualization**:

  * Time-series energy generation charts
  * Category-wise comparisons
  * Interactive dashboards

* ⏱️ **Hourly Data Updates**:

  * Real-time or simulated hourly updates
  * Continuous monitoring of energy output

* 🔍 **Prediction vs Observation Comparison**:

  * Compare **predicted energy** vs **actual observed values**
  * Helps evaluate model accuracy and performance

* 🧠 **Stacking Ensemble Model**:

  * XGBoost + LSTM + Meta-learner

* ⚙️ **Full-Stack Architecture**:

  * FastAPI backend
  * React frontend dashboard

---

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

---

## 🚀 Quick Start (Docker)

1. **Clone and Build:**

```bash
docker compose up --build
```

2. **Access the Dashboard:**
   Open http://localhost:3000

3. **Access the API Docs:**
   Open http://localhost:8000/docs

---

## 🛠 Manual Setup

### 1️⃣ Install Backend Dependencies

```bash
pip install -r requirements-backend.txt
```

### 2️⃣ Generate Sample Data

```bash
python scripts/generate_sample_data.py
```

### 3️⃣ Train Models

```bash
python scripts/train.py
```

### 4️⃣ Start Backend

```bash
uvicorn src.api.main:app --host 0.0.0.0 --port 8000
```

### 5️⃣ Start Frontend

```bash
cd src/frontend
npm install
npm run dev
```

---

## 📊 Visualization & Analytics

The system provides rich visual analytics including:

* 📉 Energy generation trends over time
* 📊 Category-wise energy distribution (Solar vs Wind vs Hydro)
* 🔄 Hourly updates of energy data
* 📌 Overlay graphs comparing:

  * Predicted values (ML output)
  * Observed/actual values

These insights help in monitoring performance and improving forecasting accuracy.

---

## 🤖 Model Architecture

* **XGBoost:** Handles structured/tabular data and short-term dependencies
* **LSTM:** Captures long-term temporal patterns in energy generation
* **Meta-Learner (Ridge Regression):** Combines predictions for improved accuracy

---

## 🌐 API Usage Examples

### 🔹 Health Check

```bash
curl http://localhost:8000/health
```

### 🔹 Single Prediction

```bash
curl -X POST http://localhost:8000/predict/single \
     -H "Authorization: Bearer dev-secret-key" \
     -H "Content-Type: application/json" \
     -d '{
       "timestamp": "2025-01-15T10:00:00+05:30",
       "features": {
         "temperature": 18.5,
         "wind_speed": 4.2,
         "irradiance": 620,
         "humidity": 72
       },
       "horizon": "3h"
     }'
```

---

## 🔮 Future Enhancements

* 🌍 Integration with real-time weather APIs
* ☁️ Cloud deployment (AWS / Azure / GCP)
* 📱 Mobile-responsive dashboard
* 🔔 Smart alerts for energy anomalies
* ⚡ Support for additional energy sources

---

## 🤝 Contributors

* Shuruthi B
* Moneca S
* Samyuktha R
* Sandhiya M

---

## 📜 License

This project is licensed under the Apache-2.0 License.

---

## ⭐ Acknowledgements

* Open-source ML libraries
* Renewable energy datasets
* Research in time-series forecasting and hybrid ML models

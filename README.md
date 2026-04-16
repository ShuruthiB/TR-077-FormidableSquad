# 🌱 Renewable Energy Forecast System

A full-stack machine learning-based web application that predicts renewable energy generation using advanced models like LSTM and XGBoost. This system helps analyze and forecast energy trends efficiently.

---

## 🚀 Features

- 📊 Energy Forecasting using ML models (LSTM & XGBoost)
- 🌐 Interactive Frontend (React + Vite + TypeScript)
- ⚙️ Backend API (FastAPI / Node.js)
- 🔐 Authentication using JWT
- 📈 Data Visualization for predictions
- 🧠 Model training and evaluation support

---

## 🏗️ Tech Stack

### Frontend
- React.js
- Vite
- TypeScript
- Tailwind CSS (if used)

### Backend
- FastAPI (Python)
- Node.js (TypeScript)

### Machine Learning
- PyTorch (LSTM)
- XGBoost
- Scikit-learn

### DevOps
- Docker & Docker Compose

---

## 📂 Project Structure
renewable-energy-forecast/
│
├── src/
│ ├── api/ # Python ML backend (FastAPI)
│ ├── components/ # React components
│ ├── pages/ # UI pages
│ └── ...
│
├── scripts/ # Training scripts
├── server.ts # Node.js server
├── docker-compose.yml # Docker setup
├── requirements-backend.txt
├── package.json
└── README.md


---

## ⚙️ Installation & Setup

### 🔹 Prerequisites
- Python 3.10 (recommended)
- Node.js (v16+)
- npm or yarn
- (Optional) Docker

---

## ▶️ Running the Project

### ✅ Method 1: Using Docker (Recommended)

```bash
docker compose up --build

### Then open:

http://localhost:3000

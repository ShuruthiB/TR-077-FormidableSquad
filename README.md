# 🌱 Renewable Energy Forecasting System

## 📌 Overview

The **Renewable Energy Forecasting System** is a full-stack application designed to predict renewable energy generation using machine learning models. It integrates a modern frontend, backend APIs, and ML components to provide accurate forecasting and visualization of energy data.

This project demonstrates the use of data science, web development, and deployment tools in a unified system.

---

## 🚀 Features

* 📊 Energy generation forecasting using Machine Learning
* ⚡ Real-time data processing via API
* 🌐 Interactive frontend dashboard
* 🧠 Model training and prediction using Python
* 🗄️ Database integration for storing energy data
* 🐳 Docker-based deployment support

---

## 🛠️ Tech Stack

### Frontend

* React (TypeScript)
* Vite
* CSS

### Backend

* Node.js (TypeScript)
* REST API

### Machine Learning

* Python
* Libraries (from `requirements.txt`)

### Database

* SQL (via `setup.sql`)

### DevOps

* Docker & Docker Compose

---

## 📁 Project Structure

```
renewable-energy-forecasting-system/
│
├── src/                # Frontend React code
├── api/                # Python backend API
├── ml/                 # Machine Learning model training
├── db/                 # Database setup scripts
├── server.ts           # Node.js backend server
├── index.html          # Entry HTML file
├── docker-compose.yml  # Docker configuration
├── package.json        # Node dependencies
└── README.md           # Project documentation
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-link>
cd renewable-energy-forecasting-system
```

---

### 2️⃣ Setup Frontend & Backend

```bash
npm install
npm run dev
```

---

### 3️⃣ Setup Python API

```bash
cd api
pip install -r requirements.txt
python main.py
```

---

### 4️⃣ Train ML Model

```bash
cd ml
python train.py
```

---

### 5️⃣ Setup Database

* Run the SQL script:

```sql
db/setup.sql
```

---

### 6️⃣ Run with Docker (Optional)

```bash
docker-compose up --build
```

---

## 📊 Usage

* Start the backend and frontend servers
* Access the application via browser (usually `http://localhost:5173`)
* Input data or use existing dataset
* View predictions and analytics on the dashboard

---

## 🔐 Environment Variables

Create a `.env` file based on `.env.example` and configure:

* Database credentials
* API keys (if any)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a Pull Request

---

## 📌 Future Enhancements

* Integration with real-time IoT sensors
* Advanced forecasting models (LSTM, XGBoost)
* Cloud deployment (AWS/GCP/Azure)
* User authentication & role management

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed as a full-stack + machine learning project for renewable energy forecasting.

---

## ⭐ Acknowledgements

* Open-source libraries and frameworks
* Machine learning community resources

---


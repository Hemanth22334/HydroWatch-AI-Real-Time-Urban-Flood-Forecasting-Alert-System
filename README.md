# Real-Time Urban Flood Forecasting and Alert System

A full-stack, machine learning-driven web application designed for real-time hydrological analysis, flood probability forecasting, live global city weather search, and visual risk alert management.

---

## 🏗️ System Architecture

```
                               ┌────────────────────────────────┐
                               │     React.js + Tailwind CSS    │
                               │        Dashboard Client        │
                               └───────────────┬────────────────┘
                                               │
                                 HTTP POST /predict-flood (CORS)
                                 HTTP GET  /fetch-city-weather
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │        Flask REST API          │
                               │      (http://127.0.0.1:5000)   │
                               └───────────────┬────────────────┘
                                               │
                                ┌──────────────┴───────────────┐
                                ▼                              ▼
                 ┌─────────────────────────────┐   ┌───────────────────────────┐
                 │ Open-Meteo Weather API      │   │ Scikit-Learn ML Model     │
                 │ (Global City Live Telemetry)│   │ (Random Forest Classifier)│
                 └─────────────────────────────┘   └───────────────────────────┘
```

---

## 📁 File Structure

```
Project/
├── backend/
│   ├── app.py                 # Flask REST API server with /predict-flood & /fetch-city-weather endpoints
│   ├── model.py               # ML Random Forest classification engine & prediction logic
│   ├── requirements.txt       # Python dependencies (flask, flask-cors, scikit-learn, numpy, joblib)
│   └── flood_model.joblib     # Pre-trained Random Forest model artifact
├── src/
│   ├── components/
│   │   ├── RiskAlertBanner.js # Dynamic Green / Yellow / Red alert banner component
│   │   ├── WeatherInputs.js   # Live City Weather Search, weather sliders & scenario presets
│   │   ├── MetricCards.js     # Telemetry metric cards summary
│   │   └── FloodDashboard.js  # Main dashboard container & state coordinator
│   ├── App.js                 # Root React entry component
│   ├── index.js               # React DOM render entry point
│   └── index.css              # Tailwind CSS directives
├── public/                    # Static assets & HTML template
├── package.json               # Node.js dependencies & scripts
├── tailwind.config.js         # Tailwind configuration
└── README.md                  # Comprehensive project documentation
```

---

## 🤖 Machine Learning Model Details

- **Algorithm**: `RandomForestClassifier` (100 Decision Trees, Max Depth 6)
- **Input Features**:
  1. `rainfall`: Rainfall intensity in mm/hour (0 to 200 mm/h)
  2. `river_level`: River gauge water level in meters (0 to 10 m)
  3. `humidity`: Relative humidity percentage (0 to 100 %)
- **Outputs**:
  - `flood_probability`: Continuous percentage score (0.0% to 100.0%)
  - `risk_level` & `alert_color`:
    - **`LOW` (GREEN)**: Probability < 35%
    - **`MODERATE` (YELLOW)**: Probability 35% to 70%
    - **`HIGH` (RED)**: Probability > 70%

---

## 🔌 API Endpoint Documentation

### 1. Flood Prediction Endpoint
- **URL**: `/predict-flood`
- **Method**: `POST` (or `GET` with query params)
- **Body Payload**: `{"rainfall": 120.0, "river_level": 7.5, "humidity": 85.0}`
- **Response**: Returns `flood_probability`, `risk_level`, `alert_color`, `status_heading`, and emergency recommendations.

### 2. Live Global City Weather Search Endpoint
- **URL**: `/fetch-city-weather?city=Mumbai`
- **Method**: `GET`
- **Response Example**:
  ```json
  {
    "status": "success",
    "data": {
      "city": "Mumbai",
      "country": "India",
      "latitude": 19.07283,
      "longitude": 72.88261,
      "rainfall_mm": 0.0,
      "humidity_pct": 89.0,
      "temperature_c": 26.2
    }
  }
  ```

### 3. Backend Health Check Endpoint
- **URL**: `/health`
- **Method**: `GET`
- **Response**: `{"status": "healthy", "service": "Real-Time Urban Flood Forecasting API"}`

---

## 🚀 How to Start the Development Servers

### Step 1: Start the Flask Backend API
```bash
cd c:\Users\USER\Desktop\Project
python backend/app.py
```
> Flask server runs on **`http://127.0.0.1:5000`**.

### Step 2: Start the React Frontend Dashboard
```bash
cd c:\Users\USER\Desktop\Project
npm start
```
> React dashboard opens on **`http://localhost:3000`**. Type any city (e.g. *"Mumbai"*, *"London"*, *"New York"*) into the search box to fetch live telemetry!

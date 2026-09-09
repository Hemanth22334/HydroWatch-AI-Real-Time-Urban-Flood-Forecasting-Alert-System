import os
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier

MODEL_FILE = os.path.join(os.path.dirname(__file__), 'flood_model.joblib')

def generate_synthetic_data(samples=1000):
    """
    Generates synthetic hydrological and meteorological dataset.
    Features:
      - rainfall: mm/hour (0 to 200)
      - river_level: meters (0 to 10)
      - humidity: percentage (0 to 100)
    """
    np.random.seed(42)
    rainfall = np.random.uniform(0, 200, samples)
    river_level = np.random.uniform(0, 10, samples)
    humidity = np.random.uniform(20, 100, samples)

    # Risk metric formula with physical intuition + random noise
    risk_score = (
        0.55 * (rainfall / 200.0) +
        0.35 * (river_level / 10.0) +
        0.10 * (humidity / 100.0) +
        np.random.normal(0, 0.05, samples)
    )

    # Class 1: Flood Event, Class 0: No Flood Event
    y = (risk_score >= 0.45).astype(int)
    X = np.column_stack((rainfall, river_level, humidity))
    return X, y

def train_and_save_model(file_path=MODEL_FILE):
    """Trains a Random Forest classifier and persists it to disk."""
    print("Generating synthetic weather dataset...")
    X, y = generate_synthetic_data(samples=1200)

    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        random_state=42
    )
    model.fit(X, y)

    joblib.dump(model, file_path)
    print(f"Model saved successfully to {file_path}")
    return model

def load_or_train_model(file_path=MODEL_FILE):
    """Loads existing model or trains a new one if missing."""
    if os.path.exists(file_path):
        try:
            return joblib.load(file_path)
        except Exception as e:
            print(f"Error loading model from {file_path}: {e}. Retraining...")
    return train_and_save_model(file_path)

def predict_flood_risk(rainfall, river_level, humidity, model=None):
    """
    Given weather features, predicts flood probability percentage and risk status.
    """
    if model is None:
        model = load_or_train_model()

    # Feature validation / clamping
    rainfall = max(0.0, float(rainfall))
    river_level = max(0.0, float(river_level))
    humidity = max(0.0, min(100.0, float(humidity)))

    features = np.array([[rainfall, river_level, humidity]])
    
    # Predict probabilities [Prob(No Flood), Prob(Flood)]
    probabilities = model.predict_proba(features)[0]
    
    # Check classes
    if len(model.classes_) > 1 and 1 in model.classes_:
        flood_idx = np.where(model.classes_ == 1)[0][0]
        prob_pct = probabilities[flood_idx] * 100.0
    else:
        prob_pct = probabilities[0] * 100.0

    prob_pct = round(float(prob_pct), 2)

    # Risk categorization
    if prob_pct < 35.0:
        risk_level = "LOW"
        alert_color = "GREEN"
        status_heading = "Low Flood Risk"
        recommendation = "Weather and water levels are currently normal. No immediate action required."
    elif prob_pct <= 70.0:
        risk_level = "MODERATE"
        alert_color = "YELLOW"
        status_heading = "Moderate Flood Alert"
        recommendation = "Elevated rainfall and river levels detected. Stay updated on localized alerts."
    else:
        risk_level = "HIGH"
        alert_color = "RED"
        status_heading = "CRITICAL FLOOD WARNING"
        recommendation = "Severe urban flood risk! Move to higher ground and secure vulnerable property immediately."

    return {
        "rainfall_mm": rainfall,
        "river_level_m": river_level,
        "humidity_pct": humidity,
        "flood_probability": prob_pct,
        "risk_level": risk_level,
        "alert_color": alert_color,
        "status_heading": status_heading,
        "recommendation": recommendation
    }

if __name__ == '__main__':
    train_and_save_model()
    # Test sample prediction
    test_result = predict_flood_risk(120.0, 7.5, 85.0)
    print("Test Prediction Output:", test_result)

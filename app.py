from flask import Flask, render_template, request, jsonify
import numpy as np
import joblib
import os
from tensorflow.keras.models import load_model as keras_load

app = Flask(__name__)

MODEL_PATH        = os.path.join("model", "model-158.keras")
SCALER_DATA_PATH  = os.path.join("model", "scaler_data.sav")
SCALER_TARGET_PATH= os.path.join("model", "scaler_target.sav")

model         = None
scaler_data   = None   
scaler_target = None   


FEATURE_NAMES = ["SEX", "AGEIR", "TC", "HDL", "SMOKE_", "BPMED", "DIAB_01"]


def load_artifacts():
    global model, scaler_data, scaler_target

    
    if not os.path.exists(MODEL_PATH):
        print(f"[WARNING] Model not found at '{MODEL_PATH}'. Running in demo mode.")
    else:
        model = keras_load(MODEL_PATH)
        print("[INFO] Keras model loaded.")

    
    if not os.path.exists(SCALER_DATA_PATH):
        print(f"[WARNING] Input scaler not found at '{SCALER_DATA_PATH}'.")
    else:
        scaler_data = joblib.load(SCALER_DATA_PATH)
        print("[INFO] Input scaler (scaler_data) loaded.")

    
    if not os.path.exists(SCALER_TARGET_PATH):
        print(f"[WARNING] Target scaler not found at '{SCALER_TARGET_PATH}'.")
    else:
        scaler_target = joblib.load(SCALER_TARGET_PATH)
        print("[INFO] Target scaler (scaler_target) loaded.")


def predict(features: list) -> dict:
    """Scale inputs → model predict → inverse-scale output → return risk %."""

    arr = np.array(features, dtype=np.float32).reshape(1, -1)

    if model is None:
       
        risk_score = float(np.random.uniform(0.5, 40.0))
    else:
        
        if scaler_data is not None:
            arr = scaler_data.transform(arr)

        
        raw_output = model.predict(arr, verbose=0)          

        
        if scaler_target is not None:
            raw_output = scaler_target.inverse_transform(
                raw_output.reshape(-1, 1)
            )

        risk_score = float(raw_output.flatten()[0])

    
    risk_score = max(0.0, min(risk_score, 100.0))

    
    if risk_score < 5:
        label    = "Low Risk"
        category = "low"
    elif risk_score < 15:
        label    = "Moderate Risk"
        category = "moderate"
    elif risk_score < 30:
        label    = "High Risk"
        category = "high"
    else:
        label    = "Very High Risk"
        category = "very-high"

    return {
        "risk_score": round(risk_score, 1),
        "label":      label,
        "category":   category,
    }




@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict_route():
    try:
        data     = request.get_json()
        features = [float(data[f]) for f in FEATURE_NAMES]
        result   = predict(features)
        return jsonify({"success": True, **result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


if __name__ == "__main__":
    load_artifacts()
    app.run(debug=True)

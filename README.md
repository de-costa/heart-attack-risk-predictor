# 🫀 CardioScan — Heart Attack Risk Predictor

A deep learning web application that predicts **Cardiovascular risk percentage** using a trained neural network model. Built with Flask and TensorFlow/Keras.

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0-black?logo=flask)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange?logo=tensorflow)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📸 Preview

> A clean, dark-themed medical UI with animated ECG line, circular risk score gauge, and 4-zone risk bar.

---

## 🧠 Model Overview

| Property | Details |
|----------|---------|
| Type | Neural Network (Regression) |
| Framework | TensorFlow / Keras |
| Input Features | 7 clinical parameters |
| Output | Cardiovascular risk % |
| Error Rate | ~1.5% MAE |

---

## 📊 Dataset Features

| Feature | Description | Values |
|---------|-------------|--------|
| `SEX` | Patient sex | 1 = Male, 0 = Female |
| `AGEIR` | Age | years |
| `TC` | Total Cholesterol | mg/dL |
| `HDL` | HDL Cholesterol | mg/dL |
| `SMOKE_` | Current smoker | 1 = Yes, 0 = No |
| `BPMED` | Taking BP medication | 1 = Yes, 0 = No |
| `DIAB_01` | Diabetes | 1 = Yes, 0 = No |
| `RISK` *(target)* | Cardiovascular risk | % (0–40) |

---

## 🗂️ Project Structure

```
heart_attack_predictor/
├── app.py                  ← Flask backend
├── README.md
├── model/
│   ├── heart_model.keras   ← Trained Keras model   
│   ├── scaler_data.sav     ← Input feature scaler  
│   └── scaler_target.sav   ← Target scaler     
├── templates/
│   └── index.html          ← Frontend UI
└── static/
    ├── css/style.css
    └── js/main.js
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/heart-attack-risk-predictor.git
cd heart-attack-risk-predictor
```

### 2. Install dependencies

### 3. Add your model files
Place these 3 files inside the `model/` folder:
```
model/heart_model.keras
model/scaler_data.sav
model/scaler_target.sav
```

### 4. Run the app
```bash
python app.py
```

Open your browser at **http://127.0.0.1:5000**

---

## 🔬 Prediction Pipeline

```
Raw user input (7 features)
        ↓
scaler_data.transform()       — normalize to training scale
        ↓
model.predict()               — neural network inference
        ↓
scaler_target.inverse_transform()  — convert back to real RISK %
        ↓
Risk score + category displayed
```

---

## 🎯 Risk Categories

| Score | Category | Color |
|-------|----------|-------|
| < 5% | 🟢 Low Risk | Green |
| 5–15% | 🟡 Moderate Risk | Yellow |
| 15–30% | 🟠 High Risk | Orange |
| > 30% | 🔴 Very High Risk | Red |

---

## 🧪 Test in Jupyter Notebook

```python
import numpy as np
import joblib
from tensorflow.keras.models import load_model

model         = load_model("model/heart_model.keras")
scaler_data   = joblib.load("model/scaler_data.sav")
scaler_target = joblib.load("model/scaler_target.sav")

# SEX, AGEIR, TC, HDL, SMOKE_, BPMED, DIAB_01
sample = np.array([[1, 48, 236, 66, 0, 1, 0]])

scaled     = scaler_data.transform(sample)
raw_out    = model.predict(scaled)
risk_score = scaler_target.inverse_transform(raw_out.reshape(-1, 1))

print(f"Risk Score: {float(risk_score[0][0]):.1f}%")
```

---

## 📦 Requirements

```
flask>=3.0
numpy>=1.24
tensorflow>=2.13
joblib>=1.3
scikit-learn>=1.3
```

---

## ⚠️ Disclaimer

This tool is for **educational and informational purposes only**.  
It is **not** a substitute for professional medical advice, diagnosis, or treatment.  
Always consult a qualified healthcare provider.

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 🙋 Author

**Your Name**  
GitHub: [@Saumya De Costa](https://github.com/de-costa)

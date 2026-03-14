import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

data = pd.read_csv("api_traffic.csv")

model = Pipeline([
    ("scaler", StandardScaler()),
    ("model", IsolationForest(contamination=0.05, random_state=42))
])

model.fit(data)

joblib.dump(model, "isolation_pipeline.pkl")
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

class Features(BaseModel):
    ip_request_rate: float
    method_encoded: int
    avg_time_between_requests: float
    unique_endpoints: float
    is_sensitive_endpoint: int

app = FastAPI()

model = joblib.load("isolation_pipeline.pkl")

origins = [
    "http://localhost:3000",
    "http://localhost:5000",
    "https://yourdomain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ML service running"}

@app.post("/predict")
def handle_req(features: Features):

    X = pd.DataFrame([{
        "ip_request_rate": features.ip_request_rate,
        "method_encoded": features.method_encoded,
        "avg_time_between_requests": features.avg_time_between_requests,
        "unique_endpoints": features.unique_endpoints,
        "is_sensitive_endpoint": features.is_sensitive_endpoint
    }])
       
    anomaly_score = model.decision_function(X)[0] 

    threshold = 0.02

    attack = anomaly_score < threshold

    return {
        "attack": bool(attack),  
        "anomaly_score": float(anomaly_score)    
    }
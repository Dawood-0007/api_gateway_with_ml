import pandas as pd
import numpy as np

rows = 50000
data = []

for _ in range(rows):

    if np.random.rand() < 0.90:

        ip_request_rate = np.random.randint(1, 15)
        method_encoded = np.random.choice([0, 1])
        avg_time_between_requests = round(np.random.uniform(0.5, 5.0), 3)
        unique_endpoints = np.random.randint(1, 8)
        is_sensitive_endpoint = np.random.choice([0, 1])

    else:

        ip_request_rate = np.random.randint(20, 200)
        method_encoded = np.random.choice([0, 1, 2, 3])
        avg_time_between_requests = round(np.random.uniform(0.01, 0.2), 3)
        unique_endpoints = np.random.randint(1, 2)
        is_sensitive_endpoint = np.random.choice([0, 1])

    data.append([
        ip_request_rate,
        method_encoded,
        avg_time_between_requests,
        unique_endpoints,
        is_sensitive_endpoint
    ])

df = pd.DataFrame(
    data,
    columns=[
        "ip_request_rate",
        "method_encoded",
        "avg_time_between_requests",
        "unique_endpoints",
        "is_sensitive_endpoint"
    ]
)

df.to_csv("api_traffic.csv", index=False)

print("Dataset generated: api_traffic.csv")
print("Rows:", len(df))
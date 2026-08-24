# API Gateway with ML

An intelligent, scalable API Gateway with real-time anomaly detection using Machine Learning (Isolation Forest).

---

# Features

- Centralized API routing and management
- Real-time anomaly detection using Isolation Forest
- Separate Python ML microservice with FastAPI
- Next.js Admin Dashboard for monitoring
- PostgreSQL database for logs and metrics
- Full Docker support with Docker Compose
- Rate limiting, authentication, and logging
- Supports both Docker and Non-Docker setups

---

# Tech Stack

| Technology | Usage |
|------------|-------|
| Next.js | Frontend Dashboard |
| Node.js + Express.js | API Gateway |
| Python + FastAPI | ML Microservice |
| Isolation Forest | Anomaly Detection |
| PostgreSQL | Database |
| Docker & Docker Compose | Containerization |

---

#  Setup Instructions

## 1. Clone the Repository

```bash
git clone https://github.com/Dawood-0007/api_gateway_with_ml.git
cd api_gateway_with_ml
```

Create a .env file in frontend and in backend using .env.example given in both folder.

---

# Non-Docker Setup

## Frontend (Next.js)

```bash
cd apps/dashboard
npm install
npm run dev
```

---

## API Gateway (Node.js)

```bash
cd services/gateway
npm install
npm run devStart
```

---

## ML Service (Python FastAPI)

```bash
cd services/ml-service
pip install -r requirements.txt
fastapi dev service.py
```

---

# Database Setup & Prisma Migration

This project uses **PostgreSQL** with **Prisma ORM** for database management and migrations.

---

# Prisma Setup (Non-Docker)

## 1. Configure Environment Variables

Create a `.env` file inside `services/gateway/`.

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/api_gateway_db"
```

---

## 2. Install Dependencies

```bash
cd services/gateway
npm install
```

---

## 3. Run Prisma Migration

```bash
npx prisma migrate dev --name init
```

This command will:

- Create database tables
- Apply migrations
- Generate Prisma Client

---

## 4. Generate Prisma Client

```bash
npx prisma generate
```

---

## 5. Open Prisma Studio (Optional)

```bash
npx prisma studio
```

Prisma Studio provides a GUI to view and manage database records.

---

# Docker Setup (Recommended)

## Start Containers

```bash
docker-compose -f infra/docker-compose.yml up --build
```

## Detached Mode

```bash
docker-compose -f infra/docker-compose.yml up -d --build
```

---

## 2. Run Prisma Migration Inside Container

```bash
docker exec -it gateway_backend npx prisma migrate dev --name init
```

---

## 3. Generate Prisma Client

```bash
docker exec -it gateway_backend npx prisma generate
```

---

## 4. Open Prisma Studio

```bash
docker exec -it gateway_backend npx prisma studio
```

---

# Important Paths

| Path | Description |
|------|-------------|
| `apps/dashboard/` | Frontend Dashboard |
| `services/gateway/` | Node.js API Gateway |
| `services/ml-service/service.py` | ML Service |
| `infra/docker-compose.yml` | Docker Compose Configuration |

---

# Machine Learning

The ML microservice uses an **Isolation Forest** model to detect anomalous API requests in real-time.

The system can analyze:

- Request frequency
- Payload size
- Response time
- Traffic patterns
- API usage behavior

This helps identify suspicious or abnormal requests efficiently.

---

# Security Features

- Rate Limiting
- Authentication & Authorization
- Request Logging
- API Monitoring
- Real-time Threat Detection

---

# Dashboard Features

The Next.js Admin Dashboard provides:

- API request monitoring
- Real-time anomaly alerts
- Request statistics
- Logs and metrics visualization
- System health overview

---

# Testing Methods

You can test your api via postman or REST client by IDE extension.

client.rest file conntains some testing endpoints but require the REST client extenstion to be installed in your respective IDE.

---

# Contributing

Contributions are welcome!

Feel free to:

- Fork the repository
- Create a feature branch
- Submit pull requests
- Report bugs or suggest improvements

---

# Show Your Support

If you find this project useful, please give it a star ⭐ on GitHub!

---

# Contact

## Dawood Khatri

Software Developer & CS Student

- GitHub: [Dawood-0007](https://github.com/Dawood-0007)
- LinkedIn: [Dawood Khatri](https://linkedin.com/in/dawood-khatri)
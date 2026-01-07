🚀 Getting Started

1️⃣ Clone Repository

    git clone <repo-url>
    cd backend

2️⃣ Configure Environment

    cp .env.example .env

    Update values as needed.

3️⃣ Run with Docker

    cd docker
    docker compose up -d --build

    Services started:

    API Server

    Job Worker

    PostgreSQL

    MongoDB

    Redis

    Kafka + Zookeeper

# 🔍 API Documentation

    REST APIs follow API-first design

    Versioned routes: /api/v1/docs

    Swagger supported

# Start Application

    npm run build

# Run in Docker

    docker compose down -v
    docker system prune -af
    docker compose build --no-cache
    docker compose up -d

# To start server locally

    Remove-Item dist -Recurse -Force
    npx prisma generate
    npm run build
    npm run start

# To check Running state of the services

    docker ps ------> it will only show currently running state
    docker ps -a -------> it will also list the exited state if any

# Run build and Test step by step ensure this steps to be followed

    Remove-Item dist -Recurse -Force
    Remove-Item node_modules\.cache -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item node_modules\.prisma -Recurse -Force -ErrorAction SilentlyContinue

    npx jest --clearCache
    npx prisma generate

    npm run build
    npm test
    npm run test:coverage

# To verify run this in order

    Remove-Item dist -Recurse -Force
    npx jest --clearCache
    npx prisma generate
    npm run build
    npm test

### ▶️ How to USE this Postman collection

1.Start Docker

    docker-compose up --build

2.Import Postman collection

    Environment JSON
    Collection JSON

3.Select environment → RTCW-Local-Docker

4.Run APIs in order

    Auth → Workspace → Project →  activity → Job

5.Watch:

    api logs → Kafka api (command: docker logs api)
    Worker logs → Kafka job processed (command: docker logs worker)
    Mongo → activity logs
    Redis → RBAC cache

===============================================================================================================================================================

### 🧠 Real-Time Collaborative Workspace (Backend)

    A production-grade backend system built with Clean Architecture, Kafka-based async processing, RBAC authorization, and CI/CD — designed to reflect real-world engineering standards.

## 🚀 Features

    🔐 JWT Authentication (Access + Refresh tokens)

    🧩 Role-Based Access Control (RBAC)

    🏢 Multi-workspace collaboration

    📨 Event-driven architecture (Kafka)

    🔁 Job retry, backoff & idempotency

    📊 Audit logs via async jobs

    🧪 Unit & Integration testing (70%+ coverage)

    🐳 Dockerized services

    🔄 CI pipeline with GitHub Actions

    📘 Swagger API Documentation

# 🏗 Architecture

    Clean Architecture

    Domain-driven structure

    Event-driven (Kafka)

    Stateless API + Background Workers

# 🧰 Tech Stack

    Backend: Node.js, TypeScript, Express

    Database: PostgreSQL (Prisma ORM), MongoDB

    Cache: Redis

    Messaging: Kafka (KafkaJS)

    ogs: MongoDB

    Auth: JWT

    Docs: Swagger

    DevOps: Docker, GitHub Actions

# ⚙️ Setup Instructions

    1️⃣ Clone repository
        git clone https://github.com/<your-username>/real-time-collaborative-workspace.git
        cd backend

    2️⃣ Environment variables

        Copy example env:

        cp .env.example .env

        Fill required values:

            NODE_ENV=
            PORT=
            DATABASE_URL=
            REDIS_URL=
            MONGO_URL=
            KAFKA_BROKER=
            JWT_SECRET=
            JWT_REFRESH_SECRET=

### ▶️ Running the Application

# 🧪 Local (Dev)

    npm install
    npm run dev

    Kafka Worker:

    npm run worker:dev

# 🐳 Docker (Recommended)

    cd docker
    docker-compose up --build

# 🧪 Testing

    npm run test
    npm run test:coverage

# 📘 API Documentation

    Swagger UI:

    http://localhost:4000/docs

# 🔄 CI Pipeline

    GitHub Actions pipeline runs on every push:

        ✅ Install dependencies

        ✅ Run tests

        ✅ Build project

    File:

        backend/.github/workflows/backend-ci.yml

# 🚀 Deployment

    Deployed using Railway / Render with:

        Docker

        Managed PostgreSQL

        Managed Redis

        Managed Kafka

        Managed MongoDB

# 📦 Postman Collection

    Located at:

    /postman/Real-Time-Collaborative-Workspace.postman_collection.json

    Includes:

        Auth

        Projects

        Workspace

        RBAC

        Jobs (Kafka)

# 🎯 Roadmap ( Yet to Achieve )

    Frontend (Next.js + Socket.IO)

    Realtime presence & cursor sync

    Kubernetes manifests

# 👨‍💻 Author

Akshay Prajapati
Backend Engineer (Node.js, Distributed Systems)

### ✅ WHAT YOU HAVE ACHIEVED (IMPORTANT)

    ✔ Clean Architecture

    ✔ Event-driven system

    ✔ Kafka retry & idempotency

    ✔ RBAC done correctly

    ✔ CI/CD pipeline

    ✔ Dockerized production app

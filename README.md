# MediVantage — Backend API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-20-2496ED?style=flat-square&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

> REST API powering the MediVantage AI-driven healthcare platform. Handles authentication, appointments, prescriptions, AI symptom analysis, and real-time notifications.

---

## 🔗 Links

| Resource               | URL                                                    |
| ---------------------- | ------------------------------------------------------ |
| 🌐 Live Application    | https://medivantage.vercel.app                         |
| 📦 Frontend Repository | https://github.com/habib-web-dev1/medivantage-frontend |
| 🔧 Backend Repository  | https://github.com/habib-web-dev1/medivantage-backend  |

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Deployment](#deployment)
- [Scripts](#scripts)

---

## Features

- **JWT Authentication** — Access tokens (15 min) + HttpOnly refresh cookies (7 days) with silent token rotation
- **Role-Based Access Control** — Three roles: `patient`, `doctor`, `admin` with route-level guards
- **Appointment Booking** — Full lifecycle management: pending → confirmed → completed/cancelled
- **AI Symptom Engine** — Probabilistic disease matching from reported symptoms
- **PDF Prescriptions** — Server-side PDF generation with jsPDF (serverless-compatible)
- **Real-time Notifications** — Socket.io integration for live appointment and prescription events
- **Medicine & Disease Catalog** — Searchable, paginated REST endpoints
- **Admin Dashboard API** — User management, doctor verification, platform analytics

---

## Tech Stack

| Layer          | Technology                           |
| -------------- | ------------------------------------ |
| Runtime        | Node.js 20+                          |
| Language       | TypeScript 5                         |
| Framework      | Express 5                            |
| Database       | MongoDB Atlas via Mongoose 9         |
| Auth           | JWT (jsonwebtoken) + bcryptjs        |
| Real-time      | Socket.io 4                          |
| PDF Generation | jsPDF (serverless-safe)              |
| Cloud Storage  | Cloudinary (optional)                |
| Validation     | Zod                                  |
| Testing        | Jest + Supertest                     |
| Containerize   | Docker (multi-stage, Node 20 Alpine) |
| CI/CD          | GitHub Actions                       |
| Deployment     | Vercel (serverless)                  |

---

## Project Structure

```
medivantage-backend/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD pipeline
├── src/
│   ├── app.ts                  # Express app — CORS, middleware, routes
│   ├── server.ts               # HTTP server + Socket.io bootstrap
│   ├── config/
│   │   └── db.ts               # MongoDB connection with serverless caching
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── prescription.controller.ts
│   │   ├── medicine.controller.ts
│   │   ├── disease.controller.ts
│   │   ├── engine.controller.ts
│   │   └── admin.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts  # verifyToken + restrictTo
│   │   └── error.middleware.ts # Centralised error handler
│   ├── models/
│   │   ├── User.ts
│   │   ├── Appointment.ts
│   │   ├── Medicine.ts
│   │   └── Disease.ts
│   ├── routes/
│   │   ├── index.ts            # Root API router
│   │   ├── auth.routes.ts
│   │   ├── patient.routes.ts
│   │   ├── doctor.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── medicine.routes.ts
│   │   ├── disease.routes.ts
│   │   └── engine.routes.ts
│   ├── services/
│   │   ├── pdfGenerator.ts     # jsPDF prescription builder
│   │   └── cloudStorage.ts     # Cloudinary upload
│   ├── scripts/
│   │   └── seed.ts             # Database seed script
│   ├── templates/
│   │   └── prescription.html   # Prescription layout reference
│   ├── types/
│   │   └── express.d.ts        # req.user type augmentation
│   └── utils/
│       └── helpers.ts          # AppError, asyncHandler, token generators
├── Dockerfile                  # Multi-stage production Docker image
├── vercel.json
├── render.yaml
├── jest.config.js
├── tsconfig.json
└── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/habib-web-dev1/medivantage-backend.git
cd medivantage-backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your values

# Seed the database with demo data
npm run seed

# Start the development server
npm run dev
```

The API will be available at `http://localhost:5000`.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/medivantage

# JWT — generate with: node -e "require('crypto').randomBytes(64).toString('hex')"
JWT_SECRET=your_64_byte_hex_secret
JWT_REFRESH_SECRET=your_different_64_byte_hex_secret

# CORS
FRONTEND_URL=http://localhost:3000

# Backend public URL (used in PDF download links)
BACKEND_URL=http://localhost:5000

# Cloudinary (optional — prescriptions fall back to DB storage without it)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**For Vercel deployment**, set all variables in the Vercel dashboard under **Settings → Environment Variables**. The `.env` file is gitignored and never deployed.

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint         | Access | Description                     |
| ------ | ---------------- | ------ | ------------------------------- |
| `POST` | `/auth/register` | Public | Register a new user             |
| `POST` | `/auth/login`    | Public | Login and receive tokens        |
| `POST` | `/auth/refresh`  | Public | Refresh access token via cookie |
| `POST` | `/auth/logout`   | Public | Clear refresh token cookie      |

### Appointments

| Method  | Endpoint                                         | Access  | Description                  |
| ------- | ------------------------------------------------ | ------- | ---------------------------- |
| `GET`   | `/patient/appointments`                          | Patient | List own appointments        |
| `POST`  | `/patient/appointments`                          | Patient | Book a new appointment       |
| `PATCH` | `/patient/appointments/:id/status`               | Patient | Cancel an appointment        |
| `GET`   | `/doctor/appointments`                           | Doctor  | List own appointments        |
| `GET`   | `/doctor/appointments/:id`                       | Doctor  | Get single appointment       |
| `PATCH` | `/doctor/appointments/:id/status`                | Doctor  | Confirm / decline / complete |
| `POST`  | `/doctor/appointments/:id/prescription`          | Doctor  | Issue a prescription         |
| `GET`   | `/doctor/appointments/:id/prescription/download` | Auth    | Download prescription PDF    |

### Medicines & Diseases

| Method | Endpoint          | Access | Description                            |
| ------ | ----------------- | ------ | -------------------------------------- |
| `GET`  | `/medicines`      | Public | List medicines (paginated, searchable) |
| `GET`  | `/medicines/:id`  | Public | Get medicine by ID                     |
| `GET`  | `/diseases`       | Auth   | List diseases                          |
| `POST` | `/engine/analyze` | Auth   | AI symptom analysis                    |

### Doctors

| Method | Endpoint   | Access | Description           |
| ------ | ---------- | ------ | --------------------- |
| `GET`  | `/doctors` | Public | List verified doctors |

### Admin

| Method   | Endpoint                    | Access | Description               |
| -------- | --------------------------- | ------ | ------------------------- |
| `GET`    | `/admin/stats`              | Admin  | Platform statistics       |
| `GET`    | `/admin/users`              | Admin  | List all users            |
| `PATCH`  | `/admin/users/:id/status`   | Admin  | Toggle user active status |
| `PATCH`  | `/admin/doctors/:id/verify` | Admin  | Verify a doctor           |
| `POST`   | `/admin/medicines`          | Admin  | Create medicine           |
| `PUT`    | `/admin/medicines/:id`      | Admin  | Update medicine           |
| `DELETE` | `/admin/medicines/:id`      | Admin  | Delete medicine           |

---

## Docker

The backend ships with a **2-stage Dockerfile** optimised for production:

| Stage     | Base Image     | Purpose                                           |
| --------- | -------------- | ------------------------------------------------- |
| `builder` | node:20-alpine | Install all deps + compile TypeScript to `dist/`  |
| `runner`  | node:20-alpine | Install prod-only deps, copy compiled output, run |

The final image runs as a **non-root user** and contains no source `.ts` files or dev dependencies.

### Build & run locally

```bash
# Build the image
docker build -t medivantage-backend .

# Run the container (pass your .env variables)
docker run -p 5000:5000 --env-file .env medivantage-backend
```

The API will be available at `http://localhost:5000`.

### Run with Docker Compose

From the repository root (alongside the frontend):

```bash
docker compose up --build
```

---

## CI/CD

Continuous integration and delivery is handled by **GitHub Actions** (`.github/workflows/ci.yml`).

### Pipeline overview

```
push to main / develop  ──►  test-build  ──►  docker  (main only)
pull_request to main    ──►  test-build
```

### Jobs

#### `test-build` — runs on every push and PR

| Step                 | Description                            |
| -------------------- | -------------------------------------- |
| Checkout repository  | `actions/checkout@v4`                  |
| Setup Node.js 20     | `actions/setup-node@v4` with npm cache |
| Install dependencies | `npm ci`                               |
| Build project        | `npm run build` — compiles TypeScript  |
| Run tests            | `npm test` with `NODE_ENV=test`        |

#### `docker` — runs on push to `main` only (after `test-build` passes)

| Step                | Description                                              |
| ------------------- | -------------------------------------------------------- |
| Setup Docker Buildx | Enables multi-platform and layer cache support           |
| Login to Docker Hub | Uses `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN` secrets    |
| Build & push image  | Pushes `medivantage-backend:latest` and `:<git-sha>` tag |

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret               | Description                          |
| -------------------- | ------------------------------------ |
| `DOCKERHUB_USERNAME` | Your Docker Hub username             |
| `DOCKERHUB_TOKEN`    | Docker Hub access token (read/write) |

The Docker image is published to:

```
<DOCKERHUB_USERNAME>/medivantage-backend:latest
<DOCKERHUB_USERNAME>/medivantage-backend:<git-sha>
```

---

## Deployment

### Vercel (Recommended)

The project is pre-configured for Vercel via `vercel.json`.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set all required environment variables in the Vercel dashboard before deploying.

### Docker (Self-hosted)

```bash
# Pull the latest image from Docker Hub
docker pull <DOCKERHUB_USERNAME>/medivantage-backend:latest

# Run with environment variables
docker run -d -p 5000:5000 --env-file .env \
  --name medivantage-backend \
  <DOCKERHUB_USERNAME>/medivantage-backend:latest
```

### Render

Import `render.yaml` via the Render dashboard. Set `MONGO_URI` and `FRONTEND_URL` manually in the service environment.

---

## Database Seed

The seed script populates the database with demo data:

- **50 medicines** across 8 categories
- **30 diseases** with symptom mappings and suggested medications
- **10 verified doctors** across all specializations
- **1 demo patient** account

```bash
npm run seed
```

---

## Scripts

```bash
npm run dev        # Start dev server with hot reload (nodemon)
npm run build      # Compile TypeScript to dist/
npm run start      # Run compiled production build
npm run seed       # Seed the database with demo data
npm run test       # Run Jest test suite
npm run test:watch # Run Jest in watch mode
```

---

## 📄 License

This project is for portfolio and demonstration purposes.

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/habib-web-dev1">habib-web-dev1</a>
</div>

# MediVantage — Backend API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

> REST API powering the MediVantage AI-driven healthcare platform. Handles authentication, appointments, prescriptions, AI symptom analysis, and real-time notifications.

**Live API:** `https://medivantage-backend.vercel.app`
**Health check:** [`/api/v1/health`](https://medivantage-backend.vercel.app/api/v1/health)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Seeding](#database-seeding)
- [Deployment](#deployment)

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

| Layer          | Technology                    |
| -------------- | ----------------------------- |
| Runtime        | Node.js 20+                   |
| Language       | TypeScript 5                  |
| Framework      | Express 5                     |
| Database       | MongoDB Atlas via Mongoose 9  |
| Auth           | JWT (jsonwebtoken) + bcryptjs |
| Real-time      | Socket.io 4                   |
| PDF Generation | jsPDF (serverless-safe)       |
| Cloud Storage  | Cloudinary (optional)         |
| Validation     | Zod                           |
| Testing        | Jest + Supertest              |
| Deployment     | Vercel (serverless)           |

---

## Project Structure

```
medivantage-backend/
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
├── vercel.json
├── Dockerfile
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
git clone https://github.com/your-username/medivantage-backend.git
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

## Database Seeding

The seed script populates the database with:

- **50 medicines** across 8 categories
- **30 diseases** with symptom mappings and suggested medications
- **10 verified doctors** across all specializations
- **1 demo patient** account

```bash
npm run seed
```

**Demo credentials after seeding:**

| Role    | Email                           | Password      |
| ------- | ------------------------------- | ------------- |
| Admin   | `admin@gmail.com`               | `Admin123`    |
| Doctor  | `sarah.jenkins@medivantage.com` | `Doctor@1234` |
| Patient | `patient@gmail.com`             | `Patient123`  |

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

### Docker

```bash
docker build -t medivantage-backend .
docker run -p 5000:5000 --env-file .env medivantage-backend
```

### Render

Import `render.yaml` via the Render dashboard. Set `MONGO_URI` and `FRONTEND_URL` manually in the service environment.

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

## License

ISC

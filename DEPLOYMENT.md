# Deployment Guide — Expense Tracker

Full-stack expense tracker: Spring Boot backend + React/Vite frontend.

## Architecture

```
Vercel (frontend)  ──HTTPS──▶  Render (Spring Boot API)  ──▶  Render PostgreSQL
```

---

## 1. Prerequisites

- GitHub repo: `https://github.com/Mahak-10/Expense-Tracker.git`
- [Render](https://render.com) account (free tier)
- [Vercel](https://vercel.com) account (free tier)
- Local: Java 17+, Maven, Node 18+, PostgreSQL (optional for local dev)

---

## 2. Local development

### Backend

```bash
cd application
# Set env vars or use defaults in application.properties
set JAVA_HOME=C:\Program Files\Java\jdk-17
mvn spring-boot:run
```

API: `http://localhost:8080`

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

UI: `http://localhost:5173`

### Docker (backend + PostgreSQL)

```bash
docker compose up --build
```

---

## 3. Deploy backend to Render

### Option A — Blueprint (recommended)

1. Push this repo to GitHub.
2. In Render Dashboard → **New** → **Blueprint**.
3. Connect your GitHub repo — Render reads `render.yaml`.
4. Creates:
   - PostgreSQL database: `expense-tracker-db`
   - Web service: `expense-tracker-api`
5. After deploy, open the web service → **Environment** and set:

   ```
   CORS_ALLOWED_ORIGINS=https://YOUR-VERCEL-APP.vercel.app
   ```

6. Copy your Render API URL, e.g. `https://expense-tracker-api.onrender.com`

### Option B — Manual

1. **New PostgreSQL** → name `expense-tracker-db`, plan Free.
2. **New Web Service** → connect repo, set:
   - **Root Directory:** leave blank
   - **Runtime:** Docker
   - **Dockerfile Path:** `./application/Dockerfile`
   - **Docker Context:** `./application`
   - **Health Check Path:** `/health`
3. **Environment variables:**

   | Key | Value |
   |-----|-------|
   | `PORT` | `8080` |
   | `DATABASE_URL` | *(link from PostgreSQL → Internal Connection String)* |
   | `DDL_AUTO` | `update` |
   | `SHOW_SQL` | `false` |
   | `CORS_ALLOWED_ORIGINS` | `https://YOUR-VERCEL-APP.vercel.app` |

---

## 4. Deploy frontend to Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repo.
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment variable:**

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://expense-tracker-api.onrender.com` |

5. Deploy. Copy your Vercel URL, e.g. `https://expense-tracker.vercel.app`.

6. Go back to Render → update `CORS_ALLOWED_ORIGINS` with your Vercel URL → redeploy backend.

---

## 5. Verify deployment

```bash
# Health check
curl https://expense-tracker-api.onrender.com/health

# Categories
curl https://expense-tracker-api.onrender.com/category/get/categories

# Add category
curl -X POST https://expense-tracker-api.onrender.com/category/add/category \
  -H "Content-Type: application/json" \
  -d '{"categoryName":"Food"}'
```

Open your Vercel URL → Dashboard should load stats and charts.

---

## 6. Expected URLs

| Service | URL |
|---------|-----|
| Backend API | `https://expense-tracker-api.onrender.com` |
| Frontend | `https://YOUR-PROJECT.vercel.app` |
| Health | `https://expense-tracker-api.onrender.com/health` |

> Render free tier spins down after inactivity — first request may take ~30s.

---

## 7. Environment variables reference

See [`.env.example`](.env.example) for all variables.

---

## 8. Build verification

```bash
cd application
mvn clean package
# JAR: target/application-0.0.1-SNAPSHOT.jar

cd ../frontend
npm run build
# Output: dist/
```

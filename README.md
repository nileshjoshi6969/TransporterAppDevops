# 🚚 Transporter App — DevOps Mini Project

> A logistics transport booking REST API built with Node.js + Express, deployed via a full CI/CD pipeline using GitHub Actions.

---

## 1. Project Title

**Transporter App** — Real-time transport booking system with automated DevOps pipeline.

---

## 2. Problem Statement

Logistics companies need a reliable system to manage transport bookings (routes, vehicles, drivers). Manually deploying updates is error-prone and slow. This project solves that by:

- Building a **Node.js REST API** for transport bookings
- Automating the entire **Build → Test → Security → Docker → Deploy** lifecycle
- Ensuring **zero-downtime deployments** via GitHub Actions + Render

---

## 3. Architecture Diagram

```
Developer Push
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│                   GitHub Actions Pipeline                    │
│                                                             │
│  ┌─────────┐   ┌──────────┐   ┌────────────┐              │
│  │  BUILD  │──▶│   TEST   │──▶│  SECURITY  │              │
│  │ npm ci  │   │  Jest +  │   │ npm audit  │              │
│  │ syntax  │   │ Coverage │   │            │              │
│  └─────────┘   └──────────┘   └─────┬──────┘              │
│                                      │                      │
│                               ┌──────▼──────┐              │
│                               │   DOCKER    │              │
│                               │ Build+Push  │              │
│                               │  Docker Hub │              │
│                               └──────┬──────┘              │
│                                      │                      │
│                               ┌──────▼──────┐              │
│                               │   DEPLOY    │              │
│                               │   Render    │              │
│                               └─────────────┘              │
└─────────────────────────────────────────────────────────────┘
                                      │
                               ┌──────▼──────┐
                               │  LIVE APP   │
                               │ render.com  │
                               └─────────────┘
```

---

## 4. CI/CD Pipeline Explanation

The pipeline is defined in `.github/workflows/ci.yml` and has **6 stages**:

| Stage | Job Name | What it does |
|-------|----------|-------------|
| 1 | **Build** | Checkout code, setup Node 18, `npm ci`, syntax check, cache npm |
| 2 | **Test** | Run all Jest tests with coverage report |
| 3 | **Security** | `npm audit` for known vulnerabilities |
| 4 | **Docker** | Build multi-stage Docker image, push to Docker Hub |
| 5 | **Deploy** | Trigger Render deploy hook via `curl` |
| 6 | **Notify** | Always-runs summary of pipeline result |

### Pipeline Triggers
- **Push** to `main` → Full pipeline runs
- **Pull Request** to `main` → Build + Test + Security only

### Optimizations (Enhancement Features)
- `npm cache` via `actions/setup-node` — faster builds
- Multi-stage Dockerfile — smaller production image
- `needs:` dependency chain — jobs only run if previous succeeded
- `if: always()` on notify job — always reports outcome

---

## 5. Git Workflow

```
main (protected)
  │
  ├── feature/devops-enhancement   ← initial setup
  ├── feature/ci-pipeline          ← GitHub Actions workflow
  └── feature/docker-deployment    ← Dockerfile + compose
```

**Branch Strategy:**
1. Create feature branch from `main`
2. Make commits (minimum 5)
3. Open Pull Request → pipeline runs on PR
4. Merge to `main` → full deploy pipeline runs

### Commits to Make
```bash
git checkout -b feature/devops-enhancement
git add app/ package.json
git commit -m "feat: add Express transporter API with CRUD endpoints"

git add tests/
git commit -m "test: add Jest unit tests for all API routes"

git add .github/
git commit -m "ci: add GitHub Actions pipeline (build/test/security/deploy)"

git add Dockerfile docker-compose.yml
git commit -m "docker: add multi-stage Dockerfile and compose config"

git add README.md
git commit -m "docs: add full README with architecture and pipeline docs"

git push origin feature/devops-enhancement
# Open PR → merge to main
```

---

## 6. Tools Used

| Tool | Purpose |
|------|---------|
| **Node.js 18** | Runtime |
| **Express.js** | REST API framework |
| **Jest + Supertest** | Unit & integration testing |
| **GitHub Actions** | CI/CD automation |
| **Docker** | Containerization |
| **Docker Hub** | Container registry |
| **Render** | Cloud deployment |
| **GitHub Secrets** | Secure credential management |

---

## 7. Screenshots

> *(Add these after running your pipeline)*

### Pipeline Success
![Pipeline Screenshot](docs/pipeline-success.png)

### Deployment Output
![Deployment Output](docs/deployment-output.png)

---

## 8. GitHub Secrets Configuration

Go to: **GitHub → Your Repo → Settings → Secrets → Actions**

Add these secrets:

| Secret Name | Description |
|-------------|-------------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub access token |
| `RENDER_DEPLOY_HOOK_URL` | Webhook URL from Render dashboard |

> ⚠️ **NEVER** hardcode credentials in code. Always use `${{ secrets.SECRET_NAME }}`.

---

## 9. Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/transporter-app.git
cd transporter-app

# Install dependencies
npm install

# Run locally
npm start
# → http://localhost:3000

# Run with Docker
docker-compose up --build

# Run tests
npm test
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/bookings` | List all bookings |
| POST | `/api/bookings` | Create new booking |
| GET | `/api/bookings/:id` | Get booking by ID |
| PATCH | `/api/bookings/:id/status` | Update status |
| DELETE | `/api/bookings/:id` | Delete booking |

---

## 10. Deployment (Render - Free Cloud)

1. Go to [render.com](https://render.com) and create an account
2. New → **Web Service** → Connect GitHub repo
3. Set:
   - **Build Command:** `npm ci`
   - **Start Command:** `npm start`
   - **Environment:** `PORT=3000`
4. Copy the **Deploy Hook URL** → add as `RENDER_DEPLOY_HOOK_URL` secret

---

## 11. Challenges Faced

- **npm caching:** Had to use `npm ci` instead of `npm install` for reproducible builds
- **Docker multi-stage:** Separating builder and production stages to reduce image size
- **Secrets management:** Setting up Docker Hub token (not password) for CI auth
- **Job dependencies:** Using `needs:` correctly so jobs run in the right order

---

## Evaluation Checklist

- [x] Git Workflow — branches, commits, PR
- [x] CI/CD Pipeline — Build → Test → Security → Docker → Deploy
- [x] Deployment — Render cloud (real URL)
- [x] GitHub Secrets — Docker Hub + Render webhook
- [x] Enhancement Features — npm cache, conditional jobs, always-notify
- [x] Documentation — this README

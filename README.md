# FoodRush

**FoodRush** is a full-stack food ordering web app: customers browse the menu, cart, checkout, and track orders; admins manage categories, products, orders, coupons, and analytics.  
Main stack: **Next.js (frontend)** + **Node.js / Express / MongoDB (backend)** — REST API under `/api/v1`.

**Repository:** [athar-javed72/FoodRush-PK](https://github.com/athar-javed72/FoodRush-PK)

---

## Features

| Area | What’s included |
|------|-------------------|
| **Public** | Home, menu, product details, login, register |
| **Customer** | Profile, addresses, cart, checkout (COD), orders, order tracking |
| **Admin** | Dashboard, categories, products, orders, users, coupons, analytics |
| **Backend** | JWT auth, bcrypt, Mongoose models, validation, consistent JSON responses |

> **Note:** Checkout uses **cash on delivery (COD)**. Online payment (`mock_online` on the API) is demo-only — no live payment gateway yet.

---

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js, React, Tailwind CSS, Redux Toolkit, Axios |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT + bcrypt |
| API | REST, versioned base path `http://localhost:5000/api/v1` |

---

## Repository layout

```
FoodRush/
├── client/                 # Next.js app (UI) — http://localhost:3000
├── server/                 # Express + MongoDB API — http://localhost:5000
├── packages/shared/        # Shared lib (legacy microservices)
├── services/               # Optional microservices (MySQL/Redis stack)
├── docker-compose.yml      # MySQL + Redis for services/*
└── README.md
```

**Day-to-day development** for the FoodRush MERN app uses **`client/`** + **`server/`** only.  
The **`services/*`** folder is an older microservices setup (MySQL + Redis); see [Optional: microservices](#optional-microservices) if you use it.

---

## Prerequisites

- **Node.js 20.9+ LTS** (64-bit). Required by Next.js 16 (`engines.node >= 20.9.0`).
- **MongoDB** running locally (or connection string to Atlas).
- **npm** (comes with Node).

---

## Quick start (FoodRush app — recommended)

### 1. Clone & install

```bash
git clone https://github.com/athar-javed72/FoodRush-PK.git FoodRush
cd FoodRush
```

**Option A — one command (root):**

```bash
cd server && npm install && cd ..
cd client && npm install && cd ..
# or from root if workspaces already installed: npm install

Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env.local

npm run dev
```

That runs **client + server** together (`dev:mern`).

**Option B — two terminals**

**Backend (server):**

```bash
cd server
npm install
```

```powershell
Copy-Item .env.example .env
```

Edit **`server/.env`**:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/foodrush
PORT=5000
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=7d
```

Start MongoDB, then:

```bash
npm run dev
```

You should see: `FoodRush backend listening on port 5000`.

**Frontend (client):**

```bash
cd ../client
npm install
```

```powershell
Copy-Item .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

```bash
npm run dev
```

Open **http://localhost:3000** — e.g. **http://localhost:3000/menu**.

### 2. First admin user

From **`server/`**:

```bash
npm run seed:admin
```

Or register via **`POST /api/v1/auth/register`**, then in MongoDB set that user’s `role` to `admin`.

---

## Useful URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Next.js app |
| http://localhost:3000/menu | Menu |
| http://localhost:5000/health | API health |
| http://localhost:5000/api/v1/... | REST API |

---

## API overview (server)

Base: **`/api/v1`**

| Group | Examples |
|-------|----------|
| Auth | `POST /auth/register`, `POST /auth/login` |
| Users | `GET/PUT /users/me` |
| Addresses | `GET/POST/PUT/DELETE /addresses` |
| Categories | `GET /categories` (public), admin CRUD with JWT + admin role |
| Products | `GET /products`, `GET /products/:id` |
| Cart | `GET/POST /cart`, coupon apply, `POST /cart/checkout/prepare` |
| Orders | `POST /orders`, `GET /orders/my-orders`, admin status updates |
| Reviews | `POST /reviews`, `GET /reviews/product/:productId` |
| Admin | `GET /admin/dashboard`, analytics routes |

---

## Scripts (root `package.json`)

| Command | What it does |
|---------|----------------|
| `npm run dev` / `npm run dev:mern` | **Client + MongoDB server** (recommended) |
| `npm run dev:client` | Next.js only |
| `npm run dev:server` | Express API only |
| `npm run dev:legacy` | Client + all `services/*` microservices |
| `npm run dev:services` | All `services/*` only (needs MySQL + Redis) |

---

## Optional: microservices

The repo still includes **`packages/shared`** and **`services/*`** (auth, user, order, …) using **MySQL** and **Redis**. That path is separate from the **`server/`** MongoDB API and is **demo/legacy** (e.g. auth may use stub users) — not for production.

- Env: copy root **`.env.example`** → **`.env`** (`DATABASE_URL`, `REDIS_URL`).
- Docs: **[docs/MYSQL-SETUP.md](docs/MYSQL-SETUP.md)** (if present).
- Docker: `docker-compose up -d mysql redis` then `npm run dev:services`.

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| **Failed to load SWC binary** (Next) | Use **Node 20.9+ LTS**, delete `node_modules`, reinstall; see [Next.js SWC docs](https://nextjs.org/docs/messages/failed-loading-swc). |
| API errors in browser | Ensure **`server`** is running and **`NEXT_PUBLIC_API_URL`** matches (`http://localhost:5000/api/v1`). |
| MongoDB connection failed | Check **`MONGODB_URI`** and that MongoDB is running. |

---

## Live demo / repo

- **Repository:** [https://github.com/athar-javed72/FoodRush-PK](https://github.com/athar-javed72/FoodRush-PK)

---

## License

Private / MIT — match your team’s choice.

---

*FoodRush — modern food ordering with a clean MERN stack.*

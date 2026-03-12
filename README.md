🍕 FoodRush PK – Food Delivery

A modern and responsive landing page for **FoodRush PK** – food delivery across Pakistan.  
Built with **HTML, Tailwind CSS, and JavaScript**, plus a **Next.js + MERN** app in this repo.

---

🚀 Live Demo
[Click here to view the live site](https://github.com/athar-javed72/FoodRush/)


✨ Features
* 📱 Fully responsive design (mobile, tablet, desktop)  
* 🎨 Built with Tailwind CSS for modern UI  
* 🧭 Sticky navbar with smooth scrolling  
* 🍔 Mobile menu with toggle button  
* 💳 Pricing plans section  
* 📬 Contact form with details  


🛠️ Tech Stack
* **HTML5**  
* **Tailwind CSS (CDN)**  
* **JavaScript (Vanilla)**  

---

## Phase 1 – MERN Monorepo & Microservices

Base backend + frontend with microservices architecture.

### Structure

```
/client                 # Next.js 14 + Tailwind + ShadCN
/packages/shared        # MySQL, Redis, JWT, RBAC
/services/auth          # Auth (login, JWT)
/services/user          # User profile
/services/restaurant    # Restaurants
/services/order         # Orders
/services/payment       # Payments
/services/delivery      # Delivery assignments
/services/admin         # Admin stats (admin role)
/services/notification  # Notifications
```

### Setup

1. **Copy env and install**
   ```bash
   cp .env.example .env
   npm install
   ```
   *(Windows PowerShell: `Copy-Item .env.example .env`)*

2. **MySQL & Redis (local or Docker)** – see [MySQL & Run Guide](#mysql--project-run-guide) below.

3. **Run frontend**
   ```bash
   npm run dev:client
   ```
   → http://localhost:3000

4. **Run all services**
   ```bash
   npm run dev:services
   ```
   Ports: auth 4001, user 4002, restaurant 4003, order 4004, payment 4005, delivery 4006, admin 4007, notification 4008.

5. **Run everything (client + services)**
   ```bash
   npm run dev
   ```

---

## MySQL & Project Run Guide

**Backend ke liye MySQL zaroori hai?**  
Backend (auth, user, order, etc.) chalane ke liye **haan** – MySQL (aur Redis) chahiye. Sirf **frontend** (website UI) dekhna ho to MySQL ki zaroorat nahi.

### Option A – Sirf website chalana (bina MySQL)

- MySQL install **nahi** karni.
- Sirf ye commands run karo (project root par):

```bash
npm install
npm run dev:client
```

- Browser mein open karo: **http://localhost:3000**  
- Ye sirf Next.js frontend hai; backend APIs (login, orders, etc.) bina MySQL ke kaam nahi karenge.

---

### Option B – Full stack chalana (MySQL + Redis use karna)

Backend services ko chalane ke liye **MySQL** aur **Redis** dono chahiye. Teen tareeqe hain:

#### 1) Docker se (sabse aasaan – recommend)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) install karo (Windows/Mac).
- Project folder mein ye run karo:

```bash
docker-compose up -d mysql redis
```

- Ye MySQL ko `localhost:3306` par aur Redis ko `localhost:6379` par start karega.
- Phir backend + frontend dono chalao:

```bash
npm install
npm run dev
```

- Frontend: http://localhost:3000  
- Backend ports: 4001 (auth), 4002 (user), 4003 (restaurant), … 4008 (notification).

**MySQL use kaise ho raha hai:**  
Sab services `DATABASE_URL=mysql://root:password@localhost:3306/foodie` use karti hain (`.env` mein set hai). Data `foodie` database mein save hota hai.

---

#### 2) MySQL local install karke

- [MySQL](https://dev.mysql.com/downloads/installer/) (Windows) ya XAMPP/WAMP se MySQL install karo; Mac/Linux par `mysql-server` ya Homebrew use karo.
- MySQL service start karo (Windows: Services se “MongoDB” start karo; Mac/Linux: `mysql.server start` ya `sudo service mysql start`).
- [Redis](https://redis.io/download) bhi install karo aur run karo (`redis-server`).
- `.env` mein ye rakhna hai (default):

```
DATABASE_URL=mysql://root:password@localhost:3306/foodie
REDIS_URL=redis://localhost:6379
```

- Phir:

```bash
npm run dev
```

**MySQL ko use/check kaise karein:**  
MySQL Workbench, DBeaver, ya command line: `mysql -u root -p` → `USE foodie;` → `SHOW TABLES;`

---

#### 3) MySQL cloud (bina local install)

- **[Full step-by-step guide: docs/MYSQL-SETUP.md](docs/MYSQL-SETUP.md)** – local + Docker + optional cloud options.
- Agar cloud MySQL use karna ho (e.g. PlanetScale, Railway, AWS RDS) to unka connection string `.env` mein `DATABASE_URL` set karo.
- **Redis:** Redis bhi chahiye – Docker: `docker run -d -p 6379:6379 --name redis redis:7-alpine` ya [Upstash](https://upstash.com) (cloud).
- Phir `npm run dev` se sab run karo.

---

### Short summary

| Kya chalaana hai      | MySQL chahiye? | Command              |
|-----------------------|----------------|----------------------|
| Sirf website (UI)     | Nahi          | `npm run dev:client` |
| Full stack (backend + UI) | Haan (Docker / local / cloud) | Pehle MySQL+Redis, phir `npm run dev` |

### Docker (full stack)

```bash
docker-compose up -d
```

### CI/CD

GitHub Actions workflow in `.github/workflows/ci.yml`: on push/PR to `main` or `develop` it installs deps, builds `@foodie/shared`, builds client, and builds all services.

### Roles (RBAC)

- `user` – default
- `restaurant_owner` – restaurant management
- `delivery` – delivery driver
- `admin` – admin-only routes (e.g. `/admin/stats`)

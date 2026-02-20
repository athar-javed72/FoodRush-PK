🍕 Foodie - Responsive Landing Page

A modern and responsive landing page for a **Food Delivery Service**.  
This project is part of my **portfolio showcase** to demonstrate frontend development skills using **HTML, Tailwind CSS, and JavaScript**.

---

🚀 Live Demo
[Click here to view the live site](https://github.com/athar-javed72/foodie-landing-page/)


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
/packages/shared        # MongoDB, Redis, JWT, RBAC
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

2. **MongoDB & Redis (local or Docker)**
   ```bash
   docker-compose up -d mongodb redis
   ```

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

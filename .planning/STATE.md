# STATE — FoodRush

Phase 1–2 (core MERN food ordering app) — **MOSTLY COMPLETE** on GitHub `athar-javed72/FoodRush-PK`  
Phase 3 (harden & ship) — **IN PROGRESS** (see root `PRD.md`)

---

## 1. What Exists

### Stack & layout
- **Frontend:** `client/` — Next.js 16, React 18, Tailwind, Redux Toolkit, Axios (`http://localhost:3000`)
- **Backend:** `server/` — Express + MongoDB + Mongoose + Joi + JWT (`http://localhost:5000`, API `/api/v1`)
- **Legacy (optional):** `services/*` + `packages/shared` + root `docker-compose.yml` (MySQL/Redis microservices) — **not** the day-to-day path
- **Remote:** `origin` → `https://github.com/athar-javed72/FoodRush-PK.git` (`main`)

### Customer / public
- Home, menu, product details, login, register
- Profile, addresses, cart, checkout (**COD**), orders + order detail/tracking, wishlist

### Ops roles (UI)
- **Admin:** dashboard, categories, products, orders, users, coupons, analytics, complaints, suggestions, employees
- **Driver:** dashboard
- **Staff:** dashboard

### Backend surface (high level)
- Auth (register/login, JWT), users, addresses
- Categories, products, cart (+ coupon / checkout prepare)
- Orders, reviews, uploads
- Admin analytics / management routes
- Driver & staff routes
- Models include User, Address, Category, Product, Cart, Order, Coupon, Review, Complaint, Suggestion, Attendance

### Agent / planning tooling (Phase 3 Task 1)
- `.agent/` + `.agents/` plugins: **gsd**, **ralph-loop**, **context7**, **serena**, **coderabbit**, **server-validation**
- Root: `PRD.md`, `progress.txt`, `.planning/STATE.md`
- Rules: MERN stack + GSD protocols + validation / review plugins

---

## 2. What Passed / Known good
- App features above exist in tree and recent commits (UI polish, order mode, admin enhancements, themes, analytics).
- Docs/scripts baseline for MERN (`dev:mern`, env examples) added.

---

## 3. Consolidated known gaps
1. **No live payment gateway** — COD is real path; `mock_online` is demo-only.
2. **Legacy `services/*` auth may stub users** — do not use for production FoodRush.
3. **Server lint script is placeholder** — no real ESLint on `server/` yet.
4. **Automated test suite** for server/client is thin or missing vs School ERP-style Pest gates.
5. **Production deploy / CI secrets** not fully productized in this phase.
6. **Multi-restaurant marketplace** depth may still be single-shop oriented depending on data model.

---

## 4. Next
Phase 3 Task 1 (agent pack) is done. Next: Task 2 smoke → Task 3 seed → validation audit → payment copy → handoff (`PRD.md`).  
Do **not** start a payment-gateway phase until a new PRD is provided.

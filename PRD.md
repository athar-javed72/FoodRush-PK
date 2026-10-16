# Project Requirements Document (PRD): Phase 3 — FoodRush MERN harden & ship

## Overview
**FoodRush PK** is a food ordering / delivery web app (Lahore, Karachi, Islamabad, Faisalabad, Gujranwala branding).  
Phases 1–2 (core MERN: auth, menu, cart, checkout COD, orders, admin, driver/staff UIs) are largely **DONE** on `main` at repo [athar-javed72/FoodRush-PK](https://github.com/athar-javed72/FoodRush-PK).

This PRD covers **Phase 3 only**: harden the existing `client/` + `server/` app, close documented gaps, and keep agent work tracked via `progress.txt` + `.planning/STATE.md`.  
Do **NOT** expand the legacy `services/*` MySQL microservices unless a later PRD says so.

## Stack and environment (fixed)
- **Frontend:** Next.js 16 (App Router), React 18, Tailwind, Redux Toolkit, Axios — `client/`
- **Backend:** Node.js / Express / MongoDB / Mongoose / Joi / JWT — `server/` under `/api/v1`
- **Node:** `>=20.9.0`
- **Env:** `server/.env` from `server/.env.example`; `client/.env.local` from `client/.env.example`
- **Repo remote:** `origin` → `https://github.com/athar-javed72/FoodRush-PK.git`
- Credentials and secrets come from `.env` / `.env.local`; never hardcode or commit them.

## Hard rules (apply to every task)
1. Day-to-day code changes go in **`client/`** and **`server/`** only. Treat `services/*` and `packages/shared` as legacy/demo.
2. Do not invent API routes, roles, or models. Match existing patterns under `server/src/{routes,controllers,models,validators}`.
3. **Validation first:** every mutating API uses Joi validators + `validate` middleware; never trust raw `req.body` in controllers.
4. **Authz:** protect admin/driver/staff routes with JWT + role checks (`server/src/constants/roles.js`, auth middleware).
5. Checkout payment: **COD is production path**. `mock_online` stays demo-only unless a later PRD adds a real gateway.
6. One task per turn when using Ralph/GSD loops. Verify, **append** to `progress.txt` (never rewrite earlier entries), update `.planning/STATE.md` when a phase/task finishes, then STOP.
7. Never run `git add` / `git commit` / `git push` unless the user explicitly asks. User owns commits.
8. Never write secrets, tokens, or real PII into logs, `progress.txt`, PRD, or STATE.
9. Prefer Context7 (or official docs) before guessing Next.js / Express / Mongoose APIs.
10. Verification gate for every task (as applicable):
    - Changed JS: syntax check / run the touched flow
    - `server`: `npm run seed:admin` or health check if auth/DB touched
    - `client`: `npm run lint` and/or `npm run build` when UI/routes change
    - Do not mark a task complete if the gate fails

## What already exists (do not rebuild)
- Public: home, menu, product details, login, register
- Customer: profile, addresses, cart, checkout (COD), orders, order tracking, wishlist
- Admin: dashboard, categories, products, orders, users, coupons, analytics, complaints, suggestions, employees
- Driver / staff dashboards
- Backend: JWT auth, bcrypt, Mongoose models, Joi validation, REST `/api/v1`

## Tasks
- [x] Task 0: Attach repo + docs baseline — remote `FoodRush-PK`, root `dev:mern` scripts, `client/.env.example`, README aligned to Node 20.9+.
- [x] Task 1: Agent workspace pack — `.agent/`, `.agents/` plugins (GSD, Ralph Loop, Context7, Serena, CodeRabbit, server-validation), `PRD.md`, `progress.txt`, `.planning/STATE.md`, FoodRush MERN rules. Done when: files present and rules reference this stack.
- [ ] Task 2: Env & onboarding smoke — document and verify `server` + `client` boot (`npm run dev` / `dev:mern`), `/health`, menu page loads with API. Done when: steps recorded in `progress.txt`.
- [ ] Task 3: Seed path — ensure `npm run seed:admin` (and optional catalog seed) is documented and works against local MongoDB. Done when: admin can log in.
- [ ] Task 4: Server validation audit — confirm mutating routes use Joi validators; fix any raw-body gaps. Done when: audit notes in `progress.txt`, gaps fixed or listed under BLOCKED.
- [ ] Task 5: Client API URL / error UX — ensure `NEXT_PUBLIC_API_URL` usage is consistent; user-visible errors for API down. Done when: smoke notes in `progress.txt`.
- [ ] Task 6: Payment clarity — UI + README already COD-first; remove or hide any misleading “secure online pay” copy that implies a live gateway. Done when: no false payment claims in primary UI.
- [ ] Task 7: Optional quality — add real ESLint for `server/` **or** document lint as client-only. Done when: decision recorded in STATE.
- [ ] Task 8: Phase 3 handoff — update `.planning/STATE.md` (what exists, known gaps), archive this PRD copy under `docs/archive/PRD_phase3.md` if `docs/archive` exists (create if needed). Then STOP. Do **not** start a payment-gateway PRD.

## Out of scope for this PRD
Live payment gateways, new city marketplace multi-vendor core, rewriting onto `services/*` microservices, native mobile apps, SMS/email providers, production deploy (unless user asks in a later PRD).

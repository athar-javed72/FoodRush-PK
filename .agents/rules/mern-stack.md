# FoodRush MERN Stack Rules (Next.js + Express + MongoDB)

1. **Primary app path:** `client/` + `server/` only. Do not treat `services/*` as production unless a PRD says so.
2. **API base:** versioned REST under `/api/v1`. Keep response shapes consistent with existing controllers.
3. **Validation:** Joi schemas in `server/src/validators/` + `validate` middleware. Never pass raw `req.body` into Mongoose writes.
4. **Auth:** JWT + bcrypt; role checks via existing middleware and `server/src/constants/roles.js` (`user`, `admin`, `driver`, `staff`, etc. as already defined).
5. **Money / totals:** follow existing cart/order calculation patterns; do not introduce float-unsafe money helpers without matching the current model.
6. **Env:** never commit `.env` / `.env.local`. Use `.env.example` files. Never print secrets in `progress.txt`.
7. **Docs before guessing:** use Context7 / official Next.js 16, Express, Mongoose docs for unfamiliar APIs.
8. **Verification gate:** after each task — smoke the changed path; for client UI prefer `npm run lint` / `npm run build` when routes or shared layout change; for server prefer hitting `/health` and the affected `/api/v1` route.
9. **Planning files:** append-only `progress.txt`; update `.planning/STATE.md` on phase/task completion; follow current root `PRD.md` scope only.
10. **Git:** do not commit or push unless the user explicitly asks.

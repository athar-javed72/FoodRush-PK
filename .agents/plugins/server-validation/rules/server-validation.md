# Server-Side Validation Rules (FoodRush Express)

Whenever writing, modifying, or reviewing backend code in `server/`:

1. **Zero unvalidated input:** Never pass raw `req.body`, `req.query`, or `req.params` into Mongoose queries/updates without Joi (or equivalent) validation.
2. **Validator first:** Add/update `server/src/validators/<resource>.validator.js` before expanding the controller action.
3. **Middleware:** Wire validators through `server/src/middlewares/validate.middleware.js` on the route.
4. **Strict shapes:** Prefer explicit allow-lists of fields; reject unknown keys where Joi supports it.
5. **Authz after auth:** Protected routes use JWT middleware; admin/driver/staff actions must check role.
6. **Status codes:** Use existing project conventions (typically 400/401/403/404/422-style validation errors via the shared error middleware).
7. **Uploads:** Validate file type/size via existing upload middleware/controller patterns; store under ignored `server/uploads/`.
8. **Secrets:** Never log JWT secrets, Mongo URIs with credentials, or raw payment payloads.

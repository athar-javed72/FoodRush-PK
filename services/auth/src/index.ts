import express from 'express';
import cors from 'cors';
import { connectMongo, getRedis, authMiddleware, signToken, ROLES } from '@foodie/shared';

const PORT = process.env.PORT || 4001;
const app = express();

app.use(cors());
app.use(express.json());

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'auth' }));

// Login (stub – replace with real user lookup)
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  // TODO: validate against DB, use bcrypt for password
  const token = signToken({
    userId: 'stub-user-id',
    email: String(email),
    role: ROLES.USER,
  });
  return res.json({ token, user: { email, role: ROLES.USER } });
});

// Protected route example
app.get('/auth/me', authMiddleware(), (req: any, res) => {
  return res.json({ user: req.user });
});

async function main() {
  await connectMongo();
  getRedis(); // ensure Redis client exists
  app.listen(PORT, () => console.log(`[auth] listening on ${PORT}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import express from 'express';
import cors from 'cors';
import { connectMongo, getRedis, authMiddleware } from '@foodie/shared';

const PORT = process.env.PORT || 4002;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'user' }));
app.get('/user/me', authMiddleware(), (req: any, res) => res.json({ user: req.user }));

async function main() {
  await connectMongo();
  getRedis();
  app.listen(PORT, () => console.log(`[user] listening on ${PORT}`));
}
main().catch((e) => { console.error(e); process.exit(1); });

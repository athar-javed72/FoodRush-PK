import express from 'express';
import cors from 'cors';
import { connectMongo, getRedis, authMiddleware, ROLES } from '@foodie/shared';

const PORT = process.env.PORT || 4007;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'admin' }));
app.get('/admin/stats', authMiddleware(ROLES.ADMIN), (_req, res) => res.json({ users: 0, orders: 0, restaurants: 0 }));

async function main() {
  await connectMongo();
  getRedis();
  app.listen(PORT, () => console.log(`[admin] listening on ${PORT}`));
}
main().catch((e) => { console.error(e); process.exit(1); });

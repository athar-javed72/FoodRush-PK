import express from 'express';
import cors from 'cors';
import { connectMongo, getRedis, authMiddleware } from '@foodie/shared';

const PORT = process.env.PORT || 4004;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'order' }));
app.get('/order/list', authMiddleware(), (req: any, res) => res.json({ orders: [], userId: req.user?.userId }));

async function main() {
  await connectMongo();
  getRedis();
  app.listen(PORT, () => console.log(`[order] listening on ${PORT}`));
}
main().catch((e) => { console.error(e); process.exit(1); });

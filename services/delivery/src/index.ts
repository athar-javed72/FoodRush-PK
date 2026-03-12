import express from 'express';
import cors from 'cors';
import { connectDB, getRedis, authMiddleware, ROLES } from '@foodie/shared';

const PORT = process.env.PORT || 4006;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'delivery' }));
app.get('/delivery/assignments', authMiddleware(ROLES.DELIVERY), (req: any, res) => res.json({ assignments: [], driverId: req.user?.userId }));

async function main() {
  await connectDB();
  getRedis();
  app.listen(PORT, () => console.log(`[delivery] listening on ${PORT}`));
}
main().catch((e) => { console.error(e); process.exit(1); });

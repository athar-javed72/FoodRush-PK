import express from 'express';
import cors from 'cors';
import { connectMongo, getRedis, authMiddleware, ROLES } from '@foodie/shared';

const PORT = process.env.PORT || 4003;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'restaurant' }));
app.get('/restaurant/list', (_req, res) => res.json({ restaurants: [] }));
app.get('/restaurant/me', authMiddleware(ROLES.RESTAURANT_OWNER), (req: any, res) => res.json({ user: req.user }));

async function main() {
  await connectMongo();
  getRedis();
  app.listen(PORT, () => console.log(`[restaurant] listening on ${PORT}`));
}
main().catch((e) => { console.error(e); process.exit(1); });

import express from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';
import {
  getDashboard,
  getTopProductsController,
  getOrderStatsController,
  getAnalyticsOverviewController
} from '../controllers/analytics.controller.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', getDashboard);
router.get('/analytics/overview', getAnalyticsOverviewController);
router.get('/top-products', getTopProductsController);
router.get('/order-stats', getOrderStatsController);

export default router;


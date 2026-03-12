import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import { getDashboardSummary, getTopProducts, getOrderStats } from '../services/analytics.service.js';

export const getDashboard = asyncHandler(async (_req, res) => {
  const data = await getDashboardSummary();
  return successResponse(res, {
    message: 'Dashboard data fetched successfully',
    data
  });
});

export const getTopProductsController = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  const topProducts = await getTopProducts(Number(limit) || 5);
  return successResponse(res, {
    message: 'Top products fetched successfully',
    data: { topProducts }
  });
});

export const getOrderStatsController = asyncHandler(async (_req, res) => {
  const stats = await getOrderStats();
  return successResponse(res, {
    message: 'Order stats fetched successfully',
    data: stats
  });
});


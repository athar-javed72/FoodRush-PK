import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import { getOrdersForDriver, updateOrderStatusByDriver } from '../services/order.service.js';

export const getDriverOrdersController = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const orders = await getOrdersForDriver(req.user.id, { status: status || undefined });
  return successResponse(res, {
    message: 'Orders fetched successfully',
    data: { orders }
  });
});

export const updateDriverOrderStatusController = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await updateOrderStatusByDriver(req.params.id, req.user.id, status);
  return successResponse(res, {
    message: 'Order status updated successfully',
    data: { order }
  });
});

import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import {
  createOrderFromCart,
  getUserOrders,
  getOrderByIdForUser,
  getAllOrders,
  updateOrderStatus
} from '../services/order.service.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { addressId, paymentMethod, notes } = req.body;
  const order = await createOrderFromCart(req.user.id, { addressId, paymentMethod, notes });
  return successResponse(res, {
    statusCode: 201,
    message: 'Order created successfully',
    data: { order }
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await getUserOrders(req.user.id);
  return successResponse(res, {
    message: 'Orders fetched successfully',
    data: { orders }
  });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await getOrderByIdForUser(req.params.id, req.user);
  return successResponse(res, {
    message: 'Order fetched successfully',
    data: { order }
  });
});

export const getAllOrdersController = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const orders = await getAllOrders({ status });
  return successResponse(res, {
    message: 'All orders fetched successfully',
    data: { orders }
  });
});

export const updateOrderStatusController = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await updateOrderStatus(req.params.id, status);
  return successResponse(res, {
    message: 'Order status updated successfully',
    data: { order }
  });
});


import express from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrdersController,
  updateOrderStatusController
} from '../controllers/order.controller.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator.js';

const router = express.Router();

// Customer
router.post('/', authMiddleware, validate(createOrderSchema), createOrder);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/:id', authMiddleware, getOrder);

// Admin
router.get('/', authMiddleware, adminMiddleware, getAllOrdersController);
router.put(
  '/:id/status',
  authMiddleware,
  adminMiddleware,
  validate(updateOrderStatusSchema),
  updateOrderStatusController
);

export default router;


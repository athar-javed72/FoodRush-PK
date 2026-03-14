import express from 'express';
import { authMiddleware, driverMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getDriverOrdersController,
  updateDriverOrderStatusController
} from '../controllers/driver.controller.js';
import { updateOrderStatusSchema } from '../validators/order.validator.js';

const router = express.Router();

router.use(authMiddleware);
router.use(driverMiddleware);

router.get('/orders', getDriverOrdersController);
router.put(
  '/orders/:id/status',
  validate(updateOrderStatusSchema),
  updateDriverOrderStatusController
);

export default router;

import express from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createCouponController,
  getCouponsController,
  getCouponController,
  updateCouponController,
  deleteCouponController
} from '../controllers/coupon.controller.js';
import { createCouponSchema, updateCouponSchema } from '../validators/coupon.validator.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/', getCouponsController);
router.get('/:id', getCouponController);
router.post('/', validate(createCouponSchema), createCouponController);
router.put('/:id', validate(updateCouponSchema), updateCouponController);
router.delete('/:id', deleteCouponController);

export default router;

import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getMyCart,
  addToCart,
  updateCartItemController,
  removeCartItemController,
  clearCartController,
  applyCouponController,
  removeCouponController,
  validateCouponController,
  prepareCheckout
} from '../controllers/cart.controller.js';
import {
  addToCartSchema,
  updateCartItemSchema,
  applyCouponSchema,
  validateCouponSchema,
  prepareCheckoutSchema
} from '../validators/cart.validator.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMyCart);
router.post('/', validate(addToCartSchema), addToCart);
router.put('/item/:itemId', validate(updateCartItemSchema), updateCartItemController);
router.delete('/item/:itemId', removeCartItemController);
router.delete('/clear', clearCartController);

router.post('/coupon/apply', validate(applyCouponSchema), applyCouponController);
router.post('/coupon/remove', removeCouponController);
router.post('/coupon/validate', validate(validateCouponSchema), validateCouponController);

router.post('/checkout/prepare', validate(prepareCheckoutSchema), prepareCheckout);

export default router;


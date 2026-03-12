import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCouponToCart,
  removeCouponFromCart,
  getCartForCheckout
} from '../services/cart.service.js';
import { Address } from '../models/Address.js';
import { findActiveCouponByCode, calculateCouponDiscount } from '../services/coupon.service.js';

export const getMyCart = asyncHandler(async (req, res) => {
  const cart = await getCart(req.user.id);
  return successResponse(res, {
    message: 'Cart fetched successfully',
    data: { cart }
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await addItemToCart(req.user.id, { productId, quantity });
  return successResponse(res, {
    message: 'Cart updated successfully',
    data: { cart }
  });
});

export const updateCartItemController = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await updateCartItem(req.user.id, { itemId: req.params.itemId, quantity });
  return successResponse(res, {
    message: 'Cart item updated successfully',
    data: { cart }
  });
});

export const removeCartItemController = asyncHandler(async (req, res) => {
  const cart = await removeCartItem(req.user.id, req.params.itemId);
  return successResponse(res, {
    message: 'Cart item removed successfully',
    data: { cart }
  });
});

export const clearCartController = asyncHandler(async (req, res) => {
  const cart = await clearCart(req.user.id);
  return successResponse(res, {
    message: 'Cart cleared successfully',
    data: { cart }
  });
});

export const applyCouponController = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const cart = await applyCouponToCart(req.user.id, code);
  return successResponse(res, {
    message: 'Coupon applied successfully',
    data: { cart }
  });
});

export const removeCouponController = asyncHandler(async (req, res) => {
  const cart = await removeCouponFromCart(req.user.id);
  return successResponse(res, {
    message: 'Coupon removed successfully',
    data: { cart }
  });
});

export const validateCouponController = asyncHandler(async (req, res) => {
  const { code, amount } = req.body;
  const coupon = await findActiveCouponByCode(code);
  const discount = calculateCouponDiscount(coupon, amount);
  return successResponse(res, {
    message: 'Coupon is valid',
    data: { coupon, discount }
  });
});

export const prepareCheckout = asyncHandler(async (req, res) => {
  const { addressId, couponCode } = req.body;

  // Validate address belongs to user
  const address = await Address.findOne({ _id: addressId, user: req.user.id });
  if (!address) {
    const err = new Error('Invalid address');
    err.statusCode = 400;
    throw err;
  }

  // Refresh cart, prices, coupon
  let cart = await getCartForCheckout(req.user.id);

  // If frontend sends a coupon code, re-validate against refreshed cart
  if (couponCode) {
    const coupon = await findActiveCouponByCode(couponCode);
    const discountAmount = calculateCouponDiscount(coupon, cart.subtotal);
    cart.discountAmount = discountAmount;
    cart.totalAmount = cart.subtotal - discountAmount;
    cart.appliedCoupon = coupon._id;
    await cart.save();
    cart = await cart.populate(['items.product', 'appliedCoupon']);
  }

  return successResponse(res, {
    message: 'Checkout prepared successfully',
    data: {
      cart,
      address
    }
  });
});


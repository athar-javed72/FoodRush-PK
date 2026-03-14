import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import {
  createCoupon,
  listCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon
} from '../services/coupon.service.js';

export const createCouponController = asyncHandler(async (req, res) => {
  const coupon = await createCoupon(req.body);
  return successResponse(res, {
    statusCode: 201,
    message: 'Coupon created successfully',
    data: { coupon }
  });
});

export const getCouponsController = asyncHandler(async (_req, res) => {
  const coupons = await listCoupons();
  return successResponse(res, {
    message: 'Coupons fetched successfully',
    data: { coupons }
  });
});

export const getCouponController = asyncHandler(async (req, res) => {
  const coupon = await getCouponById(req.params.id);
  return successResponse(res, {
    message: 'Coupon fetched successfully',
    data: { coupon }
  });
});

export const updateCouponController = asyncHandler(async (req, res) => {
  const coupon = await updateCoupon(req.params.id, req.body);
  return successResponse(res, {
    message: 'Coupon updated successfully',
    data: { coupon }
  });
});

export const deleteCouponController = asyncHandler(async (req, res) => {
  await deleteCoupon(req.params.id);
  return successResponse(res, {
    message: 'Coupon deleted successfully',
    data: {}
  });
});

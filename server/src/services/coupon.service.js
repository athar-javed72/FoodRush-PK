import { Coupon } from '../models/Coupon.js';

export async function createCoupon(payload) {
  if (payload.code) payload.code = payload.code.toUpperCase().trim();
  return Coupon.create(payload);
}

export async function listCoupons() {
  return Coupon.find().sort({ createdAt: -1 });
}

export async function getCouponById(id) {
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    const err = new Error('Coupon not found');
    err.statusCode = 404;
    throw err;
  }
  return coupon;
}

export async function updateCoupon(id, updates) {
  if (updates.code) updates.code = updates.code.toUpperCase().trim();
  const coupon = await Coupon.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  });
  if (!coupon) {
    const err = new Error('Coupon not found');
    err.statusCode = 404;
    throw err;
  }
  return coupon;
}

export async function deleteCoupon(id) {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    const err = new Error('Coupon not found');
    err.statusCode = 404;
    throw err;
  }
  return coupon;
}

export async function findActiveCouponByCode(code) {
  const upper = code.toUpperCase();
  const now = new Date();

  const coupon = await Coupon.findOne({
    code: upper,
    isActive: true,
    expiryDate: { $gte: now }
  });

  if (!coupon) {
    const err = new Error('Invalid or expired coupon');
    err.statusCode = 400;
    throw err;
  }

  return coupon;
}

export function calculateCouponDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  if (subtotal < (coupon.minOrderAmount || 0)) {
    const err = new Error('Order amount does not meet minimum for this coupon');
    err.statusCode = 400;
    throw err;
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
  } else if (coupon.discountType === 'fixed') {
    discount = coupon.discountValue;
  }

  if (discount > subtotal) discount = subtotal;
  return Math.round(discount * 100) / 100;
}


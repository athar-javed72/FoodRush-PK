import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { findActiveCouponByCode, calculateCouponDiscount } from './coupon.service.js';

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
      subtotal: 0,
      discountAmount: 0,
      totalAmount: 0
    });
  }
  return cart;
}

function recalculateTotals(cart, couponDoc) {
  const subtotal = cart.items.reduce((sum, item) => sum + item.itemTotal, 0);
  let discountAmount = 0;
  let appliedCoupon = null;

  if (couponDoc) {
    discountAmount = calculateCouponDiscount(couponDoc, subtotal);
    appliedCoupon = couponDoc._id;
  } else if (cart.appliedCoupon) {
    // if cart has coupon ref, but no doc passed, keep values as-is (used for simple recalc)
    appliedCoupon = cart.appliedCoupon;
  }

  const totalAmount = subtotal - discountAmount;

  cart.subtotal = subtotal;
  cart.discountAmount = discountAmount;
  cart.totalAmount = totalAmount < 0 ? 0 : totalAmount;
  cart.appliedCoupon = appliedCoupon;
}

export async function getCart(userId) {
  const cart = await getOrCreateCart(userId);
  return cart.populate('appliedCoupon');
}

export async function addItemToCart(userId, { productId, quantity = 1 }) {
  const product = await Product.findById(productId);
  if (!product || !product.isAvailable) {
    const err = new Error('Product not available');
    err.statusCode = 400;
    throw err;
  }

  const cart = await getOrCreateCart(userId);

  const existing = cart.items.find((i) => i.product.toString() === productId);
  const newQuantity = (existing ? existing.quantity : 0) + quantity;
  const priceSnapshot = product.price;
  const itemTotal = priceSnapshot * newQuantity;

  if (existing) {
    existing.quantity = newQuantity;
    existing.priceSnapshot = priceSnapshot;
    existing.itemTotal = itemTotal;
  } else {
    cart.items.push({
      product: product._id,
      quantity: newQuantity,
      priceSnapshot,
      itemTotal
    });
  }

  // if coupon was applied, re-validate
  let couponDoc = null;
  if (cart.appliedCoupon) {
    couponDoc = await findActiveCouponByCode(
      (await cart.populate('appliedCoupon')).appliedCoupon.code
    ).catch(() => null);
  }

  recalculateTotals(cart, couponDoc || undefined);
  await cart.save();
  return cart.populate(['items.product', 'appliedCoupon']);
}

export async function updateCartItem(userId, { itemId, quantity }) {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);

  if (!item) {
    const err = new Error('Cart item not found');
    err.statusCode = 404;
    throw err;
  }

  if (quantity <= 0) {
    item.remove();
  } else {
    const product = await Product.findById(item.product);
    if (!product || !product.isAvailable) {
      const err = new Error('Product not available');
      err.statusCode = 400;
      throw err;
    }
    item.quantity = quantity;
    item.priceSnapshot = product.price;
    item.itemTotal = product.price * quantity;
  }

  let couponDoc = null;
  if (cart.appliedCoupon) {
    couponDoc = await findActiveCouponByCode(
      (await cart.populate('appliedCoupon')).appliedCoupon.code
    ).catch(() => null);
  }

  recalculateTotals(cart, couponDoc || undefined);
  await cart.save();
  return cart.populate(['items.product', 'appliedCoupon']);
}

export async function removeCartItem(userId, itemId) {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.id(itemId);
  if (!item) {
    const err = new Error('Cart item not found');
    err.statusCode = 404;
    throw err;
  }
  item.remove();

  let couponDoc = null;
  if (cart.appliedCoupon) {
    couponDoc = await findActiveCouponByCode(
      (await cart.populate('appliedCoupon')).appliedCoupon.code
    ).catch(() => null);
  }

  recalculateTotals(cart, couponDoc || undefined);
  await cart.save();
  return cart.populate(['items.product', 'appliedCoupon']);
}

export async function clearCart(userId) {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  cart.subtotal = 0;
  cart.discountAmount = 0;
  cart.totalAmount = 0;
  cart.appliedCoupon = null;
  await cart.save();
  return cart;
}

export async function applyCouponToCart(userId, code) {
  const cart = await getOrCreateCart(userId);
  if (!cart.items.length) {
    const err = new Error('Cart is empty');
    err.statusCode = 400;
    throw err;
  }

  const coupon = await findActiveCouponByCode(code);
  recalculateTotals(cart, coupon);
  await cart.save();
  return cart.populate(['items.product', 'appliedCoupon']);
}

export async function removeCouponFromCart(userId) {
  const cart = await getOrCreateCart(userId);
  cart.appliedCoupon = null;
  recalculateTotals(cart);
  await cart.save();
  return cart.populate(['items.product']);
}

export async function getCartForCheckout(userId) {
  const cart = await getOrCreateCart(userId);
  if (!cart.items.length) {
    const err = new Error('Cart is empty');
    err.statusCode = 400;
    throw err;
  }

  // ensure prices still current & recalc subtotal
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isAvailable) {
      const err = new Error('One or more products are no longer available');
      err.statusCode = 400;
      throw err;
    }
    item.priceSnapshot = product.price;
    item.itemTotal = product.price * item.quantity;
  }

  let couponDoc = null;
  if (cart.appliedCoupon) {
    couponDoc = await findActiveCouponByCode(
      (await cart.populate('appliedCoupon')).appliedCoupon.code
    ).catch(() => null);
  }

  recalculateTotals(cart, couponDoc || undefined);
  await cart.save();
  return cart.populate(['items.product', 'appliedCoupon']);
}


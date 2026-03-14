import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Address } from '../models/Address.js';
import { Product } from '../models/Product.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';
import { clearCart, getCartForCheckout } from './cart.service.js';

export async function createOrderFromCart(userId, { addressId, paymentMethod = 'cod', notes }) {
  const address = await Address.findOne({ _id: addressId, user: userId });
  if (!address) {
    const err = new Error('Invalid address');
    err.statusCode = 400;
    throw err;
  }

  const cart = await getCartForCheckout(userId);

  if (!cart.items.length) {
    const err = new Error('Cart is empty');
    err.statusCode = 400;
    throw err;
  }

  const items = [];
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isAvailable) {
      const err = new Error('One or more products are no longer available');
      err.statusCode = 400;
      throw err;
    }
    items.push({
      product: product._id,
      nameSnapshot: product.name,
      imageSnapshot: product.image,
      priceSnapshot: product.price,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity
    });
  }

  const subtotalAmount = items.reduce((sum, it) => sum + it.lineTotal, 0);

  // If cart had discount/coupon, respect it; otherwise no discount
  const discountAmount = cart.discountAmount || 0;
  const totalAmount = subtotalAmount - discountAmount;

  const order = await Order.create({
    user: userId,
    items,
    subtotalAmount,
    discountAmount,
    totalAmount: totalAmount < 0 ? 0 : totalAmount,
    addressSnapshot: {
      fullName: address.fullName,
      phone: address.phone,
      city: address.city,
      area: address.area,
      streetAddress: address.streetAddress,
      landmark: address.landmark,
      postalCode: address.postalCode,
      label: address.label
    },
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    coupon: cart.appliedCoupon || null,
    orderStatus: ORDER_STATUS.PENDING,
    notes
  });

  await clearCart(userId);

  return order.populate(['user', 'items.product', 'coupon']);
}

export async function getUserOrders(userId) {
  return Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('items.product');
}

export async function getOrderByIdForUser(orderId, user) {
  const order = await Order.findById(orderId).populate([
    'items.product',
    'coupon',
    'assignedDriver'
  ]);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  const isOwner = order.user.toString() === user.id;
  const driverId = order.assignedDriver
    ? (order.assignedDriver._id || order.assignedDriver).toString()
    : null;
  const isAssignedDriver = driverId === user.id;
  if (user.role !== 'admin' && !isOwner && !isAssignedDriver) {
    const err = new Error('Not authorized to view this order');
    err.statusCode = 403;
    throw err;
  }

  return order;
}

export async function getAllOrders(filters = {}) {
  const query = {};
  if (filters.status) {
    query.orderStatus = filters.status;
  }

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('assignedDriver', 'name email phone')
      .populate(['items.product', 'coupon']),
    Order.countDocuments(query)
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
}

export async function updateOrderStatus(orderId, newStatus) {
  if (!Object.values(ORDER_STATUS).includes(newStatus)) {
    const err = new Error('Invalid order status');
    err.statusCode = 400;
    throw err;
  }

  const order = await Order.findById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  // Simple status update for V1; more strict transitions can be added later
  order.orderStatus = newStatus;
  await order.save();
  return order.populate(['user', 'items.product', 'coupon', 'assignedDriver']);
}

export async function assignDriverToOrder(orderId, driverId) {
  const order = await Order.findById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  order.assignedDriver = driverId;
  await order.save();
  return order.populate(['user', 'items.product', 'coupon', 'assignedDriver']);
}

export async function getOrdersForDriver(driverId, filters = {}) {
  const query = { assignedDriver: driverId };
  if (filters.status) {
    query.orderStatus = filters.status;
  }
  return Order.find(query)
    .sort({ createdAt: -1 })
    .populate('user', 'name email phone')
    .populate(['items.product', 'assignedDriver']);
}

export async function updateOrderStatusByDriver(orderId, driverId, newStatus) {
  const order = await Order.findById(orderId).populate('assignedDriver');
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  if (order.assignedDriver?._id?.toString() !== driverId) {
    const err = new Error('Not assigned to this order');
    err.statusCode = 403;
    throw err;
  }
  if (!Object.values(ORDER_STATUS).includes(newStatus)) {
    const err = new Error('Invalid order status');
    err.statusCode = 400;
    throw err;
  }
  order.orderStatus = newStatus;
  await order.save();
  return order.populate(['user', 'items.product', 'coupon', 'assignedDriver']);
}


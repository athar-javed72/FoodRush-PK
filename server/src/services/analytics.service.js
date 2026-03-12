import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';

export async function getDashboardSummary() {
  const [totalUsers, totalProducts, totalOrders, deliveredAggregate, recentOrders] =
    await Promise.all([
      User.countDocuments({}),
      Product.countDocuments({}),
      Order.countDocuments({}),
      Order.aggregate([
        { $match: { orderStatus: ORDER_STATUS.DELIVERED } },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$totalAmount' }
          }
        }
      ]),
      Order.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email')
    ]);

  const totalRevenue = deliveredAggregate.length ? deliveredAggregate[0].revenue : 0;

  const statusCounts = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 }
      }
    }
  ]);

  const statusMap = {};
  for (const s of statusCounts) {
    statusMap[s._id] = s.count;
  }

  return {
    summary: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    },
    statusCounts: statusMap,
    recentOrders
  };
}

export async function getTopProducts(limit = 5) {
  const agg = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        orderCount: { $sum: 1 },
        quantitySold: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.lineTotal' }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: limit }
  ]);

  const productIds = agg.map((a) => a._id);
  const products = await Product.find({ _id: { $in: productIds } }).select('name image price');

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  return agg.map((a) => ({
    product: productMap.get(a._id.toString()),
    metrics: {
      orderCount: a.orderCount,
      quantitySold: a.quantitySold,
      revenue: a.revenue
    }
  }));
}

export async function getOrderStats() {
  const byStatus = await Order.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    }
  ]);

  const byDay = await Order.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return {
    byStatus,
    byDay
  };
}


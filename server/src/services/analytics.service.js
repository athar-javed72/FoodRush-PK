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

/** Start of day in local date (UTC midnight would need server TZ; using startOfDay UTC for consistency) */
function startOfDayUTC(d) {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

/**
 * Analytics overview for admin: today's orders, weekly revenue, repeat customer %.
 * All values are derived from real Order/User data.
 */
export async function getAnalyticsOverview() {
  const now = new Date();
  const todayStart = startOfDayUTC(now);
  const todayEnd = new Date(todayStart);
  todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);
  const yesterdayEnd = new Date(todayStart);
  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);

  const [todayOrders, yesterdayOrders, weeklyAggregate, repeatAggregate] = await Promise.all([
    Order.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    }),
    Order.countDocuments({
      createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd }
    }),
    Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo, $lt: todayEnd } } },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      }
    ]),
    Order.aggregate([
      { $group: { _id: '$user', orderCount: { $sum: 1 } } },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          repeatCustomers: { $sum: { $cond: [{ $gte: ['$orderCount', 2] }, 1, 0] } }
        }
      }
    ])
  ]);

  const weeklyRevenue = weeklyAggregate.length ? weeklyAggregate[0].revenue : 0;
  const totalCustomersWithOrders = repeatAggregate.length ? repeatAggregate[0].totalCustomers : 0;
  const repeatCustomers = repeatAggregate.length ? repeatAggregate[0].repeatCustomers : 0;
  const repeatCustomerPercent =
    totalCustomersWithOrders > 0
      ? Math.round((repeatCustomers / totalCustomersWithOrders) * 100)
      : 0;

  const yesterdayTotal = yesterdayOrders || 1;
  const todayVsYesterdayPercent =
    yesterdayOrders === 0
      ? (todayOrders > 0 ? 100 : 0)
      : Math.round(((todayOrders - yesterdayOrders) / yesterdayTotal) * 100);

  return {
    todayOrderCount: todayOrders,
    yesterdayOrderCount: yesterdayOrders,
    todayVsYesterdayPercent,
    weeklyRevenue,
    repeatCustomerPercent,
    totalCustomersWithOrders
  };
}


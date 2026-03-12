import { Review } from '../models/Review.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';

async function userHasPurchasedProduct(userId, productId) {
  const order = await Order.findOne({
    user: userId,
    orderStatus: ORDER_STATUS.DELIVERED,
    'items.product': productId
  }).select('_id');

  return !!order;
}

async function recalculateProductRating(productId) {
  const result = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (!result.length) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      reviewCount: 0
    });
    return;
  }

  const { avgRating, count } = result[0];
  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(avgRating * 10) / 10,
    reviewCount: count
  });
}

export async function createOrUpdateReview(userId, { productId, rating, comment }) {
  const purchased = await userHasPurchasedProduct(userId, productId);
  if (!purchased) {
    const err = new Error('You can only review products you have purchased and received');
    err.statusCode = 400;
    throw err;
  }

  const review = await Review.findOneAndUpdate(
    { user: userId, product: productId },
    { rating, comment },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await recalculateProductRating(productId);
  return review;
}

export async function getProductReviews(productId) {
  return Review.find({ product: productId })
    .sort({ createdAt: -1 })
    .populate('user', 'name');
}

export async function getAllReviews() {
  return Review.find({})
    .sort({ createdAt: -1 })
    .populate('user', 'name email')
    .populate('product', 'name');
}

export async function deleteReview(reviewId) {
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) {
    const err = new Error('Review not found');
    err.statusCode = 404;
    throw err;
  }

  await recalculateProductRating(review.product);
  return review;
}


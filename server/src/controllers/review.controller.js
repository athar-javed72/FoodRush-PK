import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import {
  createOrUpdateReview,
  getProductReviews,
  getAllReviews,
  deleteReview
} from '../services/review.service.js';

export const createReviewController = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  const review = await createOrUpdateReview(req.user.id, { productId, rating, comment });
  return successResponse(res, {
    statusCode: 201,
    message: 'Review submitted successfully',
    data: { review }
  });
});

export const getProductReviewsController = asyncHandler(async (req, res) => {
  const reviews = await getProductReviews(req.params.productId);
  return successResponse(res, {
    message: 'Product reviews fetched successfully',
    data: { reviews }
  });
});

export const getAllReviewsController = asyncHandler(async (_req, res) => {
  const reviews = await getAllReviews();
  return successResponse(res, {
    message: 'All reviews fetched successfully',
    data: { reviews }
  });
});

export const deleteReviewController = asyncHandler(async (req, res) => {
  await deleteReview(req.params.id);
  return successResponse(res, {
    message: 'Review deleted successfully',
    data: {}
  });
});


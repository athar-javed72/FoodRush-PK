import express from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createReviewController,
  getProductReviewsController,
  getAllReviewsController,
  deleteReviewController
} from '../controllers/review.controller.js';
import { createReviewSchema } from '../validators/review.validator.js';

const router = express.Router();

// Customer: create/update review for purchased products
router.post('/', authMiddleware, validate(createReviewSchema), createReviewController);

// Public: product reviews
router.get('/product/:productId', getProductReviewsController);

// Admin: list and delete
router.get('/', authMiddleware, adminMiddleware, getAllReviewsController);
router.delete('/:id', authMiddleware, adminMiddleware, deleteReviewController);

export default router;


import express from 'express';
import {
  getProducts,
  getProduct,
  createProductController,
  updateProductController,
  deleteProductController
} from '../controllers/product.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema } from '../validators/product.validator.js';

const router = express.Router();

// Public listing & details
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin product management
router.post('/', authMiddleware, adminMiddleware, validate(createProductSchema), createProductController);
router.put('/:id', authMiddleware, adminMiddleware, validate(updateProductSchema), updateProductController);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProductController);

export default router;


import express from 'express';
import {
  getCategories,
  getCategory,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController
} from '../controllers/category.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator.js';

const router = express.Router();

// Public
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin
router.post('/', authMiddleware, adminMiddleware, validate(createCategorySchema), createCategoryController);
router.put('/:id', authMiddleware, adminMiddleware, validate(updateCategorySchema), updateCategoryController);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategoryController);

export default router;


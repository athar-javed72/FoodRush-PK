import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  listCategories
} from '../services/category.service.js';

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await listCategories();
  return successResponse(res, {
    message: 'Categories fetched successfully',
    data: { categories }
  });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await getCategoryById(req.params.id);
  return successResponse(res, {
    message: 'Category fetched successfully',
    data: { category }
  });
});

export const createCategoryController = asyncHandler(async (req, res) => {
  const category = await createCategory(req.body);
  return successResponse(res, {
    statusCode: 201,
    message: 'Category created successfully',
    data: { category }
  });
});

export const updateCategoryController = asyncHandler(async (req, res) => {
  const category = await updateCategory(req.params.id, req.body);
  return successResponse(res, {
    message: 'Category updated successfully',
    data: { category }
  });
});

export const deleteCategoryController = asyncHandler(async (req, res) => {
  await deleteCategory(req.params.id);
  return successResponse(res, {
    message: 'Category deleted successfully',
    data: {}
  });
});


import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  listProducts
} from '../services/product.service.js';

export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    all
  } = req.query;

  const includeUnavailable = all === 'true' && req.user?.role === 'admin';

  const result = await listProducts({
    page: Number(page) || 1,
    limit: Number(limit) || 12,
    search,
    category,
    minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
    maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
    sort,
    includeUnavailable: !!includeUnavailable
  });

  return successResponse(res, {
    message: 'Products fetched successfully',
    data: result
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  return successResponse(res, {
    message: 'Product fetched successfully',
    data: { product }
  });
});

export const createProductController = asyncHandler(async (req, res) => {
  const product = await createProduct(req.body);
  return successResponse(res, {
    statusCode: 201,
    message: 'Product created successfully',
    data: { product }
  });
});

export const updateProductController = asyncHandler(async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);
  return successResponse(res, {
    message: 'Product updated successfully',
    data: { product }
  });
});

export const deleteProductController = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);
  return successResponse(res, {
    message: 'Product deleted successfully',
    data: {}
  });
});


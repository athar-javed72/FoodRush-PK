import { Product } from '../models/Product.js';

export async function createProduct(payload) {
  const slug = payload.slug || payload.name.toLowerCase().replace(/\s+/g, '-');
  const product = await Product.create({
    ...payload,
    slug
  });
  return product;
}

export async function updateProduct(id, updates) {
  if (updates.name && !updates.slug) {
    updates.slug = updates.name.toLowerCase().replace(/\s+/g, '-');
  }
  const product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  }).populate('category', 'name slug');

  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
}

export async function deleteProduct(id) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
}

export async function getProductById(id) {
  const product = await Product.findById(id).populate('category', 'name slug');
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
}

export async function listProducts({
  page = 1,
  limit = 12,
  search,
  category,
  minPrice,
  maxPrice,
  sort
}) {
  const filter = { isAvailable: true };

  if (category) {
    filter.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const sortOptions = {};
  if (sort === 'price_asc') sortOptions.price = 1;
  else if (sort === 'price_desc') sortOptions.price = -1;
  else if (sort === 'newest') sortOptions.createdAt = -1;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
}


import { Category } from '../models/Category.js';

export async function createCategory(payload) {
  const slug = payload.slug || payload.name.toLowerCase().replace(/\s+/g, '-');
  const category = await Category.create({
    ...payload,
    slug
  });
  return category;
}

export async function updateCategory(id, updates) {
  if (updates.name && !updates.slug) {
    updates.slug = updates.name.toLowerCase().replace(/\s+/g, '-');
  }
  const category = await Category.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  });
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  return category;
}

export async function deleteCategory(id) {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  return category;
}

export async function getCategoryById(id) {
  const category = await Category.findById(id);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  return category;
}

export async function listCategories(opts = {}) {
  const filter = opts.includeInactive ? {} : { isActive: true };
  return Category.find(filter).sort({ name: 1 });
}


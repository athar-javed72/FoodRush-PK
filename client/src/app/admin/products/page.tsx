"use client";

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/EmptyState';
import { apiClient } from '@/api/client';
import { Loader } from '@/components/ui/loader';
import { ProductImage } from '@/components/ProductImage';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string | null;
  category?: Category;
  isAvailable?: boolean;
}

export default function AdminProductsPage() {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories?all=true');
      setCategories(res.data?.data?.categories || []);
    } catch (_) {
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/products?all=true&limit=500');
      const data = res.data?.data;
      setProducts(data?.items || data?.products || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleOpen = () => {
    setName('');
    setDescription('');
    setCategoryId(categories[0]?._id || '');
    setPrice('');
    setImage('');
    setFormError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormError(null);
  };

  const validate = (): boolean => {
    if (!name.trim() || name.trim().length < 2) {
      setFormError('Name must be at least 2 characters.');
      return false;
    }
    if (!description.trim() || description.trim().length < 5) {
      setFormError('Description must be at least 5 characters.');
      return false;
    }
    if (!categoryId) {
      setFormError('Please select a category.');
      return false;
    }
    const p = Number(price);
    if (Number.isNaN(p) || p < 0) {
      setFormError('Price must be a valid number ≥ 0.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, GIF, WebP).');
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = res.data?.data?.url;
      if (url) {
        setImage(url);
        toast.success('Image uploaded');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      setFormError(null);
      await apiClient.post('/products', {
        name: name.trim(),
        description: description.trim(),
        category: categoryId,
        price: Number(price),
        image: image.trim() || undefined,
        isAvailable: true
      });
      toast.success('Product created');
      await fetchProducts();
      handleClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to save product';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailable = async (p: Product) => {
    try {
      await apiClient.put(`/products/${p._id}`, { isAvailable: !(p.isAvailable !== false) });
      toast.success(p.isAvailable !== false ? 'Product hidden' : 'Product active');
      await fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (p: Product) => {
    if (typeof window !== 'undefined' && !window.confirm(`Delete product "${p.name}"?`)) return;
    try {
      await apiClient.delete(`/products/${p._id}`);
      await fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage the dishes available across your FoodRush menu.
          </p>
        </div>
        <Button size="sm" onClick={handleOpen} disabled={categories.length === 0}>
          Add product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Product catalogue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Search by product name..."
              className="sm:max-w-xs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {loading && <Loader className="my-6" />}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!loading && !error && filtered.length === 0 && (
            <EmptyState
              title="No products match your search"
              message="Try a different name or add your first product."
            />
          )}
          {!loading && !error && filtered.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>
                      <div className="relative h-10 w-10 overflow-hidden rounded border bg-muted">
                        <ProductImage src={p.image} alt={p.name} className="h-full w-full" />
                      </div>
                    </TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {p.category?.name ?? '—'}
                    </TableCell>
                    <TableCell>Rs. {p.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={p.isAvailable !== false ? 'default' : 'outline'}>
                          {p.isAvailable !== false ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleToggleAvailable(p)}
                        >
                          Toggle
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(p)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        title="Add product"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          {formError && <p className="text-red-500 text-xs">{formError}</p>}
          <div className="space-y-1">
            <label className="text-xs font-medium">Name</label>
            <Input
              placeholder="e.g. Classic beef burger"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Description</label>
            <Input
              placeholder="Short description (min 5 characters)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Category</label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Price (Rs.)</label>
            <Input
              type="number"
              min={0}
              step={1}
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Image – URL or upload</label>
            <Input
              placeholder="https://... or upload below"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <div className="flex items-center gap-2 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? 'Uploading…' : 'Upload from device'}
              </Button>
            </div>
            {image && (
              <div className="mt-2 relative h-20 w-20 rounded border overflow-hidden bg-muted">
                <img src={image} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

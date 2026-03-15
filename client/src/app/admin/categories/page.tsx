"use client";

import { useState, useEffect } from 'react';
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

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive?: boolean;
}

export default function AdminCategoriesPage() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/categories?all=true');
      setCategories(res.data?.data?.categories || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === name.toLowerCase().replace(/\s+/g, '-')) {
      setSlug(value.toLowerCase().replace(/\s+/g, '-'));
    }
  };

  const handleOpen = () => {
    setName('');
    setSlug('');
    setFormError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormError(null);
  };

  const validate = (): boolean => {
    const n = name.trim();
    if (!n || n.length < 2) {
      setFormError('Name must be at least 2 characters.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      setFormError(null);
      await apiClient.post('/categories', {
        name: name.trim(),
        slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-'),
        isActive: true
      });
      await fetchCategories();
      handleClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Failed to save category';
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      await apiClient.put(`/categories/${cat._id}`, { isActive: !(cat.isActive !== false) });
      toast.success(cat.isActive !== false ? 'Category set inactive' : 'Category set active');
      await fetchCategories();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update category';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (typeof window !== 'undefined' && !window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await apiClient.delete(`/categories/${cat._id}`);
      toast.success('Category deleted');
      await fetchCategories();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete category';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Organise the menu into clear, appetising groups.
          </p>
        </div>
        <Button size="sm" onClick={handleOpen}>
          Add category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">All categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading && <Loader className="my-6" />}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!loading && !error && categories.length === 0 && (
            <EmptyState
              title="No categories yet"
              message="Create your first category to start organising products."
            />
          )}
          {!loading && !error && categories.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat._id}>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{cat.slug}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={cat.isActive !== false ? 'default' : 'outline'}>
                          {cat.isActive !== false ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleToggleActive(cat)}
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
                        onClick={() => handleDelete(cat)}
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
        title="Add category"
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
              placeholder="e.g. Burgers"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Slug (optional)</label>
            <Input
              placeholder="e.g. burgers"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

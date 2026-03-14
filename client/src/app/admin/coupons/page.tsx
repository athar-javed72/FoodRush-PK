"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/EmptyState';
import { apiClient } from '@/api/client';
import { Loader } from '@/components/ui/loader';

interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  expiryDate: string;
  isActive: boolean;
}

const defaultForm = {
  code: '',
  discountType: 'percentage' as 'percentage' | 'fixed',
  discountValue: '',
  minOrderAmount: '0',
  expiryDate: '',
  isActive: true
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/coupons');
      setCoupons(res.data?.data?.coupons ?? []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load coupons');
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setFormError(null);
    setOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: String(c.discountValue),
      minOrderAmount: String(c.minOrderAmount ?? 0),
      expiryDate: c.expiryDate ? c.expiryDate.slice(0, 10) : '',
      isActive: c.isActive
    });
    setFormError(null);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
    setFormError(null);
  };

  const validate = (): boolean => {
    if (!form.code.trim()) {
      setFormError('Code is required.');
      return false;
    }
    const val = Number(form.discountValue);
    if (Number.isNaN(val) || val < 0) {
      setFormError('Discount value must be a number ≥ 0.');
      return false;
    }
    if (form.discountType === 'percentage' && val > 100) {
      setFormError('Percentage discount cannot exceed 100.');
      return false;
    }
    const minOrder = Number(form.minOrderAmount);
    if (Number.isNaN(minOrder) || minOrder < 0) {
      setFormError('Minimum order amount must be ≥ 0.');
      return false;
    }
    if (!editing && !form.expiryDate) {
      setFormError('Expiry date is required.');
      return false;
    }
    if (form.expiryDate && new Date(form.expiryDate) <= new Date()) {
      setFormError('Expiry date must be in the future.');
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
      const payload: Record<string, unknown> = {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        isActive: form.isActive
      };
      if (form.expiryDate) payload.expiryDate = new Date(form.expiryDate).toISOString();
      if (editing) {
        await apiClient.put(`/coupons/${editing._id}`, payload);
      } else {
        if (!form.expiryDate) {
          setFormError('Expiry date is required for new coupons.');
          return;
        }
        await apiClient.post('/coupons', payload);
      }
      await fetchCoupons();
      closeModal();
    } catch (err: any) {
      setFormError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          'Failed to save coupon'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon? This cannot be undone.')) return;
    try {
      setDeletingId(id);
      await apiClient.delete(`/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete coupon');
    } finally {
      setDeletingId(null);
    }
  };

  const discountLabel = (c: Coupon) => {
    if (c.discountType === 'percentage') return `${c.discountValue}% off`;
    return `Rs. ${c.discountValue} off`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Coupons</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage promo codes to reward loyal customers.
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          Create coupon
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Active & archived coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <Loader className="my-6" />}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!loading && !error && coupons.length === 0 && (
            <EmptyState
              title="No coupons yet"
              message="Add a coupon to run limited-time offers and rewards."
            />
          )}
          {!loading && !error && coupons.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Min order</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-mono text-xs">{c.code}</TableCell>
                    <TableCell>{discountLabel(c)}</TableCell>
                    <TableCell>Rs. {c.minOrderAmount ?? 0}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.isActive ? 'success' : 'outline'}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => openEdit(c)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-red-600"
                          onClick={() => handleDelete(c._id)}
                          disabled={deletingId === c._id}
                        >
                          {deletingId === c._id ? '…' : 'Delete'}
                        </Button>
                      </div>
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
        onClose={closeModal}
        title={editing ? 'Edit coupon' : 'Create coupon'}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={closeModal} disabled={saving}>
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
            <label className="text-xs font-medium">Code</label>
            <Input
              placeholder="e.g. WELCOME10"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              disabled={!!editing}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">Discount type</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={form.discountType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, discountType: e.target.value as 'percentage' | 'fixed' }))
                }
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed amount</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">
                Value {form.discountType === 'percentage' ? '(%)' : '(Rs.)'}
              </label>
              <Input
                type="number"
                min={0}
                step={form.discountType === 'percentage' ? 1 : 10}
                value={form.discountValue}
                onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Minimum order (Rs.)</label>
            <Input
              type="number"
              min={0}
              value={form.minOrderAmount}
              onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Expiry date</label>
            <Input
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
              min={editing ? undefined : new Date().toISOString().slice(0, 10)}
            />
          </div>
          {editing && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="rounded border-input"
              />
              <label htmlFor="isActive" className="text-xs font-medium">
                Active
              </label>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

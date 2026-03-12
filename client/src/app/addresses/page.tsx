"use client";

import { useEffect, useState, FormEvent } from 'react';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { EmptyState } from '@/components/EmptyState';

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  city: string;
  area: string;
  streetAddress: string;
  landmark?: string;
  postalCode: string;
  label?: string;
  isDefault?: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<Address, '_id'>>({
    fullName: '',
    phone: '',
    city: '',
    area: '',
    streetAddress: '',
    landmark: '',
    postalCode: '',
    label: '',
    isDefault: false
  });

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/addresses');
      setAddresses(res.data.data.addresses || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      fullName: '',
      phone: '',
      city: '',
      area: '',
      streetAddress: '',
      landmark: '',
      postalCode: '',
      label: '',
      isDefault: false
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      if (editingId) {
        await apiClient.put(`/addresses/${editingId}`, form);
      } else {
        await apiClient.post('/addresses', form);
      }
      resetForm();
      await loadAddresses();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (addr: Address) => {
    setEditingId(addr._id);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      city: addr.city,
      area: addr.area,
      streetAddress: addr.streetAddress,
      landmark: addr.landmark || '',
      postalCode: addr.postalCode,
      label: addr.label || '',
      isDefault: !!addr.isDefault
    });
  };

  const handleDelete = async (id: string) => {
    try {
      setSaving(true);
      await apiClient.delete(`/addresses/${id}`);
      if (editingId === id) resetForm();
      await loadAddresses();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete address');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container py-6">
        <h1 className="mb-4 text-2xl font-semibold">Delivery addresses</h1>
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <div className="grid gap-6 md:grid-cols-[2fr,1.2fr]">
          <section className="space-y-3">
            {loading && <Loader className="my-4" />}
            {!loading && addresses.length === 0 && (
              <EmptyState
                title="No saved addresses yet"
                message="Save your favourite delivery locations so checkout is even faster next time."
              />
            )}
            {!loading &&
              addresses.map((addr) => (
                <Card key={addr._id}>
                  <CardContent className="flex items-start justify-between gap-3 py-3 text-sm">
                    <div>
                      <p className="font-medium">
                        {addr.fullName}{' '}
                        {addr.label && (
                          <span className="text-xs text-muted-foreground">({addr.label})</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {addr.streetAddress}, {addr.area}, {addr.city}
                      </p>
                      <p className="text-xs text-muted-foreground">Phone: {addr.phone}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2"
                        onClick={() => handleEdit(addr)}
                        disabled={saving}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-destructive"
                        onClick={() => handleDelete(addr._id)}
                        disabled={saving}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {editingId ? 'Update address' : 'Add a new address'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3 text-sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Full name</label>
                      <Input
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Phone</label>
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">City</label>
                      <Input
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Area</label>
                      <Input
                        value={form.area}
                        onChange={(e) => setForm({ ...form, area: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Street address</label>
                    <Input
                      value={form.streetAddress}
                      onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Landmark (optional)</label>
                      <Input
                        value={form.landmark}
                        onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Postal code</label>
                      <Input
                        value={form.postalCode}
                        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Label (e.g. Home, Office)</label>
                    <Input
                      value={form.label}
                      onChange={(e) => setForm({ ...form, label: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Button type="submit" disabled={saving} size="sm">
                      {saving ? 'Saving...' : editingId ? 'Update address' : 'Save address'}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={resetForm}
                        disabled={saving}
                      >
                        Cancel edit
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </>
  );
}


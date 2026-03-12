"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiClient.get('/admin/dashboard');
        setData(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <Header />
      <main className="container py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin dashboard</h1>
          <nav className="flex gap-3 text-xs">
            <Link href="/admin/categories" className="underline">
              Categories
            </Link>
            <Link href="/admin/products" className="underline">
              Products
            </Link>
            <Link href="/admin/orders" className="underline">
              Orders
            </Link>
            <Link href="/admin/coupons" className="underline">
              Coupons
            </Link>
            <Link href="/admin/analytics" className="underline">
              Analytics
            </Link>
          </nav>
        </div>
        {loading && <p>Loading dashboard...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && data && (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-md border bg-card p-4 text-sm">
              <p className="text-xs text-muted-foreground">Total users</p>
              <p className="text-xl font-semibold">{data.summary.totalUsers}</p>
            </div>
            <div className="rounded-md border bg-card p-4 text-sm">
              <p className="text-xs text-muted-foreground">Total products</p>
              <p className="text-xl font-semibold">{data.summary.totalProducts}</p>
            </div>
            <div className="rounded-md border bg-card p-4 text-sm">
              <p className="text-xs text-muted-foreground">Total orders</p>
              <p className="text-xl font-semibold">{data.summary.totalOrders}</p>
            </div>
            <div className="rounded-md border bg-card p-4 text-sm">
              <p className="text-xs text-muted-foreground">Total revenue</p>
              <p className="text-xl font-semibold">Rs. {data.summary.totalRevenue}</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}


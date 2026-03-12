"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';

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
        {loading && <Loader className="my-6" />}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && data && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Total users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{data.summary.totalUsers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Total products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{data.summary.totalProducts}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Total orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{data.summary.totalOrders}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Total revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">Rs. {data.summary.totalRevenue}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}


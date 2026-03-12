"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiClient.get('/orders/my-orders');
        setOrders(res.data.data.orders || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load orders');
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
        <h1 className="mb-4 text-2xl font-semibold">Your orders</h1>
        {loading && <p>Loading orders...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !orders.length && (
          <p className="text-sm text-muted-foreground">You have not placed any orders yet.</p>
        )}
        {!loading && orders.length > 0 && (
          <div className="space-y-3 text-sm">
            {orders.map((order) => (
              <article
                key={order._id}
                className="flex items-center justify-between rounded-md border bg-card p-3"
              >
                <div>
                  <p className="font-medium">
                    Order #{order._id.slice(-6)} • {order.orderStatus}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()} • {order.items.length} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">Rs. {order.totalAmount}</p>
                  <Link
                    href={`/orders/${order._id}`}
                    className="text-xs text-primary underline underline-offset-2"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}


"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { Loader } from '@/components/ui/loader';

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
        {loading && <Loader className="my-6" />}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !orders.length && (
          <EmptyState
            title="No orders yet"
            message="Once you place an order, you’ll see its history and status here."
            actionLabel="Browse the menu"
            actionHref="/menu"
          />
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
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString()} • {order.items.length} items
                  </p>
                </div>
                <div className="text-right">
                  <div className="mb-1 flex justify-end">
                    <Badge variant="outline" className="text-[10px]">
                      {order.orderStatus}
                    </Badge>
                  </div>
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


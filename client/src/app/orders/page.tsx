"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { useAppSelector } from '@/app/store';
import { apiClient } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { OrdersListSkeleton } from '@/components/ui/OrdersListSkeleton';
import { motion } from 'framer-motion';

function statusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
  const s = (status || '').toLowerCase();
  if (s.includes('delivered')) return 'default';
  if (s.includes('cancel') || s.includes('failed')) return 'destructive';
  return 'secondary';
}

export default function OrdersPage() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
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
  }, [user, router]);

  return (
    <>
      <Header />
      <main className="container py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">Your orders</h1>
        {loading && <OrdersListSkeleton />}
        {error && (
          <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
        {!loading && !orders.length && !error && (
          <EmptyState
            title="No orders yet"
            message="Once you place an order, you’ll see its history and status here."
            actionLabel="Browse the menu"
            actionHref="/menu"
          />
        )}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.article
                key={order._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()} · {(order.items || []).length} items
                    </p>
                    {order.items?.length > 0 && (
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {order.items.map((it: any) => it.product?.name || it.name).filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3 sm:justify-end sm:border-t-0 sm:pt-0">
                    <Badge variant={statusVariant(order.orderStatus)} className="capitalize">
                      {order.orderStatus}
                    </Badge>
                    <p className="text-lg font-semibold">Rs. {order.totalAmount}</p>
                    <Link href={`/orders/${order._id}`} className="w-full sm:w-auto">
                      <Button variant="default" size="sm" className="w-full sm:w-auto">
                        View Order
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}


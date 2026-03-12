"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { EmptyState } from '@/components/EmptyState';

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiClient.get(`/orders/${id}`);
        setOrder(res.data.data.order);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  return (
    <>
      <Header />
      <main className="container py-6">
        {loading && <Loader className="my-6" />}
        {error && (
          <EmptyState
            title="We couldn't load this order"
            message={error}
            actionLabel="Back to orders"
            actionHref="/orders"
          />
        )}
        {!loading && !error && order && (
          <div className="space-y-4 text-sm">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order #{order._id.slice(-6)}</CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  {order.orderStatus}
                </Badge>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-[1.2fr,1.3fr]">
                <section className="space-y-3">
                  <h2 className="text-xs font-semibold uppercase text-muted-foreground">
                    Order progress
                  </h2>
                  <ol className="space-y-2">
                    {['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map(
                      (status, index) => {
                        const currentIndex = [
                          'Pending',
                          'Confirmed',
                          'Preparing',
                          'Out for Delivery',
                          'Delivered',
                          'Cancelled'
                        ].indexOf(order.orderStatus);
                        const isCompleted = index <= currentIndex && order.orderStatus !== 'Cancelled';
                        const isCurrent = status === order.orderStatus;

                        return (
                          <li key={status} className="flex items-center gap-3 text-xs">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] ${
                                isCompleted
                                  ? 'border-emerald-500 bg-emerald-500 text-white'
                                  : isCurrent
                                  ? 'border-primary text-primary'
                                  : 'border-muted text-muted-foreground'
                              }`}
                            >
                              {index + 1}
                            </span>
                            <span
                              className={
                                isCompleted || isCurrent ? 'font-medium' : 'text-muted-foreground'
                              }
                            >
                              {status}
                            </span>
                          </li>
                        );
                      }
                    )}
                    {order.orderStatus === 'Cancelled' && (
                      <li className="flex items-center gap-3 text-xs">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-destructive bg-destructive/10 text-[10px] text-destructive">
                          ✕
                        </span>
                        <span className="font-medium text-destructive">Cancelled</span>
                      </li>
                    )}
                  </ol>
                </section>

                <section className="space-y-4">
                  <div>
                    <h2 className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                      Items
                    </h2>
                    <ul className="space-y-1">
                      {order.items.map((item: any, idx: number) => (
                        <li key={idx} className="flex justify-between">
                          <span>
                            {item.nameSnapshot} x {item.quantity}
                          </span>
                          <span>Rs. {item.lineTotal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                      Delivery address
                    </h2>
                    <p>
                      {order.addressSnapshot.fullName} – {order.addressSnapshot.streetAddress},{' '}
                      {order.addressSnapshot.area}, {order.addressSnapshot.city}
                    </p>
                  </div>
                  <div>
                    <h2 className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                      Payment summary
                    </h2>
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>Rs. {order.subtotalAmount}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Discount</span>
                      <span>- Rs. {order.discountAmount}</span>
                    </div>
                    <div className="mt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>Rs. {order.totalAmount}</span>
                    </div>
                  </div>
                </section>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}


"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';

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
        {loading && <p>Loading order...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && order && (
          <div className="space-y-4 text-sm">
            <h1 className="text-2xl font-semibold">Order #{order._id.slice(-6)}</h1>
            <p className="text-muted-foreground">
              Status: <span className="font-medium">{order.orderStatus}</span>
            </p>
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
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
            </section>
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
                Delivery address
              </h2>
              <p>
                {order.addressSnapshot.fullName} – {order.addressSnapshot.streetAddress},{' '}
                {order.addressSnapshot.area}, {order.addressSnapshot.city}
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
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
            </section>
          </div>
        )}
      </main>
    </>
  );
}


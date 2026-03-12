"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { fetchCart, updateCartItem, removeCartItem } from '@/features/cart/cartSlice';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, subtotal, discountAmount, totalAmount, loading, error } = useAppSelector(
    (s) => s.cart
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (itemId: string, quantity: number) => {
    dispatch(updateCartItem({ itemId, quantity }));
  };

  const handleRemove = (itemId: string) => {
    dispatch(removeCartItem({ itemId }));
  };

  const isEmpty = !items.length;

  return (
    <>
      <Header />
      <main className="container py-6">
        <h1 className="mb-4 text-2xl font-semibold">Your cart</h1>
        {loading && <p>Loading cart...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && isEmpty && (
          <p className="text-sm text-muted-foreground">
            Your cart is empty.{' '}
            <Link href="/menu" className="text-primary underline">
              Browse the menu
            </Link>
            .
          </p>
        )}
        {!loading && !isEmpty && (
          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            <section className="space-y-3">
              {items.map((item) => (
                <article
                  key={item._id}
                  className="flex items-center justify-between rounded-md border bg-card p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Rs. {item.priceSnapshot} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      className="w-16 rounded-md border px-2 py-1 text-xs"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleRemove(item._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </article>
              ))}
            </section>
            <aside className="space-y-2 rounded-md border bg-card p-4 text-sm">
              <h2 className="mb-2 text-base font-semibold">Summary</h2>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Discount</span>
                <span>- Rs. {discountAmount}</span>
              </div>
              <div className="mt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs. {totalAmount}</span>
              </div>
              <Link href="/checkout">
                <Button className="mt-4 w-full" disabled={isEmpty}>
                  Proceed to checkout
                </Button>
              </Link>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}


"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { fetchCart, updateCartItem, removeCartItem } from '@/features/cart/cartSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/EmptyState';
import { Loader } from '@/components/ui/loader';
import { motion, AnimatePresence } from 'framer-motion';

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
        {loading && <Loader className="my-6" />}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && isEmpty && (
          <EmptyState
            title="Your cart is empty"
            message="Add a few delicious items from the menu to get started."
            actionLabel="Browse the menu"
            actionHref="/menu"
          />
        )}
        {!loading && !isEmpty && (
          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            <section className="space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.article
                    key={item._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    layout
                    className="flex items-center justify-between rounded-md border bg-card p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Rs. {item.priceSnapshot} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        className="h-8 w-16 px-2 py-1 text-xs"
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
                  </motion.article>
                ))}
              </AnimatePresence>
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


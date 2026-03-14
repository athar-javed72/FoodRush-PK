"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { fetchCart, updateCartItem, removeCartItem } from '@/features/cart/cartSlice';
import {
  updateGuestCartQuantity,
  removeFromGuestCart
} from '@/features/guestCart/guestCartSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/EmptyState';
import { Loader } from '@/components/ui/loader';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductImage } from '@/components/ProductImage';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { items, subtotal, discountAmount, totalAmount, loading, error } = useAppSelector(
    (s) => s.cart
  );
  const guestItems = useAppSelector((s) => s.guestCart);

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [dispatch, user]);

  const isGuest = !user;
  const displayItems = isGuest
    ? guestItems.map((g) => ({
        _id: g.productId,
        product: { _id: g.productId, name: g.name, price: g.price, image: g.image },
        quantity: g.quantity,
        priceSnapshot: g.price,
        itemTotal: g.price * g.quantity
      }))
    : items;
  const displaySubtotal = isGuest
    ? guestItems.reduce((sum, g) => sum + g.price * g.quantity, 0)
    : subtotal;
  const displayTotal = isGuest ? displaySubtotal : totalAmount;
  const displayDiscount = isGuest ? 0 : discountAmount;
  const isEmpty = isGuest ? !guestItems.length : !items.length;
  const showLoading = !isGuest && loading;

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (isGuest) {
      dispatch(updateGuestCartQuantity({ productId: itemId, quantity }));
    } else {
      dispatch(updateCartItem({ itemId, quantity }));
    }
  };

  const handleRemove = (itemId: string) => {
    if (isGuest) {
      dispatch(removeFromGuestCart(itemId));
    } else {
      dispatch(removeCartItem({ itemId }));
    }
  };

  return (
    <>
      <Header />
      <main className="container py-6">
        <h1 className="mb-4 text-2xl font-semibold">Your cart</h1>
        {showLoading && <Loader className="my-6" />}
        {!isGuest && error && <p className="text-sm text-red-500">{error}</p>}
        {!showLoading && isEmpty && (
          <EmptyState
            title="Your cart is empty"
            message="Add a few delicious items from the menu to get started."
            actionLabel="Browse the menu"
            actionHref="/menu"
          />
        )}
        {!showLoading && !isEmpty && (
          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            <section className="space-y-3">
              <AnimatePresence initial={false}>
                {displayItems.map((item) => {
                  const imgSrc =
                    item.product?.image && item.product.image.startsWith('http')
                      ? item.product.image
                      : PLACEHOLDER_IMAGE;
                  return (
                    <motion.article
                      key={item._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      layout
                      className="flex items-center gap-3 rounded-md border bg-card p-3 text-sm"
                    >
                      <Link
                        href={`/products/${item.product?._id}`}
                        className="relative h-14 w-14 shrink-0 overflow-hidden rounded border bg-muted"
                      >
                        <img
                          src={imgSrc}
                          alt={item.product?.name ?? ''}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link href={`/products/${item.product?._id}`}>
                          <p className="font-medium truncate">{item.product?.name}</p>
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          Rs. {item.priceSnapshot} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Input
                          type="number"
                          min={1}
                          className="h-8 w-16 px-2 py-1 text-xs"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item._id, Number(e.target.value))
                          }
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
                  );
                })}
              </AnimatePresence>
            </section>
            <aside className="space-y-2 rounded-md border bg-card p-4 text-sm">
              <h2 className="mb-2 text-base font-semibold">Summary</h2>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {displaySubtotal}</span>
              </div>
              {displayDiscount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span>- Rs. {displayDiscount}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs. {displayTotal}</span>
              </div>
              {isGuest ? (
                <Link href="/login?returnUrl=/checkout">
                  <Button className="mt-4 w-full">Sign in to checkout</Button>
                </Link>
              ) : (
                <Link href="/checkout">
                  <Button className="mt-4 w-full" disabled={isEmpty}>
                    Proceed to checkout
                  </Button>
                </Link>
              )}
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

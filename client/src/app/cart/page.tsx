"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
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
import { CartSkeleton } from '@/components/ui/CartSkeleton';
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
      toast.success('Removed from cart');
    } else {
      dispatch(removeCartItem({ itemId }))
        .unwrap()
        .then(() => toast.success('Removed from cart'))
        .catch((msg: string) => toast.error(msg || 'Failed to remove'));
    }
  };

  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Your cart</h1>
          {!showLoading && !isEmpty && (
            <Link href="/menu">
              <Button variant="outline" size="sm">
                Continue Shopping
              </Button>
            </Link>
          )}
        </div>
        {showLoading && <CartSkeleton />}
        {!isGuest && error && (
          <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
        {!showLoading && isEmpty && (
          <EmptyState
            title="Your cart is empty"
            message="Add a few delicious items from the menu to get started."
            actionLabel="Browse the menu"
            actionHref="/menu"
          />
        )}
        {!showLoading && !isEmpty && (
          <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
            <section className="space-y-4">
              <AnimatePresence initial={false} mode="popLayout">
                {displayItems.map((item) => {
                  const imgSrc =
                    item.product?.image && item.product.image.startsWith('http')
                      ? item.product.image
                      : PLACEHOLDER_IMAGE;
                  return (
                    <motion.article
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
                    >
                      <Link
                        href={`/products/${item.product?._id}`}
                        className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:h-20 sm:w-24"
                      >
                        <img
                          src={imgSrc}
                          alt={item.product?.name ?? ''}
                          className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link href={`/products/${item.product?._id}`}>
                          <p className="font-semibold truncate">{item.product?.name}</p>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Rs. {item.priceSnapshot} × {item.quantity} = Rs. {item.itemTotal ?? item.priceSnapshot * item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 border-t pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3">
                        <div className="flex items-center rounded-lg border bg-muted/50">
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-l-md text-sm font-medium transition-colors hover:bg-muted"
                            onClick={() => handleQuantityChange(item._id, Math.max(1, item.quantity - 1))}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <Input
                            type="number"
                            min={1}
                            max={99}
                            className="h-8 w-12 border-0 bg-transparent text-center text-sm [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item._id, Math.max(1, Number(e.target.value) || 1))
                            }
                          />
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-r-md text-sm font-medium transition-colors hover:bg-muted"
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
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
            <aside className="h-fit rounded-xl border border-border bg-gradient-to-b from-card to-card/95 p-5 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs. {displaySubtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span>At checkout</span>
                </div>
                {displayDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>- Rs. {displayDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-3 text-base font-semibold">
                  <span>Total</span>
                  <span>Rs. {displayTotal}</span>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-2">
                {isGuest ? (
                  <Link href="/login?returnUrl=/checkout">
                    <Button className="w-full">Sign in to checkout</Button>
                  </Link>
                ) : (
                  <Link href="/checkout">
                    <Button className="w-full" disabled={isEmpty}>
                      Checkout
                    </Button>
                  </Link>
                )}
                <Link href="/menu" className="block">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

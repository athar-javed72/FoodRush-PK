"use client";

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { addToCart } from '@/features/cart/cartSlice';
import { addToGuestCart } from '@/features/guestCart/guestCartSlice';
import { toggleWishlist } from '@/features/wishlist/wishlistSlice';
import type { WishlistItem } from '@/features/wishlist/wishlistSlice';
import { FadeIn } from '@/components/animation/FadeIn';
import { ProductImage } from '@/components/ProductImage';

function useCartCount() {
  const user = useAppSelector((s) => s.auth.user);
  const cartItems = useAppSelector((s) => s.cart.items);
  const guestCart = useAppSelector((s) => s.guestCart);
  if (user) return cartItems.reduce((sum, i) => sum + i.quantity, 0);
  return guestCart.reduce((sum, i) => sum + i.quantity, 0);
}

export interface ProductCardProduct {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string | null;
  category?: { name: string };
  averageRating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: ProductCardProduct;
  delay?: number;
  variant?: 'grid' | 'list';
}

function StarRating({ value = 0 }: { value?: number }) {
  const v = Math.min(5, Math.max(0, value));
  return (
    <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
      <span className="text-amber-500">★</span>
      <span>{v.toFixed(1)}</span>
    </span>
  );
}

const MIN_QTY = 1;
const MAX_QTY = 10;

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

export function ProductCard({ product, delay = 0, variant = 'grid' }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const cartCount = useCartCount();
  const [quantity, setQuantity] = useState(MIN_QTY);
  const [justAdded, setJustAdded] = useState(false);
  const inWishlist = useAppSelector((s) => s.wishlist.some((i) => i._id === product._id));
  const cartLoading = useAppSelector((s) => s.cart.loading);
  const cartError = useAppSelector((s) => s.cart.error);

  const safeQty = Math.max(MIN_QTY, Math.min(MAX_QTY, quantity));
  const canAddToCart = safeQty >= MIN_QTY && !cartLoading;

  const wishlistPayload: WishlistItem = {
    _id: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    averageRating: product.averageRating
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (safeQty < MIN_QTY) return;
    const qty = safeQty;
    if (user) {
      dispatch(addToCart({ productId: product._id, quantity: qty }))
        .unwrap()
        .then(() => {
          setJustAdded(true);
          setTimeout(() => setJustAdded(false), 2000);
          toast.success('Added to cart');
        })
        .catch((msg: string) => toast.error(msg || 'Failed to add to cart'));
    } else {
      dispatch(
        addToGuestCart({
          productId: product._id,
          quantity: qty,
          name: product.name,
          price: product.price,
          image: product.image
        })
      );
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
      toast.success('Added to cart');
    }
  };

  const addToCartLabel = cartLoading ? 'Adding…' : justAdded ? 'Added!' : 'Add to cart';
  const decrementQty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((q) => Math.max(MIN_QTY, q - 1));
  };
  const incrementQty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((q) => Math.min(MAX_QTY, q + 1));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const willAdd = !inWishlist;
    dispatch(toggleWishlist(wishlistPayload));
    toast.success(willAdd ? 'Added to wishlist' : 'Removed from wishlist');
  };

  if (variant === 'list') {
    return (
      <FadeIn delay={delay}>
        <Link href={`/products/${product._id}`}>
          <Card className="flex flex-row overflow-hidden rounded-xl transition-all duration-300 hover:shadow-card">
            <div className="relative h-28 w-32 shrink-0 overflow-hidden rounded-l-xl bg-muted sm:h-32 sm:w-40">
              <ProductImage src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between p-3 text-left sm:p-4">
              <div>
                <CardTitle className="flex items-center justify-between gap-2 text-sm">
                  <span>{product.name}</span>
                  {product.category && (
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {product.category.name}
                    </Badge>
                  )}
                </CardTitle>
                {product.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {product.description}
                  </p>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">Rs. {product.price}</p>
                  {(product.averageRating != null && product.averageRating > 0) && (
                    <StarRating value={product.averageRating} />
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center rounded-lg border border-border/80 bg-muted/50 shadow-elevated h-8 overflow-hidden">
                      <button
                        type="button"
                        onClick={decrementQty}
                        disabled={safeQty <= MIN_QTY}
                        className="h-full w-8 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                      >
                        ‹
                      </button>
                      <span className="min-w-[2rem] text-center text-xs font-semibold tabular-nums">{safeQty}</span>
                      <button
                        type="button"
                        onClick={incrementQty}
                        disabled={safeQty >= MAX_QTY}
                        className="h-full w-8 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                      >
                        ›
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-lg border-border/80 shadow-elevated hover:shadow-card h-8"
                      onClick={handleWishlist}
                    >
                      <span className={inWishlist ? 'text-red-500' : 'text-muted-foreground'}>{inWishlist ? '♥' : '♡'}</span>
                      <span className="ml-1">{inWishlist ? 'Saved' : 'Wishlist'}</span>
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs rounded-lg h-8 shadow-elevated hover:shadow-button transition-all duration-200 inline-flex items-center gap-1.5"
                      onClick={handleAddToCart}
                      disabled={!canAddToCart}
                    >
                      <CartIcon className="h-3.5 w-3.5" />
                      {addToCartLabel}
                    </Button>
                  </div>
                  {cartCount > 0 && (
                    <p className="text-[10px] text-muted-foreground rounded-md bg-muted/60 dark:bg-muted/40 px-2 py-0.5 w-fit">
                      {cartCount} item{cartCount !== 1 ? 's' : ''} in cart
                    </p>
                  )}
                  {cartError && (
                    <p className="text-[10px] text-red-500">{cartError}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </FadeIn>
    );
  }

  return (
    <FadeIn delay={delay}>
      <Card className="flex h-full flex-col overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-0.5">
        <Link href={`/products/${product._id}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-muted">
            <ProductImage src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
        </Link>
        <CardHeader className="pb-1 pt-3">
          <CardTitle className="flex items-start justify-between gap-2 text-sm font-semibold">
            <span className="line-clamp-2">{product.name}</span>
            {product.category && (
              <Badge variant="outline" className="text-[10px] shrink-0 font-normal">
                {product.category.name}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-auto flex flex-1 flex-col justify-end gap-3 pb-3">
          {product.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Rs. {product.price}</p>
            {(product.averageRating != null && product.averageRating > 0) && (
              <StarRating value={product.averageRating} />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-lg border border-border/80 bg-muted/50 shadow-elevated h-8 overflow-hidden">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); decrementQty(e); }}
                  disabled={safeQty <= MIN_QTY}
                  className="h-full w-8 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  ‹
                </button>
                <span className="min-w-[2rem] text-center text-xs font-semibold tabular-nums">{safeQty}</span>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); incrementQty(e); }}
                  disabled={safeQty >= MAX_QTY}
                  className="h-full w-8 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  ›
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs rounded-lg border-border/80 shadow-elevated hover:shadow-card h-8 min-w-0"
                onClick={handleWishlist}
              >
                <span className={inWishlist ? 'text-red-500' : 'text-muted-foreground'}>{inWishlist ? '♥' : '♡'}</span>
                <span className="ml-1">{inWishlist ? 'Saved' : 'Wishlist'}</span>
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs rounded-lg h-8 min-w-0 shadow-elevated hover:shadow-button transition-all duration-200 inline-flex items-center justify-center gap-1.5"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
              >
                <CartIcon className="h-3.5 w-3.5 shrink-0" />
                {addToCartLabel}
              </Button>
            </div>
            {cartCount > 0 && (
              <p className="text-[10px] text-muted-foreground rounded-md bg-muted/60 dark:bg-muted/40 px-2 py-1 w-fit">
                {cartCount} item{cartCount !== 1 ? 's' : ''} in cart
              </p>
            )}
            {cartError && (
              <p className="text-[10px] text-red-500">{cartError}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}

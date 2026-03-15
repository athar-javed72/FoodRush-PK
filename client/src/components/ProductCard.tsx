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

const QTY_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function ProductCard({ product, delay = 0, variant = 'grid' }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const cartCount = useCartCount();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const inWishlist = useAppSelector((s) => s.wishlist.some((i) => i._id === product._id));
  const cartLoading = useAppSelector((s) => s.cart.loading);
  const cartError = useAppSelector((s) => s.cart.error);

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
    const qty = Math.max(1, Math.min(10, quantity));
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
          <Card className="flex flex-row overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
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
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">Qty:</span>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                      className="h-7 w-12 rounded border border-input bg-background px-1 text-xs"
                    >
                      {QTY_OPTIONS.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-border"
                      onClick={handleWishlist}
                    >
                      <span className={inWishlist ? 'text-red-500' : ''}>{inWishlist ? '♥' : '♡'}</span> {inWishlist ? 'Saved' : 'Wishlist'}
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleAddToCart}
                      disabled={cartLoading}
                    >
                      {addToCartLabel}
                    </Button>
                  </div>
                  {cartCount > 0 && (
                    <p className="text-[10px] text-muted-foreground">
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
      <Card className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md">
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
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">Qty</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="h-8 w-14 rounded-md border border-input bg-background px-2 text-xs"
              >
                {QTY_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs border-border"
                onClick={handleWishlist}
              >
                <span className={inWishlist ? 'text-red-500' : ''}>{inWishlist ? '♥' : '♡'}</span> Wishlist
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleAddToCart}
                disabled={cartLoading}
              >
                {addToCartLabel}
              </Button>
            </div>
            {cartCount > 0 && (
              <p className="text-[10px] text-muted-foreground">
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

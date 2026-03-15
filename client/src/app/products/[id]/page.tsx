"use client";

import { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { addToCart } from '@/features/cart/cartSlice';
import { addToGuestCart } from '@/features/guestCart/guestCartSlice';
import { toggleWishlist } from '@/features/wishlist/wishlistSlice';
import type { WishlistItem } from '@/features/wishlist/wishlistSlice';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';
import { ProductImage } from '@/components/ProductImage';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReviewItem {
  _id: string;
  rating: number;
  comment?: string;
  user?: { name?: string };
  createdAt: string;
}

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const MIN_QTY = 1;
  const MAX_QTY = 10;
  const [quantity, setQuantity] = useState(MIN_QTY);
  const dispatch = useAppDispatch();
  const safeQty = Math.max(MIN_QTY, Math.min(MAX_QTY, quantity));
  const canAddToCart = safeQty >= MIN_QTY && !cartLoading;
  const user = useAppSelector((s) => s.auth.user);
  const cartItems = useAppSelector((s) => s.cart.items);
  const guestCart = useAppSelector((s) => s.guestCart);
  const cartCount = user
    ? cartItems.reduce((sum, i) => sum + i.quantity, 0)
    : guestCart.reduce((sum, i) => sum + i.quantity, 0);
  const inWishlist = useAppSelector((s) => s.wishlist.some((i) => i._id === product?._id));
  const cartLoading = useAppSelector((s) => s.cart.loading);
  const cartError = useAppSelector((s) => s.cart.error);

  const loadProduct = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await apiClient.get(`/products/${id}`);
      setProduct(res.data.data.product);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!id) return;
    try {
      setReviewsLoading(true);
      const res = await apiClient.get(`/reviews/product/${id}`);
      setReviews(res.data?.data?.reviews ?? []);
    } catch (_) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (id) loadReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || safeQty < MIN_QTY) return;
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

  const handleWishlist = () => {
    if (!product) return;
    const payload: WishlistItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      averageRating: product.averageRating
    };
    const willAdd = !inWishlist;
    dispatch(toggleWishlist(payload));
    toast.success(willAdd ? 'Added to wishlist' : 'Removed from wishlist');
  };

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!product || !user) return;
    try {
      setReviewSubmitting(true);
      setReviewError(null);
      await apiClient.post('/reviews', {
        productId: product._id,
        rating: reviewRating,
        comment: reviewComment.trim() || undefined
      });
      setReviewComment('');
      toast.success('Review submitted');
      await loadReviews();
      await loadProduct();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit review';
      setReviewError(msg);
      toast.error(msg);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container py-6">
        {loading && (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="aspect-video rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        )}
        {error && (
          <EmptyState
            title="We couldn't load this item"
            message={error}
            actionLabel="Back to menu"
            actionHref="/menu"
          />
        )}

        {!loading && !error && product && (
          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
              <ProductImage src={product.image} alt={product.name} className="h-full w-full" />
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
                {product.category && (
                  <Badge variant="outline" className="text-[10px]">
                    {product.category.name}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              <p className="text-xl font-semibold">Rs. {product.price}</p>
              {product.averageRating != null && product.averageRating > 0 && (
                <p className="text-sm text-muted-foreground">
                  ★ {product.averageRating.toFixed(1)}
                  {product.reviewCount != null && ` (${product.reviewCount} reviews)`}
                </p>
              )}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center rounded-xl border border-border/80 bg-muted/50 dark:bg-muted/30 shadow-elevated h-10 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(MIN_QTY, q - 1))}
                      disabled={safeQty <= MIN_QTY}
                      className="h-full w-10 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg font-medium"
                      aria-label="Decrease quantity"
                    >
                      ‹
                    </button>
                    <span className="min-w-[2.5rem] text-center text-sm font-semibold tabular-nums">{safeQty}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
                      disabled={safeQty >= MAX_QTY}
                      className="h-full w-10 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg font-medium"
                      aria-label="Increase quantity"
                    >
                      ›
                    </button>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart}
                    className="rounded-xl shadow-elevated hover:shadow-button transition-all duration-200 px-6 inline-flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {addToCartLabel}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleWishlist}
                    className="rounded-xl border-border/80 shadow-elevated hover:shadow-card transition-all duration-200"
                  >
                    <span className={inWishlist ? 'text-red-500' : 'text-muted-foreground'}>{inWishlist ? '♥' : '♡'}</span>
                    <span className="ml-2">{inWishlist ? 'Saved to wishlist' : 'Add to wishlist'}</span>
                  </Button>
                </div>
                {cartCount > 0 && (
                  <p className="text-xs text-muted-foreground rounded-lg bg-muted/60 dark:bg-muted/40 px-3 py-1.5 w-fit">
                    {cartCount} item{cartCount !== 1 ? 's' : ''} in cart
                  </p>
                )}
                {cartError && <p className="text-xs text-red-500">{cartError}</p>}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && product && (
          <div className="mt-10 border-t pt-8">
            <h2 className="mb-4 text-lg font-semibold">Customer Reviews</h2>
            {user && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-sm">Write a review</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-3">
                    {reviewError && (
                      <p className="text-xs text-red-500">{reviewError}</p>
                    )}
                    <div>
                      <label className="text-xs font-medium">Rating</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="mt-1 flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} star{r > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Comment (optional)</label>
                      <Input
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience..."
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" size="sm" disabled={reviewSubmitting}>
                      {reviewSubmitting ? 'Submitting…' : 'Submit review'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
            {reviewsLoading && <p className="text-sm text-muted-foreground">Loading reviews…</p>}
            {!reviewsLoading && reviews.length === 0 && (
              <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
            )}
            {!reviewsLoading && reviews.length > 0 && (
              <ul className="space-y-3">
                {reviews.map((r) => (
                  <li key={r._id} className="rounded-lg border bg-card p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{r.user?.name ?? 'Customer'}</span>
                      <span className="text-muted-foreground">
                        ★ {r.rating} · {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {r.comment && (
                      <p className="mt-2 text-muted-foreground">{r.comment}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </>
  );
}


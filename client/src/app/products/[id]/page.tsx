"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/app/store';
import { addToCart } from '@/features/cart/cartSlice';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiClient.get(`/products/${id}`);
        setProduct(res.data.data.product);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      load();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  return (
    <>
      <Header />
      <main className="container py-6">
        {loading && (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-60 rounded-lg" />
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
            <div className="flex h-64 items-center justify-center rounded-xl border bg-muted">
              <span className="text-sm text-muted-foreground">
                Product image coming soon for {product.name}
              </span>
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
              <Button onClick={handleAddToCart}>Add to cart</Button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}


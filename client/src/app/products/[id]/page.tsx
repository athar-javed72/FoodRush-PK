"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/app/store';
import { addToCart } from '@/features/cart/cartSlice';

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
        {loading && <p>Loading product...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && product && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex h-60 items-center justify-center rounded-lg border bg-muted">
              <span className="text-sm text-muted-foreground">Image placeholder</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold">{product.name}</h1>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <p className="text-lg font-semibold">Rs. {product.price}</p>
              <Button onClick={handleAddToCart}>Add to cart</Button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}


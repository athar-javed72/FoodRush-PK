'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/api/client';
import { ProductImage } from '@/components/ProductImage';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animation/FadeIn';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { addToCart } from '@/features/cart/cartSlice';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string | null;
  averageRating?: number;
}

export function PopularDishes() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const cartLoading = useAppSelector((s) => s.cart.loading);

  useEffect(() => {
    apiClient.get('/products', { params: { limit: 8, sort: 'rating' } })
      .then((res) => setProducts(res.data?.data?.items || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <FadeIn>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Popular dishes</h2>
          <p className="mt-1 text-muted-foreground">Customer favourites.</p>
        </FadeIn>
        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p, i) => (
                <FadeIn key={p._id} delay={i * 0.03}>
                  <div className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <Link href={`/products/${p._id}`} className="block aspect-[4/3] overflow-hidden bg-muted">
                      <ProductImage src={p.image} alt={p.name} className="h-full w-full transition-transform duration-300 group-hover:scale-105" />
                    </Link>
                    <div className="p-3">
                      <h3 className="font-medium line-clamp-1">{p.name}</h3>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">Rs. {p.price}</span>
                        {p.averageRating != null && p.averageRating > 0 && (
                          <span className="text-xs text-amber-500">★ {p.averageRating.toFixed(1)}</span>
                        )}
                      </div>
                      <Button size="sm" className="mt-2 w-full" onClick={() => dispatch(addToCart({ productId: p._id, quantity: 1 }))} disabled={cartLoading}>
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/menu"><Button variant="outline">View full menu</Button></Link>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}

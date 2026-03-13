"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';
import { FadeIn } from '@/components/animation/FadeIn';

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category?: Category;
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | 'all'>('all');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          apiClient.get('/categories'),
          apiClient.get('/products')
        ]);
        setCategories(catRes.data.data.categories || []);
        setProducts(prodRes.data.data.items || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredProducts =
    activeCategoryId === 'all'
      ? products
      : products.filter((p) => p.category?._id === activeCategoryId);

  return (
    <>
      <Header />
      <main className="container py-6">
        <FadeIn className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Menu</h1>
            <p className="text-sm text-muted-foreground">
              Browse categories and choose your favourite items.
            </p>
          </div>
          {!loading && !error && (
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-semibold">{filteredProducts.length}</span> item
              {filteredProducts.length === 1 ? '' : 's'}
            </p>
          )}
        </FadeIn>

        {loading && (
          <div className="grid gap-6 md:grid-cols-[220px,1fr]">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        )}
        {error && (
          <div className="mt-4">
            <EmptyState
              title="We couldn't load the menu"
              message={error}
              actionLabel="Try again"
              actionHref="/menu"
            />
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-[220px,1fr]">
            <FadeIn delay={0.02} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase text-muted-foreground">Categories</h2>
              <div className="flex w-full gap-2 overflow-x-auto pb-1 text-xs md:block md:overflow-visible">
                <button
                  type="button"
                  onClick={() => setActiveCategoryId('all')}
                  className={`whitespace-nowrap rounded-full border px-3 py-1 transition-colors ${
                    activeCategoryId === 'all'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => setActiveCategoryId(cat._id)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1 transition-colors ${
                      activeCategoryId === cat._id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </FadeIn>
            <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {filteredProducts.length === 0 && (
                <EmptyState
                  title="No products yet"
                  message="As soon as the restaurant adds products, they will appear here."
                />
              )}
              {filteredProducts.map((p, index) => (
                <FadeIn key={p._id} delay={0.02 + index * 0.015}>
                  <Card className="flex flex-col border-muted bg-card/80 shadow-sm transition-transform duration-150 hover:-translate-y-1 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-sm">
                        <span>{p.name}</span>
                        {p.category && (
                          <Badge variant="outline" className="text-[10px]">
                            {p.category.name}
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between gap-3">
                      <p className="text-sm font-semibold">Rs. {p.price}</p>
                      <Link href={`/products/${p._id}`} className="w-full">
                        <Button variant="outline" className="w-full text-xs">
                          View details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </section>
          </div>
        )}
      </main>
    </>
  );
}


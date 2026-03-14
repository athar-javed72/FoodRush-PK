"use client";

import { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/header';
import { apiClient } from '@/api/client';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string | null;
  category?: Category;
  averageRating?: number;
  reviewCount?: number;
}

type SortOption = '' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
type ViewMode = 'grid' | 'list';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchParam, setSearchParam] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSearchParam(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await apiClient.get('/categories');
        setCategories(res.data?.data?.categories || []);
      } catch (_) {
        setCategories([]);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [activeCategoryId, sort, searchParam, minPrice, maxPrice]);

  useEffect(() => {
    async function loadProducts(isLoadMore = false) {
      try {
        if (!isLoadMore) setLoading(true);
        else setLoadingMore(true);
        setError(null);
        const params: Record<string, string | number> = {
          page: isLoadMore ? page : 1,
          limit: 12
        };
        if (sort === 'price_asc') params.sort = 'price_asc';
        else if (sort === 'price_desc') params.sort = 'price_desc';
        else if (sort === 'rating') params.sort = 'rating';
        else if (sort === 'newest') params.sort = 'newest';
        if (activeCategoryId !== 'all') params.category = activeCategoryId;
        if (searchParam) params.search = searchParam;
        const min = minPrice.trim() ? Number(minPrice) : undefined;
        const max = maxPrice.trim() ? Number(maxPrice) : undefined;
        if (min != null && !Number.isNaN(min)) params.minPrice = min;
        if (max != null && !Number.isNaN(max)) params.maxPrice = max;
        const res = await apiClient.get('/products', { params });
        const data = res.data?.data;
        const items = data?.items || [];
        const pag = data?.pagination;
        if (isLoadMore) {
          setProducts((prev) => [...prev, ...items]);
        } else {
          setProducts(items);
        }
        setHasMore(pag ? pag.page < pag.totalPages : false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load menu');
        if (!isLoadMore) setProducts([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }
    loadProducts(false);
  }, [activeCategoryId, sort, searchParam, minPrice, maxPrice]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setPage((p) => p + 1);
  }, [loadingMore, hasMore]);

  useEffect(() => {
    if (page <= 1) return;
    (async () => {
      try {
        setLoadingMore(true);
        const params: Record<string, string | number> = { page, limit: 12 };
        if (sort) params.sort = sort;
        if (activeCategoryId !== 'all') params.category = activeCategoryId;
        if (searchParam) params.search = searchParam;
        const min = minPrice.trim() ? Number(minPrice) : undefined;
        const max = maxPrice.trim() ? Number(maxPrice) : undefined;
        if (min != null && !Number.isNaN(min)) params.minPrice = min;
        if (max != null && !Number.isNaN(max)) params.maxPrice = max;
        const res = await apiClient.get('/products', { params });
        const items = res.data?.data?.items || [];
        const pag = res.data?.data?.pagination;
        setProducts((prev) => [...prev, ...items]);
        setHasMore(pag ? pag.page < pag.totalPages : false);
      } catch (_) {
        setHasMore(false);
      } finally {
        setLoadingMore(false);
      }
    })();
  }, [page]);

  const filteredByCategory =
    activeCategoryId === 'all'
      ? products
      : products.filter((p) => p.category?._id === activeCategoryId);
  const filteredProducts =
    minRating > 0
      ? filteredByCategory.filter((p) => (p.averageRating ?? 0) >= minRating)
      : filteredByCategory;

  const hasFilters =
    minPrice.trim() !== '' || maxPrice.trim() !== '' || minRating > 0 || sort !== '';
  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setSort('');
  };

  return (
    <>
      <Header />
      <main className="container py-4 md:py-6">
        {/* Page title */}
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
        </div>

        {/* Search */}
        {!loading && !error && (
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="max-w-sm"
            />
          </div>
        )}

        {/* Category tabs — below title, horizontal */}
        {!loading && !error && (
          <nav className="mb-4 border-b border-border pb-2">
            <div className="flex gap-2 overflow-x-auto pb-1 text-sm">
              <button
                type="button"
                onClick={() => setActiveCategoryId('all')}
                className={`shrink-0 rounded-full border px-3 py-1.5 transition-colors ${
                  activeCategoryId === 'all'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => setActiveCategoryId(cat._id)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 transition-colors ${
                    activeCategoryId === cat._id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* Filters & view toggle — modern filter bar */}
        {!loading && !error && (
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/80 bg-muted/30 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Price range
                </span>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-8 w-24 text-sm"
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-8 w-24 text-sm"
                  />
                </div>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Rating
                </span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value={0}>Any</option>
                  <option value={4}>4+ stars</option>
                  <option value={3}>3+ stars</option>
                </select>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sort
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="rating">Top rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
              {hasFilters && (
                <>
                  <div className="h-4 w-px bg-border" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-background/60 p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                List
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        )}

        {error && (
          <EmptyState
            title="We couldn't load the menu"
            message={error}
            actionLabel="Try again"
            actionHref="/menu"
          />
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <EmptyState
            title={searchParam || hasFilters ? 'No results found' : 'No products yet'}
            message={
              searchParam || hasFilters
                ? 'Try a different search or clear filters.'
                : 'As soon as the restaurant adds products, they will appear here.'
            }
            actionLabel="Browse menu"
            actionHref="/menu"
          />
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            {viewMode === 'list' ? (
              <section className="space-y-3">
                {filteredProducts.map((p, index) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    delay={index * 0.02}
                    variant="list"
                  />
                ))}
              </section>
            ) : (
              <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((p, index) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    delay={index * 0.015}
                    variant="grid"
                  />
                ))}
              </section>
            )}
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading…' : 'Load more'}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

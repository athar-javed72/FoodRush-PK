"use client";

import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { useAppSelector, useAppDispatch } from '@/app/store';
import { removeFromWishlist } from '@/features/wishlist/wishlistSlice';
import { addToCart } from '@/features/cart/cartSlice';
import { addToGuestCart } from '@/features/guestCart/guestCartSlice';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { ProductImage } from '@/components/ProductImage';

export default function WishlistPage() {
  const items = useAppSelector((s) => s.wishlist);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  const handleRemove = (id: string) => {
    dispatch(removeFromWishlist(id));
    toast.success('Removed from wishlist');
  };
  const handleAddToCart = (item: { _id: string; name: string; price: number; image?: string | null }) => {
    if (user) {
      dispatch(addToCart({ productId: item._id, quantity: 1 }))
        .unwrap()
        .then(() => toast.success('Added to cart'))
        .catch((msg: string) => toast.error(msg || 'Failed to add to cart'));
    } else {
      dispatch(addToGuestCart({ productId: item._id, quantity: 1, name: item.name, price: item.price, image: item.image }));
      toast.success('Added to cart');
    }
  };

  return (
    <>
      <Header />
      <main className="container py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight md:text-3xl">Wishlist</h1>
        {items.length === 0 && (
          <EmptyState
            title="Your wishlist is empty"
            message="Save items you like from the menu to see them here."
            actionLabel="Browse Menu"
            actionHref="/menu"
            icon={<span aria-hidden>♡</span>}
          />
        )}
        {items.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
              >
                <Card className="group overflow-hidden rounded-xl border-border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <Link href={`/products/${item._id}`} className="block aspect-square overflow-hidden bg-muted">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-sm line-clamp-2">{item.name}</h2>
                      <button
                        type="button"
                        onClick={() => handleRemove(item._id)}
                        className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove from wishlist"
                      >
                        <span className="text-lg">×</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-primary">Rs. {item.price}</p>
                      {item.averageRating != null && item.averageRating > 0 && (
                        <span className="text-xs text-amber-500">★ {item.averageRating.toFixed(1)}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to cart
                      </Button>
                      <Link href={`/products/${item._id}`} className="shrink-0">
                        <Button size="sm" variant="outline" className="text-xs">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

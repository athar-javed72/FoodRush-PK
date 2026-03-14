"use client";

import Link from 'next/link';
import { Header } from '@/components/header';
import { useAppSelector, useAppDispatch } from '@/app/store';
import { removeFromWishlist } from '@/features/wishlist/wishlistSlice';
import { addToCart } from '@/features/cart/cartSlice';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { ProductImage } from '@/components/ProductImage';

export default function WishlistPage() {
  const items = useAppSelector((s) => s.wishlist);
  const dispatch = useAppDispatch();

  const handleRemove = (id: string) => dispatch(removeFromWishlist(id));
  const handleAddToCart = (id: string) => {
    dispatch(addToCart({ productId: id, quantity: 1 }));
  };

  return (
    <>
      <Header />
      <main className="container py-6">
        <h1 className="mb-4 text-2xl font-semibold">Wishlist</h1>
        {items.length === 0 && (
          <EmptyState
            title="Your wishlist is empty"
            message="Save items you like from the menu to see them here."
            actionLabel="Browse the menu"
            actionHref="/menu"
          />
        )}
        {items.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {items.map((item) => (
              <Card key={item._id} className="overflow-hidden">
                <div className="relative aspect-square bg-muted">
                  <ProductImage src={item.image} alt={item.name} className="h-full w-full" />
                </div>
                <CardContent className="p-3 space-y-2">
                  <h2 className="font-medium text-sm">{item.name}</h2>
                  <p className="text-sm font-semibold">Rs. {item.price}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => handleAddToCart(item._id)}
                    >
                      Add to cart
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => handleRemove(item._id)}
                    >
                      Remove
                    </Button>
                  </div>
                  <Link href={`/products/${item._id}`} className="block">
                    <Button size="sm" variant="link" className="p-0 h-auto text-xs">
                      View details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

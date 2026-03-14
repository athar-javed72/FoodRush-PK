"use client";

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { attachInterceptors } from '@/api/client';
import { loadWishlistFromStorage, setWishlist } from '@/features/wishlist/wishlistSlice';
import { CartMergeEffect } from '@/components/CartMergeEffect';

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    attachInterceptors(store);
    const saved = loadWishlistFromStorage();
    if (saved.length) store.dispatch(setWishlist(saved));
  }, []);
  return (
    <Provider store={store}>
      <CartMergeEffect />
      {children}
    </Provider>
  );
}


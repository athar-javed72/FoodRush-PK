"use client";

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { store } from './store';
import { attachInterceptors } from '@/api/client';
import { loadWishlistFromStorage, setWishlist } from '@/features/wishlist/wishlistSlice';
import { setOrderModeFromStorage } from '@/features/orderMode/orderModeSlice';
import { CartMergeEffect } from '@/components/CartMergeEffect';
import { LanguageProvider } from '@/contexts/LanguageContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    attachInterceptors(store);
    const saved = loadWishlistFromStorage();
    if (saved.length) store.dispatch(setWishlist(saved));
    store.dispatch(setOrderModeFromStorage());
  }, []);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>
        <LanguageProvider>
          <CartMergeEffect />
          {children}
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{ duration: 3000 }}
          />
        </LanguageProvider>
      </Provider>
    </ThemeProvider>
  );
}


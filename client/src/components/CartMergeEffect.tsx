"use client";

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { addToCart } from '@/features/cart/cartSlice';
import { clearGuestCart, setGuestCart, loadGuestCartFromStorage } from '@/features/guestCart/guestCartSlice';

export function CartMergeEffect() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const guestCart = useAppSelector((s) => s.guestCart);
  const mergedRef = useRef(false);

  useEffect(() => {
    const saved = loadGuestCartFromStorage();
    if (saved.length > 0) dispatch(setGuestCart(saved));
  }, [dispatch]);

  useEffect(() => {
    if (!user || guestCart.length === 0) {
      mergedRef.current = false;
      return;
    }
    if (mergedRef.current) return;
    mergedRef.current = true;
    (async () => {
      for (const item of guestCart) {
        await dispatch(addToCart({ productId: item.productId, quantity: item.quantity }));
      }
      dispatch(clearGuestCart());
    })();
  }, [user, guestCart.length, dispatch]);

  return null;
}

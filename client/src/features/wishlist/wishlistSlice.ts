"use client";

import { createSlice } from '@reduxjs/toolkit';

const WISHLIST_KEY = 'foodrush_wishlist';

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image?: string | null;
  category?: { name: string };
  averageRating?: number;
}

export function loadWishlistFromStorage(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: WishlistItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch (_) {}
}

const initialState: WishlistItem[] = [];

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: { payload: WishlistItem }) {
      const item = action.payload;
      if (state.some((i) => i._id === item._id)) return;
      const next = [...state, item];
      saveToStorage(next);
      return next;
    },
    removeFromWishlist(state, action: { payload: string }) {
      const next = state.filter((i) => i._id !== action.payload);
      saveToStorage(next);
      return next;
    },
    toggleWishlist(state, action: { payload: WishlistItem }) {
      const exists = state.some((i) => i._id === action.payload._id);
      const next = exists
        ? state.filter((i) => i._id !== action.payload._id)
        : [...state, action.payload];
      saveToStorage(next);
      return next;
    },
    setWishlist(_, action: { payload: WishlistItem[] }) {
      const next = action.payload;
      saveToStorage(next);
      return next;
    }
  }
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

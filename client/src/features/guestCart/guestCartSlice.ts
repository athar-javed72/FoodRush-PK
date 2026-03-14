"use client";

import { createSlice } from '@reduxjs/toolkit';

const GUEST_CART_KEY = 'foodrush_guest_cart';

export interface GuestCartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image?: string | null;
}

export function loadGuestCartFromStorage(): GuestCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: GuestCartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch (_) {}
}

const initialState: GuestCartItem[] = [];

const guestCartSlice = createSlice({
  name: 'guestCart',
  initialState,
  reducers: {
    addToGuestCart(state, action: { payload: GuestCartItem }) {
      const item = action.payload;
      const existing = state.find((i) => i.productId === item.productId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.push({ ...item });
      }
      saveToStorage(state);
    },
    updateGuestCartQuantity(state, action: { payload: { productId: string; quantity: number } }) {
      const { productId, quantity } = action.payload;
      const existing = state.find((i) => i.productId === productId);
      if (!existing) return;
      if (quantity <= 0) {
        const next = state.filter((i) => i.productId !== productId);
        saveToStorage(next);
        return next;
      }
      existing.quantity = quantity;
      saveToStorage(state);
    },
    removeFromGuestCart(state, action: { payload: string }) {
      const next = state.filter((i) => i.productId !== action.payload);
      saveToStorage(next);
      return next;
    },
    clearGuestCart() {
      saveToStorage([]);
      return [];
    },
    setGuestCart(_, action: { payload: GuestCartItem[] }) {
      const next = action.payload;
      saveToStorage(next);
      return next;
    }
  }
});

export const {
  addToGuestCart,
  updateGuestCartQuantity,
  removeFromGuestCart,
  clearGuestCart,
  setGuestCart
} = guestCartSlice.actions;
export default guestCartSlice.reducer;

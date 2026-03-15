'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrderMode = 'delivery' | 'dine_in' | 'pickup';

const STORAGE_KEY = 'foodrush_order_mode';

function getStoredMode(): OrderMode {
  if (typeof window === 'undefined') return 'delivery';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'delivery' || stored === 'dine_in' || stored === 'pickup') return stored;
  return 'delivery';
}

interface OrderModeState {
  mode: OrderMode;
}

const initialState: OrderModeState = {
  mode: 'delivery'
};

export const orderModeSlice = createSlice({
  name: 'orderMode',
  initialState,
  reducers: {
    setOrderMode(state, action: PayloadAction<OrderMode>) {
      state.mode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, action.payload);
      }
    },
    setOrderModeFromStorage(state) {
      state.mode = getStoredMode();
    }
  }
});

export const { setOrderMode, setOrderModeFromStorage } = orderModeSlice.actions;
export default orderModeSlice.reducer;

export const ORDER_MODE_LABELS: Record<OrderMode, string> = {
  delivery: 'Delivery',
  dine_in: 'Dine-in',
  pickup: 'Pickup'
};

/** Short label for header / compact UI */
export const ORDER_MODE_SHORT: Record<OrderMode, string> = {
  delivery: 'Delivery',
  dine_in: 'Dine-in',
  pickup: 'Pickup'
};

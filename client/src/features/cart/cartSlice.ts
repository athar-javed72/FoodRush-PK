"use client";

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/api/client';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  priceSnapshot: number;
  itemTotal: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  discountAmount: 0,
  totalAmount: 0,
  loading: false,
  error: null
};

function mapCartResponse(data: any): CartState {
  const cart = data?.cart || data;
  return {
    items: cart.items || [],
    subtotal: cart.subtotal || 0,
    discountAmount: cart.discountAmount || 0,
    totalAmount: cart.totalAmount || 0,
    loading: false,
    error: null
  };
}

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get('/cart');
    return res.data.data;
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to fetch cart';
    return rejectWithValue(message);
  }
});

export const addToCart = createAsyncThunk(
  'cart/add',
  async (payload: { productId: string; quantity?: number }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/cart', payload);
      return res.data.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to add to cart';
      return rejectWithValue(message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async (payload: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(`/cart/item/${payload.itemId}`, {
        quantity: payload.quantity
      });
      return res.data.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update cart item';
      return rejectWithValue(message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (payload: { itemId: string }, { rejectWithValue }) => {
    try {
      const res = await apiClient.delete(`/cart/item/${payload.itemId}`);
      return res.data.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to remove cart item';
      return rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState(state) {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    const setPending = (state: CartState) => {
      state.loading = true;
      state.error = null;
    };
    const setRejected = (state: CartState, action: any) => {
      state.loading = false;
      state.error = action.payload || 'Cart operation failed';
    };

    builder
      .addCase(fetchCart.pending, setPending)
      .addCase(fetchCart.fulfilled, (state, action) => {
        Object.assign(state, { ...mapCartResponse(action.payload), loading: false });
      })
      .addCase(fetchCart.rejected, setRejected)
      .addCase(addToCart.pending, setPending)
      .addCase(addToCart.fulfilled, (state, action) => {
        Object.assign(state, { ...mapCartResponse(action.payload), loading: false });
      })
      .addCase(addToCart.rejected, setRejected)
      .addCase(updateCartItem.pending, setPending)
      .addCase(updateCartItem.fulfilled, (state, action) => {
        Object.assign(state, { ...mapCartResponse(action.payload), loading: false });
      })
      .addCase(updateCartItem.rejected, setRejected)
      .addCase(removeCartItem.pending, setPending)
      .addCase(removeCartItem.fulfilled, (state, action) => {
        Object.assign(state, { ...mapCartResponse(action.payload), loading: false });
      })
      .addCase(removeCartItem.rejected, setRejected);
  }
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;


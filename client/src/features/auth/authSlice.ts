"use client";

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/api/client';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'driver';
  avatar?: string | null;
  phone?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

export const register = createAsyncThunk(
  'auth/register',
  async (payload: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/auth/register', payload);
      return res.data.data as { user: User; token: string };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/auth/login', payload);
      return res.data.data as { user: User; token: string };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthFromStorage(state, action: PayloadAction<{ user: User; token: string } | null>) {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
      } else {
        state.user = null;
        state.token = null;
      }
    },
    setUser(state, action: PayloadAction<Partial<User> & { id?: string; _id?: string }>) {
      if (state.user) {
        const p = action.payload;
        state.user = {
          ...state.user,
          ...p,
          id: p.id ?? p._id ?? state.user.id
        };
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('foodrush_auth');
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('foodrush_auth', JSON.stringify(action.payload));
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Registration failed';
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('foodrush_auth', JSON.stringify(action.payload));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed';
      });
  }
});

export const { setAuthFromStorage, setUser, logout } = authSlice.actions;
export default authSlice.reducer;


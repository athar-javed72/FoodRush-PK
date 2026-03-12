import axios from 'axios';
import type { RootState } from '@/app/store';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL,
  withCredentials: false
});

export function attachInterceptors(store: { getState: () => RootState }) {
  apiClient.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}


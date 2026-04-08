// src/lib/api.ts
import axios from 'axios';
import { tokenStorage } from './token-storage';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const res = await api.post('/auth/refresh', { refreshToken });

        // ⚡ backend الآن يعيد: { success: true, data: { user, tokens } }
        const tokens = res.data?.data?.tokens;
        if (!tokens?.accessToken) throw new Error('Invalid refresh response');

        const { accessToken, refreshToken: newRefreshToken } = tokens;

        tokenStorage.setTokens(accessToken, newRefreshToken);

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = 'Bearer ' + accessToken;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        tokenStorage.clear();

        // إعادة التوجيه للـ login
        if (typeof window !== 'undefined') window.location.href = '/login';

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;

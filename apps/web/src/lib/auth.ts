// import { refresh } from 'next/cache';
import api from './api';

export interface LoginDto {
  email: string;
  password: string;
}
export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export const AuthApi = {
  login: async (data: LoginDto) => {
    try {
      const res = await api.post('/auth/login', data);

      return res.data; // ⚡ هنا data تحتوي على { success, data: { user, tokens } }
    } catch (err: any) {
      console.error('LOGIN ERROR', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  },
  register: async (data: RegisterDto) => {
    try {
      const res = await api.post('/auth/register', data);
      return res.data;
    } catch (err: any) {
      console.error('REGISTER ERROR', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Register failed');
    }
  },
  logout: async () => {
    try {
      const res = await api.post('/auth/logout');
      return res.data;
    } catch (err: any) {
      console.error('LOGOUT ERROR', err.response?.data || err.message);
      return null;
    }
  },
  me: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (err: any) {
      console.error('ME ERROR', err.response?.data || err.message);
      return null;
    }
  },
  refresh: async (refreshToken: string) => {
    const res = await api.post('/auth/refresh', { refreshToken });
    return res.data;
  },
};

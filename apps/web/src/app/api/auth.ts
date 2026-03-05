import { refresh } from 'next/cache';
import { api } from './client';

export interface LoginDto {
  email: String;
  password: String;
}
export interface RegisterDto {
  email: String;
  password: String;
  name: String;
}

export const AuthApi = {
  login: async (data: LoginDto) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterDto) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  refresh: async () => {
    const response = await api.post('/auth/refresh');
    // refresh();
    return response.data;
  },
};

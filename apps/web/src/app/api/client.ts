'use client';

import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api', // API
  withCredentials: true, // مهم للكوكيز
  headers: {
    'Content-Type': 'application/json',
  },
});

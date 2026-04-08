import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', //process.env.NEXT_PUBLIC_API_URL,
  // withCredentials: true,
});

// Attach token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 فك الـ wrapper
instance.interceptors.response.use((response) => {
  //return response.data?.data ?? response.data;
  let data = response.data;

  // فك التعشيش تلقائيًا
  while (data?.data) {
    data = data.data;
  }

  return data;
});

export default instance;

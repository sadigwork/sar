import api from '@/lib//api';

const API_URL = 'http://localhost:3000/api';
export const fetcher = async (url: string) => {
  console.log('🚀 Fetching URL:', url);

  const res = await api.get(url);

  let data = res.data;
  if (!data) throw new Error('No data recieved');

  // 🔥 فك التعشيش (حل مشكلتك الكبيرة)
  while (data?.data) {
    data = data.data;
  }

  return data;
};

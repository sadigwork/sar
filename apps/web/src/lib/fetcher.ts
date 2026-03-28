import api from '@/lib//api';

const API_URL = 'http://localhost:3000/api';
export const fetcher = async ([url, token]: [string, string]) => {
  if (!token) throw new Error('Token not available');
  console.log('FETCH:', url);
  console.log('TOKEN:', token);

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  console.log('🔥 HEADERS:', headers);

  const res = await api.get(url);

  let data = res.data;
  if (!data) throw new Error('No data recieved');

  // 🔥 فك التعشيش (حل مشكلتك الكبيرة)
  while (data?.data) {
    data = data.data;
  }

  return data;
};

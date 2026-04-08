import api from './api';
export const fetcher = async (args: any) => {
  let url: string;

  // إذا SWR أعطاك array
  if (Array.isArray(args)) {
    url = args[0]; // ناخذ الرابط فقط
  } else {
    url = args;
  }

  console.log('🚀 Fetching URL:', url);

  const response = await api.get(url);

  return response.data;
};

import useSWR from 'swr';
import { useAuth } from '@/components/auth-provider';

const fetcher = (url: string, token: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) =>
    res.json(),
  );

export const useProfile = () => {
  const { token } = useAuth();
  const { data, error, isLoading } = useSWR(
    token ? ['/api/profiles/me', token] : null,
    fetcher,
  );

  return {
    profile: data,
    isLoading,
    isError: error,
  };
};

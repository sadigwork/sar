import useSWR from 'swr';
import { useAuth } from '@/components/auth-provider';

const fetcher = (url: string, token: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) =>
    res.json(),
  );

export const useApplications = () => {
  const { token } = useAuth();
  const { data, error, isLoading } = useSWR(
    token ? ['/api/applications/my', token] : null,
    fetcher,
  );

  return {
    applications: data || [],
    isLoading,
    isError: error,
  };
};

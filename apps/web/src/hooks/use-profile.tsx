import useSWR from 'swr';
import { useAuth } from '@/components/auth-provider';
import { fetcher } from '@/lib/fetcher';

export const useProfile = () => {
  const { token, isLoading: authLoading } = useAuth();

  const { data, error, isValidating } = useSWR(
    !authLoading && token ? ['/profiles/me', token] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    },
  );

  return {
    profile: data,
    isLoading: authLoading || isValidating,
    isError: error,
  };
};

import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { useAuth } from '@/components/auth-provider';

export function useApplicationDraft() {
  const { token } = useAuth();

  const query = useQuery({
    queryKey: ['applicationDraft'],
    queryFn: () => fetcher(['/applications/my-draft', token!]),
    enabled: !!token,
    retry: false,
    select: (response: any) =>
      response?.data?.data || response?.data || response,
  });

  return query; // { data, isLoading, error, refetch }
}

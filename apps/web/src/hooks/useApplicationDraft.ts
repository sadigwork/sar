'use client';

import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { useAuth } from '../components/auth-provider';

export function useApplicationDraft() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['applicationDraft'],
    queryFn: () => fetcher('/application/draft'),
    enabled: !!token,
    retry: 1,
  });
}

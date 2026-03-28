'use client';

import useSWR from 'swr';
import { useAuth } from '../components/auth-provider';
import { fetcher } from '@/lib/fetcher';
import { mapStatus, mapType } from '@/lib/application-status';

export interface Application {
  id: string;
  type: string;
  status: string;
  currentStage: string | null;
  createdAt: string;
  submitted: string | null;
  profile?: {
    fullNameAr: string;
    fullNameEn: string;
  };
}

export const useApplications = () => {
  const { token, isLoading: authLoading } = useAuth();

  const { data, error, isValidating, mutate } = useSWR(
    !authLoading && token ? ['/applications/me', token] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    },
  );

  const normalized: Application[] =
    data?.data?.map((app: Application) => ({
      ...app,
      status: mapStatus(app.status),
      type: mapType(app.type),
    })) || [];

  return {
    applications: normalized,
    raw: data || [],
    isLoading: authLoading || isValidating,
    isError: error,
    refetch: mutate,
  };
};

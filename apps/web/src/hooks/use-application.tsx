// hooks/use-application.ts
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
  // إضافة حقول إضافية مطلوبة للتفاصيل
  level?: string;
  specialization?: string;
  submissionDate?: string;
  lastUpdated?: string;
  progress?: number;
  nextStep?: string;
  reviewer?: string;
  reviewerEmail?: string;
  estimatedCompletion?: string;
  notes?: string;
  missingDocuments?: string[];
  timeline?: any[];
  documents?: any[];
  messages?: any[];
}

export const useApplication = (id: string | null) => {
  const { token, isLoading: authLoading } = useAuth();

  const { data, error, isValidating, mutate } = useSWR(
    !authLoading && token && id ? [`/applications/${id}`, token] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    },
  );

  const application: Application | null = data
    ? {
        ...data.data,
        status: mapStatus(data.status),
        type: mapType(data.type),
      }
    : null;

  return {
    application,
    isLoading: authLoading || isValidating,
    isError: error,
    refetch: mutate,
  };
};

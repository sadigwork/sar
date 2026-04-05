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
  submittedAt: string | null;
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
  const shouldFetch = !authLoading && token && id;

  const { data, error, isValidating, mutate } = useSWR(
    shouldFetch ? [`/applications/${id}`, token] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    },
  );

  const raw = data?.data || data;

  const application: Application | null = raw
    ? {
        type: mapType(raw.type),
        status: mapStatus(raw.status),
        currentStage: raw.currentStage || null,
        createdAt: raw.createdAt,
        submittedAt: raw.submittedAt || null,
        profile: raw.profile,
        progress: raw.progress,
        nextStep: raw.nextStep,
      }
    : null;

  return {
    application,
    isLoading: authLoading || isValidating,
    isError: error,
    refetch: mutate,
  };
};

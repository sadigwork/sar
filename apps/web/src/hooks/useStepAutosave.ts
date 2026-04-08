import { useEffect, useRef, useState } from 'react';
import { useWatch, UseFormReturn } from 'react-hook-form';
import isEqual from 'lodash/isEqual';
import api from '@/lib/api';

type Props = {
  form: UseFormReturn<any>;
  step: string;
  delay?: number;
};

export function useStepAutosave({ form, step, delay = 1000 }: Props) {
  const values = useWatch({ control: form.control });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastSavedRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRun = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      lastSavedRef.current = values;
      return;
    }

    if (!values || Object.keys(values).length === 0) return;
    if (isEqual(values, lastSavedRef.current)) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      setError(null);

      if (abortControllerRef.current) abortControllerRef.current.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await api.patch(
          '/applications/my-draft',
          { step, data: values },
          { signal: controller.signal },
        );

        lastSavedRef.current = values;
      } catch (err: any) {
        if (err.name === 'AbortError') return;

        console.error('Autosave error:', err);
        setError(err.message || 'Save failed');
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [values, step]);

  return { isSaving, error };
}

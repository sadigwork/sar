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
  const values = useWatch({
    control: form.control,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastSavedRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRun = useRef(true);

  // ⚠️ axios لا يدعم AbortController بنفس الطريقة
  const cancelTokenRef = useRef<any>(null);

  useEffect(() => {
    // 🛑 تجاهل أول render (بعد reset من draft)
    if (isFirstRun.current) {
      isFirstRun.current = false;
      lastSavedRef.current = values;
      return;
    }

    // 🛑 لا تحفظ إذا لا يوجد بيانات
    if (!values || Object.keys(values).length === 0) return;

    // 🧠 Smart diff
    if (isEqual(values, lastSavedRef.current)) return;

    // ⏱️ Debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        setError(null);

        // ❌ cancel previous request
        if (cancelTokenRef.current) {
          cancelTokenRef.current.cancel('Canceled due to new request');
        }

        cancelTokenRef.current = api.CancelToken.source();

        const res = await api.patch(
          '/applications/my-draft',
          {
            step,
            data: values,
          },
          {
            cancelToken: cancelTokenRef.current.token,
          },
        );

        if (!res?.data) {
          throw new Error('Autosave failed');
        }

        lastSavedRef.current = values;
      } catch (err: any) {
        if (api.isCancel?.(err)) return;

        console.error('Autosave error:', err);
        setError(err.message || 'Save failed');
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [values, step]);

  return {
    isSaving,
    error,
  };
}

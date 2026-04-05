'use client';

import { useEffect, useRef, useState } from 'react';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

type AutosaveOptions<T> = {
  data: T;
  onSave: (data: T) => Promise<any>;
  delay?: number;
};

export function useAutosave<T>({
  data,
  onSave,
  delay = 800,
}: AutosaveOptions<T>) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<T | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
    if (lastSaved && isEqual(data, lastSaved)) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        await onSave(data);
        setLastSaved(data);
      } catch (error) {
        console.error('Autosave failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data]);

  return { isSaving, lastSaved };
}
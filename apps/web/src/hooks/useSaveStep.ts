'use client';

import { api } from '@/lib/api';

export function useSaveStep(getDraftId) {
  const saveStep = async (stepId, data) => {
    const draftId = await getDraftId();

    await api.patch(`/applications/${draftId}`, {
      step: stepId,
      data,
    });
  };

  return { saveStep };
}

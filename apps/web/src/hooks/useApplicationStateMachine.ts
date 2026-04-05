'use client';
import { useState, useEffect } from 'react';
import { createMachine, interpret } from 'xstate';
import { z } from 'zod';
import { stepSchemas } from '@/forms/schemas/application.schemas';
import { fetcher } from '@/lib/fetcher';

export type ApplicationEvents =
  | { type: 'START' }
  | { type: 'SAVE_STEP'; stepId: string; data: any }
  | { type: 'SUBMIT' }
  | { type: 'APPROVE' }
  | { type: 'REJECT'; notes: string }
  | { type: 'EDIT' };

export type ApplicationContext = {
  draftId?: string;
  currentStep?: string;
  progress?: number;
  notes?: string;
  formData: Record<string, any>;
};

const validTransitions = {
  DRAFT: ['IN_PROGRESS'],
  IN_PROGRESS: ['SUBMITTED'],
  SUBMITTED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['APPROVED', 'REJECTED'],
  REJECTED: ['IN_PROGRESS'],
  APPROVED: [],
};

export const useApplicationStateMachine = (draftId?: string) => {
  const [state, setState] = useState<ApplicationContext>({
    draftId,
    currentStep: 'personal',
    progress: 0,
    notes: '',
    formData: {},
  });

  const [status, setStatus] = useState<
    | 'DRAFT'
    | 'IN_PROGRESS'
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'APPROVED'
    | 'REJECTED'
  >('DRAFT');

  const saveStep = async (stepId: string, data: any) => {
    const schema = stepSchemas[stepId];
    if (!schema) throw new Error('Invalid step');

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      console.error('Validation errors', parsed.error.format());
      return { success: false, errors: parsed.error.format() };
    }

    // Merge formData
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [stepId]: parsed.data },
    }));

    // Backend call (Draft save)
    if (draftId) {
      await fetcher(`/applications/${draftId}/draft`, 'PUT', {
        stepId,
        data: parsed.data,
      });
    }

    return { success: true };
  };

  const nextStep = () => {
    const steps = [
      'personal',
      'education',
      'experience',
      'documents',
      'certifications',
      'review',
    ];
    const idx = steps.indexOf(state.currentStep!);
    if (idx < steps.length - 1) {
      setState((prev) => ({
        ...prev,
        currentStep: steps[idx + 1],
        progress: ((idx + 1) / steps.length) * 100,
      }));
    }
  };

  const previousStep = () => {
    const steps = [
      'personal',
      'education',
      'experience',
      'documents',
      'certifications',
      'review',
    ];
    const idx = steps.indexOf(state.currentStep!);
    if (idx > 0) {
      setState((prev) => ({
        ...prev,
        currentStep: steps[idx - 1],
        progress: ((idx - 1) / steps.length) * 100,
      }));
    }
  };

  const submit = async () => {
    // Save all steps before submission
    for (const stepId of Object.keys(stepSchemas)) {
      if (state.formData[stepId]) continue;
      const res = await saveStep(stepId, {});
      if (!res.success) return res;
    }

    if (draftId) {
      await fetcher(`/applications/${draftId}/submit`, 'POST');
      setStatus('SUBMITTED');
    }
  };

  const reject = (notes: string) => {
    setStatus('REJECTED');
    setState((prev) => ({ ...prev, notes }));
  };

  const approve = () => setStatus('APPROVED');

  return {
    state,
    status,
    saveStep,
    nextStep,
    previousStep,
    submit,
    reject,
    approve,
  };
};

'use client';

import { useState } from 'react';
import { stepSchemas } from '@/schemas/application';

export const useApplicationSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'personal', title: 'Personal' },
    { id: 'education', title: 'Education' },
    { id: 'experience', title: 'Experience' },
    { id: 'documents', title: 'Documents' },
    { id: 'certifications', title: 'Certifications' },
    { id: 'review', title: 'Review' },
  ];

  const validateStep = (stepId: string, data: any) => {
    const schema = (stepSchemas as any)[stepId];

    if (!schema) return { success: true };

    const result = schema.safeParse(data);

    return result;
  };

  const next = () => {
    setCurrentStep((s) => s + 1);
  };

  const prev = () => {
    setCurrentStep((s) => s - 1);
  };

  return {
    steps,
    currentStep,
    setCurrentStep,
    next,
    prev,
    validateStep,
  };
};

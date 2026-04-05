import { useState } from 'react';

export const steps = [
  'personal',
  'education',
  'experience',
  'documents',
  'certifications',
  'review',
] as const;

export function useApplicationSteps() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = steps[currentStepIndex];

  const next = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((i) => i + 1);
    }
  };

  const back = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((i) => i - 1);
    }
  };

  const goTo = (step: (typeof steps)[number]) => {
    const index = steps.indexOf(step);
    if (index !== -1) setCurrentStepIndex(index);
  };

  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return {
    steps,
    currentStep,
    currentStepIndex,
    next,
    back,
    goTo,
    progress,
  };
}

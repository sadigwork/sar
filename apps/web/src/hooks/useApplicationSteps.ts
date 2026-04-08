import { useState } from 'react';
import { APPLICATION_STEPS } from '@/constants/applicationSteps';

export function useApplicationSteps() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStep = APPLICATION_STEPS[currentIndex];

  const next = () => {
    if (currentIndex < APPLICATION_STEPS.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const goTo = (indexOrId: number | string) => {
    if (typeof indexOrId === 'number') {
      if (indexOrId < 0 || indexOrId >= APPLICATION_STEPS.length) return;
      setCurrentIndex(indexOrId);
      return;
    }

    const nextIndex = APPLICATION_STEPS.findIndex(
      (step) => step.id === indexOrId,
    );
    if (nextIndex !== -1) {
      setCurrentIndex(nextIndex);
    }
  };

  return {
    steps: APPLICATION_STEPS,
    currentStep,
    currentIndex,
    next,
    prev,
    back: prev,
    goTo,
    isLast: currentIndex === APPLICATION_STEPS.length - 1,
  };
}

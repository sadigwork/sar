type Props = {
  steps: string[];
  currentStep: string;
  onStepClick: (step: string) => void;
  progress: number;
};

export function StepNavigation({
  steps,
  currentStep,
  onStepClick,
  progress,
}: Props) {
  return (
    <div className="mb-6">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded mb-4">
        <div
          className="h-2 bg-black rounded transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex gap-2 flex-wrap">
        {steps.map((step) => (
          <button
            key={step}
            onClick={() => onStepClick(step)}
            className={`px-3 py-1 rounded text-sm ${
              step === currentStep ? 'bg-black text-white' : 'bg-gray-100'
            }`}
          >
            {step}
          </button>
        ))}
      </div>
    </div>
  );
}

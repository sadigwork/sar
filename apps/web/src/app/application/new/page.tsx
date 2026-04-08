'use client';

import { useEffect, useMemo, useState } from 'react';
import { mapDraftToForm } from '@/forms/mappers/application.mapper';
import api from '@/lib/api';

import { useAuth } from '@/components/auth-provider';
import { useProfile } from '@/hooks/use-profile';
import { useToast } from '@/hooks/use-toast';

import { ApplicationReview } from '@/components/ApplicationReview';
import { PersonalInfoForm } from '@/components/steps/PersonalStep';
import { EducationForm } from '@/components/steps/EducationStep';
import { ExperienceForm } from '@/components/steps/ExperienceStep';
import { DocumentsForm } from '@/components/steps/DocumentStep';
import { ProfessionalCertificationsForm } from '@/components/steps/CertificationStep';
import { useApplicationDraft } from '@/hooks/useApplicationDraft';
import { useApplicationSteps } from '@/hooks/useApplicationSteps';

export default function NewApplicationPage() {
  const { token, isLoading: authLoading } = useAuth();

  // =========================
  // 🧭 Steps
  // =========================
  const { currentStep, back, next, goTo, isLast } = useApplicationSteps();

  // =========================
  // 📦 Draft + Profile data
  // =========================
  const {
    data: draft,
    error: draftError,
    isLoading: draftLoading,
    refetch: refetchDraft,
  } = useApplicationDraft();
  const { profile, isLoading: profileLoading } = useProfile();

  const draftSource = useMemo(() => {
    if (draft) {
      return {
        ...draft,
        profile: {
          ...(profile ?? {}),
          ...draft.profile,
        },
      };
    }

    return { profile: profile ?? {} };
  }, [draft, profile]);

  // =========================
  // 🧠 Step data
  // =========================
  const [stepData, setStepData] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (!currentStep?.id || !draftSource) return;

    setStepData((previousStepData) => {
      const nextStepData = mapDraftToForm(currentStep.id, draftSource);
      const previousJson = JSON.stringify(previousStepData);
      const nextJson = JSON.stringify(nextStepData);

      if (previousJson === nextJson) {
        return previousStepData;
      }

      return nextStepData;
    });
  }, [currentStep?.id, draftSource]);

  const saveStep = async () => {
    setErrorMessage(null);
    setIsSaving(true);

    try {
      await api.patch('/applications/my-draft', {
        step: currentStep.id,
        data: stepData,
      });

      await refetchDraft?.();
      toast?.({
        title: 'Saved',
        description: `${currentStep.label} saved successfully.`,
      });
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Unknown save error');
      console.error('Save step error:', err);
      setErrorMessage(err.message || 'Failed to save step');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    try {
      await saveStep();
      next();
    } catch {
      // error state is already set
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await api.post('/applications/my-draft/submit');
      await refetchDraft?.();

      toast?.({
        title: 'Submitted',
        description: 'Application submitted successfully.',
      });
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Unknown submit error');
      console.error('Submit error:', err);
      setErrorMessage(err.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // 🔐 Authentication check
  // =========================
  if (authLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!token) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-4">
          You need to be logged in to create a new application.
        </p>
        <a
          href="/login"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </a>
      </div>
    );
  }

  // =========================
  // 🧭 Scroll on step change
  // =========================
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  // =========================
  // ⏳ Loading
  // =========================
  if (authLoading || draftLoading || profileLoading) {
    return <div className="p-6">Loading application draft...</div>;
  }

  if (draftError) {
    return (
      <div className="p-6 text-red-600">
        Failed to load application draft. Please refresh the page.
      </div>
    );
  }

  return (
    <div>
      <h2>{currentStep.label}</h2>

      {/* 🔥 Render step */}
      {currentStep.id === 'personal' && (
        <PersonalInfoForm data={stepData} updateData={setStepData} />
      )}
      {currentStep.id === 'education' && (
        <EducationForm data={stepData} updateData={setStepData} />
      )}
      {currentStep.id === 'experience' && (
        <ExperienceForm data={stepData} updateData={setStepData} />
      )}
      {currentStep.id === 'documents' && (
        <DocumentsForm data={stepData} updateData={setStepData} />
      )}
      {currentStep.id === 'certifications' && (
        <ProfessionalCertificationsForm
          data={stepData}
          updateData={setStepData}
        />
      )}
      {currentStep.id === 'review' && (
        <ApplicationReview
          draft={draftSource}
          onEdit={(step: string) => goTo(step)}
        />
      )}

      {/* 🔥 Navigation */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={back}
            disabled={currentStep.id === 'personal'}
            className="rounded border px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            Back
          </button>

          {!isLast ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isSaving || isSubmitting}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving…' : 'Next'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isSaving}
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </button>
          )}
        </div>

        {errorMessage ? (
          <div className="text-sm text-red-600">{errorMessage}</div>
        ) : null}
      </div>

      {/* 🔥 Save status */}
      <div className="text-sm text-gray-500 mt-2">
        {isSaving
          ? 'Saving…'
          : isSubmitting
            ? 'Submitting…'
            : 'All changes saved'}
      </div>
    </div>
  );
}

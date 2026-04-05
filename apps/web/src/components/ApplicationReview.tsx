// 'use client';

// import { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';

// import { stepSchemas } from '@/forms/schemas/application.schemas';
// import { mapDraftToForm } from '@/forms/mappers/application.mapper';

// import { useApplicationSteps } from '@/hooks/useApplicationSteps';
// import { useApplicationDraft } from '@/hooks/useApplicationDraft';
// import { useStepAutosave } from '@/hooks/useStepAutosave';
// import { useSubmitApplication } from '@/hooks/useSubmitApplication';

// import { StepNavigation } from '@/components/StepNavigation';
// import { FormRenderer } from '@/forms/engine/FormRenderer';
// import { ApplicationReview } from '@/components/ApplicationReview';
// import { toast } from '../hooks/use-toast';

// export default function ApplicationReview() {
//   // 🧭 Step system
//   const { steps, currentStep, next, back, goTo, progress } =
//     useApplicationSteps();

//   // 📦 Draft
//   const { data: draft, loading } = useApplicationDraft();

//   // 🧠 Form
//   const form = useForm({
//     resolver: zodResolver(stepSchemas[currentStep] || stepSchemas.personal),
//     defaultValues: {},
//     mode: 'onChange',
//   });

//   // 🔄 Resume Draft
//   useEffect(() => {
//     if (!draft) return;

//     const mapped = mapDraftToForm(currentStep, draft);
//     form.reset(mapped);
//   }, [draft, currentStep]);

//   // 💾 Autosave
//   const { isSaving } = useStepAutosave({
//     form,
//     step: currentStep,
//   });

//   // 🚀 Submit
//   const { submit, loading: submitting } = useSubmitApplication();

//   // ⏳ Loading
//   if (loading) {
//     return <div className="p-6">Loading application...</div>;
//   }

//   // 🧪 Validation before next
//   const handleNext = async () => {
//     const valid = await form.trigger();
//     if (!valid) return;

//     next();
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       {/* 🧭 Stepper */}
//       <StepNavigation
//         steps={steps}
//         currentStep={currentStep}
//         onStepClick={goTo}
//         progress={progress}
//       />

//       {/* 💾 Save status */}
//       <div className="text-sm text-gray-500 mb-4">
//         {isSaving ? 'Saving...' : 'All changes saved'}
//       </div>

//       {/* 🧩 Content */}
//       <div className="bg-white p-6 rounded shadow-sm">
//         {currentStep === 'review' ? (
//           <ApplicationReview draft={draft} onEdit={(step) => goTo(step)} />
//         ) : (
//           <FormRenderer step={currentStep} form={form} />
//         )}
//       </div>

//       {/* 🔘 Navigation Buttons */}
//       <div className="flex justify-between mt-6">
//         <button
//           onClick={back}
//           disabled={steps.indexOf(currentStep) === 0}
//           className="px-4 py-2 bg-gray-200 rounded"
//         >
//           Back
//         </button>

//         {currentStep !== 'review' ? (
//           <button
//             disabled={isSaving}
//             onClick={handleNext}
//             className="px-4 py-2 bg-black text-white rounded"
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={async () => {
//               const ok = await submit();
//               if (ok) {
//                 alert('Application submitted successfully');
//                 toast.success('Submitted successfully');
//               }
//             }}
//             disabled={submitting}
//             className="px-4 py-2 bg-green-600 text-white rounded"
//           >
//             {submitting ? 'Submitting...' : 'Submit'}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
type Props = {
  draft: any;
  onEdit: (step: string) => void;
};

export function ApplicationReview({ draft, onEdit }: Props) {
  const profile = draft?.profile;

  return (
    <div className="space-y-6">
      {/* 🔹 Personal */}
      <Section title="Personal Information" onEdit={() => onEdit('personal')}>
        <p>
          <strong>Name (AR):</strong> {profile?.fullNameAr}
        </p>
        <p>
          <strong>Name (EN):</strong> {profile?.fullNameEn}
        </p>
        <p>
          <strong>National ID:</strong> {profile?.nationalId}
        </p>
        <p>
          <strong>Phone:</strong> {profile?.phone}
        </p>
        <p>
          <strong>City:</strong> {profile?.city}
        </p>
      </Section>

      {/* 🔹 Education */}
      <Section title="Education" onEdit={() => onEdit('education')}>
        {profile?.educations?.length ? (
          profile.educations.map((e, i) => (
            <div key={i}>
              {e.degree} - {e.field} @ {e.institution}
            </div>
          ))
        ) : (
          <p>No education added</p>
        )}
      </Section>

      {/* 🔹 Experience */}
      <Section title="Experience" onEdit={() => onEdit('experience')}>
        {profile?.experiences?.length ? (
          profile.experiences.map((e, i) => (
            <div key={i}>
              {e.position} @ {e.company}
            </div>
          ))
        ) : (
          <p>No experience added</p>
        )}
      </Section>

      {/* 🔹 Documents */}
      <Section title="Documents" onEdit={() => onEdit('documents')}>
        {draft?.documents?.length ? (
          <p>{draft.documents.length} files uploaded</p>
        ) : (
          <p>No documents uploaded</p>
        )}
      </Section>

      {/* 🔹 Certifications */}
      <Section title="Certifications" onEdit={() => onEdit('certifications')}>
        {profile?.certifications?.length ? (
          profile.certifications.map((c, i) => <div key={i}>{c.nameEn}</div>)
        ) : (
          <p>No certifications added</p>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children, onEdit }) {
  return (
    <div className="border rounded p-4">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        <button onClick={onEdit} className="text-blue-500 text-sm">
          Edit
        </button>
      </div>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}

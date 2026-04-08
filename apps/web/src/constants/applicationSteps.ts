export const APPLICATION_STEPS = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'education', label: 'Education' },
  { id: 'experience', label: 'Experience' },
  { id: 'documents', label: 'Documents' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'review', label: 'Review' },
];

export type StepId = (typeof APPLICATION_STEPS)[number]['id'];

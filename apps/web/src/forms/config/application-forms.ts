import { PersonalInfoForm } from '@/components/application/personal-info-form';
import { EducationForm } from '@/components/application/education-form';
import { ExperienceForm } from '@/components/application/experience-form';
import { DocumentsForm } from '@/components/application/documents-form';
import { ProfessionalCertificationsForm } from '@/components/application/professional-certifications-form';
import { ReviewForm } from '@/components/application/review-form';

export const stepComponents: Record<string, any> = {
  personal: PersonalInfoForm,
  education: EducationForm,
  experience: ExperienceForm,
  documents: DocumentsForm,
  certifications: ProfessionalCertificationsForm,
  review: ReviewForm,
};

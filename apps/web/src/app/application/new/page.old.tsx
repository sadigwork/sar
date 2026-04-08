'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  User,
  Award,
  Briefcase,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
} from 'lucide-react';

import { PersonalInfoForm } from '@/components/application/personal-info-form';
import { EducationForm } from '@/components/application/education-form';
import { ExperienceForm } from '@/components/application/experience-form';
import { DocumentsForm } from '@/components/application/documents-form';
import { ProfessionalCertificationsForm } from '@/components/application/professional-certifications-form';
import { ReviewForm } from '@/components/application/review-form';

import { useProfile } from '@/hooks/use-profile';
import { useApplicationDraft } from '@/hooks/use-application-draft';
import api from '@/lib/api';
import { Progress } from 'apps/web/src/components/ui/progress';

export default function NewApplicationPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const { profile } = useProfile();
  const { applicationId, getOrCreateDraft, clearDraft } = useApplicationDraft();

  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    personal: {},
    education: [],
    experience: [],
    documents: [],
    certifications: [],
  });

  // personal: {
  //   fullName: '',
  //   fullNameEn: '',
  //   nationalId: '',
  //   birthDate: '',
  //   address: '',
  //   city: '',
  //   country: '',
  //   postalCode: '',
  //   phoneNumber: '',
  //   email: '',
  //   specialization: '',
  //   graduationYear: '',
  //   university: '',
  // },

  // // =========================
  // // Prefill from profile
  // // =========================
  // useEffect(() => {
  //   if (!user) {
  //     router.push('/login');
  //     return;
  //   }

  //   if (profile) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       personal: {
  //         ...prev.personal,
  //         fullName: profile.fullNameAr || '',
  //         fullNameEn: profile.fullNameEn || '',
  //         nationalId: profile.nationalId || '',
  //         birthDate: profile.dateOfBirth || '',
  //         address: profile.address || '',
  //         city: profile.city || '',
  //         country: profile.country || '',
  //         postalCode: '',
  //         phoneNumber: profile.phone || '',
  //         email: profile.user?.email || '',
  //         specialization: profile.specialization || '',
  //         graduationYear: profile.graduationYear
  //           ? String(profile.graduationYear)
  //           : '',
  //         university: profile.university || '',
  //       },
  //       education: profile.educations || [],
  //       experience: profile.experiences || [],
  //       documents: profile.documents || [],
  //       certifications: [],
  //     }));
  //   }

  //   setIsLoading(false);
  // }, [user, profile]);

  // =========================
  // Steps
  // =========================

  const steps = [
    {
      id: 'personal',
      title: t('language') === 'en' ? 'Personal Info' : 'المعلومات الشخصية',
      description:
        t('language') === 'en'
          ? 'Basic personal information'
          : 'المعلومات الشخصية الأساسية',
      icon: User,
    },
    {
      id: 'education',
      title: t('language') === 'en' ? 'Education' : 'التعليم',
      description:
        t('language') === 'en' ? 'Educational background' : 'الخلفية التعليمية',
      icon: GraduationCap,
    },
    {
      id: 'experience',
      title: t('language') === 'en' ? 'Experience' : 'الخبرة',
      description:
        t('language') === 'en' ? 'Work experience' : 'الخبرة العملية',
      icon: Briefcase,
    },
    {
      id: 'documents',
      title: t('language') === 'en' ? 'Documents' : 'المستندات',
      description:
        t('language') === 'en' ? 'Supporting documents' : 'المستندات الداعمة',
      icon: FileText,
    },
    {
      id: 'certifications',
      title: t('language') === 'en' ? 'Certifications' : 'الشهادات المهنية',
      description:
        t('language') === 'en'
          ? 'Professional certifications'
          : 'الشهادات المهنية',
      icon: Award,
    },
    {
      id: 'review',
      title: t('language') === 'en' ? 'Review' : 'المراجعة',
      description:
        t('language') === 'en' ? 'Review your application' : 'مراجعة طلبك',
      icon: CheckCircle,
    },
  ];

  // =========================
  // Auth check
  // =========================
  useEffect(() => {
    if (!user) router.push('/login');
  }, [user]);

  // =========================
  // Save step
  // =========================
  const saveStep = async (stepKey: string, data: any) => {
    if (saving || stepKey === 'review') return;

    try {
      setSaving(true);

      if (stepKey === 'personal') {
        await api.patch('/profiles/me', data);
        return;
      }

      const appId = await getOrCreateDraft();
      if (!appId) throw new Error('No application id');

      await api.patch(`/applications/${appId}`, {
        step: stepKey,
        data,
      });
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Navigation (your version)
  // =========================
  const handleNext = async () => {
    const stepKey = steps[currentStep]?.id;
    if (!stepKey) return;

    const data = (formData as any)[stepKey];

    try {
      await saveStep(stepKey, data);

      if (currentStep < steps.length - 1) {
        setCurrentStep((s) => s + 1);
      }
    } catch {}
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = async () => {
    try {
      let appId = applicationId;

      if (!appId) {
        appId = await getOrCreateDraft();
        if (!appId) throw new Error('No application');
      }

      await api.post(`/applications/${appId}/submit`);

      clearDraft();

      toast({
        title: 'Success',
        description: 'Application submitted',
      });

      router.push('/dashboard');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Submit failed',
        variant: 'destructive',
      });
    }
  };

  // =========================
  // UI
  // =========================
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">
        {t('language') === 'en'
          ? 'New Certification Application'
          : 'طلب شهادة جديد'}
      </h1>
      <Progress value={progress} className="mb-6 h-2 bg-secondary" />
      <p className="text-muted-foreground mb-6">
        {t('language') === 'en'
          ? 'Complete all steps to submit your application for professional certification'
          : 'أكمل جميع الخطوات لتقديم طلبك للحصول على الشهادة المهنية'}
      </p>

      {/* <p className="text-muted-foreground mb-6">
        {t('language') === 'en'
          ? 'Complete all steps to submit your application for professional certification'
          : 'أكمل جميع الخطوات لتقديم طلبك للحصول على الشهادة المهنية'}
      </p>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            {t('language') === 'en' ? 'Step' : 'الخطوة'} {currentStep + 1}{' '}
            {t('language') === 'en' ? 'of' : 'من'} {steps.length}
          </span>
          <span className="text-sm font-medium">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-secondary" />
      </div>

      <div className="flex mb-6 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${index !== steps.length - 1 ? 'mr-2' : ''} ${t('language') === 'ar' ? 'rtl:ml-2 rtl:mr-0' : ''}`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                index < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index === currentStep
                    ? 'bg-gradient-green text-white'
                    : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <span
              className={`ml-2 text-sm ${
                index === currentStep
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {t('language') === 'en' ? step.title : step.title}
            </span>
            {index !== steps.length - 1 && (
              <div className="w-8 h-px bg-border mx-2"></div>
            )}
          </div>
        ))}
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 0 && (
            <PersonalInfoForm
              data={formData.personal}
              updateData={(data) => updateFormData('personal', data)}
            />
          )}
          {currentStep === 1 && (
            <EducationForm
              data={formData.education}
              updateData={(data) => updateFormData('education', data)}
            />
          )}
          {currentStep === 2 && (
            <ExperienceForm
              data={formData.experience}
              updateData={(data) => updateFormData('experience', data)}
            />
          )}
          {currentStep === 3 && (
            <DocumentsForm
              data={formData.documents}
              updateData={(data) => updateFormData('documents', data)}
            />
          )}
          {currentStep === 4 && (
            <ProfessionalCertificationsForm
              data={formData.certifications}
              updateData={(data) =>
                setFormData({ ...formData, certifications: data })
              }
            />
          )}
          {currentStep === 5 && <ReviewForm formData={formData} />}
        </CardContent>

      </Card> */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>
            {t('language') === 'en' ? 'Step' : 'الخطوة'} {currentStep + 1}{' '}
            {t('language') === 'en' ? 'of' : 'من'} {steps.length}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {currentStep === 0 && (
            <PersonalInfoForm
              data={formData.personal}
              updateData={(data) =>
                setFormData({ ...formData, personal: data })
              }
            />
          )}

          {currentStep === 1 && (
            <EducationForm
              data={formData.education}
              updateData={(data) =>
                setFormData({ ...formData, education: data })
              }
            />
          )}

          {currentStep === 2 && (
            <ExperienceForm
              data={formData.experience}
              updateData={(data) =>
                setFormData({ ...formData, experience: data })
              }
            />
          )}

          {currentStep === 3 && (
            <DocumentsForm
              data={formData.documents}
              updateData={(data) =>
                setFormData({ ...formData, documents: data })
              }
            />
          )}

          {currentStep === 4 && (
            <ProfessionalCertificationsForm
              data={formData.certifications}
              updateData={(data) =>
                setFormData({ ...formData, certifications: data })
              }
            />
          )}

          {currentStep === 5 && <ReviewForm formData={formData} />}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('language') === 'en' ? 'Previous' : 'السابق'}
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              {t('language') === 'en' ? 'Next' : 'التالي'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              {t('language') === 'en' ? 'Submit Application' : 'تقديم الطلب'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

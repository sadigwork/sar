'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Award,
  Briefcase,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  User,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PersonalInfoForm } from '@/components/application/personal-info-form';
import { EducationForm } from '@/components/application/education-form';
import { ExperienceForm } from '@/components/application/experience-form';
import { DocumentsForm } from '@/components/application/documents-form';
import { ReviewForm } from '@/components/application/review-form';
import { ProfessionalCertificationsForm } from '@/components/application/professional-certifications-form';
import { useProfile } from '@/hooks/use-profile';
import api from '@/lib/api';

export default function NewApplicationPage() {
  const { t } = useLanguage();
  const { user, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const { profile } = useProfile();

  // =========================
  // Prefill from profile
  // =========================
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (profile) {
      setFormData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: profile.fullNameAr || '',
          fullNameEn: profile.fullNameEn || '',
          nationalId: profile.nationalId || '',
          birthDate: profile.dateOfBirth || '',
          address: profile.address || '',
          city: profile.city || '',
          country: profile.country || '',
          postalCode: '',
          phoneNumber: profile.phone || '',
          email: profile.user?.email || '',
          specialization: profile.specialization || '',
          graduationYear: profile.graduationYear || '',
          university: profile.university || '',
        },
        education: profile.educations || [],
        experience: profile.experiences || [],
        documents: profile.documents || [],
        certifications: [],
      }));
    }

    setIsLoading(false);
  }, [user, profile]);

  const [isLoading, setIsLoading] = useState(true);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(0); // Always start from step 0 for new applications

  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    personal: {
      fullName: '',
      fullNameEn: '',
      nationalId: '',
      birthDate: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      phoneNumber: '',
      email: '',
      specialization: '',
      graduationYear: '',
      university: '',
    },
    education: [],
    experience: [],
    documents: [],
    certifications: [],
  });

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
  // Clear localStorage for new application
  // =========================
  useEffect(() => {
    // Clear old application data when starting new application
    localStorage.removeItem('applicationId');
    localStorage.removeItem('currentStep');
    setApplicationId(null);
    setCurrentStep(0);
  }, []);

  // =========================
  // Save Step index
  // =========================
  useEffect(() => {
    localStorage.setItem('currentStep', String(currentStep));
  }, [currentStep]);

  // =========================
  // Create Application (مرة واحدة فقط)
  // =========================
  const createApplicationIfNeeded = async () => {
    if (applicationId) return applicationId;

    // Fallback to persisted application id if exists
    const persistedId = localStorage.getItem('applicationId');
    if (persistedId && persistedId !== 'undefined') {
      setApplicationId(persistedId);
      return persistedId;
    }

    // If a create is in progress, wait until finished and retry
    if (creating) {
      let retries = 10;
      while (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        if (applicationId) return applicationId;
        const cached = localStorage.getItem('applicationId');
        if (cached && cached !== 'undefined') {
          setApplicationId(cached);
          return cached;
        }
        retries -= 1;
      }
    }

    // Try loading existing draft from backend
    try {
      console.log('Checking for existing draft...');
      const draftRes = await api.get(
        '/applications/my-draft?type=REGISTRATION',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Draft response:', draftRes.data);

      let draftId;
      if (draftRes.data?.id) {
        draftId = draftRes.data.id;
      } else if (draftRes.data?.data?.id) {
        draftId = draftRes.data.data.id;
      } else if (typeof draftRes.data === 'string') {
        draftId = draftRes.data;
      }

      if (draftId) {
        console.log('Found existing draft, using it:', draftId);
        setApplicationId(draftId);
        localStorage.setItem('applicationId', draftId);
        return draftId;
      } else {
        console.log('No existing draft found, will create new one');
      }
    } catch (err) {
      console.warn(
        'No existing draft found or error while loading draft:',
        err,
      );
    }

    try {
      setCreating(true);
      console.log('Creating new application...');

      const res = await api.post(
        '/applications',
        { type: 'REGISTRATION' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('New application created:', res.data);
      console.log('res.data structure:', JSON.stringify(res.data, null, 2));

      // Handle different response structures
      let appId;
      if (res.data?.id) {
        appId = res.data.id;
      } else if (res.data?.data?.id) {
        appId = res.data.data.id;
      } else if (typeof res.data === 'string') {
        appId = res.data;
      } else if (res.data && typeof res.data === 'object') {
        // Try to find id in the object
        appId = res.data.id || res.data._id || res.data.applicationId;
      }

      console.log('Extracted appId:', appId);

      if (!appId) {
        console.error(
          'ERROR: Could not extract appId from response:',
          res.data,
        );
        return null;
      }

      setApplicationId(appId);
      localStorage.setItem('applicationId', appId); // ✅ مهم

      toast({
        title: 'Draft created',
        description: 'Application draft created successfully',
      });

      return appId;
    } catch (err: any) {
      console.error('CREATE APPLICATION ERROR:', err);
      console.error('Full error response:', err.response);

      const message =
        typeof err?.response?.data?.message === 'string'
          ? err.response.data.message
          : Array.isArray(err?.response?.data?.message)
            ? err.response.data.message.join(', ')
            : 'Failed to create draft';

      console.error('Error message:', message);

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // Save Step (🔥 المهم)
  // =========================
  const saveStep = async (stepKey: string, data: any) => {
    if (saving) return;

    if (stepKey === 'review') {
      // review step is only UI confirmation; no server step update required
      return { message: 'Review step does not require server save' };
    }

    try {
      setSaving(true);

      if (stepKey === 'personal') {
        // Save personal info to profile
        const profileData = {
          fullNameAr: data.fullName,
          fullNameEn: data.fullName, // For now, use same for both
          nationalId: data.nationalId,
          phone: data.phoneNumber,
          dateOfBirth: data.birthDate,
          address: data.address,
          city: data.city,
          country: data.country,
        };

        console.log('Saving profile data:', profileData);

        if (!profile) {
          console.log('Creating new profile');
          // Create profile
          await api.post('/profiles', profileData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          console.log('Updating existing profile');
          // Update profile
          await api.patch('/profiles/me', profileData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        toast({
          title: 'Saved',
          description: 'Personal information saved successfully',
        });
      } else {
        // Save other steps to application
        console.log(
          'saveStep: Starting with applicationId state =',
          applicationId,
        );
        let appId = applicationId;

        if (!appId) {
          appId = localStorage.getItem('applicationId');
          console.log('Checked localStorage, appId =', appId);
        }

        if (!appId || appId === 'undefined') {
          console.log('Creating application because appId is null/undefined');
          appId = await createApplicationIfNeeded();
          console.log('createApplicationIfNeeded returned:', appId);
        } else {
          console.log('Using existing appId:', appId);
        }

        if (!appId || appId === 'undefined') {
          console.log('Still no appId, trying draft endpoint...');
          // Try draft endpoint one more time
          try {
            const draftRes = await api.get(
              '/applications/my-draft?type=REGISTRATION',
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            console.log('Draft retry response:', draftRes.data);
            let retryId;
            if (draftRes.data?.id) {
              retryId = draftRes.data.id;
            } else if (draftRes.data?.data?.id) {
              retryId = draftRes.data.data.id;
            } else if (typeof draftRes.data === 'string') {
              retryId = draftRes.data;
            }

            if (retryId) {
              appId = retryId;
              console.log('Got appId from draft retry:', appId);
              setApplicationId(appId);
              localStorage.setItem('applicationId', appId);
            }
          } catch (err) {
            console.error('Draft retry failed:', err);
          }
        }

        console.log('Final appId before validation:', appId);
        if (!appId || appId === 'undefined') {
          console.error('ERROR: No appId found after all attempts');
          throw new Error('Application ID is missing');
        }

        console.log('Sending to applications patch:', { step: stepKey, data });

        await api.patch(
          `/applications/${appId}`,
          {
            step: stepKey,
            data,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      if (stepKey !== 'personal') {
        toast({
          title: 'Saved',
          description: `${stepKey} saved successfully`,
        });
      }
    } catch (err) {
      console.error('SAVE STEP ERROR', err);
      toast({
        title: 'Error',
        description:
          stepKey === 'personal'
            ? 'Failed to save personal information. Please check all required fields.'
            : 'Failed to save data',
        variant: 'destructive',
      });

      // For personal info, throw error to prevent step advancement
      if (stepKey === 'personal') {
        throw err;
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Navigation
  // =========================
  const handleNext = async () => {
    const stepKey = steps[currentStep]?.id;
    if (!stepKey) return;

    const data = (formData as any)[stepKey];

    // Validate required fields for personal info
    if (stepKey === 'personal') {
      if (!data.fullName?.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Full name is required',
          variant: 'destructive',
        });
        return;
      }
      if (!data.nationalId?.trim()) {
        toast({
          title: 'Validation Error',
          description: 'National ID is required',
          variant: 'destructive',
        });
        return;
      }
    }

    try {
      await saveStep(stepKey, data);

      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      // Don't advance step if save failed
      console.error('Failed to save step:', stepKey, error);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // =========================
  // Submit Application
  // =========================
  const handleSubmit = async () => {
    try {
      if (!profile) {
        toast({
          title: 'Error',
          description: 'Profile not loaded yet',
          variant: 'destructive',
        });
        return;
      }

      // Handle profile status before application submit
      if (profile.status === 'REJECTED') {
        toast({
          title: 'Error',
          description:
            'Your profile was rejected. Please update your profile before submitting application.',
          variant: 'destructive',
        });
        return;
      }

      let currentProfileStatus = profile.status;

      if (currentProfileStatus === 'DRAFT') {
        if (typeof profile.completion !== 'number' || profile.completion < 80) {
          toast({
            title: 'Error',
            description:
              'Your profile is incomplete. Please complete your profile (80% or more) before submitting application.',
            variant: 'destructive',
          });
          return;
        }

        try {
          await api.post(
            '/profiles/me/submit',
            { notes: '' },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          currentProfileStatus = 'SUBMITTED';
        } catch (submitError: any) {
          const message =
            submitError?.response?.data?.message ||
            submitError?.message ||
            'Failed to submit profile. Please check required fields.';

          toast({
            title: 'Error',
            description: message,
            variant: 'destructive',
          });
          return;
        }
      }

      if (currentProfileStatus === 'DRAFT') {
        toast({
          title: 'Error',
          description:
            'Profile is still draft. Please verify your profile details and submit profile for review.',
          variant: 'destructive',
        });
        return;
      }

      if (
        currentProfileStatus !== 'SUBMITTED' &&
        currentProfileStatus !== 'APPROVED'
      ) {
        toast({
          title: 'Error',
          description:
            'Cannot submit application until profile is submitted or approved.',
          variant: 'destructive',
        });
        return;
      }

      let appId = applicationId;
      if (!appId || appId === 'undefined') {
        appId = await createApplicationIfNeeded();
        if (!appId) {
          toast({
            title: 'Error',
            description: 'No application found',
            variant: 'destructive',
          });
          return;
        }
        setApplicationId(appId);
      }

      await api.post(
        `/applications/${appId}/submit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // remove draft when submit
      localStorage.removeItem('applicationId'); // ✅ مهم
      localStorage.removeItem('currentStep');

      toast({
        title: t('language') === 'en' ? 'Submitted' : 'تم إنشاء الطلب',
        description:
          t('language') === 'en'
            ? 'Application submitted successfully'
            : 'ارسل الطلب بنجاح',
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error('CREATE APPLICATION ERROR:', error);
      const message =
        typeof error?.response?.data?.message === 'string'
          ? error.response.data.message
          : Array.isArray(error?.response?.data?.message)
            ? error.response.data.message.join(', ')
            : t('language') === 'en'
              ? 'Submission failed'
              : 'فشل ارسال الطلب';

      toast({
        title: t('language') === 'en' ? 'Error' : 'خطأ',
        description: message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{t('language') === 'en' ? 'Loading...' : 'جاري التحميل...'}</p>
      </div>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">
        {t('language') === 'en'
          ? 'New Certification Application'
          : 'طلب شهادة جديد'}
      </h1>
      <Progress value={progress} className="mb-6" />

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

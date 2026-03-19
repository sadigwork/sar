'use client';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import { useApplications } from '@/hooks/useApplications';
import { useLanguage } from '@/components/language-provider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  GraduationCap,
  Award,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useProfile();
  const { applications, isLoading: appsLoading } = useApplications();

  const isLoading = profileLoading || appsLoading;

  const profileCompletion = profile
    ? Math.floor(
        (((profile.fullNameAr ? 1 : 0) +
          (profile.phone ? 1 : 0) +
          (profile.address ? 1 : 0) +
          (profile.educations?.length > 0 ? 1 : 0) +
          (profile.experiences?.length > 0 ? 1 : 0)) /
          5) *
          100,
      )
    : 0;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(t('language') === 'en' ? 'en-US' : 'ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            {t('language') === 'en' ? 'Under Review' : 'قيد المراجعة'}
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            {t('language') === 'en' ? 'Approved' : 'تمت الموافقة'}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            {t('language') === 'en' ? 'Rejected' : 'مرفوض'}
          </Badge>
        );
      case 'action_required':
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            {t('language') === 'en' ? 'Action Required' : 'إجراء مطلوب'}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApplicationTypeIcon = (type: string) => {
    switch (type) {
      case 'certification':
        return <Award className="h-5 w-5 text-primary" />;
      case 'renewal':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'upgrade':
        return <GraduationCap className="h-5 w-5 text-primary" />;
      default:
        return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  const getApplicationTypeLabel = (type: string) => {
    switch (type) {
      case 'certification':
        return t('language') === 'en' ? 'Certification' : 'شهادة';
      case 'renewal':
        return t('language') === 'en' ? 'Renewal' : 'تجديد';
      case 'upgrade':
        return t('language') === 'en' ? 'Upgrade' : 'ترقية';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-10 w-40 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
        <Button
          onClick={() => router.push('/application/new')}
          className="bg-gradient-green hover:opacity-90"
        >
          + {t('language') === 'en' ? 'New Application' : 'طلب جديد'}
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>{t('profile')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>
                  {t('language') === 'en' ? 'Completion' : 'الاكتمال'}
                </span>
                <span>{profileCompletion}%</span>
              </div>
              <Progress
                value={profileCompletion}
                className="h-2 bg-secondary"
              />
              {profileCompletion < 100 && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm text-primary"
                  onClick={() => router.push('/profile')}
                >
                  {t('language') === 'en'
                    ? 'Complete your profile'
                    : 'أكمل ملفك الشخصي'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>{t('applications')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">{applications.length}</span>
              <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <p className="text-sm text-muted-foreground">
              {t('language') === 'en' ? 'Total applications' : 'إجمالي الطلبات'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>
              {t('language') === 'en' ? 'Pending Review' : 'قيد المراجعة'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">
                {applications.filter((app) => app.status === 'pending').length}
              </span>
              <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
            <p className="text-sm text-muted-foreground">
              {t('language') === 'en'
                ? 'Applications under review'
                : 'الطلبات قيد المراجعة'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>
              {t('language') === 'en' ? 'Action Required' : 'إجراء مطلوب'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">
                {
                  applications.filter((app) => app.status === 'action_required')
                    .length
                }
              </span>
              <AlertCircle className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
            <p className="text-sm text-muted-foreground">
              {t('language') === 'en'
                ? 'Requires your attention'
                : 'تتطلب انتباهك'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id} className="bg-card overflow-hidden">
            <div className="flex justify-between p-4">
              <div>
                {getApplicationTypeIcon(app.type)}{' '}
                {getApplicationTypeLabel(app.type)} - {app.level}
                <p className="text-sm text-muted-foreground">
                  {t('language') === 'en' ? 'Submitted on' : 'تم التقديم في'}:{' '}
                  {formatDate(app.createdAt)}
                </p>
              </div>
              <div>{getStatusBadge(app.status)}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

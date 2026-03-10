'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/components/auth-provider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  GraduationCap,
  Award,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for applications
const mockApplications = [
  {
    id: 'app1',
    type: 'certification',
    level: 'Intermediate',
    submissionDate: '2023-11-15T10:30:00Z',
    status: 'pending',
    statusText: 'Under Review',
    progress: 50,
    nextStep: 'Technical Review',
    reviewer: 'Ahmed Mohammed',
    estimatedCompletion: '2023-12-15T10:30:00Z',
    lastUpdated: '2023-11-20T14:45:00Z',
    notes:
      'Your application is currently being reviewed by our technical committee.',
    missingDocuments: [],
  },
  {
    id: 'app2',
    type: 'renewal',
    level: 'Advanced',
    submissionDate: '2023-10-05T09:15:00Z',
    status: 'action_required',
    statusText: 'Action Required',
    progress: 30,
    nextStep: 'Document Verification',
    reviewer: 'Sarah Johnson',
    estimatedCompletion: null,
    lastUpdated: '2023-10-25T11:20:00Z',
    notes:
      'Please provide the missing documents to proceed with your application.',
    missingDocuments: [
      'Experience certificate',
      'Professional development proof',
    ],
  },
  {
    id: 'app3',
    type: 'upgrade',
    level: 'Expert',
    submissionDate: '2023-09-20T14:00:00Z',
    status: 'approved',
    statusText: 'Approved',
    progress: 100,
    nextStep: 'Certificate Issuance',
    reviewer: 'Mohammed Al-Farsi',
    estimatedCompletion: '2023-10-30T10:30:00Z',
    lastUpdated: '2023-10-15T16:30:00Z',
    notes:
      'Congratulations! Your application has been approved. Your certificate will be issued soon.',
    missingDocuments: [],
  },
  {
    id: 'app4',
    type: 'certification',
    level: 'Beginner',
    submissionDate: '2023-08-10T11:45:00Z',
    status: 'rejected',
    statusText: 'Rejected',
    progress: 100,
    nextStep: null,
    reviewer: 'Fatima Al-Zahra',
    estimatedCompletion: null,
    lastUpdated: '2023-09-05T13:10:00Z',
    notes:
      'Your application does not meet the minimum requirements for certification. Please review the feedback and reapply after addressing the issues.',
    missingDocuments: [],
  },
];

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(75);
  const [notifications, setNotifications] = useState(3);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      // In a real app, fetch applications from API
      setTimeout(() => {
        setApplications(mockApplications);
        setIsLoading(false);
      }, 1000);
    }
  }, [router, user]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(t('language') === 'en' ? 'en-US' : 'ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="mr-1 h-3 w-3" />{' '}
            {t('language') === 'en' ? 'Under Review' : 'قيد المراجعة'}
          </Badge>
        );
      case 'approved':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="mr-1 h-3 w-3" />{' '}
            {t('language') === 'en' ? 'Approved' : 'تمت الموافقة'}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <XCircle className="mr-1 h-3 w-3" />{' '}
            {t('language') === 'en' ? 'Rejected' : 'مرفوض'}
          </Badge>
        );
      case 'action_required':
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <AlertCircle className="mr-1 h-3 w-3" />{' '}
            {t('language') === 'en' ? 'Action Required' : 'إجراء مطلوب'}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApplicationTypeIcon = (type) => {
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

  const getApplicationTypeLabel = (type) => {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>

        <div className="mt-8">
          <Skeleton className="h-64" />
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
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('language') === 'en' ? 'New Application' : 'طلب جديد'}
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('profile')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t('language') === 'en' ? 'Completion' : 'الاكتمال'}
                </span>
                <span className="text-sm font-medium">
                  {profileCompletion}%
                </span>
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
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('applications')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {applications.length}
                </span>
                <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t('language') === 'en'
                  ? 'Total applications'
                  : 'إجمالي الطلبات'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {t('language') === 'en' ? 'Pending Review' : 'قيد المراجعة'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {
                    applications.filter((app) => app.status === 'pending')
                      .length
                  }
                </span>
                <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t('language') === 'en'
                  ? 'Applications under review'
                  : 'الطلبات قيد المراجعة'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {t('language') === 'en' ? 'Action Required' : 'إجراء مطلوب'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {
                    applications.filter(
                      (app) => app.status === 'action_required',
                    ).length
                  }
                </span>
                <AlertCircle className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t('language') === 'en'
                  ? 'Requires your attention'
                  : 'تتطلب انتباهك'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications that need attention */}
      {applications.some((app) => app.status === 'action_required') && (
        <div className="mb-8">
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/30">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-300">
              {t('language') === 'en' ? 'Action Required' : 'إجراء مطلوب'}
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              {t('language') === 'en'
                ? 'Some of your applications require your attention. Please review and provide the requested information.'
                : 'بعض طلباتك تتطلب انتباهك. يرجى المراجعة وتقديم المعلومات المطلوبة.'}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Applications Tabs */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">
            {t('language') === 'en' ? 'All Applications' : 'جميع الطلبات'}
          </TabsTrigger>
          <TabsTrigger value="pending">
            {t('language') === 'en' ? 'Under Review' : 'قيد المراجعة'}
          </TabsTrigger>
          <TabsTrigger value="action_required">
            {t('language') === 'en' ? 'Action Required' : 'إجراء مطلوب'}
          </TabsTrigger>
          <TabsTrigger value="completed">
            {t('language') === 'en' ? 'Completed' : 'مكتملة'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          ) : (
            <EmptyApplicationsState />
          )}
        </TabsContent>

        <TabsContent value="pending">
          {applications.filter((app) => app.status === 'pending').length > 0 ? (
            <div className="space-y-4">
              {applications
                .filter((app) => app.status === 'pending')
                .map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))}
            </div>
          ) : (
            <EmptyStateMessage
              message={
                t('language') === 'en'
                  ? "You don't have any applications under review"
                  : 'ليس لديك أي طلبات قيد المراجعة'
              }
            />
          )}
        </TabsContent>

        <TabsContent value="action_required">
          {applications.filter((app) => app.status === 'action_required')
            .length > 0 ? (
            <div className="space-y-4">
              {applications
                .filter((app) => app.status === 'action_required')
                .map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))}
            </div>
          ) : (
            <EmptyStateMessage
              message={
                t('language') === 'en'
                  ? "You don't have any applications that require action"
                  : 'ليس لديك أي طلبات تتطلب إجراء'
              }
            />
          )}
        </TabsContent>

        <TabsContent value="completed">
          {applications.filter((app) =>
            ['approved', 'rejected'].includes(app.status),
          ).length > 0 ? (
            <div className="space-y-4">
              {applications
                .filter((app) => ['approved', 'rejected'].includes(app.status))
                .map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))}
            </div>
          ) : (
            <EmptyStateMessage
              message={
                t('language') === 'en'
                  ? "You don't have any completed applications"
                  : 'ليس لديك أي طلبات مكتملة'
              }
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Qualifications Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>{t('qualifications')}</CardTitle>
            <CardDescription>
              {t('language') === 'en'
                ? 'Your academic and professional qualifications'
                : 'مؤهلاتك الأكاديمية والمهنية'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {t('academicDegrees')}
                </span>
                <Badge className="bg-primary">{2}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {t('trainingCourses')}
                </span>
                <Badge className="bg-primary">{3}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {t('workExperience')}
                </span>
                <Badge className="bg-primary">{1}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {t('academicPapers')}
                </span>
                <Badge className="bg-primary">{0}</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/qualifications')}
            >
              {t('language') === 'en'
                ? 'Manage Qualifications'
                : 'إدارة المؤهلات'}
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>
              {t('language') === 'en'
                ? 'Recent Notifications'
                : 'الإشعارات الأخيرة'}
            </CardTitle>
            <CardDescription>
              {t('language') === 'en'
                ? 'Stay updated with your application status'
                : 'ابق على اطلاع بحالة طلبك'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">
                    {t('language') === 'en'
                      ? 'Your application has been received'
                      : 'تم استلام طلبك'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Your certification application has been received and is under initial review.'
                      : 'تم استلام طلب الشهادة الخاص بك وهو قيد المراجعة الأولية.'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2 {t('language') === 'en' ? 'hours ago' : 'ساعات مضت'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">
                    {t('language') === 'en'
                      ? 'Document verification in progress'
                      : 'جاري التحقق من المستندات'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'We are currently verifying your submitted documents. This may take 3-5 business days.'
                      : 'نحن نتحقق حاليًا من المستندات المقدمة. قد يستغرق هذا 3-5 أيام عمل.'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    1 {t('language') === 'en' ? 'day ago' : 'يوم مضى'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">
                    {t('language') === 'en'
                      ? 'Profile information updated'
                      : 'تم تحديث معلومات الملف الشخصي'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Your profile information has been successfully updated.'
                      : 'تم تحديث معلومات ملفك الشخصي بنجاح.'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 {t('language') === 'en' ? 'days ago' : 'أيام مضت'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/notifications')}
            >
              {t('language') === 'en'
                ? 'View All Notifications'
                : 'عرض جميع الإشعارات'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Application Card Component
function ApplicationCard({ application }) {
  const { t } = useLanguage();
  const router = useRouter();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(t('language') === 'en' ? 'en-US' : 'ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="mr-1 h-3 w-3" />{' '}
            {t('language') === 'en' ? 'Under Review' : 'قيد المراجعة'}
          </Badge>
        );
      case 'approved':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="mr-1 h-3 w-3" />{' '}
            {t('language') === 'en' ? 'Approved' : 'تمت الموافقة'}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <XCircle className="mr-1 h-3 w-3" />{' '}
            {t('language') === 'en' ? 'Rejected' : 'مرفوض'}
          </Badge>
        );
      case 'action_required':
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <AlertCircle className="mr-1 h-3 w-3" />{' '}
            {t('language') === 'en' ? 'Action Required' : 'إجراء مطلوب'}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApplicationTypeIcon = (type) => {
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

  const getApplicationTypeLabel = (type) => {
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

  return (
    <Card className="bg-card overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {getApplicationTypeIcon(application.type)}
              <div className="ml-3">
                <h3 className="font-semibold">
                  {getApplicationTypeLabel(application.type)} -{' '}
                  {application.level}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('language') === 'en' ? 'Submitted on' : 'تم التقديم في'}:{' '}
                  {formatDate(application.submissionDate)}
                </p>
              </div>
            </div>
            <div>{getStatusBadge(application.status)}</div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">
                {t('language') === 'en' ? 'Progress' : 'التقدم'}
              </span>
              <span className="text-sm font-medium">
                {application.progress}%
              </span>
            </div>
            <Progress
              value={application.progress}
              className="h-2 bg-secondary"
            />
          </div>

          {application.nextStep && (
            <div className="mb-4">
              <p className="text-sm font-medium">
                {t('language') === 'en' ? 'Next Step' : 'الخطوة التالية'}:{' '}
                {application.nextStep}
              </p>
            </div>
          )}

          {application.status === 'action_required' &&
            application.missingDocuments.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-blue-700">
                  {t('language') === 'en'
                    ? 'Required Documents'
                    : 'المستندات المطلوبة'}
                  :
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                  {application.missingDocuments.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}

          <p className="text-sm text-muted-foreground">{application.notes}</p>
        </div>

        <div className="bg-muted/20 p-6 flex flex-col justify-between md:w-64">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {t('language') === 'en' ? 'Last Updated' : 'آخر تحديث'}
              </p>
              <p className="font-medium">
                {formatDate(application.lastUpdated)}
              </p>
            </div>

            {application.estimatedCompletion && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('language') === 'en'
                    ? 'Estimated Completion'
                    : 'الإنجاز المتوقع'}
                </p>
                <p className="font-medium">
                  {formatDate(application.estimatedCompletion)}
                </p>
              </div>
            )}

            {application.reviewer && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('language') === 'en' ? 'Reviewer' : 'المراجع'}
                </p>
                <p className="font-medium">{application.reviewer}</p>
              </div>
            )}
          </div>

          <Button
            className="mt-4 w-full"
            onClick={() => router.push(`/application/${application.id}`)}
          >
            {t('language') === 'en' ? 'View Details' : 'عرض التفاصيل'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Empty Applications State
function EmptyApplicationsState() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <FileText className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {t('language') === 'en'
            ? 'No Applications Yet'
            : 'لا توجد طلبات حتى الآن'}
        </h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          {t('language') === 'en'
            ? "You haven't submitted any applications yet. Start your certification journey by creating a new application."
            : 'لم تقم بتقديم أي طلبات حتى الآن. ابدأ رحلة الحصول على الشهادة من خلال إنشاء طلب جديد.'}
        </p>
        <Button
          onClick={() => router.push('/application/new')}
          className="bg-gradient-green hover:opacity-90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('language') === 'en' ? 'Start New Application' : 'بدء طلب جديد'}
        </Button>
      </CardContent>
    </Card>
  );
}

// Empty State Message
function EmptyStateMessage({ message }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

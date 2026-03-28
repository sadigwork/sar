'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApplications } from '@/hooks/use-applications';
import { useNotifications } from '@/hooks/use-notifications';
import { useProfile } from '@/hooks/use-profile';
import { useAuth } from '@/components/auth-provider';
import { useLanguage } from '@/components/language-provider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ApplicationTimeline } from '@/components/application/application-timeline';
import { buildTimeline } from '@/lib/workflow/application-timeline';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Award,
  GraduationCap,
  Plus,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const { user, token } = useAuth();
  const {
    profile,
    isLoading: loadingProfile,
    isError: errorProfile,
  } = useProfile();
  const {
    applications,
    isLoading: loadingApplications,
    isError: errorApplications,
  } = useApplications();
  const {
    notifications,
    isLoading: loadingNotifications,
    isError: errorNotifications,
  } = useNotifications();

  // Console orginize log
  useEffect(() => {
    console.group('DASHBOARD DATA');
    console.log('USER:', user);
    console.log('TOKEN:', token);
    console.log('PROFILE:', profile);
    console.log('APPLICATIONS:', applications);
    console.log('NOTIFICATIONS:', notifications);
    console.groupEnd();
  }, [user, token, profile, applications, notifications]);

  if (loadingProfile || loadingApplications || loadingNotifications || !token) {
    return <p>Loading dashboard data...</p>;
  }

  if (errorProfile || errorApplications || errorNotifications) {
    return <p>Error loading dashboard data. Check console for details.</p>;
  }

  // const safeApplications: applications || [];
  // ترتيب حسب الأحدث
  const sortedApplications = [...applications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Profile completion
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

  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString(
          t('language') === 'en' ? 'en-US' : 'ar-SA',
          { year: 'numeric', month: 'long', day: 'numeric' },
        )
      : '';

  const mapStatus = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
      case 'REGISTRAR_REVIEW':
      case 'REVIEWER_REVIEW':
        return 'pending';
      case 'APPROVED':
        return 'approved';
      case 'REJECTED':
        return 'rejected';
      case 'PAYMENT_PENDING':
        return 'action_required';
      default:
        return 'pending';
    }
  };

  const getStatusBadge = (status: string) => {
    const mapped = mapStatus(status);

    switch (mapped) {
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

  if (loadingProfile || loadingApplications || loadingNotifications) {
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

  const pendingCount = sortedApplications.filter(
    (a) => mapStatus(a.status) === 'pending',
  ).length;

  const actionCount = sortedApplications.filter(
    (a) => mapStatus(a.status) === 'action_required',
  ).length;

  const completedCount = sortedApplications.filter((a) =>
    ['approved', 'rejected'].includes(mapStatus(a.status)),
  ).length;

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
          <p className="text-muted-foreground">
            {t('language') === 'en'
              ? 'Your dashboard'
              : 'لوحة التحكم الخاصة بك'}
          </p>
        </div>
        <Button onClick={() => router.push('/application/new')}>
          <Plus className="mr-2 h-4 w-4" />{' '}
          {t('language') === 'en' ? 'New Application' : 'طلب جديد'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('language') === 'en' ? 'Profile' : 'الملف الشخصي'}
            </CardTitle>
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

        {/* Applications Count */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('language') === 'en' ? 'Applications' : 'الطلبات'}
            </CardTitle>
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

        {/* Pending */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('language') === 'en' ? 'Pending Review' : 'قيد المراجعة'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">
                {
                  applications.filter((a) => mapStatus(a.status) === 'pending')
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
          </CardContent>
        </Card>

        {/* Action Required */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('language') === 'en' ? 'Action Required' : 'إجراء مطلوب'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold">
                {
                  applications.filter(
                    (a) => mapStatus(a.status) === 'action_required',
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
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card className="bg-card mb-6">
        <CardHeader>
          <CardTitle>
            {t('language') === 'en' ? 'Notifications' : 'الإشعارات'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(notifications || []).length > 0 ? (
            (notifications || []).map((n) => (
              <div key={n.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm">{n.title || n.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(n.createdAt)}
                  </p>
                </div>
                {!n.read && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {t('language') === 'en' ? 'New' : 'جديد'}
                  </Badge>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('language') === 'en' ? 'No notifications' : 'لا توجد إشعارات'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Applications Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">
            {t('language') === 'en' ? 'All' : 'الكل'}(
            {sortedApplications.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            {t('language') === 'en' ? 'Pending' : 'قيد المراجعة'}({pendingCount}
            )
          </TabsTrigger>
          <TabsTrigger value="action">
            {t('language') === 'en' ? 'Action Required' : 'إجراء مطلوب'} (
            {actionCount})
          </TabsTrigger>
          <TabsTrigger value="completed">
            {t('language') === 'en' ? 'Completed' : 'مكتملة'} ({completedCount})
          </TabsTrigger>
        </TabsList>

        {/* All */}
        <TabsContent value="all">
          <ApplicationsList apps={applications} />
        </TabsContent>

        {/* Pending */}
        <TabsContent value="pending">
          <ApplicationsList
            apps={sortedApplications.filter(
              (a) => mapStatus(a.status) === 'pending',
            )}
          />
        </TabsContent>

        {/* Action Required */}
        <TabsContent value="action">
          <ApplicationsList
            apps={applications.filter(
              (a) => mapStatus(a.status) === 'action_required',
            )}
          />
        </TabsContent>

        {/* Completed */}
        <TabsContent value="completed">
          <ApplicationsList
            apps={applications.filter((a) =>
              ['approved', 'rejected'].includes(mapStatus(a.status)),
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  /* ========================= */
  /* Application Card Component */
  /* ========================= */
  function ApplicationCard({ app }: { app: any }) {
    const timeline = buildTimeline(app);
    return (
      <Card className="mb-3">
        <CardContent className="flex justify-between items-center p-4">
          <div>
            <p className="font-medium">
              {app.type} - {app.currentStage}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(app.createdAt)}
            </p>
          </div>
          <div>{getStatusBadge(app.status)}</div>
          <Button
            size="sm"
            onClick={() => router.push(`/application/${app.id}`)}
          >
            View
          </Button>
          <ApplicationTimeline steps={timeline} />
        </CardContent>
      </Card>
    );
  }
  function ApplicationsList({ apps }: { apps: any[] }) {
    if (!apps || apps.length === 0) {
      return (
        <p className="text-sm text-muted-foreground text-center py-6">
          No applications found
        </p>
      );
    }

    return (
      <div className="space-y-4">
        {apps.map((app) => (
          <ApplicationCard key={app.id} app={app} />
        ))}
      </div>
    );
  }
}

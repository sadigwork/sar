'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/components/auth-provider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  Award,
  FileCheck,
  UserCheck,
  BarChart3,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Check if user is logged in and is an admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    }
  }, [user, authLoading, router]);

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{t('language') === 'en' ? 'Loading...' : 'جاري التحميل...'}</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">
        {t('language') === 'en' ? 'Admin Dashboard' : 'لوحة تحكم المدير'}
      </h1>
      <p className="text-muted-foreground mb-6">
        {t('language') === 'en'
          ? 'Manage users, certifications, and system settings'
          : 'إدارة المستخدمين والشهادات وإعدادات النظام'}
      </p>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">
            {t('language') === 'en' ? 'Overview' : 'نظرة عامة'}
          </TabsTrigger>
          <TabsTrigger value="institutions">
            {t('language') === 'en' ? 'Institutions' : 'المؤسسات'}
          </TabsTrigger>
          <TabsTrigger value="fellowships">
            {t('language') === 'en' ? 'Fellowships' : 'الزمالات'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle>
                  {t('language') === 'en' ? 'Total Users' : 'إجمالي المستخدمين'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-primary mr-2" />
                    <span className="text-3xl font-bold">248</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    12%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle>
                  {t('language') === 'en' ? 'Certifications' : 'الشهادات'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-primary mr-2" />
                    <span className="text-3xl font-bold">156</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    8%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle>
                  {t('language') === 'en'
                    ? 'Pending Approvals'
                    : 'الموافقات المعلقة'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileCheck className="h-8 w-8 text-yellow-500 mr-2" />
                    <span className="text-3xl font-bold">24</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                    {t('language') === 'en' ? 'Pending' : 'معلق'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle>
                  {t('language') === 'en' ? 'Reviewers' : 'المراجعين'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserCheck className="h-8 w-8 text-primary mr-2" />
                    <span className="text-3xl font-bold">12</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />2
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>
                  {t('language') === 'en'
                    ? 'Certification Statistics'
                    : 'إحصائيات الشهادات'}
                </CardTitle>
                <CardDescription>
                  {t('language') === 'en'
                    ? 'Distribution by certification level'
                    : 'التوزيع حسب مستوى الشهادة'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {t('language') === 'en'
                          ? 'Entry Level'
                          : 'مستوى المبتدئ'}
                      </span>
                      <span className="text-sm font-medium">42</span>
                    </div>
                    <Progress value={27} className="h-2 bg-secondary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {t('language') === 'en' ? 'Intermediate' : 'متوسط'}
                      </span>
                      <span className="text-sm font-medium">58</span>
                    </div>
                    <Progress value={37} className="h-2 bg-secondary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {t('language') === 'en' ? 'Advanced' : 'متقدم'}
                      </span>
                      <span className="text-sm font-medium">32</span>
                    </div>
                    <Progress value={21} className="h-2 bg-secondary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {t('language') === 'en' ? 'Expert' : 'خبير'}
                      </span>
                      <span className="text-sm font-medium">18</span>
                    </div>
                    <Progress value={12} className="h-2 bg-secondary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {t('language') === 'en' ? 'Consultant' : 'استشاري'}
                      </span>
                      <span className="text-sm font-medium">6</span>
                    </div>
                    <Progress value={4} className="h-2 bg-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>
                  {t('language') === 'en'
                    ? 'Recent Applications'
                    : 'الطلبات الأخيرة'}
                </CardTitle>
                <CardDescription>
                  {t('language') === 'en'
                    ? 'Latest certification applications'
                    : 'أحدث طلبات الشهادات'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32`}
                            alt="User"
                          />
                          <AvatarFallback>
                            {i === 1
                              ? 'AM'
                              : i === 2
                                ? 'SA'
                                : i === 3
                                  ? 'KI'
                                  : 'FH'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {i === 1
                              ? t('language') === 'en'
                                ? 'Ahmed Mohamed'
                                : 'أحمد محمد'
                              : i === 2
                                ? t('language') === 'en'
                                  ? 'Sara Ali'
                                  : 'سارة علي'
                                : i === 3
                                  ? t('language') === 'en'
                                    ? 'Khaled Ibrahim'
                                    : 'خالد إبراهيم'
                                  : t('language') === 'en'
                                    ? 'Fatima Hassan'
                                    : 'فاطمة حسن'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {i === 1
                              ? t('language') === 'en'
                                ? 'Expert Level'
                                : 'مستوى خبير'
                              : i === 2
                                ? t('language') === 'en'
                                  ? 'Intermediate Level'
                                  : 'مستوى متوسط'
                                : i === 3
                                  ? t('language') === 'en'
                                    ? 'Advanced Level'
                                    : 'مستوى متقدم'
                                  : t('language') === 'en'
                                    ? 'Entry Level'
                                    : 'مستوى مبتدئ'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {i === 1 ? (
                          <Badge
                            variant="outline"
                            className="flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            {t('language') === 'en' ? 'New' : 'جديد'}
                          </Badge>
                        ) : i === 2 ? (
                          <Badge
                            variant="outline"
                            className="flex items-center bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            {t('language') === 'en'
                              ? 'Pending'
                              : 'قيد الانتظار'}
                          </Badge>
                        ) : i === 3 ? (
                          <Badge
                            variant="outline"
                            className="flex items-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {t('language') === 'en'
                              ? 'Approved'
                              : 'تمت الموافقة'}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="flex items-center bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          >
                            <AlertCircle className="mr-1 h-3 w-3" />
                            {t('language') === 'en' ? 'Rejected' : 'مرفوض'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>
                  {t('language') === 'en'
                    ? 'User Management'
                    : 'إدارة المستخدمين'}
                </CardTitle>
                <CardDescription>
                  {t('language') === 'en'
                    ? 'Manage system users'
                    : 'إدارة مستخدمي النظام'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                      {t('language') === 'en' ? 'All Users' : 'جميع المستخدمين'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => router.push('/admin/users')}
                    className="bg-gradient-green hover:opacity-90"
                  >
                    {t('language') === 'en' ? 'Manage' : 'إدارة'}
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                      {t('language') === 'en' ? 'Reviewers' : 'المراجعين'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => router.push('/admin/users?role=reviewer')}
                    className="bg-gradient-green hover:opacity-90"
                  >
                    {t('language') === 'en' ? 'Manage' : 'إدارة'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>
                  {t('language') === 'en'
                    ? 'Certification Management'
                    : 'إدارة الشهادات'}
                </CardTitle>
                <CardDescription>
                  {t('language') === 'en'
                    ? 'Manage certification levels and criteria'
                    : 'إدارة مستويات ومعايير الشهادات'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                      {t('language') === 'en'
                        ? 'Certification Levels'
                        : 'مستويات الشهادات'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => router.push('/admin/certifications/levels')}
                    className="bg-gradient-green hover:opacity-90"
                  >
                    {t('language') === 'en' ? 'Manage' : 'إدارة'}
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                      {t('language') === 'en'
                        ? 'Certification Criteria'
                        : 'معايير الشهادات'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() =>
                      router.push('/admin/certifications/criteria')
                    }
                    className="bg-gradient-green hover:opacity-90"
                  >
                    {t('language') === 'en' ? 'Manage' : 'إدارة'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>
                  {t('language') === 'en'
                    ? 'System Settings'
                    : 'إعدادات النظام'}
                </CardTitle>
                <CardDescription>
                  {t('language') === 'en'
                    ? 'Manage system configuration'
                    : 'إدارة إعدادات النظام'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                      {t('language') === 'en'
                        ? 'System Reports'
                        : 'تقارير النظام'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => router.push('/admin/reports')}
                    className="bg-gradient-green hover:opacity-90"
                  >
                    {t('language') === 'en' ? 'View' : 'عرض'}
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-muted-foreground"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span className="font-medium">
                      {t('language') === 'en'
                        ? 'System Settings'
                        : 'إعدادات النظام'}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => router.push('/admin/settings')}
                    className="bg-gradient-green hover:opacity-90"
                  >
                    {t('language') === 'en' ? 'Configure' : 'تكوين'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="institutions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>
                  {t('language') === 'en'
                    ? 'Total Institutions'
                    : 'إجمالي المؤسسات'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-primary mr-2" />
                    <span className="text-3xl font-bold">42</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    15%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>
                  {t('language') === 'en'
                    ? 'Educational Institutions'
                    : 'المؤسسات التعليمية'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GraduationCap className="h-8 w-8 text-primary mr-2" />
                    <span className="text-3xl font-bold">18</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    10%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>
                  {t('language') === 'en'
                    ? 'Agricultural Companies'
                    : 'الشركات الزراعية'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-primary mr-2" />
                    <span className="text-3xl font-bold">24</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    18%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {t('language') === 'en'
                  ? 'Pending Institution Registrations'
                  : 'تسجيلات المؤسسات المعلقة'}
              </CardTitle>
              <CardDescription>
                {t('language') === 'en'
                  ? 'Institutions awaiting approval'
                  : 'المؤسسات التي تنتظر الموافقة'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {i === 1 || i === 3 ? (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {i === 1
                            ? t('language') === 'en'
                              ? 'Agricultural University'
                              : 'الجامعة الزراعية'
                            : i === 2
                              ? t('language') === 'en'
                                ? 'Green Farms Ltd'
                                : 'شركة المزارع الخضراء'
                              : t('language') === 'en'
                                ? 'Water Resources Institute'
                                : 'معهد موارد المياه'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {i === 1 || i === 3
                            ? t('language') === 'en'
                              ? 'Educational Institution'
                              : 'مؤسسة تعليمية'
                            : t('language') === 'en'
                              ? 'Agricultural Company'
                              : 'شركة زراعية'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="flex items-center bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        {t('language') === 'en' ? 'Pending' : 'قيد الانتظار'}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/institutions/review/${i}`)
                        }
                      >
                        {t('language') === 'en' ? 'Review' : 'مراجعة'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => router.push('/admin/institutions')}
              className="bg-gradient-green hover:opacity-90"
            >
              {t('language') === 'en'
                ? 'View All Institutions'
                : 'عرض جميع المؤسسات'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="fellowships" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>
                  {t('language') === 'en'
                    ? 'Total Fellowships'
                    : 'إجمالي الزمالات'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-primary mr-2" />
                    <span className="text-3xl font-bold">8</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    25%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>
                  {t('language') === 'en'
                    ? 'Active Fellows'
                    : 'الزملاء النشطون'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-primary mr-2" />
                    <span className="text-3xl font-bold">32</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    12%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>
                  {t('language') === 'en'
                    ? 'Pending Applications'
                    : 'الطلبات المعلقة'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileCheck className="h-8 w-8 text-yellow-500 mr-2" />
                    <span className="text-3xl font-bold">14</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                    {t('language') === 'en' ? 'Pending' : 'معلق'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {t('language') === 'en'
                  ? 'Pending Fellowship Applications'
                  : 'طلبات الزمالة المعلقة'}
              </CardTitle>
              <CardDescription>
                {t('language') === 'en'
                  ? 'Applications awaiting review'
                  : 'الطلبات التي تنتظر المراجعة'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40`}
                          alt="Applicant"
                        />
                        <AvatarFallback>
                          {i === 1 ? 'AM' : i === 2 ? 'SA' : 'KI'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {i === 1
                            ? t('language') === 'en'
                              ? 'Ahmed Mohamed'
                              : 'أحمد محمد'
                            : i === 2
                              ? t('language') === 'en'
                                ? 'Sara Ali'
                                : 'سارة علي'
                              : t('language') === 'en'
                                ? 'Khaled Ibrahim'
                                : 'خالد إبراهيم'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {i === 1
                            ? t('language') === 'en'
                              ? 'Water Management Fellowship'
                              : 'زمالة إدارة المياه'
                            : i === 2
                              ? t('language') === 'en'
                                ? 'Sustainable Agriculture Fellowship'
                                : 'زمالة الزراعة المستدامة'
                              : t('language') === 'en'
                                ? 'Agricultural Technology Fellowship'
                                : 'زمالة التكنولوجيا الزراعية'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="flex items-center bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        {t('language') === 'en' ? 'Pending' : 'قيد الانتظار'}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/fellowships/review/${i}`)
                        }
                      >
                        {t('language') === 'en' ? 'Review' : 'مراجعة'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={() => router.push('/admin/fellowships')}
              className="bg-gradient-green hover:opacity-90"
            >
              {t('language') === 'en' ? 'Manage Fellowships' : 'إدارة الزمالات'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

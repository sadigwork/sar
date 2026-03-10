'use client';

import { useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Save,
  RefreshCw,
  Globe,
  Bell,
  Shield,
  Users,
  Mail,
} from 'lucide-react';

export default function SystemSettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // General Settings
  const [systemName, setSystemName] = useState(
    'Agricultural Engineers Registration System',
  );
  const [systemNameAr, setSystemNameAr] = useState(
    'نظام تسجيل المهندسين الزراعيين',
  );
  const [defaultLanguage, setDefaultLanguage] = useState('ar');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Email Settings
  const [emailSender, setEmailSender] = useState('no-reply@agrieng-system.com');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [welcomeEmailEnabled, setWelcomeEmailEnabled] = useState(true);
  const [applicationStatusEmailEnabled, setApplicationStatusEmailEnabled] =
    useState(true);

  // Security Settings
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [passwordRequireSpecialChar, setPasswordRequireSpecialChar] =
    useState(true);
  const [passwordRequireNumbers, setPasswordRequireNumbers] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // User Settings
  const [allowSelfRegistration, setAllowSelfRegistration] = useState(true);
  const [requireEmailVerification, setRequireEmailVerification] =
    useState(true);
  const [autoApproveUsers, setAutoApproveUsers] = useState(false);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);

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

  const handleSaveSettings = () => {
    // This would be an API call in a real app
    toast({
      title: t('language') === 'en' ? 'Settings Saved' : 'تم حفظ الإعدادات',
      description:
        t('language') === 'en'
          ? 'System settings have been updated successfully'
          : 'تم تحديث إعدادات النظام بنجاح',
    });
  };

  const handleResetSettings = () => {
    // Reset to default values
    setSystemName('Agricultural Engineers Registration System');
    setSystemNameAr('نظام تسجيل المهندسين الزراعيين');
    setDefaultLanguage('ar');
    setMaintenanceMode(false);
    setEmailSender('no-reply@agrieng-system.com');
    setEmailNotifications(true);
    setWelcomeEmailEnabled(true);
    setApplicationStatusEmailEnabled(true);
    setPasswordMinLength(8);
    setPasswordRequireSpecialChar(true);
    setPasswordRequireNumbers(true);
    setSessionTimeout(60);
    setTwoFactorAuth(false);
    setAllowSelfRegistration(true);
    setRequireEmailVerification(true);
    setAutoApproveUsers(false);
    setMaxLoginAttempts(5);

    toast({
      title:
        t('language') === 'en' ? 'Settings Reset' : 'تم إعادة تعيين الإعدادات',
      description:
        t('language') === 'en'
          ? 'System settings have been reset to default values'
          : 'تم إعادة تعيين إعدادات النظام إلى القيم الافتراضية',
    });
  };

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{t('language') === 'en' ? 'Loading...' : 'جاري التحميل...'}</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t('language') === 'en' ? 'System Settings' : 'إعدادات النظام'}
          </h1>
          <p className="text-muted-foreground">
            {t('language') === 'en'
              ? 'Configure system settings and preferences'
              : 'تكوين إعدادات وتفضيلات النظام'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('language') === 'en'
              ? 'Reset to Default'
              : 'إعادة التعيين للافتراضي'}
          </Button>
          <Button
            onClick={handleSaveSettings}
            className="bg-gradient-green hover:opacity-90"
          >
            <Save className="mr-2 h-4 w-4" />
            {t('language') === 'en' ? 'Save Settings' : 'حفظ الإعدادات'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            {t('language') === 'en' ? 'General' : 'عام'}
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            {t('language') === 'en' ? 'Email' : 'البريد الإلكتروني'}
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            {t('language') === 'en' ? 'Security' : 'الأمان'}
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            {t('language') === 'en' ? 'Users' : 'المستخدمين'}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            {t('language') === 'en' ? 'Notifications' : 'الإشعارات'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>
                {t('language') === 'en'
                  ? 'General Settings'
                  : 'الإعدادات العامة'}
              </CardTitle>
              <CardDescription>
                {t('language') === 'en'
                  ? 'Configure basic system settings'
                  : 'تكوين إعدادات النظام الأساسية'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">
                    {t('language') === 'en'
                      ? 'System Name (English)'
                      : 'اسم النظام (بالإنجليزية)'}
                  </Label>
                  <Input
                    id="systemName"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemNameAr">
                    {t('language') === 'en'
                      ? 'System Name (Arabic)'
                      : 'اسم النظام (بالعربية)'}
                  </Label>
                  <Input
                    id="systemNameAr"
                    value={systemNameAr}
                    onChange={(e) => setSystemNameAr(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">
                  {t('language') === 'en'
                    ? 'Default Language'
                    : 'اللغة الافتراضية'}
                </Label>
                <Select
                  value={defaultLanguage}
                  onValueChange={setDefaultLanguage}
                >
                  <SelectTrigger id="defaultLanguage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode" className="block mb-1">
                    {t('language') === 'en'
                      ? 'Maintenance Mode'
                      : 'وضع الصيانة'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'When enabled, only administrators can access the system'
                      : 'عند التمكين، يمكن للمسؤولين فقط الوصول إلى النظام'}
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>
                {t('language') === 'en'
                  ? 'Email Settings'
                  : 'إعدادات البريد الإلكتروني'}
              </CardTitle>
              <CardDescription>
                {t('language') === 'en'
                  ? 'Configure email notifications and settings'
                  : 'تكوين إشعارات وإعدادات البريد الإلكتروني'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="emailSender">
                  {t('language') === 'en'
                    ? 'Email Sender Address'
                    : 'عنوان مرسل البريد الإلكتروني'}
                </Label>
                <Input
                  id="emailSender"
                  type="email"
                  value={emailSender}
                  onChange={(e) => setEmailSender(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications" className="block mb-1">
                    {t('language') === 'en'
                      ? 'Email Notifications'
                      : 'إشعارات البريد الإلكتروني'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Enable or disable all email notifications'
                      : 'تمكين أو تعطيل جميع إشعارات البريد الإلكتروني'}
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="welcomeEmailEnabled" className="block mb-1">
                    {t('language') === 'en' ? 'Welcome Email' : 'بريد الترحيب'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Send welcome email to new users'
                      : 'إرسال بريد ترحيبي للمستخدمين الجدد'}
                  </p>
                </div>
                <Switch
                  id="welcomeEmailEnabled"
                  checked={welcomeEmailEnabled}
                  onCheckedChange={setWelcomeEmailEnabled}
                  disabled={!emailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="applicationStatusEmailEnabled"
                    className="block mb-1"
                  >
                    {t('language') === 'en'
                      ? 'Application Status Updates'
                      : 'تحديثات حالة الطلب'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Send email when application status changes'
                      : 'إرسال بريد إلكتروني عند تغيير حالة الطلب'}
                  </p>
                </div>
                <Switch
                  id="applicationStatusEmailEnabled"
                  checked={applicationStatusEmailEnabled}
                  onCheckedChange={setApplicationStatusEmailEnabled}
                  disabled={!emailNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>
                {t('language') === 'en'
                  ? 'Security Settings'
                  : 'إعدادات الأمان'}
              </CardTitle>
              <CardDescription>
                {t('language') === 'en'
                  ? 'Configure security and authentication settings'
                  : 'تكوين إعدادات الأمان والمصادقة'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">
                    {t('language') === 'en'
                      ? 'Minimum Password Length'
                      : 'الحد الأدنى لطول كلمة المرور'}
                  </Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    min="6"
                    max="20"
                    value={passwordMinLength}
                    onChange={(e) =>
                      setPasswordMinLength(Number.parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    {t('language') === 'en'
                      ? 'Session Timeout (minutes)'
                      : 'مهلة الجلسة (دقائق)'}
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="5"
                    max="240"
                    value={sessionTimeout}
                    onChange={(e) =>
                      setSessionTimeout(Number.parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="passwordRequireSpecialChar"
                    className="block mb-1"
                  >
                    {t('language') === 'en'
                      ? 'Require Special Characters'
                      : 'تتطلب أحرف خاصة'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Passwords must contain at least one special character'
                      : 'يجب أن تحتوي كلمات المرور على حرف خاص واحد على الأقل'}
                  </p>
                </div>
                <Switch
                  id="passwordRequireSpecialChar"
                  checked={passwordRequireSpecialChar}
                  onCheckedChange={setPasswordRequireSpecialChar}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="passwordRequireNumbers"
                    className="block mb-1"
                  >
                    {t('language') === 'en' ? 'Require Numbers' : 'تتطلب أرقام'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Passwords must contain at least one number'
                      : 'يجب أن تحتوي كلمات المرور على رقم واحد على الأقل'}
                  </p>
                </div>
                <Switch
                  id="passwordRequireNumbers"
                  checked={passwordRequireNumbers}
                  onCheckedChange={setPasswordRequireNumbers}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth" className="block mb-1">
                    {t('language') === 'en'
                      ? 'Two-Factor Authentication'
                      : 'المصادقة الثنائية'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Require two-factor authentication for all users'
                      : 'تتطلب المصادقة الثنائية لجميع المستخدمين'}
                  </p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>
                {t('language') === 'en'
                  ? 'User Settings'
                  : 'إعدادات المستخدمين'}
              </CardTitle>
              <CardDescription>
                {t('language') === 'en'
                  ? 'Configure user registration and account settings'
                  : 'تكوين إعدادات تسجيل المستخدمين والحسابات'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowSelfRegistration" className="block mb-1">
                    {t('language') === 'en'
                      ? 'Allow Self Registration'
                      : 'السماح بالتسجيل الذاتي'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Allow users to register their own accounts'
                      : 'السماح للمستخدمين بتسجيل حساباتهم الخاصة'}
                  </p>
                </div>
                <Switch
                  id="allowSelfRegistration"
                  checked={allowSelfRegistration}
                  onCheckedChange={setAllowSelfRegistration}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="requireEmailVerification"
                    className="block mb-1"
                  >
                    {t('language') === 'en'
                      ? 'Require Email Verification'
                      : 'تتطلب التحقق من البريد الإلكتروني'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Users must verify their email before accessing the system'
                      : 'يجب على المستخدمين التحقق من بريدهم الإلكتروني قبل الوصول إلى النظام'}
                  </p>
                </div>
                <Switch
                  id="requireEmailVerification"
                  checked={requireEmailVerification}
                  onCheckedChange={setRequireEmailVerification}
                  disabled={!allowSelfRegistration}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoApproveUsers" className="block mb-1">
                    {t('language') === 'en'
                      ? 'Auto-Approve New Users'
                      : 'الموافقة التلقائية على المستخدمين الجدد'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Automatically approve new user registrations'
                      : 'الموافقة تلقائيًا على تسجيلات المستخدمين الجدد'}
                  </p>
                </div>
                <Switch
                  id="autoApproveUsers"
                  checked={autoApproveUsers}
                  onCheckedChange={setAutoApproveUsers}
                  disabled={!allowSelfRegistration}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">
                  {t('language') === 'en'
                    ? 'Maximum Login Attempts'
                    : 'الحد الأقصى لمحاولات تسجيل الدخول'}
                </Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  min="1"
                  max="10"
                  value={maxLoginAttempts}
                  onChange={(e) =>
                    setMaxLoginAttempts(Number.parseInt(e.target.value))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {t('language') === 'en'
                    ? 'Number of failed login attempts before account is locked'
                    : 'عدد محاولات تسجيل الدخول الفاشلة قبل قفل الحساب'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>
                {t('language') === 'en'
                  ? 'Notification Settings'
                  : 'إعدادات الإشعارات'}
              </CardTitle>
              <CardDescription>
                {t('language') === 'en'
                  ? 'Configure system notifications and alerts'
                  : 'تكوين إشعارات وتنبيهات النظام'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifyNewApplications" className="block mb-1">
                    {t('language') === 'en'
                      ? 'New Application Notifications'
                      : 'إشعارات الطلبات الجديدة'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Notify administrators when new applications are submitted'
                      : 'إشعار المسؤولين عند تقديم طلبات جديدة'}
                  </p>
                </div>
                <Switch id="notifyNewApplications" defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="notifyApplicationStatus"
                    className="block mb-1"
                  >
                    {t('language') === 'en'
                      ? 'Application Status Notifications'
                      : 'إشعارات حالة الطلب'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Notify users when their application status changes'
                      : 'إشعار المستخدمين عند تغيير حالة طلبهم'}
                  </p>
                </div>
                <Switch id="notifyApplicationStatus" defaultChecked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifySystemUpdates" className="block mb-1">
                    {t('language') === 'en'
                      ? 'System Update Notifications'
                      : 'إشعارات تحديثات النظام'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Notify all users about system updates and maintenance'
                      : 'إشعار جميع المستخدمين بتحديثات النظام والصيانة'}
                  </p>
                </div>
                <Switch id="notifySystemUpdates" defaultChecked={true} />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettings}
                className="bg-gradient-green hover:opacity-90 w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                {t('language') === 'en'
                  ? 'Save Notification Settings'
                  : 'حفظ إعدادات الإشعارات'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

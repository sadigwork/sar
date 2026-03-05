'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/components/auth-provider';
import { Building2, Award, AlertCircle, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NotificationBadge } from '@/components/notification-badge';

export function UserNav() {
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [hasValidRegistration, setHasValidRegistration] =
    useState<boolean>(true);
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0);

  // Check if user is registered engineer
  useEffect(() => {
    if (user) {
      // In a real app, this would be an API call to check registration status
      // For demo, assume user is registered if they have a role of "user"
      const isRegistered = user.role === 'user';
      setHasValidRegistration(isRegistered);

      // Mock years of experience calculation
      // In a real app, this would come from the user's profile data
      if (isRegistered) {
        setYearsOfExperience(8); // Mock value for demonstration
      }
    }
  }, [user]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleFellowshipClick = () => {
    if (yearsOfExperience < 5) {
      toast({
        title: language === 'en' ? 'Not Eligible' : 'غير مؤهل',
        description:
          language === 'en'
            ? 'You need at least 5 years of experience to apply for fellowships'
            : 'تحتاج إلى 5 سنوات من الخبرة على الأقل للتقدم للزمالات',
        variant: 'destructive',
      });
    } else {
      router.push('/fellowship/apply');
    }
  };

  const handleInstitutionClick = () => {
    if (!hasValidRegistration) {
      toast({
        title: language === 'en' ? 'Registration Required' : 'التسجيل مطلوب',
        description:
          language === 'en'
            ? 'You must be a registered engineer to register an institution'
            : 'يجب أن تكون مهندسًا مسجلاً لتسجيل مؤسسة',
        variant: 'destructive',
      });
    } else {
      router.push('/institution/register');
    }
  };

  const getRoleText = () => {
    if (language === 'en') {
      if (user.role === 'admin') return 'Administrator';
      if (user.role === 'reviewer') return 'Reviewer';
      if (user.role === 'registrar') return 'Registrar';
      if (user.role === 'institution') return 'Institution';
      return 'Engineer';
    } else {
      if (user.role === 'admin') return 'مدير';
      if (user.role === 'reviewer') return 'مراجع';
      if (user.role === 'registrar') return 'مسجل';
      if (user.role === 'institution') return 'مؤسسة';
      return 'مهندس';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getDashboardLink = () => {
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'reviewer') return '/reviewer/dashboard';
    if (user.role === 'registrar') return '/registrar/dashboard';
    if (user.role === 'institution') return '/institution/dashboard';
    return '/dashboard';
  };

  return (
    <div className="flex items-center gap-4">
      <NotificationBadge />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.avatar || '/placeholder.svg?height=32&width=32'}
                alt={user.name}
              />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              <p className="text-xs text-muted-foreground">{getRoleText()}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push(getDashboardLink())}>
              {t('dashboard')}
            </DropdownMenuItem>

            {user.role === 'admin' ? (
              <>
                <DropdownMenuItem onClick={() => router.push('/admin/users')}>
                  {language === 'en' ? 'Users' : 'المستخدمين'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push('/admin/certifications/professional')
                  }
                >
                  {t('certification')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/admin/fellowships')}
                >
                  {language === 'en' ? 'Fellowships' : 'الزمالات'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/admin/settings')}
                >
                  {language === 'en' ? 'Settings' : 'الإعدادات'}
                </DropdownMenuItem>
              </>
            ) : user.role === 'reviewer' ? (
              <>
                <DropdownMenuItem
                  onClick={() => router.push('/reviewer/applications')}
                >
                  {language === 'en' ? 'Applications' : 'الطلبات'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/reviewer/fellowship')}
                >
                  {language === 'en'
                    ? 'Fellowship Applications'
                    : 'طلبات الزمالة'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/reviewer/documents')}
                >
                  {language === 'en' ? 'Documents' : 'المستندات'}
                </DropdownMenuItem>
              </>
            ) : user.role === 'registrar' ? (
              <>
                <DropdownMenuItem
                  onClick={() => router.push('/registrar/applications')}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  {language === 'en'
                    ? 'Registration Applications'
                    : 'طلبات التسجيل'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/registrar/renewals')}
                >
                  {language === 'en' ? 'Renewal Requests' : 'طلبات التجديد'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/registrar/reports')}
                >
                  {language === 'en' ? 'Reports' : 'التقارير'}
                </DropdownMenuItem>
              </>
            ) : user.role === 'institution' ? (
              <>
                <DropdownMenuItem
                  onClick={() => router.push('/institution/dashboard')}
                >
                  {language === 'en'
                    ? 'Institution Dashboard'
                    : 'لوحة تحكم المؤسسة'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/institution/programs')}
                >
                  {language === 'en' ? 'Programs' : 'البرامج'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/institution/documents/upload')}
                >
                  {language === 'en' ? 'Upload Documents' : 'تحميل المستندات'}
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  {t('profile')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push('/qualifications')}
                >
                  {t('qualifications')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/certification')}>
                  {t('certification')}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          {user.role !== 'institution' && user.role !== 'registrar' && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleFellowshipClick}>
                  <Award className="mr-2 h-4 w-4" />
                  {language === 'en'
                    ? 'Apply for Fellowship'
                    : 'التقدم للزمالة'}
                  {yearsOfExperience < 5 && (
                    <AlertCircle className="ml-auto h-4 w-4 text-yellow-500" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleInstitutionClick}>
                  <Building2 className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Register Institution' : 'تسجيل مؤسسة'}
                  {!hasValidRegistration && (
                    <AlertCircle className="ml-auto h-4 w-4 text-yellow-500" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem onClick={handleLogout}>
            {t('logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

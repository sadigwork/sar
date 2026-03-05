'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/components/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoonIcon, SunIcon, GlobeIcon, ChevronDown } from 'lucide-react';

export function Header() {
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            href="/"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <span className="hidden font-bold sm:inline-block">
              {language === 'en'
                ? 'Agricultural Engineers Registration'
                : 'تسجيل المهندسين الزراعيين'}
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {t('home')}
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/about') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {t('about')}
            </Link>
            <Link
              href="/directory/institutions"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/directory/institutions')
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {language === 'en' ? 'Institutions' : 'المؤسسات'}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="h-auto p-0">
                  <span className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
                    {language === 'en' ? 'Services' : 'الخدمات'}
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/institution/register">
                    {language === 'en' ? 'Register Institution' : 'تسجيل مؤسسة'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/fellowship/apply">
                    {language === 'en'
                      ? 'Apply for Fellowship'
                      : 'التقدم للزمالة'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/certification">{t('certification')}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/contact')
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {t('contact')}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <GlobeIcon className="h-5 w-5" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => document.body.classList.remove('dark')}
              >
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => document.body.classList.add('dark')}
              >
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => document.body.classList.toggle('dark')}
              >
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {user ? (
            <UserNav />
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">{t('login')}</Link>
              </Button>
              <Button asChild>
                <Link href="/register">{t('register')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

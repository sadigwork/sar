'use client';

import { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/components/auth-provider';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await login(values.email, values.password);

      toast({
        title:
          t('language') === 'en' ? 'Login successful' : 'تم تسجيل الدخول بنجاح',
        description:
          t('language') === 'en'
            ? 'You are now logged in'
            : 'أنت الآن مسجل الدخول',
      });
    } catch (error) {
      toast({
        title: t('language') === 'en' ? 'Login failed' : 'فشل تسجيل الدخول',
        description:
          t('language') === 'en'
            ? 'Please check your credentials'
            : 'يرجى التحقق من بيانات الاعتماد الخاصة بك',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('login')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('language') === 'en'
              ? 'Enter your email and password to login'
              : 'أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول'}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-green hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading
                ? t('language') === 'en'
                  ? 'Logging in...'
                  : 'جاري تسجيل الدخول...'
                : t('login')}
            </Button>
          </form>
        </Form>
        <div className="px-8 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            {t('language') === 'en'
              ? "Don't have an account?"
              : 'ليس لديك حساب؟'}{' '}
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t('register')}
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            {t('language') === 'en' ? 'Demo accounts:' : 'حسابات تجريبية:'}
            <br />
            {t('language') === 'en'
              ? 'User: user@example.com'
              : 'مستخدم: user@example.com'}
            <br />
            {t('language') === 'en'
              ? 'Reviewer: reviewer@example.com'
              : 'مراجع: reviewer@example.com'}
            <br />
            {t('language') === 'en'
              ? 'Admin: admin@example.com'
              : 'مدير: admin@example.com'}
            <br />
            {t('language') === 'en'
              ? 'Password: password123'
              : 'كلمة المرور: password123'}
          </p>
        </div>
      </div>
    </div>
  );
}

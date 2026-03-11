'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { AuthApi } from '../api/auth';
import { getApiErrorMessage } from '../../lib/api-error';

const formSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useAuth(); // لتحديث المستخدم بعد التسجيل
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // نرسل البيانات للـ API
      const response = await AuthApi.register({
        firstName: values.name.split(' ')[0],
        lastName: values.name.split(' ').slice(1).join(' ') || '-',
        email: values.email,
        password: values.password,
        role: 'User',
      });

      console.log('REGISTER RESPONSE:', response);

      const result = response.data;

      if (!result?.user || !result?.tokens) {
        throw new Error('Invalid registration response');
      }
      // نحفظ الـ token وبيانات المستخدم
      localStorage.setItem('accessToken', result.tokens.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));

      setUser(result.user); // تحديث الـ context
      // await login(values.email, values.password); // تسجيل الدخول بعد التسجيل

      toast({
        title:
          t('language') === 'en'
            ? 'Registration successful'
            : 'تم التسجيل بنجاح',
        description:
          t('language') === 'en'
            ? 'You are now logged in'
            : 'تم تسجيل الدخول بنجاح',
      });

      // توجيه تلقائي بناءً على الدور
      if (result.user.role === 'Admin') {
        router.push('/admin/dashboard');
      } else if (result.user.role === 'Reviewer') {
        router.push('/reviewer/dashboard');
      } else if (result.user.role === 'Registrar') {
        router.push('/registrar/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: t('language') === 'en' ? 'Registration failed' : 'فشل التسجيل',
        description: getApiErrorMessage(error),
        // (t('language') === 'en'
        //   ? 'Please try again later'
        //   : 'يرجى المحاولة مرة أخرى لاحقًا'),
        variant: 'destructive',
      });
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('register')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('language') === 'en'
              ? 'Create an account to get started'
              : 'أنشئ حسابًا للبدء'}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        t('language') === 'en' ? 'John Doe' : 'محمد أحمد'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        t('language') === 'en'
                          ? '+1 234 567 8900'
                          : '٠١٢٣٤٥٦٧٨٩'
                      }
                      {...field}
                    />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('confirmPassword')}</FormLabel>
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
                  ? 'Registering...'
                  : 'جاري التسجيل...'
                : t('register')}
            </Button>
          </form>
        </Form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          {t('language') === 'en'
            ? 'Already have an account?'
            : 'لديك حساب بالفعل؟'}{' '}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
}

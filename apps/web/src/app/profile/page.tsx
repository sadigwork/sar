'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/language-provider';

const formSchema = z.object({
  fullNameAr: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  bio: z.string().optional(),
});

export default function ProfilePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { profile, isLoading } = useProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullNameAr: '',
      email: '',
      phone: '',
      address: '',
      bio: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        fullNameAr: profile.fullNameAr,
        email: profile.user.email,
        phone: profile.phone,
        address: profile.address,
        bio: profile.bio,
      });
    }
  }, [profile, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await fetch('/api/profiles/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      toast({
        title:
          t('language') === 'en' ? 'Profile updated' : 'تم تحديث الملف الشخصي',
        description:
          t('language') === 'en'
            ? 'Your profile has been updated'
            : 'تم تحديث ملفك الشخصي بنجاح',
      });
    } catch (error) {
      toast({
        title: t('language') === 'en' ? 'Update failed' : 'فشل التحديث',
        description:
          t('language') === 'en'
            ? 'Please try again later'
            : 'يرجى المحاولة لاحقًا',
        variant: 'destructive',
      });
    }
  }

  if (isLoading)
    return <p>{t('language') === 'en' ? 'Loading...' : 'جاري التحميل...'}</p>;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">{t('profile')}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullNameAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('name')}</FormLabel>
                <FormControl>
                  <input {...field} />
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
                  <input {...field} disabled />
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
                  <input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('address')}</FormLabel>
                <FormControl>
                  <input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('language') === 'en' ? 'Bio' : 'نبذة شخصية'}
                </FormLabel>
                <FormControl>
                  <textarea {...field}></textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{t('save')}</Button>
        </form>
      </Form>
    </div>
  );
}

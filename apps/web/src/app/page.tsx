'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  GraduationCap,
  Building2,
  Award,
  FileCheck,
  Users,
  BookOpen,
} from 'lucide-react';

export default function Home() {
  const { t, direction } = useLanguage();

  return (
    <div className={`flex flex-col min-h-[calc(100vh-8rem)]`}>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                {t('welcome')}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {t('welcomeDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-green hover:opacity-90 w-full sm:w-auto"
                  >
                    {t('getStarted')}
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {t('learnMore')}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Agricultural Engineers"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t('language') === 'en' ? 'Our Services' : 'خدماتنا'}
            </h2>
            <p className="mt-4 text-muted-foreground md:text-xl">
              {t('language') === 'en'
                ? 'Comprehensive services for agricultural engineers and institutions'
                : 'خدمات شاملة للمهندسين الزراعيين والمؤسسات'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t('personalInfo')}</h3>
                <p className="text-muted-foreground">
                  {t('language') === 'en'
                    ? 'Register and manage your personal information securely'
                    : 'سجل وأدر معلوماتك الشخصية بأمان'}
                </p>
                <Link
                  href="/register"
                  className="text-primary hover:underline flex items-center"
                >
                  {t('language') === 'en' ? 'Register Now' : 'سجل الآن'}{' '}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t('qualifications')}</h3>
                <p className="text-muted-foreground">
                  {t('language') === 'en'
                    ? 'Add your academic degrees, training courses, and work experience'
                    : 'أضف درجاتك العلمية ودوراتك التدريبية وخبرتك العملية'}
                </p>
                <Link
                  href="/qualifications"
                  className="text-primary hover:underline flex items-center"
                >
                  {t('language') === 'en' ? 'Learn More' : 'اعرف المزيد'}{' '}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <FileCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t('certification')}</h3>
                <p className="text-muted-foreground">
                  {t('language') === 'en'
                    ? 'Apply for professional certification based on your qualifications'
                    : 'تقدم بطلب للحصول على شهادة مهنية بناءً على مؤهلاتك'}
                </p>
                <Link
                  href="/certification"
                  className="text-primary hover:underline flex items-center"
                >
                  {t('language') === 'en' ? 'Apply Now' : 'تقدم الآن'}{' '}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Institutions Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="hidden lg:block">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Institutions"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                {t('language') === 'en' ? 'For Institutions' : 'للمؤسسات'}
              </h2>
              <p className="text-muted-foreground md:text-lg">
                {t('language') === 'en'
                  ? 'Educational institutions and agricultural companies can register to verify their engineers and participate in our certification programs.'
                  : 'يمكن للمؤسسات التعليمية والشركات الزراعية التسجيل للتحقق من مهندسيها والمشاركة في برامج الشهادات لدينا.'}
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Building2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">
                      {t('language') === 'en'
                        ? 'Institution Registration'
                        : 'تسجيل المؤسسات'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t('language') === 'en'
                        ? 'Register your educational institution or agricultural company'
                        : 'سجل مؤسستك التعليمية أو شركتك الزراعية'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">
                      {t('language') === 'en'
                        ? 'Engineer Verification'
                        : 'التحقق من المهندسين'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t('language') === 'en'
                        ? 'Verify the qualifications and experience of your engineers'
                        : 'تحقق من مؤهلات وخبرات مهندسيك'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">
                      {t('language') === 'en'
                        ? 'Training Programs'
                        : 'برامج التدريب'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t('language') === 'en'
                        ? 'Offer accredited training programs for agricultural engineers'
                        : 'قدم برامج تدريبية معتمدة للمهندسين الزراعيين'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/institution/register">
                  <Button className="bg-gradient-green hover:opacity-90">
                    {t('language') === 'en'
                      ? 'Register Your Institution'
                      : 'سجل مؤسستك'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              {t('language') === 'en' ? 'Our Impact' : 'تأثيرنا'}
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              {t('language') === 'en'
                ? 'Growing network of certified agricultural engineers and institutions'
                : 'شبكة متنامية من المهندسين الزراعيين والمؤسسات المعتمدة'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">5,000+</p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('language') === 'en' ? 'Registered Engineers' : 'مهندس مسجل'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">200+</p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('language') === 'en'
                  ? 'Registered Institutions'
                  : 'مؤسسة مسجلة'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">3,500+</p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('language') === 'en' ? 'Certified Engineers' : 'مهندس معتمد'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('language') === 'en' ? 'Training Programs' : 'برنامج تدريبي'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/20 to-primary/5">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t('language') === 'en'
              ? 'Ready to Get Started?'
              : 'هل أنت مستعد للبدء؟'}
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl max-w-[700px] mx-auto">
            {t('language') === 'en'
              ? 'Join our growing community of agricultural engineers and institutions today.'
              : 'انضم إلى مجتمعنا المتنامي من المهندسين الزراعيين والمؤسسات اليوم.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-green hover:opacity-90 w-full sm:w-auto"
              >
                {t('language') === 'en' ? 'Register as Engineer' : 'سجل كمهندس'}
              </Button>
            </Link>
            <Link href="/institution/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                {t('language') === 'en'
                  ? 'Register as Institution'
                  : 'سجل كمؤسسة'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

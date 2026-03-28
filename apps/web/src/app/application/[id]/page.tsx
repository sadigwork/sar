'use client';

import { useEffect, useState, use } from 'react'; // أضف use هنا
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/components/auth-provider';
import { useApplication } from '@/hooks/use-application';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  ChevronLeft,
  Download,
  Upload,
  Calendar,
  User,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUpload } from '@/components/file-upload';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api'; // تأكد من import api الصحيح

// Mock data for application details
const mockApplications = [
  {
    id: 'app1',
    type: 'certification',
    level: 'Intermediate',
    specialization: 'Agricultural Engineering',
    submissionDate: '2023-11-15T10:30:00Z',
    status: 'pending',
    statusText: 'Under Review',
    progress: 50,
    currentStage: 'Technical Review',
    nextStep: 'Committee Evaluation',
    reviewer: 'Ahmed Mohammed',
    reviewerEmail: 'ahmed.m@example.com',
    estimatedCompletion: '2023-12-15T10:30:00Z',
    lastUpdated: '2023-11-20T14:45:00Z',
    notes:
      'Your application is currently being reviewed by our technical committee.',
    missingDocuments: [],
    timeline: [
      {
        date: '2023-11-15T10:30:00Z',
        status: 'submitted',
        title: 'Application Submitted',
        description: 'Your application has been successfully submitted.',
      },
      {
        date: '2023-11-16T09:15:00Z',
        status: 'in_progress',
        title: 'Initial Review',
        description: 'Your application has passed the initial review.',
      },
      {
        date: '2023-11-20T14:45:00Z',
        status: 'in_progress',
        title: 'Technical Review',
        description: 'Your application is now under technical review.',
      },
    ],
    documents: [
      {
        id: 'doc1',
        name: 'Academic Certificate',
        type: 'pdf',
        status: 'verified',
        uploadDate: '2023-11-15T10:30:00Z',
        verificationDate: '2023-11-16T09:15:00Z',
      },
      {
        id: 'doc2',
        name: 'Professional Experience',
        type: 'pdf',
        status: 'pending',
        uploadDate: '2023-11-15T10:30:00Z',
        verificationDate: null,
      },
      {
        id: 'doc3',
        name: 'ID Document',
        type: 'pdf',
        status: 'verified',
        uploadDate: '2023-11-15T10:30:00Z',
        verificationDate: '2023-11-16T09:15:00Z',
      },
    ],
    messages: [
      {
        id: 'msg1',
        date: '2023-11-16T09:15:00Z',
        from: 'system',
        content: 'Your application has been received and is now under review.',
      },
      {
        id: 'msg2',
        date: '2023-11-18T11:30:00Z',
        from: 'reviewer',
        content:
          'Thank you for your application. We are currently reviewing your professional experience documentation. The process is going smoothly so far.',
      },
    ],
  },
  {
    id: 'app2',
    type: 'renewal',
    level: 'Advanced',
    specialization: 'Agricultural Engineering',
    submissionDate: '2023-10-05T09:15:00Z',
    status: 'action_required',
    statusText: 'Action Required',
    progress: 30,
    currentStage: 'Document Verification',
    nextStep: 'Technical Review',
    reviewer: 'Sarah Johnson',
    reviewerEmail: 'sarah.j@example.com',
    estimatedCompletion: null,
    lastUpdated: '2023-10-25T11:20:00Z',
    notes:
      'Please provide the missing documents to proceed with your application.',
    missingDocuments: [
      'Experience certificate',
      'Professional development proof',
    ],
    timeline: [
      {
        date: '2023-10-05T09:15:00Z',
        status: 'submitted',
        title: 'Application Submitted',
        description:
          'Your renewal application has been successfully submitted.',
      },
      {
        date: '2023-10-15T14:30:00Z',
        status: 'in_progress',
        title: 'Initial Review',
        description: 'Your application has passed the initial review.',
      },
      {
        date: '2023-10-25T11:20:00Z',
        status: 'action_required',
        title: 'Document Verification',
        description:
          'Additional documents are required to proceed with your application.',
      },
    ],
    documents: [
      {
        id: 'doc1',
        name: 'Previous Certificate',
        type: 'pdf',
        status: 'verified',
        uploadDate: '2023-10-05T09:15:00Z',
        verificationDate: '2023-10-15T14:30:00Z',
      },
      {
        id: 'doc2',
        name: 'Professional Development',
        type: 'pdf',
        status: 'rejected',
        uploadDate: '2023-10-05T09:15:00Z',
        verificationDate: '2023-10-25T11:20:00Z',
        rejectionReason:
          'The document is outdated. Please provide recent professional development activities.',
      },
    ],
    messages: [
      {
        id: 'msg1',
        date: '2023-10-05T09:15:00Z',
        from: 'system',
        content:
          'Your renewal application has been received and is now under review.',
      },
      {
        id: 'msg2',
        date: '2023-10-25T11:20:00Z',
        from: 'reviewer',
        content:
          'We need additional documentation for your professional development activities. Please upload certificates from courses or workshops completed in the last 2 years.',
      },
    ],
  },
];

// Helper function to get Arabic type name
function getArabicType(type) {
  switch (type) {
    case 'certification':
      return 'شهادة';
    case 'renewal':
      return 'تجديد';
    case 'upgrade':
      return 'ترقية';
    default:
      return type;
  }
}

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [messageText, setMessageText] = useState('');
  // استخدام الـ hook الجديد
  const { application, isLoading, isError, refetch } = useApplication(id);

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // عرض خطأ إذا فشل جلب البيانات
  useEffect(() => {
    if (isError) {
      toast({
        title:
          t('language') === 'en'
            ? 'Application not found'
            : 'لم يتم العثور على الطلب',
        description:
          t('language') === 'en'
            ? "The application you're looking for doesn't exist or you don't have permission to view it."
            : 'الطلب الذي تبحث عنه غير موجود أو ليس لديك إذن لعرضه.',
        variant: 'destructive',
      });
      router.push('/dashboard');
    }
  }, [isError, router, toast, t]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(t('language') === 'en' ? 'en-US' : 'ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(t('language') === 'en' ? 'en-US' : 'ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const safeApp = {
    ...application,
    timeline: application?.timeline || [],
    documents: application?.documents || [],
    messages: application?.messages || [],
    missingDocuments: application?.missingDocuments || [],
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

  const getDocumentStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="mr-1 h-3 w-3" />{' '}
            {t('language') === 'en' ? 'Verified' : 'تم التحقق'}
          </Badge>
        );
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="mr-1 h-3 w-3" />{' '}
            {t('language') === 'en' ? 'Pending' : 'قيد الانتظار'}
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
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTimelineStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-4 w-4" />
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">
            <Clock className="h-4 w-4" />
          </div>
        );
      case 'action_required':
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
            <AlertCircle className="h-4 w-4" />
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-4 w-4" />
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
            <XCircle className="h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600">
            <FileText className="h-4 w-4" />
          </div>
        );
    }
  };

  const handleFileUpload = (file) => {
    toast({
      title: t('language') === 'en' ? 'File Uploaded' : 'تم رفع الملف',
      description:
        t('language') === 'en'
          ? `${file.name} has been uploaded successfully.`
          : `تم رفع ${file.name} بنجاح.`,
    });
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    // In a real app, send message to API
    toast({
      title: t('language') === 'en' ? 'Message Sent' : 'تم إرسال الرسالة',
      description:
        t('language') === 'en'
          ? 'Your message has been sent to the reviewer.'
          : 'تم إرسال رسالتك إلى المراجع.',
    });

    setMessageText('');
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-40" />
        </div>

        <Skeleton className="h-48 mb-6" />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="h-96" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {t('language') === 'en'
              ? 'Application not found'
              : 'لم يتم العثور على الطلب'}
          </AlertTitle>
          <AlertDescription>
            {t('language') === 'en'
              ? "The application you're looking for doesn't exist or you don't have permission to view it."
              : 'الطلب الذي تبحث عنه غير موجود أو ليس لديك إذن لعرضه.'}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => router.push('/dashboard')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('language') === 'en'
              ? 'Back to Dashboard'
              : 'العودة إلى لوحة التحكم'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="mr-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t('language') === 'en' ? 'Back' : 'رجوع'}
        </Button>
        <h1 className="text-2xl font-bold">
          {t('language') === 'en' ? 'Application Details' : 'تفاصيل الطلب'}
        </h1>
      </div>

      {/* Application Summary Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {t('language') === 'en'
                  ? application.type
                  : getArabicType(application.type)}{' '}
                - {application.level}
              </h2>
              <p className="text-muted-foreground">
                {application.specialization} |{' '}
                {t('language') === 'en' ? 'Submitted on' : 'تم التقديم في'}:{' '}
                {formatDate(application.submissionDate)}
              </p>
            </div>
            <div className="flex flex-col items-end">
              {getStatusBadge(application.status)}
              <p className="text-sm text-muted-foreground mt-1">
                {t('language') === 'en' ? 'Last updated' : 'آخر تحديث'}:{' '}
                {formatDate(application.lastUpdated)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">
                {t('language') === 'en' ? 'Progress' : 'التقدم'}
              </span>
              <span className="text-sm font-medium">
                {application.progress}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${application.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t('language') === 'en' ? 'Current Stage' : 'المرحلة الحالية'}
              </p>
              <p className="font-medium">{application.currentStage}</p>
            </div>
            {application.nextStep && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t('language') === 'en' ? 'Next Step' : 'الخطوة التالية'}
                </p>
                <p className="font-medium">{application.nextStep}</p>
              </div>
            )}
            {application.estimatedCompletion && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t('language') === 'en'
                    ? 'Estimated Completion'
                    : 'الإنجاز المتوقع'}
                </p>
                <p className="font-medium">
                  {formatDate(application.estimatedCompletion)}
                </p>
              </div>
            )}
          </div>

          {application.status === 'action_required' &&
            application.missingDocuments.length > 0 && (
              <Alert className="mt-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/30">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertTitle className="text-blue-800 dark:text-blue-300">
                  {t('language') === 'en' ? 'Action Required' : 'إجراء مطلوب'}
                </AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-400">
                  <p className="mb-2">
                    {t('language') === 'en'
                      ? 'Please provide the following documents to proceed with your application:'
                      : 'يرجى تقديم المستندات التالية للمتابعة مع طلبك:'}
                  </p>
                  <ul className="list-disc list-inside">
                    {application.missingDocuments.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="timeline">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="timeline">
                {t('language') === 'en' ? 'Timeline' : 'الجدول الزمني'}
              </TabsTrigger>
              <TabsTrigger value="documents">
                {t('language') === 'en' ? 'Documents' : 'المستندات'}
              </TabsTrigger>
              <TabsTrigger value="messages">
                {t('language') === 'en' ? 'Messages' : 'الرسائل'}
              </TabsTrigger>
            </TabsList>

            {/* Timeline Tab */}
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('language') === 'en'
                      ? 'Application Timeline'
                      : 'الجدول الزمني للطلب'}
                  </CardTitle>
                  <CardDescription>
                    {t('language') === 'en'
                      ? 'Track the progress of your application'
                      : 'تتبع تقدم طلبك'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

                    {/* Timeline events */}
                    <div className="space-y-8">
                      {safeApp.timeline.map((event, index) => (
                        <div key={index} className="relative flex gap-4">
                          {getTimelineStatusIcon(event.status)}
                          <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{event.title}</h4>
                              <time className="text-sm text-muted-foreground">
                                {formatDate(event.date)}
                              </time>
                            </div>
                            <p className="text-muted-foreground mt-1">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Future steps if available */}
                      {application.nextStep && (
                        <div className="relative flex gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-muted-foreground">
                                {application.nextStep}
                              </h4>
                              <time className="text-sm text-muted-foreground">
                                {t('language') === 'en' ? 'Upcoming' : 'قادم'}
                              </time>
                            </div>
                            <p className="text-muted-foreground mt-1">
                              {t('language') === 'en'
                                ? 'This step will begin once the current stage is complete.'
                                : 'ستبدأ هذه الخطوة بمجرد اكتمال المرحلة الحالية.'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('language') === 'en'
                      ? 'Application Documents'
                      : 'مستندات الطلب'}
                  </CardTitle>
                  <CardDescription>
                    {t('language') === 'en'
                      ? 'View and manage your submitted documents'
                      : 'عرض وإدارة المستندات المقدمة'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {safeApp.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-start justify-between border-b pb-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-muted rounded-md p-2">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{doc.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('language') === 'en'
                                ? 'Uploaded on'
                                : 'تم الرفع في'}
                              : {formatDate(doc.uploadDate)}
                            </p>
                            {doc.status === 'rejected' &&
                              doc.rejectionReason && (
                                <p className="text-sm text-red-600 mt-1">
                                  {t('language') === 'en' ? 'Reason' : 'السبب'}:{' '}
                                  {doc.rejectionReason}
                                </p>
                              )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getDocumentStatusBadge(doc.status)}
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            {t('language') === 'en' ? 'Download' : 'تحميل'}
                          </Button>
                          {doc.status === 'rejected' && (
                            <Button size="sm">
                              <Upload className="mr-2 h-4 w-4" />
                              {t('language') === 'en'
                                ? 'Re-upload'
                                : 'إعادة الرفع'}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Upload new document section */}
                    {application.status === 'action_required' &&
                      application.missingDocuments.length > 0 && (
                        <div className="mt-6 pt-4 border-t">
                          <h4 className="font-medium mb-4">
                            {t('language') === 'en'
                              ? 'Upload Required Documents'
                              : 'رفع المستندات المطلوبة'}
                          </h4>
                          <FileUpload
                            onFileUpload={handleFileUpload}
                            acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                            maxFileSize={10}
                            label={
                              t('language') === 'en'
                                ? 'Drag and drop files here or click to browse'
                                : 'اسحب وأفلت الملفات هنا أو انقر للتصفح'
                            }
                          />
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('language') === 'en' ? 'Messages' : 'الرسائل'}
                  </CardTitle>
                  <CardDescription>
                    {t('language') === 'en'
                      ? 'Communication regarding your application'
                      : 'التواصل بخصوص طلبك'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 mb-6">
                    {safeApp.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-4 ${message.from === 'reviewer' ? 'justify-start' : 'justify-end'}`}
                      >
                        {message.from === 'reviewer' && (
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.from === 'reviewer'
                              ? 'bg-muted'
                              : message.from === 'system'
                                ? 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                                : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">
                              {message.from === 'reviewer'
                                ? t('language') === 'en'
                                  ? 'Reviewer'
                                  : 'المراجع'
                                : message.from === 'system'
                                  ? t('language') === 'en'
                                    ? 'System'
                                    : 'النظام'
                                  : t('language') === 'en'
                                    ? 'You'
                                    : 'أنت'}
                            </span>
                            <span className="text-xs opacity-70 ml-2">
                              {formatDateTime(message.date)}
                            </span>
                          </div>
                          <p
                            className={`text-sm ${message.from === 'system' ? 'text-blue-700 dark:text-blue-400' : ''}`}
                          >
                            {message.content}
                          </p>
                        </div>
                        {message.from !== 'reviewer' &&
                          message.from !== 'system' && (
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
                              <User className="h-5 w-5" />
                            </div>
                          )}
                      </div>
                    ))}
                  </div>

                  {/* Message input */}
                  <div className="flex gap-2 mt-4">
                    <textarea
                      className="flex-1 min-h-[80px] p-3 rounded-md border border-input bg-background"
                      placeholder={
                        t('language') === 'en'
                          ? 'Type your message here...'
                          : 'اكتب رسالتك هنا...'
                      }
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <Button
                      className="self-end"
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      {t('language') === 'en' ? 'Send' : 'إرسال'}
                      {t('language') === 'en' ? (
                        <ArrowRight className="ml-2 h-4 w-4" />
                      ) : (
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {t('language') === 'en'
                  ? 'Application Details'
                  : 'تفاصيل الطلب'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {t('language') === 'en' ? 'Application ID' : 'رقم الطلب'}
                  </dt>
                  <dd className="font-medium">{application.id}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {t('language') === 'en' ? 'Type' : 'النوع'}
                  </dt>
                  <dd className="font-medium">
                    {t('language') === 'en'
                      ? application.type
                      : getArabicType(application.type)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {t('language') === 'en' ? 'Level' : 'المستوى'}
                  </dt>
                  <dd className="font-medium">{application.level}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {t('language') === 'en' ? 'Specialization' : 'التخصص'}
                  </dt>
                  <dd className="font-medium">{application.specialization}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Submission Date'
                      : 'تاريخ التقديم'}
                  </dt>
                  <dd className="font-medium">
                    {formatDate(application.submissionDate)}
                  </dd>
                </div>
                <Separator />
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {t('language') === 'en' ? 'Reviewer' : 'المراجع'}
                  </dt>
                  <dd className="font-medium">{application.reviewer}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    {t('language') === 'en'
                      ? 'Reviewer Email'
                      : 'البريد الإلكتروني للمراجع'}
                  </dt>
                  <dd className="font-medium">{application.reviewerEmail}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t('language') === 'en' ? 'Need Help?' : 'بحاجة إلى مساعدة؟'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('language') === 'en'
                  ? 'If you have any questions or need assistance with your application, please contact our support team.'
                  : 'إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة بخصوص طلبك، يرجى الاتصال بفريق الدعم.'}
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t('language') === 'en'
                    ? 'Contact Support'
                    : 'الاتصال بالدعم'}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  {t('language') === 'en' ? 'View FAQs' : 'عرض الأسئلة الشائعة'}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  {t('language') === 'en' ? 'Schedule a Call' : 'جدولة مكالمة'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

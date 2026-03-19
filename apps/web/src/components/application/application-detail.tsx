'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import axios from 'axios';

type Reviewer = {
  id: string;
  name: string;
  role: string;
};

type DocumentItem = {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  url?: string;
};

type ApplicationDetail = {
  id: string;
  type: 'certification' | 'renewal' | 'upgrade';
  level: string;
  status: 'pending' | 'approved' | 'rejected' | 'action_required';
  createdAt: string;
  updatedAt: string;
  nextStep?: string;
  reviewers: Reviewer[];
  documents: DocumentItem[];
  notes?: string;
};

export default function ApplicationDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { id } = useParams(); // application ID from route
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch application from API
    async function fetchApplication() {
      try {
        const res = await axios.get(`/api/applications/${id}`);
        setApplication(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchApplication();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {t('language') === 'en' ? 'Under Review' : 'قيد المراجعة'}
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 flex items-center">
            <CheckCircle className="mr-1 h-3 w-3" />
            {t('language') === 'en' ? 'Approved' : 'تمت الموافقة'}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 flex items-center">
            <XCircle className="mr-1 h-3 w-3" />
            {t('language') === 'en' ? 'Rejected' : 'مرفوض'}
          </Badge>
        );
      case 'action_required':
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 flex items-center">
            <AlertCircle className="mr-1 h-3 w-3" />
            {t('language') === 'en' ? 'Action Required' : 'إجراء مطلوب'}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleFileUpload = async (docId: string, file: File) => {
    setUploadingDocId(docId);
    try {
      const formData = new FormData();
      formData.append('file', file);

      await axios.post(`/api/applications/${id}/documents/${docId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Refresh application data after upload
      const res = await axios.get(`/api/applications/${id}`);
      setApplication(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setUploadingDocId(null);
    }
  };

  if (loading || !application) {
    return (
      <p className="container py-10">
        {t('language') === 'en' ? 'Loading...' : 'جاري التحميل...'}
      </p>
    );
  }

  return (
    <div className="container py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {t('language') === 'en' ? 'Application Details' : 'تفاصيل الطلب'}
        </h1>
        <Button onClick={() => router.back()}>
          {t('language') === 'en' ? 'Back' : 'عودة'}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {application.type.toUpperCase()} - {application.level}
          </CardTitle>
          {getStatusBadge(application.status)}
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            {t('language') === 'en' ? 'Submitted on' : 'تم التقديم في'}:{' '}
            {new Date(application.createdAt).toLocaleString()}
          </p>
          {application.nextStep && (
            <p className="text-blue-700">
              {t('language') === 'en' ? 'Next Step' : 'الخطوة التالية'}:{' '}
              {application.nextStep}
            </p>
          )}
          {application.notes && (
            <p>
              {t('language') === 'en' ? 'Notes' : 'ملاحظات'}:{' '}
              {application.notes}
            </p>
          )}

          <div className="mt-4">
            <h3 className="font-semibold mb-2">
              {t('language') === 'en' ? 'Reviewers' : 'المراجعون'}
            </h3>
            <ul className="list-disc list-inside">
              {application.reviewers.map((r) => (
                <li key={r.id}>
                  {r.name} ({r.role})
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">
              {t('language') === 'en' ? 'Documents' : 'المستندات'}
            </h3>
            <ul className="space-y-2">
              {application.documents.map((doc) => (
                <li key={doc.id} className="flex justify-between items-center">
                  <span
                    className={
                      doc.status === 'approved'
                        ? 'text-green-600'
                        : doc.status === 'rejected'
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }
                  >
                    {doc.name} - {doc.status}
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline ml-1"
                      >
                        🔗
                      </a>
                    )}
                  </span>
                  {doc.status === 'pending' && (
                    <input
                      type="file"
                      disabled={uploadingDocId === doc.id}
                      onChange={(e) =>
                        e.target.files &&
                        handleFileUpload(doc.id, e.target.files[0])
                      }
                      className="ml-2"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => router.back()}>
            {t('language') === 'en' ? 'Back' : 'عودة'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

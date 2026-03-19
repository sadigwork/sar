'use client';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  GraduationCap,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useLanguage } from '@/components/language-provider';

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

export type ApplicationCardProps = {
  id: string;
  type: 'certification' | 'renewal' | 'upgrade';
  level: string;
  status: 'pending' | 'approved' | 'rejected' | 'action_required';
  createdAt: string;
  nextStep?: string;
  reviewers?: Reviewer[];
  documents?: DocumentItem[];
};

export default function ApplicationCard({
  id,
  type,
  level,
  status,
  createdAt,
  nextStep,
  reviewers = [],
  documents = [],
}: ApplicationCardProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, t('language') === 'en' ? 'PPP' : 'dd/MM/yyyy');
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            {t('language') === 'en' ? 'Under Review' : 'قيد المراجعة'}
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            {t('language') === 'en' ? 'Approved' : 'تمت الموافقة'}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            {t('language') === 'en' ? 'Rejected' : 'مرفوض'}
          </Badge>
        );
      case 'action_required':
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            {t('language') === 'en' ? 'Action Required' : 'إجراء مطلوب'}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'certification':
        return <Award className="h-5 w-5 text-primary mr-1" />;
      case 'renewal':
        return <FileText className="h-5 w-5 text-primary mr-1" />;
      case 'upgrade':
        return <GraduationCap className="h-5 w-5 text-primary mr-1" />;
      default:
        return <FileText className="h-5 w-5 text-primary mr-1" />;
    }
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => router.push(`/application/${id}`)}
    >
      <CardHeader className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          {getTypeIcon()}
          <CardTitle className="text-base font-semibold">
            {t('language') === 'en'
              ? type.charAt(0).toUpperCase() + type.slice(1)
              : type === 'certification'
                ? 'شهادة'
                : type === 'renewal'
                  ? 'تجديد'
                  : 'ترقية'}{' '}
            - {level}
          </CardTitle>
        </div>
        <div>{getStatusBadge()}</div>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {t('language') === 'en' ? 'Submitted on' : 'تم التقديم في'}:{' '}
          {formatDate(createdAt)}
        </p>

        {nextStep && (
          <p className="text-sm text-blue-700">
            {t('language') === 'en' ? 'Next Step' : 'الخطوة التالية'}:{' '}
            {nextStep}
          </p>
        )}

        {reviewers.length > 0 && (
          <div className="text-sm">
            <span className="font-semibold">
              {t('language') === 'en' ? 'Reviewers' : 'المراجعون'}:{' '}
            </span>
            {reviewers.map((r) => r.name).join(', ')}
          </div>
        )}

        {documents.length > 0 && (
          <div className="text-sm mt-1">
            <span className="font-semibold">
              {t('language') === 'en' ? 'Documents' : 'المستندات'}:{' '}
            </span>
            {documents.map((doc) => (
              <span
                key={doc.id}
                className={`ml-2 ${doc.status === 'approved' ? 'text-green-600' : doc.status === 'rejected' ? 'text-red-600' : 'text-gray-600'}`}
              >
                {doc.name}
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
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1"
        >
          <span>
            {t('language') === 'en' ? 'View Details' : 'عرض التفاصيل'}
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

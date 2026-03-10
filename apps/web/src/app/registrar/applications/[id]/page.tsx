"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  CircleXIcon as XCircle2,
  Pencil,
} from "lucide-react"

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [application, setApplication] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)

  // Sample data
  const sampleApplication = {
    id: params.id,
    name: language === "en" ? "Ahmed Mohamed" : "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+201234567890",
    specialization: language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية",
    level: language === "en" ? "Expert" : "خبير",
    status: "pending",
    submittedDate: "2023-11-15",
    avatar: "AM",
    nationalId: "1234567890",
    dateOfBirth: "1985-05-15",
    address: language === "en" ? "123 Main St, Cairo, Egypt" : "١٢٣ شارع رئيسي، القاهرة، مصر",
    education: [
      {
        id: "edu1",
        degree: language === "en" ? "Bachelor of Science" : "بكالوريوس علوم",
        institution: language === "en" ? "Cairo University" : "جامعة القاهرة",
        field: language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية",
        graduationYear: "2007",
        isVerified: true,
        verifiedBy: language === "en" ? "Dr. Khalid Al-Saud" : "د. خالد آل سعود",
        verificationDate: "2023-11-16",
      },
      {
        id: "edu2",
        degree: language === "en" ? "Master of Science" : "ماجستير علوم",
        institution: language === "en" ? "Alexandria University" : "جامعة الإسكندرية",
        field: language === "en" ? "Irrigation Systems" : "أنظمة الري",
        graduationYear: "2010",
        isVerified: false,
        verifiedBy: null,
        verificationDate: null,
      },
    ],
    experience: [
      {
        id: "exp1",
        title: language === "en" ? "Agricultural Engineer" : "مهندس زراعي",
        company: language === "en" ? "Ministry of Agriculture" : "وزارة الزراعة",
        startDate: "2010-06-01",
        endDate: "2015-12-31",
        isCurrent: false,
        description:
          language === "en" ? "Worked on irrigation systems and soil analysis" : "عملت على أنظمة الري وتحليل التربة",
        isVerified: true,
        verifiedBy: language === "en" ? "Dr. Nora Al-Rashid" : "د. نورا الرشيد",
        verificationDate: "2023-11-16",
      },
      {
        id: "exp2",
        title: language === "en" ? "Senior Agricultural Engineer" : "مهندس زراعي أول",
        company: language === "en" ? "Agricultural Development Company" : "شركة التنمية الزراعية",
        startDate: "2016-01-15",
        endDate: null,
        isCurrent: true,
        description:
          language === "en" ? "Leading agricultural projects and research" : "قيادة المشاريع والأبحاث الزراعية",
        isVerified: false,
        verifiedBy: null,
        verificationDate: null,
      },
    ],
    documents: [
      {
        id: "doc1",
        type: language === "en" ? "National ID" : "بطاقة الهوية الوطنية",
        name: language === "en" ? "National ID Card" : "بطاقة الهوية الوطنية",
        fileUrl: "/documents/national-id.pdf",
        isVerified: true,
        verifiedBy: language === "en" ? "Saad Al-Harbi" : "سعد الحربي",
        verificationDate: "2023-11-16",
      },
      {
        id: "doc2",
        type: language === "en" ? "Passport" : "جواز سفر",
        name: language === "en" ? "Passport Copy" : "نسخة جواز السفر",
        fileUrl: "/documents/passport.pdf",
        isVerified: false,
        verifiedBy: null,
        verificationDate: null,
      },
      {
        id: "doc3",
        type: language === "en" ? "CV" : "السيرة الذاتية",
        name: language === "en" ? "Curriculum Vitae" : "السيرة الذاتية",
        fileUrl: "/documents/cv.pdf",
        isVerified: true,
        verifiedBy: language === "en" ? "Layla Al-Otaibi" : "ليلى العتيبي",
        verificationDate: "2023-11-16",
      },
    ],
    verificationHistory: [
      {
        id: "vh1",
        action: "verify",
        entityType: "education",
        entityId: "edu1",
        user: language === "en" ? "Dr. Khalid Al-Saud" : "د. خالد آل سعود",
        date: "2023-11-16T10:30:00Z",
        notes: language === "en" ? "Verified with university records" : "تم التحقق من خلال سجلات الجامعة",
      },
      {
        id: "vh2",
        action: "verify",
        entityType: "experience",
        entityId: "exp1",
        user: language === "en" ? "Dr. Nora Al-Rashid" : "د. نورا الرشيد",
        date: "2023-11-16T11:15:00Z",
        notes: language === "en" ? "Confirmed with employer" : "تم التأكيد مع صاحب العمل",
      },
      {
        id: "vh3",
        action: "verify",
        entityType: "document",
        entityId: "doc1",
        user: language === "en" ? "Saad Al-Harbi" : "سعد الحربي",
        date: "2023-11-16T12:00:00Z",
        notes: language === "en" ? "Document appears authentic" : "المستند يبدو أصليًا",
      },
      {
        id: "vh4",
        action: "verify",
        entityType: "document",
        entityId: "doc3",
        user: language === "en" ? "Layla Al-Otaibi" : "ليلى العتيبي",
        date: "2023-11-16T13:30:00Z",
        notes:
          language === "en"
            ? "CV information matches other records"
            : "معلومات السيرة الذاتية تتطابق مع السجلات الأخرى",
      },
    ],
  }

  // Check if user is logged in and is a registrar
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "registrar") {
        router.push("/dashboard")
      } else {
        setApplication(sampleApplication)
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router, params.id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Clock className="mr-1 h-3 w-3" />
            {language === "en" ? "New" : "جديد"}
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="mr-1 h-3 w-3" />
            {language === "en" ? "Pending" : "قيد الانتظار"}
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="mr-1 h-3 w-3" />
            {language === "en" ? "Approved" : "تمت الموافقة"}
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            {language === "en" ? "Rejected" : "مرفوض"}
          </Badge>
        )
      default:
        return <Badge variant="outline">{language === "en" ? "Unknown" : "غير معروف"}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "en" ? "en-US" : "ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return ""
    const date = new Date(dateTimeString)
    return date.toLocaleString(language === "en" ? "en-US" : "ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleApprove = () => {
    // In a real application, this would call an API to update the application status
    setApplication({
      ...application,
      status: "approved",
    })
    setIsApproveDialogOpen(false)
  }

  const handleReject = () => {
    // In a real application, this would call an API to update the application status
    setApplication({
      ...application,
      status: "rejected",
      rejectionReason: rejectReason,
    })
    setIsRejectDialogOpen(false)
  }

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{language === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="container py-10">
        <Button variant="outline" onClick={() => router.push("/registrar/applications")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === "en" ? "Back to Applications" : "العودة إلى الطلبات"}
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {language === "en" ? "Application Not Found" : "لم يتم العثور على الطلب"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === "en"
                ? "The application you are looking for does not exist or has been removed."
                : "الطلب الذي تبحث عنه غير موجود أو تمت إزالته."}
            </p>
            <Button onClick={() => router.push("/registrar/applications")}>
              {language === "en" ? "View All Applications" : "عرض جميع الطلبات"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Button variant="outline" onClick={() => router.push("/registrar/applications")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {language === "en" ? "Back to Applications" : "العودة إلى الطلبات"}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={application.name} />
                  <AvatarFallback>{application.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{application.name}</CardTitle>
                  <CardDescription>
                    {application.email} • {application.phone}
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(application.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {language === "en" ? "Application ID" : "رقم الطلب"}
                </p>
                <p>{application.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {language === "en" ? "Submission Date" : "تاريخ التقديم"}
                </p>
                <p>{formatDate(application.submittedDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {language === "en" ? "Specialization" : "التخصص"}
                </p>
                <p>{application.specialization}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {language === "en" ? "Certification Level" : "مستوى الشهادة"}
                </p>
                <p>{application.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{language === "en" ? "Actions" : "الإجراءات"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {application.status !== "approved" && (
              <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {language === "en" ? "Approve Application" : "الموافقة على الطلب"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{language === "en" ? "Approve Application" : "الموافقة على الطلب"}</DialogTitle>
                    <DialogDescription>
                      {language === "en"
                        ? "Are you sure you want to approve this application? This will generate a registration certificate for the applicant."
                        : "هل أنت متأكد أنك تريد الموافقة على هذا الطلب؟ سيؤدي ذلك إلى إنشاء شهادة تسجيل لمقدم الطلب."}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
                      {language === "en" ? "Cancel" : "إلغاء"}
                    </Button>
                    <Button onClick={handleApprove}>{language === "en" ? "Approve" : "موافقة"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {application.status !== "rejected" && (
              <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <XCircle className="mr-2 h-4 w-4" />
                    {language === "en" ? "Reject Application" : "رفض الطلب"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{language === "en" ? "Reject Application" : "رفض الطلب"}</DialogTitle>
                    <DialogDescription>
                      {language === "en"
                        ? "Please provide a reason for rejecting this application. This information will be shared with the applicant."
                        : "يرجى تقديم سبب لرفض هذا الطلب. سيتم مشاركة هذه المعلومات مع مقدم الطلب."}
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder={language === "en" ? "Enter rejection reason..." : "أدخل سبب الرفض..."}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                      {language === "en" ? "Cancel" : "إلغاء"}
                    </Button>
                    <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>
                      {language === "en" ? "Reject" : "رفض"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Add Edit Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/registrar/applications/${application.id}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              {language === "en" ? "Edit Application" : "تعديل الطلب"}
            </Button>

            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              {language === "en" ? "Generate Report" : "إنشاء تقرير"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="mb-4">
          <TabsTrigger value="personal">{language === "en" ? "Personal Information" : "المعلومات الشخصية"}</TabsTrigger>
          <TabsTrigger value="education">{language === "en" ? "Education" : "التعليم"}</TabsTrigger>
          <TabsTrigger value="experience">{language === "en" ? "Experience" : "الخبرة"}</TabsTrigger>
          <TabsTrigger value="documents">{language === "en" ? "Documents" : "المستندات"}</TabsTrigger>
          <TabsTrigger value="verification">{language === "en" ? "Verification History" : "سجل التحقق"}</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Personal Information" : "المعلومات الشخصية"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">{language === "en" ? "Basic Information" : "المعلومات الأساسية"}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "Full Name" : "الاسم الكامل"}
                      </p>
                      <p>{application.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "Email" : "البريد الإلكتروني"}
                      </p>
                      <p>{application.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "Phone" : "الهاتف"}
                      </p>
                      <p>{application.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "National ID" : "رقم الهوية الوطنية"}
                      </p>
                      <p>{application.nationalId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "Date of Birth" : "تاريخ الميلاد"}
                      </p>
                      <p>{formatDate(application.dateOfBirth)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">{language === "en" ? "Contact Information" : "معلومات الاتصال"}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "Address" : "العنوان"}
                      </p>
                      <p>{application.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Education" : "التعليم"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {application.education.map((edu: any) => (
                  <div key={edu.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{edu.degree}</h3>
                        <p className="text-muted-foreground">{edu.institution}</p>
                      </div>
                      {edu.isVerified ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {language === "en" ? "Verified" : "تم التحقق"}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {language === "en" ? "Pending Verification" : "في انتظار التحقق"}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {language === "en" ? "Field of Study" : "مجال الدراسة"}
                        </p>
                        <p>{edu.field}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {language === "en" ? "Graduation Year" : "سنة التخرج"}
                        </p>
                        <p>{edu.graduationYear}</p>
                      </div>
                    </div>
                    {edu.isVerified && (
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <p className="font-medium mb-1">
                          {language === "en" ? "Verification Details" : "تفاصيل التحقق"}
                        </p>
                        <p className="text-muted-foreground">
                          {language === "en" ? "Verified by" : "تم التحقق بواسطة"}: {edu.verifiedBy}
                        </p>
                        <p className="text-muted-foreground">
                          {language === "en" ? "Verification Date" : "تاريخ التحقق"}: {formatDate(edu.verificationDate)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Professional Experience" : "الخبرة المهنية"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {application.experience.map((exp: any) => (
                  <div key={exp.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{exp.title}</h3>
                        <p className="text-muted-foreground">{exp.company}</p>
                      </div>
                      {exp.isVerified ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {language === "en" ? "Verified" : "تم التحقق"}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {language === "en" ? "Pending Verification" : "في انتظار التحقق"}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {language === "en" ? "Duration" : "المدة"}
                        </p>
                        <p>
                          {formatDate(exp.startDate)} -{" "}
                          {exp.isCurrent ? (language === "en" ? "Present" : "الحالي") : formatDate(exp.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {language === "en" ? "Description" : "الوصف"}
                      </p>
                      <p>{exp.description}</p>
                    </div>
                    {exp.isVerified && (
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <p className="font-medium mb-1">
                          {language === "en" ? "Verification Details" : "تفاصيل التحقق"}
                        </p>
                        <p className="text-muted-foreground">
                          {language === "en" ? "Verified by" : "تم التحقق بواسطة"}: {exp.verifiedBy}
                        </p>
                        <p className="text-muted-foreground">
                          {language === "en" ? "Verification Date" : "تاريخ التحقق"}: {formatDate(exp.verificationDate)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Documents" : "المستندات"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application.documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.isVerified ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {language === "en" ? "Verified" : "تم التحقق"}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {language === "en" ? "Pending Verification" : "في انتظار التحقق"}
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        {language === "en" ? "View" : "عرض"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        {language === "en" ? "Download" : "تنزيل"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Verification History" : "سجل التحقق"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application.verificationHistory.map((history: any) => (
                  <div key={history.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {history.action === "verify" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : history.action === "reject" ? (
                          <XCircle2 className="h-5 w-5 text-red-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                        <div>
                          <h3 className="font-medium">{language === "en" ? "Verification Action" : "إجراء التحقق"}</h3>
                          <p className="text-sm text-muted-foreground">
                            {language === "en" ? "By" : "بواسطة"}: {history.user}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDateTime(history.date)}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "Entity Type" : "نوع الكيان"}
                      </p>
                      <p className="capitalize">
                        {language === "en"
                          ? history.entityType
                          : history.entityType === "education"
                            ? "التعليم"
                            : history.entityType === "experience"
                              ? "الخبرة"
                              : history.entityType === "document"
                                ? "المستند"
                                : history.entityType === "application"
                                  ? "الطلب"
                                  : history.entityType}
                      </p>
                    </div>
                    {history.notes && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {language === "en" ? "Notes" : "ملاحظات"}
                        </p>
                        <p>{history.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

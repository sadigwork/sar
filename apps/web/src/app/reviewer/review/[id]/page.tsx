"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  GraduationCap,
  Briefcase,
  Award,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  LayoutDashboard,
  ClipboardCheck,
  History,
  Calendar,
  MapPin,
  Mail,
  Phone,
  User,
  FileCheck,
  AlertTriangle,
  CheckCheck,
  BarChart4,
  MessageSquare,
} from "lucide-react"

// Mock application data
const applicationData = {
  id: "APP123456",
  status: "pending",
  submittedDate: "2023-11-15",
  applicant: {
    id: "USR789012",
    name: "Ahmed Mohamed",
    nameAr: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+201234567890",
    avatar: "AM",
  },
  level: {
    id: "LVL3",
    name: "Advanced",
    nameAr: "متقدم",
    yearsRequired: "6-8",
  },
  personalInfo: {
    nationalId: "29012345678901",
    birthDate: "1990-05-15",
    address: "123 Main St, Cairo, Egypt",
    city: "Cairo",
    country: "Egypt",
  },
  education: [
    {
      id: "EDU1",
      degree: "Bachelor of Science in Agricultural Engineering",
      degreeAr: "بكالوريوس علوم في الهندسة الزراعية",
      institution: "Cairo University",
      institutionAr: "جامعة القاهرة",
      country: "Egypt",
      startYear: "2008",
      endYear: "2012",
      verified: true,
      document: "bachelor_degree.pdf",
    },
    {
      id: "EDU2",
      degree: "Master of Science in Agricultural Engineering",
      degreeAr: "ماجستير علوم في الهندسة الزراعية",
      institution: "Cairo University",
      institutionAr: "جامعة القاهرة",
      country: "Egypt",
      startYear: "2013",
      endYear: "2015",
      verified: false,
      document: "master_degree.pdf",
    },
  ],
  experience: [
    {
      id: "EXP1",
      position: "Agricultural Engineer",
      positionAr: "مهندس زراعي",
      company: "Ministry of Agriculture",
      companyAr: "وزارة الزراعة",
      location: "Cairo, Egypt",
      startDate: "2012-06-01",
      endDate: "2016-12-31",
      description: "Worked on irrigation systems and soil analysis projects.",
      descriptionAr: "عملت على مشاريع أنظمة الري وتحليل التربة.",
      verified: true,
      document: "ministry_experience.pdf",
    },
    {
      id: "EXP2",
      position: "Senior Agricultural Engineer",
      positionAr: "مهندس زراعي أول",
      company: "Green Farms Ltd",
      companyAr: "شركة المزارع الخضراء",
      location: "Giza, Egypt",
      startDate: "2017-01-15",
      endDate: null,
      currentlyWorking: true,
      description: "Leading sustainable farming projects and water conservation initiatives.",
      descriptionAr: "قيادة مشاريع الزراعة المستدامة ومبادرات الحفاظ على المياه.",
      verified: false,
      document: "greenfarms_experience.pdf",
    },
  ],
  documents: [
    {
      id: "DOC1",
      type: "id",
      name: "National ID",
      nameAr: "الهوية الوطنية",
      file: "national_id.pdf",
      uploadDate: "2023-11-10",
      verified: true,
    },
    {
      id: "DOC2",
      type: "certificate",
      name: "Professional Training Certificate",
      nameAr: "شهادة التدريب المهني",
      file: "training_certificate.pdf",
      uploadDate: "2023-11-12",
      verified: false,
    },
    {
      id: "DOC3",
      type: "other",
      name: "Recommendation Letter",
      nameAr: "خطاب توصية",
      file: "recommendation.pdf",
      uploadDate: "2023-11-14",
      verified: false,
    },
  ],
  evaluationCriteria: [
    {
      id: "CRIT1",
      name: "Academic Qualifications",
      nameAr: "المؤهلات الأكاديمية",
      weight: 25,
      score: null,
      maxScore: 25,
    },
    {
      id: "CRIT2",
      name: "Professional Experience",
      nameAr: "الخبرة المهنية",
      weight: 35,
      score: null,
      maxScore: 35,
    },
    {
      id: "CRIT3",
      name: "Training & Certifications",
      nameAr: "التدريب والشهادات",
      weight: 15,
      score: null,
      maxScore: 15,
    },
    {
      id: "CRIT4",
      name: "Document Verification",
      nameAr: "التحقق من المستندات",
      weight: 15,
      score: null,
      maxScore: 15,
    },
    {
      id: "CRIT5",
      name: "Professional Achievements",
      nameAr: "الإنجازات المهنية",
      weight: 10,
      score: null,
      maxScore: 10,
    },
  ],
}

export default function ReviewApplicationPage() {
  const { t, language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [application, setApplication] = useState(applicationData)
  const [feedback, setFeedback] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [evaluationCriteria, setEvaluationCriteria] = useState(applicationData.evaluationCriteria)
  const [verificationStatus, setVerificationStatus] = useState({
    education: applicationData.education.map((edu) => edu.verified),
    experience: applicationData.experience.map((exp) => exp.verified),
    documents: applicationData.documents.map((doc) => doc.verified),
  })
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)

  // Check if user is logged in and is a reviewer
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "reviewer") {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router])

  const handleCriteriaScoreChange = (id: string, score: number) => {
    setEvaluationCriteria(
      evaluationCriteria.map((criteria) =>
        criteria.id === id ? { ...criteria, score: Math.min(score, criteria.maxScore) } : criteria,
      ),
    )
  }

  const handleVerifyItem = (type: "education" | "experience" | "documents", index: number, verified: boolean) => {
    if (type === "education") {
      const newStatus = [...verificationStatus.education]
      newStatus[index] = verified
      setVerificationStatus({ ...verificationStatus, education: newStatus })
    } else if (type === "experience") {
      const newStatus = [...verificationStatus.experience]
      newStatus[index] = verified
      setVerificationStatus({ ...verificationStatus, experience: newStatus })
    } else if (type === "documents") {
      const newStatus = [...verificationStatus.documents]
      newStatus[index] = verified
      setVerificationStatus({ ...verificationStatus, documents: newStatus })
    }
  }

  const handleViewDocument = (document: any) => {
    setSelectedDocument(document)
    setDocumentPreviewOpen(true)
  }

  const handleApprove = () => {
    setAction("approve")
    setDialogOpen(true)
  }

  const handleReject = () => {
    setAction("reject")
    setDialogOpen(true)
  }

  const confirmAction = () => {
    if (action === "approve") {
      // Update application status (would be an API call in a real app)
      toast({
        title: t("language") === "en" ? "Application Approved" : "تمت الموافقة على الطلب",
        description:
          t("language") === "en" ? "The application has been approved successfully" : "تمت الموافقة على الطلب بنجاح",
      })
    } else if (action === "reject") {
      // Update application status (would be an API call in a real app)
      toast({
        title: t("language") === "en" ? "Application Rejected" : "تم رفض الطلب",
        description: t("language") === "en" ? "The application has been rejected" : "تم رفض الطلب",
      })
    }

    setDialogOpen(false)
    router.push("/reviewer/applications")
  }

  // Calculate total score
  const totalScore = evaluationCriteria.reduce((sum, criteria) => sum + (criteria.score || 0), 0)
  const maxPossibleScore = evaluationCriteria.reduce((sum, criteria) => sum + criteria.maxScore, 0)
  const scorePercentage = (totalScore / maxPossibleScore) * 100

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("language") === "en" ? "Present" : "الحالي"
    const date = new Date(dateString)
    return date.toLocaleDateString(t("language") === "en" ? "en-US" : "ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{t("language") === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  // تحديث الهيكل الرئيسي للصفحة
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/reviewer/applications")} className="mb-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t("language") === "en" ? "Back to Applications" : "العودة إلى الطلبات"}
            </Button>
            {application.status === "pending" && (
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500"
              >
                <Clock className="mr-1 h-3 w-3" />
                {t("language") === "en" ? "Pending Review" : "قيد المراجعة"}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-1">{t("language") === "en" ? "Application Review" : "مراجعة الطلب"}</h1>
          <p className="text-muted-foreground">
            {t("language") === "en" ? "Application ID: " : "رقم الطلب: "}
            <span className="font-medium">{application.id}</span> •
            <span className="ml-1">{t("language") === "en" ? "Submitted: " : "تاريخ التقديم: "}</span>
            <span className="font-medium">{formatDate(application.submittedDate)}</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
          <Button variant="outline" onClick={() => setHistoryDialogOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "View History" : "عرض السجل"}
          </Button>
          <Button className="bg-gradient-green hover:opacity-90" onClick={handleApprove}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Approve" : "موافقة"}
          </Button>
          <Button variant="destructive" onClick={handleReject}>
            <XCircle className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Reject" : "رفض"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Sidebar with applicant info and evaluation */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          {/* Applicant Card */}
          <ApplicantInfoCard application={application} language={language} formatDate={formatDate} />

          {/* Evaluation Score Card */}
          <EvaluationScoreCard
            evaluationCriteria={evaluationCriteria}
            setEvaluationCriteria={setEvaluationCriteria}
            totalScore={totalScore}
            maxPossibleScore={maxPossibleScore}
            scorePercentage={scorePercentage}
            language={language}
          />

          {/* Timeline/Activity Card */}
          <ActivityTimelineCard application={application} language={language} formatDate={formatDate} />
        </div>

        {/* Main content area */}
        <div className="md:col-span-8 lg:col-span-9">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4 w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {t("language") === "en" ? "Overview" : "نظرة عامة"}
              </TabsTrigger>
              <TabsTrigger value="education">
                <GraduationCap className="mr-2 h-4 w-4" />
                {t("language") === "en" ? "Education" : "التعليم"}
              </TabsTrigger>
              <TabsTrigger value="experience">
                <Briefcase className="mr-2 h-4 w-4" />
                {t("language") === "en" ? "Experience" : "الخبرة"}
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="mr-2 h-4 w-4" />
                {t("language") === "en" ? "Documents" : "المستندات"}
              </TabsTrigger>
              <TabsTrigger value="certifications">
                <Award className="mr-2 h-4 w-4" />
                {t("language") === "en" ? "Certifications" : "الشهادات"}
              </TabsTrigger>
              <TabsTrigger value="evaluation">
                <ClipboardCheck className="mr-2 h-4 w-4" />
                {t("language") === "en" ? "Evaluation" : "التقييم"}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <ApplicationOverviewTab
                application={application}
                language={language}
                formatDate={formatDate}
                verificationStatus={verificationStatus}
              />
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education">
              <EducationTab
                education={application.education}
                verificationStatus={verificationStatus.education}
                handleVerifyItem={handleVerifyItem}
                handleViewDocument={handleViewDocument}
                language={language}
              />
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience">
              <ExperienceTab
                experience={application.experience}
                verificationStatus={verificationStatus.experience}
                handleVerifyItem={handleVerifyItem}
                handleViewDocument={handleViewDocument}
                language={language}
                formatDate={formatDate}
              />
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <DocumentsTab
                documents={application.documents}
                verificationStatus={verificationStatus.documents}
                handleVerifyItem={handleVerifyItem}
                handleViewDocument={handleViewDocument}
                language={language}
                formatDate={formatDate}
              />
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications">
              <CertificationsTab language={language} formatDate={formatDate} />
            </TabsContent>

            {/* Evaluation Tab */}
            <TabsContent value="evaluation">
              <EvaluationTab
                evaluationCriteria={evaluationCriteria}
                setEvaluationCriteria={setEvaluationCriteria}
                totalScore={totalScore}
                maxPossibleScore={maxPossibleScore}
                scorePercentage={scorePercentage}
                feedback={feedback}
                setFeedback={setFeedback}
                language={language}
                router={router}
                handleApprove={handleApprove}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <ApproveRejectDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        action={action}
        feedback={feedback}
        setFeedback={setFeedback}
        confirmAction={confirmAction}
        language={language}
      />

      <DocumentPreviewDialog
        documentPreviewOpen={documentPreviewOpen}
        setDocumentPreviewOpen={setDocumentPreviewOpen}
        selectedDocument={selectedDocument}
        language={language}
      />

      <ApplicationHistoryDialog
        historyDialogOpen={historyDialogOpen}
        setHistoryDialogOpen={setHistoryDialogOpen}
        application={application}
        language={language}
        formatDate={formatDate}
      />
    </div>
  )

  // مكون معلومات مقدم الطلب
  function ApplicantInfoCard({ application, language, formatDate }: any) {
    const { t } = useLanguage()

    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>{t("language") === "en" ? "Applicant Details" : "تفاصيل مقدم الطلب"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={application.applicant.name} />
              <AvatarFallback className="text-lg">{application.applicant.avatar}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">
              {language === "en" ? application.applicant.name : application.applicant.nameAr}
            </h2>
            <Badge>
              {language === "en" ? application.level.name : application.level.nameAr} ({application.level.yearsRequired}{" "}
              {t("language") === "en" ? "years" : "سنوات"})
            </Badge>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{application.applicant.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{application.applicant.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {t("language") === "en" ? "National ID: " : "رقم الهوية: "}
                {application.personalInfo.nationalId}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {t("language") === "en" ? "Birth Date: " : "تاريخ الميلاد: "}
                {formatDate(application.personalInfo.birthDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{application.personalInfo.address}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // مكون بطاقة التقييم
  function EvaluationScoreCard({
    evaluationCriteria,
    setEvaluationCriteria,
    totalScore,
    maxPossibleScore,
    scorePercentage,
    language,
  }: any) {
    const { t } = useLanguage()

    const handleCriteriaScoreChange = (id: string, score: number) => {
      setEvaluationCriteria(
        evaluationCriteria.map((criteria: any) =>
          criteria.id === id ? { ...criteria, score: Math.min(score, criteria.maxScore) } : criteria,
        ),
      )
    }

    return (
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>{t("language") === "en" ? "Evaluation Score" : "درجة التقييم"}</CardTitle>
            <Badge variant={scorePercentage >= 70 ? "success" : "destructive"}>{Math.round(scorePercentage)}%</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">{t("language") === "en" ? "Total Score" : "الدرجة الكلية"}</span>
              <span className="text-sm font-medium">
                {totalScore}/{maxPossibleScore}
              </span>
            </div>
            <Progress
              value={scorePercentage}
              className="h-2 bg-secondary"
              indicatorClassName={scorePercentage >= 70 ? "bg-green-500" : "bg-amber-500"}
            />
          </div>

          <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
            {evaluationCriteria.map((criteria: any) => (
              <div key={criteria.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">
                    {language === "en" ? criteria.name : criteria.nameAr} ({criteria.weight}%)
                  </span>
                  <span className="text-sm font-medium">
                    {criteria.score !== null ? criteria.score : "-"}/{criteria.maxScore}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const scoreValue = (i + 1) * (criteria.maxScore / 5)
                    return (
                      <Button
                        key={i}
                        variant={criteria.score !== null && criteria.score >= scoreValue ? "default" : "outline"}
                        size="sm"
                        className={`h-7 w-7 p-0 ${
                          criteria.score !== null && criteria.score >= scoreValue
                            ? "bg-gradient-green hover:opacity-90"
                            : ""
                        }`}
                        onClick={() => handleCriteriaScoreChange(criteria.id, scoreValue)}
                      >
                        {Math.round(scoreValue)}
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // مكون سجل النشاط
  function ActivityTimelineCard({ application, language, formatDate }: any) {
    const { t } = useLanguage()

    // بيانات نشاط وهمية للعرض
    const activities = [
      {
        id: 1,
        type: "submission",
        date: application.submittedDate,
        user: "System",
        description: {
          en: "Application submitted",
          ar: "تم تقديم الطلب",
        },
      },
      {
        id: 2,
        type: "document_verification",
        date: "2023-11-16",
        user: "Ahmed Reviewer",
        description: {
          en: "National ID verified",
          ar: "تم التحقق من الهوية الوطنية",
        },
      },
      {
        id: 3,
        type: "education_verification",
        date: "2023-11-17",
        user: "Ahmed Reviewer",
        description: {
          en: "Bachelor's degree verified",
          ar: "تم التحقق من شهادة البكالوريوس",
        },
      },
      {
        id: 4,
        type: "comment",
        date: "2023-11-18",
        user: "Ahmed Reviewer",
        description: {
          en: "Requested additional information about work experience",
          ar: "تم طلب معلومات إضافية حول الخبرة العملية",
        },
      },
    ]

    const getActivityIcon = (type: string) => {
      switch (type) {
        case "submission":
          return <FileCheck className="h-4 w-4 text-blue-500" />
        case "document_verification":
          return <CheckCheck className="h-4 w-4 text-green-500" />
        case "education_verification":
          return <GraduationCap className="h-4 w-4 text-green-500" />
        case "experience_verification":
          return <Briefcase className="h-4 w-4 text-green-500" />
        case "comment":
          return <MessageSquare className="h-4 w-4 text-amber-500" />
        case "warning":
          return <AlertTriangle className="h-4 w-4 text-red-500" />
        default:
          return <Clock className="h-4 w-4 text-muted-foreground" />
      }
    }

    return (
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <CardTitle>{t("language") === "en" ? "Recent Activity" : "النشاط الأخير"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {language === "en" ? activity.description.en : activity.description.ar}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{activity.user}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDate(activity.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setHistoryDialogOpen(true)}>
            {t("language") === "en" ? "View Full History" : "عرض السجل الكامل"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // مكون نظرة عامة على الطلب
  function ApplicationOverviewTab({ application, language, formatDate, verificationStatus }: any) {
    const { t } = useLanguage()

    const getVerificationProgress = () => {
      const totalItems =
        verificationStatus.education.length + verificationStatus.experience.length + verificationStatus.documents.length

      const verifiedItems =
        verificationStatus.education.filter(Boolean).length +
        verificationStatus.experience.filter(Boolean).length +
        verificationStatus.documents.filter(Boolean).length

      return (verifiedItems / totalItems) * 100
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("language") === "en" ? "Application Summary" : "ملخص الطلب"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("language") === "en" ? "Verification Progress" : "تقدم التحقق"}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{Math.round(getVerificationProgress())}%</span>
                  </div>
                  <Progress value={getVerificationProgress()} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("language") === "en" ? "Education" : "التعليم"}
                </h3>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="font-medium">{application.education.length}</span>
                  <span className="text-sm text-muted-foreground">
                    {t("language") === "en" ? "qualifications" : "مؤهلات"}
                  </span>
                  <Badge variant="outline" className="ml-auto">
                    {verificationStatus.education.filter(Boolean).length}/{application.education.length}{" "}
                    {t("language") === "en" ? "verified" : "تم التحقق"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("language") === "en" ? "Experience" : "الخبرة"}
                </h3>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <span className="font-medium">{application.experience.length}</span>
                  <span className="text-sm text-muted-foreground">
                    {t("language") === "en" ? "positions" : "وظائف"}
                  </span>
                  <Badge variant="outline" className="ml-auto">
                    {verificationStatus.experience.filter(Boolean).length}/{application.experience.length}{" "}
                    {t("language") === "en" ? "verified" : "تم التحقق"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("language") === "en" ? "Documents" : "المستندات"}
                </h3>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">{application.documents.length}</span>
                  <span className="text-sm text-muted-foreground">
                    {t("language") === "en" ? "documents" : "مستندات"}
                  </span>
                  <Badge variant="outline" className="ml-auto">
                    {verificationStatus.documents.filter(Boolean).length}/{application.documents.length}{" "}
                    {t("language") === "en" ? "verified" : "تم التحقق"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("language") === "en" ? "Level Applied" : "المستوى المطلوب"}
                </h3>
                <div className="flex items-center gap-2">
                  <BarChart4 className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {language === "en" ? application.level.name : application.level.nameAr}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({application.level.yearsRequired} {t("language") === "en" ? "years" : "سنوات"})
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t("language") === "en" ? "Application Date" : "تاريخ التقديم"}
                </h3>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium">{formatDate(application.submittedDate)}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">
                {t("language") === "en" ? "Verification Status" : "حالة التحقق"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {application.education.map((edu: any, index: number) => (
                  <div key={`edu-${edu.id}`} className="flex items-center p-3 border rounded-md">
                    <div className="mr-3">
                      {verificationStatus.education[index] ? (
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{language === "en" ? edu.degree : edu.degreeAr}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === "en" ? edu.institution : edu.institutionAr}
                      </p>
                    </div>
                  </div>
                ))}

                {application.experience.map((exp: any, index: number) => (
                  <div key={`exp-${exp.id}`} className="flex items-center p-3 border rounded-md">
                    <div className="mr-3">
                      {verificationStatus.experience[index] ? (
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{language === "en" ? exp.position : exp.positionAr}</p>
                      <p className="text-xs text-muted-foreground">{language === "en" ? exp.company : exp.companyAr}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // مكون علامة تبويب التعليم
  function EducationTab({ education, verificationStatus, handleVerifyItem, handleViewDocument, language }: any) {
    const { t } = useLanguage()

    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("language") === "en" ? "Educational Qualifications" : "المؤهلات التعليمية"}</CardTitle>
          <CardDescription>
            {t("language") === "en"
              ? "Verify and review educational qualifications"
              : "التحقق ومراجعة المؤهلات التعليمية"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {education.map((edu: any, index: number) => (
              <AccordionItem key={edu.id} value={edu.id}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4 text-primary" />
                      <span>{language === "en" ? edu.degree : edu.degreeAr}</span>
                    </div>
                    {verificationStatus[index] ? (
                      <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {t("language") === "en" ? "Verified" : "تم التحقق"}
                      </Badge>
                    ) : (
                      <Badge className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                        <Clock className="mr-1 h-3 w-3" />
                        {t("language") === "en" ? "Pending" : "قيد الانتظار"}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">
                          {t("language") === "en" ? "Institution:" : "المؤسسة التعليمية:"}
                        </p>
                        <p className="text-sm">
                          {language === "en" ? edu.institution : edu.institutionAr}, {edu.country}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t("language") === "en" ? "Duration:" : "المدة:"}</p>
                        <p className="text-sm">
                          {edu.startYear} - {edu.endYear}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t("language") === "en" ? "Document:" : "المستند:"}</p>
                      <div className="flex items-center mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(edu)}
                          className="flex items-center"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("language") === "en" ? "View Document" : "عرض المستند"}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyItem("education", index, true)}
                        className={verificationStatus[index] ? "bg-green-100" : ""}
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        {t("language") === "en" ? "Verify" : "تحقق"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyItem("education", index, false)}
                        className={!verificationStatus[index] ? "bg-red-100" : ""}
                      >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        {t("language") === "en" ? "Reject" : "رفض"}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    )
  }

  // مكون علامة تبويب الخبرة
  function ExperienceTab({
    experience,
    verificationStatus,
    handleVerifyItem,
    handleViewDocument,
    language,
    formatDate,
  }: any) {
    const { t } = useLanguage()

    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("language") === "en" ? "Work Experience" : "الخبرة العملية"}</CardTitle>
          <CardDescription>
            {t("language") === "en" ? "Verify and review work experience" : "التحقق ومراجعة الخبرة العملية"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {experience.map((exp: any, index: number) => (
              <AccordionItem key={exp.id} value={exp.id}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-primary" />
                      <span>{language === "en" ? exp.position : exp.positionAr}</span>
                    </div>
                    {verificationStatus[index] ? (
                      <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {t("language") === "en" ? "Verified" : "تم التحقق"}
                      </Badge>
                    ) : (
                      <Badge className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                        <Clock className="mr-1 h-3 w-3" />
                        {t("language") === "en" ? "Pending" : "قيد الانتظار"}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">{t("language") === "en" ? "Company:" : "الشركة:"}</p>
                        <p className="text-sm">{language === "en" ? exp.company : exp.companyAr}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t("language") === "en" ? "Location:" : "الموقع:"}</p>
                        <p className="text-sm">{exp.location}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t("language") === "en" ? "Duration:" : "المدة:"}</p>
                      <p className="text-sm">
                        {formatDate(exp.startDate)} -{" "}
                        {exp.currentlyWorking
                          ? t("language") === "en"
                            ? "Present"
                            : "الحالي"
                          : formatDate(exp.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t("language") === "en" ? "Description:" : "الوصف:"}</p>
                      <p className="text-sm">{language === "en" ? exp.description : exp.descriptionAr}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t("language") === "en" ? "Document:" : "المستند:"}</p>
                      <div className="flex items-center mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(exp)}
                          className="flex items-center"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("language") === "en" ? "View Document" : "عرض المستند"}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyItem("experience", index, true)}
                        className={verificationStatus[index] ? "bg-green-100" : ""}
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        {t("language") === "en" ? "Verify" : "تحقق"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyItem("experience", index, false)}
                        className={!verificationStatus[index] ? "bg-red-100" : ""}
                      >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        {t("language") === "en" ? "Reject" : "رفض"}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    )
  }

  // مكون علامة تبويب المستندات
  function DocumentsTab({
    documents,
    verificationStatus,
    handleVerifyItem,
    handleViewDocument,
    language,
    formatDate,
  }: any) {
    const { t } = useLanguage()

    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("language") === "en" ? "Supporting Documents" : "المستندات الداعمة"}</CardTitle>
          <CardDescription>
            {t("language") === "en" ? "Verify and review supporting documents" : "التحقق ومراجعة المستندات الداعمة"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((doc: any, index: number) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <h3 className="font-medium">{language === "en" ? doc.name : doc.nameAr}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("language") === "en" ? "Uploaded on: " : "تم الرفع في: "}
                      {formatDate(doc.uploadDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {verificationStatus[index] ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {t("language") === "en" ? "Verified" : "تم التحقق"}
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                      <Clock className="mr-1 h-3 w-3" />
                      {t("language") === "en" ? "Pending" : "قيد الانتظار"}
                    </Badge>
                  )}
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">{t("language") === "en" ? "View" : "عرض"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyItem("documents", index, true)}
                      className={verificationStatus[index] ? "bg-green-100" : ""}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="sr-only">{t("language") === "en" ? "Verify" : "تحقق"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyItem("documents", index, false)}
                      className={!verificationStatus[index] ? "bg-red-100" : ""}
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span className="sr-only">{t("language") === "en" ? "Reject" : "رفض"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // مكون علامة تبويب الشهادات
  function CertificationsTab({ language, formatDate }: any) {
    const { t } = useLanguage()

    // بيانات وهمية للشهادات
    const certifications = [
      {
        id: "cert1",
        nameEn: "Agricultural Engineering Professional",
        nameAr: "مهندس زراعي محترف",
        descriptionEn: "Professional certification for agricultural engineers with 3+ years of experience",
        descriptionAr: "شهادة مهنية للمهندسين الزراعيين ذوي خبرة 3+ سنوات",
        status: "pending",
        appliedDate: "2023-11-10",
        requirements: [
          {
            id: "req1",
            nameEn: "Bachelor's degree in Agricultural Engineering",
            nameAr: "بكالوريوس في الهندسة الزراعية",
          },
          { id: "req2", nameEn: "3+ years of professional experience", nameAr: "خبرة مهنية 3+ سنوات" },
          { id: "req3", nameEn: "Passing the certification exam", nameAr: "اجتياز امتحان الشهادة" },
        ],
      },
      {
        id: "cert2",
        nameEn: "Agricultural Water Management Specialist",
        nameAr: "أخصائي إدارة المياه الزراعية",
        descriptionEn: "Specialized certification for agricultural engineers focused on water management",
        descriptionAr: "شهادة متخصصة للمهندسين الزراعيين المتخصصين في إدارة المياه",
        status: "pending",
        appliedDate: "2023-11-12",
        requirements: [
          {
            id: "req8",
            nameEn: "Bachelor's degree in Agricultural or Water Engineering",
            nameAr: "بكالوريوس في الهندسة الزراعية أو هندسة المياه",
          },
          {
            id: "req9",
            nameEn: "5+ years of experience in water management projects",
            nameAr: "خبرة 5+ سنوات في مشاريع إدارة المياه",
          },
          {
            id: "req10",
            nameEn: "Completion of specialized water management training",
            nameAr: "إكمال تدريب متخصص في إدارة المياه",
          },
        ],
      },
    ]

    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("language") === "en" ? "Professional Certifications" : "الشهادات المهنية"}</CardTitle>
          <CardDescription>
            {t("language") === "en"
              ? "Verify and review professional certification applications"
              : "التحقق ومراجعة طلبات الشهادات المهنية"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {certifications.map((cert) => (
              <AccordionItem key={cert.id} value={cert.id}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center">
                      <Award className="mr-2 h-4 w-4 text-primary" />
                      <span>{language === "en" ? cert.nameEn : cert.nameAr}</span>
                    </div>
                    <Badge className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                      <Clock className="mr-1 h-3 w-3" />
                      {t("language") === "en" ? "Pending" : "قيد الانتظار"}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div>
                      <p className="text-sm font-medium">{t("language") === "en" ? "Description:" : "الوصف:"}</p>
                      <p className="text-sm">{language === "en" ? cert.descriptionEn : cert.descriptionAr}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t("language") === "en" ? "Applied on:" : "تاريخ التقديم:"}</p>
                      <p className="text-sm">{formatDate(cert.appliedDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t("language") === "en" ? "Requirements:" : "المتطلبات:"}</p>
                      <ul className="list-disc list-inside text-sm pl-2">
                        {cert.requirements.map((req: any) => (
                          <li key={req.id}>{language === "en" ? req.nameEn : req.nameAr}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm" className="bg-green-100">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        {t("language") === "en" ? "Approve" : "موافقة"}
                      </Button>
                      <Button variant="outline" size="sm" className="bg-red-100">
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        {t("language") === "en" ? "Reject" : "رفض"}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    )
  }

  // مكون علامة تبويب التقييم
  function EvaluationTab({
    evaluationCriteria,
    setEvaluationCriteria,
    totalScore,
    maxPossibleScore,
    scorePercentage,
    feedback,
    setFeedback,
    language,
    router,
    handleApprove,
  }: any) {
    const { t } = useLanguage()

    const handleCriteriaScoreChange = (id: string, score: number) => {
      setEvaluationCriteria(
        evaluationCriteria.map((criteria: any) =>
          criteria.id === id ? { ...criteria, score: Math.min(score, criteria.maxScore) } : criteria,
        ),
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("language") === "en" ? "Evaluation & Feedback" : "التقييم والملاحظات"}</CardTitle>
          <CardDescription>
            {t("language") === "en"
              ? "Provide evaluation and feedback for the application"
              : "تقديم التقييم والملاحظات للطلب"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t("language") === "en" ? "Evaluation Summary" : "ملخص التقييم"}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("language") === "en" ? "Total Score" : "الدرجة الكلية"}:
                </span>
                <span className="text-sm font-medium">
                  {totalScore}/{maxPossibleScore} ({Math.round(scorePercentage)}%)
                </span>
              </div>
              <Progress
                value={scorePercentage}
                className="h-2 bg-secondary"
                indicatorClassName={scorePercentage >= 70 ? "bg-green-500" : "bg-amber-500"}
              />
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                {scorePercentage >= 70
                  ? t("language") === "en"
                    ? "The applicant meets the requirements for certification."
                    : "يستوفي مقدم الطلب متطلبات الشهادة."
                  : t("language") === "en"
                    ? "The applicant does not meet the minimum requirements for certification."
                    : "لا يستوفي مقدم الطلب الحد الأدنى من متطلبات الشهادة."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t("language") === "en" ? "Evaluation Criteria" : "معايير التقييم"}</h3>
            <div className="space-y-6">
              {evaluationCriteria.map((criteria: any) => (
                <div key={criteria.id} className="space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-sm font-medium">{language === "en" ? criteria.name : criteria.nameAr}</span>
                      <span className="text-xs text-muted-foreground ml-2">({criteria.weight}%)</span>
                    </div>
                    <span className="text-sm font-medium">
                      {criteria.score !== null ? criteria.score : "-"}/{criteria.maxScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-secondary rounded-full h-2 mr-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${criteria.score !== null ? (criteria.score / criteria.maxScore) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const scoreValue = (i + 1) * (criteria.maxScore / 5)
                        return (
                          <Button
                            key={i}
                            variant={criteria.score !== null && criteria.score >= scoreValue ? "default" : "outline"}
                            size="sm"
                            className={`h-7 w-7 p-0 ${
                              criteria.score !== null && criteria.score >= scoreValue
                                ? "bg-gradient-green hover:opacity-90"
                                : ""
                            }`}
                            onClick={() => handleCriteriaScoreChange(criteria.id, scoreValue)}
                          >
                            {Math.round(scoreValue)}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">{t("language") === "en" ? "Reviewer Feedback" : "ملاحظات المراجع"}</h3>
            <Textarea
              placeholder={
                t("language") === "en"
                  ? "Provide detailed feedback about this application..."
                  : "قدم ملاحظات مفصلة حول هذا الطلب..."
              }
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/reviewer/applications")}>
              {t("language") === "en" ? "Save as Draft" : "حفظ كمسودة"}
            </Button>
            <Button className="bg-gradient-green hover:opacity-90" onClick={handleApprove}>
              {t("language") === "en" ? "Complete Review" : "إكمال المراجعة"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // مكون حوار الموافقة/الرفض
  function ApproveRejectDialog({
    dialogOpen,
    setDialogOpen,
    action,
    feedback,
    setFeedback,
    confirmAction,
    language,
  }: any) {
    const { t } = useLanguage()

    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "approve"
                ? t("language") === "en"
                  ? "Approve Application"
                  : "الموافقة على الطلب"
                : t("language") === "en"
                  ? "Reject Application"
                  : "رفض الطلب"}
            </DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? t("language") === "en"
                  ? "Are you sure you want to approve this application?"
                  : "هل أنت متأكد من أنك تريد الموافقة على هذا الطلب؟"
                : t("language") === "en"
                  ? "Are you sure you want to reject this application?"
                  : "هل أنت متأكد من أنك تريد رفض هذا الطلب؟"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("language") === "en" ? "Feedback" : "الملاحظات"}:</label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={
                  t("language") === "en" ? "Provide feedback for the applicant..." : "قدم ملاحظات لمقدم الطلب..."
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("language") === "en" ? "Cancel" : "إلغاء"}
            </Button>
            <Button
              variant={action === "approve" ? "default" : "destructive"}
              className={action === "approve" ? "bg-gradient-green hover:opacity-90" : ""}
              onClick={confirmAction}
            >
              {action === "approve"
                ? t("language") === "en"
                  ? "Approve"
                  : "موافقة"
                : t("language") === "en"
                  ? "Reject"
                  : "رفض"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // مكون حوار معاينة المستند
  function DocumentPreviewDialog({ documentPreviewOpen, setDocumentPreviewOpen, selectedDocument, language }: any) {
    const { t } = useLanguage()

    return (
      <Dialog open={documentPreviewOpen} onOpenChange={setDocumentPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("language") === "en" ? "Document Preview" : "معاينة المستند"}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center min-h-[60vh] bg-muted/20 rounded-md">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="mt-4">
                {t("language") === "en"
                  ? "Document preview not available in this demo."
                  : "معاينة المستند غير متاحة في هذا العرض التوضيحي."}
              </p>
              <p className="text-sm text-muted-foreground mt-2">{selectedDocument?.file || "document.pdf"}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocumentPreviewOpen(false)}>
              {t("language") === "en" ? "Close" : "إغلاق"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // مكون حوار سجل الطلب
  function ApplicationHistoryDialog({
    historyDialogOpen,
    setHistoryDialogOpen,
    application,
    language,
    formatDate,
  }: any) {
    const { t } = useLanguage()

    // بيانات وهمية لسجل الطلب
    const historyItems = [
      {
        id: 1,
        type: "submission",
        date: application.submittedDate,
        user: "System",
        description: {
          en: "Application submitted",
          ar: "تم تقديم الطلب",
        },
      },
      {
        id: 2,
        type: "document_verification",
        date: "2023-11-16",
        user: "Ahmed Reviewer",
        description: {
          en: "National ID verified",
          ar: "تم التحقق من الهوية الوطنية",
        },
      },
      {
        id: 3,
        type: "education_verification",
        date: "2023-11-17",
        user: "Ahmed Reviewer",
        description: {
          en: "Bachelor's degree verified",
          ar: "تم التحقق من شهادة البكالوريوس",
        },
      },
      {
        id: 4,
        type: "comment",
        date: "2023-11-18",
        user: "Ahmed Reviewer",
        description: {
          en: "Requested additional information about work experience",
          ar: "تم طلب معلومات إضافية حول الخبرة العملية",
        },
      },
      {
        id: 5,
        type: "document_verification",
        date: "2023-11-19",
        user: "Ahmed Reviewer",
        description: {
          en: "Experience certificate verified",
          ar: "تم التحقق من شهادة الخبرة",
        },
      },
      {
        id: 6,
        type: "comment",
        date: "2023-11-20",
        user: "System",
        description: {
          en: "Applicant uploaded additional documents",
          ar: "قام مقدم الطلب بتحميل مستندات إضافية",
        },
      },
      {
        id: 7,
        type: "evaluation",
        date: "2023-11-21",
        user: "Ahmed Reviewer",
        description: {
          en: "Evaluation completed with score 85/100",
          ar: "تم إكمال التقييم بدرجة 85/100",
        },
      },
    ]

    const getActivityIcon = (type: string) => {
      switch (type) {
        case "submission":
          return <FileCheck className="h-4 w-4 text-blue-500" />
        case "document_verification":
          return <CheckCheck className="h-4 w-4 text-green-500" />
        case "education_verification":
          return <GraduationCap className="h-4 w-4 text-green-500" />
        case "experience_verification":
          return <Briefcase className="h-4 w-4 text-green-500" />
        case "comment":
          return <MessageSquare className="h-4 w-4 text-amber-500" />
        case "evaluation":
          return <BarChart4 className="h-4 w-4 text-purple-500" />
        case "warning":
          return <AlertTriangle className="h-4 w-4 text-red-500" />
        default:
          return <Clock className="h-4 w-4 text-muted-foreground" />
      }
    }

    return (
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("language") === "en" ? "Application History" : "سجل الطلب"}</DialogTitle>
            <DialogDescription>
              {t("language") === "en"
                ? "Complete history of actions and changes for this application"
                : "السجل الكامل للإجراءات والتغييرات لهذا الطلب"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="relative">
              {historyItems.map((item, index) => (
                <div key={item.id} className="mb-8 relative">
                  {/* خط متصل بين العناصر */}
                  {index < historyItems.length - 1 && (
                    <div
                      className="absolute left-4 top-8 bottom-0 w-0.5 bg-border"
                      style={{ transform: "translateX(-50%)" }}
                    ></div>
                  )}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background flex items-center justify-center border">
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {language === "en" ? item.description.en : item.description.ar}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{item.user}</span>
                        <span className="mx-1">•</span>
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryDialogOpen(false)}>
              {t("language") === "en" ? "Close" : "إغلاق"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
}

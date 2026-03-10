"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  BookOpen,
  Star,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock fellowship application data
const fellowshipData = {
  id: "FELLOW123456",
  status: "pending",
  submittedDate: "2023-11-15",
  applicant: {
    id: "USR789012",
    name: "Ahmed Mohamed",
    nameAr: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+201234567890",
    avatar: "AM",
    currentCertification: {
      level: "Expert",
      levelAr: "خبير",
      issueDate: "2018-05-20",
      expiryDate: "2024-05-20",
    },
  },
  fellowship: {
    id: "FEL001",
    name: "Agricultural Water Management",
    nameAr: "إدارة المياه الزراعية",
    description: "Fellowship for experts in agricultural water management and irrigation systems",
    descriptionAr: "زمالة للخبراء في إدارة المياه الزراعية وأنظمة الري",
  },
  experience: [
    {
      id: "FEXP1",
      position: "Senior Agricultural Engineer",
      positionAr: "مهندس زراعي أول",
      company: "Ministry of Agriculture",
      companyAr: "وزارة الزراعة",
      location: "Cairo, Egypt",
      startDate: "2012-06-01",
      endDate: "2016-12-31",
      description: "Led irrigation systems and soil analysis projects across multiple governorates",
      descriptionAr: "قاد مشاريع أنظمة الري وتحليل التربة عبر محافظات متعددة",
      verified: true,
      document: "ministry_experience.pdf",
      relevance: "high",
    },
    {
      id: "FEXP2",
      position: "Water Management Consultant",
      positionAr: "مستشار إدارة المياه",
      company: "Green Farms Ltd",
      companyAr: "شركة المزارع الخضراء",
      location: "Giza, Egypt",
      startDate: "2017-01-15",
      endDate: null,
      currentlyWorking: true,
      description: "Providing consultation on water conservation and sustainable irrigation practices",
      descriptionAr: "تقديم استشارات حول الحفاظ على المياه وممارسات الري المستدامة",
      verified: false,
      document: "consultant_experience.pdf",
      relevance: "high",
    },
    {
      id: "FEXP3",
      position: "Project Manager",
      positionAr: "مدير مشروع",
      company: "Agricultural Development Authority",
      companyAr: "هيئة التنمية الزراعية",
      location: "Alexandria, Egypt",
      startDate: "2019-03-10",
      endDate: "2022-08-15",
      description: "Managed large-scale water management projects in desert reclamation areas",
      descriptionAr: "أدار مشاريع إدارة المياه واسعة النطاق في مناطق استصلاح الصحراء",
      verified: false,
      document: "project_manager_experience.pdf",
      relevance: "medium",
    },
  ],
  research: [
    {
      id: "RES1",
      title: "Optimizing Drip Irrigation Systems for Desert Agriculture",
      titleAr: "تحسين أنظمة الري بالتنقيط للزراعة الصحراوية",
      journal: "Journal of Agricultural Engineering",
      journalAr: "مجلة الهندسة الزراعية",
      publicationDate: "2019-05-10",
      authors: "Ahmed Mohamed, Sara Ali",
      authorsAr: "أحمد محمد، سارة علي",
      abstract:
        "This research presents a novel approach to optimizing drip irrigation systems for desert agriculture, resulting in 30% water savings while maintaining crop yields.",
      abstractAr:
        "يقدم هذا البحث نهجًا جديدًا لتحسين أنظمة الري بالتنقيط للزراعة الصحراوية، مما يؤدي إلى توفير 30٪ من المياه مع الحفاظ على محصول المحاصيل.",
      verified: true,
      document: "drip_irrigation_research.pdf",
      citations: 12,
      impact: "high",
    },
    {
      id: "RES2",
      title: "Soil Moisture Sensors for Precision Agriculture",
      titleAr: "أجهزة استشعار رطوبة التربة للزراعة الدقيقة",
      journal: "Agricultural Technology Review",
      journalAr: "مراجعة التكنولوجيا الزراعية",
      publicationDate: "2020-11-22",
      authors: "Ahmed Mohamed, Khaled Ibrahim",
      authorsAr: "أحمد محمد، خالد إبراهيم",
      abstract:
        "A comparative study of various soil moisture sensors and their application in precision agriculture for water conservation.",
      abstractAr: "دراسة مقارنة لمختلف أجهزة استشعار رطوبة التربة وتطبيقها في الزراعة الدقيقة للحفاظ على المياه.",
      verified: true,
      document: "soil_moisture_research.pdf",
      citations: 8,
      impact: "medium",
    },
    {
      id: "RES3",
      title: "Water Harvesting Techniques for Arid Regions",
      titleAr: "تقنيات حصاد المياه للمناطق القاحلة",
      journal: "Sustainable Agriculture Research",
      journalAr: "بحوث الزراعة المستدامة",
      publicationDate: "2021-08-05",
      authors: "Ahmed Mohamed, Fatima Hassan",
      authorsAr: "أحمد محمد، فاطمة حسن",
      abstract:
        "Evaluation of various water harvesting techniques suitable for arid regions in Egypt and their impact on agricultural sustainability.",
      abstractAr: "تقييم تقنيات مختلفة لحصاد المياه مناسبة للمناطق القاحلة في مصر وتأثيرها على استدامة الزراعة.",
      verified: false,
      document: "water_harvesting_research.pdf",
      citations: 5,
      impact: "medium",
    },
  ],
  continuingEducation: [
    {
      id: "CE1",
      title: "Advanced Irrigation Systems Design",
      titleAr: "تصميم أنظمة الري المتقدمة",
      provider: "Agricultural Engineering Institute",
      providerAr: "معهد الهندسة الزراعية",
      completionDate: "2020-03-15",
      hours: 40,
      certificate: "irrigation_design_certificate.pdf",
      verified: true,
    },
    {
      id: "CE2",
      title: "Water Resource Management in Agriculture",
      titleAr: "إدارة الموارد المائية في الزراعة",
      provider: "International Water Association",
      providerAr: "الجمعية الدولية للمياه",
      completionDate: "2021-07-10",
      hours: 30,
      certificate: "water_management_certificate.pdf",
      verified: true,
    },
    {
      id: "CE3",
      title: "Sustainable Farming Practices",
      titleAr: "ممارسات الزراعة المستدامة",
      provider: "Agricultural Sustainability Center",
      providerAr: "مركز الاستدامة الزراعية",
      completionDate: "2022-01-20",
      hours: 25,
      certificate: "sustainable_farming_certificate.pdf",
      verified: false,
    },
  ],
  evaluationCriteria: [
    {
      id: "FCRIT1",
      name: "Professional Experience",
      nameAr: "الخبرة المهنية",
      weight: 30,
      score: null,
      maxScore: 30,
      requirement: "Minimum 5 years of relevant experience after professional certification",
      requirementAr: "خبرة لا تقل عن 5 سنوات ذات صلة بعد الشهادة المهنية",
    },
    {
      id: "FCRIT2",
      name: "Research Publications",
      nameAr: "المنشورات البحثية",
      weight: 30,
      score: null,
      maxScore: 30,
      requirement: "At least 3 published research papers in peer-reviewed journals",
      requirementAr: "ما لا يقل عن 3 أوراق بحثية منشورة في مجلات محكمة",
    },
    {
      id: "FCRIT3",
      name: "Continuing Education",
      nameAr: "التعليم المستمر",
      weight: 20,
      score: null,
      maxScore: 20,
      requirement: "Minimum 80 hours of relevant continuing education in the past 3 years",
      requirementAr: "ما لا يقل عن 80 ساعة من التعليم المستمر ذي الصلة في السنوات الثلاث الماضية",
    },
    {
      id: "FCRIT4",
      name: "Specialization Relevance",
      nameAr: "صلة التخصص",
      weight: 20,
      score: null,
      maxScore: 20,
      requirement: "Demonstrated expertise in the fellowship specialization area",
      requirementAr: "خبرة مثبتة في مجال تخصص الزمالة",
    },
  ],
}

export default function ReviewFellowshipApplicationPage() {
  const { t, language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [application, setApplication] = useState(fellowshipData)
  const [feedback, setFeedback] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [evaluationCriteria, setEvaluationCriteria] = useState(fellowshipData.evaluationCriteria)
  const [verificationStatus, setVerificationStatus] = useState({
    experience: fellowshipData.experience.map((exp) => exp.verified),
    research: fellowshipData.research.map((res) => res.verified),
    continuingEducation: fellowshipData.continuingEducation.map((ce) => ce.verified),
  })
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)

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

  const handleVerifyItem = (
    type: "experience" | "research" | "continuingEducation",
    index: number,
    verified: boolean,
  ) => {
    if (type === "experience") {
      const newStatus = [...verificationStatus.experience]
      newStatus[index] = verified
      setVerificationStatus({ ...verificationStatus, experience: newStatus })
    } else if (type === "research") {
      const newStatus = [...verificationStatus.research]
      newStatus[index] = verified
      setVerificationStatus({ ...verificationStatus, research: newStatus })
    } else if (type === "continuingEducation") {
      const newStatus = [...verificationStatus.continuingEducation]
      newStatus[index] = verified
      setVerificationStatus({ ...verificationStatus, continuingEducation: newStatus })
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
        title: t("language") === "en" ? "Fellowship Application Approved" : "تمت الموافقة على طلب الزمالة",
        description:
          t("language") === "en"
            ? "The fellowship application has been approved successfully"
            : "تمت الموافقة على طلب الزمالة بنجاح",
      })
    } else if (action === "reject") {
      // Update application status (would be an API call in a real app)
      toast({
        title: t("language") === "en" ? "Fellowship Application Rejected" : "تم رفض طلب الزمالة",
        description: t("language") === "en" ? "The fellowship application has been rejected" : "تم رفض طلب الزمالة",
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

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            {t("language") === "en" ? "High Impact" : "تأثير عالي"}
          </Badge>
        )
      case "medium":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {t("language") === "en" ? "Medium Impact" : "تأثير متوسط"}
          </Badge>
        )
      case "low":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            {t("language") === "en" ? "Low Impact" : "تأثير منخفض"}
          </Badge>
        )
      default:
        return <Badge variant="outline">{t("language") === "en" ? "Unknown" : "غير معروف"}</Badge>
    }
  }

  const getRelevanceBadge = (relevance: string) => {
    switch (relevance) {
      case "high":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            {t("language") === "en" ? "High Relevance" : "صلة عالية"}
          </Badge>
        )
      case "medium":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {t("language") === "en" ? "Medium Relevance" : "صلة متوسطة"}
          </Badge>
        )
      case "low":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
            {t("language") === "en" ? "Low Relevance" : "صلة منخفضة"}
          </Badge>
        )
      default:
        return <Badge variant="outline">{t("language") === "en" ? "Unknown" : "غير معروف"}</Badge>
    }
  }

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{t("language") === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t("language") === "en" ? "Review Fellowship Application" : "مراجعة طلب الزمالة"}
          </h1>
          <p className="text-muted-foreground">
            {t("language") === "en" ? "Review and evaluate fellowship application" : "مراجعة وتقييم طلب الزمالة"}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/reviewer/applications")}>
          {t("language") === "en" ? "Back to Applications" : "العودة إلى الطلبات"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
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
                <Badge className="bg-gradient-green text-white">
                  {language === "en" ? application.fellowship.name : application.fellowship.nameAr}
                </Badge>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("language") === "en" ? "Application ID:" : "رقم الطلب:"}
                  </span>
                  <span className="text-sm">{application.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("language") === "en" ? "Submitted:" : "تاريخ التقديم:"}
                  </span>
                  <span className="text-sm">{formatDate(application.submittedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("language") === "en" ? "Email:" : "البريد الإلكتروني:"}
                  </span>
                  <span className="text-sm">{application.applicant.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("language") === "en" ? "Current Certification:" : "الشهادة الحالية:"}
                  </span>
                  <span className="text-sm">
                    {language === "en"
                      ? application.applicant.currentCertification.level
                      : application.applicant.currentCertification.levelAr}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("language") === "en" ? "Certification Expiry:" : "تاريخ انتهاء الشهادة:"}
                  </span>
                  <span className="text-sm">{formatDate(application.applicant.currentCertification.expiryDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("language") === "en" ? "Status:" : "الحالة:"}
                  </span>
                  <Badge variant="outline">
                    {application.status === "pending"
                      ? t("language") === "en"
                        ? "Pending"
                        : "قيد الانتظار"
                      : application.status === "approved"
                        ? t("language") === "en"
                          ? "Approved"
                          : "تمت الموافقة"
                        : t("language") === "en"
                          ? "Rejected"
                          : "مرفوض"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>{t("language") === "en" ? "Evaluation Score" : "درجة التقييم"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    {t("language") === "en" ? "Total Score" : "الدرجة الكلية"}
                  </span>
                  <span className="text-sm font-medium">
                    {totalScore}/{maxPossibleScore} ({Math.round(scorePercentage)}%)
                  </span>
                </div>
                <Progress value={scorePercentage} className="h-2 bg-secondary" />
              </div>

              <div className="space-y-4">
                {evaluationCriteria.map((criteria) => (
                  <div key={criteria.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">
                        {language === "en" ? criteria.name : criteria.nameAr} ({criteria.weight}%)
                      </span>
                      <span className="text-sm font-medium">
                        {criteria.score !== null ? criteria.score : "-"}/{criteria.maxScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const scoreValue = (i + 1) * (criteria.maxScore / 5)
                        return (
                          <Button
                            key={i}
                            variant={criteria.score !== null && criteria.score >= scoreValue ? "default" : "outline"}
                            size="sm"
                            className={
                              criteria.score !== null && criteria.score >= scoreValue
                                ? "bg-gradient-green hover:opacity-90"
                                : ""
                            }
                            onClick={() => handleCriteriaScoreChange(criteria.id, scoreValue)}
                          >
                            {Math.round(scoreValue)}
                          </Button>
                        )
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {language === "en" ? criteria.requirement : criteria.requirementAr}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full bg-gradient-green hover:opacity-90" onClick={handleApprove}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t("language") === "en" ? "Approve Fellowship" : "الموافقة على الزمالة"}
              </Button>
              <Button variant="destructive" className="w-full" onClick={handleReject}>
                <XCircle className="mr-2 h-4 w-4" />
                {t("language") === "en" ? "Reject Fellowship" : "رفض الزمالة"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="experience">
            <TabsList className="mb-4">
              <TabsTrigger value="experience">
                <Briefcase className="mr-2 h-4 w-4" />
                {t("language") === "en" ? "Experience" : "الخبرة"}
              </TabsTrigger>
              <TabsTrigger value="research">
                <BookOpen className="mr-2 h-4 w-4" />
                {t("language") === "en" ? "Research" : "البحوث"}
              </TabsTrigger>
              <TabsTrigger value="education">
                <GraduationCap className="mr-2 h-4 w-4" />
                {t("language") === "en" ? "Continuing Education" : "التعليم المستمر"}
              </TabsTrigger>
              <TabsTrigger value="evaluation">
                <Award className="mr-2 h-4 w-4" />
                {t("language") === "en" ? "Evaluation" : "التقييم"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="experience">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>{t("language") === "en" ? "Professional Experience" : "الخبرة المهنية"}</CardTitle>
                  <CardDescription>
                    {t("language") === "en"
                      ? "Verify and review relevant professional experience"
                      : "التحقق ومراجعة الخبرة المهنية ذات الصلة"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {application.experience.map((exp, index) => (
                      <AccordionItem key={exp.id} value={exp.id}>
                        <AccordionTrigger>
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center">
                              <Briefcase className="mr-2 h-4 w-4 text-primary" />
                              <span>{language === "en" ? exp.position : exp.positionAr}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getRelevanceBadge(exp.relevance)}
                              {verificationStatus.experience[index] ? (
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
                                <p className="text-sm font-medium">
                                  {t("language") === "en" ? "Location:" : "الموقع:"}
                                </p>
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
                              <p className="text-sm font-medium">
                                {t("language") === "en" ? "Description:" : "الوصف:"}
                              </p>
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
                                className={verificationStatus.experience[index] ? "bg-green-100" : ""}
                              >
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                {t("language") === "en" ? "Verify" : "تحقق"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyItem("experience", index, false)}
                                className={!verificationStatus.experience[index] ? "bg-red-100" : ""}
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
            </TabsContent>

            <TabsContent value="research">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>{t("language") === "en" ? "Research Publications" : "المنشورات البحثية"}</CardTitle>
                  <CardDescription>
                    {t("language") === "en"
                      ? "Verify and review research publications"
                      : "التحقق ومراجعة المنشورات البحثية"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {application.research.map((research, index) => (
                      <AccordionItem key={research.id} value={research.id}>
                        <AccordionTrigger>
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center">
                              <BookOpen className="mr-2 h-4 w-4 text-primary" />
                              <span>{language === "en" ? research.title : research.titleAr}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getImpactBadge(research.impact)}
                              {verificationStatus.research[index] ? (
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
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">{t("language") === "en" ? "Journal:" : "المجلة:"}</p>
                                <p className="text-sm">{language === "en" ? research.journal : research.journalAr}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {t("language") === "en" ? "Publication Date:" : "تاريخ النشر:"}
                                </p>
                                <p className="text-sm">{formatDate(research.publicationDate)}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{t("language") === "en" ? "Authors:" : "المؤلفون:"}</p>
                              <p className="text-sm">{language === "en" ? research.authors : research.authorsAr}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{t("language") === "en" ? "Abstract:" : "الملخص:"}</p>
                              <p className="text-sm">{language === "en" ? research.abstract : research.abstractAr}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {t("language") === "en" ? "Citations:" : "الاقتباسات:"}
                              </p>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.min(Math.ceil(research.citations / 3), 5)
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-sm ml-2">{research.citations}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{t("language") === "en" ? "Document:" : "المستند:"}</p>
                              <div className="flex items-center mt-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDocument(research)}
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
                                onClick={() => handleVerifyItem("research", index, true)}
                                className={verificationStatus.research[index] ? "bg-green-100" : ""}
                              >
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                {t("language") === "en" ? "Verify" : "تحقق"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyItem("research", index, false)}
                                className={!verificationStatus.research[index] ? "bg-red-100" : ""}
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
            </TabsContent>

            <TabsContent value="education">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>{t("language") === "en" ? "Continuing Education" : "التعليم المستمر"}</CardTitle>
                  <CardDescription>
                    {t("language") === "en"
                      ? "Verify and review continuing education activities"
                      : "التحقق ومراجعة أنشطة التعليم المستمر"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("language") === "en" ? "Course/Program" : "الدورة/البرنامج"}</TableHead>
                        <TableHead>{t("language") === "en" ? "Provider" : "المزود"}</TableHead>
                        <TableHead>{t("language") === "en" ? "Hours" : "الساعات"}</TableHead>
                        <TableHead>{t("language") === "en" ? "Completion Date" : "تاريخ الإكمال"}</TableHead>
                        <TableHead>{t("language") === "en" ? "Status" : "الحالة"}</TableHead>
                        <TableHead>{t("language") === "en" ? "Actions" : "الإجراءات"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {application.continuingEducation.map((education, index) => (
                        <TableRow key={education.id}>
                          <TableCell className="font-medium">
                            {language === "en" ? education.title : education.titleAr}
                          </TableCell>
                          <TableCell>{language === "en" ? education.provider : education.providerAr}</TableCell>
                          <TableCell>{education.hours}</TableCell>
                          <TableCell>{formatDate(education.completionDate)}</TableCell>
                          <TableCell>
                            {verificationStatus.continuingEducation[index] ? (
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
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewDocument(education)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyItem("continuingEducation", index, true)}
                                className={verificationStatus.continuingEducation[index] ? "bg-green-100" : ""}
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleVerifyItem("continuingEducation", index, false)}
                                className={!verificationStatus.continuingEducation[index] ? "bg-red-100" : ""}
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evaluation">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>{t("language") === "en" ? "Evaluation & Feedback" : "التقييم والملاحظات"}</CardTitle>
                  <CardDescription>
                    {t("language") === "en"
                      ? "Provide evaluation and feedback for the fellowship application"
                      : "تقديم التقييم والملاحظات لطلب الزمالة"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">
                      {t("language") === "en" ? "Evaluation Summary" : "ملخص التقييم"}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {t("language") === "en" ? "Total Score" : "الدرجة الكلية"}:
                        </span>
                        <span className="text-sm font-medium">
                          {totalScore}/{maxPossibleScore} ({Math.round(scorePercentage)}%)
                        </span>
                      </div>
                      <Progress value={scorePercentage} className="h-2 bg-secondary" />
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">
                        {scorePercentage >= 70
                          ? t("language") === "en"
                            ? "The applicant meets the requirements for fellowship."
                            : "يستوفي مقدم الطلب متطلبات الزمالة."
                          : t("language") === "en"
                            ? "The applicant does not meet the minimum requirements for fellowship."
                            : "لا يستوفي مقدم الطلب الحد الأدنى من متطلبات الزمالة."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">
                      {t("language") === "en" ? "Reviewer Feedback" : "ملاحظات المراجع"}
                    </h3>
                    <Textarea
                      placeholder={
                        t("language") === "en"
                          ? "Provide detailed feedback about this fellowship application..."
                          : "قدم ملاحظات مفصلة حول طلب الزمالة هذا..."
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
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "approve"
                ? t("language") === "en"
                  ? "Approve Fellowship Application"
                  : "الموافقة على طلب الزمالة"
                : t("language") === "en"
                  ? "Reject Fellowship Application"
                  : "رفض طلب الزمالة"}
            </DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? t("language") === "en"
                  ? "Are you sure you want to approve this fellowship application?"
                  : "هل أنت متأكد من أنك تريد الموافقة على طلب الزمالة هذا؟"
                : t("language") === "en"
                  ? "Are you sure you want to reject this fellowship application?"
                  : "هل أنت متأكد من أنك تريد رفض طلب الزمالة هذا؟"}
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
    </div>
  )
}

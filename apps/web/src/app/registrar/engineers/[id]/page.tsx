"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Printer,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  Award,
  BookOpen,
  AlertTriangle,
  Edit,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  Ban,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function EngineerDetailPage({ params }: { params: { id: string } }) {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [engineer, setEngineer] = useState<any>(null)
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false)
  const [revocationReason, setRevocationReason] = useState("")
  const [isRenewalDialogOpen, setIsRenewalDialogOpen] = useState(false)
  const [renewalYears, setRenewalYears] = useState(1)
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false)
  const [noteText, setNoteText] = useState("")

  // Sample data
  const sampleEngineer = {
    id: params.id,
    name: language === "en" ? "Ahmed Mohamed" : "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+201234567890",
    specialization: language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية",
    level: language === "en" ? "Expert" : "خبير",
    status: "active", // active, suspended, expired, revoked
    registrationNumber: "AE-2023-1234",
    registrationDate: "2023-01-15",
    expiryDate: "2026-01-14",
    avatar: "AM",
    nationalId: "1234567890",
    dateOfBirth: "1985-05-15",
    gender: language === "en" ? "Male" : "ذكر",
    nationality: language === "en" ? "Egyptian" : "مصري",
    address: language === "en" ? "123 Main St, Cairo, Egypt" : "١٢٣ شارع رئيسي، القاهرة، مصر",
    city: language === "en" ? "Cairo" : "القاهرة",
    postalCode: "11511",
    country: language === "en" ? "Egypt" : "مصر",
    education: [
      {
        id: "edu1",
        degree: language === "en" ? "Bachelor of Science" : "بكالوريوس علوم",
        institution: language === "en" ? "Cairo University" : "جامعة القاهرة",
        field: language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية",
        graduationYear: "2007",
        isVerified: true,
        verifiedBy: language === "en" ? "Dr. Khalid Al-Saud" : "د. خالد آل سعود",
        verificationDate: "2023-01-10",
      },
      {
        id: "edu2",
        degree: language === "en" ? "Master of Science" : "ماجستير علوم",
        institution: language === "en" ? "Alexandria University" : "جامعة الإسكندرية",
        field: language === "en" ? "Irrigation Systems" : "أنظمة الري",
        graduationYear: "2010",
        isVerified: true,
        verifiedBy: language === "en" ? "Dr. Nora Al-Rashid" : "د. نورا الرشيد",
        verificationDate: "2023-01-10",
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
        verificationDate: "2023-01-10",
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
        isVerified: true,
        verifiedBy: language === "en" ? "Dr. Nora Al-Rashid" : "د. نورا الرشيد",
        verificationDate: "2023-01-10",
      },
    ],
    certifications: [
      {
        id: "cert1",
        title: language === "en" ? "Certified Irrigation Designer" : "مصمم ري معتمد",
        issuingBody: language === "en" ? "Irrigation Association" : "جمعية الري",
        issueDate: "2018-03-20",
        expiryDate: "2024-03-19",
        isVerified: true,
      },
      {
        id: "cert2",
        title: language === "en" ? "Sustainable Agriculture Specialist" : "متخصص في الزراعة المستدامة",
        issuingBody: language === "en" ? "Agricultural Sustainability Institute" : "معهد استدامة الزراعة",
        issueDate: "2020-07-15",
        expiryDate: "2025-07-14",
        isVerified: true,
      },
    ],
    documents: [
      {
        id: "doc1",
        type: language === "en" ? "National ID" : "بطاقة الهوية الوطنية",
        name: language === "en" ? "National ID Card" : "بطاقة الهوية الوطنية",
        fileUrl: "/documents/national-id.pdf",
        uploadDate: "2023-01-05",
        isVerified: true,
      },
      {
        id: "doc2",
        type: language === "en" ? "Passport" : "جواز سفر",
        name: language === "en" ? "Passport Copy" : "نسخة جواز السفر",
        fileUrl: "/documents/passport.pdf",
        uploadDate: "2023-01-05",
        isVerified: true,
      },
      {
        id: "doc3",
        type: language === "en" ? "CV" : "السيرة الذاتية",
        name: language === "en" ? "Curriculum Vitae" : "السيرة الذاتية",
        fileUrl: "/documents/cv.pdf",
        uploadDate: "2023-01-05",
        isVerified: true,
      },
      {
        id: "doc4",
        type: language === "en" ? "Degree Certificate" : "شهادة الدرجة العلمية",
        name: language === "en" ? "BSc Certificate" : "شهادة البكالوريوس",
        fileUrl: "/documents/bsc-certificate.pdf",
        uploadDate: "2023-01-05",
        isVerified: true,
      },
    ],
    registrationHistory: [
      {
        id: "reg1",
        action: "registered",
        date: "2023-01-15",
        by: language === "en" ? "Layla Al-Otaibi" : "ليلى العتيبي",
        notes: language === "en" ? "Initial registration" : "التسجيل الأولي",
      },
    ],
    renewalHistory: [],
    notes: [
      {
        id: "note1",
        text: language === "en" ? "Excellent academic record" : "سجل أكاديمي ممتاز",
        date: "2023-01-10",
        by: language === "en" ? "Saad Al-Harbi" : "سعد الحربي",
      },
    ],
    professionalActivities: [
      {
        id: "act1",
        type: language === "en" ? "Conference" : "مؤتمر",
        title:
          language === "en" ? "International Agricultural Engineering Conference" : "المؤتمر الدولي للهندسة الزراعية",
        date: "2022-09-15",
        role: language === "en" ? "Speaker" : "متحدث",
        description:
          language === "en"
            ? "Presented research on sustainable irrigation systems"
            : "قدم بحثًا عن أنظمة الري المستدامة",
      },
      {
        id: "act2",
        type: language === "en" ? "Publication" : "منشور",
        title: language === "en" ? "Advances in Drip Irrigation Technology" : "التقدم في تكنولوجيا الري بالتنقيط",
        date: "2021-06-10",
        publisher: language === "en" ? "Agricultural Engineering Journal" : "مجلة الهندسة الزراعية",
        description:
          language === "en"
            ? "Research paper on improving water efficiency in drip irrigation systems"
            : "ورقة بحثية حول تحسين كفاءة المياه في أنظمة الري بالتنقيط",
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
        setEngineer(sampleEngineer)
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router, params.id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="mr-1 h-3 w-3" />
            {language === "en" ? "Active" : "نشط"}
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {language === "en" ? "Suspended" : "معلق"}
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
            <Clock className="mr-1 h-3 w-3" />
            {language === "en" ? "Expired" : "منتهي"}
          </Badge>
        )
      case "revoked":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            {language === "en" ? "Revoked" : "ملغي"}
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

  const handleRevokeRegistration = () => {
    // In a real application, this would call an API to revoke the registration
    setEngineer({
      ...engineer,
      status: "revoked",
      registrationHistory: [
        ...engineer.registrationHistory,
        {
          id: `reg${engineer.registrationHistory.length + 1}`,
          action: "revoked",
          date: new Date().toISOString(),
          by: user.name,
          notes: revocationReason,
        },
      ],
    })
    setIsRevokeDialogOpen(false)
  }

  const handleRenewRegistration = () => {
    // In a real application, this would call an API to renew the registration
    const currentExpiryDate = new Date(engineer.expiryDate)
    const newExpiryDate = new Date(currentExpiryDate)
    newExpiryDate.setFullYear(currentExpiryDate.getFullYear() + renewalYears)

    setEngineer({
      ...engineer,
      status: "active",
      expiryDate: newExpiryDate.toISOString(),
      renewalHistory: [
        ...engineer.renewalHistory,
        {
          id: `renew${engineer.renewalHistory.length + 1}`,
          date: new Date().toISOString(),
          by: user.name,
          years: renewalYears,
          previousExpiryDate: engineer.expiryDate,
          newExpiryDate: newExpiryDate.toISOString(),
        },
      ],
    })
    setIsRenewalDialogOpen(false)
  }

  const handleAddNote = () => {
    // In a real application, this would call an API to add a note
    setEngineer({
      ...engineer,
      notes: [
        ...engineer.notes,
        {
          id: `note${engineer.notes.length + 1}`,
          text: noteText,
          date: new Date().toISOString(),
          by: user.name,
        },
      ],
    })
    setNoteText("")
    setIsAddNoteDialogOpen(false)
  }

  const handlePrintCertificate = () => {
    // In a real application, this would generate and print a certificate
    alert(language === "en" ? "Printing certificate..." : "جاري طباعة الشهادة...")
  }

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{language === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  if (!engineer) {
    return (
      <div className="container py-10">
        <Button variant="outline" onClick={() => router.push("/registrar/engineers")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === "en" ? "Back to Engineers" : "العودة إلى المهندسين"}
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {language === "en" ? "Engineer Not Found" : "لم يتم العثور على المهندس"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === "en"
                ? "The engineer you are looking for does not exist or has been removed."
                : "المهندس الذي تبحث عنه غير موجود أو تمت إزالته."}
            </p>
            <Button onClick={() => router.push("/registrar/engineers")}>
              {language === "en" ? "View All Engineers" : "عرض جميع المهندسين"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpiringSoon = () => {
    const expiryDate = new Date(engineer.expiryDate)
    const today = new Date()
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(today.getMonth() + 3)
    return expiryDate <= threeMonthsFromNow && expiryDate > today
  }

  return (
    <div className="container py-10">
      <Button variant="outline" onClick={() => router.push("/registrar/engineers")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {language === "en" ? "Back to Engineers" : "العودة إلى المهندسين"}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`/placeholder.svg?height=64&width=64`} alt={engineer.name} />
                  <AvatarFallback>{engineer.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{engineer.name}</CardTitle>
                  <CardDescription className="text-base">
                    {engineer.specialization} • {engineer.level}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(engineer.status)}
                    {isExpiringSoon() && (
                      <Badge variant="outline" className="bg-orange-100 text-orange-800">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        {language === "en" ? "Expiring Soon" : "ينتهي قريبًا"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={handlePrintCertificate}>
                <Printer className="mr-2 h-4 w-4" />
                {language === "en" ? "Print Certificate" : "طباعة الشهادة"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {language === "en" ? "Registration Number" : "رقم التسجيل"}
                </p>
                <p className="font-medium">{engineer.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {language === "en" ? "Registration Date" : "تاريخ التسجيل"}
                </p>
                <p>{formatDate(engineer.registrationDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {language === "en" ? "Expiry Date" : "تاريخ الانتهاء"}
                </p>
                <p>{formatDate(engineer.expiryDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {language === "en" ? "National ID" : "رقم الهوية الوطنية"}
                </p>
                <p>{engineer.nationalId}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <span>{engineer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                <span>{engineer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {engineer.city}, {engineer.country}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{language === "en" ? "Actions" : "الإجراءات"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {engineer.status !== "revoked" && (
              <AlertDialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Ban className="mr-2 h-4 w-4" />
                    {language === "en" ? "Revoke Registration" : "إلغاء التسجيل"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{language === "en" ? "Revoke Registration" : "إلغاء التسجيل"}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {language === "en"
                        ? "Are you sure you want to revoke this engineer's registration? This action cannot be undone."
                        : "هل أنت متأكد أنك تريد إلغاء تسجيل هذا المهندس؟ لا يمكن التراجع عن هذا الإجراء."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Label htmlFor="revocation-reason" className="mb-2 block">
                      {language === "en" ? "Reason for Revocation" : "سبب الإلغاء"}
                    </Label>
                    <Textarea
                      id="revocation-reason"
                      placeholder={language === "en" ? "Enter reason..." : "أدخل السبب..."}
                      value={revocationReason}
                      onChange={(e) => setRevocationReason(e.target.value)}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{language === "en" ? "Cancel" : "إلغاء"}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRevokeRegistration}
                      disabled={!revocationReason.trim()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {language === "en" ? "Revoke" : "إلغاء"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {(engineer.status === "active" || engineer.status === "expired") && (
              <Dialog open={isRenewalDialogOpen} onOpenChange={setIsRenewalDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {language === "en" ? "Renew Registration" : "تجديد التسجيل"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{language === "en" ? "Renew Registration" : "تجديد التسجيل"}</DialogTitle>
                    <DialogDescription>
                      {language === "en"
                        ? "Specify the number of years to renew this registration."
                        : "حدد عدد سنوات تجديد هذا التسجيل."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="renewal-years" className="mb-2 block">
                      {language === "en" ? "Renewal Period (Years)" : "فترة التجديد (سنوات)"}
                    </Label>
                    <Input
                      id="renewal-years"
                      type="number"
                      min="1"
                      max="5"
                      value={renewalYears}
                      onChange={(e) => setRenewalYears(Number.parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {language === "en"
                        ? `Current expiry date: ${formatDate(engineer.expiryDate)}`
                        : `تاريخ الانتهاء الحالي: ${formatDate(engineer.expiryDate)}`}
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRenewalDialogOpen(false)}>
                      {language === "en" ? "Cancel" : "إلغاء"}
                    </Button>
                    <Button onClick={handleRenewRegistration}>{language === "en" ? "Renew" : "تجديد"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            <Dialog open={isAddNoteDialogOpen} onOpenChange={setIsAddNoteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  {language === "en" ? "Add Note" : "إضافة ملاحظة"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{language === "en" ? "Add Note" : "إضافة ملاحظة"}</DialogTitle>
                  <DialogDescription>
                    {language === "en"
                      ? "Add a note to this engineer's record. Notes are visible to all registrars."
                      : "أضف ملاحظة إلى سجل هذا المهندس. الملاحظات مرئية لجميع المسجلين."}
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  placeholder={language === "en" ? "Enter note..." : "أدخل الملاحظة..."}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddNoteDialogOpen(false)}>
                    {language === "en" ? "Cancel" : "إلغاء"}
                  </Button>
                  <Button onClick={handleAddNote} disabled={!noteText.trim()}>
                    {language === "en" ? "Add Note" : "إضافة ملاحظة"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/registrar/engineers/${params.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              {language === "en" ? "Edit Details" : "تعديل التفاصيل"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="mb-4">
          <TabsTrigger value="personal">{language === "en" ? "Personal Information" : "المعلومات الشخصية"}</TabsTrigger>
          <TabsTrigger value="education">{language === "en" ? "Education" : "التعليم"}</TabsTrigger>
          <TabsTrigger value="experience">{language === "en" ? "Experience" : "الخبرة"}</TabsTrigger>
          <TabsTrigger value="certifications">{language === "en" ? "Certifications" : "الشهادات"}</TabsTrigger>
          <TabsTrigger value="documents">{language === "en" ? "Documents" : "المستندات"}</TabsTrigger>
          <TabsTrigger value="history">{language === "en" ? "Registration History" : "تاريخ التسجيل"}</TabsTrigger>
          <TabsTrigger value="activities">
            {language === "en" ? "Professional Activities" : "الأنشطة المهنية"}
          </TabsTrigger>
          <TabsTrigger value="notes">{language === "en" ? "Notes" : "الملاحظات"}</TabsTrigger>
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
                      <p>{engineer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "Email" : "البريد الإلكتروني"}
                      </p>
                      <p>{engineer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "Phone" : "الهاتف"}
                      </p>
                      <p>{engineer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "National ID" : "رقم الهوية الوطنية"}
                      </p>
                      <p>{engineer.nationalId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "Date of Birth" : "تاريخ الميلاد"}
                      </p>
                      <p>{formatDate(engineer.dateOfBirth)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "Gender" : "الجنس"}
                      </p>
                      <p>{engineer.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "Nationality" : "الجنسية"}
                      </p>
                      <p>{engineer.nationality}</p>
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
                      <p>{engineer.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "City" : "المدينة"}
                      </p>
                      <p>{engineer.city}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "Postal Code" : "الرمز البريدي"}
                      </p>
                      <p>{engineer.postalCode}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === "en" ? "Country" : "البلد"}
                      </p>
                      <p>{engineer.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{language === "en" ? "Education" : "التعليم"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {engineer.education.map((edu: any) => (
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{language === "en" ? "Professional Experience" : "الخبرة المهنية"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {engineer.experience.map((exp: any) => (
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

        <TabsContent value="certifications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{language === "en" ? "Professional Certifications" : "الشهادات المهنية"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {engineer.certifications.map((cert: any) => (
                  <div key={cert.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{cert.title}</h3>
                        <p className="text-muted-foreground">{cert.issuingBody}</p>
                      </div>
                      {cert.isVerified ? (
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
                          {language === "en" ? "Issue Date" : "تاريخ الإصدار"}
                        </p>
                        <p>{formatDate(cert.issueDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {language === "en" ? "Expiry Date" : "تاريخ الانتهاء"}
                        </p>
                        <p>{formatDate(cert.expiryDate)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{language === "en" ? "Documents" : "المستندات"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {engineer.documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">{doc.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {language === "en" ? "Uploaded on" : "تم التحميل في"}: {formatDate(doc.uploadDate)}
                        </p>
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

        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{language === "en" ? "Registration History" : "تاريخ التسجيل"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="registration">
                <TabsList className="mb-4">
                  <TabsTrigger value="registration">
                    {language === "en" ? "Registration Events" : "أحداث التسجيل"}
                  </TabsTrigger>
                  <TabsTrigger value="renewal">{language === "en" ? "Renewal History" : "تاريخ التجديد"}</TabsTrigger>
                </TabsList>

                <TabsContent value="registration">
                  <Table>
                    <TableCaption>
                      {language === "en" ? "Registration history events" : "أحداث تاريخ التسجيل"}
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === "en" ? "Date" : "التاريخ"}</TableHead>
                        <TableHead>{language === "en" ? "Action" : "الإجراء"}</TableHead>
                        <TableHead>{language === "en" ? "By" : "بواسطة"}</TableHead>
                        <TableHead>{language === "en" ? "Notes" : "ملاحظات"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {engineer.registrationHistory.map((event: any) => (
                        <TableRow key={event.id}>
                          <TableCell>{formatDate(event.date)}</TableCell>
                          <TableCell className="capitalize">
                            {language === "en"
                              ? event.action
                              : event.action === "registered"
                                ? "تم التسجيل"
                                : event.action === "revoked"
                                  ? "تم الإلغاء"
                                  : event.action === "suspended"
                                    ? "تم التعليق"
                                    : event.action === "reinstated"
                                      ? "تمت إعادة التفعيل"
                                      : event.action}
                          </TableCell>
                          <TableCell>{event.by}</TableCell>
                          <TableCell>{event.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="renewal">
                  {engineer.renewalHistory.length > 0 ? (
                    <Table>
                      <TableCaption>
                        {language === "en" ? "Registration renewal history" : "تاريخ تجديد التسجيل"}
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === "en" ? "Date" : "التاريخ"}</TableHead>
                          <TableHead>{language === "en" ? "By" : "بواسطة"}</TableHead>
                          <TableHead>{language === "en" ? "Years" : "السنوات"}</TableHead>
                          <TableHead>{language === "en" ? "Previous Expiry" : "الانتهاء السابق"}</TableHead>
                          <TableHead>{language === "en" ? "New Expiry" : "الانتهاء الجديد"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {engineer.renewalHistory.map((renewal: any) => (
                          <TableRow key={renewal.id}>
                            <TableCell>{formatDate(renewal.date)}</TableCell>
                            <TableCell>{renewal.by}</TableCell>
                            <TableCell>{renewal.years}</TableCell>
                            <TableCell>{formatDate(renewal.previousExpiryDate)}</TableCell>
                            <TableCell>{formatDate(renewal.newExpiryDate)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      {language === "en" ? "No renewal history found" : "لم يتم العثور على تاريخ تجديد"}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{language === "en" ? "Professional Activities" : "الأنشطة المهنية"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {engineer.professionalActivities.map((activity: any) => (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {activity.type} • {formatDate(activity.date)}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {activity.type === "Conference" ? (
                          <BookOpen className="mr-1 h-3 w-3" />
                        ) : activity.type === "Publication" ? (
                          <FileText className="mr-1 h-3 w-3" />
                        ) : (
                          <Award className="mr-1 h-3 w-3" />
                        )}
                        {language === "en"
                          ? activity.type
                          : activity.type === "Conference"
                            ? "مؤتمر"
                            : activity.type === "Publication"
                              ? "منشور"
                              : activity.type === "Award"
                                ? "جائزة"
                                : activity.type}
                      </Badge>
                    </div>
                    {activity.role && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          {language === "en" ? "Role" : "الدور"}
                        </p>
                        <p>{activity.role}</p>
                      </div>
                    )}
                    {activity.publisher && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          {language === "en" ? "Publisher" : "الناشر"}
                        </p>
                        <p>{activity.publisher}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {language === "en" ? "Description" : "الوصف"}
                      </p>
                      <p>{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{language === "en" ? "Notes" : "الملاحظات"}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsAddNoteDialogOpen(true)}>
                <FileText className="mr-2 h-4 w-4" />
                {language === "en" ? "Add Note" : "إضافة ملاحظة"}
              </Button>
            </CardHeader>
            <CardContent>
              {engineer.notes.length > 0 ? (
                <div className="space-y-4">
                  {engineer.notes.map((note: any) => (
                    <div key={note.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p>{note.text}</p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              {language === "en" ? "Edit" : "تعديل"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              {language === "en" ? "Delete" : "حذف"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === "en" ? "Added by" : "تمت الإضافة بواسطة"}: {note.by} • {formatDateTime(note.date)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  {language === "en" ? "No notes found" : "لم يتم العثور على ملاحظات"}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

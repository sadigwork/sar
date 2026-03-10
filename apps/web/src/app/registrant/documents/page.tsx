"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Download, Eye, CheckCircle, XCircle, Clock, AlertTriangle, Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegistrantDocumentsPage() {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("")

  // Sample documents data
  const documents = [
    {
      id: 1,
      name: language === "en" ? "Academic Certificate" : "الشهادة الأكاديمية",
      type: "academic",
      fileName: "academic_certificate.pdf",
      status: "verified",
      uploadDate: "2023-01-20",
      verifiedDate: "2023-01-22",
      size: "2.3 MB",
      required: true,
    },
    {
      id: 2,
      name: language === "en" ? "Professional License" : "الترخيص المهني",
      type: "license",
      fileName: "professional_license.pdf",
      status: "verified",
      uploadDate: "2023-01-25",
      verifiedDate: "2023-01-27",
      size: "1.8 MB",
      required: true,
    },
    {
      id: 3,
      name: language === "en" ? "Experience Certificate" : "شهادة الخبرة",
      type: "experience",
      fileName: "experience_cert.pdf",
      status: "pending",
      uploadDate: "2023-11-20",
      verifiedDate: null,
      size: "1.2 MB",
      required: false,
    },
    {
      id: 4,
      name: language === "en" ? "Identity Document" : "وثيقة الهوية",
      type: "identity",
      fileName: "national_id.pdf",
      status: "rejected",
      uploadDate: "2023-11-15",
      verifiedDate: "2023-11-18",
      size: "900 KB",
      required: true,
      rejectionReason:
        language === "en"
          ? "Document quality is poor, please upload a clearer copy"
          : "جودة المستند ضعيفة، يرجى رفع نسخة أوضح",
    },
  ]

  const requiredDocuments = [
    { type: "academic", name: language === "en" ? "Academic Certificate" : "الشهادة الأكاديمية" },
    { type: "license", name: language === "en" ? "Professional License" : "الترخيص المهني" },
    { type: "identity", name: language === "en" ? "Identity Document" : "وثيقة الهوية" },
    { type: "photo", name: language === "en" ? "Personal Photo" : "الصورة الشخصية" },
  ]

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else {
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">{language === "en" ? "Verified" : "تم التحقق"}</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">{language === "en" ? "Pending" : "معلق"}</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">{language === "en" ? "Rejected" : "مرفوض"}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const handleFileUpload = () => {
    if (!selectedFile || !documentType) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Please select a file and document type" : "يرجى اختيار ملف ونوع المستند",
        variant: "destructive",
      })
      return
    }

    toast({
      title: language === "en" ? "Document Uploaded" : "تم رفع المستند",
      description: language === "en" ? "Your document has been uploaded successfully" : "تم رفع مستندك بنجاح",
    })
    setUploadDialogOpen(false)
    setSelectedFile(null)
    setDocumentType("")
  }

  const handleDeleteDocument = (docId: number) => {
    toast({
      title: language === "en" ? "Document Deleted" : "تم حذف المستند",
      description: language === "en" ? "The document has been deleted" : "تم حذف المستند",
    })
  }

  const verifiedCount = documents.filter((doc) => doc.status === "verified").length
  const totalRequired = requiredDocuments.length
  const completionPercentage = Math.round((verifiedCount / totalRequired) * 100)

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{language === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{language === "en" ? "My Documents" : "مستنداتي"}</h1>
          <p className="text-muted-foreground">
            {language === "en" ? "Manage your registration documents" : "إدارة مستندات التسجيل الخاصة بك"}
          </p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {language === "en" ? "Upload Document" : "رفع مستند"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === "en" ? "Upload New Document" : "رفع مستند جديد"}</DialogTitle>
              <DialogDescription>
                {language === "en" ? "Select a document type and upload your file" : "اختر نوع المستند وارفع ملفك"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="document-type">{language === "en" ? "Document Type" : "نوع المستند"}</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "en" ? "Select document type" : "اختر نوع المستند"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">
                      {language === "en" ? "Academic Certificate" : "الشهادة الأكاديمية"}
                    </SelectItem>
                    <SelectItem value="license">
                      {language === "en" ? "Professional License" : "الترخيص المهني"}
                    </SelectItem>
                    <SelectItem value="experience">
                      {language === "en" ? "Experience Certificate" : "شهادة الخبرة"}
                    </SelectItem>
                    <SelectItem value="identity">{language === "en" ? "Identity Document" : "وثيقة الهوية"}</SelectItem>
                    <SelectItem value="photo">{language === "en" ? "Personal Photo" : "الصورة الشخصية"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file">{language === "en" ? "File" : "الملف"}</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground">
                  {language === "en"
                    ? "Supported formats: PDF, JPG, PNG (Max 5MB)"
                    : "الصيغ المدعومة: PDF, JPG, PNG (حد أقصى 5 ميجابايت)"}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                {language === "en" ? "Cancel" : "إلغاء"}
              </Button>
              <Button onClick={handleFileUpload}>
                <Upload className="mr-2 h-4 w-4" />
                {language === "en" ? "Upload" : "رفع"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {language === "en" ? "Document Verification Progress" : "تقدم التحقق من المستندات"}
          </CardTitle>
          <CardDescription>
            {language === "en"
              ? `${verifiedCount} of ${totalRequired} required documents verified`
              : `تم التحقق من ${verifiedCount} من أصل ${totalRequired} مستندات مطلوبة`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={completionPercentage} className="flex-1" />
            <span className="text-2xl font-bold">{completionPercentage}%</span>
          </div>
          {completionPercentage < 100 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                {language === "en"
                  ? "Complete your document verification to activate your registration"
                  : "أكمل التحقق من مستنداتك لتفعيل تسجيلك"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">{getStatusIcon(doc.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{doc.name}</h3>
                      {getStatusBadge(doc.status)}
                      {doc.required && (
                        <Badge variant="outline" className="text-xs">
                          {language === "en" ? "Required" : "مطلوب"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{doc.fileName}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {language === "en" ? "Uploaded:" : "تم الرفع:"} {doc.uploadDate}
                      </span>
                      {doc.verifiedDate && (
                        <span>
                          {language === "en" ? "Verified:" : "تم التحقق:"} {doc.verifiedDate}
                        </span>
                      )}
                      <span>
                        {language === "en" ? "Size:" : "الحجم:"} {doc.size}
                      </span>
                    </div>
                    {doc.status === "rejected" && doc.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                        <p className="text-sm text-red-800">
                          <strong>{language === "en" ? "Rejection Reason:" : "سبب الرفض:"}</strong>{" "}
                          {doc.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    {language === "en" ? "View" : "عرض"}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    {language === "en" ? "Download" : "تحميل"}
                  </Button>
                  {doc.status === "rejected" && (
                    <Button size="sm">
                      <Upload className="h-4 w-4 mr-1" />
                      {language === "en" ? "Re-upload" : "إعادة رفع"}
                    </Button>
                  )}
                  {!doc.required && (
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteDocument(doc.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Missing Documents */}
      {requiredDocuments.some((req) => !documents.find((doc) => doc.type === req.type)) && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              {language === "en" ? "Missing Required Documents" : "المستندات المطلوبة المفقودة"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {requiredDocuments
                .filter((req) => !documents.find((doc) => doc.type === req.type))
                .map((req) => (
                  <div key={req.type} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{req.name}</span>
                    <Button
                      size="sm"
                      onClick={() => {
                        setDocumentType(req.type)
                        setUploadDialogOpen(true)
                      }}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      {language === "en" ? "Upload" : "رفع"}
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

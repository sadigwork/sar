"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Download, Upload, CheckCircle, XCircle, Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegistrarDocumentsPage() {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Sample documents data
  const documents = [
    {
      id: 1,
      name: "Academic Certificate",
      fileName: "ahmed_certificate.pdf",
      type: "academic",
      status: "verified",
      uploadDate: "2023-11-15",
      verifiedDate: "2023-11-16",
      userType: "engineer",
      userName: language === "en" ? "Ahmed Mohamed" : "أحمد محمد",
      size: "2.3 MB",
    },
    {
      id: 2,
      name: "Commercial Registration",
      fileName: "greenvalley_registration.pdf",
      type: "commercial",
      status: "pending",
      uploadDate: "2023-11-20",
      verifiedDate: null,
      userType: "institution",
      userName: language === "en" ? "Green Valley Co." : "شركة الوادي الأخضر",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "Professional License",
      fileName: "sara_license.pdf",
      type: "license",
      status: "rejected",
      uploadDate: "2023-11-18",
      verifiedDate: "2023-11-19",
      userType: "engineer",
      userName: language === "en" ? "Sara Ali" : "سارة علي",
      size: "1.2 MB",
    },
    {
      id: 4,
      name: "Experience Certificate",
      fileName: "khaled_experience.pdf",
      type: "experience",
      status: "verified",
      uploadDate: "2023-11-10",
      verifiedDate: "2023-11-12",
      userType: "engineer",
      userName: language === "en" ? "Khaled Ibrahim" : "خالد إبراهيم",
      size: "900 KB",
    },
  ]

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "registrar") {
        router.push("/dashboard")
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

  const getTypeText = (type: string) => {
    switch (type) {
      case "academic":
        return language === "en" ? "Academic" : "أكاديمي"
      case "commercial":
        return language === "en" ? "Commercial" : "تجاري"
      case "license":
        return language === "en" ? "License" : "ترخيص"
      case "experience":
        return language === "en" ? "Experience" : "خبرة"
      default:
        return type
    }
  }

  const handleVerifyDocument = (docId: number) => {
    toast({
      title: language === "en" ? "Document Verified" : "تم التحقق من المستند",
      description: language === "en" ? "The document has been verified successfully" : "تم التحقق من المستند بنجاح",
    })
  }

  const handleRejectDocument = (docId: number) => {
    toast({
      title: language === "en" ? "Document Rejected" : "تم رفض المستند",
      description: language === "en" ? "The document has been rejected" : "تم رفض المستند",
      variant: "destructive",
    })
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    const matchesType = typeFilter === "all" || doc.type === typeFilter
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.userName.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesType && matchesSearch
  })

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
          <h1 className="text-3xl font-bold mb-2">{language === "en" ? "Document Management" : "إدارة المستندات"}</h1>
          <p className="text-muted-foreground">
            {language === "en" ? "Verify and manage user documents" : "التحقق من وإدارة مستندات المستخدمين"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {language === "en" ? "Export Report" : "تصدير تقرير"}
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            {language === "en" ? "Bulk Upload" : "رفع مجمع"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{documents.filter((d) => d.status === "pending").length}</CardTitle>
            <CardDescription>{language === "en" ? "Pending Verification" : "في انتظار التحقق"}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{documents.filter((d) => d.status === "verified").length}</CardTitle>
            <CardDescription>{language === "en" ? "Verified Documents" : "المستندات المتحقق منها"}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{documents.filter((d) => d.status === "rejected").length}</CardTitle>
            <CardDescription>{language === "en" ? "Rejected Documents" : "المستندات المرفوضة"}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{documents.length}</CardTitle>
            <CardDescription>{language === "en" ? "Total Documents" : "إجمالي المستندات"}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={language === "en" ? "Search documents..." : "البحث في المستندات..."}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={language === "en" ? "Status" : "الحالة"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "en" ? "All Status" : "جميع الحالات"}</SelectItem>
            <SelectItem value="pending">{language === "en" ? "Pending" : "معلق"}</SelectItem>
            <SelectItem value="verified">{language === "en" ? "Verified" : "تم التحقق"}</SelectItem>
            <SelectItem value="rejected">{language === "en" ? "Rejected" : "مرفوض"}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={language === "en" ? "Type" : "النوع"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "en" ? "All Types" : "جميع الأنواع"}</SelectItem>
            <SelectItem value="academic">{language === "en" ? "Academic" : "أكاديمي"}</SelectItem>
            <SelectItem value="commercial">{language === "en" ? "Commercial" : "تجاري"}</SelectItem>
            <SelectItem value="license">{language === "en" ? "License" : "ترخيص"}</SelectItem>
            <SelectItem value="experience">{language === "en" ? "Experience" : "خبرة"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="p-4 hover:bg-muted/50">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{doc.name}</h3>
                        {getStatusBadge(doc.status)}
                        <Badge variant="outline">{getTypeText(doc.type)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{doc.fileName}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {language === "en" ? "Uploaded by:" : "رفع بواسطة:"} {doc.userName}
                      </p>
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
                    {doc.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => handleVerifyDocument(doc.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {language === "en" ? "Verify" : "تحقق"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectDocument(doc.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          {language === "en" ? "Reject" : "رفض"}
                        </Button>
                      </>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{language === "en" ? "Actions" : "الإجراءات"}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>{language === "en" ? "View Details" : "عرض التفاصيل"}</DropdownMenuItem>
                        <DropdownMenuItem>{language === "en" ? "Add Note" : "إضافة ملاحظة"}</DropdownMenuItem>
                        <DropdownMenuItem>
                          {language === "en" ? "Request Resubmission" : "طلب إعادة تقديم"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

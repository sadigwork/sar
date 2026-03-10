"use client"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Download, Eye, FileText, User, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DocumentDetailsPage() {
  const params = useParams()
  const documentId = params.id as string

  // Mock document data
  const document = {
    id: documentId,
    name: "شهادة البكالوريوس في الهندسة الزراعية",
    nameEn: "Bachelor of Agricultural Engineering",
    type: "education",
    status: "verified",
    uploadDate: "2024-01-15",
    verificationDate: "2024-01-18",
    fileUrl: "/documents/degree.pdf",
    fileSize: "2.5 MB",
    fileType: "PDF",
    owner: {
      id: "1",
      name: "أحمد محمد علي",
      email: "ahmed.ali@example.com",
    },
    verifier: {
      id: "2",
      name: "د. سارة أحمد",
      role: "مراجع أكاديمي",
    },
    notes: "شهادة معتمدة من جامعة الملك سعود",
    metadata: {
      university: "جامعة الملك سعود",
      graduationYear: "2010",
      gpa: "3.8",
      specialization: "هندسة الري والصرف",
    },
  }

  const verificationHistory = [
    {
      id: "1",
      action: "تم رفع المستند",
      date: "2024-01-15 10:30",
      user: "أحمد محمد علي",
      status: "uploaded",
    },
    {
      id: "2",
      action: "تم إرسال للمراجعة",
      date: "2024-01-16 09:15",
      user: "النظام",
      status: "review",
    },
    {
      id: "3",
      action: "تم التحقق من المستند",
      date: "2024-01-18 14:20",
      user: "د. سارة أحمد",
      status: "verified",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return "مُتحقق منه"
      case "pending":
        return "قيد المراجعة"
      case "rejected":
        return "مرفوض"
      default:
        return "غير محدد"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{document.name}</h1>
          <p className="text-gray-600">{document.nameEn}</p>
          <div className="flex items-center space-x-2 space-x-reverse mt-2">
            <Badge variant={getStatusColor(document.status)}>{getStatusText(document.status)}</Badge>
            <Badge variant="outline">{document.type}</Badge>
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="outline">
            <Eye className="h-4 w-4 ml-2" />
            عرض
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            تحميل
          </Button>
          <Link href={`/registrar/documents/${documentId}/edit`}>
            <Button>
              <Edit className="h-4 w-4 ml-2" />
              تعديل
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">تفاصيل المستند</TabsTrigger>
          <TabsTrigger value="metadata">البيانات الوصفية</TabsTrigger>
          <TabsTrigger value="history">سجل التحقق</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>معلومات المستند</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">اسم المستند</label>
                  <p>{document.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">النوع</label>
                  <p>{document.type === "education" ? "تعليمي" : document.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">حجم الملف</label>
                  <p>{document.fileSize}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">نوع الملف</label>
                  <p>{document.fileType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">تاريخ الرفع</label>
                  <p>{document.uploadDate}</p>
                </div>
                {document.verificationDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">تاريخ التحقق</label>
                    <p>{document.verificationDate}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معلومات المالك</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{document.owner.name}</p>
                    <p className="text-sm text-gray-500">{document.owner.email}</p>
                  </div>
                </div>

                {document.verifier && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">تم التحقق بواسطة</label>
                    <div className="flex items-center space-x-2 space-x-reverse mt-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium">{document.verifier.name}</p>
                        <p className="text-sm text-gray-500">{document.verifier.role}</p>
                      </div>
                    </div>
                  </div>
                )}

                {document.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">ملاحظات</label>
                    <p className="text-sm">{document.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metadata" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>البيانات الوصفية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(document.metadata).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-gray-500">
                      {key === "university"
                        ? "الجامعة"
                        : key === "graduationYear"
                          ? "سنة التخرج"
                          : key === "gpa"
                            ? "المعدل التراكمي"
                            : key === "specialization"
                              ? "التخصص"
                              : key}
                    </label>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجل التحقق</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verificationHistory.map((entry) => (
                  <div key={entry.id} className="flex items-start space-x-4 space-x-reverse p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {entry.status === "verified" && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {entry.status === "review" && <FileText className="h-5 w-5 text-blue-500" />}
                      {entry.status === "uploaded" && <Calendar className="h-5 w-5 text-gray-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{entry.action}</p>
                      <p className="text-sm text-gray-500">بواسطة: {entry.user}</p>
                      <p className="text-sm text-gray-500">{entry.date}</p>
                    </div>
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

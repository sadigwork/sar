"use client"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Mail, Phone, MapPin, Calendar, FileText, CreditCard } from "lucide-react"
import Link from "next/link"

export default function UserDetailsPage() {
  const params = useParams()
  const userId = params.id as string

  // Mock user data - replace with actual API call
  const user = {
    id: userId,
    name: "أحمد محمد علي",
    nameEn: "Ahmed Mohamed Ali",
    email: "ahmed.ali@example.com",
    phone: "+966501234567",
    nationalId: "1234567890",
    address: "الرياض، المملكة العربية السعودية",
    dateOfBirth: "1985-05-15",
    registrationDate: "2024-01-15",
    status: "active",
    role: "engineer",
    avatar: "/placeholder.svg?height=100&width=100",
    classification: "مهندس زراعي أول",
    licenseNumber: "AGR-2024-001",
    expiryDate: "2025-12-31",
  }

  const applications = [
    { id: "1", type: "تجديد ترخيص", status: "pending", date: "2024-01-20" },
    { id: "2", type: "ترقية تصنيف", status: "approved", date: "2024-01-10" },
  ]

  const documents = [
    { id: "1", name: "شهادة التخرج", type: "education", status: "verified" },
    { id: "2", name: "خبرة عملية", type: "experience", status: "pending" },
  ]

  const invoices = [
    { id: "1", amount: 500, status: "paid", date: "2024-01-15", description: "رسوم التسجيل" },
    { id: "2", amount: 200, status: "pending", date: "2024-01-20", description: "رسوم التجديد" },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.nameEn}</p>
            <Badge variant={user.status === "active" ? "default" : "secondary"}>
              {user.status === "active" ? "نشط" : "غير نشط"}
            </Badge>
          </div>
        </div>
        <Link href={`/registrar/users/${userId}/edit`}>
          <Button>
            <Edit className="h-4 w-4 ml-2" />
            تعديل
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">المعلومات الأساسية</TabsTrigger>
          <TabsTrigger value="applications">الطلبات</TabsTrigger>
          <TabsTrigger value="documents">المستندات</TabsTrigger>
          <TabsTrigger value="billing">الفواتير</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الشخصية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{user.address}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>تاريخ الميلاد: {user.dateOfBirth}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معلومات التسجيل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">رقم الهوية</label>
                  <p>{user.nationalId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">التصنيف</label>
                  <p>{user.classification}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">رقم الترخيص</label>
                  <p>{user.licenseNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">تاريخ انتهاء الترخيص</label>
                  <p>{user.expiryDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">تاريخ التسجيل</label>
                  <p>{user.registrationDate}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{app.type}</h3>
                      <p className="text-sm text-gray-500">تاريخ التقديم: {app.date}</p>
                    </div>
                    <Badge variant={app.status === "approved" ? "default" : "secondary"}>
                      {app.status === "approved" ? "موافق عليه" : "قيد المراجعة"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>المستندات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <Badge variant={doc.status === "verified" ? "default" : "secondary"}>
                      {doc.status === "verified" ? "مُتحقق منه" : "قيد المراجعة"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الفواتير</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <div>
                        <h3 className="font-medium">{invoice.description}</h3>
                        <p className="text-sm text-gray-500">التاريخ: {invoice.date}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{invoice.amount} ريال</p>
                      <Badge variant={invoice.status === "paid" ? "default" : "destructive"}>
                        {invoice.status === "paid" ? "مدفوع" : "غير مدفوع"}
                      </Badge>
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

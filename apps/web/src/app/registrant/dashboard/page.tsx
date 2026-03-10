"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  User,
  FileText,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Bell,
  Settings,
  Download,
  Upload,
  GraduationCap,
} from "lucide-react"

export default function RegistrantDashboardPage() {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Mock registrant data
  const registrantData = {
    id: "ENG-2023-001",
    name: language === "en" ? "Ahmed Mohamed Ali" : "أحمد محمد علي",
    email: "ahmed@example.com",
    phone: "+966 50 123 4567",
    specialization: language === "en" ? "Irrigation Engineering" : "هندسة الري",
    registrationDate: "2023-01-15",
    licenseExpiry: "2024-12-31",
    status: "active",
    profileCompletion: 85,
    documents: {
      total: 8,
      verified: 6,
      pending: 1,
      rejected: 1,
    },
    recentActivity: [
      {
        id: 1,
        type: "document",
        title: language === "en" ? "Experience certificate uploaded" : "تم رفع شهادة الخبرة",
        date: "2023-11-20",
        status: "pending",
      },
      {
        id: 2,
        type: "license",
        title: language === "en" ? "License renewal reminder" : "تذكير تجديد الترخيص",
        date: "2023-11-18",
        status: "info",
      },
      {
        id: 3,
        type: "payment",
        title: language === "en" ? "Registration fee payment confirmed" : "تم تأكيد دفع رسوم التسجيل",
        date: "2023-11-15",
        status: "completed",
      },
    ],
    upcomingDeadlines: [
      {
        id: 1,
        title: language === "en" ? "License Renewal" : "تجديد الترخيص",
        date: "2024-12-31",
        daysLeft: 45,
        type: "license",
      },
      {
        id: 2,
        title: language === "en" ? "Annual CPD Requirements" : "متطلبات التطوير المهني السنوية",
        date: "2024-06-30",
        daysLeft: 220,
        type: "cpd",
      },
    ],
    notifications: [
      {
        id: 1,
        title: language === "en" ? "Document verification completed" : "تم التحقق من المستند",
        message: language === "en" ? "Your academic certificate has been verified" : "تم التحقق من شهادتك الأكاديمية",
        date: "2023-11-20",
        read: false,
      },
      {
        id: 2,
        title: language === "en" ? "Profile update required" : "مطلوب تحديث الملف الشخصي",
        message: language === "en" ? "Please update your contact information" : "يرجى تحديث معلومات الاتصال الخاصة بك",
        date: "2023-11-18",
        read: false,
      },
    ],
  }

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
      case "active":
        return <Badge className="bg-green-100 text-green-800">{language === "en" ? "Active" : "نشط"}</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">{language === "en" ? "Pending" : "معلق"}</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800">{language === "en" ? "Expired" : "منتهي"}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const now = new Date()
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilExpiry = getDaysUntilExpiry(registrantData.licenseExpiry)

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{language === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt={registrantData.name} />
            <AvatarFallback className="text-lg">
              {registrantData.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-2">{registrantData.name}</h1>
            <p className="text-muted-foreground mb-2">{registrantData.specialization}</p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {language === "en" ? "ID:" : "الرقم:"} {registrantData.id}
              </span>
              {getStatusBadge(registrantData.status)}
              {registrantData.documents.verified > 0 && (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">{language === "en" ? "Verified" : "متحقق منه"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/registrant/profile")}>
            <Settings className="mr-2 h-4 w-4" />
            {language === "en" ? "Edit Profile" : "تعديل الملف"}
          </Button>
          <Button onClick={() => router.push("/registrant/documents")}>
            <Upload className="mr-2 h-4 w-4" />
            {language === "en" ? "Upload Documents" : "رفع المستندات"}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "License Status" : "حالة الترخيص"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{language === "en" ? "Active" : "نشط"}</p>
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? `${daysUntilExpiry} days left` : `${daysUntilExpiry} يوم متبقي`}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "en" ? "Profile Completion" : "اكتمال الملف"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xl font-bold">{registrantData.profileCompletion}%</p>
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={registrantData.profileCompletion} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{language === "en" ? "Documents" : "المستندات"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {registrantData.documents.verified}/{registrantData.documents.total}
                </p>
                <p className="text-xs text-muted-foreground">{language === "en" ? "Verified" : "متحقق منها"}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{language === "en" ? "Notifications" : "الإشعارات"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{registrantData.notifications.filter((n) => !n.read).length}</p>
                <p className="text-xs text-muted-foreground">{language === "en" ? "Unread" : "غير مقروءة"}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* License Information */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {language === "en" ? "License Information" : "معلومات الترخيص"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Registration Date" : "تاريخ التسجيل"}
              </p>
              <p className="font-medium">{registrantData.registrationDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{language === "en" ? "Expiry Date" : "تاريخ الانتهاء"}</p>
              <p className="font-medium">{registrantData.licenseExpiry}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{language === "en" ? "Specialization" : "التخصص"}</p>
              <p className="font-medium">{registrantData.specialization}</p>
            </div>
            {daysUntilExpiry <= 60 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  {language === "en" ? "License expires soon" : "الترخيص ينتهي قريباً"}
                </p>
              </div>
            )}
            <Button className="w-full" onClick={() => router.push("/registrant/license/renew")}>
              {language === "en" ? "Renew License" : "تجديد الترخيص"}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {language === "en" ? "Recent Activity" : "النشاط الحديث"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {registrantData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-1 bg-primary/10 rounded-full">
                    {activity.type === "document" && <FileText className="h-3 w-3 text-primary" />}
                    {activity.type === "license" && <Award className="h-3 w-3 text-primary" />}
                    {activity.type === "payment" && <CreditCard className="h-3 w-3 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  {activity.status === "pending" && (
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  )}
                  {activity.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => router.push("/registrant/activity")}>
              {language === "en" ? "View All Activity" : "عرض جميع الأنشطة"}
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {language === "en" ? "Upcoming Deadlines" : "المواعيد النهائية القادمة"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {registrantData.upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{deadline.title}</h4>
                    {deadline.type === "license" && <Award className="h-4 w-4 text-blue-500" />}
                    {deadline.type === "cpd" && <GraduationCap className="h-4 w-4 text-green-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{deadline.date}</p>
                  <p className="text-xs font-medium">
                    {deadline.daysLeft} {language === "en" ? "days left" : "يوم متبقي"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>{language === "en" ? "Quick Actions" : "الإجراءات السريعة"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/registrant/documents")}
            >
              <Upload className="mr-2 h-4 w-4" />
              {language === "en" ? "Upload Documents" : "رفع المستندات"}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/registrant/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              {language === "en" ? "Update Profile" : "تحديث الملف الشخصي"}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/registrant/certificates")}
            >
              <Download className="mr-2 h-4 w-4" />
              {language === "en" ? "Download Certificates" : "تحميل الشهادات"}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/registrant/support")}
            >
              <Bell className="mr-2 h-4 w-4" />
              {language === "en" ? "Contact Support" : "الاتصال بالدعم"}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {language === "en" ? "Recent Notifications" : "الإشعارات الحديثة"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {registrantData.notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border rounded-lg ${!notification.read ? "bg-blue-50 border-blue-200" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.date}</p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => router.push("/notifications")}>
              {language === "en" ? "View All Notifications" : "عرض جميع الإشعارات"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

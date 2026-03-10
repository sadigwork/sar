"use client"

import { AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@/components/ui/avatar"
import { Avatar } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, AlertCircle, FileText, BookOpen, Building2, GraduationCap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReviewerDashboardPage() {
  const { t } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("applications")

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

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{t("language") === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">{t("language") === "en" ? "Reviewer Dashboard" : "لوحة تحكم المراجع"}</h1>
      <p className="text-muted-foreground mb-6">
        {t("language") === "en"
          ? "Review and verify applications and documents"
          : "مراجعة والتحقق من الطلبات والمستندات"}
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="applications">{t("language") === "en" ? "Applications" : "الطلبات"}</TabsTrigger>
          <TabsTrigger value="fellowships">{t("language") === "en" ? "Fellowships" : "الزمالات"}</TabsTrigger>
          <TabsTrigger value="institutions">{t("language") === "en" ? "Institutions" : "المؤسسات"}</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("language") === "en" ? "Pending Applications" : "الطلبات قيد الانتظار"}</CardTitle>
                <CardDescription>
                  {t("language") === "en" ? "Applications awaiting review" : "الطلبات التي تنتظر المراجعة"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-medium">12</span>
                    </div>
                    <Button size="sm" onClick={() => router.push("/reviewer/applications")}>
                      {t("language") === "en" ? "Review" : "مراجعة"}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t("language") === "en" ? "Progress" : "التقدم"}
                      </span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("language") === "en" ? "Documents to Verify" : "المستندات للتحقق"}</CardTitle>
                <CardDescription>
                  {t("language") === "en" ? "Documents awaiting verification" : "المستندات التي تنتظر التحقق"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">28</span>
                    </div>
                    <Button size="sm" onClick={() => router.push("/reviewer/documents")}>
                      {t("language") === "en" ? "Verify" : "تحقق"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        {t("language") === "en" ? "Degrees" : "الشهادات"}
                      </span>
                      <span className="font-medium">10</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        {t("language") === "en" ? "Courses" : "الدورات"}
                      </span>
                      <span className="font-medium">18</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("language") === "en" ? "Recent Activity" : "النشاط الأخير"}</CardTitle>
                <CardDescription>
                  {t("language") === "en" ? "Your recent review activities" : "أنشطة المراجعة الأخيرة الخاصة بك"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        {t("language") === "en" ? "Approved certification" : "تمت الموافقة على الشهادة"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("language") === "en" ? "Ahmed Mohamed - 2 hours ago" : "أحمد محمد - منذ ساعتين"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        {t("language") === "en" ? "Rejected document" : "تم رفض المستند"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("language") === "en" ? "Sara Ali - 3 hours ago" : "سارة علي - منذ 3 ساعات"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        {t("language") === "en" ? "Verified degree" : "تم التحقق من الشهادة"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("language") === "en" ? "Khaled Ibrahim - 5 hours ago" : "خالد إبراهيم - منذ 5 ساعات"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">
              {t("language") === "en" ? "Applications Awaiting Review" : "الطلبات التي تنتظر المراجعة"}
            </h2>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt="Applicant" />
                          <AvatarFallback>{i === 1 ? "AM" : i === 2 ? "SA" : "KI"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {i === 1
                              ? t("language") === "en"
                                ? "Ahmed Mohamed"
                                : "أحمد محمد"
                              : i === 2
                                ? t("language") === "en"
                                  ? "Sara Ali"
                                  : "سارة علي"
                                : t("language") === "en"
                                  ? "Khaled Ibrahim"
                                  : "خالد إبراهيم"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t("language") === "en" ? "Applied for: " : "تقدم للحصول على: "}
                            {i === 1
                              ? t("language") === "en"
                                ? "Expert Level"
                                : "مستوى خبير"
                              : i === 2
                                ? t("language") === "en"
                                  ? "Intermediate Level"
                                  : "مستوى متوسط"
                                : t("language") === "en"
                                  ? "Advanced Level"
                                  : "مستوى متقدم"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {i === 1
                            ? t("language") === "en"
                              ? "New"
                              : "جديد"
                            : t("language") === "en"
                              ? "Pending"
                              : "قيد الانتظار"}
                        </Badge>
                        <Button size="sm" onClick={() => router.push(`/reviewer/applications/${i}`)}>
                          {t("language") === "en" ? "Review" : "مراجعة"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fellowships" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("language") === "en" ? "Fellowship Applications" : "طلبات الزمالة"}</CardTitle>
                <CardDescription>
                  {t("language") === "en" ? "Applications awaiting review" : "الطلبات التي تنتظر المراجعة"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-medium">8</span>
                    </div>
                    <Button size="sm" onClick={() => router.push("/reviewer/fellowship")}>
                      {t("language") === "en" ? "Review" : "مراجعة"}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t("language") === "en" ? "Progress" : "التقدم"}
                      </span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("language") === "en" ? "Fellowship Documents" : "مستندات الزمالة"}</CardTitle>
                <CardDescription>
                  {t("language") === "en" ? "Research papers and publications" : "الأوراق البحثية والمنشورات"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">24</span>
                    </div>
                    <Button size="sm" onClick={() => router.push("/reviewer/fellowship/documents")}>
                      {t("language") === "en" ? "Verify" : "تحقق"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        {t("language") === "en" ? "Research Papers" : "الأوراق البحثية"}
                      </span>
                      <span className="font-medium">16</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        {t("language") === "en" ? "Publications" : "المنشورات"}
                      </span>
                      <span className="font-medium">8</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold mb-4">
              {t("language") === "en" ? "Fellowship Applications Awaiting Review" : "طلبات الزمالة التي تنتظر المراجعة"}
            </h2>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt="Applicant" />
                          <AvatarFallback>{i === 1 ? "AM" : i === 2 ? "SA" : "KI"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {i === 1
                              ? t("language") === "en"
                                ? "Ahmed Mohamed"
                                : "أحمد محمد"
                              : i === 2
                                ? t("language") === "en"
                                  ? "Sara Ali"
                                  : "سارة علي"
                                : t("language") === "en"
                                  ? "Khaled Ibrahim"
                                  : "خالد إبراهيم"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t("language") === "en" ? "Applied for: " : "تقدم للحصول على: "}
                            {i === 1
                              ? t("language") === "en"
                                ? "Water Management Fellowship"
                                : "زمالة إدارة المياه"
                              : i === 2
                                ? t("language") === "en"
                                  ? "Sustainable Agriculture Fellowship"
                                  : "زمالة الزراعة المستدامة"
                                : t("language") === "en"
                                  ? "Agricultural Technology Fellowship"
                                  : "زمالة التكنولوجيا الزراعية"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {i === 1
                            ? t("language") === "en"
                              ? "New"
                              : "جديد"
                            : t("language") === "en"
                              ? "Pending"
                              : "قيد الانتظار"}
                        </Badge>
                        <Button size="sm" onClick={() => router.push(`/reviewer/fellowship/${i}`)}>
                          {t("language") === "en" ? "Review" : "مراجعة"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="institutions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("language") === "en" ? "Institution Registrations" : "تسجيلات المؤسسات"}</CardTitle>
                <CardDescription>
                  {t("language") === "en" ? "Registrations awaiting verification" : "التسجيلات التي تنتظر التحقق"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-medium">6</span>
                    </div>
                    <Button size="sm" onClick={() => router.push("/reviewer/institutions")}>
                      {t("language") === "en" ? "Review" : "مراجعة"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        {t("language") === "en" ? "Educational" : "تعليمية"}
                      </span>
                      <span className="font-medium">4</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        {t("language") === "en" ? "Companies" : "شركات"}
                      </span>
                      <span className="font-medium">2</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("language") === "en" ? "Institution Documents" : "مستندات المؤسسات"}</CardTitle>
                <CardDescription>
                  {t("language") === "en" ? "Documents awaiting verification" : "المستندات التي تنتظر التحقق"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">18</span>
                    </div>
                    <Button size="sm" onClick={() => router.push("/reviewer/institutions/documents")}>
                      {t("language") === "en" ? "Verify" : "تحقق"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        {t("language") === "en" ? "Licenses" : "التراخيص"}
                      </span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        {t("language") === "en" ? "Accreditations" : "الاعتمادات"}
                      </span>
                      <span className="font-medium">10</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold mb-4">
              {t("language") === "en"
                ? "Institution Registrations Awaiting Review"
                : "تسجيلات المؤسسات التي تنتظر المراجعة"}
            </h2>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        {i === 1 || i === 3 ? (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-primary" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">
                            {i === 1
                              ? t("language") === "en"
                                ? "Agricultural University"
                                : "الجامعة الزراعية"
                              : i === 2
                                ? t("language") === "en"
                                  ? "Green Farms Ltd"
                                  : "شركة المزارع الخضراء"
                                : t("language") === "en"
                                  ? "Water Resources Institute"
                                  : "معهد موارد المياه"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {i === 1 || i === 3
                              ? t("language") === "en"
                                ? "Educational Institution"
                                : "مؤسسة تعليمية"
                              : t("language") === "en"
                                ? "Agricultural Company"
                                : "شركة زراعية"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {i === 1
                            ? t("language") === "en"
                              ? "New"
                              : "جديد"
                            : t("language") === "en"
                              ? "Pending"
                              : "قيد الانتظار"}
                        </Badge>
                        <Button size="sm" onClick={() => router.push(`/reviewer/institutions/${i}`)}>
                          {t("language") === "en" ? "Review" : "مراجعة"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

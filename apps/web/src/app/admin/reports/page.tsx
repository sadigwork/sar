"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"
import { Download, BarChart3, PieChart, LineChart, Users, FileText, Award } from "lucide-react"

// Mock data for charts
const applicationsByStatusData = [
  { status: "Pending", count: 45, color: "#f59e0b" },
  { status: "Approved", count: 32, color: "#10b981" },
  { status: "Rejected", count: 12, color: "#ef4444" },
  { status: "Under Review", count: 18, color: "#3b82f6" },
]

const applicationsByLevelData = [
  { level: "Entry Level", count: 28, color: "#60a5fa" },
  { level: "Intermediate", count: 35, color: "#34d399" },
  { level: "Advanced", count: 22, color: "#a78bfa" },
  { level: "Expert", count: 15, color: "#f472b6" },
  { level: "Senior Expert", count: 8, color: "#fbbf24" },
  { level: "Consultant", count: 5, color: "#f43f5e" },
]

const monthlyApplicationsData = [
  { month: "Jan", count: 12 },
  { month: "Feb", count: 18 },
  { month: "Mar", count: 25 },
  { month: "Apr", count: 22 },
  { month: "May", count: 30 },
  { month: "Jun", count: 28 },
  { month: "Jul", count: 35 },
  { month: "Aug", count: 42 },
  { month: "Sep", count: 38 },
  { month: "Oct", count: 45 },
  { month: "Nov", count: 48 },
  { month: "Dec", count: 52 },
]

export default function SystemReportsPage() {
  const { t, language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [reportType, setReportType] = useState("applications")
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  // Check if user is logged in and is an admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "admin") {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router])

  const handleExportReport = () => {
    // This would be an API call in a real app to generate and download a report
    alert(t("language") === "en" ? "Report exported successfully" : "تم تصدير التقرير بنجاح")
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
          <h1 className="text-3xl font-bold mb-2">{t("language") === "en" ? "System Reports" : "تقارير النظام"}</h1>
          <p className="text-muted-foreground">
            {t("language") === "en"
              ? "View and export system reports and analytics"
              : "عرض وتصدير تقارير وتحليلات النظام"}
          </p>
        </div>
        <Button onClick={handleExportReport} className="bg-gradient-green hover:opacity-90">
          <Download className="mr-2 h-4 w-4" />
          {t("language") === "en" ? "Export Report" : "تصدير التقرير"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle>{t("language") === "en" ? "Total Applications" : "إجمالي الطلبات"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary mr-2" />
              <span className="text-3xl font-bold">107</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle>{t("language") === "en" ? "Total Users" : "إجمالي المستخدمين"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary mr-2" />
              <span className="text-3xl font-bold">248</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle>{t("language") === "en" ? "Certifications Issued" : "الشهادات الصادرة"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-8 w-8 text-primary mr-2" />
              <span className="text-3xl font-bold">32</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <Card className="bg-card flex-1">
          <CardHeader>
            <CardTitle>{t("language") === "en" ? "Report Type" : "نوع التقرير"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applications">
                  {t("language") === "en" ? "Applications Report" : "تقرير الطلبات"}
                </SelectItem>
                <SelectItem value="users">{t("language") === "en" ? "Users Report" : "تقرير المستخدمين"}</SelectItem>
                <SelectItem value="certifications">
                  {t("language") === "en" ? "Certifications Report" : "تقرير الشهادات"}
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card className="bg-card flex-1">
          <CardHeader>
            <CardTitle>{t("language") === "en" ? "Date Range" : "النطاق الزمني"}</CardTitle>
          </CardHeader>
          <CardContent>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Overview" : "نظرة عامة"}
          </TabsTrigger>
          <TabsTrigger value="applications">
            <FileText className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Applications" : "الطلبات"}
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Users" : "المستخدمين"}
          </TabsTrigger>
          <TabsTrigger value="certifications">
            <Award className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Certifications" : "الشهادات"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>{t("language") === "en" ? "Applications by Status" : "الطلبات حسب الحالة"}</CardTitle>
                <CardDescription>
                  {t("language") === "en"
                    ? "Distribution of applications by their current status"
                    : "توزيع الطلبات حسب حالتها الحالية"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <PieChart className="h-64 w-64 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {applicationsByStatusData.map((item) => (
                    <div key={item.status} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">
                        {t("language") === "en"
                          ? item.status
                          : item.status === "Pending"
                            ? "قيد الانتظار"
                            : item.status === "Approved"
                              ? "تمت الموافقة"
                              : item.status === "Rejected"
                                ? "مرفوض"
                                : "قيد المراجعة"}
                        : {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>{t("language") === "en" ? "Monthly Applications" : "الطلبات الشهرية"}</CardTitle>
                <CardDescription>
                  {t("language") === "en" ? "Number of applications submitted per month" : "عدد الطلبات المقدمة شهريًا"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <LineChart className="h-64 w-full text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card md:col-span-2">
              <CardHeader>
                <CardTitle>{t("language") === "en" ? "Applications by Level" : "الطلبات حسب المستوى"}</CardTitle>
                <CardDescription>
                  {t("language") === "en"
                    ? "Distribution of applications by certification level"
                    : "توزيع الطلبات حسب مستوى الشهادة"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <BarChart3 className="h-64 w-full text-muted-foreground" />
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4">
                  {applicationsByLevelData.map((item) => (
                    <div key={item.level} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">
                        {t("language") === "en"
                          ? item.level
                          : item.level === "Entry Level"
                            ? "مستوى المبتدئ"
                            : item.level === "Intermediate"
                              ? "متوسط"
                              : item.level === "Advanced"
                                ? "متقدم"
                                : item.level === "Expert"
                                  ? "خبير"
                                  : item.level === "Senior Expert"
                                    ? "خبير متقدم"
                                    : "استشاري"}
                        : {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>{t("language") === "en" ? "Applications Report" : "تقرير الطلبات"}</CardTitle>
              <CardDescription>
                {t("language") === "en"
                  ? "Detailed report of all applications in the system"
                  : "تقرير مفصل لجميع الطلبات في النظام"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  {t("language") === "en"
                    ? "Select report parameters and click 'Export Report' to download"
                    : "حدد معلمات التقرير وانقر على 'تصدير التقرير' للتنزيل"}
                </p>
                <Button onClick={handleExportReport} className="bg-gradient-green hover:opacity-90">
                  <Download className="mr-2 h-4 w-4" />
                  {t("language") === "en" ? "Export Applications Report" : "تصدير تقرير الطلبات"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>{t("language") === "en" ? "Users Report" : "تقرير المستخدمين"}</CardTitle>
              <CardDescription>
                {t("language") === "en"
                  ? "Detailed report of all users in the system"
                  : "تقرير مفصل لجميع المستخدمين في النظام"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  {t("language") === "en"
                    ? "Select report parameters and click 'Export Report' to download"
                    : "حدد معلمات التقرير وانقر على 'تصدير التقرير' للتنزيل"}
                </p>
                <Button onClick={handleExportReport} className="bg-gradient-green hover:opacity-90">
                  <Download className="mr-2 h-4 w-4" />
                  {t("language") === "en" ? "Export Users Report" : "تصدير تقرير المستخدمين"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>{t("language") === "en" ? "Certifications Report" : "تقرير الشهادات"}</CardTitle>
              <CardDescription>
                {t("language") === "en"
                  ? "Detailed report of all certifications issued"
                  : "تقرير مفصل لجميع الشهادات الصادرة"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  {t("language") === "en"
                    ? "Select report parameters and click 'Export Report' to download"
                    : "حدد معلمات التقرير وانقر على 'تصدير التقرير' للتنزيل"}
                </p>
                <Button onClick={handleExportReport} className="bg-gradient-green hover:opacity-90">
                  <Download className="mr-2 h-4 w-4" />
                  {t("language") === "en" ? "Export Certifications Report" : "تصدير تقرير الشهادات"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
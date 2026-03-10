"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { DateRangePicker } from "@/components/date-range-picker"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Download,
  FileSpreadsheet,
  FileIcon as FilePdf,
  Filter,
  BarChart3,
  PieChartIcon,
  LineChart,
} from "lucide-react"
import { format, subMonths } from "date-fns"
import { ar, enUS } from "date-fns/locale"

// Mock data for demonstration
const applicationsByStatusData = [
  { name: "New", value: 24, color: "#3b82f6" },
  { name: "Under Review", value: 18, color: "#f59e0b" },
  { name: "Approved", value: 32, color: "#10b981" },
  { name: "Rejected", value: 8, color: "#ef4444" },
  { name: "Registered", value: 28, color: "#8b5cf6" },
]

const applicationsByTypeData = [
  { name: "Initial Registration", value: 45, color: "#3b82f6" },
  { name: "Renewal", value: 35, color: "#f59e0b" },
  { name: "Upgrade", value: 20, color: "#10b981" },
]

const monthlyApplicationsData = [
  { name: "Jan", new: 10, approved: 8, rejected: 2, registered: 7 },
  { name: "Feb", new: 12, approved: 9, rejected: 3, registered: 8 },
  { name: "Mar", new: 15, approved: 12, rejected: 2, registered: 10 },
  { name: "Apr", new: 18, approved: 14, rejected: 3, registered: 12 },
  { name: "May", new: 20, approved: 16, rejected: 4, registered: 15 },
  { name: "Jun", new: 22, approved: 18, rejected: 3, registered: 16 },
]

const specializationData = [
  { name: "Agricultural Engineering", value: 35, color: "#3b82f6" },
  { name: "Irrigation Engineering", value: 25, color: "#f59e0b" },
  { name: "Food Engineering", value: 15, color: "#10b981" },
  { name: "Environmental Engineering", value: 10, color: "#8b5cf6" },
  { name: "Other", value: 15, color: "#6b7280" },
]

export default function RegistrarReportsPage() {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 6),
    to: new Date(),
  })
  const [reportType, setReportType] = useState("all")

  // Check if user is logged in and is a registrar
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

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{language === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  const handleExportPDF = () => {
    // Implement PDF export functionality
    alert(language === "en" ? "Exporting as PDF..." : "جاري التصدير كملف PDF...")
  }

  const handleExportExcel = () => {
    // Implement Excel export functionality
    alert(language === "en" ? "Exporting as Excel..." : "جاري التصدير كملف Excel...")
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === "en" ? "Reports & Statistics" : "التقارير والإحصائيات"}
          </h1>
          <p className="text-muted-foreground">
            {language === "en"
              ? "Track and analyze registration and renewal applications"
              : "تتبع وتحليل طلبات التسجيل والتجديد"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FilePdf className="mr-2 h-4 w-4" />
            {language === "en" ? "Export PDF" : "تصدير PDF"}
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {language === "en" ? "Export Excel" : "تصدير Excel"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{language === "en" ? "Date Range" : "النطاق الزمني"}</CardTitle>
            </CardHeader>
            <CardContent>
              <DateRangePicker
                date={dateRange}
                onDateChange={setDateRange}
                locale={language === "en" ? enUS : ar}
                align="start"
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-1/2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{language === "en" ? "Report Type" : "نوع التقرير"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select defaultValue="all" onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder={language === "en" ? "Select report type" : "اختر نوع التقرير"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "en" ? "All Applications" : "جميع الطلبات"}</SelectItem>
                  <SelectItem value="registration">
                    {language === "en" ? "Registration Applications" : "طلبات التسجيل"}
                  </SelectItem>
                  <SelectItem value="renewal">
                    {language === "en" ? "Renewal Applications" : "طلبات التجديد"}
                  </SelectItem>
                  <SelectItem value="upgrade">
                    {language === "en" ? "Upgrade Applications" : "طلبات الترقية"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{language === "en" ? "Total Applications" : "إجمالي الطلبات"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">110</div>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "+12% from previous period" : "+12% من الفترة السابقة"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{language === "en" ? "Approval Rate" : "معدل الموافقة"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78%</div>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "+5% from previous period" : "+5% من الفترة السابقة"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{language === "en" ? "Processing Time" : "وقت المعالجة"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2 {language === "en" ? "days" : "أيام"}</div>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "-0.8 days from previous period" : "-0.8 يوم من الفترة السابقة"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{language === "en" ? "Pending Review" : "قيد المراجعة"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-sm text-muted-foreground">{language === "en" ? "Oldest: 7 days" : "الأقدم: 7 أيام"}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            {language === "en" ? "Overview" : "نظرة عامة"}
          </TabsTrigger>
          <TabsTrigger value="monthly">
            <LineChart className="mr-2 h-4 w-4" />
            {language === "en" ? "Monthly Trends" : "الاتجاهات الشهرية"}
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <PieChartIcon className="mr-2 h-4 w-4" />
            {language === "en" ? "Distribution" : "التوزيع"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Applications by Status" : "الطلبات حسب الحالة"}</CardTitle>
                <CardDescription>
                  {language === "en"
                    ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
                    : `${format(dateRange.from, "d MMM yyyy", { locale: ar })} - ${format(dateRange.to, "d MMM yyyy", {
                        locale: ar,
                      })}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationsByStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {applicationsByStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Applications by Type" : "الطلبات حسب النوع"}</CardTitle>
                <CardDescription>
                  {language === "en"
                    ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
                    : `${format(dateRange.from, "d MMM yyyy", { locale: ar })} - ${format(dateRange.to, "d MMM yyyy", {
                        locale: ar,
                      })}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationsByTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {applicationsByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Monthly Application Trends" : "اتجاهات الطلبات الشهرية"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Last 6 months application statistics"
                  : "إحصائيات الطلبات في الأشهر الستة الأخيرة"}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyApplicationsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="new" name={language === "en" ? "New" : "جديد"} fill="#3b82f6" />
                  <Bar dataKey="approved" name={language === "en" ? "Approved" : "موافق عليه"} fill="#10b981" />
                  <Bar dataKey="rejected" name={language === "en" ? "Rejected" : "مرفوض"} fill="#ef4444" />
                  <Bar dataKey="registered" name={language === "en" ? "Registered" : "مسجل"} fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{language === "en" ? "Applications by Specialization" : "الطلبات حسب التخصص"}</CardTitle>
                <CardDescription>
                  {language === "en"
                    ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
                    : `${format(dateRange.from, "d MMM yyyy", { locale: ar })} - ${format(dateRange.to, "d MMM yyyy", {
                        locale: ar,
                      })}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={specializationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {specializationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "Processing Time by Application Type" : "وقت المعالجة حسب نوع الطلب"}
                </CardTitle>
                <CardDescription>
                  {language === "en" ? "Average days to process applications" : "متوسط الأيام لمعالجة الطلبات"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: language === "en" ? "Initial Registration" : "التسجيل الأولي",
                        days: 5.2,
                      },
                      {
                        name: language === "en" ? "Renewal" : "التجديد",
                        days: 2.8,
                      },
                      {
                        name: language === "en" ? "Upgrade" : "الترقية",
                        days: 6.5,
                      },
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="days" name={language === "en" ? "Days" : "أيام"} fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "Detailed Reports" : "تقارير مفصلة"}</CardTitle>
          <CardDescription>
            {language === "en"
              ? "Generate custom reports based on specific criteria"
              : "إنشاء تقارير مخصصة بناءً على معايير محددة"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-medium mb-2">{language === "en" ? "Report Type" : "نوع التقرير"}</h3>
              <Select defaultValue="applications">
                <SelectTrigger>
                  <SelectValue placeholder={language === "en" ? "Select report type" : "اختر نوع التقرير"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applications">{language === "en" ? "Applications" : "الطلبات"}</SelectItem>
                  <SelectItem value="engineers">
                    {language === "en" ? "Registered Engineers" : "المهندسين المسجلين"}
                  </SelectItem>
                  <SelectItem value="renewals">{language === "en" ? "Renewals" : "التجديدات"}</SelectItem>
                  <SelectItem value="expirations">{language === "en" ? "Expirations" : "انتهاء الصلاحية"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-2">{language === "en" ? "Status" : "الحالة"}</h3>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder={language === "en" ? "Select status" : "اختر الحالة"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "en" ? "All Statuses" : "جميع الحالات"}</SelectItem>
                  <SelectItem value="new">{language === "en" ? "New" : "جديد"}</SelectItem>
                  <SelectItem value="under-review">{language === "en" ? "Under Review" : "قيد المراجعة"}</SelectItem>
                  <SelectItem value="approved">{language === "en" ? "Approved" : "موافق عليه"}</SelectItem>
                  <SelectItem value="rejected">{language === "en" ? "Rejected" : "مرفوض"}</SelectItem>
                  <SelectItem value="registered">{language === "en" ? "Registered" : "مسجل"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-2">{language === "en" ? "Specialization" : "التخصص"}</h3>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder={language === "en" ? "Select specialization" : "اختر التخصص"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === "en" ? "All Specializations" : "جميع التخصصات"}</SelectItem>
                  <SelectItem value="agricultural">
                    {language === "en" ? "Agricultural Engineering" : "الهندسة الزراعية"}
                  </SelectItem>
                  <SelectItem value="irrigation">
                    {language === "en" ? "Irrigation Engineering" : "هندسة الري"}
                  </SelectItem>
                  <SelectItem value="food">{language === "en" ? "Food Engineering" : "هندسة الأغذية"}</SelectItem>
                  <SelectItem value="environmental">
                    {language === "en" ? "Environmental Engineering" : "الهندسة البيئية"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            {language === "en" ? "More Filters" : "المزيد من الفلاتر"}
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            {language === "en" ? "Generate Report" : "إنشاء التقرير"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import {
  FileSpreadsheet,
  FileIcon as FilePdf,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  Calendar,
  Save,
  Share2,
  Printer,
  Mail,
  AreaChartIcon,
  Sliders,
} from "lucide-react"
import { format, subMonths } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// Mock data for demonstration
const registrationTrendsData = [
  { month: "Jan", newRegistrations: 45, renewals: 32, upgrades: 12 },
  { month: "Feb", newRegistrations: 50, renewals: 35, upgrades: 15 },
  { month: "Mar", newRegistrations: 60, renewals: 40, upgrades: 18 },
  { month: "Apr", newRegistrations: 70, renewals: 45, upgrades: 20 },
  { month: "May", newRegistrations: 65, renewals: 50, upgrades: 22 },
  { month: "Jun", newRegistrations: 80, renewals: 55, upgrades: 25 },
  { month: "Jul", newRegistrations: 90, renewals: 60, upgrades: 28 },
  { month: "Aug", newRegistrations: 85, renewals: 65, upgrades: 30 },
  { month: "Sep", newRegistrations: 95, renewals: 70, upgrades: 32 },
  { month: "Oct", newRegistrations: 100, renewals: 75, upgrades: 35 },
  { month: "Nov", newRegistrations: 110, renewals: 80, upgrades: 38 },
  { month: "Dec", newRegistrations: 120, renewals: 85, upgrades: 40 },
]

const specializationData = [
  { name: "Agricultural Engineering", value: 35, color: "#3b82f6" },
  { name: "Irrigation Engineering", value: 25, color: "#f59e0b" },
  { name: "Food Engineering", value: 15, color: "#10b981" },
  { name: "Environmental Engineering", value: 10, color: "#8b5cf6" },
  { name: "Biotechnology", value: 8, color: "#ec4899" },
  { name: "Other", value: 7, color: "#6b7280" },
]

const registrationStatusData = [
  { name: "Active", value: 65, color: "#10b981" },
  { name: "Expired", value: 15, color: "#f59e0b" },
  { name: "Suspended", value: 5, color: "#ef4444" },
  { name: "Pending Renewal", value: 10, color: "#3b82f6" },
  { name: "Inactive", value: 5, color: "#6b7280" },
]

const geographicDistributionData = [
  { name: "Riyadh", value: 30, color: "#3b82f6" },
  { name: "Jeddah", value: 25, color: "#f59e0b" },
  { name: "Dammam", value: 15, color: "#10b981" },
  { name: "Mecca", value: 10, color: "#8b5cf6" },
  { name: "Medina", value: 8, color: "#ec4899" },
  { name: "Other", value: 12, color: "#6b7280" },
]

const certificationLevelsData = [
  { name: "Entry Level", value: 40, color: "#3b82f6" },
  { name: "Intermediate", value: 30, color: "#f59e0b" },
  { name: "Advanced", value: 20, color: "#10b981" },
  { name: "Expert", value: 10, color: "#8b5cf6" },
]

const yearlyComparisonData = [
  { month: "Jan", current: 45, previous: 35 },
  { month: "Feb", current: 50, previous: 40 },
  { month: "Mar", current: 60, previous: 45 },
  { month: "Apr", current: 70, previous: 55 },
  { month: "May", current: 65, previous: 50 },
  { month: "Jun", current: 80, previous: 60 },
  { month: "Jul", current: 90, previous: 70 },
  { month: "Aug", current: 85, previous: 65 },
  { month: "Sep", current: 95, previous: 75 },
  { month: "Oct", current: 100, previous: 80 },
  { month: "Nov", current: 110, previous: 85 },
  { month: "Dec", current: 120, previous: 90 },
]

const processingTimeData = [
  { name: "Initial Registration", value: 5.2 },
  { name: "Renewal", value: 2.8 },
  { name: "Upgrade", value: 6.5 },
  { name: "Verification", value: 3.2 },
]

const ageDistributionData = [
  { name: "20-30", value: 25 },
  { name: "31-40", value: 35 },
  { name: "41-50", value: 25 },
  { name: "51-60", value: 10 },
  { name: "60+", value: 5 },
]

const genderDistributionData = [
  { name: "Male", value: 75, color: "#3b82f6" },
  { name: "Female", value: 25, color: "#ec4899" },
]

const educationLevelData = [
  { name: "Bachelor", value: 60, color: "#3b82f6" },
  { name: "Master", value: 30, color: "#f59e0b" },
  { name: "PhD", value: 10, color: "#10b981" },
]

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#6b7280"]

export default function AdvancedReportsPage() {
  const { language } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 12),
    to: new Date(),
  })
  const [reportType, setReportType] = useState("registration")
  const [comparisonPeriod, setComparisonPeriod] = useState("year")
  const [selectedMetrics, setSelectedMetrics] = useState(["newRegistrations", "renewals", "upgrades"])
  const [chartType, setChartType] = useState("bar")
  const [showDataLabels, setShowDataLabels] = useState(true)
  const [showLegend, setShowLegend] = useState(true)
  const [reportName, setReportName] = useState("")
  const [scheduleDate, setScheduleDate] = useState(new Date())
  const [scheduleEmail, setScheduleEmail] = useState("")
  const [isScheduling, setIsScheduling] = useState(false)

  // Check if user is logged in and is a registrar
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "registrar" && user.role !== "admin") {
        router.push("/dashboard")
      } else {
        setIsLoading(false)
      }
    }
  }, [user, authLoading, router])

  const handleExportPDF = () => {
    // Implement PDF export functionality
    alert(language === "en" ? "Exporting as PDF..." : "جاري التصدير كملف PDF...")
  }

  const handleExportExcel = () => {
    // Implement Excel export functionality
    alert(language === "en" ? "Exporting as Excel..." : "جاري التصدير كملف Excel...")
  }

  const handleSaveReport = () => {
    // Implement save report functionality
    alert(language === "en" ? "Report saved successfully" : "تم حفظ التقرير بنجاح")
  }

  const handleScheduleReport = () => {
    // Implement schedule report functionality
    alert(
      language === "en"
        ? `Report scheduled for ${format(scheduleDate, "PPP")} and will be sent to ${scheduleEmail}`
        : `تم جدولة التقرير ليوم ${format(scheduleDate, "PPP", { locale: ar })} وسيتم إرساله إلى ${scheduleEmail}`,
    )
    setIsScheduling(false)
  }

  const handlePrintReport = () => {
    // Implement print report functionality
    window.print()
  }

  const handleShareReport = () => {
    // Implement share report functionality
    alert(language === "en" ? "Report sharing link copied to clipboard" : "تم نسخ رابط مشاركة التقرير إلى الحافظة")
  }

  const toggleMetric = (metric) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric))
    } else {
      setSelectedMetrics([...selectedMetrics, metric])
    }
  }

  if (isLoading || authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>{language === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    )
  }

  const t = (key) => (language === "en" ? key : translations[key] || key)

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("Advanced Reports & Analytics")}</h1>
          <p className="text-muted-foreground">
            {t("Comprehensive data analysis and visualization for registration activities")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FilePdf className="mr-2 h-4 w-4" />
            {t("Export PDF")}
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {t("Export Excel")}
          </Button>
          <Button variant="outline" onClick={handlePrintReport}>
            <Printer className="mr-2 h-4 w-4" />
            {t("Print")}
          </Button>
          <Popover open={isScheduling} onOpenChange={setIsScheduling}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                {t("Schedule")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">{t("Schedule Report")}</h4>
                <div className="space-y-2">
                  <Label htmlFor="schedule-date">{t("Date")}</Label>
                  <CalendarComponent
                    mode="single"
                    selected={scheduleDate}
                    onSelect={(date) => date && setScheduleDate(date)}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule-email">{t("Email")}</Label>
                  <Input
                    id="schedule-email"
                    placeholder={t("Enter email address")}
                    value={scheduleEmail}
                    onChange={(e) => setScheduleEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleScheduleReport} className="w-full">
                  {t("Schedule")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("Date Range")}</CardTitle>
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("Report Type")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Select defaultValue="registration" onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder={t("Select report type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="registration">{t("Registration Activity")}</SelectItem>
                <SelectItem value="demographics">{t("Engineer Demographics")}</SelectItem>
                <SelectItem value="performance">{t("System Performance")}</SelectItem>
                <SelectItem value="geographic">{t("Geographic Distribution")}</SelectItem>
                <SelectItem value="custom">{t("Custom Report")}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("Comparison")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Select defaultValue="year" onValueChange={setComparisonPeriod}>
              <SelectTrigger>
                <SelectValue placeholder={t("Select comparison period")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">{t("Year-over-Year")}</SelectItem>
                <SelectItem value="month">{t("Month-over-Month")}</SelectItem>
                <SelectItem value="quarter">{t("Quarter-over-Quarter")}</SelectItem>
                <SelectItem value="custom">{t("Custom Period")}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{t("Total Engineers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,248</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <span>+12.5%</span>
              <span className="text-muted-foreground ml-1">{t("vs last year")}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{t("Active Registrations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">876</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <span>+8.2%</span>
              <span className="text-muted-foreground ml-1">{t("vs last year")}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{t("Renewal Rate")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78.5%</div>
            <div className="flex items-center text-sm text-red-600 mt-1">
              <span>-2.3%</span>
              <span className="text-muted-foreground ml-1">{t("vs last year")}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{t("Avg. Processing Time")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3.2 {t("days")}</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <span>-0.8 {t("days")}</span>
              <span className="text-muted-foreground ml-1">{t("vs last year")}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="mr-2 h-4 w-4" />
              {t("Overview")}
            </TabsTrigger>
            <TabsTrigger value="trends">
              <LineChartIcon className="mr-2 h-4 w-4" />
              {t("Trends")}
            </TabsTrigger>
            <TabsTrigger value="distribution">
              <PieChartIcon className="mr-2 h-4 w-4" />
              {t("Distribution")}
            </TabsTrigger>
            <TabsTrigger value="comparison">
              <AreaChartIcon className="mr-2 h-4 w-4" />
              {t("Comparison")}
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Sliders className="mr-2 h-4 w-4" />
              {t("Custom")}
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select defaultValue="bar" onValueChange={setChartType}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder={t("Chart Type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">{t("Bar Chart")}</SelectItem>
                <SelectItem value="line">{t("Line Chart")}</SelectItem>
                <SelectItem value="pie">{t("Pie Chart")}</SelectItem>
                <SelectItem value="area">{t("Area Chart")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("Registration Activity")}</CardTitle>
                <CardDescription>{t("Registration trends over the past 12 months")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={registrationTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    {showLegend && <Legend />}
                    {selectedMetrics.includes("newRegistrations") && (
                      <Bar
                        dataKey="newRegistrations"
                        name={t("New Registrations")}
                        fill="#3b82f6"
                        label={showDataLabels ? { position: "top" } : false}
                      />
                    )}
                    {selectedMetrics.includes("renewals") && (
                      <Bar
                        dataKey="renewals"
                        name={t("Renewals")}
                        fill="#10b981"
                        label={showDataLabels ? { position: "top" } : false}
                      />
                    )}
                    {selectedMetrics.includes("upgrades") && (
                      <Bar
                        dataKey="upgrades"
                        name={t("Upgrades")}
                        fill="#f59e0b"
                        label={showDataLabels ? { position: "top" } : false}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="new-registrations"
                      checked={selectedMetrics.includes("newRegistrations")}
                      onCheckedChange={() => toggleMetric("newRegistrations")}
                    />
                    <Label htmlFor="new-registrations" className="text-sm">
                      {t("New Registrations")}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="renewals"
                      checked={selectedMetrics.includes("renewals")}
                      onCheckedChange={() => toggleMetric("renewals")}
                    />
                    <Label htmlFor="renewals" className="text-sm">
                      {t("Renewals")}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="upgrades"
                      checked={selectedMetrics.includes("upgrades")}
                      onCheckedChange={() => toggleMetric("upgrades")}
                    />
                    <Label htmlFor="upgrades" className="text-sm">
                      {t("Upgrades")}
                    </Label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowDataLabels(!showDataLabels)}>
                    {showDataLabels ? t("Hide Labels") : t("Show Labels")}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowLegend(!showLegend)}>
                    {showLegend ? t("Hide Legend") : t("Show Legend")}
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Registration Status")}</CardTitle>
                <CardDescription>{t("Current distribution of registration statuses")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={registrationStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${t(name)}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {registrationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, t(name)]} />
                    {showLegend && <Legend formatter={(value) => t(value)} />}
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Specialization Distribution")}</CardTitle>
                <CardDescription>{t("Distribution of engineers by specialization")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={specializationData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${t(name)}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {specializationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, t(name)]} />
                    {showLegend && <Legend formatter={(value) => t(value)} />}
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Geographic Distribution")}</CardTitle>
                <CardDescription>{t("Distribution of engineers by location")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={geographicDistributionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value, name) => [value, t(name)]} />
                    {showLegend && <Legend formatter={(value) => t(value)} />}
                    <Bar dataKey="value" name={t("Engineers")} label={showDataLabels ? { position: "right" } : false}>
                      {geographicDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("Year-over-Year Comparison")}</CardTitle>
                <CardDescription>{t("Comparing current year with previous year")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value, name === "current" ? t("Current Year") : t("Previous Year")]}
                    />
                    {showLegend && (
                      <Legend formatter={(value) => (value === "current" ? t("Current Year") : t("Previous Year"))} />
                    )}
                    <Line
                      type="monotone"
                      dataKey="current"
                      name={t("Current Year")}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="previous"
                      name={t("Previous Year")}
                      stroke="#6b7280"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Processing Time Trends")}</CardTitle>
                <CardDescription>{t("Average processing time by application type")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processingTimeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value, name) => [`${value} ${t("days")}`, t(name)]} />
                    {showLegend && <Legend formatter={(value) => t(value)} />}
                    <Bar
                      dataKey="value"
                      name={t("Processing Time (days)")}
                      fill="#3b82f6"
                      label={
                        showDataLabels ? { position: "right", formatter: (value) => `${value} ${t("days")}` } : false
                      }
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t("Registration Activity Trends")}</CardTitle>
                <CardDescription>{t("Monthly registration activity over time")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={registrationTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value, t(name)]} />
                    {showLegend && <Legend formatter={(value) => t(value)} />}
                    <Area
                      type="monotone"
                      dataKey="newRegistrations"
                      name={t("New Registrations")}
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                    />
                    <Area
                      type="monotone"
                      dataKey="renewals"
                      name={t("Renewals")}
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                    />
                    <Area
                      type="monotone"
                      dataKey="upgrades"
                      name={t("Upgrades")}
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("Age Distribution")}</CardTitle>
                <CardDescription>{t("Distribution of engineers by age group")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value, t("Engineers")]} />
                    {showLegend && <Legend formatter={(value) => t(value)} />}
                    <Bar
                      dataKey="value"
                      name={t("Engineers")}
                      fill="#3b82f6"
                      label={showDataLabels ? { position: "top" } : false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Gender Distribution")}</CardTitle>
                <CardDescription>{t("Distribution of engineers by gender")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${t(name)}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {genderDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, t(name)]} />
                    {showLegend && <Legend formatter={(value) => t(value)} />}
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Education Level")}</CardTitle>
                <CardDescription>{t("Distribution of engineers by education level")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={educationLevelData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${t(name)}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {educationLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, t(name)]} />
                    {showLegend && <Legend formatter={(value) => t(value)} />}
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Certification Levels")}</CardTitle>
                <CardDescription>{t("Distribution of engineers by certification level")}</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={certificationLevelsData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${t(name)}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {certificationLevelsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, t(name)]} />
                    {showLegend && <Legend formatter={(value) => t(value)} />}
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t("Year-over-Year Registration Comparison")}</CardTitle>
                <CardDescription>
                  {t("Comparing registration activity between current and previous year")}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [value, name === "current" ? t("Current Year") : t("Previous Year")]}
                    />
                    {showLegend && (
                      <Legend formatter={(value) => (value === "current" ? t("Current Year") : t("Previous Year"))} />
                    )}
                    <Bar
                      dataKey="current"
                      name={t("Current Year")}
                      fill="#3b82f6"
                      label={showDataLabels ? { position: "top" } : false}
                    />
                    <Bar
                      dataKey="previous"
                      name={t("Previous Year")}
                      fill="#6b7280"
                      label={showDataLabels ? { position: "top" } : false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Registration Growth")}</CardTitle>
                <CardDescription>{t("Year-over-year growth in registrations")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("New Registrations")}</span>
                      <span className="text-sm font-medium text-green-600">+15.8%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("Renewals")}</span>
                      <span className="text-sm font-medium text-green-600">+8.2%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("Upgrades")}</span>
                      <span className="text-sm font-medium text-green-600">+12.5%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("Total Active Engineers")}</span>
                      <span className="text-sm font-medium text-green-600">+10.2%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Performance Metrics")}</CardTitle>
                <CardDescription>{t("Year-over-year change in key performance metrics")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("Processing Time")}</span>
                      <span className="text-sm font-medium text-green-600">-18.5%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("Approval Rate")}</span>
                      <span className="text-sm font-medium text-green-600">+5.2%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("Renewal Rate")}</span>
                      <span className="text-sm font-medium text-red-600">-2.3%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("User Satisfaction")}</span>
                      <span className="text-sm font-medium text-green-600">+7.8%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>{t("Custom Report Builder")}</CardTitle>
              <CardDescription>
                {t("Build and save custom reports with selected metrics and visualizations")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-name">{t("Report Name")}</Label>
                    <Input
                      id="report-name"
                      placeholder={t("Enter report name")}
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("Chart Type")}</Label>
                    <Select defaultValue="bar" onValueChange={setChartType}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select chart type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">{t("Bar Chart")}</SelectItem>
                        <SelectItem value="line">{t("Line Chart")}</SelectItem>
                        <SelectItem value="pie">{t("Pie Chart")}</SelectItem>
                        <SelectItem value="area">{t("Area Chart")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">{t("Select Metrics")}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="metric-new-registrations"
                        checked={selectedMetrics.includes("newRegistrations")}
                        onCheckedChange={() => toggleMetric("newRegistrations")}
                      />
                      <Label htmlFor="metric-new-registrations">{t("New Registrations")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="metric-renewals"
                        checked={selectedMetrics.includes("renewals")}
                        onCheckedChange={() => toggleMetric("renewals")}
                      />
                      <Label htmlFor="metric-renewals">{t("Renewals")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="metric-upgrades"
                        checked={selectedMetrics.includes("upgrades")}
                        onCheckedChange={() => toggleMetric("upgrades")}
                      />
                      <Label htmlFor="metric-upgrades">{t("Upgrades")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="metric-processing-time" />
                      <Label htmlFor="metric-processing-time">{t("Processing Time")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="metric-approval-rate" />
                      <Label htmlFor="metric-approval-rate">{t("Approval Rate")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="metric-renewal-rate" />
                      <Label htmlFor="metric-renewal-rate">{t("Renewal Rate")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="metric-active-engineers" />
                      <Label htmlFor="metric-active-engineers">{t("Active Engineers")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="metric-expired-registrations" />
                      <Label htmlFor="metric-expired-registrations">{t("Expired Registrations")}</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">{t("Filters")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>{t("Specialization")}</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select specialization")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("All Specializations")}</SelectItem>
                          <SelectItem value="agricultural">{t("Agricultural Engineering")}</SelectItem>
                          <SelectItem value="irrigation">{t("Irrigation Engineering")}</SelectItem>
                          <SelectItem value="food">{t("Food Engineering")}</SelectItem>
                          <SelectItem value="environmental">{t("Environmental Engineering")}</SelectItem>
                          <SelectItem value="biotechnology">{t("Biotechnology")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("Registration Status")}</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select status")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("All Statuses")}</SelectItem>
                          <SelectItem value="active">{t("Active")}</SelectItem>
                          <SelectItem value="expired">{t("Expired")}</SelectItem>
                          <SelectItem value="suspended">{t("Suspended")}</SelectItem>
                          <SelectItem value="pending-renewal">{t("Pending Renewal")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("Location")}</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select location")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("All Locations")}</SelectItem>
                          <SelectItem value="riyadh">{t("Riyadh")}</SelectItem>
                          <SelectItem value="jeddah">{t("Jeddah")}</SelectItem>
                          <SelectItem value="dammam">{t("Dammam")}</SelectItem>
                          <SelectItem value="mecca">{t("Mecca")}</SelectItem>
                          <SelectItem value="medina">{t("Medina")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">{t("Preview")}</h3>
                  <div className="h-[300px] border rounded-md p-4 flex items-center justify-center bg-muted/20">
                    {selectedMetrics.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === "bar" && (
                          <BarChart data={registrationTrendsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {selectedMetrics.includes("newRegistrations") && (
                              <Bar dataKey="newRegistrations" name={t("New Registrations")} fill="#3b82f6" />
                            )}
                            {selectedMetrics.includes("renewals") && (
                              <Bar dataKey="renewals" name={t("Renewals")} fill="#10b981" />
                            )}
                            {selectedMetrics.includes("upgrades") && (
                              <Bar dataKey="upgrades" name={t("Upgrades")} fill="#f59e0b" />
                            )}
                          </BarChart>
                        )}
                        {chartType === "line" && (
                          <LineChart data={registrationTrendsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {selectedMetrics.includes("newRegistrations") && (
                              <Line
                                type="monotone"
                                dataKey="newRegistrations"
                                name={t("New Registrations")}
                                stroke="#3b82f6"
                                strokeWidth={2}
                              />
                            )}
                            {selectedMetrics.includes("renewals") && (
                              <Line
                                type="monotone"
                                dataKey="renewals"
                                name={t("Renewals")}
                                stroke="#10b981"
                                strokeWidth={2}
                              />
                            )}
                            {selectedMetrics.includes("upgrades") && (
                              <Line
                                type="monotone"
                                dataKey="upgrades"
                                name={t("Upgrades")}
                                stroke="#f59e0b"
                                strokeWidth={2}
                              />
                            )}
                          </LineChart>
                        )}
                        {chartType === "pie" && (
                          <PieChart>
                            <Pie
                              data={specializationData}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${t(name)}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {specializationData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        )}
                        {chartType === "area" && (
                          <AreaChart data={registrationTrendsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {selectedMetrics.includes("newRegistrations") && (
                              <Area
                                type="monotone"
                                dataKey="newRegistrations"
                                name={t("New Registrations")}
                                stroke="#3b82f6"
                                fill="#3b82f6"
                              />
                            )}
                            {selectedMetrics.includes("renewals") && (
                              <Area
                                type="monotone"
                                dataKey="renewals"
                                name={t("Renewals")}
                                stroke="#10b981"
                                fill="#10b981"
                              />
                            )}
                            {selectedMetrics.includes("upgrades") && (
                              <Area
                                type="monotone"
                                dataKey="upgrades"
                                name={t("Upgrades")}
                                stroke="#f59e0b"
                                fill="#f59e0b"
                              />
                            )}
                          </AreaChart>
                        )}
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <p>{t("Select metrics to preview chart")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSaveReport}>
                  <Save className="mr-2 h-4 w-4" />
                  {t("Save Report")}
                </Button>
                <Button variant="outline" onClick={handleShareReport}>
                  <Share2 className="mr-2 h-4 w-4" />
                  {t("Share")}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportExcel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  {t("Export Excel")}
                </Button>
                <Button onClick={handleExportPDF}>
                  <FilePdf className="mr-2 h-4 w-4" />
                  {t("Export PDF")}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>{t("Scheduled Reports")}</CardTitle>
          <CardDescription>{t("Manage your scheduled reports and notifications")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium">{t("Monthly Registration Summary")}</h4>
                    <p className="text-sm text-muted-foreground">{t("Sent on the 1st of every month")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      {t("Send Now")}
                    </Button>
                    <Button variant="outline" size="sm">
                      {t("Edit")}
                    </Button>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium">{t("Quarterly Performance Report")}</h4>
                    <p className="text-sm text-muted-foreground">{t("Sent on the 1st day of each quarter")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      {t("Send Now")}
                    </Button>
                    <Button variant="outline" size="sm">
                      {t("Edit")}
                    </Button>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium">{t("Weekly Registration Activity")}</h4>
                    <p className="text-sm text-muted-foreground">{t("Sent every Monday at 9:00 AM")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      {t("Send Now")}
                    </Button>
                    <Button variant="outline" size="sm">
                      {t("Edit")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            {t("Schedule New Report")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Arabic translations
const translations = {
  "Advanced Reports & Analytics": "التقارير والتحليلات المتقدمة",
  "Comprehensive data analysis and visualization for registration activities": "تحليل بيانات شامل وتصور لأنشطة التسجيل",
  "Export PDF": "تصدير PDF",
  "Export Excel": "تصدير Excel",
  Print: "طباعة",
  Schedule: "جدولة",
  "Schedule Report": "جدولة التقرير",
  Date: "التاريخ",
  Email: "البريد الإلكتروني",
  "Enter email address": "أدخل عنوان البريد الإلكتروني",
  "Date Range": "النطاق الزمني",
  "Report Type": "نوع التقرير",
  "Select report type": "اختر نوع التقرير",
  "Registration Activity": "نشاط التسجيل",
  "Engineer Demographics": "التركيبة السكانية للمهندسين",
  "System Performance": "أداء النظام",
  "Geographic Distribution": "التوزيع الجغرافي",
  "Custom Report": "تقرير مخصص",
  Comparison: "المقارنة",
  "Select comparison period": "اختر فترة المقارنة",
  "Year-over-Year": "سنة بعد سنة",
  "Month-over-Month": "شهر بعد شهر",
  "Quarter-over-Quarter": "ربع سنة بعد ربع سنة",
  "Custom Period": "فترة مخصصة",
  "Total Engineers": "إجمالي المهندسين",
  "Active Registrations": "التسجيلات النشطة",
  "Renewal Rate": "معدل التجديد",
  "Avg. Processing Time": "متوسط وقت المعالجة",
  days: "أيام",
  "vs last year": "مقارنة بالعام الماضي",
  Overview: "نظرة عامة",
  Trends: "الاتجاهات",
  Distribution: "التوزيع",
  "Chart Type": "نوع الرسم البياني",
  "Bar Chart": "رسم بياني شريطي",
  "Line Chart": "رسم بياني خطي",
  "Pie Chart": "رسم بياني دائري",
  "Area Chart": "رسم بياني مساحي",
  "Registration trends over the past 12 months": "اتجاهات التسجيل خلال الـ 12 شهرًا الماضية",
  "New Registrations": "تسجيلات جديدة",
  Renewals: "تجديدات",
  Upgrades: "ترقيات",
  "Registration Status": "حالة التسجيل",
  "Current distribution of registration statuses": "التوزيع الحالي لحالات التسجيل",
  Active: "نشط",
  Expired: "منتهي",
  Suspended: "معلق",
  "Pending Renewal": "قيد التجديد",
  Inactive: "غير نشط",
  "Specialization Distribution": "توزيع التخصصات",
  "Distribution of engineers by specialization": "توزيع المهندسين حسب التخصص",
  "Agricultural Engineering": "الهندسة الزراعية",
  "Irrigation Engineering": "هندسة الري",
  "Food Engineering": "هندسة الأغذية",
  "Environmental Engineering": "الهندسة البيئية",
  Biotechnology: "التقنية الحيوية",
  Other: "أخرى",
  "Geographic Distribution": "التوزيع الجغرافي",
  "Distribution of engineers by location": "توزيع المهندسين حسب الموقع",
  Engineers: "المهندسين",
  "Year-over-Year Comparison": "مقارنة سنة بعد سنة",
  "Comparing current year with previous year": "مقارنة العام الحالي بالعام السابق",
  "Current Year": "العام الحالي",
  "Previous Year": "العام السابق",
  "Processing Time Trends": "اتجاهات وقت المعالجة",
  "Average processing time by application type": "متوسط وقت المعالجة حسب نوع الطلب",
  "Processing Time (days)": "وقت المعالجة (أيام)",
  "Registration Activity Trends": "اتجاهات نشاط التسجيل",
  "Monthly registration activity over time": "نشاط التسجيل الشهري على مر الزمن",
  "Age Distribution": "توزيع الأعمار",
  "Distribution of engineers by age group": "توزيع المهندسين حسب الفئة العمرية",
  "Gender Distribution": "توزيع الجنس",
  "Distribution of engineers by gender": "توزيع المهندسين حسب الجنس",
  Male: "ذكر",
  Female: "أنثى",
  "Education Level": "المستوى التعليمي",
  "Distribution of engineers by education level": "توزيع المهندسين حسب المستوى التعليمي",
  Bachelor: "بكالوريوس",
  Master: "ماجستير",
  PhD: "دكتوراه",
  "Certification Levels": "مستويات الشهادات",
  "Distribution of engineers by certification level": "توزيع المهندسين حسب مستوى الشهادة",
  "Entry Level": "مستوى المبتدئ",
  Intermediate: "متوسط",
  Advanced: "متقدم",
  Expert: "خبير",
  "Year-over-Year Registration Comparison": "مقارنة التسجيل سنة بعد سنة",
  "Comparing registration activity between current and previous year":
    "مقارنة نشاط التسجيل بين العام الحالي والعام السابق",
  "Registration Growth": "نمو التسجيل",
  "Year-over-year growth in registrations": "النمو السنوي في التسجيلات",
  "Total Active Engineers": "إجمالي المهندسين النشطين",
  "Performance Metrics": "مقاييس الأداء",
  "Year-over-year change in key performance metrics": "التغيير السنوي في مقاييس الأداء الرئيسية",
  "Processing Time": "وقت المعالجة",
  "Approval Rate": "معدل الموافقة",
  "User Satisfaction": "رضا المستخدم",
  "Custom Report Builder": "منشئ التقارير المخصصة",
  "Build and save custom reports with selected metrics and visualizations":
    "إنشاء وحفظ تقارير مخصصة مع المقاييس والتصورات المحددة",
  "Report Name": "اسم التقرير",
  "Enter report name": "أدخل اسم التقرير",
  "Select Metrics": "اختر المقاييس",
  "Expired Registrations": "التسجيلات المنتهية",
  Filters: "المرشحات",
  "All Specializations": "جميع التخصصات",
  "All Statuses": "جميع الحالات",
  Location: "الموقع",
  "Select location": "اختر الموقع",
  "All Locations": "جميع المواقع",
  Riyadh: "الرياض",
  Jeddah: "جدة",
  Dammam: "الدمام",
  Mecca: "مكة",
  Medina: "المدينة",
  Preview: "معاينة",
  "Select metrics to preview chart": "اختر المقاييس لمعاينة الرسم البياني",
  "Save Report": "حفظ التقرير",
  Share: "مشاركة",
  "Scheduled Reports": "التقارير المجدولة",
  "Manage your scheduled reports and notifications": "إدارة التقارير والإشعارات المجدولة",
  "Monthly Registration Summary": "ملخص التسجيل الشهري",
  "Sent on the 1st of every month": "يرسل في الأول من كل شهر",
  "Send Now": "إرسال الآن",
  Edit: "تعديل",
  "Quarterly Performance Report": "تقرير الأداء الربع سنوي",
  "Sent on the 1st day of each quarter": "يرسل في اليوم الأول من كل ربع سنة",
  "Weekly Registration Activity": "نشاط التسجيل الأسبوعي",
  "Sent every Monday at 9:00 AM": "يرسل كل يوم اثنين الساعة 9:00 صباحًا",
  "Schedule New Report": "جدولة تقرير جديد",
  "Hide Labels": "إخفاء التسميات",
  "Show Labels": "إظهار التسميات",
  "Hide Legend": "إخفاء المفتاح",
  "Show Legend": "إظهار المفتاح",
}

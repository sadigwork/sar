"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Server,
  Database,
  Shield,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Lock,
  Key,
  FileText,
  Settings,
  Monitor,
  Zap,
} from "lucide-react"

export default function SystemAdminDashboardPage() {
  const { t } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock system metrics
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 78,
    networkTraffic: 34,
    activeConnections: 1247,
    uptime: "15 days, 8 hours",
    lastBackup: "2 hours ago",
    securityAlerts: 3,
    systemErrors: 12,
    databaseSize: "2.4 GB",
  })

  // Check if user is logged in and is a system admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "system-admin") {
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t("language") === "en" ? "System Administration Dashboard" : "لوحة تحكم مدير النظام"}
          </h1>
          <p className="text-muted-foreground">
            {t("language") === "en"
              ? "Monitor system health, security, and infrastructure"
              : "مراقبة صحة النظام والأمان والبنية التحتية"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/system-admin/alerts")}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            {systemMetrics.securityAlerts} {t("language") === "en" ? "Alerts" : "تنبيهات"}
          </Button>
          <Button
            onClick={() => router.push("/system-admin/monitoring")}
            className="bg-gradient-green hover:opacity-90"
          >
            <Monitor className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Live Monitoring" : "المراقبة المباشرة"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">{t("language") === "en" ? "Overview" : "نظرة عامة"}</TabsTrigger>
          <TabsTrigger value="performance">{t("language") === "en" ? "Performance" : "الأداء"}</TabsTrigger>
          <TabsTrigger value="security">{t("language") === "en" ? "Security" : "الأمان"}</TabsTrigger>
          <TabsTrigger value="maintenance">{t("language") === "en" ? "Maintenance" : "الصيانة"}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Status Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  {t("language") === "en" ? "System Status" : "حالة النظام"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">Online</p>
                    <p className="text-sm text-muted-foreground">Uptime: {systemMetrics.uptime}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {t("language") === "en" ? "Database" : "قاعدة البيانات"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{systemMetrics.databaseSize}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("language") === "en" ? "Total Size" : "الحجم الإجمالي"}
                    </p>
                  </div>
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t("language") === "en" ? "Active Users" : "المستخدمون النشطون"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{systemMetrics.activeConnections}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("language") === "en" ? "Connections" : "اتصالات"}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t("language") === "en" ? "Security" : "الأمان"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{systemMetrics.securityAlerts}</p>
                    <p className="text-sm text-muted-foreground">{t("language") === "en" ? "Alerts" : "تنبيهات"}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>{t("language") === "en" ? "System Management" : "إدارة النظام"}</CardTitle>
                <CardDescription>
                  {t("language") === "en" ? "Core system administration tasks" : "مهام إدارة النظام الأساسية"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/system-admin/users")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {t("language") === "en" ? "User Management" : "إدارة المستخدمين"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/system-admin/roles")}
                >
                  <Key className="mr-2 h-4 w-4" />
                  {t("language") === "en" ? "Roles & Permissions" : "الأدوار والصلاحيات"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/system-admin/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {t("language") === "en" ? "System Settings" : "إعدادات النظام"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>{t("language") === "en" ? "Security & Monitoring" : "الأمان والمراقبة"}</CardTitle>
                <CardDescription>
                  {t("language") === "en" ? "Security and system monitoring tools" : "أدوات الأمان ومراقبة النظام"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/system-admin/security")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  {t("language") === "en" ? "Security Center" : "مركز الأمان"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/system-admin/logs")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {t("language") === "en" ? "System Logs" : "سجلات النظام"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/system-admin/monitoring")}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  {t("language") === "en" ? "Performance Monitor" : "مراقب الأداء"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>{t("language") === "en" ? "Backup & Maintenance" : "النسخ الاحتياطي والصيانة"}</CardTitle>
                <CardDescription>
                  {t("language") === "en" ? "Data backup and system maintenance" : "النسخ الاحتياطي وصيانة النظام"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/system-admin/backup")}
                >
                  <HardDrive className="mr-2 h-4 w-4" />
                  {t("language") === "en" ? "Backup Management" : "إدارة النسخ الاحتياطي"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/system-admin/database")}
                >
                  <Database className="mr-2 h-4 w-4" />
                  {t("language") === "en" ? "Database Admin" : "إدارة قاعدة البيانات"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/system-admin/maintenance")}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {t("language") === "en" ? "System Maintenance" : "صيانة النظام"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  {t("language") === "en" ? "CPU Usage" : "استخدام المعالج"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t("language") === "en" ? "Current Usage" : "الاستخدام الحالي"}</span>
                    <span className="font-bold">{systemMetrics.cpuUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.cpuUsage} className="h-3" />
                  <div className="text-sm text-muted-foreground">
                    {systemMetrics.cpuUsage < 70 ? (
                      <span className="text-green-600">{t("language") === "en" ? "Normal" : "طبيعي"}</span>
                    ) : (
                      <span className="text-yellow-600">{t("language") === "en" ? "High" : "مرتفع"}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MemoryStick className="h-5 w-5" />
                  {t("language") === "en" ? "Memory Usage" : "استخدام الذاكرة"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t("language") === "en" ? "Current Usage" : "الاستخدام الحالي"}</span>
                    <span className="font-bold">{systemMetrics.memoryUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.memoryUsage} className="h-3" />
                  <div className="text-sm text-muted-foreground">
                    <span className="text-green-600">{t("language") === "en" ? "Normal" : "طبيعي"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  {t("language") === "en" ? "Disk Usage" : "استخدام القرص"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t("language") === "en" ? "Current Usage" : "الاستخدام الحالي"}</span>
                    <span className="font-bold">{systemMetrics.diskUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.diskUsage} className="h-3" />
                  <div className="text-sm text-muted-foreground">
                    <span className="text-yellow-600">{t("language") === "en" ? "Warning" : "تحذير"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  {t("language") === "en" ? "Network Traffic" : "حركة الشبكة"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t("language") === "en" ? "Current Load" : "الحمولة الحالية"}</span>
                    <span className="font-bold">{systemMetrics.networkTraffic}%</span>
                  </div>
                  <Progress value={systemMetrics.networkTraffic} className="h-3" />
                  <div className="text-sm text-muted-foreground">
                    <span className="text-green-600">{t("language") === "en" ? "Low" : "منخفض"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  {t("language") === "en" ? "Security Status" : "حالة الأمان"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>{t("language") === "en" ? "SSL Certificate" : "شهادة SSL"}</span>
                    <Badge className="bg-green-100 text-green-800">{t("language") === "en" ? "Valid" : "صالحة"}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t("language") === "en" ? "Firewall" : "جدار الحماية"}</span>
                    <Badge className="bg-green-100 text-green-800">{t("language") === "en" ? "Active" : "نشط"}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t("language") === "en" ? "Intrusion Detection" : "كشف التسلل"}</span>
                    <Badge className="bg-green-100 text-green-800">{t("language") === "en" ? "Enabled" : "مفعل"}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t("language") === "en" ? "Failed Login Attempts" : "محاولات دخول فاشلة"}</span>
                    <Badge className="bg-yellow-100 text-yellow-800">24</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {t("language") === "en" ? "Recent Security Events" : "الأحداث الأمنية الأخيرة"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {t("language") === "en" ? "Multiple failed login attempts" : "محاولات دخول فاشلة متعددة"}
                      </p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {t("language") === "en" ? "SSL certificate renewed" : "تم تجديد شهادة SSL"}
                      </p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {t("language") === "en" ? "Security scan completed" : "تم إكمال فحص الأمان"}
                      </p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          {/* Maintenance Tasks */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  {t("language") === "en" ? "Backup Status" : "حالة النسخ الاحتياطي"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>{t("language") === "en" ? "Last Backup" : "آخر نسخة احتياطية"}</span>
                    <span className="font-medium">{systemMetrics.lastBackup}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t("language") === "en" ? "Next Scheduled" : "المجدولة التالية"}</span>
                    <span className="font-medium">{t("language") === "en" ? "In 22 hours" : "خلال 22 ساعة"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t("language") === "en" ? "Backup Size" : "حجم النسخة"}</span>
                    <span className="font-medium">1.8 GB</span>
                  </div>
                  <Button className="w-full" onClick={() => router.push("/system-admin/backup")}>
                    {t("language") === "en" ? "Manage Backups" : "إدارة النسخ الاحتياطي"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {t("language") === "en" ? "Database Maintenance" : "صيانة قاعدة البيانات"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>{t("language") === "en" ? "Last Optimization" : "آخر تحسين"}</span>
                    <span className="font-medium">{t("language") === "en" ? "3 days ago" : "منذ 3 أيام"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t("language") === "en" ? "Index Health" : "صحة الفهارس"}</span>
                    <Badge className="bg-green-100 text-green-800">{t("language") === "en" ? "Good" : "جيدة"}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t("language") === "en" ? "Query Performance" : "أداء الاستعلامات"}</span>
                    <Badge className="bg-green-100 text-green-800">{t("language") === "en" ? "Optimal" : "مثلى"}</Badge>
                  </div>
                  <Button className="w-full" onClick={() => router.push("/system-admin/database")}>
                    {t("language") === "en" ? "Database Tools" : "أدوات قاعدة البيانات"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Shield,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Activity,
  Globe,
  Server,
  Database,
} from "lucide-react"

export default function SystemAdminSecurityPage() {
  const { t } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock security data
  const [securityMetrics, setSecurityMetrics] = useState({
    threatLevel: "Low",
    activeThreats: 2,
    blockedAttacks: 156,
    sslStatus: "Valid",
    firewallStatus: "Active",
    lastSecurityScan: "2 hours ago",
    vulnerabilities: 0,
    securityScore: 92,
  })

  const [securityEvents, setSecurityEvents] = useState([
    {
      id: "1",
      type: "Failed Login",
      severity: "Medium",
      source: "192.168.1.100",
      target: "admin@system.com",
      timestamp: "2024-01-15 10:30:15",
      status: "Blocked",
    },
    {
      id: "2",
      type: "Suspicious Activity",
      severity: "High",
      source: "203.0.113.45",
      target: "API Endpoint",
      timestamp: "2024-01-15 09:45:22",
      status: "Investigating",
    },
    {
      id: "3",
      type: "Brute Force Attack",
      severity: "High",
      source: "198.51.100.78",
      target: "Login System",
      timestamp: "2024-01-15 08:15:33",
      status: "Blocked",
    },
  ])

  const [auditLogs, setAuditLogs] = useState([
    {
      id: "1",
      user: "أحمد محمد",
      action: "User Role Modified",
      resource: "User: sara.ali@system.com",
      timestamp: "2024-01-15 11:20:10",
      ipAddress: "192.168.1.50",
    },
    {
      id: "2",
      user: "سارة علي",
      action: "System Settings Changed",
      resource: "Email Configuration",
      timestamp: "2024-01-15 10:15:45",
      ipAddress: "192.168.1.75",
    },
    {
      id: "3",
      user: "محمد حسن",
      action: "Database Access",
      resource: "Applications Table",
      timestamp: "2024-01-15 09:30:22",
      ipAddress: "192.168.1.80",
    },
  ])

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "Investigating":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
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
          <h1 className="text-3xl font-bold mb-2">{t("language") === "en" ? "Security Center" : "مركز الأمان"}</h1>
          <p className="text-muted-foreground">
            {t("language") === "en"
              ? "Monitor system security, threats, and audit logs"
              : "مراقبة أمان النظام والتهديدات وسجلات التدقيق"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/system-admin/security/scan")}>
            <Shield className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Run Security Scan" : "تشغيل فحص الأمان"}
          </Button>
          <Button
            onClick={() => router.push("/system-admin/security/settings")}
            className="bg-gradient-green hover:opacity-90"
          >
            <Lock className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Security Settings" : "إعدادات الأمان"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Shield className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Overview" : "نظرة عامة"}
          </TabsTrigger>
          <TabsTrigger value="threats">
            <AlertTriangle className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Threats" : "التهديدات"}
          </TabsTrigger>
          <TabsTrigger value="audit">
            <FileText className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Audit Logs" : "سجلات التدقيق"}
          </TabsTrigger>
          <TabsTrigger value="certificates">
            <Key className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Certificates" : "الشهادات"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Security Overview Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t("language") === "en" ? "Security Score" : "نقاط الأمان"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-green-600">{securityMetrics.securityScore}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <Progress value={securityMetrics.securityScore} className="h-2" />
                  <p className="text-sm text-green-600">{t("language") === "en" ? "Excellent" : "ممتاز"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {t("language") === "en" ? "Active Threats" : "التهديدات النشطة"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-yellow-600">{securityMetrics.activeThreats}</span>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("language") === "en" ? "Under investigation" : "قيد التحقيق"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  {t("language") === "en" ? "Blocked Attacks" : "الهجمات المحجوبة"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-red-600">{securityMetrics.blockedAttacks}</span>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("language") === "en" ? "Last 24 hours" : "آخر 24 ساعة"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  {t("language") === "en" ? "System Status" : "حالة النظام"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t("language") === "en" ? "Firewall" : "جدار الحماية"}</span>
                    <Badge className="bg-green-100 text-green-800">{t("language") === "en" ? "Active" : "نشط"}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL</span>
                    <Badge className="bg-green-100 text-green-800">{t("language") === "en" ? "Valid" : "صالح"}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Components Status */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  {t("language") === "en" ? "Security Components" : "مكونات الأمان"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{t("language") === "en" ? "Web Application Firewall" : "جدار حماية التطبيقات"}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {t("language") === "en" ? "Active" : "نشط"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>{t("language") === "en" ? "Database Encryption" : "تشفير قاعدة البيانات"}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {t("language") === "en" ? "Enabled" : "مفعل"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{t("language") === "en" ? "Intrusion Detection" : "كشف التسلل"}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {t("language") === "en" ? "Monitoring" : "مراقب"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span>{t("language") === "en" ? "Real-time Monitoring" : "المراقبة المباشرة"}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {t("language") === "en" ? "Active" : "نشط"}
                    </Badge>
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
                  {securityEvents.slice(0, 4).map((event) => (
                    <div key={event.id} className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          event.severity === "High"
                            ? "bg-red-500"
                            : event.severity === "Medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.source} → {event.target}
                        </p>
                      </div>
                      <Badge className={getStatusColor(event.status)} variant="outline">
                        {event.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("language") === "en" ? "Security Events" : "الأحداث الأمنية"}</CardTitle>
              <CardDescription>
                {t("language") === "en"
                  ? "Monitor and investigate security threats and incidents"
                  : "مراقبة والتحقيق في التهديدات والحوادث الأمنية"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("language") === "en" ? "Type" : "النوع"}</TableHead>
                    <TableHead>{t("language") === "en" ? "Severity" : "الخطورة"}</TableHead>
                    <TableHead>{t("language") === "en" ? "Source" : "المصدر"}</TableHead>
                    <TableHead>{t("language") === "en" ? "Target" : "الهدف"}</TableHead>
                    <TableHead>{t("language") === "en" ? "Time" : "الوقت"}</TableHead>
                    <TableHead>{t("language") === "en" ? "Status" : "الحالة"}</TableHead>
                    <TableHead className="text-right">{t("language") === "en" ? "Actions" : "الإجراءات"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.type}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{event.source}</TableCell>
                      <TableCell>{event.target}</TableCell>
                      <TableCell className="text-sm">{event.timestamp}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("language") === "en" ? "Audit Logs" : "سجلات التدقيق"}</CardTitle>
              <CardDescription>
                {t("language") === "en"
                  ? "Track all administrative actions and system changes"
                  : "تتبع جميع الإجراءات الإدارية وتغييرات النظام"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("language") === "en" ? "User" : "المستخدم"}</TableHead>
                    <TableHead>{t("language") === "en" ? "Action" : "الإجراء"}</TableHead>
                    <TableHead>{t("language") === "en" ? "Resource" : "المورد"}</TableHead>
                    <TableHead>{t("language") === "en" ? "IP Address" : "عنوان IP"}</TableHead>
                    <TableHead>{t("language") === "en" ? "Timestamp" : "الوقت"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.resource}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell className="text-sm">{log.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("language") === "en" ? "SSL Certificates" : "شهادات SSL"}</CardTitle>
              <CardDescription>
                {t("language") === "en"
                  ? "Manage SSL certificates and security credentials"
                  : "إدارة شهادات SSL وبيانات الاعتماد الأمنية"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">system.agrieng.com</p>
                      <p className="text-sm text-muted-foreground">
                        {t("language") === "en" ? "Expires: March 15, 2025" : "تنتهي: 15 مارس 2025"}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{t("language") === "en" ? "Valid" : "صالحة"}</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">api.agrieng.com</p>
                      <p className="text-sm text-muted-foreground">
                        {t("language") === "en" ? "Expires: February 28, 2024" : "تنتهي: 28 فبراير 2024"}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {t("language") === "en" ? "Expiring Soon" : "تنتهي قريباً"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

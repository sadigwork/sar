"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  HardDrive,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Play,
  RotateCcw,
  Database,
  FileText,
  Settings,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SystemAdminBackupPage() {
  const { t } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  // Mock backup data
  const [backupStatus, setBackupStatus] = useState({
    lastBackup: "2024-01-15 02:00:00",
    nextScheduled: "2024-01-16 02:00:00",
    totalBackups: 45,
    totalSize: "12.4 GB",
    successRate: 98.5,
    isRunning: false,
  })

  const [backupHistory, setBackupHistory] = useState([
    {
      id: "1",
      type: "Full Backup",
      size: "2.1 GB",
      duration: "45 minutes",
      status: "Completed",
      timestamp: "2024-01-15 02:00:00",
      location: "/backups/full/2024-01-15.tar.gz",
    },
    {
      id: "2",
      type: "Incremental",
      size: "156 MB",
      duration: "8 minutes",
      status: "Completed",
      timestamp: "2024-01-14 02:00:00",
      location: "/backups/incremental/2024-01-14.tar.gz",
    },
    {
      id: "3",
      type: "Database Only",
      size: "890 MB",
      duration: "12 minutes",
      status: "Failed",
      timestamp: "2024-01-13 02:00:00",
      location: null,
    },
    {
      id: "4",
      type: "Full Backup",
      size: "2.0 GB",
      duration: "42 minutes",
      status: "Completed",
      timestamp: "2024-01-12 02:00:00",
      location: "/backups/full/2024-01-12.tar.gz",
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

  const handleBackupAction = (action: string, backupId?: string) => {
    switch (action) {
      case "start":
        setBackupStatus((prev) => ({ ...prev, isRunning: true }))
        toast({
          title: t("language") === "en" ? "Backup Started" : "بدأ النسخ الاحتياطي",
          description:
            t("language") === "en" ? "Manual backup process initiated" : "تم بدء عملية النسخ الاحتياطي اليدوية",
        })
        break
      case "download":
        toast({
          title: t("language") === "en" ? "Download Started" : "بدأ التحميل",
          description: t("language") === "en" ? "Backup file download initiated" : "تم بدء تحميل ملف النسخة الاحتياطية",
        })
        break
      case "restore":
        toast({
          title: t("language") === "en" ? "Restore Initiated" : "بدأت الاستعادة",
          description: t("language") === "en" ? "System restore process started" : "تم بدء عملية استعادة النظام",
        })
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "Running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
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
          <h1 className="text-3xl font-bold mb-2">
            {t("language") === "en" ? "Backup Management" : "إدارة النسخ الاحتياطي"}
          </h1>
          <p className="text-muted-foreground">
            {t("language") === "en"
              ? "Manage system backups, schedules, and restore operations"
              : "إدارة النسخ الاحتياطي للنظام والجداول وعمليات الاستعادة"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/system-admin/backup/schedule")}>
            <Calendar className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Schedule" : "الجدولة"}
          </Button>
          <Button
            onClick={() => handleBackupAction("start")}
            className="bg-gradient-green hover:opacity-90"
            disabled={backupStatus.isRunning}
          >
            <Play className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Start Backup" : "بدء النسخ الاحتياطي"}
          </Button>
        </div>
      </div>

      {/* Backup Status Overview */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              {t("language") === "en" ? "Last Backup" : "آخر نسخة احتياطية"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{new Date(backupStatus.lastBackup).toLocaleDateString()}</p>
              <p className="text-sm text-muted-foreground">{new Date(backupStatus.lastBackup).toLocaleTimeString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t("language") === "en" ? "Next Scheduled" : "المجدولة التالية"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{new Date(backupStatus.nextScheduled).toLocaleDateString()}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(backupStatus.nextScheduled).toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {t("language") === "en" ? "Total Size" : "الحجم الإجمالي"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{backupStatus.totalSize}</p>
              <p className="text-sm text-muted-foreground">
                {backupStatus.totalBackups} {t("language") === "en" ? "backups" : "نسخة احتياطية"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              {t("language") === "en" ? "Success Rate" : "معدل النجاح"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-600">{backupStatus.successRate}%</p>
              <Progress value={backupStatus.successRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Backup Status */}
      {backupStatus.isRunning && (
        <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Play className="h-5 w-5" />
              {t("language") === "en" ? "Backup in Progress" : "النسخ الاحتياطي قيد التشغيل"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{t("language") === "en" ? "Database backup..." : "نسخ قاعدة البيانات..."}</span>
                <span className="text-sm text-muted-foreground">65%</span>
              </div>
              <Progress value={65} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {t("language") === "en" ? "Estimated time remaining: 15 minutes" : "الوقت المتبقي المقدر: 15 دقيقة"}
                </span>
                <span>1.2 GB / 1.8 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("language") === "en" ? "Backup History" : "تاريخ النسخ الاحتياطي"}</CardTitle>
              <CardDescription>
                {t("language") === "en"
                  ? "View and manage previous backup operations"
                  : "عرض وإدارة عمليات النسخ الاحتياطي السابقة"}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => router.push("/system-admin/backup/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              {t("language") === "en" ? "Settings" : "الإعدادات"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("language") === "en" ? "Type" : "النوع"}</TableHead>
                <TableHead>{t("language") === "en" ? "Size" : "الحجم"}</TableHead>
                <TableHead>{t("language") === "en" ? "Duration" : "المدة"}</TableHead>
                <TableHead>{t("language") === "en" ? "Status" : "الحالة"}</TableHead>
                <TableHead>{t("language") === "en" ? "Date" : "التاريخ"}</TableHead>
                <TableHead className="text-right">{t("language") === "en" ? "Actions" : "الإجراءات"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backupHistory.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-medium">{backup.type}</TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell>{backup.duration}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(backup.status)}>
                      {backup.status === "Completed" ? (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                      ) : backup.status === "Failed" ? (
                        <XCircle className="mr-1 h-3 w-3" />
                      ) : null}
                      {backup.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{backup.timestamp}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {backup.status === "Completed" && (
                          <>
                            <DropdownMenuItem onClick={() => handleBackupAction("download", backup.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              {t("language") === "en" ? "Download" : "تحميل"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBackupAction("restore", backup.id)}>
                              <RotateCcw className="mr-2 h-4 w-4" />
                              {t("language") === "en" ? "Restore" : "استعادة"}
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          {t("language") === "en" ? "View Log" : "عرض السجل"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

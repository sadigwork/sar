"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  ChevronLeft,
  Filter,
  Search,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export default function ReviewerNotificationsPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock notifications data
  const mockNotifications = [
    {
      id: "notif1",
      type: "application",
      title: language === "en" ? "New Application Submitted" : "تم تقديم طلب جديد",
      message:
        language === "en"
          ? "Ahmed Mohamed has submitted a new application for Expert level certification"
          : "قدم أحمد محمد طلبًا جديدًا للحصول على شهادة المستوى الخبير",
      date: "2023-11-20T14:45:00Z",
      isRead: false,
      relatedId: "app1",
      priority: "high",
    },
    {
      id: "notif2",
      type: "document",
      title: language === "en" ? "Document Uploaded" : "تم تحميل مستند",
      message:
        language === "en"
          ? "Sara Ali has uploaded a new document for verification"
          : "قامت سارة علي بتحميل مستند جديد للتحقق",
      date: "2023-11-18T09:30:00Z",
      isRead: true,
      relatedId: "doc1",
      priority: "medium",
    },
    {
      id: "notif3",
      type: "reminder",
      title: language === "en" ? "Applications Pending Review" : "طلبات في انتظار المراجعة",
      message:
        language === "en"
          ? "You have 5 applications that have been waiting for review for more than 48 hours"
          : "لديك 5 طلبات في انتظار المراجعة لأكثر من 48 ساعة",
      date: "2023-11-15T11:20:00Z",
      isRead: false,
      relatedId: null,
      priority: "high",
    },
    {
      id: "notif4",
      type: "system",
      title: language === "en" ? "System Update" : "تحديث النظام",
      message:
        language === "en"
          ? "The verification system has been updated with new features"
          : "تم تحديث نظام التحقق بميزات جديدة",
      date: "2023-11-10T08:15:00Z",
      isRead: true,
      relatedId: null,
      priority: "low",
    },
    {
      id: "notif5",
      type: "application",
      title: language === "en" ? "Application Updated" : "تم تحديث الطلب",
      message:
        language === "en"
          ? "Khaled Ibrahim has updated his application with new information"
          : "قام خالد إبراهيم بتحديث طلبه بمعلومات جديدة",
      date: "2023-11-05T16:30:00Z",
      isRead: false,
      relatedId: "app2",
      priority: "medium",
    },
    {
      id: "notif6",
      type: "assignment",
      title: language === "en" ? "New Assignment" : "مهمة جديدة",
      message:
        language === "en"
          ? "You have been assigned to review 3 new fellowship applications"
          : "تم تعيينك لمراجعة 3 طلبات زمالة جديدة",
      date: "2023-11-01T10:00:00Z",
      isRead: false,
      relatedId: null,
      priority: "high",
    },
    {
      id: "notif7",
      type: "deadline",
      title: language === "en" ? "Review Deadline Approaching" : "اقتراب موعد المراجعة النهائي",
      message:
        language === "en"
          ? "The deadline for reviewing application #APP-2023-089 is tomorrow"
          : "الموعد النهائي لمراجعة الطلب #APP-2023-089 هو غدًا",
      date: "2023-10-25T13:45:00Z",
      isRead: true,
      relatedId: "app3",
      priority: "high",
    },
  ]

  // Check if user is logged in and fetch notifications
  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "reviewer") {
      router.push("/dashboard")
      return
    }

    // In a real app, fetch notifications from API
    setTimeout(() => {
      setNotifications(mockNotifications)
      setIsLoading(false)
    }, 1000)
  }, [router, user])

  const formatDate = (dateString) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffMinutes < 60) {
      return language === "en"
        ? `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`
        : `منذ ${diffMinutes} ${diffMinutes === 1 ? "دقيقة" : "دقائق"}`
    } else if (diffHours < 24) {
      return language === "en"
        ? `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
        : `منذ ${diffHours} ${diffHours === 1 ? "ساعة" : "ساعات"}`
    } else if (diffDays < 7) {
      return language === "en"
        ? `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
        : `منذ ${diffDays} ${diffDays === 1 ? "يوم" : "أيام"}`
    } else {
      return date.toLocaleDateString(language === "en" ? "en-US" : "ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }

  const getNotificationIcon = (type, priority) => {
    switch (type) {
      case "application":
        return <FileText className={`h-5 w-5 ${getPriorityColor(priority)}`} />
      case "document":
        return <FileText className={`h-5 w-5 ${getPriorityColor(priority)}`} />
      case "reminder":
        return <Clock className={`h-5 w-5 ${getPriorityColor(priority)}`} />
      case "system":
        return <Bell className={`h-5 w-5 ${getPriorityColor(priority)}`} />
      case "assignment":
        return <AlertCircle className={`h-5 w-5 ${getPriorityColor(priority)}`} />
      case "deadline":
        return <Clock className={`h-5 w-5 ${getPriorityColor(priority)}`} />
      default:
        return <Bell className={`h-5 w-5 ${getPriorityColor(priority)}`} />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-blue-500"
      default:
        return "text-primary"
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {language === "en" ? "High" : "عالي"}
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            {language === "en" ? "Medium" : "متوسط"}
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {language === "en" ? "Low" : "منخفض"}
          </Badge>
        )
      default:
        return null
    }
  }

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))

    // Navigate to related page if applicable
    if (notification.relatedId) {
      if (notification.type === "application") {
        router.push(`/reviewer/applications/${notification.relatedId}`)
      } else if (notification.type === "document") {
        router.push(`/reviewer/documents/${notification.relatedId}`)
      } else if (notification.type === "assignment") {
        router.push(`/reviewer/assignments`)
      }
    }
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getFilteredNotifications = () => {
    let filtered = notifications

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((n) => n.type === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (n) => n.title.toLowerCase().includes(query) || n.message.toLowerCase().includes(query),
      )
    }

    return filtered
  }

  const filteredNotifications = getFilteredNotifications()

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-40 mr-auto" />
          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="h-12 mb-6" />

        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={() => router.push("/reviewer/dashboard")} className="mr-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {language === "en" ? "Back to Dashboard" : "العودة إلى لوحة التحكم"}
          </Button>
          <h1 className="text-2xl font-bold">{language === "en" ? "Notifications" : "الإشعارات"}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={!notifications.some((n) => !n.isRead)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            {language === "en" ? "Mark All as Read" : "تعيين الكل كمقروء"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/settings/notifications")}>
            <Bell className="mr-2 h-4 w-4" />
            {language === "en" ? "Settings" : "الإعدادات"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === "en" ? "Search notifications..." : "البحث في الإشعارات..."}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {language === "en" ? "Filter" : "تصفية"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setActiveTab("all")}>
              {language === "en" ? "All Notifications" : "جميع الإشعارات"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("application")}>
              {language === "en" ? "Applications" : "الطلبات"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("document")}>
              {language === "en" ? "Documents" : "المستندات"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("reminder")}>
              {language === "en" ? "Reminders" : "التذكيرات"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab("assignment")}>
              {language === "en" ? "Assignments" : "المهام"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="all">
            {language === "en" ? "All" : "الكل"}
            <Badge className="ml-2 bg-primary">{notifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="application">{language === "en" ? "Applications" : "الطلبات"}</TabsTrigger>
          <TabsTrigger value="document">{language === "en" ? "Documents" : "المستندات"}</TabsTrigger>
          <TabsTrigger value="reminder">{language === "en" ? "Reminders" : "التذكيرات"}</TabsTrigger>
          <TabsTrigger value="assignment">{language === "en" ? "Assignments" : "المهام"}</TabsTrigger>
          <TabsTrigger value="system">{language === "en" ? "System" : "النظام"}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredNotifications.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 transition-colors ${
                        !notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`flex-shrink-0 mt-1 ${!notification.isRead ? "relative" : ""}`}>
                          {getNotificationIcon(notification.type, notification.priority)}
                          {!notification.isRead && (
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{notification.title}</h3>
                              {getPriorityBadge(notification.priority)}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">{language === "en" ? "Actions" : "إجراءات"}</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleNotificationClick(notification)}>
                                    {language === "en" ? "View Details" : "عرض التفاصيل"}
                                  </DropdownMenuItem>
                                  {!notification.isRead ? (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setNotifications((prev) =>
                                          prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
                                        )
                                      }
                                    >
                                      {language === "en" ? "Mark as Read" : "تعيين كمقروء"}
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setNotifications((prev) =>
                                          prev.map((n) => (n.id === notification.id ? { ...n, isRead: false } : n)),
                                        )
                                      }
                                    >
                                      {language === "en" ? "Mark as Unread" : "تعيين كغير مقروء"}
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => deleteNotification(notification.id)}
                                    className="text-red-600 dark:text-red-400"
                                  >
                                    {language === "en" ? "Delete" : "حذف"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          {notification.relatedId && (
                            <div className="mt-2">
                              <Button
                                variant="link"
                                className="p-0 h-auto text-sm text-primary"
                                onClick={() => handleNotificationClick(notification)}
                              >
                                {language === "en" ? "View Details" : "عرض التفاصيل"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Bell className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {language === "en" ? "No Notifications" : "لا توجد إشعارات"}
                </h3>
                <p className="text-muted-foreground text-center">
                  {language === "en"
                    ? "You don't have any notifications in this category."
                    : "ليس لديك أي إشعارات في هذه الفئة."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "Notification Summary" : "ملخص الإشعارات"}</CardTitle>
          <CardDescription>
            {language === "en" ? "Overview of your notification activity" : "نظرة عامة على نشاط الإشعارات الخاص بك"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-1">
                {language === "en" ? "Unread Notifications" : "إشعارات غير مقروءة"}
              </h3>
              <p className="text-3xl font-bold text-primary">{notifications.filter((n) => !n.isRead).length}</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-1">{language === "en" ? "High Priority" : "أولوية عالية"}</h3>
              <p className="text-3xl font-bold text-red-500">
                {notifications.filter((n) => n.priority === "high").length}
              </p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-1">
                {language === "en" ? "Today's Notifications" : "إشعارات اليوم"}
              </h3>
              <p className="text-3xl font-bold text-blue-500">
                {
                  notifications.filter((n) => {
                    const today = new Date()
                    const notifDate = new Date(n.date)
                    return (
                      notifDate.getDate() === today.getDate() &&
                      notifDate.getMonth() === today.getMonth() &&
                      notifDate.getFullYear() === today.getFullYear()
                    )
                  }).length
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

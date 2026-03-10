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
import { Bell, CheckCircle, AlertCircle, Clock, FileText, Award, Calendar, Settings, ChevronLeft } from "lucide-react"

// Mock notifications data
const mockNotifications = [
  {
    id: "notif1",
    type: "application",
    title: "Application Status Update",
    message: "Your certification application has been received and is under initial review.",
    date: "2023-11-20T14:45:00Z",
    isRead: false,
    relatedId: "app1",
    icon: "bell",
  },
  {
    id: "notif2",
    type: "document",
    title: "Document Verification",
    message: "Your academic certificate has been verified successfully.",
    date: "2023-11-18T09:30:00Z",
    isRead: true,
    relatedId: "doc1",
    icon: "check",
  },
  {
    id: "notif3",
    type: "action",
    title: "Action Required",
    message: "Please upload your professional development proof to proceed with your application.",
    date: "2023-11-15T11:20:00Z",
    isRead: false,
    relatedId: "app2",
    icon: "alert",
  },
  {
    id: "notif4",
    type: "system",
    title: "System Maintenance",
    message: "The system will be undergoing maintenance on November 25th from 2:00 AM to 4:00 AM UTC.",
    date: "2023-11-10T08:15:00Z",
    isRead: true,
    relatedId: null,
    icon: "settings",
  },
  {
    id: "notif5",
    type: "application",
    title: "Application Review",
    message: "Your application is now being reviewed by the technical committee.",
    date: "2023-11-05T16:30:00Z",
    isRead: true,
    relatedId: "app1",
    icon: "clock",
  },
  {
    id: "notif6",
    type: "event",
    title: "Upcoming Webinar",
    message: "Join our webinar on 'Professional Development for Agricultural Engineers' on December 5th.",
    date: "2023-11-01T10:00:00Z",
    isRead: false,
    relatedId: "event1",
    icon: "calendar",
  },
  {
    id: "notif7",
    type: "certification",
    title: "New Certification Level",
    message:
      "A new 'Expert' certification level is now available for agricultural engineers with 10+ years of experience.",
    date: "2023-10-25T13:45:00Z",
    isRead: true,
    relatedId: null,
    icon: "award",
  },
]

export default function NotificationsPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState("all")

  // Check if user is logged in and fetch notifications
  useEffect(() => {
    if (!user) {
      router.push("/login")
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
      return t("language") === "en"
        ? `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`
        : `منذ ${diffMinutes} ${diffMinutes === 1 ? "دقيقة" : "دقائق"}`
    } else if (diffHours < 24) {
      return t("language") === "en"
        ? `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
        : `منذ ${diffHours} ${diffHours === 1 ? "ساعة" : "ساعات"}`
    } else if (diffDays < 7) {
      return t("language") === "en"
        ? `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
        : `منذ ${diffDays} ${diffDays === 1 ? "يوم" : "أيام"}`
    } else {
      return date.toLocaleDateString(t("language") === "en" ? "en-US" : "ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }

  const getNotificationIcon = (icon) => {
    switch (icon) {
      case "bell":
        return <Bell className="h-5 w-5 text-primary" />
      case "check":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "alert":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case "clock":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "file":
        return <FileText className="h-5 w-5 text-primary" />
      case "award":
        return <Award className="h-5 w-5 text-purple-500" />
      case "calendar":
        return <Calendar className="h-5 w-5 text-indigo-500" />
      case "settings":
        return <Settings className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5 text-primary" />
    }
  }

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))

    // Navigate to related page if applicable
    if (notification.relatedId) {
      if (notification.type === "application") {
        router.push(`/application/${notification.relatedId}`)
      } else if (notification.type === "document") {
        router.push(`/application/${notification.relatedId}`)
      } else if (notification.type === "event") {
        router.push(`/events/${notification.relatedId}`)
      }
    }
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const getFilteredNotifications = () => {
    if (activeTab === "all") {
      return notifications
    } else if (activeTab === "unread") {
      return notifications.filter((n) => !n.isRead)
    } else {
      return notifications.filter((n) => n.type === activeTab)
    }
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
          <Button variant="outline" onClick={() => router.push("/dashboard")} className="mr-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Back" : "رجوع"}
          </Button>
          <h1 className="text-2xl font-bold">{t("language") === "en" ? "Notifications" : "الإشعارات"}</h1>
        </div>
        <Button variant="outline" onClick={markAllAsRead} disabled={!notifications.some((n) => !n.isRead)}>
          {t("language") === "en" ? "Mark All as Read" : "تعيين الكل كمقروء"}
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="all">
            {t("language") === "en" ? "All" : "الكل"}
            <Badge className="ml-2 bg-primary">{notifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            {t("language") === "en" ? "Unread" : "غير مقروء"}
            <Badge className="ml-2 bg-primary">{notifications.filter((n) => !n.isRead).length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="application">{t("language") === "en" ? "Applications" : "الطلبات"}</TabsTrigger>
          <TabsTrigger value="document">{t("language") === "en" ? "Documents" : "المستندات"}</TabsTrigger>
          <TabsTrigger value="action">{t("language") === "en" ? "Actions" : "الإجراءات"}</TabsTrigger>
          <TabsTrigger value="system">{t("language") === "en" ? "System" : "النظام"}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredNotifications.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${!notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-4">
                        <div className={`flex-shrink-0 mt-1 ${!notification.isRead ? "relative" : ""}`}>
                          {getNotificationIcon(notification.icon)}
                          {!notification.isRead && (
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{notification.title}</h3>
                            <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          {notification.relatedId && (
                            <div className="mt-2">
                              <Button variant="link" className="p-0 h-auto text-sm text-primary">
                                {t("language") === "en" ? "View Details" : "عرض التفاصيل"}
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
                  {t("language") === "en" ? "No Notifications" : "لا توجد إشعارات"}
                </h3>
                <p className="text-muted-foreground text-center">
                  {t("language") === "en"
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
          <CardTitle>{t("language") === "en" ? "Notification Settings" : "إعدادات الإشعارات"}</CardTitle>
          <CardDescription>
            {t("language") === "en" ? "Manage how you receive notifications" : "إدارة كيفية تلقي الإشعارات"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => router.push("/settings/notifications")}>
            <Settings className="mr-2 h-4 w-4" />
            {t("language") === "en" ? "Manage Notification Settings" : "إدارة إعدادات الإشعارات"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

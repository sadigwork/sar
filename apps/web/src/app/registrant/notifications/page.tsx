"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, CheckCircle, AlertCircle, Info, Trash2, BookMarkedIcon as MarkAsUnread } from "lucide-react"

export default function RegistrantNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "تم الموافقة على طلب التسجيل",
      message: "تم الموافقة على طلب التسجيل الأولي الخاص بك. يمكنك الآن تحميل شهادة التسجيل.",
      type: "success",
      read: false,
      date: "2024-01-20 14:30",
      actionUrl: "/certification",
    },
    {
      id: "2",
      title: "مطلوب مستندات إضافية",
      message: "يرجى رفع شهادة الخبرة العملية لإكمال طلب ترقية التصنيف.",
      type: "warning",
      read: false,
      date: "2024-01-18 10:15",
      actionUrl: "/application/2",
    },
    {
      id: "3",
      title: "تذكير: انتهاء صلاحية الترخيص",
      message: "ينتهي ترخيصك المهني في 30/06/2024. يرجى تجديده قبل انتهاء الصلاحية.",
      type: "info",
      read: true,
      date: "2024-01-15 09:00",
      actionUrl: "/certification",
    },
    {
      id: "4",
      title: "فاتورة جديدة",
      message: "تم إصدار فاتورة جديدة برقم INV-2024-001 بمبلغ 500 ريال.",
      type: "info",
      read: true,
      date: "2024-01-10 16:45",
      actionUrl: "/registrant/billing",
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAsUnread = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: false } : notif)))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "default"
      case "warning":
        return "destructive"
      case "info":
        return "secondary"
      default:
        return "outline"
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الإشعارات</h1>
          <p className="text-gray-600">لديك {unreadNotifications.length} إشعار غير مقروء</p>
        </div>
        {unreadNotifications.length > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCircle className="h-4 w-4 ml-2" />
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">جميع الإشعارات ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">غير مقروءة ({unreadNotifications.length})</TabsTrigger>
          <TabsTrigger value="read">مقروءة ({readNotifications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إشعارات</h3>
                  <p className="text-gray-500">ستظهر إشعاراتك هنا عند وصولها</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className={`${!notification.read ? "border-blue-200 bg-blue-50/30" : ""}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3
                            className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center space-x-2 space-x-reverse mt-2">
                            <span className="text-xs text-gray-500">{notification.date}</span>
                            {!notification.read && (
                              <Badge variant="secondary" className="text-xs">
                                جديد
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1 space-x-reverse">
                          {!notification.read ? (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => markAsUnread(notification.id)}>
                              <MarkAsUnread className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {notification.actionUrl && (
                        <div className="mt-3">
                          <Button variant="outline" size="sm" asChild>
                            <a href={notification.actionUrl}>عرض التفاصيل</a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {unreadNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إشعارات غير مقروءة</h3>
                  <p className="text-gray-500">جميع إشعاراتك مقروءة</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            unreadNotifications.map((notification) => (
              <Card key={notification.id} className="border-blue-200 bg-blue-50/30">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center space-x-2 space-x-reverse mt-2">
                            <span className="text-xs text-gray-500">{notification.date}</span>
                            <Badge variant="secondary" className="text-xs">
                              جديد
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-1 space-x-reverse">
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {notification.actionUrl && (
                        <div className="mt-3">
                          <Button variant="outline" size="sm" asChild>
                            <a href={notification.actionUrl}>عرض التفاصيل</a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
          {readNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إشعارات مقروءة</h3>
                  <p className="text-gray-500">الإشعارات المقروءة ستظهر هنا</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            readNotifications.map((notification) => (
              <Card key={notification.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-700">{notification.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <span className="text-xs text-gray-500 mt-2 block">{notification.date}</span>
                        </div>
                        <div className="flex space-x-1 space-x-reverse">
                          <Button variant="ghost" size="sm" onClick={() => markAsUnread(notification.id)}>
                            <MarkAsUnread className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {notification.actionUrl && (
                        <div className="mt-3">
                          <Button variant="outline" size="sm" asChild>
                            <a href={notification.actionUrl}>عرض التفاصيل</a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

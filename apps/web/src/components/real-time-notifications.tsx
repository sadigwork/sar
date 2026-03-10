"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@/lib/supabase/client"
import { useSupabaseAuth } from "@/components/supabase-auth-provider"
import { useLanguage } from "@/components/language-provider"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

type Notification = {
  id: string
  user_id: string
  type: "application" | "document" | "system" | "reminder"
  title: string
  message: string
  is_read: boolean
  created_at: string
  data?: any
}

export function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useSupabaseAuth()
  const { t } = useLanguage()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    // Fetch initial notifications
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching notifications:", error)
        return
      }

      setNotifications(data as Notification[])
      setUnreadCount(data.filter((n) => !n.is_read).length)
    }

    fetchNotifications()

    // Set up real-time subscription
    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification

          // Update state with new notification
          setNotifications((prev) => [newNotification, ...prev])
          setUnreadCount((prev) => prev + 1)

          // Show toast for new notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
            duration: 5000,
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user, supabase, toast])

  const markAsRead = async (id: string) => {
    if (!user) return

    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id)

    if (error) {
      console.error("Error marking notification as read:", error)
      return
    }

    // Update local state
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    if (error) {
      console.error("Error marking all notifications as read:", error)
      return
    }

    // Update local state
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application":
        return "📝"
      case "document":
        return "📄"
      case "system":
        return "⚙️"
      case "reminder":
        return "⏰"
      default:
        return "🔔"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("default", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 text-[10px] font-bold flex items-center justify-center bg-red-500 text-white rounded-full">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-medium">{t("notifications")}</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
              {t("markAllAsRead")}
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">{t("noNotifications")}</div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`px-4 py-3 cursor-pointer ${!notification.is_read ? "bg-primary/5" : ""}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <p className={`text-sm font-medium ${!notification.is_read ? "text-primary" : ""}`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{notification.message}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <div className="p-2 border-t text-center">
          <Button variant="ghost" size="sm" asChild className="w-full text-xs">
            <a href="/notifications">{t("viewAllNotifications")}</a>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

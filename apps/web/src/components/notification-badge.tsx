'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/components/auth-provider';

export function NotificationBadge() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sample notifications data
  useEffect(() => {
    if (user) {
      // In a real app, this would be an API call to fetch notifications
      const sampleNotifications = [
        {
          id: 'notif1',
          title:
            language === 'en'
              ? 'New Application Submitted'
              : 'تم تقديم طلب جديد',
          message:
            language === 'en'
              ? 'A new registration application has been submitted and requires your review.'
              : 'تم تقديم طلب تسجيل جديد ويتطلب مراجعتك.',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
          isRead: false,
          type: 'application',
          link: '/registrar/applications',
        },
        {
          id: 'notif2',
          title:
            language === 'en'
              ? 'Registration Expiring Soon'
              : 'التسجيل ينتهي قريبًا',
          message:
            language === 'en'
              ? '5 engineer registrations are expiring in the next 30 days.'
              : '5 تسجيلات للمهندسين تنتهي في الـ 30 يومًا القادمة.',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
          isRead: false,
          type: 'expiry',
          link: '/registrar/engineers',
        },
        {
          id: 'notif3',
          title:
            language === 'en'
              ? 'Document Verification Required'
              : 'مطلوب التحقق من المستند',
          message:
            language === 'en'
              ? 'New documents have been uploaded and require verification.'
              : 'تم تحميل مستندات جديدة وتتطلب التحقق.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          isRead: true,
          type: 'document',
          link: '/registrar/documents',
        },
      ];

      setNotifications(sampleNotifications);
      setUnreadCount(sampleNotifications.filter((n) => !n.isRead).length);
    }
  }, [user, language]);

  const handleNotificationClick = (notification: any) => {
    // Mark notification as read
    const updatedNotifications = notifications.map((n) =>
      n.id === notification.id ? { ...n, isRead: true } : n,
    );
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter((n) => !n.isRead).length);

    // Navigate to the relevant page
    router.push(notification.link);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      isRead: true,
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const getNotificationPath = () => {
    if (!user) return '/notifications';

    if (user.role === 'registrar') return '/registrar/notifications';
    if (user.role === 'reviewer') return '/reviewer/notifications';
    return '/notifications';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return language === 'en' ? `${diffMins}m ago` : `منذ ${diffMins} دقيقة`;
    } else if (diffHours < 24) {
      return language === 'en' ? `${diffHours}h ago` : `منذ ${diffHours} ساعة`;
    } else {
      return language === 'en' ? `${diffDays}d ago` : `منذ ${diffDays} يوم`;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">
            {language === 'en' ? 'Notifications' : 'الإشعارات'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{language === 'en' ? 'Notifications' : 'الإشعارات'}</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs font-normal"
              onClick={markAllAsRead}
            >
              {language === 'en' ? 'Mark all as read' : 'تعيين الكل كمقروء'}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 ${!notification.isRead ? 'bg-muted/50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex w-full justify-between">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(notification.timestamp)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(getNotificationPath())}
            >
              {language === 'en'
                ? 'View all notifications'
                : 'عرض جميع الإشعارات'}
            </DropdownMenuItem>
          </>
        ) : (
          <div className="py-4 text-center text-sm text-muted-foreground">
            {language === 'en' ? 'No notifications' : 'لا توجد إشعارات'}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

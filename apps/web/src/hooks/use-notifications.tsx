import useSWR from 'swr';
import { useAuth } from '@/components/auth-provider';
import { fetcher } from '@/lib/fetcher';

export interface Notification {
  id: string;
  title?: string;
  message?: string;
  read?: boolean;
  createdAt?: string;
}

export const useNotifications = () => {
  const { token, isLoading: authLoading } = useAuth();

  const { data, error, isValidating, mutate } = useSWR(
    !authLoading && token ? ['/notifications', token] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    },
  );

  const notifications: Notification[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.data)
    ? data.data.data
    : Array.isArray(data?.notifications)
    ? data.notifications
    : [];

  return {
    notifications,
    isLoading: authLoading || isValidating,
    isError: error,

    unreadCount: notifications.reduce(
      (count, notification) => count + (!notification?.read ? 1 : 0),
      0,
    ),

    markAsRead: async (id: string) => {
      if (!token) return;
      await fetch(`api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      mutate();
    },
  };
};

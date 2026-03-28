import useSWR from 'swr';
import { useAuth } from '@/components/auth-provider';
import { fetcher } from '@/lib/fetcher';
import axios from '@/lib/axios';

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

  const notifications: Notification[] = data || [];

  return {
    notifications,
    isLoading: authLoading || isValidating,
    isError: error,

    unreadCount: notifications.filter((n: any) => !n.read).length,

    markAsRead: async (id: string) => {
      if (!token) return;
      await fetch(`api/notifications/${id}/read`, null, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      mutate();
    },
  };
};

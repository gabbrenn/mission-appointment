import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  addNotification,
  AppNotification,
  CreateNotificationInput,
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  notificationEvents,
} from '@/lib/notifications';
import { NotificationContext } from '@/contexts/notification-context';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const refreshNotifications = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    refreshNotifications();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key?.includes('mas_global_notifications')) {
        refreshNotifications();
      }
    };

    const handleCustomUpdate = () => {
      refreshNotifications();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(notificationEvents.updated, handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(notificationEvents.updated, handleCustomUpdate);
    };
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => !item.isRead).length,
      addAppNotification: (input: CreateNotificationInput) => {
        addNotification(input);
        refreshNotifications();
      },
      markAsRead: (id: string) => {
        markNotificationAsRead(id);
        refreshNotifications();
      },
      markAllAsRead: () => {
        markAllNotificationsAsRead();
        refreshNotifications();
      },
      removeNotification: (id: string) => {
        deleteNotification(id);
        refreshNotifications();
      },
      refreshNotifications,
    }),
    [notifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

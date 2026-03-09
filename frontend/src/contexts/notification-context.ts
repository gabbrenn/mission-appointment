import { createContext } from 'react';
import { AppNotification, CreateNotificationInput } from '@/lib/notifications';

export interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addAppNotification: (input: CreateNotificationInput) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  refreshNotifications: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export type NotificationType = 'mission' | 'approval' | 'budget' | 'system' | 'reminder';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: NotificationPriority;
}

export interface CreateNotificationInput {
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  priority?: NotificationPriority;
}

const STORAGE_KEY = 'mas_global_notifications';
const UPDATE_EVENT = 'mas-notifications-updated';
const MAX_NOTIFICATIONS = 100;

const nowIso = () => new Date().toISOString();

const defaultNotifications = (): AppNotification[] => [
  {
    id: 'seed-1',
    type: 'system',
    title: 'Welcome to MAS',
    message: 'You will see mission and assignment updates here.',
    timestamp: nowIso(),
    isRead: false,
    priority: 'low',
  },
];

export const notificationEvents = {
  updated: UPDATE_EVENT,
};

export function getNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = defaultNotifications();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }

    const parsed = JSON.parse(raw) as AppNotification[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
  } catch {
    return [];
  }
}

function persistNotifications(notifications: AppNotification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function addNotification(input: CreateNotificationInput): AppNotification {
  const current = getNotifications();
  const next: AppNotification = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: input.type,
    title: input.title,
    message: input.message,
    actionUrl: input.actionUrl,
    priority: input.priority ?? 'medium',
    isRead: false,
    timestamp: nowIso(),
  };

  const updated = [next, ...current].slice(0, MAX_NOTIFICATIONS);
  persistNotifications(updated);
  return next;
}

export function markNotificationAsRead(id: string) {
  const updated = getNotifications().map((item) =>
    item.id === id ? { ...item, isRead: true } : item
  );
  persistNotifications(updated);
}

export function markAllNotificationsAsRead() {
  const updated = getNotifications().map((item) => ({ ...item, isRead: true }));
  persistNotifications(updated);
}

export function deleteNotification(id: string) {
  const updated = getNotifications().filter((item) => item.id !== id);
  persistNotifications(updated);
}

export function formatNotificationTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} h ago`;

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

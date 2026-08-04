import { create } from 'zustand';

export type NotificationRecipient = {
  profileId: string;
  readAt: string | null;
};

export type Notification = {
  _id: string;
  teamId: string;
  type: string;
  title: string;
  message: string;
  entity: {
    type: string;
    id: string;
  };
  recipients: NotificationRecipient[];
  createdAt: string;
  updatedAt: string;
};

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;

  setNotifications: (
    notifications: Notification[],
    profileId: string,
  ) => void;

  addNotification: (
    notification: Notification,
    profileId: string,
  ) => void;

  markAsRead: (
    notificationId: string,
    profileId: string,
  ) => void;

  markAllAsRead: (profileId: string) => void;
  setUnreadCount: (count: number) => void;

  clear: () => void;

  getNotifications: () => Notification[];
  getUnreadCount: () => number;
};

const calculateUnreadCount = (
  notifications: Notification[],
  profileId: string,
) =>
  notifications.filter((notification) =>
    notification.recipients.some(
      (recipient) =>
        recipient.profileId === profileId &&
        recipient.readAt === null,
    ),
  ).length;

export const useNotificationStore = create<NotificationState>(
  (set, get) => ({
    notifications: [],
    unreadCount: 0,

    setNotifications: (
      notifications,
      profileId,
    ) =>
      set({
        notifications,
        unreadCount: calculateUnreadCount(
          notifications,
          profileId,
        ),
      }),

    addNotification: (
      notification,
      profileId,
    ) => {
      const notifications = [
        notification,
        ...get().notifications.filter(({ _id }) => _id !== notification._id),
      ];

      set({
        notifications,
        unreadCount: calculateUnreadCount(
          notifications,
          profileId,
        ),
      });
    },

    markAllAsRead: (profileId) => {
      const readAt = new Date().toISOString();
      const notifications = get().notifications.map((notification) => ({
        ...notification,
        recipients: notification.recipients.map((recipient) =>
          recipient.profileId === profileId
            ? { ...recipient, readAt: recipient.readAt ?? readAt }
            : recipient,
        ),
      }));

      set({ notifications, unreadCount: 0 });
    },

    setUnreadCount: (unreadCount) => set({ unreadCount }),

    markAsRead: (
      notificationId,
      profileId,
    ) => {
      const notifications = get().notifications.map(
        (notification) => {
          if (notification._id !== notificationId) {
            return notification;
          }

          return {
            ...notification,
            recipients:
              notification.recipients.map((recipient) =>
                recipient.profileId === profileId
                  ? {
                    ...recipient,
                    readAt:
                      recipient.readAt ??
                      new Date().toISOString(),
                  }
                  : recipient,
              ),
          };
        },
      );

      set({
        notifications,
        unreadCount: calculateUnreadCount(
          notifications,
          profileId,
        ),
      });
    },

    clear: () =>
      set({
        notifications: [],
        unreadCount: 0,
      }),

    getNotifications: () => get().notifications,

    getUnreadCount: () => get().unreadCount,
  }),
);

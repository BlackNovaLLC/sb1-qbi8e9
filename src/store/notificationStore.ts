import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification, NotificationType } from '../types';
import { generateId } from '../utils/generateId';

interface NotificationState {
  notifications: Notification[];
  addNotification: (params: {
    type: NotificationType;
    message: string;
    cardId: string;
    forUser: string;
  }) => void;
  markAsRead: (notificationId: string) => void;
  clearNotifications: (userId: string) => void;
  getUnreadCount: (userId: string) => number;
  getUserNotifications: (userId: string) => Notification[];
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: ({ type, message, cardId, forUser }) => {
        const notification: Notification = {
          id: generateId(),
          type,
          message,
          cardId,
          createdAt: new Date().toISOString(),
          read: false,
          forUser,
        };

        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 100),
        }));

        // Only show browser notifications if permission is granted
        if (typeof window !== 'undefined' && 
            'Notification' in window && 
            Notification.permission === 'granted') {
          new window.Notification(message);
        }
      },

      markAsRead: (notificationId: string) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        })),

      clearNotifications: (userId: string) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.forUser !== userId),
        })),

      getUnreadCount: (userId: string) =>
        get().notifications.filter((n) => !n.read && n.forUser === userId).length,

      getUserNotifications: (userId: string) =>
        get().notifications
          .filter((n) => n.forUser === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    }),
    {
      name: 'notifications-storage',
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);
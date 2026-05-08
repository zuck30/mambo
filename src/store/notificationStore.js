import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNotificationStore = create(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) =>
        set((state) => {
          const newNotifications = [
            {
              id: Math.random().toString(36).substring(7),
              timestamp: new Date().toISOString(),
              read: false,
              ...notification,
            },
            ...state.notifications,
          ].slice(0, 50); // Keep last 50
          return {
            notifications: newNotifications,
            unreadCount: newNotifications.filter((n) => !n.read).length,
          };
        }),
      markAsRead: (id) =>
        set((state) => {
          const newNotifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications: newNotifications,
            unreadCount: newNotifications.filter((n) => !n.read).length,
          };
        }),
      markAllAsRead: () =>
        set((state) => {
          const newNotifications = state.notifications.map((n) => ({
            ...n,
            read: true,
          }));
          return {
            notifications: newNotifications,
            unreadCount: 0,
          };
        }),
      clearNotifications: () =>
        set({
          notifications: [],
          unreadCount: 0,
        }),
    }),
    {
      name: 'notification-storage',
    }
  )
);

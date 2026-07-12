import { StateCreator } from 'zustand';
import { Notification } from '../../core/types';

export interface NotificationSlice {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  checkSystemAlerts: () => void;
}

export const createNotificationSlice: StateCreator<
  NotificationSlice & any,
  [],
  [],
  NotificationSlice
> = (set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: () => {
    // Should fetch from Firebase
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
      isRead: false
    };

    set(state => {
      const newNotifications = [newNotification, ...state.notifications].slice(0, 50);
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n: Notification) => !n.isRead).length
      };
    });
  },

  markAsRead: (id) => {
    set(state => {
      const newNotifications = state.notifications.map((n: Notification) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n: Notification) => !n.isRead).length
      };
    });
  },

  markAllAsRead: () => {
    set(state => ({
      notifications: state.notifications.map((n: Notification) => ({ ...n, isRead: true })),
      unreadCount: 0
    }));
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  checkSystemAlerts: () => {
    const state = get();
    
    // Check inventory
    if (state.inventory) {
      state.inventory.forEach((item: any) => {
        if (item.quantity < 5) {
          get().addNotification({
            type: 'تحذير',
            title: 'مخزون منخفض',
            message: `المنتج ${item.name} أوشك على النفاذ (${item.quantity} متبقي)`,
            module: 'inventory',
            referenceId: item.id
          });
        }
      });
    }

    // Check cost centers
    if (state.costCenters) {
      state.costCenters.forEach((center: any) => {
        if (center.budget > 0) {
          const consumption = center.actualSpending / center.budget;
          if (consumption >= 0.9) {
            get().addNotification({
              type: 'خطر',
              title: 'تجاوز الموازنة',
              message: `مركز التكلفة ${center.name} تجاوز 90% من موازنته`,
              module: 'cost_centers',
              referenceId: center.id
            });
          }
        }
      });
    }

    // Check fixed assets
    if (state.assets) {
      state.assets.forEach((asset: any) => {
        if (asset.status === 'نشط' && asset.bookValue <= asset.salvageValue) {
          get().addNotification({
            type: 'معلومة',
            title: 'أصل منتهي العمر',
            message: `الأصل ${asset.name} وصل لنهاية عمره الإنتاجي`,
            module: 'fixed_assets',
            referenceId: asset.id
          });
        }
      });
    }

    // Check custodies
    if (state.custodies) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      state.custodies.forEach((custody: any) => {
        if (custody.status === 'مفتوحة' && new Date(custody.date) < thirtyDaysAgo) {
          get().addNotification({
            type: 'تحذير',
            title: 'عهدة مفتوحة قديمة',
            message: `العهدة رقم ${custody.id} للموظف ${custody.employeeName} لم تسوى منذ أكثر من 30 يوماً`,
            module: 'cash_accounts',
            referenceId: custody.id
          });
        }
      });
    }
  }
});

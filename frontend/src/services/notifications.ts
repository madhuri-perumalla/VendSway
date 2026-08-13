import api from './api';
import { Notification, NotificationFilters, NotificationType, NotificationPriority } from '@/types/shared';

export interface NotificationResponse {
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
}

export interface CreateNotificationData {
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message?: string;
  link?: string;
  metadata?: Record<string, any>;
  expiresAt?: string;
}

/**
 * Notification Service
 * Handles all notification-related API calls
 */
export const notificationService = {
  /**
   * Get all notifications for the current user
   */
  async getNotifications(filters?: NotificationFilters): Promise<NotificationResponse> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.isRead !== undefined) params.append('isRead', filters.isRead.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await api.get(`/notifications?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.data.count;
  },

  /**
   * Get notification by ID
   */
  async getNotificationById(id: string): Promise<Notification> {
    const response = await api.get(`/notifications/${id}`);
    return response.data.data.notification;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data.data.notification;
  },

  /**
   * Mark multiple notifications as read
   */
  async markManyAsRead(ids: string[]): Promise<void> {
    await api.put('/notifications/mark-read', { ids });
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/mark-all-read');
  },

  /**
   * Delete notification
   */
  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },

  /**
   * Delete multiple notifications
   */
  async deleteMany(ids: string[]): Promise<void> {
    await api.delete('/notifications/bulk', { data: { ids } });
  },

  /**
   * Delete all read notifications
   */
  async deleteReadNotifications(): Promise<void> {
    await api.delete('/notifications/read');
  },

  /**
   * Create a new notification
   */
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    const response = await api.post('/notifications', data);
    return response.data.data.notification;
  },
};

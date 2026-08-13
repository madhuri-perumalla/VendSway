import { PrismaClient, NotificationType, NotificationPriority } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message?: string;
  link?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

export interface UpdateNotificationData {
  isRead?: boolean;
  readAt?: Date;
}

export interface NotificationFilters {
  type?: NotificationType;
  priority?: NotificationPriority;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Notification Service
 * Handles CRUD operations for user notifications
 */
export class NotificationService {
  /**
   * Create a new notification
   */
  async create(data: CreateNotificationData) {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        priority: data.priority || NotificationPriority.MEDIUM,
        title: data.title,
        message: data.message,
        link: data.link,
        metadata: data.metadata,
        expiresAt: data.expiresAt,
      },
    });
  }

  /**
   * Create multiple notifications in bulk
   */
  async createBulk(data: CreateNotificationData[]) {
    return await prisma.notification.createMany({
      data: data.map((item) => ({
        userId: item.userId,
        type: item.type,
        priority: item.priority || NotificationPriority.MEDIUM,
        title: item.title,
        message: item.message,
        link: item.link,
        metadata: item.metadata,
        expiresAt: item.expiresAt,
      })),
    });
  }

  /**
   * Get notification by ID
   */
  async getById(id: string) {
    return await prisma.notification.findUnique({
      where: { id },
    });
  }

  /**
   * Get all notifications for a user with filters
   */
  async getUserNotifications(userId: string, filters: NotificationFilters = {}) {
    const where: any = {
      userId,
      // Filter out expired notifications
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.isRead !== undefined) {
      where.isRead = filters.isRead;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: filters.limit || 50,
      skip: filters.offset || 0,
    });

    const totalCount = await prisma.notification.count({ where });

    return {
      notifications,
      totalCount,
      unreadCount: await this.getUnreadCount(userId),
    };
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string) {
    return await prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark multiple notifications as read
   */
  async markManyAsRead(ids: string[]) {
    return await prisma.notification.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Delete notification
   */
  async delete(id: string) {
    return await prisma.notification.delete({
      where: { id },
    });
  }

  /**
   * Delete multiple notifications
   */
  async deleteMany(ids: string[]) {
    return await prisma.notification.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  /**
   * Delete all read notifications for a user
   */
  async deleteReadNotifications(userId: string) {
    return await prisma.notification.deleteMany({
      where: {
        userId,
        isRead: true,
      },
    });
  }

  /**
   * Delete expired notifications for all users
   */
  async deleteExpiredNotifications() {
    return await prisma.notification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  /**
   * Update notification
   */
  async update(id: string, data: UpdateNotificationData) {
    return await prisma.notification.update({
      where: { id },
      data,
    });
  }

  /**
   * Helper: Create success notification
   */
  async createSuccess(userId: string, title: string, message?: string, link?: string) {
    return await this.create({
      userId,
      type: NotificationType.SUCCESS,
      priority: NotificationPriority.MEDIUM,
      title,
      message,
      link,
    });
  }

  /**
   * Helper: Create warning notification
   */
  async createWarning(userId: string, title: string, message?: string, link?: string) {
    return await this.create({
      userId,
      type: NotificationType.WARNING,
      priority: NotificationPriority.HIGH,
      title,
      message,
      link,
    });
  }

  /**
   * Helper: Create error notification
   */
  async createError(userId: string, title: string, message?: string, link?: string) {
    return await this.create({
      userId,
      type: NotificationType.ERROR,
      priority: NotificationPriority.URGENT,
      title,
      message,
      link,
    });
  }

  /**
   * Helper: Create AI recommendation notification
   */
  async createAIRecommendation(
    userId: string,
    title: string,
    message?: string,
    metadata?: Record<string, any>,
    link?: string
  ) {
    return await this.create({
      userId,
      type: NotificationType.AI_RECOMMENDATION,
      priority: NotificationPriority.HIGH,
      title,
      message,
      metadata,
      link,
    });
  }

  /**
   * Helper: Create seller alert notification
   */
  async createSellerAlert(userId: string, title: string, message?: string, link?: string) {
    return await this.create({
      userId,
      type: NotificationType.SELLER_ALERT,
      priority: NotificationPriority.HIGH,
      title,
      message,
      link,
    });
  }

  /**
   * Helper: Create product approval notification
   */
  async createProductApproval(
    userId: string,
    title: string,
    message?: string,
    metadata?: Record<string, any>,
    link?: string
  ) {
    return await this.create({
      userId,
      type: NotificationType.PRODUCT_APPROVAL,
      priority: NotificationPriority.MEDIUM,
      title,
      message,
      metadata,
      link,
    });
  }

  /**
   * Helper: Create festival reminder notification
   */
  async createFestivalReminder(
    userId: string,
    title: string,
    message?: string,
    festivalDate?: Date,
    link?: string
  ) {
    return await this.create({
      userId,
      type: NotificationType.FESTIVAL_REMINDER,
      priority: NotificationPriority.HIGH,
      title,
      message,
      expiresAt: festivalDate,
      link,
    });
  }

  /**
   * Helper: Create info notification
   */
  async createInfo(userId: string, title: string, message?: string, link?: string) {
    return await this.create({
      userId,
      type: NotificationType.INFO,
      priority: NotificationPriority.LOW,
      title,
      message,
      link,
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

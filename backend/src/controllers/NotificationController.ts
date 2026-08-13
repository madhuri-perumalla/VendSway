import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseFormatter';
import { notificationService } from '../services/NotificationService';
import { NotificationType, NotificationPriority } from '@prisma/client';
import { BadRequestError, UnauthorizedError } from '../utils/errors';

/**
 * Notification controller
 * Handles notification CRUD operations
 */
export class NotificationController {
  /**
   * Get all notifications for the authenticated user
   * GET /api/notifications
   */
  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const { type, priority, isRead, limit, offset } = req.query;

    const filters: any = {};
    if (type) filters.type = type as NotificationType;
    if (priority) filters.priority = priority as NotificationPriority;
    if (isRead !== undefined) filters.isRead = isRead === 'true';
    if (limit) filters.limit = parseInt(limit as string);
    if (offset) filters.offset = parseInt(offset as string);

    const result = await notificationService.getUserNotifications(userId, filters);

    return successResponse(res, result, 'Notifications retrieved successfully');
  });

  /**
   * Get unread notification count
   * GET /api/notifications/unread-count
   */
  getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const count = await notificationService.getUnreadCount(userId);

    return successResponse(res, { count }, 'Unread count retrieved successfully');
  });

  /**
   * Get notification by ID
   * GET /api/notifications/:id
   */
  getNotificationById = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const notification = await notificationService.getById(id);

    if (!notification) {
      throw new BadRequestError('Notification not found');
    }

    // Ensure user can only access their own notifications
    if (notification.userId !== userId) {
      throw new UnauthorizedError('Access denied');
    }

    return successResponse(res, { notification }, 'Notification retrieved successfully');
  });

  /**
   * Mark notification as read
   * PUT /api/notifications/:id/read
   */
  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const notification = await notificationService.getById(id);

    if (!notification) {
      throw new BadRequestError('Notification not found');
    }

    // Ensure user can only mark their own notifications
    if (notification.userId !== userId) {
      throw new UnauthorizedError('Access denied');
    }

    const updated = await notificationService.markAsRead(id);

    return successResponse(res, { notification: updated }, 'Notification marked as read');
  });

  /**
   * Mark multiple notifications as read
   * PUT /api/notifications/mark-read
   */
  markManyAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { ids } = req.body;

    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestError('Invalid notification IDs');
    }

    // Verify all notifications belong to the user
    const notifications = await notificationService.getUserNotifications(userId, {
      limit: 1000,
    });

    const userNotificationIds = new Set(notifications.notifications.map((n) => n.id));
    const validIds = ids.filter((id: string) => userNotificationIds.has(id));

    if (validIds.length === 0) {
      throw new BadRequestError('No valid notification IDs provided');
    }

    await notificationService.markManyAsRead(validIds);

    return successResponse(res, { success: true }, 'Notifications marked as read');
  });

  /**
   * Mark all notifications as read
   * PUT /api/notifications/mark-all-read
   */
  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    await notificationService.markAllAsRead(userId);

    return successResponse(res, { success: true }, 'All notifications marked as read');
  });

  /**
   * Delete notification
   * DELETE /api/notifications/:id
   */
  deleteNotification = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const notification = await notificationService.getById(id);

    if (!notification) {
      throw new BadRequestError('Notification not found');
    }

    // Ensure user can only delete their own notifications
    if (notification.userId !== userId) {
      throw new UnauthorizedError('Access denied');
    }

    await notificationService.delete(id);

    return successResponse(res, { success: true }, 'Notification deleted successfully');
  });

  /**
   * Delete multiple notifications
   * DELETE /api/notifications/bulk
   */
  deleteMany = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { ids } = req.body;

    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestError('Invalid notification IDs');
    }

    // Verify all notifications belong to the user
    const notifications = await notificationService.getUserNotifications(userId, {
      limit: 1000,
    });

    const userNotificationIds = new Set(notifications.notifications.map((n) => n.id));
    const validIds = ids.filter((id: string) => userNotificationIds.has(id));

    if (validIds.length === 0) {
      throw new BadRequestError('No valid notification IDs provided');
    }

    await notificationService.deleteMany(validIds);

    return successResponse(res, { success: true }, 'Notifications deleted successfully');
  });

  /**
   * Delete all read notifications
   * DELETE /api/notifications/read
   */
  deleteReadNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    await notificationService.deleteReadNotifications(userId);

    return successResponse(res, { success: true }, 'Read notifications deleted successfully');
  });

  /**
   * Create a new notification (admin/internal use)
   * POST /api/notifications
   */
  createNotification = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const { type, priority, title, message, link, metadata, expiresAt } = req.body;

    if (!title) {
      throw new BadRequestError('Title is required');
    }

    const notification = await notificationService.create({
      userId,
      type: type || NotificationType.INFO,
      priority: priority || NotificationPriority.MEDIUM,
      title,
      message,
      link,
      metadata,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    return successResponse(res, { notification }, 'Notification created successfully', 201);
  });
}

// Export singleton instance
export const notificationController = new NotificationController();

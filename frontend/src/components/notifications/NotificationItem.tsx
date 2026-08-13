import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Notification, NotificationType, NotificationPriority } from '@/types/shared';
import { notificationService } from '@/services/notifications';

interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * NotificationItem component
 * Displays a single notification with type-specific styling and actions
 */
export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onDelete,
}) => {
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case NotificationType.WARNING:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case NotificationType.ERROR:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case NotificationType.AI_RECOMMENDATION:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        );
      case NotificationType.SELLER_ALERT:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
        );
      case NotificationType.PRODUCT_APPROVAL:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
          </svg>
        );
      case NotificationType.FESTIVAL_REMINDER:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'bg-green-50 border-green-200 text-green-700';
      case NotificationType.WARNING:
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case NotificationType.ERROR:
        return 'bg-red-50 border-red-200 text-red-700';
      case NotificationType.AI_RECOMMENDATION:
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case NotificationType.SELLER_ALERT:
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case NotificationType.PRODUCT_APPROVAL:
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case NotificationType.FESTIVAL_REMINDER:
        return 'bg-pink-50 border-pink-200 text-pink-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.URGENT:
        return <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">Urgent</span>;
      case NotificationPriority.HIGH:
        return <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">High</span>;
      case NotificationPriority.MEDIUM:
        return <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">Medium</span>;
      case NotificationPriority.LOW:
        return <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">Low</span>;
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(notification.id);
      onRead?.(notification.id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(notification.id);
      onDelete?.(notification.id);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
        notification.isRead ? 'bg-white border-gray-100' : getTypeStyles(notification.type)
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 p-2 rounded-full ${notification.isRead ? 'bg-gray-100' : ''}`}>
          <div className={notification.isRead ? 'text-gray-500' : ''}>
            {getNotificationIcon(notification.type)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={`font-semibold text-sm ${notification.isRead ? 'text-gray-600' : ''}`}>
                {notification.title}
              </h4>
              {notification.message && (
                <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-500' : ''}`}>
                  {notification.message}
                </p>
              )}
            </div>
            {getPriorityBadge(notification.priority)}
          </div>

          {/* Metadata */}
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(notification.metadata).map(([key, value]) => (
                <span
                  key={key}
                  className="px-2 py-0.5 text-xs bg-white/50 rounded border border-gray-200"
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
            <div className="flex items-center gap-2">
              {!notification.isRead && (
                <button
                  onClick={handleMarkAsRead}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Mark as read
                </button>
              )}
              <button
                onClick={handleDelete}
                className="text-xs text-gray-500 hover:text-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Wrap in Link if notification has a link
  if (notification.link) {
    return (
      <Link to={notification.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

import React from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { format } from 'date-fns';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface NotificationPanelProps {
  userId: string;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ userId, onClose }) => {
  const { getUserNotifications, markAsRead } = useNotificationStore();
  const notifications = getUserNotifications(userId);

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'CARD_MOVED':
        return '🔄';
      case 'SUBTASK_COMPLETED':
        return '✅';
      case 'PHASE_COMPLETED':
        return '🎉';
      default:
        return '📋';
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  notification.read ? 'bg-white' : 'bg-blue-50'
                }`}
              >
                <div className="flex gap-3">
                  <span className="text-xl" role="img" aria-label="notification type">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1">
                    <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
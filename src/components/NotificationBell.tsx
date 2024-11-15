import React from 'react';
import { useNotificationStore } from '../store/notificationStore';
import { BellIcon } from '@heroicons/react/24/outline';

interface NotificationBellProps {
  userId: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
  const unreadCount = useNotificationStore((state) => state.getUnreadCount(userId));

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 
        'Notification' in window && 
        Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="relative">
      <BellIcon className="h-6 w-6 text-gray-500" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
};
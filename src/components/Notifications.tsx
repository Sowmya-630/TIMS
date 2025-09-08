import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Clock,
  Trash2
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const Notifications: React.FC = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useInventory();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Low Stock':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'Overdue Order':
        return <Clock className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    const baseColor = isRead ? 'bg-gray-50 border-gray-200' : 'bg-white border-l-4';
    
    if (isRead) return baseColor;
    
    switch (type) {
      case 'Low Stock':
        return `${baseColor} border-l-yellow-500`;
      case 'Overdue Order':
        return `${baseColor} border-l-red-500`;
      default:
        return `${baseColor} border-l-blue-500`;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All notifications read'}
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl p-6 border transition-all duration-200 ${getNotificationColor(notification.type, notification.isRead)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.type === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                        notification.type === 'Overdue Order' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {notification.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                {!notification.isRead && (
                  <button
                    onClick={() => markNotificationAsRead(notification.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-500">
              You're all caught up! New notifications will appear here when they arrive.
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {notifications.length}
              </div>
              <div className="text-sm text-gray-600">Total Notifications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {notifications.filter(n => n.type === 'Low Stock').length}
              </div>
              <div className="text-sm text-gray-600">Low Stock Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {notifications.filter(n => n.type === 'Overdue Order').length}
              </div>
              <div className="text-sm text-gray-600">Overdue Orders</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
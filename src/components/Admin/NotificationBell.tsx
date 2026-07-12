import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { Bell, AlertTriangle, Info, CheckCircle, AlertCircle, Check } from 'lucide-react';
import { t } from '../../core/translations';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { notifications, unreadCount, markAsRead, markAllAsRead, checkSystemAlerts } = useStore();

  useEffect(() => {
    // Run checks on mount
    checkSystemAlerts();
    
    // Run checks every 5 minutes
    const interval = setInterval(() => {
      checkSystemAlerts();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    // Optional: navigate based on module
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'تحذير': return <AlertTriangle className="text-yellow-500" size={18} />;
      case 'خطر': return <AlertCircle className="text-red-500" size={18} />;
      case 'نجاح': return <CheckCircle className="text-green-500" size={18} />;
      default: return <Info className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden transform origin-top-left transition-all">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <h3 className="font-semibold text-gray-800">{t('notifications.title')}</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Check size={14} />
                {t('markAllRead')}
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.slice(0, 10).map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-2 block">
                      {new Date(notification.date).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 flex flex-col items-center">
                <Bell size={32} className="text-gray-300 mb-2" />
                <p className="text-sm">{t('noNotifications')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

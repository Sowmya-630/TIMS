import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

export default function AlertSystem() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      state.alerts.forEach(alert => {
        if (now - alert.timestamp > 5000) {
          dispatch({ type: 'REMOVE_ALERT', payload: alert.id });
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.alerts, dispatch]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      default: return Info;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {state.alerts.map((alert) => {
        const Icon = getIcon(alert.type);
        return (
          <div
            key={alert.id}
            className={clsx(
              'flex items-center space-x-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm transform transition-all duration-300 animate-in slide-in-from-right',
              getStyles(alert.type)
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium flex-1">{alert.message}</p>
            <button
              onClick={() => dispatch({ type: 'REMOVE_ALERT', payload: alert.id })}
              className="text-current hover:bg-black/10 rounded-lg p-1 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  User, 
  MessageSquare,
  ChevronRight,
  Zap
} from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'suppliers', label: 'Suppliers', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'chatbot', label: 'AI Assistant', icon: MessageSquare },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();

  const handleNavigation = (pageId) => {
    if (pageId === 'chatbot') {
      dispatch({ type: 'TOGGLE_CHATBOT' });
    } else {
      dispatch({ type: 'SET_PAGE', payload: pageId });
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">TIMS</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Telecom Inventory</p>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = state.currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={clsx(
                    'w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Daily Streak</p>
              <p className="text-2xl font-bold">{state.dailyStreak}</p>
            </div>
            <div className="text-3xl">🔥</div>
          </div>
        </div>
      </div>
    </div>
  );
}
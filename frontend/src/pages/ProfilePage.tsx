import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  Activity, 
  Info,
  LogOut,
  Camera,
  Edit,
  Save,
  X
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProfilePage() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(state.user);

  const tabs = [
    { id: 'about', label: 'About', icon: Info },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const activityChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Activities',
      data: [45, 52, 38, 65, 42, 58],
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const taskCompletionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Tasks Completed',
      data: [12, 8, 15, 10, 18, 6, 14],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(168, 85, 247, 0.8)'
      ],
      borderRadius: 8
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: state.isDarkMode ? '#e5e7eb' : '#374151'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: state.isDarkMode ? '#9ca3af' : '#6b7280'
        },
        grid: {
          color: state.isDarkMode ? '#374151' : '#e5e7eb'
        }
      },
      y: {
        ticks: {
          color: state.isDarkMode ? '#9ca3af' : '#6b7280'
        },
        grid: {
          color: state.isDarkMode ? '#374151' : '#e5e7eb'
        }
      }
    }
  };

  const handleSaveProfile = () => {
    if (editedUser) {
      dispatch({ type: 'SET_USER', payload: editedUser });
      dispatch({ type: 'ADD_ALERT', payload: { type: 'success', message: 'Profile updated successfully!' }});
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    dispatch({ type: 'SET_PAGE', payload: 'intro' });
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'ADD_ALERT', payload: { type: 'info', message: 'Successfully logged out' }});
  };

  if (!state.user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={state.user.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
              />
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-gray-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 text-white">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{state.user.name}</h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-xl opacity-90 mb-2">{state.user.role}</p>
              <p className="text-white/80">{state.user.email}</p>
              <p className="text-white/60 text-sm mt-2">
                Member since {new Date(state.user.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{state.dailyStreak}</div>
                <div className="text-sm opacity-80">Day Streak</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{state.rewardPoints.toLocaleString()}</div>
                <div className="text-sm opacity-80">Points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-8 pt-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-8 py-6">
          {activeTab === 'about' && (
            <div className="space-y-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editedUser?.name || ''}
                      onChange={(e) => setEditedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editedUser?.email || ''}
                      onChange={(e) => setEditedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={editedUser?.role || ''}
                      onChange={(e) => setEditedUser(prev => prev ? { ...prev, role: e.target.value } : null)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedUser(state.user);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <User className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                        <p className="font-medium text-gray-900 dark:text-white">{state.user.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <Mail className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Email Address</p>
                        <p className="font-medium text-gray-900 dark:text-white">{state.user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(state.user.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Active Products</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {state.products.filter(p => p.status === 'Active').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Suppliers</span>
                          <span className="font-medium text-gray-900 dark:text-white">{state.suppliers.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Reward Points</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {state.rewardPoints.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Monthly Activities</h3>
                  <div className="h-64">
                    <Line data={activityChartData} options={chartOptions} />
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Task Completion</h3>
                  <div className="h-64">
                    <Bar data={taskCompletionData} options={chartOptions} />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  {state.activities.slice(0, 8).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-600 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{activity.description}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(activity.timestamp).toLocaleDateString()} • {activity.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid gap-6">
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark theme</p>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        state.isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          state.isDarkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Stock Alerts</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when stock runs low</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Supplier Updates</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive supplier notifications</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
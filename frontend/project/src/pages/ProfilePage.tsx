import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  Mail, 
  Shield, 
  Save,
  Eye,
  EyeOff,
  Camera,
  Bell,
  CreditCard,
  Calendar,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Palette,
  Lock,
  Smartphone
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, subscriptions } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'billing'>('profile');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    weeklyReports: true,
    language: 'en',
    timezone: 'UTC-8'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: formData.fullName,
      email: formData.email
    });
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password change logic
    console.log('Password change requested');
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordFields(false);
  };

  const totalSpent = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-lg">{user?.fullName}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className={`p-8 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isEditing
                          ? theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Full Name
                        </label>
                        <div className="relative">
                          <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                          }`} />
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                              isEditing
                                ? theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                : theme === 'dark'
                                ? 'bg-gray-600 border-gray-600 text-gray-300'
                                : 'bg-gray-100 border-gray-300 text-gray-600'
                            } ${isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20' : ''}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                          }`} />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                              isEditing
                                ? theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                : theme === 'dark'
                                ? 'bg-gray-600 border-gray-600 text-gray-300'
                                : 'bg-gray-100 border-gray-300 text-gray-600'
                            } ${isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20' : ''}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Role
                        </label>
                        <div className="relative">
                          <Shield className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                          }`} />
                          <input
                            type="text"
                            value={user?.role === 'admin' ? 'Administrator' : 'End User'}
                            disabled
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                              theme === 'dark'
                                ? 'bg-gray-600 border-gray-600 text-gray-300'
                                : 'bg-gray-100 border-gray-300 text-gray-600'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Member Since
                        </label>
                        <div className="relative">
                          <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                          }`} />
                          <input
                            type="text"
                            value="January 2024"
                            disabled
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                              theme === 'dark'
                                ? 'bg-gray-600 border-gray-600 text-gray-300'
                                : 'bg-gray-100 border-gray-300 text-gray-600'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        >
                          <Save className="w-5 h-5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Preferences</h2>
                  
                  <div className="space-y-8">
                    {/* Theme Settings */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Palette className="w-5 h-5 mr-2" />
                        Appearance
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="font-medium">Theme</label>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Choose your preferred theme
                            </p>
                          </div>
                          <button
                            onClick={toggleTheme}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                              theme === 'dark'
                                ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                            <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Bell className="w-5 h-5 mr-2" />
                        Notifications
                      </h3>
                      <div className="space-y-4">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                          { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                          { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional offers and updates' },
                          { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Get weekly summary of your subscriptions' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <label className="font-medium">{item.label}</label>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {item.desc}
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={preferences[item.key as keyof typeof preferences] as boolean}
                              onChange={(e) => setPreferences({
                                ...preferences,
                                [item.key]: e.target.checked
                              })}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Language & Region */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Language & Region</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Language
                          </label>
                          <select
                            value={preferences.language}
                            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                            className={`w-full py-3 px-4 rounded-lg border transition-colors ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Timezone
                          </label>
                          <select
                            value={preferences.timezone}
                            onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                            className={`w-full py-3 px-4 rounded-lg border transition-colors ${
                              theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                            } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                          >
                            <option value="UTC-8">Pacific Time (UTC-8)</option>
                            <option value="UTC-7">Mountain Time (UTC-7)</option>
                            <option value="UTC-6">Central Time (UTC-6)</option>
                            <option value="UTC-5">Eastern Time (UTC-5)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                  
                  <div className="space-y-8">
                    {/* Password Change */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center">
                          <Lock className="w-5 h-5 mr-2" />
                          Change Password
                        </h3>
                        <button
                          onClick={() => setShowPasswordFields(!showPasswordFields)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {showPasswordFields ? 'Cancel' : 'Change Password'}
                        </button>
                      </div>

                      {showPasswordFields && (
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Current Password
                            </label>
                            <input
                              type="password"
                              value={formData.currentPassword}
                              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                              required
                              className={`w-full py-3 px-4 rounded-lg border transition-colors ${
                                theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                              } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                            />
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              New Password
                            </label>
                            <input
                              type="password"
                              value={formData.newPassword}
                              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                              required
                              className={`w-full py-3 px-4 rounded-lg border transition-colors ${
                                theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                              } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                            />
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-2 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              required
                              className={`w-full py-3 px-4 rounded-lg border transition-colors ${
                                theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                              } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                            />
                          </div>

                          <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Update Password
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Two-Factor Authentication */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Smartphone className="w-5 h-5 mr-2" />
                        Two-Factor Authentication
                      </h3>
                      <div className={`p-4 rounded-lg border ${
                        theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">SMS Authentication</p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                            Enable
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Billing Information</h2>
                  
                  <div className="space-y-8">
                    {/* Account Overview */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className={`p-6 rounded-lg border ${
                        theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <CreditCard className="w-6 h-6 text-blue-500" />
                          <span className="text-2xl font-bold">${totalSpent.toFixed(2)}</span>
                        </div>
                        <h3 className="font-semibold">Total Spent</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          This month
                        </p>
                      </div>

                      <div className={`p-6 rounded-lg border ${
                        theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <BarChart3 className="w-6 h-6 text-green-500" />
                          <span className="text-2xl font-bold">{activeSubscriptions}</span>
                        </div>
                        <h3 className="font-semibold">Active Plans</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Currently subscribed
                        </p>
                      </div>

                      <div className={`p-6 rounded-lg border ${
                        theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <Calendar className="w-6 h-6 text-purple-500" />
                          <span className="text-2xl font-bold">5</span>
                        </div>
                        <h3 className="font-semibold">Days Left</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Until next billing
                        </p>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Payment Methods</h3>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                          Add Method
                        </button>
                      </div>
                      
                      <div className={`p-6 rounded-lg border ${
                        theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">**** **** **** 4242</p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Expires 12/26
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs rounded">
                              Primary
                            </span>
                            <button className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                            }`}>
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Billing History */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Billing History</h3>
                        <button className={`px-4 py-2 rounded-lg border transition-colors ${
                          theme === 'dark'
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}>
                          View All
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { date: '2024-01-15', amount: '$19.99', plan: 'Professional Plan', status: 'Paid' },
                          { date: '2023-12-15', amount: '$19.99', plan: 'Professional Plan', status: 'Paid' },
                          { date: '2023-11-15', amount: '$9.99', plan: 'Basic Plan', status: 'Paid' }
                        ].map((item, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border ${
                              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{item.plan}</p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {item.date}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{item.amount}</p>
                                <p className="text-sm text-green-600">{item.status}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
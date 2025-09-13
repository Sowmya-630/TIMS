import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';
import {
  User,
  Mail,
  Shield,
  Save,
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
  Smartphone,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, subscriptions, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'billing'>('profile');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage(null);

      await updateProfile({
        fullName: formData.fullName,
        email: formData.email
      });

      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await authService.updatePassword(formData.currentPassword, formData.newPassword);

      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordFields(false);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate real statistics
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'Active');
  const totalSpent = activeSubscriptions.reduce((sum, sub) => sum + (sub.plan?.price || 0), 0);
  const nextBillingDate = activeSubscriptions.length > 0
    ? activeSubscriptions.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())[0].endDate
    : null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
              : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
            }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-lg">{user?.fullName}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user?.role === 'Admin' ? 'Administrator' : 'End User'}
                </p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
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
            <div className={`p-8 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-4 py-2 rounded-lg transition-colors ${isEditing
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
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                          Full Name
                        </label>
                        <div className="relative">
                          <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                            }`} />
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${isEditing
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
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                            }`} />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${isEditing
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
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                          Role
                        </label>
                        <div className="relative">
                          <Shield className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                            }`} />
                          <input
                            type="text"
                            value={user?.role === 'Admin' ? 'Administrator' : 'End User'}
                            disabled
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme === 'dark'
                                ? 'bg-gray-600 border-gray-600 text-gray-300'
                                : 'bg-gray-100 border-gray-300 text-gray-600'
                              }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                          Member Since
                        </label>
                        <div className="relative">
                          <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                            }`} />
                          <input
                            type="text"
                            value={user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                            disabled
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme === 'dark'
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
                          disabled={loading}
                          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                          {loading ? (
                            <Loader className="w-5 h-5 animate-spin" />
                          ) : (
                            <Save className="w-5 h-5" />
                          )}
                          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
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
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${theme === 'dark'
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
                          className={`px-4 py-2 rounded-lg transition-colors ${theme === 'dark'
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
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                              Current Password
                            </label>
                            <input
                              type="password"
                              value={formData.currentPassword}
                              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                              required
                              className={`w-full py-3 px-4 rounded-lg border transition-colors ${theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                            />
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                              New Password
                            </label>
                            <input
                              type="password"
                              value={formData.newPassword}
                              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                              required
                              minLength={6}
                              className={`w-full py-3 px-4 rounded-lg border transition-colors ${theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                            />
                          </div>

                          <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              required
                              className={`w-full py-3 px-4 rounded-lg border transition-colors ${theme === 'dark'
                                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
                          >
                            {loading ? (
                              <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                              <Lock className="w-5 h-5" />
                            )}
                            <span>{loading ? 'Updating...' : 'Update Password'}</span>
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
                      <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
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
                      <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                          <CreditCard className="w-6 h-6 text-blue-500" />
                          <span className="text-2xl font-bold">${totalSpent.toFixed(2)}</span>
                        </div>
                        <h3 className="font-semibold">Monthly Cost</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Current spending
                        </p>
                      </div>

                      <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                          <BarChart3 className="w-6 h-6 text-green-500" />
                          <span className="text-2xl font-bold">{activeSubscriptions.length}</span>
                        </div>
                        <h3 className="font-semibold">Active Plans</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Currently subscribed
                        </p>
                      </div>

                      <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                          <Calendar className="w-6 h-6 text-purple-500" />
                          <span className="text-2xl font-bold">
                            {nextBillingDate ? Math.ceil((new Date(nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0}
                          </span>
                        </div>
                        <h3 className="font-semibold">Days Left</h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Until next billing
                        </p>
                      </div>
                    </div>

                    {/* Active Subscriptions */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Active Subscriptions</h3>
                      <div className="space-y-4">
                        {activeSubscriptions.map((subscription) => (
                          <div key={subscription.id} className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                            }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{subscription.plan?.name || 'Unknown Plan'}</h4>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Next billing: {formatDate(subscription.endDate)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">${subscription.plan?.price || 0}/month</p>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {subscription.status}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {activeSubscriptions.length === 0 && (
                          <div className="text-center py-8">
                            <CreditCard className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                              }`} />
                            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                              No active subscriptions
                            </p>
                          </div>
                        )}
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
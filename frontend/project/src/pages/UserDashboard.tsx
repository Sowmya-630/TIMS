import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  Bell,
  Package,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  Zap,
  Gift,
  Eye,
  BarChart3
} from 'lucide-react';

interface Recommendation {
  id: string;
  planName: string;
  reason: string;
  savings: number;
  confidence: number;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
  date: string;
}

const UserDashboard: React.FC = () => {
  const { user, subscriptions } = useAuth();
  const { theme } = useTheme();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock AI recommendations
    setRecommendations([
      {
        id: '1',
        planName: 'Pro Plan',
        reason: 'Based on your usage patterns, upgrading could save you 20%',
        savings: 24.99,
        confidence: 85
      },
      {
        id: '2',
        planName: 'Enterprise Plan',
        reason: 'You\'re using advanced features frequently',
        savings: 49.99,
        confidence: 78
      }
    ]);

    // Mock notifications
    setNotifications([
      {
        id: '1',
        type: 'info',
        title: 'New Plan Available',
        message: 'Check out our new Premium features',
        date: '2024-01-15'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Subscription Expiring Soon',
        message: 'Your Basic Plan expires in 5 days',
        date: '2024-01-14'
      },
      {
        id: '3',
        type: 'success',
        title: 'Payment Successful',
        message: 'Your monthly payment has been processed',
        date: '2024-01-13'
      }
    ]);
  }, []);

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const totalSpending = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'expired':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName}!</h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Here's your subscription overview and personalized recommendations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold">{activeSubscriptions.length}</span>
            </div>
            <h3 className="font-semibold mb-1">Active Subscriptions</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Currently running
            </p>
          </div>

          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold">${totalSpending.toFixed(2)}</span>
            </div>
            <h3 className="font-semibold mb-1">Monthly Spending</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Total across all plans
            </p>
          </div>

          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold">$24.99</span>
            </div>
            <h3 className="font-semibold mb-1">Potential Savings</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              With AI recommendations
            </p>
          </div>

          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold">{notifications.length}</span>
            </div>
            <h3 className="font-semibold mb-1">New Notifications</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Require attention
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Subscriptions */}
            <div className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">My Active Subscriptions</h2>
                <Link
                  to="/subscriptions"
                  className="text-blue-500 hover:text-blue-600 flex items-center space-x-1 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {activeSubscriptions.slice(0, 3).map((subscription) => (
                  <div
                    key={subscription.id}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' 
                        ? 'border-gray-700 bg-gray-750' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(subscription.status)}
                        <div>
                          <h3 className="font-semibold">{subscription.planName}</h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Next billing: {subscription.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${subscription.price}/month</p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {subscription.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {activeSubscriptions.length === 0 && (
                <div className="text-center py-8">
                  <Package className={`w-12 h-12 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    No active subscriptions yet
                  </p>
                  <Link
                    to="/plans"
                    className="inline-flex items-center space-x-2 mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <span>Browse Plans</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            <div className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold">AI Recommendations</h2>
              </div>
              
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-4 rounded-lg border-2 border-dashed ${
                      theme === 'dark' 
                        ? 'border-purple-500/30 bg-purple-900/10' 
                        : 'border-purple-200 bg-purple-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{rec.planName}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">{rec.confidence}%</span>
                          </div>
                        </div>
                        <p className={`text-sm mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {rec.reason}
                        </p>
                        <p className="text-green-600 font-semibold">
                          Save ${rec.savings}/month
                        </p>
                      </div>
                      <button className="ml-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                        View Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/plans"
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5 text-blue-500" />
                  <span>Browse Plans</span>
                </Link>
                <Link
                  to="/subscriptions"
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Eye className="w-5 h-5 text-green-500" />
                  <span>Manage Subscriptions</span>
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  <span>View Analytics</span>
                </Link>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>
              <h3 className="text-lg font-bold mb-4">Recent Notifications</h3>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      theme === 'dark' 
                        ? 'border-gray-700' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {notification.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promotional Offer */}
            <div className={`p-6 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white`}>
              <div className="flex items-center space-x-2 mb-3">
                <Gift className="w-6 h-6" />
                <h3 className="text-lg font-bold">Special Offer!</h3>
              </div>
              <p className="text-sm mb-4 text-orange-100">
                Upgrade to Pro and get 30% off your first 3 months. Limited time offer!
              </p>
              <button className="w-full bg-white text-orange-600 py-2 px-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                Claim Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
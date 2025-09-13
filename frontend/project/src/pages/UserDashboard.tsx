import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { planService } from '../services/planService';
import { discountService } from '../services/discountService';
import { SubscriptionPlan, Discount } from '../types';
import {
  CreditCard,
  Package,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  BarChart3,
  Loader,
  Gift
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user, subscriptions, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const [activePlans, setActivePlans] = useState<SubscriptionPlan[]>([]);
  const [activeDiscounts, setActiveDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [plans, discounts] = await Promise.all([
        planService.getActivePlans(),
        discountService.getActiveDiscounts()
      ]);
      setActivePlans(plans);
      setActiveDiscounts(discounts);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'Active');
  const cancelledSubscriptions = subscriptions.filter(sub => sub.status === 'Cancelled');
  const expiredSubscriptions = subscriptions.filter(sub => sub.status === 'Expired');

  // Calculate total spending from active subscriptions
  const totalSpending = activeSubscriptions.reduce((sum, sub) => {
    const plan = sub.plan;
    return sum + (plan ? plan.price : 0);
  }, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Expired':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDataUsagePercentage = (used: number, quota: number) => {
    return Math.min((used / (quota * 1024)) * 100, 100); // Convert GB to MB
  };

  if (authLoading || loading) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName}!</h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Here's your subscription overview and available plans.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
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

          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
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

          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-2xl font-bold">{cancelledSubscriptions.length}</span>
            </div>
            <h3 className="font-semibold mb-1">Cancelled</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Cancelled subscriptions
            </p>
          </div>

          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold">{expiredSubscriptions.length}</span>
            </div>
            <h3 className="font-semibold mb-1">Expired</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Expired subscriptions
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Subscriptions */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
              <div className="mb-6">
                <h2 className="text-xl font-bold">My Active Subscriptions</h2>
              </div>

              <div className="space-y-4">
                {activeSubscriptions.slice(0, 3).map((subscription) => (
                  <div
                    key={subscription.id}
                    className={`p-4 rounded-lg border ${theme === 'dark'
                      ? 'border-gray-700 bg-gray-750'
                      : 'border-gray-200 bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(subscription.status)}
                        <div>
                          <h3 className="font-semibold">{subscription.plan?.name || 'Unknown Plan'}</h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            Expires: {formatDate(subscription.endDate)}
                          </p>
                          {subscription.plan && (
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                              {subscription.dataUsed}MB / {subscription.plan.dataQuota}GB used
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${subscription.plan?.price || 0}/month</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          {subscription.status}
                        </p>
                        {subscription.plan && (
                          <div className="mt-1">
                            <div className={`w-20 h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                              }`}>
                              <div
                                className="h-2 bg-blue-500 rounded-full"
                                style={{
                                  width: `${getDataUsagePercentage(subscription.dataUsed, subscription.plan.dataQuota)}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {activeSubscriptions.length === 0 && (
                <div className="text-center py-8">
                  <Package className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
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

            {/* Available Plans */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Available Plans</h2>
                <Link
                  to="/plans"
                  className="text-blue-500 hover:text-blue-600 flex items-center space-x-1 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {activePlans.slice(0, 4).map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-lg border ${theme === 'dark'
                      ? 'border-gray-700 bg-gray-750'
                      : 'border-gray-200 bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{plan.name}</h3>
                      <span className="text-lg font-bold">${plan.price}</span>
                    </div>
                    <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      {plan.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                        {plan.dataQuota}GB • {plan.durationDays} days
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${plan.productType === 'Fibernet'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                        }`}>
                        {plan.productType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/plans"
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${theme === 'dark'
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  <Package className="w-5 h-5 text-blue-500" />
                  <span>Browse Plans</span>
                </Link>
                <Link
                  to="/subscriptions"
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${theme === 'dark'
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  <Eye className="w-5 h-5 text-green-500" />
                  <span>Manage Subscriptions</span>
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${theme === 'dark'
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  <span>View Profile</span>
                </Link>
              </div>
            </div>

            {/* Active Discounts */}
            {activeDiscounts.length > 0 && (
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-sm`}>
                <h3 className="text-lg font-bold mb-4">Active Discounts</h3>
                <div className="space-y-3">
                  {activeDiscounts.slice(0, 3).map((discount) => (
                    <div
                      key={discount.id}
                      className={`p-3 rounded-lg border ${theme === 'dark'
                        ? 'border-green-700 bg-green-900/10'
                        : 'border-green-200 bg-green-50'
                        }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Gift className="w-5 h-5 text-green-500 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{discount.name}</h4>
                          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            {discount.description}
                          </p>
                          <p className="text-xs mt-1 text-green-600 font-semibold">
                            {discount.discountPercent}% OFF
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Summary */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
              <h3 className="text-lg font-bold mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Total Subscriptions
                  </span>
                  <span className="font-semibold">{subscriptions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Active Plans
                  </span>
                  <span className="font-semibold text-green-600">{activeSubscriptions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Monthly Cost
                  </span>
                  <span className="font-semibold">${totalSpending.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Member Since
                  </span>
                  <span className="font-semibold">
                    {user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
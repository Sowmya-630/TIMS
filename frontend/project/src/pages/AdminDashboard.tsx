import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  category: string;
  active: boolean;
  subscribers: number;
  revenue: number;
  createdAt: string;
}

interface Analytics {
  totalRevenue: number;
  totalSubscribers: number;
  activeSubscriptions: number;
  churnRate: number;
  monthlyGrowth: number;
  popularPlans: { name: string; subscribers: number; revenue: number }[];
}

const AdminDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'analytics'>('overview');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [showPlanDialog, setShowPlanDialog] = useState<{ type: 'create' | 'edit'; plan?: Plan } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    // Mock plans data
    setPlans([
      {
        id: '1',
        name: 'Basic Plan',
        price: 9.99,
        description: 'Perfect for individuals',
        features: ['5 projects', '10GB storage', 'Basic support'],
        category: 'basic',
        active: true,
        subscribers: 1250,
        revenue: 12497.5,
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        name: 'Professional Plan',
        price: 19.99,
        description: 'Ideal for teams',
        features: ['Unlimited projects', '100GB storage', 'Priority support', 'API access'],
        category: 'pro',
        active: true,
        subscribers: 890,
        revenue: 17791.1,
        createdAt: '2024-01-01'
      },
      {
        id: '3',
        name: 'Enterprise Plan',
        price: 49.99,
        description: 'For large organizations',
        features: ['Everything in Pro', 'Unlimited storage', 'Dedicated support', 'Custom features'],
        category: 'enterprise',
        active: true,
        subscribers: 320,
        revenue: 15996.8,
        createdAt: '2024-01-01'
      }
    ]);

    // Mock analytics data
    setAnalytics({
      totalRevenue: 46285.4,
      totalSubscribers: 2460,
      activeSubscriptions: 2385,
      churnRate: 3.05,
      monthlyGrowth: 12.5,
      popularPlans: [
        { name: 'Professional Plan', subscribers: 890, revenue: 17791.1 },
        { name: 'Enterprise Plan', subscribers: 320, revenue: 15996.8 },
        { name: 'Basic Plan', subscribers: 1250, revenue: 12497.5 }
      ]
    });
  }, []);

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || plan.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handlePlanSubmit = (planData: Omit<Plan, 'id' | 'subscribers' | 'revenue' | 'createdAt'>) => {
    if (showPlanDialog?.type === 'create') {
      const newPlan: Plan = {
        ...planData,
        id: Date.now().toString(),
        subscribers: 0,
        revenue: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPlans([...plans, newPlan]);
    } else if (showPlanDialog?.type === 'edit' && showPlanDialog.plan) {
      setPlans(plans.map(p => 
        p.id === showPlanDialog.plan!.id 
          ? { ...showPlanDialog.plan!, ...planData }
          : p
      ));
    }
    setShowPlanDialog(null);
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(p => p.id !== planId));
    setShowDeleteDialog(null);
  };

  const togglePlanStatus = (planId: string) => {
    setPlans(plans.map(p => 
      p.id === planId ? { ...p, active: !p.active } : p
    ));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'plans', label: 'Plans Management', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Manage subscription plans and monitor performance
          </p>
        </div>

        {/* Tabs */}
        <div className={`flex space-x-1 mb-8 p-1 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-colors ${
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
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">12.5%</span>
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Total Revenue</h3>
                <p className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</p>
              </div>

              <div className={`p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center text-blue-600">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">8.2%</span>
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Total Subscribers</h3>
                <p className="text-2xl font-bold">{analytics.totalSubscribers.toLocaleString()}</p>
              </div>

              <div className={`p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex items-center text-purple-600">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">5.1%</span>
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Active Subscriptions</h3>
                <p className="text-2xl font-bold">{analytics.activeSubscriptions.toLocaleString()}</p>
              </div>

              <div className={`p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex items-center text-red-600">
                    <ArrowDown className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">0.3%</span>
                  </div>
                </div>
                <h3 className="font-semibold mb-1">Churn Rate</h3>
                <p className="text-2xl font-bold">{analytics.churnRate}%</p>
              </div>
            </div>

            {/* Charts and Popular Plans */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className={`p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
                <h3 className="text-lg font-bold mb-6">Popular Plans</h3>
                <div className="space-y-4">
                  {analytics.popularPlans.map((plan, index) => (
                    <div key={plan.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          index === 0 ? 'bg-gold-100 dark:bg-yellow-900/20' :
                          index === 1 ? 'bg-gray-100 dark:bg-gray-700' :
                          'bg-orange-100 dark:bg-orange-900/20'
                        }`}>
                          <span className="font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {plan.subscribers} subscribers
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${plan.revenue.toFixed(0)}</p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          revenue
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
                <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">New subscription</p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        John Doe subscribed to Professional Plan
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        2 hours ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Plan updated</p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Enterprise Plan pricing modified
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        5 hours ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Subscription cancelled</p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Basic Plan subscription ended
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        1 day ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plans Management Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            {/* Plans Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`py-3 px-4 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                >
                  <option value="all">All Categories</option>
                  <option value="basic">Basic</option>
                  <option value="pro">Professional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <button
                onClick={() => setShowPlanDialog({ type: 'create' })}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Plan</span>
              </button>
            </div>

            {/* Plans Table */}
            <div className={`rounded-xl overflow-hidden shadow-sm ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Subscribers
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                  }`}>
                    {filteredPlans.map((plan) => (
                      <tr
                        key={plan.id}
                        className={`transition-colors hover:${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium">{plan.name}</div>
                            <div className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {plan.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold">${plan.price}/month</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{plan.subscribers.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">${plan.revenue.toFixed(0)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => togglePlanStatus(plan.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              plan.active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                            }`}
                          >
                            {plan.active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setShowPlanDialog({ type: 'edit', plan })}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark'
                                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                              }`}
                              title="Edit plan"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteDialog(plan.id)}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                              title="Delete plan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredPlans.length === 0 && (
                <div className="text-center py-12">
                  <Package className={`w-16 h-16 mx-auto mb-4 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <h3 className="text-xl font-semibold mb-2">No plans found</h3>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className={`p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
                <h3 className="text-lg font-bold mb-6">Revenue Trends</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className={`text-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                    <p>Revenue chart would be displayed here</p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
                <h3 className="text-lg font-bold mb-6">Subscriber Growth</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className={`text-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <TrendingUp className="w-16 h-16 mx-auto mb-4" />
                    <p>Subscriber growth chart would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}>
              <h3 className="text-lg font-bold mb-6">Plan Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  } rounded-lg`}>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Plan Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Subscribers
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Conversion Rate
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                        Churn Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                  }`}>
                    {plans.map((plan) => (
                      <tr key={plan.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {plan.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {plan.subscribers.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${plan.revenue.toFixed(0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-green-600">
                            {(Math.random() * 10 + 5).toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-red-600">
                            {(Math.random() * 5 + 1).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Plan Create/Edit Dialog */}
      {showPlanDialog && (
        <PlanDialog
          type={showPlanDialog.type}
          plan={showPlanDialog.plan}
          theme={theme}
          onSubmit={handlePlanSubmit}
          onClose={() => setShowPlanDialog(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-xl p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete this plan? This action cannot be undone and will affect all subscribers.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDeletePlan(showDeleteDialog)}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteDialog(null)}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Plan Dialog Component
interface PlanDialogProps {
  type: 'create' | 'edit';
  plan?: Plan;
  theme: string;
  onSubmit: (planData: Omit<Plan, 'id' | 'subscribers' | 'revenue' | 'createdAt'>) => void;
  onClose: () => void;
}

const PlanDialog: React.FC<PlanDialogProps> = ({ type, plan, theme, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    price: plan?.price || 0,
    description: plan?.description || '',
    features: plan?.features.join(', ') || '',
    category: plan?.category || 'basic',
    active: plan?.active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      price: formData.price,
      description: formData.description,
      features: formData.features.split(',').map(f => f.trim()),
      category: formData.category,
      active: formData.active
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-md w-full rounded-xl p-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className="text-lg font-bold mb-4">
          {type === 'create' ? 'Create New Plan' : 'Edit Plan'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Plan Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              Price (USD/month)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
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
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
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
              Features (comma-separated)
            </label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              required
              rows={3}
              placeholder="Feature 1, Feature 2, Feature 3"
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
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full py-3 px-4 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
            >
              <option value="basic">Basic</option>
              <option value="pro">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="active" className={`ml-2 text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Active Plan
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {type === 'create' ? 'Create Plan' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
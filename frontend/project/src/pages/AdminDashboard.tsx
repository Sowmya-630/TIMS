import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { planService } from '../services/planService';
import { subscriptionService } from '../services/subscriptionService';
import { discountService } from '../services/discountService';
import { auditService } from '../services/auditService';
import { User, SubscriptionPlan, Subscription, Discount, AuditLog } from '../types';
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
  Download,
  Loader,
  Gift,
  FileText,
  XCircle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'plans' | 'subscriptions' | 'discounts' | 'audits'>('overview');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [audits, setAudits] = useState<AuditLog[]>([]);
  
  // Pagination states
  const [usersPagination, setUsersPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [plansPagination, setPlansPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [subscriptionsPagination, setSubscriptionsPagination] = useState({ page: 1, total: 0, pages: 0 });
  
  // Plan management states
  const [showCreatePlanDialog, setShowCreatePlanDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [planFormData, setPlanFormData] = useState({
    name: '',
    description: '',
    productType: 'Fibernet' as 'Fibernet' | 'Broadband Copper',
    price: '',
    dataQuota: '',
    durationDays: '30',
    isActive: true
  });

  // User management states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState<string | null>(null);
  const [showCreateSubscriptionDialog, setShowCreateSubscriptionDialog] = useState<User | null>(null);

  useEffect(() => {
    if (user?.role === 'Admin') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadUsers(),
        loadPlans(),
        loadSubscriptions(),
        loadDiscounts(),
        loadAudits()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await authService.getUsers({ page: 1, limit: 10 });
      setUsers(response.users);
      setUsersPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadPlans = async () => {
    try {
      const response = await planService.getPlans({ page: 1, limit: 10 });
      setPlans(response.plans);
      setPlansPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const loadSubscriptions = async () => {
    try {
      const response = await subscriptionService.getSubscriptions({ page: 1, limit: 10 });
      setSubscriptions(response.subscriptions);
      setSubscriptionsPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    }
  };

  const loadDiscounts = async () => {
    try {
      const response = await discountService.getDiscounts({ page: 1, limit: 10 });
      setDiscounts(response.discounts);
    } catch (error) {
      console.error('Failed to load discounts:', error);
    }
  };

  const loadAudits = async () => {
    try {
      const response = await auditService.getAudits({ page: 1, limit: 10 });
      setAudits(response.audits);
    } catch (error) {
      console.error('Failed to load audits:', error);
    }
  };

  // Calculate analytics from real data
  const analytics = {
    totalUsers: usersPagination.total,
    totalPlans: plansPagination.total,
    totalSubscriptions: subscriptionsPagination.total,
    activeSubscriptions: subscriptions.filter(sub => sub.status === 'Active').length,
    cancelledSubscriptions: subscriptions.filter(sub => sub.status === 'Cancelled').length,
    expiredSubscriptions: subscriptions.filter(sub => sub.status === 'Expired').length,
    totalRevenue: subscriptions
      .filter(sub => sub.status === 'Active')
      .reduce((sum, sub) => sum + (sub.plan?.price || 0), 0),
    activeDiscounts: discounts.filter(discount => discount.isActive).length
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Expired':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await planService.createPlan({
        name: planFormData.name,
        description: planFormData.description,
        productType: planFormData.productType,
        price: parseFloat(planFormData.price),
        dataQuota: parseInt(planFormData.dataQuota),
        durationDays: parseInt(planFormData.durationDays),
        isActive: planFormData.isActive
      });
      
      setShowCreatePlanDialog(false);
      setPlanFormData({
        name: '',
        description: '',
        productType: 'Fibernet',
        price: '',
        dataQuota: '',
        durationDays: '30',
        isActive: true
      });
      await loadPlans();
    } catch (error) {
      console.error('Failed to create plan:', error);
      alert('Failed to create plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    
    try {
      setLoading(true);
      await planService.updatePlan(editingPlan.id, {
        name: planFormData.name,
        description: planFormData.description,
        productType: planFormData.productType,
        price: parseFloat(planFormData.price),
        dataQuota: parseInt(planFormData.dataQuota),
        durationDays: parseInt(planFormData.durationDays),
        isActive: planFormData.isActive
      });
      
      setEditingPlan(null);
      setPlanFormData({
        name: '',
        description: '',
        productType: 'Fibernet',
        price: '',
        dataQuota: '',
        durationDays: '30',
        isActive: true
      });
      await loadPlans();
    } catch (error) {
      console.error('Failed to update plan:', error);
      alert('Failed to update plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }
    
    try {
      await planService.deletePlan(planId);
      await loadPlans();
    } catch (error) {
      console.error('Failed to delete plan:', error);
      alert('Failed to delete plan. Please try again.');
    }
  };

  const openEditDialog = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setPlanFormData({
      name: plan.name,
      description: plan.description || '',
      productType: plan.productType,
      price: plan.price.toString(),
      dataQuota: plan.dataQuota.toString(),
      durationDays: plan.durationDays.toString(),
      isActive: plan.isActive
    });
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their subscriptions.')) {
      return;
    }
    
    try {
      await authService.deleteUser(userId);
      await loadUsers();
      setShowDeleteUserDialog(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleCreateSubscriptionForUser = (user: User) => {
    setShowCreateSubscriptionDialog(user);
  };

  const handleCreateSubscription = async (userId: string, planId: string) => {
    try {
      const startDate = new Date().toISOString().split('T')[0];
      const plan = plans.find(p => p.id === planId);
      const endDate = new Date(Date.now() + (plan?.durationDays || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      await subscriptionService.createSubscription({
        userId,
        planId,
        startDate,
        endDate,
        autoRenew: true
      });
      
      await loadSubscriptions();
      setShowCreateSubscriptionDialog(null);
    } catch (error) {
      console.error('Failed to create subscription:', error);
      alert('Failed to create subscription. Please try again.');
    }
  };

  if (user?.role !== 'Admin') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Manage users, plans, subscriptions, and system analytics.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className={`mb-8 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'plans', label: 'Plans', icon: Package },
              { id: 'subscriptions', label: 'Subscriptions', icon: Target },
              { id: 'discounts', label: 'Discounts', icon: Gift },
              { id: 'audits', label: 'Audit Logs', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : theme === 'dark'
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold">{analytics.totalUsers}</span>
                </div>
                <h3 className="font-semibold mb-1">Total Users</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Registered users
                </p>
              </div>

              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold">{analytics.totalPlans}</span>
                </div>
                <h3 className="font-semibold mb-1">Total Plans</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Available plans
                </p>
              </div>

              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold">{analytics.activeSubscriptions}</span>
                </div>
                <h3 className="font-semibold mb-1">Active Subscriptions</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Currently active
                </p>
              </div>

              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</span>
                </div>
                <h3 className="font-semibold mb-1">Monthly Revenue</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  From active subscriptions
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className="text-lg font-bold mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.email}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'Admin'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className="text-lg font-bold mb-4">Recent Subscriptions</h3>
                <div className="space-y-3">
                  {subscriptions.slice(0, 5).map((subscription) => (
                    <div key={subscription.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{subscription.plan?.name || 'Unknown Plan'}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {subscription.user?.fullName || 'Unknown User'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(subscription.status)}
                        <span className="text-sm">{subscription.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Users Management</h2>
              <div className="text-sm text-gray-500">
                Total: {analytics.totalUsers} users
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Created</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-3 px-4 font-medium">{user.fullName}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'Admin'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewUser(user)}
                            className="p-1 text-blue-500 hover:text-blue-600"
                            title="View User Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleCreateSubscriptionForUser(user)}
                            className="p-1 text-green-500 hover:text-green-600"
                            title="Create Subscription"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          {user.role !== 'Admin' && (
                            <button 
                              onClick={() => setShowDeleteUserDialog(user.id)}
                              className="p-1 text-red-500 hover:text-red-600"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Plans Management</h2>
              <button
                onClick={() => setShowCreatePlanDialog(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>Create Plan</span>
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <span className="text-lg font-bold">${plan.price}</span>
                  </div>
                  <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                      {plan.dataQuota}GB • {plan.durationDays} days
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      plan.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditDialog(plan)}
                      className="flex-1 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {plans.length === 0 && (
              <div className="text-center py-12">
                <Package className={`w-16 h-16 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className="text-xl font-semibold mb-2">No plans created yet</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Create your first subscription plan to get started
                </p>
                <button
                  onClick={() => setShowCreatePlanDialog(true)}
                  className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create First Plan
                </button>
              </div>
            )}
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Subscriptions Management</h2>
              <div className="text-sm text-gray-500">
                Total: {analytics.totalSubscriptions} subscriptions
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Plan</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Start Date</th>
                    <th className="text-left py-3 px-4">End Date</th>
                    <th className="text-left py-3 px-4">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-3 px-4">{subscription.user?.fullName || 'Unknown'}</td>
                      <td className="py-3 px-4">{subscription.plan?.name || 'Unknown'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(subscription.status)}
                          <span>{subscription.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatDate(subscription.startDate)}</td>
                      <td className="py-3 px-4">{formatDate(subscription.endDate)}</td>
                      <td className="py-3 px-4">${subscription.plan?.price || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Discounts Tab */}
        {activeTab === 'discounts' && (
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Discounts Management</h2>
              <div className="text-sm text-gray-500">
                Active: {analytics.activeDiscounts} discounts
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {discounts.map((discount) => (
                <div key={discount.id} className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{discount.name}</h3>
                    <span className="text-lg font-bold text-green-600">{discount.discountPercent}% OFF</span>
                  </div>
                  <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {discount.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                      {formatDate(discount.startDate)} - {formatDate(discount.endDate)}
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      discount.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audits Tab */}
        {activeTab === 'audits' && (
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Audit Logs</h2>
              <div className="text-sm text-gray-500">
                Recent system activities
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="text-left py-3 px-4">Action</th>
                    <th className="text-left py-3 px-4">Entity</th>
                    <th className="text-left py-3 px-4">Details</th>
                    <th className="text-left py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {audits.map((audit) => (
                    <tr key={audit.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-3 px-4 font-medium">{audit.action}</td>
                      <td className="py-3 px-4">{audit.entityType}</td>
                      <td className="py-3 px-4">{audit.details}</td>
                      <td className="py-3 px-4">{formatDate(audit.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Plan Dialog */}
      {(showCreatePlanDialog || editingPlan) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-xl p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-bold mb-4">
              {editingPlan ? 'Edit Plan' : 'Create New Plan'}
            </h3>
            
            <form onSubmit={editingPlan ? handleEditPlan : handleCreatePlan} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Plan Name
                </label>
                <input
                  type="text"
                  value={planFormData.name}
                  onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                  required
                  className={`w-full px-3 py-2 border rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Premium Fibernet"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Description
                </label>
                <textarea
                  value={planFormData.description}
                  onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  rows={2}
                  placeholder="Plan description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Product Type
                  </label>
                  <select
                    value={planFormData.productType}
                    onChange={(e) => setPlanFormData({ ...planFormData, productType: e.target.value as any })}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="Fibernet">Fibernet</option>
                    <option value="Broadband Copper">Broadband Copper</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={planFormData.price}
                    onChange={(e) => setPlanFormData({ ...planFormData, price: e.target.value })}
                    required
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="29.99"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Data Quota (GB)
                  </label>
                  <input
                    type="number"
                    value={planFormData.dataQuota}
                    onChange={(e) => setPlanFormData({ ...planFormData, dataQuota: e.target.value })}
                    required
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={planFormData.durationDays}
                    onChange={(e) => setPlanFormData({ ...planFormData, durationDays: e.target.value })}
                    required
                    className={`w-full px-3 py-2 border rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={planFormData.isActive}
                  onChange={(e) => setPlanFormData({ ...planFormData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Active Plan
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    editingPlan ? 'Update Plan' : 'Create Plan'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreatePlanDialog(false);
                    setEditingPlan(null);
                    setPlanFormData({
                      name: '',
                      description: '',
                      productType: 'Fibernet',
                      price: '',
                      dataQuota: '',
                      durationDays: '30',
                      isActive: true
                    });
                  }}
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
      )}

      {/* User Details Dialog */}
      {showUserDialog && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-xl p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-bold mb-4">User Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Full Name
                </label>
                <p className="text-lg">{selectedUser.fullName}</p>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email
                </label>
                <p className="text-lg">{selectedUser.email}</p>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Role
                </label>
                <span className={`px-2 py-1 rounded text-sm ${
                  selectedUser.role === 'Admin'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                }`}>
                  {selectedUser.role}
                </span>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Member Since
                </label>
                <p className="text-lg">{formatDate(selectedUser.createdAt)}</p>
              </div>
            </div>

            <div className="flex space-x-3 pt-6">
              <button
                onClick={() => handleCreateSubscriptionForUser(selectedUser)}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create Subscription
              </button>
              <button
                onClick={() => {
                  setShowUserDialog(false);
                  setSelectedUser(null);
                }}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Subscription Dialog */}
      {showCreateSubscriptionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-xl p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-bold mb-4">
              Create Subscription for {showCreateSubscriptionDialog.fullName}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Select Plan
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {plans.filter(plan => plan.isActive).map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handleCreateSubscription(showCreateSubscriptionDialog.id, plan.id)}
                      className={`w-full p-3 text-left border rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'border-gray-600 hover:bg-gray-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{plan.name}</h4>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {plan.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${plan.price}</p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {plan.dataQuota}GB
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowCreateSubscriptionDialog(null)}
                className={`w-full py-2 px-4 rounded-lg transition-colors ${
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

      {/* Delete User Confirmation Dialog */}
      {showDeleteUserDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-xl p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-bold mb-4">Delete User</h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete this user? This will also delete all their subscriptions and cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDeleteUser(showDeleteUserDialog)}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete User
              </button>
              <button
                onClick={() => setShowDeleteUserDialog(null)}
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

export default AdminDashboard;
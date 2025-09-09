import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import ProductManagement from './ProductManagement';
import SupplierManagement from './SupplierManagement';
import UserManagement from './UserManagement';
import Profile from './Profile';
import Notifications from './Notifications';
import StockTransactions from './StockTransactions';

type DashboardView = 'overview' | 'products' | 'suppliers' | 'users' | 'transactions' | 'profile' | 'notifications';

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { products, suppliers, notifications, getLowStockProducts } = useInventory();

  useEffect(() => {
    // Initialize with demo data if empty
    if (products.length === 0 && suppliers.length === 0) {
      // This would be replaced with actual API calls in a real application
    }
  }, [products, suppliers]);

  if (!user) return null;

  const firstName = user.email;
  const lowStockProducts = getLowStockProducts();
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const navigationItems = [
    { id: 'overview', label: 'Dashboard', icon: Home, roles: ['Admin', 'Manager', 'Staff'] },
    { id: 'products', label: 'Products', icon: Package, roles: ['Admin', 'Manager', 'Staff'] },
    { id: 'suppliers', label: 'Suppliers', icon: Users, roles: ['Admin', 'Manager'] },
    { id: 'users', label: 'User Management', icon: User, roles: ['Admin'] },
    { id: 'transactions', label: 'Stock Transactions', icon: ShoppingCart, roles: ['Admin', 'Manager', 'Staff'] },
    { id: 'notifications', label: 'Notifications', icon: Bell, roles: ['Admin', 'Manager', 'Staff'] },
  ];

  const visibleNavItems = navigationItems.filter(item => item.roles.includes(user.role));

  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ComponentType<any>; 
    color: string;
    trend?: string;
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={Package}
          color="bg-blue-500"
          trend="+12% from last month"
        />
        <StatCard
          title="Active Suppliers"
          value={suppliers.length}
          icon={Users}
          color="bg-green-500"
          trend="+3 new this month"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <StatCard
          title="Total Stock Value"
          value={`$${products.reduce((sum, p) => sum + (p.price * p.stockLevel), 0).toLocaleString()}`}
          icon={TrendingUp}
          color="bg-purple-500"
          trend="+8% from last month"
        />
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Low Stock Alerts
          </h3>
          <div className="space-y-2">
            {lowStockProducts.slice(0, 5).map(product => (
              <div key={product.id} className="flex justify-between items-center py-2 border-b border-red-200 last:border-0">
                <span className="font-medium text-red-700">{product.name}</span>
                <span className="text-red-600">
                  {product.stockLevel} remaining (Reorder at {product.reorderPoint})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
          <div className="space-y-3">
            {products.slice(0, 5).map(product => (
              <div key={product.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Stock: {product.stockLevel}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Suppliers Overview</h3>
          <div className="space-y-3">
            {suppliers.slice(0, 5).map(supplier => (
              <div key={supplier.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{supplier.name}</p>
                  <p className="text-sm text-gray-500">{supplier.contactPerson}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'products':
        return <ProductManagement />;
      case 'suppliers':
        return <SupplierManagement />;
      case 'users':
        return <UserManagement />;
      case 'transactions':
        return <StockTransactions />;
      case 'profile':
        return <Profile />;
      case 'notifications':
        return <Notifications />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">TIMS</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {visibleNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as DashboardView);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.id === 'notifications' && unreadNotifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {currentView === 'overview' ? 'Dashboard' : currentView.replace(/([A-Z])/g, ' $1').trim()}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome back, <span className="font-semibold">{firstName}</span>
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('profile')}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setCurrentView('notifications')}
                  className="relative p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
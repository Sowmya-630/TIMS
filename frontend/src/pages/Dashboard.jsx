import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { chartData } from '../data/sampleData';
import { 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Award,
  Gift,
  Target,
  Flame
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const { state } = useApp();

  const stats = [
    {
      title: 'Total Products',
      value: state.products.length,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Active Suppliers',
      value: state.suppliers.filter(s => s.status === 'Active').length,
      icon: Users,
      color: 'from-green-500 to-green-600',
      change: '+5%'
    },
    {
      title: 'Stock Alerts',
      value: state.products.filter(p => p.stock < 15).length,
      icon: AlertTriangle,
      color: 'from-yellow-500 to-yellow-600',
      change: '-8%'
    },
    {
      title: 'Revenue',
      value: '$124.5K',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      change: '+23%'
    }
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {state.user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Here's what's happening with your inventory today.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Flame className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{state.dailyStreak} Day Streak</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Keep it up!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stock Levels</h3>
            <div className="h-64">
              <Bar data={chartData.stockLevels} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Activities</h3>
            <div className="h-64">
              <Line data={chartData.dailyActivities} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supplier Contribution</h3>
            <div className="h-64">
              <Pie 
                data={chartData.supplierContribution} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: state.isDarkMode ? '#e5e7eb' : '#374151',
                        padding: 15,
                        usePointStyle: true
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Rewards & Points</h3>
              <Gift className="w-6 h-6" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm opacity-90">Total Points</p>
                <p className="text-3xl font-bold">{state.rewardPoints.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">Next Milestone</p>
                    <p className="text-xs opacity-90">500 points to Gold Status</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium">This Month</p>
                    <p className="text-xs opacity-90">+250 points earned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {state.activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.timestamp).toLocaleDateString()} • {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
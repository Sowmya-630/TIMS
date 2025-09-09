import React from 'react';
import { 
  Shield, 
  Package, 
  Users, 
  Bell, 
  BarChart3, 
  Zap, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Shield,
      title: 'Role-Based Access Control',
      description: 'Secure authentication with Admin, Manager, and Staff roles for controlled access.',
    },
    {
      icon: Package,
      title: 'Product Management',
      description: 'Complete CRUD operations for telecom products with stock tracking and reorder points.',
    },
    {
      icon: Users,
      title: 'Supplier Management',
      description: 'Manage supplier relationships, contact information, and order history.',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Real-time alerts for low stock levels and overdue orders.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Visual insights into inventory levels, stock movements, and supplier performance.',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Instant synchronization of inventory changes across all user sessions.',
    },
  ];

  const benefits = [
    'Reduce inventory costs by up to 30%',
    'Eliminate stockouts with proactive alerts',
    'Streamline supplier relationships',
    'Improve operational efficiency',
    'Ensure data security and compliance',
    'Scale with your business needs'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Telecom Inventory
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Management System
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline your telecom inventory operations with intelligent stock management, 
              supplier coordination, and real-time analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features for Modern Telecom Operations
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Everything you need to manage your telecom inventory efficiently and effectively.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 border border-white/20"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-blue-100 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Our TIMS?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Proven benefits that drive real business value for telecom companies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4 p-4">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-lg text-white">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Inventory Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of telecom companies already using TIMS to optimize their operations.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            Start Your Free Trial <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
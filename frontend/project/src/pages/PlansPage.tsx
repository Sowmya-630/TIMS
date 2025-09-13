import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Package, 
  Search, 
  Filter, 
  CheckCircle, 
  Star,
  Zap,
  Shield,
  Headphones,
  Globe,
  Users,
  Database,
  Clock,
  Gift
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: 'month' | 'year';
  description: string;
  features: string[];
  category: 'basic' | 'pro' | 'enterprise';
  popular: boolean;
  discount?: number;
  badge?: string;
}

const PlansPage: React.FC = () => {
  const { user, addSubscription, subscriptions } = useAuth();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 9.99,
      period: 'month',
      description: 'Perfect for individuals getting started',
      features: [
        'Up to 5 projects',
        '10GB storage',
        'Basic analytics',
        'Email support',
        'Mobile app access'
      ],
      category: 'basic',
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 19.99,
      originalPrice: 29.99,
      period: 'month',
      description: 'Ideal for growing teams and businesses',
      features: [
        'Unlimited projects',
        '100GB storage',
        'Advanced analytics',
        'Priority support',
        'API access',
        'Custom integrations',
        'Team collaboration'
      ],
      category: 'pro',
      popular: true,
      discount: 33,
      badge: 'Most Popular'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49.99,
      period: 'month',
      description: 'For large organizations with advanced needs',
      features: [
        'Everything in Pro',
        'Unlimited storage',
        'Custom features',
        'Dedicated support',
        'White-label solution',
        'SLA guarantee',
        'Advanced security',
        'Custom onboarding'
      ],
      category: 'enterprise',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Plus',
      price: 29.99,
      period: 'month',
      description: 'Enhanced features for power users',
      features: [
        'All Professional features',
        '500GB storage',
        'AI-powered insights',
        'Advanced reporting',
        '24/7 phone support',
        'Custom branding'
      ],
      category: 'pro',
      popular: false
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 4.99,
      period: 'month',
      description: 'Essential features for small projects',
      features: [
        'Up to 3 projects',
        '5GB storage',
        'Basic support',
        'Standard features'
      ],
      category: 'basic',
      popular: false
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      price: 79.99,
      period: 'month',
      description: 'No limits, maximum performance',
      features: [
        'Unlimited everything',
        'Priority processing',
        'Dedicated account manager',
        'Custom development',
        'Premium support'
      ],
      category: 'enterprise',
      popular: false
    }
  ];

  const categories = [
    { value: 'all', label: 'All Plans' },
    { value: 'basic', label: 'Basic' },
    { value: 'pro', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-10', label: '$0 - $10' },
    { value: '10-30', label: '$10 - $30' },
    { value: '30-50', label: '$30 - $50' },
    { value: '50+', label: '$50+' }
  ];

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || plan.category === selectedCategory;
    
    const matchesPrice = priceRange === 'all' || (() => {
      const price = plan.price;
      switch (priceRange) {
        case '0-10': return price <= 10;
        case '10-30': return price > 10 && price <= 30;
        case '30-50': return price > 30 && price <= 50;
        case '50+': return price > 50;
        default: return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleSubscribe = (plan: Plan) => {
    const subscription = {
      planId: plan.id,
      planName: plan.name,
      status: 'active' as const,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: plan.price,
      features: plan.features
    };
    
    addSubscription(subscription);
    setShowConfirmDialog(null);
  };

  const isSubscribed = (planId: string) => {
    return subscriptions.some(sub => sub.planId === planId && sub.status === 'active');
  };

  const getPlanIcon = (category: string) => {
    switch (category) {
      case 'basic':
        return <Package className="w-6 h-6" />;
      case 'pro':
        return <Zap className="w-6 h-6" />;
      case 'enterprise':
        return <Shield className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic':
        return 'from-blue-500 to-blue-600';
      case 'pro':
        return 'from-purple-500 to-purple-600';
      case 'enterprise':
        return 'from-gray-700 to-gray-800';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className={`text-xl max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Find the perfect subscription plan that fits your needs and budget. 
            Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Search and Filters */}
        <div className={`p-6 rounded-xl mb-8 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
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

            {/* Category Filter */}
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full py-3 px-4 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="lg:w-48">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className={`w-full py-3 px-4 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-8 rounded-xl transition-all duration-200 hover:scale-105 ${
                plan.popular
                  ? 'ring-2 ring-purple-500 scale-105'
                  : ''
              } ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-750'
                  : 'bg-white hover:shadow-lg'
              } shadow-sm`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Discount Badge */}
              {plan.discount && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center transform rotate-12">
                    <span className="text-xs font-bold">-{plan.discount}%</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${getCategoryColor(plan.category)} text-white mb-4`}>
                  {getPlanIcon(plan.category)}
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center">
                  {plan.originalPrice && (
                    <span className={`text-lg line-through mr-2 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      ${plan.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className={`text-base font-normal ml-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    /{plan.period}
                  </span>
                </div>
                {plan.discount && (
                  <div className="flex items-center justify-center mt-2">
                    <Gift className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">
                      Save ${(plan.originalPrice! - plan.price).toFixed(2)}/month
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button
                onClick={() => setShowConfirmDialog(plan.id)}
                disabled={isSubscribed(plan.id)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  isSubscribed(plan.id)
                    ? `${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'} cursor-not-allowed`
                    : plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {isSubscribed(plan.id) ? 'Currently Subscribed' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* No Results */}
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

        {/* Feature Comparison */}
        <div className={`mt-16 p-8 rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Our Plans?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`w-12 h-12 rounded-xl ${
                theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100'
              } flex items-center justify-center mx-auto mb-4`}>
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Global Access</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Access your subscriptions from anywhere in the world
              </p>
            </div>
            <div className="text-center">
              <div className={`w-12 h-12 rounded-xl ${
                theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100'
              } flex items-center justify-center mx-auto mb-4`}>
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Reliable</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Enterprise-grade security with 99.9% uptime
              </p>
            </div>
            <div className="text-center">
              <div className={`w-12 h-12 rounded-xl ${
                theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-100'
              } flex items-center justify-center mx-auto mb-4`}>
                <Headphones className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Round-the-clock support for all your needs
              </p>
            </div>
            <div className="text-center">
              <div className={`w-12 h-12 rounded-xl ${
                theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-100'
              } flex items-center justify-center mx-auto mb-4`}>
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Billing</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Change or cancel anytime with no hidden fees
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-xl p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-bold mb-4">Confirm Subscription</h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to subscribe to the{' '}
              <span className="font-semibold">
                {plans.find(p => p.id === showConfirmDialog)?.name}
              </span>{' '}
              plan?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleSubscribe(plans.find(p => p.id === showConfirmDialog)!)}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmDialog(null)}
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

export default PlansPage;
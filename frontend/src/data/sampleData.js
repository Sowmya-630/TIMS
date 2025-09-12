export const sampleUser = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@telecom.com',
  role: 'Inventory Manager',
  avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?w=150&h=150&fit=crop&crop=face',
  joinDate: '2023-01-15'
};

export const sampleProducts = [
  {
    id: '1',
    name: 'Fiber Optic Router XR-5000',
    category: 'Network Equipment',
    stock: 45,
    status: 'Active',
    price: 299.99,
    supplier: 'TechCorp Solutions',
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    name: '5G Base Station Module',
    category: 'Base Station',
    stock: 12,
    status: 'Active',
    price: 15999.99,
    supplier: 'Wireless Dynamics',
    lastUpdated: '2024-01-14'
  },
  {
    id: '3',
    name: 'CAT6 Ethernet Cable (100m)',
    category: 'Cables',
    stock: 150,
    status: 'Active',
    price: 89.99,
    supplier: 'Cable Masters',
    lastUpdated: '2024-01-13'
  },
  {
    id: '4',
    name: 'Network Switch 24-Port',
    category: 'Network Equipment',
    stock: 8,
    status: 'Active',
    price: 449.99,
    supplier: 'TechCorp Solutions',
    lastUpdated: '2024-01-12'
  },
  {
    id: '5',
    name: 'Satellite Dish Assembly',
    category: 'Satellite Equipment',
    stock: 5,
    status: 'Active',
    price: 899.99,
    supplier: 'SatTech Industries',
    lastUpdated: '2024-01-11'
  },
  {
    id: '6',
    name: 'Optical Fiber Splitter',
    category: 'Network Equipment',
    stock: 75,
    status: 'Active',
    price: 124.99,
    supplier: 'FiberNet Corp',
    lastUpdated: '2024-01-10'
  }
];

export const sampleSuppliers = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    contact: '+1-555-0123',
    email: 'contact@techcorp.com',
    status: 'Active',
    products: 45,
    location: 'New York, NY'
  },
  {
    id: '2',
    name: 'Wireless Dynamics',
    contact: '+1-555-0124',
    email: 'info@wirelessdyn.com',
    status: 'Active',
    products: 28,
    location: 'San Francisco, CA'
  },
  {
    id: '3',
    name: 'Cable Masters',
    contact: '+1-555-0125',
    email: 'sales@cablemasters.com',
    status: 'Active',
    products: 67,
    location: 'Chicago, IL'
  },
  {
    id: '4',
    name: 'SatTech Industries',
    contact: '+1-555-0126',
    email: 'support@sattech.com',
    status: 'Inactive',
    products: 12,
    location: 'Houston, TX'
  },
  {
    id: '5',
    name: 'FiberNet Corp',
    contact: '+1-555-0127',
    email: 'hello@fibernet.com',
    status: 'Active',
    products: 89,
    location: 'Seattle, WA'
  }
];

export const sampleNotifications = [
  {
    id: '1',
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'Network Switch 24-Port is running low (8 units remaining)',
    timestamp: '2024-01-15T10:30:00Z',
    read: false
  },
  {
    id: '2',
    type: 'info',
    title: 'Supplier Update',
    message: 'TechCorp Solutions has updated their product catalog',
    timestamp: '2024-01-15T09:15:00Z',
    read: false
  },
  {
    id: '3',
    type: 'success',
    title: 'Shipment Received',
    message: 'New shipment of Fiber Optic Cables has been received',
    timestamp: '2024-01-14T16:45:00Z',
    read: true
  },
  {
    id: '4',
    type: 'error',
    title: 'System Error',
    message: 'Failed to sync with supplier database',
    timestamp: '2024-01-14T14:20:00Z',
    read: true
  },
  {
    id: '5',
    type: 'info',
    title: 'Daily Report',
    message: 'Your daily inventory report is ready for review',
    timestamp: '2024-01-14T08:00:00Z',
    read: true
  }
];

export const sampleActivities = [
  {
    id: '1',
    type: 'product_added',
    description: 'Added new product: Fiber Optic Router XR-5000',
    timestamp: '2024-01-15T10:30:00Z',
    user: 'Alex Johnson'
  },
  {
    id: '2',
    type: 'stock_updated',
    description: 'Updated stock for Network Switch 24-Port',
    timestamp: '2024-01-15T09:15:00Z',
    user: 'Alex Johnson'
  },
  {
    id: '3',
    type: 'supplier_added',
    description: 'Added new supplier: FiberNet Corp',
    timestamp: '2024-01-14T16:45:00Z',
    user: 'Sarah Wilson'
  },
  {
    id: '4',
    type: 'product_deleted',
    description: 'Removed discontinued product: Legacy Router RX-1000',
    timestamp: '2024-01-14T14:20:00Z',
    user: 'Mike Davis'
  },
  {
    id: '5',
    type: 'login',
    description: 'User logged into the system',
    timestamp: '2024-01-14T08:00:00Z',
    user: 'Alex Johnson'
  }
];

export const chartData = {
  stockLevels: {
    labels: ['Routers', 'Cables', 'Base Stations', 'Switches', 'Satellite Equipment'],
    datasets: [{
      label: 'Stock Levels',
      data: [45, 150, 12, 8, 5],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(139, 92, 246, 1)'
      ],
      borderWidth: 2
    }]
  },
  dailyActivities: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Activities',
      data: [12, 8, 15, 10, 18, 6, 14],
      borderColor: 'rgba(59, 130, 246, 1)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  },
  supplierContribution: {
    labels: ['TechCorp Solutions', 'Wireless Dynamics', 'Cable Masters', 'FiberNet Corp', 'Others'],
    datasets: [{
      data: [45, 28, 67, 89, 25],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ],
      borderWidth: 0
    }]
  }
};
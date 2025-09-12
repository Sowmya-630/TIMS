export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: 'Admin' | 'Manager' | 'Staff';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  stockLevel: number;
  reorderPoint: number;
  price: number;
  supplierId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  orderHistory: Order[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  supplierId: string;
  productId: string;
  quantity: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Overdue';
  orderDate: string;
  expectedDate: string;
  deliveredDate?: string;
}

export interface Transaction {
  id: string;
  productId: string;
  type: 'Stock In' | 'Stock Out';
  quantity: number;
  reason: string;
  userId: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'Low Stock' | 'Overdue Order' | 'System';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
}
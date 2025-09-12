import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Supplier, Transaction, Notification, Order } from '../types';

interface InventoryContextType {
  products: Product[];
  suppliers: Supplier[];
  transactions: Transaction[];
  notifications: Notification[];
  orders: Order[];
  
  // Product operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Supplier operations
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'orderHistory'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  // Transaction operations
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  
  // Notification operations
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Order operations
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  
  // Utility functions
  getLowStockProducts: () => Product[];
  getOverdueOrders: () => Order[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedProducts = localStorage.getItem('products');
    const storedSuppliers = localStorage.getItem('suppliers');
    const storedTransactions = localStorage.getItem('transactions');
    const storedNotifications = localStorage.getItem('notifications');
    const storedOrders = localStorage.getItem('orders');

    if (storedProducts) setProducts(JSON.parse(storedProducts));
    if (storedSuppliers) setSuppliers(JSON.parse(storedSuppliers));
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Check for low stock and create notifications
  useEffect(() => {
    const lowStockProducts = products.filter(p => p.stockLevel <= p.reorderPoint);
    lowStockProducts.forEach(product => {
      const existingNotification = notifications.find(
        n => n.type === 'Low Stock' && n.message.includes(product.name) && !n.isRead
      );
      
      if (!existingNotification) {
        const notification: Notification = {
          id: Date.now().toString() + Math.random(),
          type: 'Low Stock',
          title: 'Low Stock Alert',
          message: `${product.name} is running low (${product.stockLevel} remaining)`,
          isRead: false,
          timestamp: new Date().toISOString(),
        };
        setNotifications(prev => [notification, ...prev]);
      }
    });
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'orderHistory'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Date.now().toString(),
      orderHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const updateSupplier = (id: string, supplierData: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => 
      s.id === id ? { ...s, ...supplierData, updatedAt: new Date().toISOString() } : s
    ));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Update product stock level
    if (transactionData.type === 'Stock In') {
      updateProduct(transactionData.productId, {
        stockLevel: products.find(p => p.id === transactionData.productId)!.stockLevel + transactionData.quantity
      });
    } else {
      updateProduct(transactionData.productId, {
        stockLevel: products.find(p => p.id === transactionData.productId)!.stockLevel - transactionData.quantity
      });
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addOrder = (orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => 
      o.id === id ? { ...o, status } : o
    ));
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.stockLevel <= p.reorderPoint);
  };

  const getOverdueOrders = () => {
    const today = new Date();
    return orders.filter(o => 
      o.status !== 'Delivered' && new Date(o.expectedDate) < today
    );
  };

  const value = {
    products,
    suppliers,
    transactions,
    notifications,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addTransaction,
    markNotificationAsRead,
    clearAllNotifications,
    addOrder,
    updateOrderStatus,
    getLowStockProducts,
    getOverdueOrders,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
};
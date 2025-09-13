import { executeQuery, testConnection } from '../config/database.js';
import { hashPassword } from '../config/auth.js';
import logger from '../config/logger.js';

const seedDatabase = async () => {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Clear existing data
    await executeQuery('DELETE FROM subscription_usage');
    await executeQuery('DELETE FROM subscription_audit');
    await executeQuery('DELETE FROM subscriptions');
    await executeQuery('DELETE FROM discounts');
    await executeQuery('DELETE FROM subscription_plans');
    await executeQuery('DELETE FROM notifications');
    await executeQuery('DELETE FROM transactions');
    await executeQuery('DELETE FROM orders');
    await executeQuery('DELETE FROM products');
    await executeQuery('DELETE FROM suppliers');
    await executeQuery('DELETE FROM users');
    await executeQuery('DELETE FROM product_categories');

    // Seed product categories
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and components' },
      { name: 'Clothing', description: 'Apparel and fashion items' },
      { name: 'Books', description: 'Books and educational materials' },
      { name: 'Home & Garden', description: 'Home improvement and garden supplies' },
      { name: 'Sports', description: 'Sports equipment and accessories' },
      { name: 'Health & Beauty', description: 'Health and beauty products' },
      { name: 'Broadband', description: 'Internet and connectivity services' }
    ];

    for (const category of categories) {
      await executeQuery(
        'INSERT INTO product_categories (name, description) VALUES (?, ?)',
        [category.name, category.description]
      );
    }

    // Seed users
    const hashedPassword = await hashPassword('Password123!');
    const users = [
      {
        id: 'admin-001',
        full_name: 'Admin User',
        email: 'admin@tims.com',
        password: hashedPassword,
        role: 'Admin'
      },
      {
        id: 'user-001',
        full_name: 'End User',
        email: 'user@tims.com',
        password: hashedPassword,
        role: 'EndUser'
      }
    ];

    for (const user of users) {
      await executeQuery(
        'INSERT INTO users (id, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [user.id, user.full_name, user.email, user.password, user.role]
      );
    }

    // Seed suppliers
    const suppliers = [
      {
        id: 'supplier-001',
        name: 'TechCorp Solutions',
        contact_person: 'John Smith',
        email: 'john@techcorp.com',
        phone: '+1-555-0123',
        address: '123 Tech Street, Silicon Valley, CA 94000'
      },
      {
        id: 'supplier-002',
        name: 'Fashion Forward Ltd',
        contact_person: 'Sarah Johnson',
        email: 'sarah@fashionforward.com',
        phone: '+1-555-0456',
        address: '456 Fashion Ave, New York, NY 10001'
      },
      {
        id: 'supplier-003',
        name: 'BookWorld Publishers',
        contact_person: 'Michael Brown',
        email: 'michael@bookworld.com',
        phone: '+1-555-0789',
        address: '789 Book Lane, Boston, MA 02101'
      },
      {
        id: 'supplier-004',
        name: 'Broadband Networks Inc',
        contact_person: 'Lisa Chen',
        email: 'lisa@broadbandnetworks.com',
        phone: '+1-555-0321',
        address: '321 Network Drive, Seattle, WA 98101'
      }
    ];

    for (const supplier of suppliers) {
      await executeQuery(
        'INSERT INTO suppliers (id, name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        [supplier.id, supplier.name, supplier.contact_person, supplier.email, supplier.phone, supplier.address]
      );
    }

    // Seed products
    const products = [
      {
        id: 'product-001',
        name: 'Laptop Computer',
        category: 'Electronics',
        description: 'High-performance laptop for business use',
        stock_level: 25,
        reorder_point: 5,
        price: 1299.99,
        supplier_id: 'supplier-001'
      },
      {
        id: 'product-002',
        name: 'Wireless Mouse',
        category: 'Electronics',
        description: 'Ergonomic wireless mouse with USB receiver',
        stock_level: 150,
        reorder_point: 20,
        price: 29.99,
        supplier_id: 'supplier-001'
      },
      {
        id: 'product-003',
        name: 'Cotton T-Shirt',
        category: 'Clothing',
        description: 'Comfortable cotton t-shirt in various sizes',
        stock_level: 8,
        reorder_point: 10,
        price: 19.99,
        supplier_id: 'supplier-002'
      },
      {
        id: 'product-004',
        name: 'Programming Book',
        category: 'Books',
        description: 'Complete guide to modern programming',
        stock_level: 3,
        reorder_point: 5,
        price: 49.99,
        supplier_id: 'supplier-003'
      },
      {
        id: 'product-005',
        name: 'Garden Hose',
        category: 'Home & Garden',
        description: '50ft heavy-duty garden hose',
        stock_level: 12,
        reorder_point: 8,
        price: 39.99,
        supplier_id: 'supplier-001'
      }
    ];

    for (const product of products) {
      await executeQuery(
        'INSERT INTO products (id, name, category, description, stock_level, reorder_point, price, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [product.id, product.name, product.category, product.description, product.stock_level, product.reorder_point, product.price, product.supplier_id]
      );
    }

    // Seed some sample orders
    const orders = [
      {
        id: 'order-001',
        supplier_id: 'supplier-001',
        product_id: 'product-001',
        quantity: 10,
        status: 'Delivered',
        expected_date: '2024-01-15 10:00:00',
        delivered_date: '2024-01-14 14:30:00'
      },
      {
        id: 'order-002',
        supplier_id: 'supplier-002',
        product_id: 'product-003',
        quantity: 50,
        status: 'Shipped',
        expected_date: '2024-01-20 12:00:00'
      },
      {
        id: 'order-003',
        supplier_id: 'supplier-003',
        product_id: 'product-004',
        quantity: 25,
        status: 'Overdue',
        expected_date: '2024-01-10 09:00:00'
      }
    ];

    for (const order of orders) {
      await executeQuery(
        'INSERT INTO orders (id, supplier_id, product_id, quantity, status, expected_date, delivered_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          order.id,
          order.supplier_id,
          order.product_id,
          order.quantity,
          order.status,
          order.expected_date,
          order.delivered_date ?? null
        ]
      );
    }

    // Seed some sample transactions
    const transactions = [
      {
        id: 'trans-001',
        product_id: 'product-001',
        type: 'Stock In',
        quantity: 10,
        reason: 'Initial stock received',
        user_id: 'admin-001'
      },
      {
        id: 'trans-002',
        product_id: 'product-002',
        type: 'Stock Out',
        quantity: 5,
        reason: 'Sold to customer',
        user_id: 'staff-001'
      },
      {
        id: 'trans-003',
        product_id: 'product-003',
        type: 'Stock In',
        quantity: 20,
        reason: 'Restock from supplier',
        user_id: 'manager-001'
      }
    ];

    for (const transaction of transactions) {
      await executeQuery(
        'INSERT INTO transactions (id, product_id, type, quantity, reason, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [transaction.id, transaction.product_id, transaction.type, transaction.quantity, transaction.reason, transaction.user_id]
      );
    }

    // Seed some sample notifications
    const notifications = [
      {
        id: 'notif-001',
        type: 'Low Stock',
        title: 'Low Stock Alert',
        message: 'Cotton T-Shirt is running low (8 units remaining)',
        product_id: 'product-003',
        user_id: 'manager-001'
      },
      {
        id: 'notif-002',
        type: 'Overdue Order',
        title: 'Overdue Order Alert',
        message: 'Programming Book order is overdue (Expected: 2024-01-10)',
        order_id: 'order-003',
        user_id: 'admin-001'
      },
      {
        id: 'notif-003',
        type: 'System',
        title: 'System Maintenance',
        message: 'Scheduled system maintenance will occur tonight at 2 AM',
        user_id: null
      }
    ];

    for (const notification of notifications) {
      await executeQuery(
        'INSERT INTO notifications (id, type, title, message, product_id, order_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          notification.id,
          notification.type,
          notification.title,
          notification.message,
          notification.product_id ?? null,
          notification.order_id ?? null,
          notification.user_id ?? null
        ]
      );
    }

    // Seed subscription plans
    const subscriptionPlans = [
      {
        id: 'plan-001',
        name: 'Basic Broadband',
        description: 'Basic internet connectivity with essential features',
        product_type: 'Fiber',
        price: 29.99,
        data_quota: 100, // GB
        duration_days: 30,
        is_active: 1
      },
      {
        id: 'plan-002',
        name: 'Standard Broadband',
        description: 'Standard internet package for regular users',
        product_type: 'Fiber',
        price: 49.99,
        data_quota: 500, // GB
        duration_days: 30,
        is_active: 1
      },
      {
        id: 'plan-003',
        name: 'Premium Broadband',
        description: 'High-speed internet for power users',
        product_type: 'Fiber',
        price: 79.99,
        data_quota: 1000, // GB
        duration_days: 30,
        is_active: 1
      },
      {
        id: 'plan-004',
        name: 'Basic 5G',
        description: 'Entry-level 5G mobile connectivity',
        product_type: '5G',
        price: 19.99,
        data_quota: 50, // GB
        duration_days: 30,
        is_active: 1
      },
      {
        id: 'plan-005',
        name: 'Premium 5G',
        description: 'High-speed 5G mobile connectivity',
        product_type: '5G',
        price: 39.99,
        data_quota: 200, // GB
        duration_days: 30,
        is_active: 1
      }
    ];

    for (const plan of subscriptionPlans) {
      await executeQuery(
        'INSERT INTO subscription_plans (id, name, description, product_type, price, data_quota, duration_days, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [plan.id, plan.name, plan.description, plan.product_type, plan.price, plan.data_quota, plan.duration_days, plan.is_active]
      );
    }

    // Seed discounts
    const discounts = [
      {
        id: 'discount-001',
        name: 'New User Discount',
        description: 'Special discount for new subscribers',
        discount_percent: 20.0,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
        plan_id: null, // Applies to all plans
        is_active: 1
      },
      {
        id: 'discount-002',
        name: 'Premium Plan Discount',
        description: 'Special discount for premium plan subscribers',
        discount_percent: 15.0,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
        plan_id: 'plan-003',
        is_active: 1
      }
    ];

    for (const discount of discounts) {
      await executeQuery(
        'INSERT INTO discounts (id, name, description, discount_percent, start_date, end_date, plan_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [discount.id, discount.name, discount.description, discount.discount_percent, discount.start_date, discount.end_date, discount.plan_id, discount.is_active]
      );
    }

    // Seed sample subscriptions
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    const subscriptions = [
      {
        id: 'sub-001',
        user_id: 'user-001',
        plan_id: 'plan-002',
        status: 'Active',
        start_date: today.toISOString(),
        end_date: nextMonth.toISOString(),
        auto_renew: 1,
        data_used: 125, // GB
        discount_id: 'discount-001'
      }
    ];

    for (const subscription of subscriptions) {
      await executeQuery(
        'INSERT INTO subscriptions (id, user_id, plan_id, status, start_date, end_date, auto_renew, data_used, discount_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [subscription.id, subscription.user_id, subscription.plan_id, subscription.status, subscription.start_date, subscription.end_date, subscription.auto_renew, subscription.data_used, subscription.discount_id]
      );
    }

    // Seed subscription usage
    const usageData = [
      {
        subscription_id: 'sub-001',
        data_used: 75,
        usage_date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      },
      {
        subscription_id: 'sub-001',
        data_used: 50,
        usage_date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
      }
    ];

    for (const usage of usageData) {
      await executeQuery(
        'INSERT INTO subscription_usage (subscription_id, data_used, usage_date) VALUES (?, ?, ?)',
        [usage.subscription_id, usage.data_used, usage.usage_date]
      );
    }

    // Seed subscription audit
    const auditData = [
      {
        subscription_id: 'sub-001',
        user_id: 'user-001',
        action: 'create',
        details: 'Initial subscription created',
        timestamp: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
      },
      {
        subscription_id: 'sub-001',
        user_id: 'user-001',
        action: 'update',
        details: 'Enabled auto-renew',
        timestamp: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      }
    ];

    for (const audit of auditData) {
      await executeQuery(
        'INSERT INTO subscription_audit (subscription_id, user_id, action, details, timestamp) VALUES (?, ?, ?, ?, ?)',
        [audit.subscription_id, audit.user_id, audit.action, audit.details, audit.timestamp]
      );
    }

    logger.info('✅ Database seeded successfully');
    console.log('✅ Database seeding completed successfully');
    
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();


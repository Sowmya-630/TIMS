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
      { name: 'Health & Beauty', description: 'Health and beauty products' }
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
        id: 'manager-001',
        full_name: 'Manager User',
        email: 'manager@tims.com',
        password: hashedPassword,
        role: 'Manager'
      },
      {
        id: 'staff-001',
        full_name: 'Staff User',
        email: 'staff@tims.com',
        password: hashedPassword,
        role: 'Staff'
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

    logger.info('✅ Database seeded successfully');
    console.log('✅ Database seeding completed successfully');
    console.log('📧 Default login credentials:');
    console.log('   Admin: admin@tims.com / password123');
    console.log('   Manager: manager@tims.com / password123');
    console.log('   Staff: staff@tims.com / password123');
    
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();


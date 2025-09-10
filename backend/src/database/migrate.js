import { executeQuery, testConnection } from '../config/database.js';
import logger from '../config/logger.js';

const createTables = async () => {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Create users table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Manager', 'Staff') NOT NULL DEFAULT 'Staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `);

    // Create suppliers table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL,
        contact_person VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_email (email)
      )
    `);

    // Create products table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        stock_level INT NOT NULL DEFAULT 0,
        reorder_point INT NOT NULL DEFAULT 0,
        price DECIMAL(10,2) NOT NULL,
        supplier_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
        INDEX idx_name (name),
        INDEX idx_category (category),
        INDEX idx_stock_level (stock_level),
        INDEX idx_supplier (supplier_id)
      )
    `);

    // Create orders table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        supplier_id VARCHAR(36) NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        quantity INT NOT NULL,
        status ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Overdue') NOT NULL DEFAULT 'Pending',
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expected_date TIMESTAMP NOT NULL,
        delivered_date TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_supplier (supplier_id),
        INDEX idx_product (product_id),
        INDEX idx_status (status),
        INDEX idx_order_date (order_date)
      )
    `);

    // Create transactions table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        product_id VARCHAR(36) NOT NULL,
        type ENUM('Stock In', 'Stock Out') NOT NULL,
        quantity INT NOT NULL,
        reason VARCHAR(200) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_product (product_id),
        INDEX idx_user (user_id),
        INDEX idx_type (type),
        INDEX idx_timestamp (timestamp)
      )
    `);

    // Create notifications table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        type ENUM('Low Stock', 'Overdue Order', 'System') NOT NULL,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        user_id VARCHAR(36) NULL,
        product_id VARCHAR(36) NULL,
        order_id VARCHAR(36) NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_user (user_id),
        INDEX idx_type (type),
        INDEX idx_is_read (is_read),
        INDEX idx_timestamp (timestamp)
      )
    `);

    // Create product_categories table for better category management
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS product_categories (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    logger.info('✅ Database tables created successfully');
    console.log('✅ Database migration completed successfully');
    
  } catch (error) {
    logger.error('❌ Database migration failed:', error);
    console.error('❌ Database migration failed:', error.message);
    process.exit(1);
  }
};

// Run migration
createTables();

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
        id TEXT PRIMARY KEY DEFAULT (
          lower(
            hex(randomblob(4)) || '-' ||
            hex(randomblob(2)) || '-' ||
            '4' || substr(hex(randomblob(2)),2) || '-' ||
            substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)),2) || '-' ||
            hex(randomblob(6))
          )
        ),
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Staff',
        created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        updated_at TEXT DEFAULT (CURRENT_TIMESTAMP)
      )
    `);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`);

    // Create suppliers table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY DEFAULT (
          lower(
            hex(randomblob(4)) || '-' ||
            hex(randomblob(2)) || '-' ||
            '4' || substr(hex(randomblob(2)),2) || '-' ||
            substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)),2) || '-' ||
            hex(randomblob(6))
          )
        ),
        name TEXT NOT NULL,
        contact_person TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        updated_at TEXT DEFAULT (CURRENT_TIMESTAMP)
      )
    `);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email)`);

    // Create products table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY DEFAULT (
          lower(
            hex(randomblob(4)) || '-' ||
            hex(randomblob(2)) || '-' ||
            '4' || substr(hex(randomblob(2)),2) || '-' ||
            substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)),2) || '-' ||
            hex(randomblob(6))
          )
        ),
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        stock_level INTEGER NOT NULL DEFAULT 0,
        reorder_point INTEGER NOT NULL DEFAULT 0,
        price REAL NOT NULL,
        supplier_id TEXT NOT NULL,
        created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
      )
    `);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_products_stock_level ON products(stock_level)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id)`);

    // Create orders table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY DEFAULT (
          lower(
            hex(randomblob(4)) || '-' ||
            hex(randomblob(2)) || '-' ||
            '4' || substr(hex(randomblob(2)),2) || '-' ||
            substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)),2) || '-' ||
            hex(randomblob(6))
          )
        ),
        supplier_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        order_date TEXT DEFAULT (CURRENT_TIMESTAMP),
        expected_date TEXT NOT NULL,
        delivered_date TEXT NULL,
        created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_orders_supplier ON orders(supplier_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date)`);

    // Create transactions table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY DEFAULT (
          lower(
            hex(randomblob(4)) || '-' ||
            hex(randomblob(2)) || '-' ||
            '4' || substr(hex(randomblob(2)),2) || '-' ||
            substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)),2) || '-' ||
            hex(randomblob(6))
          )
        ),
        product_id TEXT NOT NULL,
        type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        reason TEXT NOT NULL,
        user_id TEXT NOT NULL,
        timestamp TEXT DEFAULT (CURRENT_TIMESTAMP),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_transactions_product ON transactions(product_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp)`);

    // Create notifications table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY DEFAULT (
          lower(
            hex(randomblob(4)) || '-' ||
            hex(randomblob(2)) || '-' ||
            '4' || substr(hex(randomblob(2)),2) || '-' ||
            substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)),2) || '-' ||
            hex(randomblob(6))
          )
        ),
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        user_id TEXT NULL,
        product_id TEXT NULL,
        order_id TEXT NULL,
        timestamp TEXT DEFAULT (CURRENT_TIMESTAMP),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_notifications_timestamp ON notifications(timestamp)`);

    // Create product_categories table for better category management
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS product_categories (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))||'-'||hex(randomblob(2))||'-'||hex(randomblob(2))||'-'||hex(randomblob(2))||'-'||hex(randomblob(6)))),
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at TEXT DEFAULT (CURRENT_TIMESTAMP)
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


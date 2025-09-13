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
        role TEXT NOT NULL DEFAULT 'EndUser',
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

    // Create subscription_plans table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS subscription_plans (
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
        description TEXT,
        product_type TEXT NOT NULL,
        price REAL NOT NULL,
        data_quota INTEGER NOT NULL,
        duration_days INTEGER NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        updated_at TEXT DEFAULT (CURRENT_TIMESTAMP)
      )
    `);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_subscription_plans_name ON subscription_plans(name)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_subscription_plans_product_type ON subscription_plans(product_type)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_subscription_plans_is_active ON subscription_plans(is_active)`);

    // Create discounts table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS discounts (
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
        description TEXT,
        discount_percent REAL NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        plan_id TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE
      )
    `);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_discounts_name ON discounts(name)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_discounts_is_active ON discounts(is_active)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_discounts_plan_id ON discounts(plan_id)`);

    // Create subscriptions table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY DEFAULT (
          lower(
            hex(randomblob(4)) || '-' ||
            hex(randomblob(2)) || '-' ||
            '4' || substr(hex(randomblob(2)),2) || '-' ||
            substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)),2) || '-' ||
            hex(randomblob(6))
          )
        ),
        user_id TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active',
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        auto_renew INTEGER DEFAULT 0,
        data_used INTEGER DEFAULT 0,
        discount_id TEXT,
        created_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        updated_at TEXT DEFAULT (CURRENT_TIMESTAMP),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE,
        FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE SET NULL
      )
    `);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date)`);

    // Create subscription_usage table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS subscription_usage (
        id TEXT PRIMARY KEY DEFAULT (
          lower(
            hex(randomblob(4)) || '-' ||
            hex(randomblob(2)) || '-' ||
            '4' || substr(hex(randomblob(2)),2) || '-' ||
            substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)),2) || '-' ||
            hex(randomblob(6))
          )
        ),
        subscription_id TEXT NOT NULL,
        data_used INTEGER NOT NULL,
        usage_date TEXT DEFAULT (CURRENT_TIMESTAMP),
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
      )
    `);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_subscription_usage_subscription_id ON subscription_usage(subscription_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_subscription_usage_usage_date ON subscription_usage(usage_date)`);

    // Create subscription_audit table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS subscription_audit (
        id TEXT PRIMARY KEY DEFAULT (
          lower(
            hex(randomblob(4)) || '-' ||
            hex(randomblob(2)) || '-' ||
            '4' || substr(hex(randomblob(2)),2) || '-' ||
            substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)),2) || '-' ||
            hex(randomblob(6))
          )
        ),
        subscription_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT,
        timestamp TEXT DEFAULT (CURRENT_TIMESTAMP),
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_subscription_audit_subscription_id ON subscription_audit(subscription_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_subscription_audit_user_id ON subscription_audit(user_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_subscription_audit_action ON subscription_audit(action)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_subscription_audit_timestamp ON subscription_audit(timestamp)`);

    // Create audit_logs table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY DEFAULT (
          lower(
            hex(randomblob(4)) || '-' ||
            hex(randomblob(2)) || '-' ||
            '4' || substr(hex(randomblob(2)),2) || '-' ||
            substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)),2) || '-' ||
            hex(randomblob(6))
          )
        ),
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        details TEXT,
        timestamp TEXT DEFAULT (CURRENT_TIMESTAMP),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp)`);

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


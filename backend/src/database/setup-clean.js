import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { hashPassword } from '../config/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../subscription_management.db');

const db = new sqlite3.Database(dbPath);

// Function to promisify database operations
const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ insertId: this.lastID, changes: this.changes });
    });
  });
};

const dbExec = (query) => {
  return new Promise((resolve, reject) => {
    db.exec(query, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Clean database setup - only schema and admin user
async function setupCleanDatabase() {
  try {
    console.log('🗄️  Setting up clean database (schema only)...');
    
    // Create schema
    const schemaQuery = `
    -- Drop existing tables
    DROP TABLE IF EXISTS audit_logs;
    DROP TABLE IF EXISTS subscriptions;
    DROP TABLE IF EXISTS discounts;
    DROP TABLE IF EXISTS subscription_plans;
    DROP TABLE IF EXISTS users;

    -- Users table
    CREATE TABLE users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('Admin', 'EndUser')) DEFAULT 'EndUser',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Subscription plans table
    CREATE TABLE subscription_plans (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        description TEXT,
        product_type TEXT CHECK(product_type IN ('Fibernet', 'Broadband Copper')) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        data_quota INTEGER NOT NULL, -- in GB
        duration_days INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Subscriptions table
    CREATE TABLE subscriptions (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        status TEXT CHECK(status IN ('Active', 'Cancelled', 'Expired')) DEFAULT 'Active',
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        auto_renew BOOLEAN DEFAULT 0,
        data_used INTEGER DEFAULT 0, -- in MB
        discount_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE,
        FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE SET NULL
    );

    -- Discounts table
    CREATE TABLE discounts (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        description TEXT,
        discount_percent DECIMAL(5,2) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        plan_id TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE
    );

    -- Audit logs table
    CREATE TABLE audit_logs (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Indexes for better performance
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
    CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);
    CREATE INDEX idx_subscriptions_status ON subscriptions(status);
    CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
    CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
    `;

    await dbExec(schemaQuery);
    console.log('✅ Database schema created successfully');

    // Create only the admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await hashPassword('admin123');
    await dbRun(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@subscription.com', adminPassword, 'Admin']
    );
    
    console.log('✅ Clean database setup completed!');
    console.log('');
    console.log('🔑 Admin Credentials:');
    console.log('   Email: admin@subscription.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('   1. Login as admin to create plans');
    console.log('   2. Register real users through the frontend');
    console.log('   3. Create subscriptions through the admin interface');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error setting up clean database:', error);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('🔒 Database connection closed');
      }
    });
  }
}

// Run the clean setup
setupCleanDatabase();
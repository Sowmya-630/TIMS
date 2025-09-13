import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { hashPassword } from '../config/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../subscription_management.db');

const db = new sqlite3.Database(dbPath);

// Sample user data with plain text passwords
const sampleUsers = [
  { fullName: 'Admin User', email: 'admin@subscription.com', password: 'admin123', role: 'Admin' },
  { fullName: 'John Doe', email: 'john.doe@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Jane Smith', email: 'jane.smith@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Michael Johnson', email: 'michael.johnson@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Sarah Wilson', email: 'sarah.wilson@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'David Brown', email: 'david.brown@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Emily Davis', email: 'emily.davis@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Robert Miller', email: 'robert.miller@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Lisa Anderson', email: 'lisa.anderson@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'James Taylor', email: 'james.taylor@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Maria Garcia', email: 'maria.garcia@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Christopher Martinez', email: 'chris.martinez@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Jennifer Lopez', email: 'jennifer.lopez@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Daniel Rodriguez', email: 'daniel.rodriguez@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Ashley Thompson', email: 'ashley.thompson@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Matthew White', email: 'matthew.white@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Amanda Harris', email: 'amanda.harris@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Joshua Clark', email: 'joshua.clark@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Jessica Lewis', email: 'jessica.lewis@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Andrew Walker', email: 'andrew.walker@email.com', password: 'password123', role: 'EndUser' },
  { fullName: 'Guna Kumar', email: 'guna@email.com', password: 'password123', role: 'EndUser' }
];

const clearDataQuery = `
-- Clear existing data
DELETE FROM audit_logs;
DELETE FROM subscriptions;
DELETE FROM discounts;
DELETE FROM subscription_plans;
DELETE FROM users;
`;

const plansAndDiscountsQuery = `
-- Sample subscription plans
INSERT INTO subscription_plans (name, description, product_type, price, data_quota, duration_days) VALUES
('Basic Fibernet', 'Entry level fiber internet plan', 'Fibernet', 29.99, 100, 30),
('Premium Fibernet', 'High-speed fiber internet plan', 'Fibernet', 49.99, 500, 30),
('Enterprise Fibernet', 'Business grade fiber internet', 'Fibernet', 99.99, 1000, 30),
('Basic Broadband', 'Standard copper broadband', 'Broadband Copper', 19.99, 50, 30),
('Premium Broadband', 'Enhanced copper broadband', 'Broadband Copper', 34.99, 200, 30),
('Luxury Fibernet', 'Ultra-premium fiber internet with unlimited data', 'Fibernet', 500.00, 5000, 30);

-- Sample discounts
INSERT INTO discounts (name, description, discount_percent, start_date, end_date) VALUES
('Welcome Offer', '20% off first month for new subscribers', 20.0, '2024-01-01', '2024-12-31'),
('Summer Deal', '15% off summer plans', 15.0, '2024-06-01', '2024-08-31'),
('Student Discount', '10% off for students', 10.0, '2024-01-01', '2024-12-31'),
('Family Plan', '25% off for family subscriptions', 25.0, '2024-01-01', '2024-12-31');
`;

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

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with comprehensive sample data...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await dbExec(clearDataQuery);
    
    // Insert plans and discounts
    console.log('📋 Creating subscription plans and discounts...');
    await dbExec(plansAndDiscountsQuery);
    
    // Insert users with hashed passwords
    console.log('👥 Creating users with hashed passwords...');
    for (const user of sampleUsers) {
      const hashedPassword = await hashPassword(user.password);
      await dbRun(
        'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
        [user.fullName, user.email, hashedPassword, user.role]
      );
    }
    
    // Create subscriptions
    console.log('📊 Creating sample subscriptions...');
    const subscriptionMappings = [
      { email: 'john.doe@email.com', plan: 'Premium Fibernet', status: 'Active' },
      { email: 'jane.smith@email.com', plan: 'Basic Fibernet', status: 'Active' },
      { email: 'michael.johnson@email.com', plan: 'Enterprise Fibernet', status: 'Active' },
      { email: 'sarah.wilson@email.com', plan: 'Basic Broadband', status: 'Cancelled' },
      { email: 'david.brown@email.com', plan: 'Premium Fibernet', status: 'Active' },
      { email: 'emily.davis@email.com', plan: 'Basic Fibernet', status: 'Active' },
      { email: 'robert.miller@email.com', plan: 'Premium Broadband', status: 'Expired' },
      { email: 'lisa.anderson@email.com', plan: 'Premium Fibernet', status: 'Active' },
      { email: 'james.taylor@email.com', plan: 'Basic Fibernet', status: 'Active' },
      { email: 'maria.garcia@email.com', plan: 'Enterprise Fibernet', status: 'Active' },
      { email: 'chris.martinez@email.com', plan: 'Basic Broadband', status: 'Cancelled' },
      { email: 'jennifer.lopez@email.com', plan: 'Premium Fibernet', status: 'Active' },
      { email: 'daniel.rodriguez@email.com', plan: 'Basic Fibernet', status: 'Active' },
      { email: 'ashley.thompson@email.com', plan: 'Premium Broadband', status: 'Active' },
      { email: 'matthew.white@email.com', plan: 'Basic Fibernet', status: 'Expired' },
      { email: 'amanda.harris@email.com', plan: 'Premium Fibernet', status: 'Active' },
      { email: 'joshua.clark@email.com', plan: 'Enterprise Fibernet', status: 'Active' },
      { email: 'jessica.lewis@email.com', plan: 'Basic Broadband', status: 'Active' },
      { email: 'andrew.walker@email.com', plan: 'Premium Fibernet', status: 'Active' },
      { email: 'guna@email.com', plan: 'Luxury Fibernet', status: 'Active' }
    ];
    
    for (const mapping of subscriptionMappings) {
      await dbRun(`
        INSERT INTO subscriptions (user_id, plan_id, status, start_date, end_date, auto_renew, data_used)
        SELECT 
          u.id,
          p.id,
          ?,
          date('now', '-30 days'),
          date('now', '+30 days'),
          ?,
          ?
        FROM users u, subscription_plans p
        WHERE u.email = ? AND p.name = ?
      `, [
        mapping.status,
        Math.random() > 0.5 ? 1 : 0, // random auto_renew
        Math.floor(Math.random() * 500) + 100, // random data_used
        mapping.email,
        mapping.plan
      ]);
    }
    
    // Create audit logs
    console.log('📝 Creating audit logs...');
    await dbRun(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
      SELECT 
        s.user_id,
        'create',
        'subscription',
        s.id,
        'Subscription created with plan ' || p.name
      FROM subscriptions s
      JOIN subscription_plans p ON s.plan_id = p.id
      LIMIT 10
    `);
    
    console.log('✅ Seeding completed successfully!');
    console.log('');
    console.log('🔑 Test Credentials:');
    console.log('   Admin: admin@subscription.com / admin123');
    console.log('   Users: john.doe@email.com / password123 (and others)');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
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

// Run the seeding
seedDatabase();
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../subscription_management.db');

const db = new sqlite3.Database(dbPath);

const seedData = `
-- Clear existing data
DELETE FROM audit_logs;
DELETE FROM subscriptions;
DELETE FROM discounts;
DELETE FROM subscription_plans;
DELETE FROM users;

-- Sample users (20 entries)
INSERT INTO users (full_name, email, password, role) VALUES
('Admin User', 'admin@subscription.com', '$2b$10$example', 'Admin'),
('John Doe', 'john.doe@email.com', '$2b$10$example', 'EndUser'),
('Jane Smith', 'jane.smith@email.com', '$2b$10$example', 'EndUser'),
('Michael Johnson', 'michael.johnson@email.com', '$2b$10$example', 'EndUser'),
('Sarah Wilson', 'sarah.wilson@email.com', '$2b$10$example', 'EndUser'),
('David Brown', 'david.brown@email.com', '$2b$10$example', 'EndUser'),
('Emily Davis', 'emily.davis@email.com', '$2b$10$example', 'EndUser'),
('Robert Miller', 'robert.miller@email.com', '$2b$10$example', 'EndUser'),
('Lisa Anderson', 'lisa.anderson@email.com', '$2b$10$example', 'EndUser'),
('James Taylor', 'james.taylor@email.com', '$2b$10$example', 'EndUser'),
('Maria Garcia', 'maria.garcia@email.com', '$2b$10$example', 'EndUser'),
('Christopher Martinez', 'chris.martinez@email.com', '$2b$10$example', 'EndUser'),
('Jennifer Lopez', 'jennifer.lopez@email.com', '$2b$10$example', 'EndUser'),
('Daniel Rodriguez', 'daniel.rodriguez@email.com', '$2b$10$example', 'EndUser'),
('Ashley Thompson', 'ashley.thompson@email.com', '$2b$10$example', 'EndUser'),
('Matthew White', 'matthew.white@email.com', '$2b$10$example', 'EndUser'),
('Amanda Harris', 'amanda.harris@email.com', '$2b$10$example', 'EndUser'),
('Joshua Clark', 'joshua.clark@email.com', '$2b$10$example', 'EndUser'),
('Jessica Lewis', 'jessica.lewis@email.com', '$2b$10$example', 'EndUser'),
('Andrew Walker', 'andrew.walker@email.com', '$2b$10$example', 'EndUser');

-- Sample subscription plans
INSERT INTO subscription_plans (name, description, product_type, price, data_quota, duration_days) VALUES
('Basic Fibernet', 'Entry level fiber internet plan', 'Fibernet', 29.99, 100, 30),
('Premium Fibernet', 'High-speed fiber internet plan', 'Fibernet', 49.99, 500, 30),
('Enterprise Fibernet', 'Business grade fiber internet', 'Fibernet', 99.99, 1000, 30),
('Basic Broadband', 'Standard copper broadband', 'Broadband Copper', 19.99, 50, 30),
('Premium Broadband', 'Enhanced copper broadband', 'Broadband Copper', 34.99, 200, 30);

-- Sample discounts
INSERT INTO discounts (name, description, discount_percent, start_date, end_date) VALUES
('Welcome Offer', '20% off first month for new subscribers', 20.0, '2024-01-01', '2024-12-31'),
('Summer Deal', '15% off summer plans', 15.0, '2024-06-01', '2024-08-31'),
('Student Discount', '10% off for students', 10.0, '2024-01-01', '2024-12-31'),
('Family Plan', '25% off for family subscriptions', 25.0, '2024-01-01', '2024-12-31');
`;

// Get user and plan IDs for creating subscriptions
const getIdsAndCreateSubscriptions = `
-- Sample subscriptions (linking users to plans)
INSERT INTO subscriptions (user_id, plan_id, status, start_date, end_date, auto_renew, data_used) 
SELECT 
    u.id as user_id,
    p.id as plan_id,
    CASE 
        WHEN u.email LIKE '%john%' THEN 'Active'
        WHEN u.email LIKE '%jane%' THEN 'Active'
        WHEN u.email LIKE '%michael%' THEN 'Active'
        WHEN u.email LIKE '%sarah%' THEN 'Cancelled'
        WHEN u.email LIKE '%david%' THEN 'Active'
        WHEN u.email LIKE '%emily%' THEN 'Active'
        WHEN u.email LIKE '%robert%' THEN 'Expired'
        WHEN u.email LIKE '%lisa%' THEN 'Active'
        WHEN u.email LIKE '%james%' THEN 'Active'
        WHEN u.email LIKE '%maria%' THEN 'Active'
        WHEN u.email LIKE '%chris%' THEN 'Cancelled'
        WHEN u.email LIKE '%jennifer%' THEN 'Active'
        WHEN u.email LIKE '%daniel%' THEN 'Active'
        WHEN u.email LIKE '%ashley%' THEN 'Active'
        WHEN u.email LIKE '%matthew%' THEN 'Expired'
        ELSE 'Active'
    END as status,
    date('now', '-30 days') as start_date,
    date('now', '+30 days') as end_date,
    CASE WHEN ABS(RANDOM()) % 2 = 0 THEN 1 ELSE 0 END as auto_renew,
    (ABS(RANDOM()) % 500 + 100) as data_used
FROM users u
CROSS JOIN subscription_plans p
WHERE u.role = 'EndUser' 
    AND u.email NOT LIKE '%admin%'
    AND (
        (u.email LIKE '%john%' AND p.name = 'Premium Fibernet') OR
        (u.email LIKE '%jane%' AND p.name = 'Basic Fibernet') OR
        (u.email LIKE '%michael%' AND p.name = 'Enterprise Fibernet') OR
        (u.email LIKE '%sarah%' AND p.name = 'Basic Broadband') OR
        (u.email LIKE '%david%' AND p.name = 'Premium Fibernet') OR
        (u.email LIKE '%emily%' AND p.name = 'Basic Fibernet') OR
        (u.email LIKE '%robert%' AND p.name = 'Premium Broadband') OR
        (u.email LIKE '%lisa%' AND p.name = 'Premium Fibernet') OR
        (u.email LIKE '%james%' AND p.name = 'Basic Fibernet') OR
        (u.email LIKE '%maria%' AND p.name = 'Enterprise Fibernet') OR
        (u.email LIKE '%chris%' AND p.name = 'Basic Broadband') OR
        (u.email LIKE '%jennifer%' AND p.name = 'Premium Fibernet') OR
        (u.email LIKE '%daniel%' AND p.name = 'Basic Fibernet') OR
        (u.email LIKE '%ashley%' AND p.name = 'Premium Broadband') OR
        (u.email LIKE '%matthew%' AND p.name = 'Basic Fibernet') OR
        (u.email LIKE '%amanda%' AND p.name = 'Premium Fibernet') OR
        (u.email LIKE '%joshua%' AND p.name = 'Enterprise Fibernet') OR
        (u.email LIKE '%jessica%' AND p.name = 'Basic Broadband') OR
        (u.email LIKE '%andrew%' AND p.name = 'Premium Fibernet')
    );

-- Sample audit logs
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
SELECT 
    s.user_id,
    'create',
    'subscription',
    s.id,
    'Subscription created with plan ' || p.name
FROM subscriptions s
JOIN subscription_plans p ON s.plan_id = p.id
LIMIT 10;
`;

db.serialize(() => {
  console.log('🌱 Seeding database with comprehensive sample data...');
  
  db.exec(seedData, (err) => {
    if (err) {
      console.error('Error seeding basic data:', err);
      return;
    }
    console.log('✅ Basic data seeded successfully');
    
    // Now create subscriptions
    db.exec(getIdsAndCreateSubscriptions, (err) => {
      if (err) {
        console.error('Error creating subscriptions:', err);
      } else {
        console.log('✅ Subscriptions and audit logs created successfully');
      }
      
      // Close database
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('✅ Seeding completed - 20 users with subscriptions created');
        }
      });
    });
  });
});
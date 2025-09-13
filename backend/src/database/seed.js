import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../subscription_management.db');

const db = new sqlite3.Database(dbPath);

const seedData = `
-- Sample users
INSERT INTO users (full_name, email, password, role) VALUES
('Admin User', 'admin@subscription.com', '$2b$10$example', 'Admin'),
('John Doe', 'john@email.com', '$2b$10$example', 'EndUser'),
('Jane Smith', 'jane@email.com', '$2b$10$example', 'EndUser');

-- Sample subscription plans
INSERT INTO subscription_plans (name, description, product_type, price, data_quota, duration_days) VALUES
('Basic Fibernet', 'Entry level fiber plan', 'Fibernet', 29.99, 100, 30),
('Premium Fibernet', 'High-speed fiber plan', 'Fibernet', 49.99, 500, 30),
('Basic Broadband', 'Standard broadband', 'Broadband Copper', 19.99, 50, 30);

-- Sample discounts
INSERT INTO discounts (name, description, discount_percent, start_date, end_date) VALUES
('Welcome Offer', '20% off first month', 20.0, '2024-01-01', '2024-12-31'),
('Summer Deal', '15% off summer plans', 15.0, '2024-06-01', '2024-08-31');
`;

db.serialize(() => {
  console.log('🌱 Seeding database with sample data...');
  
  db.exec(seedData, (err) => {
    if (err) {
      console.error('Error seeding database:', err);
    } else {
      console.log('✅ Database seeded successfully');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('✅ Seeding completed');
  }
});
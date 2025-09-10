# TIMS Backend API

Trading Inventory Management System (TIMS) Backend API built with Node.js, Express.js, and MySQL.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Manager, Staff)
- Secure password hashing with bcrypt
- Rate limiting for security

### 📦 Product Management
- CRUD operations for products
- Stock level tracking
- Reorder point management
- Product categorization
- Low stock and out-of-stock alerts

### 🏢 Supplier Management
- Supplier information management
- Order history tracking
- Supplier statistics and analytics

### 📊 Inventory Transactions
- Stock in/out transactions
- Transaction history and reporting
- Real-time stock level updates
- Transaction validation

### 📋 Order Management
- Order creation and tracking
- Order status management
- Overdue order detection
- Order history and analytics

### 🔔 Notifications System
- Automated low stock alerts
- Overdue order notifications
- System notifications
- Real-time notification delivery

### 📈 Analytics & Reporting
- Comprehensive statistics
- Inventory reports
- Transaction analytics
- Performance metrics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Scheduling**: Cron Jobs
- **Validation**: Express Validator

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tims-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=tims_database
   DB_USER=root
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Email Configuration (for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE tims_database;
   ```

5. **Run Database Migration**
   ```bash
   npm run migrate
   ```

6. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Database Operations
```bash
# Run migrations
npm run migrate

# Seed database
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Users (Admin/Manager)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/role/:role` - Get users by role
- `GET /api/users/stats` - Get user statistics

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Manager/Admin)
- `PUT /api/products/:id` - Update product (Manager/Admin)
- `DELETE /api/products/:id` - Delete product (Manager/Admin)
- `PUT /api/products/:id/stock` - Update stock level
- `GET /api/products/low-stock` - Get low stock products
- `GET /api/products/out-of-stock` - Get out of stock products
- `GET /api/products/categories` - Get product categories
- `GET /api/products/stats` - Get product statistics

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Create supplier (Manager/Admin)
- `PUT /api/suppliers/:id` - Update supplier (Manager/Admin)
- `DELETE /api/suppliers/:id` - Delete supplier (Manager/Admin)
- `GET /api/suppliers/:id/products` - Get supplier's products
- `GET /api/suppliers/:id/orders` - Get supplier's order history
- `GET /api/suppliers/:id/stats` - Get supplier statistics

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/product/:productId` - Get transactions by product
- `GET /api/transactions/user/:userId` - Get transactions by user
- `GET /api/transactions/recent` - Get recent transactions
- `GET /api/transactions/stats` - Get transaction statistics
- `DELETE /api/transactions/:id` - Delete transaction (Manager/Admin)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order (Manager/Admin)
- `PUT /api/orders/:id` - Update order (Manager/Admin)
- `PUT /api/orders/:id/status` - Update order status (Manager/Admin)
- `DELETE /api/orders/:id` - Delete order (Manager/Admin)
- `GET /api/orders/supplier/:supplierId` - Get orders by supplier
- `GET /api/orders/product/:productId` - Get orders by product
- `GET /api/orders/overdue` - Get overdue orders
- `GET /api/orders/pending` - Get pending orders
- `GET /api/orders/stats` - Get order statistics

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/:id` - Get notification by ID
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/:id/unread` - Mark notification as unread
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread-count` - Get unread count
- `GET /api/notifications/recent` - Get recent notifications
- `GET /api/notifications/admin/all` - Get all notifications (Admin)
- `POST /api/notifications/admin/system` - Create system notification (Admin)

## Default Users

After running the seed script, you can use these default accounts:

- **Admin**: admin@tims.com / password123
- **Manager**: manager@tims.com / password123
- **Staff**: staff@tims.com / password123

## Role Permissions

### Admin
- Full access to all features
- User management
- System configuration
- All CRUD operations

### Manager
- Product management
- Supplier management
- Order management
- Transaction management
- View all data

### Staff
- View products and stock levels
- Perform stock transactions
- View notifications
- Limited access to other features

## Database Schema

The system uses the following main tables:
- `users` - User accounts and roles
- `suppliers` - Supplier information
- `products` - Product catalog
- `orders` - Purchase orders
- `transactions` - Stock transactions
- `notifications` - System notifications
- `product_categories` - Product categories

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- SQL injection prevention
- XSS protection

## Monitoring & Logging

- Winston logging system
- Error tracking
- Performance monitoring
- Health check endpoint
- Request logging

## Scheduled Jobs

- Low stock checking (every hour)
- Overdue order detection (every 6 hours)
- Notification cleanup (daily at 2 AM)

## Error Handling

- Comprehensive error handling
- Custom error messages
- HTTP status codes
- Error logging
- Graceful degradation

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.


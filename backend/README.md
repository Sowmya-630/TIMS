# TIMS Backend API

Trading Inventory Management System (TIMS) Backend API built with Node.js, Express.js, and SQLite.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create database and tables
npm run migrate

# 3. Add sample data (optional)
npm run seed

# 4. Start server
npm run dev
```

**Server will run on:** http://localhost:5000  
**Health check:** http://localhost:5000/health  
**API Base:** http://localhost:5000/api

## Features

- 🔐 JWT authentication with role-based access (Admin, Manager, Staff)
- 📦 Product management with stock tracking
- 🏢 Supplier management
- 📊 Inventory transactions
- 📋 Order management
- 🔔 Automated notifications
- 📈 Analytics & reporting

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (serverless)
- **Authentication:** JWT
- **Security:** Helmet, CORS, Rate Limiting

## Database

- **File:** `tims.db` (created automatically)
- **Location:** `backend/tims.db`
- **Custom path:** Set `SQLITE_DB_PATH` in `.env`

## Environment Variables

Create `backend/.env` (optional - has defaults):

```env
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h
PORT=5000
SQLITE_DB_PATH=/path/to/tims.db
CORS_ORIGIN=http://localhost:3000
```

## Default Users

After running `npm run seed`:

- **Admin:** admin@tims.com / password123
- **Manager:** manager@tims.com / password123  
- **Staff:** staff@tims.com / password123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/profile` - Get profile

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Suppliers
- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update status

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

## Commands

```bash
cd /..path/TIMS/backend
npm install
npm run migrate && npm run seed
npm run dev
```

## Troubleshooting

**Port 5000 in use?**
- macOS: Disable AirPlay Receiver in System Settings
- Or use different port: `PORT=5001 npm run dev`

**Database issues?**
- Delete `tims.db` and run `npm run migrate && npm run seed`

## License

MIT License

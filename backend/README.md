# Subscription Management System - Backend

## Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env file if needed (optional - defaults work fine)
```

### 3. Database Setup
```bash
# Create database and seed with sample data
npm run migrate && npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

## Available Scripts

- `npm run migrate` - Create database tables
- `npm run seed` - Add sample data
- `npm run setup` - Run migrate + seed together
- `npm run dev` - Start development server
- `npm start` - Start production server

## Database

The system uses SQLite with the database file `subscription_management.db` created automatically in the backend folder.

### Sample Data Included:
- **Users:** Admin + 2 End Users
- **Plans:** Basic/Premium Fibernet + Basic Broadband
- **Discounts:** Welcome Offer + Summer Deal

## API Endpoints

Server runs on `http://localhost:5000` by default.

## Environment Variables

All environment variables have sensible defaults. The only required setup is copying `env.example` to `.env`.

Key variables:
- `PORT=5000` - Server port
- `SQLITE_DB_PATH=./subscription_management.db` - Database file path
- `JWT_SECRET=change_me` - JWT secret (change in production)
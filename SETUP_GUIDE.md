# Complete Setup Guide for Auth Integration

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend

# Install dependencies (if not already done)
npm install

# Setup database with proper hashed passwords
npm run setup

# Start the backend server
npm start
```

### 2. Frontend Setup
```bash
cd frontend/project

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

### 3. Test the Integration
- Open browser to: `http://localhost:5173/auth`
- Use these credentials:

**Admin Login:**
- Email: `admin@subscription.com`
- Password: `admin123`

**End User Login:**
- Email: `john.doe@email.com`
- Password: `password123`

## 🔧 Detailed Setup Steps

### Backend Database Setup

The backend uses SQLite with properly hashed passwords. The seed script creates:

1. **Admin User**: 
   - Email: admin@subscription.com
   - Password: admin123 (hashed with bcrypt)
   - Role: Admin

2. **19 End Users**: 
   - Emails: john.doe@email.com, jane.smith@email.com, etc.
   - Password: password123 (hashed with bcrypt)
   - Role: EndUser

3. **5 Subscription Plans**: Basic/Premium/Enterprise Fibernet, Basic/Premium Broadband

4. **Sample Subscriptions**: Each user has a subscription to different plans

5. **Discounts**: Welcome offers, seasonal deals, etc.

### Frontend Configuration

The frontend is configured to:
- Connect to backend API at `http://localhost:5000/api`
- Handle JWT token storage and management
- Provide role-based routing (Admin → AdminDashboard, EndUser → UserDashboard)
- Auto-redirect after successful login

## 🧪 Testing the Integration

### Manual Testing Steps:

1. **Start Backend**:
   ```bash
   cd backend
   npm run setup  # This runs migrate.js then seed.js
   npm start      # Server starts on port 5000
   ```

2. **Start Frontend**:
   ```bash
   cd frontend/project
   npm run dev    # Vite dev server starts on port 5173
   ```

3. **Test Admin Login**:
   - Go to `http://localhost:5173/auth`
   - Enter: admin@subscription.com / admin123
   - Should redirect to AdminDashboard

4. **Test End User Login**:
   - Go to `http://localhost:5173/auth`
   - Enter: john.doe@email.com / password123
   - Should redirect to UserDashboard

5. **Test Registration**:
   - Toggle to "Sign up" mode
   - Create a new account
   - Should automatically log in and redirect

### API Testing (Optional):

You can also test the backend APIs directly:

```bash
# Test admin login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@subscription.com","password":"admin123"}'

# Test user login  
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@email.com","password":"password123"}'
```

## 🔍 Troubleshooting

### Backend Issues:

1. **Database not found**:
   ```bash
   cd backend
   npm run migrate  # Creates the database schema
   npm run seed     # Populates with sample data
   ```

2. **Server won't start**:
   - Check if port 5000 is available
   - Verify .env file exists with JWT_SECRET
   - Check logs for specific errors

3. **Login fails**:
   - Ensure database was seeded properly
   - Check if passwords are hashed correctly
   - Verify JWT_SECRET is set

### Frontend Issues:

1. **Can't connect to backend**:
   - Verify backend is running on port 5000
   - Check .env file has correct VITE_API_URL
   - Check browser console for CORS errors

2. **Login form doesn't work**:
   - Check browser console for JavaScript errors
   - Verify AuthContext is properly wrapped around App
   - Check network tab for API request/response

3. **Routing issues**:
   - Verify React Router is properly configured
   - Check if ProtectedRoute component exists
   - Ensure user role matches route requirements

## 📁 File Structure

```
backend/
├── src/
│   ├── controllers/userController.js    # Login/register logic
│   ├── models/userModel.js             # User model with password hashing
│   ├── routes/userRoutes.js            # Auth API endpoints
│   ├── config/auth.js                  # Password hashing utilities
│   ├── database/
│   │   ├── migrate.js                  # Database schema creation
│   │   └── seed.js                     # Sample data with hashed passwords
│   └── server.js                       # Express server setup
└── .env                                # JWT secret and config

frontend/project/
├── src/
│   ├── pages/AuthPage.tsx              # Login/signup form
│   ├── context/AuthContext.tsx         # Authentication state management
│   ├── services/
│   │   ├── authService.ts              # Auth API calls
│   │   └── api.ts                      # Base API service
│   ├── components/ProtectedRoute.tsx   # Route protection
│   └── App.tsx                         # Main app with routing
└── .env                                # API URL configuration
```

## ✅ Success Indicators

When everything is working correctly, you should see:

1. **Backend Console**:
   ```
   🚀 Server running on port 5000
   📊 Environment: development
   🔗 API Base URL: http://localhost:5000/api
   ```

2. **Frontend Console** (no errors):
   - No CORS errors
   - Successful API calls to /api/users/login
   - JWT token stored in localStorage

3. **Browser Behavior**:
   - Login form accepts credentials
   - Successful login redirects to appropriate dashboard
   - Protected routes work correctly
   - Logout clears authentication state

## 🎯 Next Steps

After successful setup:
1. Explore the admin dashboard features
2. Test subscription management
3. Try creating new users
4. Test role-based access control
5. Customize the UI/UX as needed

The authentication system is now fully integrated and ready for development!
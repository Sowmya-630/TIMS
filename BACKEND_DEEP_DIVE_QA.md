# 🔥 Backend & API Integration Deep Dive Q&A

## 🏗️ **Backend Architecture Questions**

### **Q1: Walk me through your backend architecture and folder structure**
**A:** *"I built a modular Node.js/Express backend with clear separation of concerns:*

```
backend/src/
├── config/          # Database, auth, logger configurations
├── controllers/     # Business logic handlers
├── middleware/      # Authentication, rate limiting, error handling
├── models/          # Data models with ORM-like patterns
├── routes/          # API endpoint definitions
└── server.js        # Main application entry point
```

*The architecture follows MVC pattern where:*
- **Models** handle data operations and business rules
- **Controllers** process requests and coordinate between models
- **Routes** define API endpoints and apply middleware
- **Middleware** handles cross-cutting concerns like auth and validation"*

---

### **Q2: Explain your data models and their relationships**
**A:** *"I designed 5 core models with clear relationships:*

**1. User Model (`userModel.js`)**
```javascript
// Core user entity with authentication
class User {
  // Properties: id, fullName, email, role, createdAt
  static async create(userData)     // Registration
  static async findByEmail(email)   // Login lookup
  async verifyPassword(password)    // Authentication
  async delete()                    // Cascade deletion
  async getSubscriptions()          // Relationship method
}
```

**2. SubscriptionPlan Model (`planModel.js`)**
```javascript
// Telecom service offerings
class SubscriptionPlan {
  // Properties: name, price, dataQuota, durationDays, productType
  static async findAll(filters)     // Admin management
  async update(data)                // Plan modifications
  async delete()                    // Cascade deletion
}
```

**3. Subscription Model (`subscriptionModel.js`)**
```javascript
// Links users to plans with status tracking
class Subscription {
  // Properties: userId, planId, status, startDate, endDate
  static async findByUserId(id)     // User's subscriptions
  async updateStatus(status)        // Lifecycle management
  async getWithPlanDetails()        // Join with plan data
}
```

**Key Relationships:**
- User → Subscriptions (One-to-Many)
- Plan → Subscriptions (One-to-Many)  
- Subscription → User + Plan (Many-to-One each)
- Foreign key constraints with cascade deletion"*

---

### **Q3: How did you implement authentication and authorization?**
**A:** *"I built a comprehensive JWT-based auth system:*

**Authentication Flow:**
```javascript
// 1. User Registration/Login
export const loginUser = async (req, res) => {
  const user = await User.findByEmail(email);
  const isMatch = await user.verifyPassword(password);
  
  const token = jwt.sign(
    { id: user.id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
  res.json({ user: user.toJSON(), token });
};
```

**Authorization Middleware:**
```javascript
// 2. Token Verification
export const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  req.user = user;
  next();
};

// 3. Role-Based Access Control
export const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};
```

**Security Features:**
- Password hashing with bcrypt
- JWT tokens with expiration
- Role-based permissions (Admin vs EndUser)
- Protected routes with middleware chains"*

---

### **Q4: Explain your middleware implementation and why you chose each one**
**A:** *"I implemented several middleware layers for security and functionality:*

**1. Security Middleware (server.js)**
```javascript
// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

// CORS for cross-origin requests
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

**2. Rate Limiting (`rateLimiter.js`)**
```javascript
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // requests per window
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5 // stricter for auth endpoints
});
```

**3. Authentication Middleware Chain**
```javascript
// Routes with layered protection
app.use('/api/users', authLimiter, userRoutes);
router.delete('/:id', verifyToken, verifyRole('Admin'), deleteUser);
```

**Why Each Middleware:**
- **Helmet**: Prevents common security vulnerabilities
- **CORS**: Enables frontend-backend communication
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Compression**: Improves response times
- **Morgan**: Request logging for debugging"*

---

### **Q5: How did you handle database operations and why SQLite?**
**A:** *"I implemented a custom database layer with SQLite:*

**Database Configuration (`database.js`)**
```javascript
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = null;

export const getDatabase = async () => {
  if (!db) {
    db = await open({
      filename: process.env.DB_PATH || './database.sqlite',
      driver: sqlite3.Database
    });
  }
  return db;
};

export const executeQuery = async (query, params = []) => {
  const database = await getDatabase();
  return await database.all(query, params);
};
```

**Model Pattern Example:**
```javascript
// Clean abstraction over raw SQL
static async findAll(page = 1, limit = 10, search = '') {
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM users';
  let params = [];

  if (search) {
    query += ' WHERE full_name LIKE ? OR email LIKE ?';
    params = [`%${search}%`, `%${search}%`];
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const users = await executeQuery(query, params);
  return users.map(user => new User(user));
}
```

**Why SQLite:**
- **Simplicity**: No separate database server needed
- **Performance**: Fast for small to medium applications
- **Portability**: Single file database
- **ACID Compliance**: Reliable transactions
- **Development Speed**: Quick setup and iteration"*

---

## 🔌 **API Integration Questions**

### **Q6: Walk me through your frontend API integration architecture**
**A:** *"I built a layered API integration system:*

**1. Base API Service (`api.ts`)**
```typescript
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  // Centralized request handling
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  }

  // HTTP method wrappers
  async get<T>(endpoint: string): Promise<T>
  async post<T>(endpoint: string, data?: any): Promise<T>
  async put<T>(endpoint: string, data?: any): Promise<T>
  async delete<T>(endpoint: string): Promise<T>
}
```

**2. Service Layer (`authService.ts`)**
```typescript
export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/users/login', credentials);
    
    if (response.token) {
      apiService.setToken(response.token);
    }
    
    return response;
  }

  async getUsers(params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const endpoint = queryParams.toString() ? `/users?${queryParams}` : '/users';
    return apiService.get<{ users: User[]; pagination: any }>(endpoint);
  }
}
```

**Architecture Benefits:**
- **Centralized Error Handling**: All API errors handled consistently
- **Token Management**: Automatic JWT token attachment
- **Type Safety**: TypeScript interfaces for all responses
- **Reusability**: Service methods used across components"*

---

### **Q7: How do you handle API errors and loading states?**
**A:** *"I implemented comprehensive error handling at multiple levels:*

**1. API Service Level Error Handling**
```typescript
private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error; // Re-throw for component handling
  }
}
```

**2. Component Level Error Handling**
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleLogin = async (credentials: LoginRequest) => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await authService.login(credentials);
    // Handle success
    
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Login failed');
  } finally {
    setLoading(false);
  }
};
```

**3. User Feedback Patterns**
```typescript
// Loading states
{loading && <Loader className="w-4 h-4 animate-spin" />}

// Error display
{error && (
  <div className="text-red-500 text-sm mt-2">
    {error}
  </div>
)}

// Success feedback
{success && (
  <div className="text-green-500 text-sm mt-2">
    Operation completed successfully
  </div>
)}
```

**Error Handling Strategy:**
- **Network Errors**: Caught and displayed to user
- **Validation Errors**: Server messages shown inline
- **Authentication Errors**: Redirect to login
- **Loading States**: Visual feedback during operations"*

---

### **Q8: Explain your API endpoint design and RESTful principles**
**A:** *"I followed RESTful conventions with logical resource organization:*

**Resource-Based URLs:**
```javascript
// User Management
GET    /api/users              // List users (admin)
POST   /api/users/register     // Create user
POST   /api/users/login        // Authenticate user
GET    /api/users/profile      // Current user profile
PUT    /api/users/profile      // Update current user
GET    /api/users/:id          // Get specific user
PUT    /api/users/:id          // Update specific user
DELETE /api/users/:id          // Delete user (admin)

// Subscription Plans
GET    /api/plans              // List plans
POST   /api/plans              // Create plan (admin)
GET    /api/plans/:id          // Get specific plan
PUT    /api/plans/:id          // Update plan (admin)
DELETE /api/plans/:id          // Delete plan (admin)

// Subscriptions
GET    /api/subscriptions      // List subscriptions
POST   /api/subscriptions      // Create subscription
GET    /api/subscriptions/:id  // Get specific subscription
PUT    /api/subscriptions/:id  // Update subscription
```

**HTTP Status Codes:**
```javascript
// Success responses
200 - OK (GET, PUT operations)
201 - Created (POST operations)
204 - No Content (DELETE operations)

// Error responses
400 - Bad Request (validation errors)
401 - Unauthorized (authentication required)
403 - Forbidden (insufficient permissions)
404 - Not Found (resource doesn't exist)
500 - Internal Server Error (server issues)
```

**Request/Response Patterns:**
```javascript
// Consistent response structure
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}

// Error response structure
{
  "error": "User not found",
  "message": "The requested user does not exist"
}
```

**RESTful Principles Applied:**
- **Stateless**: Each request contains all needed information
- **Resource-Based**: URLs represent resources, not actions
- **HTTP Methods**: Proper use of GET, POST, PUT, DELETE
- **Consistent Structure**: Predictable request/response formats"*

---

### **Q9: How did you implement pagination and filtering?**
**A:** *"I built flexible pagination and filtering at both backend and frontend:*

**Backend Implementation:**
```javascript
// Controller with query parameter handling
export const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  const users = await User.findAll(page, limit, search);
  const total = await User.count(search);

  res.json({
    users: users.map(user => user.toJSON()),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

// Model with SQL pagination
static async findAll(page = 1, limit = 10, search = '') {
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM users';
  let params = [];

  if (search) {
    query += ' WHERE full_name LIKE ? OR email LIKE ?';
    params = [`%${search}%`, `%${search}%`];
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const users = await executeQuery(query, params);
  return users.map(user => new User(user));
}
```

**Frontend Integration:**
```typescript
// Service method with query building
async getUsers(params?: { page?: number; limit?: number; search?: string }) {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/users?${queryString}` : '/users';
  
  return apiService.get<{ users: User[]; pagination: any }>(endpoint);
}

// Component usage
const loadUsers = async () => {
  const response = await authService.getUsers({ 
    page: currentPage, 
    limit: 10, 
    search: searchTerm 
  });
  setUsers(response.users);
  setPagination(response.pagination);
};
```

**Features:**
- **Dynamic Filtering**: Search across multiple fields
- **Efficient Pagination**: SQL LIMIT/OFFSET for performance
- **Flexible Parameters**: Optional query parameters
- **Consistent Interface**: Same pattern across all resources"*

---

### **Q10: What was the most challenging backend problem you solved?**
**A:** *"The most challenging problem was implementing cascade deletion for foreign key constraints:*

**The Problem:**
```
Database query error: [Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed]
DELETE /api/users/9df195b1-5cb5-fe2f-79f7-afbc4ca45023 500 7.384 ms
```

**Root Cause Analysis:**
- Users couldn't be deleted because they had active subscriptions
- Plans couldn't be deleted because subscriptions referenced them
- SQLite foreign key constraints prevented orphaned records

**Solution Implementation:**
```javascript
// Before: Simple deletion (failed)
async delete() {
  const query = 'DELETE FROM users WHERE id = ?';
  await executeQuery(query, [this.id]);
  return true;
}

// After: Cascade deletion (works)
async delete() {
  try {
    // 1. Delete dependent records first
    const deleteSubscriptionsQuery = 'DELETE FROM subscriptions WHERE user_id = ?';
    await executeQuery(deleteSubscriptionsQuery, [this.id]);
    
    // 2. Then delete the main record
    const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
    await executeQuery(deleteUserQuery, [this.id]);
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user and associated data');
  }
}
```

**Additional Safety Measures:**
```javascript
// Controller-level safety checks
if (user.role === 'Admin') {
  return res.status(403).json({ message: 'Cannot delete admin users' });
}

if (req.user.id === user.id) {
  return res.status(403).json({ message: 'Cannot delete your own account' });
}
```

**What I Learned:**
- Database relationships require careful deletion ordering
- Transaction management is crucial for data integrity
- Error handling should be specific and informative
- Safety checks prevent accidental data loss
- Testing edge cases is essential for robust systems"*

---

## 🚀 **Performance & Best Practices Questions**

### **Q11: How did you optimize your API performance?**
**A:** *"I implemented several performance optimizations:*

**1. Database Query Optimization:**
```javascript
// Efficient pagination with LIMIT/OFFSET
query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

// Indexed searches on commonly queried fields
WHERE full_name LIKE ? OR email LIKE ?

// Selective field loading
SELECT id, full_name, email, role FROM users
```

**2. Response Compression:**
```javascript
// Gzip compression for all responses
app.use(compression());

// JSON response size limits
app.use(express.json({ limit: '10mb' }));
```

**3. Caching Strategy:**
```javascript
// Token caching in frontend
setToken(token: string) {
  this.token = token;
  localStorage.setItem('authToken', token);
}

// Database connection pooling
let db = null;
export const getDatabase = async () => {
  if (!db) {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
  }
  return db;
};
```

**4. Rate Limiting:**
```javascript
// Prevent API abuse
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // requests per window
});
```

**Performance Results:**
- API responses under 100ms for most operations
- Efficient pagination handles large datasets
- Rate limiting prevents server overload
- Compressed responses reduce bandwidth usage"*

---

### **Q12: What security measures did you implement?**
**A:** *"I implemented comprehensive security at multiple layers:*

**1. Authentication Security:**
```javascript
// Strong password hashing
const hashedPassword = await bcrypt.hash(password, 12);

// JWT with expiration
const token = jwt.sign(
  { id: user.id, role: user.role }, 
  process.env.JWT_SECRET, 
  { expiresIn: '24h' }
);

// Token validation on every protected request
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

**2. HTTP Security Headers:**
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"]
    }
  }
}));
```

**3. Input Validation:**
```javascript
// SQL injection prevention with parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
await executeQuery(query, [email]);

// Request size limits
app.use(express.json({ limit: '10mb' }));
```

**4. CORS Configuration:**
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

**5. Rate Limiting:**
```javascript
// Different limits for different endpoints
app.use('/api/users', authLimiter); // Stricter for auth
app.use(generalLimiter); // General protection
```

**Security Principles Applied:**
- **Defense in Depth**: Multiple security layers
- **Principle of Least Privilege**: Role-based access
- **Input Validation**: All user input sanitized
- **Secure Defaults**: Restrictive CORS and CSP policies"*

---

## 🎯 **Interview Tips for Backend Questions**

### **Key Points to Emphasize:**
1. **Architecture Decisions**: Explain why you chose each technology
2. **Problem-Solving**: Focus on the cascade deletion challenge
3. **Security Awareness**: Demonstrate understanding of web security
4. **Performance Considerations**: Show you think about scalability
5. **Code Quality**: Highlight clean, maintainable patterns

### **Be Ready to Code:**
- Write a simple Express route with middleware
- Explain JWT token verification process
- Show how you handle database queries
- Demonstrate error handling patterns

### **Questions to Ask Them:**
1. "What's your current backend architecture?"
2. "How do you handle database migrations?"
3. "What's your approach to API versioning?"
4. "How do you monitor API performance?"

---

## 💪 **You're Ready!**

Your TIMS backend demonstrates:
✅ **Full-stack understanding** - Complete API design and implementation  
✅ **Security awareness** - JWT, RBAC, input validation  
✅ **Problem-solving skills** - Cascade deletion solution  
✅ **Performance optimization** - Pagination, caching, compression  
✅ **Clean architecture** - MVC pattern, middleware, separation of concerns  

**Confidence is key - you built a production-ready system! 🚀**
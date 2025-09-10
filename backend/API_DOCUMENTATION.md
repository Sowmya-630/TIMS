# TIMS API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "pagination": { ... } // Only for paginated endpoints
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ] // Only for validation errors
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "role": "Staff"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "Staff",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token"
}
```

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "Staff"
  },
  "token": "jwt-token"
}
```

#### Get Profile
```http
GET /auth/profile
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "Staff",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Products

#### Get All Products
```http
GET /products?page=1&limit=10&search=keyword&category=Electronics&stockStatus=low
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term
- `category` (optional): Filter by category
- `stockStatus` (optional): Filter by stock status (all, low, out, normal)

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Laptop Computer",
      "category": "Electronics",
      "description": "High-performance laptop",
      "stockLevel": 25,
      "reorderPoint": 5,
      "price": 1299.99,
      "supplierId": "uuid",
      "supplierName": "TechCorp Solutions",
      "stockStatus": "normal",
      "needsReorder": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Create Product
```http
POST /products
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "New Product",
  "category": "Electronics",
  "description": "Product description",
  "stockLevel": 100,
  "reorderPoint": 10,
  "price": 99.99,
  "supplierId": "uuid"
}
```

#### Update Stock
```http
PUT /products/:id/stock
```

**Request Body:**
```json
{
  "type": "Stock In",
  "quantity": 50,
  "reason": "Restock from supplier"
}
```

### Suppliers

#### Get All Suppliers
```http
GET /suppliers?page=1&limit=10&search=keyword
```

**Response:**
```json
{
  "suppliers": [
    {
      "id": "uuid",
      "name": "TechCorp Solutions",
      "contactPerson": "John Smith",
      "email": "john@techcorp.com",
      "phone": "+1-555-0123",
      "address": "123 Tech Street, Silicon Valley, CA 94000",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

### Transactions

#### Get All Transactions
```http
GET /transactions?page=1&limit=10&type=Stock In&productId=uuid&userId=uuid
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Transaction type (Stock In, Stock Out)
- `productId` (optional): Filter by product
- `userId` (optional): Filter by user
- `dateFrom` (optional): Start date filter
- `dateTo` (optional): End date filter

**Response:**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "productId": "uuid",
      "productName": "Laptop Computer",
      "type": "Stock In",
      "quantity": 50,
      "reason": "Restock from supplier",
      "userId": "uuid",
      "userName": "John Doe",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

#### Create Transaction
```http
POST /transactions
```

**Request Body:**
```json
{
  "productId": "uuid",
  "type": "Stock Out",
  "quantity": 5,
  "reason": "Sold to customer"
}
```

### Orders

#### Get All Orders
```http
GET /orders?page=1&limit=10&status=Pending&supplierId=uuid
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Order status (Pending, Confirmed, Shipped, Delivered, Overdue)
- `supplierId` (optional): Filter by supplier
- `productId` (optional): Filter by product
- `dateFrom` (optional): Start date filter
- `dateTo` (optional): End date filter

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "supplierId": "uuid",
      "supplierName": "TechCorp Solutions",
      "productId": "uuid",
      "productName": "Laptop Computer",
      "productCategory": "Electronics",
      "quantity": 10,
      "status": "Pending",
      "orderDate": "2024-01-01T00:00:00.000Z",
      "expectedDate": "2024-01-15T00:00:00.000Z",
      "deliveredDate": null,
      "isOverdue": false,
      "daysUntilExpected": 14
    }
  ],
  "pagination": { ... }
}
```

### Notifications

#### Get User Notifications
```http
GET /notifications?page=1&limit=10&unreadOnly=true
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `unreadOnly` (optional): Show only unread notifications

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "Low Stock",
      "title": "Low Stock Alert",
      "message": "Laptop Computer is running low (5 units remaining)",
      "isRead": false,
      "userId": "uuid",
      "productId": "uuid",
      "orderId": null,
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

#### Mark Notification as Read
```http
PUT /notifications/:id/read
```

**Response:**
```json
{
  "message": "Notification marked as read",
  "notification": { ... }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **API Endpoints**: 200 requests per 15 minutes

## Pagination

All list endpoints support pagination with these parameters:
- `page`: Page number (starts from 1)
- `limit`: Items per page (max 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Filtering and Searching

Most list endpoints support:
- **Search**: Text search across relevant fields
- **Date Filters**: `dateFrom` and `dateTo` parameters
- **Status Filters**: Filter by specific status values
- **ID Filters**: Filter by related entity IDs

## Sorting

Default sorting is by creation date (newest first). Some endpoints support custom sorting via query parameters.

## Examples

### Complete Workflow Example

1. **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@tims.com", "password": "password123"}'
```

2. **Create Product**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "New Product",
    "category": "Electronics",
    "description": "Product description",
    "stockLevel": 100,
    "reorderPoint": 10,
    "price": 99.99,
    "supplierId": "supplier-uuid"
  }'
```

3. **Update Stock**
```bash
curl -X PUT http://localhost:5000/api/products/product-uuid/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "type": "Stock In",
    "quantity": 50,
    "reason": "Restock from supplier"
  }'
```

4. **Get Notifications**
```bash
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer <token>"
```

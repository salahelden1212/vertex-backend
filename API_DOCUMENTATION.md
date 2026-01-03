# Backend API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend-url.com/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Public Routes

### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "OK",
  "message": "Vertex Finish API is running"
}
```

---

## Auth Routes

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@vertexfinish.com",
  "password": "Admin@123456"
}
```

**Success Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Admin",
    "email": "admin@vertexfinish.com",
    "role": "super-admin"
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Update Password
```http
PUT /api/auth/updatepassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Update User Details
```http
PUT /api/auth/updatedetails
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Name",
  "email": "newemail@example.com"
}
```

---

## Package Routes

### Get All Packages (Public)
```http
GET /api/packages?isActive=true
```

### Get Single Package (Public)
```http
GET /api/packages/:id
```

### Create Package (Protected)
```http
POST /api/packages
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": {
    "ar": "باقة ذهبية",
    "en": "Gold Package"
  },
  "description": {
    "ar": "وصف الباقة",
    "en": "Package description"
  },
  "priceBefore": 50000,
  "priceAfter": 40000,
  "features": [
    {
      "ar": "ميزة 1",
      "en": "Feature 1"
    },
    {
      "ar": "ميزة 2",
      "en": "Feature 2"
    }
  ],
  "badge": "popular",
  "isActive": true,
  "order": 1
}
```

### Update Package (Protected)
```http
PUT /api/packages/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "priceAfter": 35000,
  "badge": "vip"
}
```

### Delete Package (Protected)
```http
DELETE /api/packages/:id
Authorization: Bearer <token>
```

### Reorder Packages (Protected)
```http
PUT /api/packages/reorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "packageOrders": [
    { "id": "package1_id", "order": 1 },
    { "id": "package2_id", "order": 2 }
  ]
}
```

---

## Project Routes

### Get All Projects (Public)
```http
GET /api/projects?category=residential&isFeatured=true&isActive=true
```

### Get Projects by Category (Public)
```http
GET /api/projects/category/:category
```
Categories: `residential`, `commercial`, `administrative`

### Get Single Project (Public)
```http
GET /api/projects/:id
```

### Create Project (Protected)
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": {
    "ar": "مشروع فيلا فاخرة",
    "en": "Luxury Villa Project"
  },
  "description": {
    "ar": "وصف المشروع",
    "en": "Project description"
  },
  "category": "residential",
  "coverImage": "https://example.com/image.jpg",
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "caption": {
        "ar": "صورة 1",
        "en": "Image 1"
      }
    }
  ],
  "location": "Riyadh",
  "area": 500,
  "completionDate": "2024-12-31",
  "isFeatured": true,
  "isActive": true
}
```

### Update Project (Protected)
```http
PUT /api/projects/:id
Authorization: Bearer <token>
```

### Delete Project (Protected)
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

---

## Client Routes (All Protected)

### Get All Clients
```http
GET /api/clients?status=active&search=john
Authorization: Bearer <token>
```

### Get Single Client
```http
GET /api/clients/:id
Authorization: Bearer <token>
```

**Response includes:**
- Client details
- All properties
- Total payments
- Payment count

### Create Client
```http
POST /api/clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+966501234567",
  "email": "john@example.com",
  "address": "Riyadh, Saudi Arabia",
  "notes": "VIP client",
  "source": "website"
}
```

### Update Client
```http
PUT /api/clients/:id
Authorization: Bearer <token>
```

### Delete Client
```http
DELETE /api/clients/:id
Authorization: Bearer <token>
```

---

## Property Routes (All Protected)

### Get All Properties
```http
GET /api/properties?status=in-progress&clientId=client_id
Authorization: Bearer <token>
```

### Get Single Property
```http
GET /api/properties/:id
Authorization: Bearer <token>
```

**Response includes:**
- Property details
- All payments
- Total paid
- Remaining amount

### Create Property
```http
POST /api/properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "client": "client_id",
  "propertyType": "villa",
  "address": "123 Main St, Riyadh",
  "area": 500,
  "selectedPackage": "package_id",
  "totalPrice": 500000,
  "status": "pending",
  "startDate": "2024-01-01",
  "expectedEndDate": "2024-06-01",
  "notes": "Special requirements"
}
```

### Update Property
```http
PUT /api/properties/:id
Authorization: Bearer <token>
```

### Delete Property
```http
DELETE /api/properties/:id
Authorization: Bearer <token>
```

---

## Payment Routes (All Protected)

### Get All Payments
```http
GET /api/payments?propertyId=prop_id&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

### Get Payment Statistics
```http
GET /api/payments/stats?year=2024&month=6
Authorization: Bearer <token>
```

### Create Payment
```http
POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "property": "property_id",
  "amount": 50000,
  "paymentDate": "2024-01-15",
  "paymentMethod": "bank-transfer",
  "transactionId": "TXN123456",
  "notes": "First installment"
}
```

**Payment Methods:**
- `cash`
- `bank-transfer`
- `check`
- `credit-card`
- `other`

**Payment Status:**
- `pending`
- `completed`
- `failed`
- `refunded`

### Update Payment
```http
PUT /api/payments/:id
Authorization: Bearer <token>
```

### Delete Payment
```http
DELETE /api/payments/:id
Authorization: Bearer <token>
```

---

## Contact Routes

### Submit Contact Form (Public)
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+966501234567",
  "subject": "Inquiry about packages",
  "message": "I'm interested in your gold package"
}
```

### Get All Messages (Protected)
```http
GET /api/contact?status=new
Authorization: Bearer <token>
```

### Get Single Message (Protected)
```http
GET /api/contact/:id
Authorization: Bearer <token>
```

### Update Message Status (Protected)
```http
PUT /api/contact/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "replied",
  "notes": "Contacted via phone"
}
```

**Message Status:**
- `new`
- `read`
- `replied`
- `archived`

### Delete Message (Protected)
```http
DELETE /api/contact/:id
Authorization: Bearer <token>
```

---

## Settings Routes

### Get Settings (Public)
```http
GET /api/settings
```

### Update Settings (Protected)
```http
PUT /api/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "+966501234567",
  "email": "info@vertexfinish.com",
  "whatsapp": "+966501234567",
  "address": {
    "ar": "الرياض، السعودية",
    "en": "Riyadh, Saudi Arabia"
  },
  "socialMedia": {
    "facebook": "https://facebook.com/vertexfinish",
    "instagram": "https://instagram.com/vertexfinish",
    "twitter": "https://twitter.com/vertexfinish"
  }
}
```

---

## Dashboard Routes (All Protected)

### Get Dashboard Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalClients": 150,
      "totalProperties": 200,
      "activeProperties": 50,
      "completedProperties": 120,
      "totalRevenue": 50000000,
      "totalPaid": 35000000,
      "totalRemaining": 15000000,
      "unreadMessages": 5
    },
    "recentPayments": [...],
    "recentProperties": [...],
    "monthlyRevenue": [...],
    "propertiesByStatus": [...]
  }
}
```

### Get Financial Report
```http
GET /api/dashboard/financial-report?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Server Error",
  "stack": "..." // Only in development
}
```

---

## Rate Limiting
API requests are rate-limited to prevent abuse. If you exceed the limit, you'll receive a 429 status code.

---

## Notes

- All dates should be in ISO 8601 format
- Prices are in SAR (Saudi Riyal)
- File uploads (images) should be handled separately using multipart/form-data
- Receipt numbers are auto-generated for payments
- Settings are singleton (only one document exists)

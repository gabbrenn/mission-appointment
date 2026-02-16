# Authentication System - Complete Implementation

## 🎯 Overview

This is a production-ready JWT-based authentication system with comprehensive audit logging for the Mission Management application. It provides secure user login/logout functionality with automatic tracking of all authentication events.

## ✨ Features

- ✅ **Email/Password Authentication** - Secure user login with bcrypt password hashing
- ✅ **JWT Tokens** - Self-contained tokens with user and role information
- ✅ **24-Hour Expiration** - Configurable token lifetime
- ✅ **Automatic Audit Logging** - All login/logout events logged to database
- ✅ **IP & User-Agent Tracking** - Security information recorded with each auth event
- ✅ **Role-Based Access Control** - Built-in RBAC middleware
- ✅ **Login History** - Users can view their login/logout history
- ✅ **Account Status Check** - Only active accounts can login
- ✅ **Protected Routes** - Middleware for securing endpoints
- ✅ **Error Handling** - Comprehensive error messages with appropriate HTTP codes

## 🗂️ Project Structure

```
src/
├── controllers/
│   └── auth.controller.ts          # Login/logout/history endpoints
├── middleware/
│   └── auth.middleware.ts          # JWT verification & RBAC
├── repositories/
│   └── auditLog.repository.ts      # Audit logging queries
├── services/
│   └── auth.service.ts             # Core auth business logic
├── types/
│   ├── auth.types.ts               # TypeScript type definitions
│   └── user.dto.ts                 # Data transfer objects
├── utils/
│   ├── jwt.ts                      # JWT generation & verification
│   ├── password.ts                 # Password hashing & comparison
│   ├── appError.ts                 # Custom error classes
│   └── response.ts                 # API response helpers
└── routes/
    └── user.routes.ts              # User & auth routes

Documentation/
├── AUTHENTICATION_GUIDE.md          # Detailed API documentation
├── IMPLEMENTATION_SUMMARY.md        # What was built & how
├── test-auth-api.sh                # Bash test script
├── test-auth-api.ps1               # PowerShell test script
├── Mission-Management-Auth-API.postman_collection.json  # Postman collection
└── .env.example                    # Environment variables template
```

## 🚀 Quick Start

### 1. Setup Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and set:
```env
JWT_SECRET="your-super-secret-key-here"
JWT_EXPIRES_IN="24h"
DATABASE_URL="postgresql://user:password@localhost:5432/db"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

### 4. Run Migrations

The AuditLog table should already exist in your schema. If not:

```bash
npx prisma migrate dev
```

### 5. Start the Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## 📚 API Endpoints

### Authentication Endpoints

#### 1. **Register User**
```http
POST /api/users/register
Content-Type: application/json

{
  "employeeId": "EMP001",
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "EMPLOYEE",
  "phone": "1234567890",
  "position": "Software Engineer"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "EMPLOYEE"
  },
  "message": "User registered successfully"
}
```

---

#### 2. **Login**
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "EMPLOYEE",
      "phone": "1234567890",
      "position": "Software Engineer"
    }
  },
  "message": "Login successful"
}
```

**Token Payload:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "EMPLOYEE",
  "firstName": "John",
  "lastName": "Doe",
  "iat": 1674123456,
  "exp": 1674209856
}
```

---

#### 3. **Logout** (Protected)
```http
POST /api/users/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  },
  "message": "Logout successful"
}
```

---

#### 4. **Get Login History** (Protected)
```http
GET /api/users/login-history
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "action": "login",
      "module": "users",
      "userId": "uuid",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-01-24T12:00:00Z"
    },
    {
      "id": "uuid",
      "action": "logout",
      "module": "users",
      "userId": "uuid",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-01-24T13:00:00Z"
    }
  ],
  "message": "Login history retrieved successfully"
}
```

## 🧪 Testing

### Option 1: Postman Collection

1. Open Postman
2. Import `Mission-Management-Auth-API.postman_collection.json`
3. The collection includes automatic token extraction
4. Test all endpoints

### Option 2: PowerShell Script (Windows)

```powershell
powershell.exe -ExecutionPolicy Bypass -File test-auth-api.ps1
```

### Option 3: Bash Script (Linux/Mac)

```bash
bash test-auth-api.sh
```

### Option 4: Manual cURL Commands

```bash
# Register
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123","firstName":"Test","lastName":"User","role":"EMPLOYEE"}'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123"}'

# Get login history (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/users/login-history \
  -H "Authorization: Bearer TOKEN"

# Logout
curl -X POST http://localhost:3000/api/users/logout \
  -H "Authorization: Bearer TOKEN"
```

## 🔐 Security Implementation

### Password Security
- ✅ Bcrypt with 10 salt rounds
- ✅ Passwords never stored in plain text
- ✅ Password comparison using secure comparison function

### Token Security
- ✅ HMAC-SHA256 signing algorithm
- ✅ 24-hour expiration
- ✅ Secret key from environment variables
- ✅ Token payload includes user info for quick verification

### Access Control
- ✅ Authentication middleware validates all protected routes
- ✅ Role-based access control available
- ✅ Account status check before login
- ✅ Token extraction and verification on protected endpoints

### Audit Trail
- ✅ All login attempts logged
- ✅ All logout events logged
- ✅ IP addresses recorded
- ✅ User-agent information captured
- ✅ Timestamps for all events
- ✅ Easily queryable by user or action type

### Error Security
- ✅ Generic error messages for invalid credentials (no user enumeration)
- ✅ Different error messages for different failure reasons
- ✅ Appropriate HTTP status codes
- ✅ No sensitive information in error responses

## 💻 Frontend Integration Example

### React/Next.js Example

```javascript
// Login
const handleLogin = async (email, password) => {
  const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (response.ok) {
    const { data } = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    // Redirect to dashboard
  }
};

// Protected API request
const fetchProtectedData = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/protected-endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};

// Logout
const handleLogout = async () => {
  const token = localStorage.getItem('token');
  
  await fetch('/api/users/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to login
};
```

## 📊 Audit Log Queries

### View all login/logout events
```sql
SELECT * FROM "AuditLog" 
WHERE action IN ('login', 'logout')
ORDER BY "createdAt" DESC;
```

### View login history for specific user
```sql
SELECT * FROM "AuditLog" 
WHERE "userId" = 'user-id' AND action IN ('login', 'logout')
ORDER BY "createdAt" DESC;
```

### View failed login attempts
```sql
SELECT * FROM "AuditLog" 
WHERE action = 'login' AND "userId" IS NULL
ORDER BY "createdAt" DESC;
```

### View login activity by IP address
```sql
SELECT "ipAddress", COUNT(*) as login_count, MAX("createdAt") as last_login
FROM "AuditLog"
WHERE action = 'login'
GROUP BY "ipAddress"
ORDER BY login_count DESC;
```

## 🛠️ Middleware Usage

### Protect a Route with Authentication

```typescript
import { authMiddleware } from "./middleware/auth.middleware";

router.get("/protected", authMiddleware, (req, res) => {
  const user = (req as any).user;
  res.json({ message: `Hello ${user.firstName}` });
});
```

### Protect a Route with Specific Roles

```typescript
import { authMiddleware, roleMiddleware } from "./middleware/auth.middleware";

router.post(
  "/admin-only",
  authMiddleware,
  roleMiddleware(['ADMIN', 'DIRECTOR']),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);
```

## ⚠️ Error Handling

| Scenario | Status | Error Message |
|----------|--------|---------------|
| Invalid email/password | 401 | "Invalid email or password" |
| Missing email/password | 400 | "Email and password are required" |
| Account not active | 401 | "Account is not active" |
| No token provided | 401 | "No token provided" |
| Invalid/expired token | 401 | "Invalid or expired token" |
| Insufficient permissions | 401 | "Access denied: insufficient permissions" |
| User already exists | 409 | "User with this email already exists" |

## 📝 Environment Variables Reference

```env
# JWT Configuration
JWT_SECRET=your-secret-key              # Secret key for signing JWT
JWT_EXPIRES_IN=24h                      # Token expiration time

# Database
DATABASE_URL=postgresql://...           # Prisma database URL

# Server
PORT=3000                               # Server port
NODE_ENV=development                    # development or production
```

## 🔄 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION                         │
├─────────────────────────────────────────────────────────────┤
│ 1. User submits email & password                             │
│ 2. Check if user exists                                      │
│ 3. Hash password with bcrypt                                 │
│ 4. Store user in database                                    │
│ 5. Return user data                                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                       LOGIN FLOW                             │
├─────────────────────────────────────────────────────────────┤
│ 1. User submits email & password                             │
│ 2. Find user by email                                        │
│ 3. Check account status (must be ACTIVE)                     │
│ 4. Compare password using bcrypt                             │
│ 5. If valid:                                                 │
│    a. Generate JWT with user info                            │
│    b. Update lastLogin timestamp                             │
│    c. Log login event to AuditLog                            │
│    d. Return token & user data                               │
│ 6. If invalid: Return 401 Unauthorized                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   PROTECTED REQUEST                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Client sends request with Authorization header           │
│ 2. Extract token from "Bearer <token>" format               │
│ 3. Verify token signature                                    │
│ 4. Check token expiration                                    │
│ 5. Decode token payload                                      │
│ 6. Attach user info to request (req.user)                   │
│ 7. Process request                                           │
│ 8. Return response                                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      LOGOUT FLOW                             │
├─────────────────────────────────────────────────────────────┤
│ 1. User submits logout request with token                    │
│ 2. Verify token is valid                                     │
│ 3. Log logout event to AuditLog                              │
│ 4. Return success message                                    │
│ 5. Client removes token from storage                         │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Additional Resources

- **AUTHENTICATION_GUIDE.md** - Detailed API reference
- **IMPLEMENTATION_SUMMARY.md** - Technical implementation details
- **auth.types.ts** - TypeScript type definitions
- **Prisma Schema** - Database model definitions

## 🤝 Contributing

When adding new authenticated endpoints:

1. Import `authMiddleware` in your routes file
2. Add middleware to protected routes: `authMiddleware`
3. Access user info with `(req as any).user`
4. Use appropriate error handling with custom error classes

## 📞 Support

For issues or questions:
1. Check AUTHENTICATION_GUIDE.md for API details
2. Review test scripts for endpoint examples
3. Check error messages and HTTP status codes
4. Enable debug logging in auth.service.ts

---

**Last Updated:** January 24, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅

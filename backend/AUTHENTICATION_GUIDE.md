# Authentication System Documentation

## Overview
This authentication system provides JWT-based login/logout functionality with comprehensive audit logging.

## Features
- **User Login**: Email and password-based authentication
- **JWT Tokens**: Tokens include user ID, email, role, and name information
- **Session Tracking**: Automatic login/logout logging to AuditLog
- **Token Verification**: Middleware to protect authenticated routes
- **Role-Based Access**: Optional role-based authorization
- **Login History**: Retrieve user's login/logout history
- **IP & User-Agent Tracking**: Logs client information for security

## Setup

### 1. Environment Variables
Create a `.env` file with:
```
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="24h"
DATABASE_URL="postgresql://..."
```

### 2. Database
The system uses the existing `AuditLog` model in Prisma schema for logging:
```prisma
model AuditLog {
  id            String   @id @default(uuid()) @db.Uuid
  action        String   // 'login', 'logout'
  module        String   // 'users'
  tableName     String?  // 'user'
  recordId      String?  // user ID
  ipAddress     String?
  userAgent     String?
  userId        String?  @db.Uuid
  createdAt     DateTime @default(now())
}
```

## API Endpoints

### 1. Register User
**POST** `/api/users/register`

Request:
```json
{
  "employeeId": "EMP001",
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "EMPLOYEE",
  "phone": "1234567890",
  "position": "Software Engineer",
  "departmentId": "uuid"
}
```

Response (201 Created):
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

### 2. Login
**POST** `/api/users/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

Response (200 OK):
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

**JWT Token Payload:**
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

### 3. Logout
**POST** `/api/users/logout`

Headers:
```
Authorization: Bearer <token>
```

Response (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  },
  "message": "Logout successful"
}
```

### 4. Get Login History
**GET** `/api/users/login-history`

Headers:
```
Authorization: Bearer <token>
```

Response (200 OK):
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

## Usage Examples

### Using Token in Frontend

```javascript
// Login
const response = await fetch('/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await response.json();
localStorage.setItem('token', data.token);

// Use token in subsequent requests
fetch('/api/users/login-history', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Logout
fetch('/api/users/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
localStorage.removeItem('token');
```

### Protected Routes

Use the `authMiddleware` to protect routes:

```typescript
router.get("/protected-route", authMiddleware, (req, res) => {
  const user = (req as any).user;
  res.json({ message: `Hello ${user.firstName}` });
});
```

### Role-Based Access Control

```typescript
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware";

router.post(
  "/admin-only",
  authMiddleware,
  roleMiddleware(['ADMIN', 'DIRECTOR']),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);
```

## Audit Logging

All login/logout activities are automatically logged to the `AuditLog` table with:
- **Action**: 'login' or 'logout'
- **Module**: 'users'
- **User ID**: The authenticated user's ID
- **IP Address**: Client's IP address
- **User Agent**: Client's browser/app information
- **Timestamp**: Exact time of action

### Viewing Audit Logs

```typescript
// In your admin dashboard or reporting service
const auditLogs = await prisma.auditLog.findMany({
  where: {
    userId: userId,
    action: { in: ['login', 'logout'] }
  },
  orderBy: { createdAt: 'desc' }
});
```

## Error Handling

The system returns appropriate HTTP status codes:

| Error | Status Code | Message |
|-------|-------------|---------|
| Missing credentials | 400 | "Email and password are required" |
| Invalid credentials | 401 | "Invalid email or password" |
| Account inactive | 401 | "Account is not active" |
| No token provided | 401 | "No token provided" |
| Invalid token | 401 | "Invalid or expired token" |
| Access denied | 401 | "Access denied: insufficient permissions" |
| User exists | 409 | "User with this email already exists" |

## Security Considerations

1. **JWT Secret**: Keep `JWT_SECRET` in environment variables, never commit to version control
2. **HTTPS**: Always use HTTPS in production to protect tokens in transit
3. **Token Storage**: Store tokens securely (HttpOnly cookies preferred over localStorage)
4. **Token Expiration**: Tokens expire after 24 hours (configurable)
5. **Password Hashing**: Passwords are hashed using bcrypt before storage
6. **Audit Logs**: All auth actions are logged for security monitoring
7. **Account Status**: Check account status before allowing login
8. **IP Tracking**: Client IP and user-agent are logged for suspicious activity detection

## Files Modified/Created

- ✅ `src/repositories/auditLog.repository.ts` - New file for AuditLog queries
- ✅ `src/services/auth.service.ts` - Updated with login/logout/history methods
- ✅ `src/controllers/auth.controller.ts` - New auth controller with endpoints
- ✅ `src/middleware/auth.middleware.ts` - New auth middleware for token verification
- ✅ `src/utils/jwt.ts` - Updated with enhanced token payload
- ✅ `src/routes/user.routes.ts` - Updated with auth routes
- ✅ `.env.example` - Configuration template

## Next Steps

1. Set JWT_SECRET in your `.env` file
2. Run Prisma migrations to ensure AuditLog table exists
3. Test the endpoints using Postman or similar tools
4. Implement frontend login UI
5. Configure CI/CD pipelines to use secure environment variables

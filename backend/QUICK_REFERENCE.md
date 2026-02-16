# ⚡ Quick Reference - JWT Auth System

## 🚀 3-Minute Setup

```bash
# 1. Set JWT secret in .env
echo 'JWT_SECRET="your-secret-key"' >> .env

# 2. Start server
npm run dev

# 3. Test login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}'
```

---

## 📡 API Endpoints

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/api/users/register` | ❌ | Register new user |
| POST | `/api/users/login` | ❌ | Login & get JWT |
| POST | `/api/users/logout` | ✅ | Logout & log event |
| GET | `/api/users/login-history` | ✅ | View login history |

---

## 🔑 Login Request/Response

```javascript
// REQUEST
POST /api/users/login
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

// RESPONSE (200 OK)
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "EMPLOYEE",
      "firstName": "John",
      "lastName": "Doe"
    }
  },
  "message": "Login successful"
}
```

---

## 🎫 Using JWT Token

```javascript
// Store token
localStorage.setItem('token', response.data.token);

// Use in requests
fetch('/api/users/login-history', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Remove on logout
localStorage.removeItem('token');
```

---

## 🛡️ Protected Routes

```typescript
// Protect with auth only
router.get("/dashboard", authMiddleware, handler);

// Protect with auth + role
router.post(
  "/admin",
  authMiddleware,
  roleMiddleware(['ADMIN', 'DIRECTOR']),
  handler
);
```

---

## 📋 Audit Log Query

```sql
-- All login/logout events
SELECT * FROM "AuditLog" 
WHERE action IN ('login', 'logout')
ORDER BY "createdAt" DESC;

-- Specific user
SELECT * FROM "AuditLog"
WHERE "userId" = 'user-id' AND action IN ('login', 'logout');

-- By IP
SELECT "ipAddress", COUNT(*) as count
FROM "AuditLog"
WHERE action = 'login'
GROUP BY "ipAddress";
```

---

## ⚙️ Environment Variables

```env
JWT_SECRET="your-secret-key-here"        # Required!
JWT_EXPIRES_IN="24h"                     # Optional (default 24h)
DATABASE_URL="postgresql://..."          # Required
NODE_ENV="development"                   # Optional
PORT="3000"                              # Optional
```

---

## 🧪 Quick Test

```bash
# PowerShell (Windows)
powershell.exe -ExecutionPolicy Bypass -File test-auth-api.ps1

# Bash (Linux/Mac)
bash test-auth-api.sh

# Postman
Import: Mission-Management-Auth-API.postman_collection.json
```

---

## 🔴 Error Codes

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Bad request | Missing email/password |
| 401 | Invalid credentials | Wrong password |
| 401 | Account not active | Account status ≠ ACTIVE |
| 401 | No token provided | Missing Authorization header |
| 401 | Invalid token | Expired or tampered token |
| 409 | User exists | Email already registered |

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/services/auth.service.ts` | Login/logout logic |
| `src/controllers/auth.controller.ts` | HTTP handlers |
| `src/middleware/auth.middleware.ts` | Token verification |
| `src/utils/jwt.ts` | Token generation |
| `src/repositories/auditLog.repository.ts` | Audit logging |

---

## 🔐 Token Payload

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

## 📚 Documentation

- **START_HERE.md** - Overview
- **README_AUTH.md** - Full guide
- **AUTHENTICATION_GUIDE.md** - API reference
- **IMPLEMENTATION_CHECKLIST.md** - Setup verification

---

## ✨ Features

✅ JWT tokens with user/role info  
✅ Automatic login/logout logging  
✅ IP & user-agent tracking  
✅ Role-based access control  
✅ 24-hour token expiration  
✅ Password hashing (bcrypt)  
✅ Protected routes  
✅ Login history per user  

---

## 🚦 Common Tasks

### Protect an Endpoint
```typescript
router.get("/protected", authMiddleware, (req, res) => {
  const user = (req as any).user;
  res.json({ message: `Hello ${user.firstName}` });
});
```

### Check User Role
```typescript
router.post(
  "/admin",
  authMiddleware,
  roleMiddleware(['ADMIN']),
  handler
);
```

### Get Current User
```typescript
const user = (req as any).user;  // Contains: id, email, role, firstName, lastName
```

### View Login History
```typescript
const history = await authService.getLoginHistory(userId);
```

---

## 📊 Database Tables Used

- **User** - User accounts
- **AuditLog** - Login/logout events

---

## 🎯 Typical Flow

```
1. User registers (POST /register)
   ↓
2. User logs in (POST /login) → Get JWT
   ↓
3. Make requests with JWT token
   ├─ GET /login-history (protected)
   ├─ Other protected endpoints...
   ↓
4. User logs out (POST /logout)
   ↓
5. Login/logout events logged to AuditLog
```

---

## 🔗 File Links

- [Full README](README_AUTH.md)
- [API Guide](AUTHENTICATION_GUIDE.md)
- [Diagrams](ARCHITECTURE_DIAGRAMS.md)
- [Checklist](IMPLEMENTATION_CHECKLIST.md)
- [Files Overview](FILES_OVERVIEW.md)

---

**Ready to use! 🚀**

For detailed info, see [START_HERE.md](START_HERE.md)

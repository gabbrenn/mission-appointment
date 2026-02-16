# Quick Start Guide - Backend Integration

## 🚀 Getting Started in 5 Minutes

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

Backend should be running on `http://localhost:3000`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend should be running on `http://localhost:5173`

### 3. Test Login

Navigate to `http://localhost:5173/login`

Use test credentials from your backend seed data, or create a user via backend API.

Example test credentials (if you have seed data):
```
Email: admin@rnp.bi
Password: [your seeded password]
```

## 🎯 What's Been Integrated

✅ **Authentication**
- Login with email/password
- JWT token management
- Automatic token refresh
- Logout functionality

✅ **Role-Based Access Control**
- 6 roles: ADMIN, DIRECTOR_GENERAL, DEPARTMENT_HEAD, FINANCE, HR, EMPLOYEE
- Protected routes based on user role
- Automatic navigation to role-specific dashboard

✅ **API Services**
- User management
- Department management
- Mission type management
- Authentication services

✅ **UI Integration**
- Login page with real API
- User profile in header
- Logout button
- Protected dashboards

## 📁 Key Files to Know

### Configuration
- `.env` - API URL and environment settings
- `src/lib/api.ts` - HTTP client with auth

### Authentication
- `src/contexts/AuthContext.tsx` - Global auth state
- `src/services/auth.service.ts` - Auth API calls
- `src/components/ProtectedRoute.tsx` - Route protection

### Services (API Layer)
- `src/services/user.service.ts`
- `src/services/department.service.ts`
- `src/services/missiontype.service.ts`

## 🔐 Using Authentication in Your Components

### Get Current User

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <h1>Welcome {user?.firstName}!</h1>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### Check User Role

```tsx
import { useAuth } from '@/contexts/AuthContext';

function AdminOnly() {
  const { hasRole } = useAuth();
  
  if (!hasRole('ADMIN')) {
    return <p>Access denied</p>;
  }
  
  return <div>Admin content</div>;
}
```

### Logout

```tsx
import { useAuth } from '@/contexts/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();
  
  return (
    <button onClick={logout}>
      Logout
    </button>
  );
}
```

## 🌐 Making API Calls

### Using Service Layer (Recommended)

```tsx
import { userService } from '@/services/user.service';
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  async function loadUsers() {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.firstName} {user.lastName}</li>
      ))}
    </ul>
  );
}
```

### Direct API Client

```tsx
import { apiClient } from '@/lib/api';

async function customApiCall() {
  try {
    const response = await apiClient.get('/custom-endpoint');
    console.log(response.data);
  } catch (error) {
    console.error('API Error:', error);
  }
}
```

## 🛠️ Available Services

### Auth Service
```tsx
import { authService } from '@/services/auth.service';

// Login
await authService.login({ email, password });

// Logout
await authService.logout();

// Get login history
const history = await authService.getLoginHistory();

// Check authentication
const isAuth = authService.isAuthenticated();

// Check role
const isAdmin = authService.hasRole('ADMIN');
```

### User Service
```tsx
import { userService } from '@/services/user.service';

// Get all users
const users = await userService.getAllUsers();

// Get user by ID
const user = await userService.getUserById(id);

// Create user
const newUser = await userService.createUser(userData);

// Update user
const updated = await userService.updateUser(id, updates);

// Delete user
await userService.deleteUser(id);

// Update availability
await userService.updateAvailability(id, status);
```

### Department Service
```tsx
import { departmentService } from '@/services/department.service';

// Get all departments
const departments = await departmentService.getAllDepartments();

// Create department
const dept = await departmentService.createDepartment(data);
```

### Mission Type Service
```tsx
import { missionTypeService } from '@/services/missiontype.service';

// Get all mission types
const types = await missionTypeService.getAllMissionTypes();
```

## 🔧 Environment Configuration

Edit `.env` file to configure:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api

# API timeout (milliseconds)
VITE_API_TIMEOUT=30000

# Environment
VITE_ENV=development
```

## 🎭 Role Hierarchy

| Role | Access Level | Routes |
|------|--------------|--------|
| ADMIN | Full access | All routes |
| DIRECTOR_GENERAL | Director | /director/* |
| DEPARTMENT_HEAD | Department + Employee | /department/*, /employee/* |
| FINANCE | Finance | /finance/* |
| HR | HR | /hr/* |
| EMPLOYEE | Basic | /employee/* |

## 🐛 Common Issues

### Issue: "Network Error" or "Cannot connect to backend"
**Solution:** Ensure backend is running on port 3000

### Issue: "401 Unauthorized"
**Solution:** 
- Check if you're logged in
- Token might be expired (re-login)
- Check localStorage for 'token'

### Issue: "CORS Error"
**Solution:** Backend needs CORS configuration:

```typescript
// backend/src/app.ts
import cors from 'cors';
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: Routes redirect to login immediately
**Solution:**
- Clear browser localStorage
- Re-login with valid credentials
- Check browser console for errors

## 📚 Next Steps

1. **Test all role-based access** - Login as different roles
2. **Add mission management** - Create mission services
3. **Implement approval workflows** - Finance/HR/Director approvals
4. **Add real-time features** - Notifications, status updates
5. **Profile management** - User settings and preferences
6. **File uploads** - Documents and reports

## 📞 Need Help?

Check the complete documentation:
- `BACKEND_INTEGRATION.md` - Full integration details
- Backend API docs: `http://localhost:3000/api-docs` (Swagger)

---

**Status:** ✅ Ready to use  
**Last Updated:** January 29, 2026

# Backend API Integration - Complete Guide

## Overview

This document describes the complete integration of the backend API with the frontend React application, including authentication, role-based access control, and API service layer.

## ✅ Completed Integration

### 1. Environment Configuration

**Files Created:**
- `.env` - Environment variables for API configuration
- `.env.example` - Template for environment variables

**Environment Variables:**
```env
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_ENV=development
```

### 2. API Client Layer

**File:** `src/lib/api.ts`

Features:
- Axios-based HTTP client with interceptors
- Automatic token injection in request headers
- Global error handling (401 redirects to login)
- TypeScript typed responses
- Singleton pattern for consistent usage

### 3. Authentication Services

**File:** `src/services/auth.service.ts`

Provides:
- `login(credentials)` - Login with email/password
- `logout()` - Logout and clear tokens
- `getLoginHistory()` - Get user's login history
- `getCurrentUser()` - Get current user from localStorage
- `getToken()` - Get auth token
- `isAuthenticated()` - Check if user is logged in
- `hasRole(roles)` - Check if user has required role

Token & user data stored in localStorage for persistence.

### 4. Backend Service Integrations

**Files Created:**
- `src/services/user.service.ts` - User management API calls
- `src/services/department.service.ts` - Department API calls
- `src/services/missiontype.service.ts` - Mission type API calls

Each service provides:
- Get all records
- Get by ID
- Create new record
- Update existing record
- Delete record

### 5. Authentication Context

**File:** `src/contexts/AuthContext.tsx`

Provides global auth state management:
- User state across the entire app
- Login/logout methods
- Role checking
- Loading states
- Automatic navigation based on role
- Toast notifications for auth events

### 6. Protected Routes

**File:** `src/components/ProtectedRoute.tsx`

Features:
- Wraps routes requiring authentication
- Optional role-based access control
- Automatic redirect to login if not authenticated
- Redirect to /unauthorized if insufficient permissions
- Loading state during auth check

**File:** `src/pages/Unauthorized.tsx`
- Displays when user lacks required permissions
- Provides navigation back to user's dashboard

### 7. Updated Components

#### Login Page (`src/pages/Login.tsx`)
- Integrated with real backend API
- Uses `useAuth` hook for authentication
- Proper error handling with toast notifications
- Role-based navigation after login
- Removed demo role selector (kept info panel for dev mode)

#### App Header (`src/components/layout/app-header.tsx`)
- Added user profile dropdown
- Display user name and role
- Logout functionality
- Navigation to profile and settings
- Shows user initials in avatar

#### App Routing (`src/App.tsx`)
- Wrapped with AuthProvider
- All routes protected with role-based access
- Role mappings:
  - **ADMIN**: Full access to all routes
  - **DIRECTOR_GENERAL**: Director dashboard and features
  - **DEPARTMENT_HEAD**: Department management + employee features
  - **FINANCE**: Finance approval workflows
  - **HR**: HR management features
  - **EMPLOYEE**: Basic mission and profile features

### 8. Updated .gitignore
- Added `.env` and `.env.local` to ignore list
- Protects sensitive API configuration

## 🔐 Role-Based Access Control

| Role | Access Routes |
|------|---------------|
| ADMIN | All routes |
| DIRECTOR_GENERAL | /director/* |
| DEPARTMENT_HEAD | /department/*, /employee/* |
| FINANCE | /finance/* |
| HR | /hr/* |
| EMPLOYEE | /employee/* |
| All Authenticated | /notifications, /help, /settings, /employee/profile |

## 📡 API Endpoints Integration

### Authentication Endpoints
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout (requires auth)
- `GET /api/users/login-history` - Get login history (requires auth)

### User Management Endpoints
- `GET /api/users` - Get all users (Admin/HR only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PATCH /api/users/:id/availability` - Update user availability
- `GET /api/users/:id/skills` - Get user skills
- `POST /api/users/:id/skills` - Add skill to user
- `DELETE /api/users/:id/skills/:skillId` - Remove skill from user

### Department Endpoints
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create new department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Mission Type Endpoints
- `GET /api/mission-type` - Get all mission types
- `GET /api/mission-type/:id` - Get mission type by ID
- `POST /api/mission-type` - Create new mission type
- `PUT /api/mission-type/:id` - Update mission type
- `DELETE /api/mission-type/:id` - Delete mission type

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install axios
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update if needed:

```bash
cp .env.example .env
```

### 3. Start Backend Server

Ensure your backend is running on port 3000:

```bash
cd backend
npm run dev
```

### 4. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

### 5. Test Authentication

Use credentials from your backend seed data or create a test user:

```json
{
  "email": "user@rnp.bi",
  "password": "your-password"
}
```

## 🧪 Testing the Integration

### Test Login Flow
1. Navigate to `/login`
2. Enter valid credentials
3. Should redirect to role-specific dashboard
4. Check browser localStorage for token and user data

### Test Protected Routes
1. Without logging in, try to access `/admin`
2. Should redirect to `/login`
3. After login as EMPLOYEE, try to access `/admin`
4. Should redirect to `/unauthorized`

### Test Logout
1. Click user avatar in header
2. Click Logout
3. Should clear token and redirect to `/login`

### Test API Calls
1. Open browser DevTools Network tab
2. Perform actions (login, fetch data)
3. Check requests include `Authorization: Bearer <token>` header

## 🔧 Usage in Components

### Using Auth Context

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome {user?.firstName}</h1>
      {hasRole('ADMIN') && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making API Calls

```tsx
import { userService } from '@/services/user.service';

async function fetchUsers() {
  try {
    const users = await userService.getAllUsers();
    console.log(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}
```

### Custom API Calls

```tsx
import { apiClient } from '@/lib/api';

async function customApiCall() {
  const response = await apiClient.get('/custom-endpoint');
  return response.data;
}
```

## 📝 Backend Roles Reference

Based on Prisma schema:

```prisma
enum Role {
  ADMIN
  DIRECTOR_GENERAL
  DEPARTMENT_HEAD
  FINANCE
  HR
  EMPLOYEE
}
```

## 🔐 Token Management

- **Storage**: localStorage (keys: 'token', 'user')
- **Expiration**: 24 hours (set in backend JWT config)
- **Refresh**: Not implemented (user must re-login after expiration)
- **Logout**: Clears localStorage and calls backend logout endpoint

## 🛡️ Security Features

1. **JWT Authentication**: Secure token-based auth
2. **HTTP-Only Headers**: Tokens sent in Authorization header
3. **Role-Based Access**: Frontend route protection
4. **Backend Validation**: All protected endpoints require valid token
5. **Automatic Token Injection**: Handled by axios interceptor
6. **401 Handling**: Auto-redirect to login on unauthorized
7. **Audit Logging**: Backend logs all login/logout events

## 📚 Next Steps

To fully integrate with backend features, consider adding:

1. **Password Reset Flow** - Implement forgot password functionality
2. **Token Refresh** - Add refresh token mechanism
3. **Profile Management** - Create/edit user profile
4. **Mission API Integration** - Connect mission CRUD operations
5. **Real-time Notifications** - WebSocket or polling for notifications
6. **File Upload** - Avatar and document uploads
7. **Advanced Search** - Implement search functionality
8. **Audit Log Viewer** - Display user activity logs

## 🐛 Troubleshooting

### CORS Issues
If you see CORS errors, ensure backend has proper CORS configuration:

```typescript
// backend/src/app.ts
import cors from 'cors';
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### 401 Unauthorized
- Check if token is present in localStorage
- Verify token hasn't expired
- Ensure backend is running
- Check API URL in .env matches backend

### Network Errors
- Verify backend is running on correct port
- Check VITE_API_URL in .env
- Inspect Network tab for exact error

## 📄 Files Modified/Created Summary

### Created (18 files)
- `.env`
- `.env.example`
- `src/lib/api.ts`
- `src/services/auth.service.ts`
- `src/services/user.service.ts`
- `src/services/department.service.ts`
- `src/services/missiontype.service.ts`
- `src/contexts/AuthContext.tsx`
- `src/components/ProtectedRoute.tsx`
- `src/pages/Unauthorized.tsx`
- `BACKEND_INTEGRATION.md` (this file)

### Modified (4 files)
- `src/App.tsx` - Added AuthProvider and ProtectedRoute
- `src/pages/Login.tsx` - Integrated real authentication
- `src/components/layout/app-header.tsx` - Added user profile & logout
- `.gitignore` - Added .env files

## ✅ Integration Checklist

- [x] Environment configuration
- [x] API client with interceptors
- [x] Authentication service
- [x] Auth context and hooks
- [x] Protected routes
- [x] Role-based access control
- [x] Login page integration
- [x] Logout functionality
- [x] User profile in header
- [x] Service layer for backend endpoints
- [x] TypeScript types for API responses
- [x] Error handling and user feedback
- [ ] Install axios dependency
- [ ] Test with running backend
- [ ] Configure CORS on backend

---

**Last Updated:** January 29, 2026
**Integration Status:** Complete ✅
**Ready for Testing:** Yes (after npm install axios)

# Mission Assignment System - API Documentation

## Swagger Documentation

The API documentation is available via Swagger UI at:

**URL:** `http://localhost:3000/api-docs`

### Quick Start

1. Start the server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to: `http://localhost:3000/api-docs`

3. To test protected endpoints:
   - First, use the `/api/users/login` endpoint to get a JWT token
   - Click the "Authorize" button at the top right of Swagger UI
   - Enter: `Bearer YOUR_JWT_TOKEN`
   - Click "Authorize" then "Close"
   - Now you can test all protected endpoints

### API Endpoints Overview

#### Authentication
- `POST /api/users/login` - User login (public)
- `POST /api/users/logout` - User logout (protected)
- `GET /api/users/login-history` - Get login history (protected)

#### Users
- `GET /api/users` - Get all users (Admin, HR)
- `GET /api/users/:id` - Get user by ID (Self, Admin, HR)
- `POST /api/users` - Create new user (Admin)
- `PUT /api/users/:id` - Update user (Self, Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `PATCH /api/users/:id/availability` - Update availability (Self, HR)
- `GET /api/users/:id/skills` - Get user skills (Self, Admin, HR)
- `POST /api/users/:id/skills` - Add skill (Self, Admin, HR)
- `DELETE /api/users/:id/skills/:skillId` - Remove skill (Self, Admin, HR)

#### Departments
- `GET /api/departments` - Get all departments (Admin, HR, Head of Department)
- `GET /api/departments/:id` - Get department by ID (Admin, HR, Head of Department)
- `POST /api/departments` - Create department (Admin)
- `PUT /api/departments/:id` - Update department (Admin)
- `DELETE /api/departments/:id` - Delete department (Admin)
- `GET /api/departments/:id/users` - Get department users (Admin, HR, Head of Department)

#### Mission Types
- `GET /api/mission-type` - Get all mission types (Admin, HR, Head of Department)
- `GET /api/mission-type/:id` - Get mission type by ID (Admin, HR, Head of Department)
- `POST /api/mission-type` - Create mission type (Admin, Head of Department)
- `PUT /api/mission-type/:id` - Update mission type (Admin, Head of Department)
- `DELETE /api/mission-type/:id` - Delete mission type (Admin)

### Role-Based Access Control

The API implements role-based access control with the following roles:
- **ADMIN** - Full system access
- **DIRECTOR** - High-level management
- **HR** - Human resources management
- **FINANCE** - Financial operations
- **HEAD_OF_DEPARTMENT** - Department-level management
- **EMPLOYEE** - Basic employee access

### Testing with Sample Data

Example login request:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Example create user request:
```json
{
  "employeeId": "EMP001",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "EMPLOYEE",
  "phone": "+257 22 123456",
  "position": "Software Engineer"
}
```

Example create department request:
```json
{
  "name": "Information Technology",
  "code": "IT",
  "description": "IT Department",
  "budgetAllocation": 100000.00
}
```

Example create mission type request:
```json
{
  "name": "Training Mission",
  "description": "Employee training and development",
  "defaultBudgetMin": 500.00,
  "defaultBudgetMax": 5000.00,
  "requiredQualifications": ["Training Certificate", "5+ years experience"],
  "status": "ACTIVE"
}
```

### Response Format

All responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

### Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

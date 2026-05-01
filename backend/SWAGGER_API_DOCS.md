# Mission Assignment System - Complete API Documentation

## Overview

This document provides comprehensive documentation for the Mission Assignment System API. The API follows RESTful conventions and uses JWT for authentication.

## Base URL

- **Development:** `http://localhost:3000`
- **Production:** `https://mission-appointment.onrender.com`

## Swagger Documentation

Interactive API documentation is available at:
- **Swagger UI:** `http://localhost:3000/api-docs`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

Use the login endpoint to obtain a JWT token:

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/login` | User login |
| POST | `/api/users/logout` | User logout |
| GET | `/api/users/login-history` | Get user login history |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (Admin, HR only) |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user (Admin only) |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user (Admin only) |
| PATCH | `/api/users/:id/availability` | Update user availability status |
| GET | `/api/users/:id/skills` | Get user skills |
| POST | `/api/users/:id/skills` | Add skill to user |
| DELETE | `/api/users/:id/skills/:skillId` | Remove skill from user |
| PUT | `/api/users/:id/skills/bulk` | Bulk update user skills |

### Departments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | Get all departments |
| GET | `/api/departments/:id` | Get department by ID |
| POST | `/api/departments` | Create department (Admin only) |
| PUT | `/api/departments/:id` | Update department (Admin only) |
| DELETE | `/api/departments/:id` | Delete department (Admin only) |
| GET | `/api/departments/:id/users` | Get department users |

### Mission Types

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mission-type` | Get all mission types |
| GET | `/api/mission-type/:id` | Get mission type by ID |
| POST | `/api/mission-type` | Create mission type |
| PUT | `/api/mission-type/:id` | Update mission type |
| DELETE | `/api/mission-type/:id` | Delete mission type |

### Missions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/missions` | Get all missions (with filters) |
| GET | `/api/missions/:id` | Get mission by ID |
| POST | `/api/missions` | Create new mission |
| PUT | `/api/missions/:id` | Update mission |
| DELETE | `/api/missions/:id` | Cancel mission |
| POST | `/api/missions/:id/auto-assign` | Auto-assign mission to employees |
| POST | `/api/missions/:id/approve` | Approve mission |
| POST | `/api/missions/:id/reject` | Reject mission |
| GET | `/api/missions/department` | Get department missions (Department Head) |

### Mission Assignments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/missions/assignments` | Get current user's assignments |
| GET | `/api/missions/:id/assignments` | Get all assignments for a mission |
| GET | `/api/missions/assignments/my-substitutions` | Get substitution assignments for current user |
| POST | `/api/missions/assignments/:assignmentId/respond` | Respond to assignment (Accept/Decline) |
| POST | `/api/missions/assignments/:assignmentId/decline-with-substitution` | Decline and request substitution |

### Substitution Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/missions/substitution-requests` | Get substitution requests |
| GET | `/api/missions/substitution-requests/:requestId` | Get specific substitution request |
| POST | `/api/missions/substitution-requests/:requestId/approve` | Approve or reject substitution request |

---

## Request/Response Examples

### Create Mission

```http
POST /api/missions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "IT System Audit",
  "description": "Conduct audit of branch IT infrastructure",
  "destination": "Kigali Branch",
  "startDate": "2025-02-15T00:00:00Z",
  "endDate": "2025-02-20T00:00:00Z",
  "departmentId": "uuid-here",
  "estimatedBudget": 5000,
  "urgencyLevel": "MEDIUM",
  "requiredQualifications": ["IT Audit", "Risk Assessment"]
}
```

### Auto-Assign Mission

```http
POST /api/missions/:id/auto-assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "maxAssignees": 2
}
```

### Respond to Assignment (Accept)

```http
POST /api/missions/assignments/:assignmentId/respond
Authorization: Bearer <token>
Content-Type: application/json

{
  "response": "ACCEPTED",
  "notes": "Looking forward to this mission"
}
```

### Decline with Substitution Request

```http
POST /api/missions/assignments/:assignmentId/decline-with-substitution
Authorization: Bearer <token>
Content-Type: application/json

{
  "reasonCategory": "MEDICAL",
  "detailedReason": "Scheduled medical procedure during the mission dates",
  "supportingDocuments": ["/documents/medical-certificate.pdf"]
}
```

### Approve Substitution Request

```http
POST /api/missions/substitution-requests/:requestId/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED",
  "reviewerComments": "Approved - will initiate re-assignment process"
}
```

### Update User Availability

```http
PATCH /api/users/:id/availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "availabilityStatus": "UNAVAILABLE"
}
```

---

## Enums

### Role
- `ADMIN` - System administrator
- `DIRECTOR` - Director level
- `HR` - Human Resources
- `FINANCE` - Finance department
- `HEAD_OF_DEPARTMENT` - Department head
- `EMPLOYEE` - Regular employee

### AvailabilityStatus
- `AVAILABLE` - Available for assignments
- `ON_LEAVE` - On leave
- `ON_MISSION` - Currently on a mission
- `UNAVAILABLE` - Unavailable for assignments

### AccountStatus
- `ACTIVE` - Active account
- `INACTIVE` - Inactive account
- `SUSPENDED` - Suspended account

### MissionStatus
- `DRAFT` - Draft mission
- `PENDING_ASSIGNMENT` - Waiting for employee assignment
- `ASSIGNED` - Employee assigned
- `IN_APPROVAL` - In approval process
- `APPROVED` - Approved mission
- `IN_PROGRESS` - Mission in progress
- `COMPLETED` - Mission completed
- `REJECTED` - Rejected mission
- `CANCELLED` - Cancelled mission

### AssignmentStatus
- `PENDING` - Awaiting employee response
- `ACCEPTED` - Employee accepted
- `DECLINED` - Employee declined
- `SUBSTITUTED` - Substituted with another employee

### AssignmentResponse
- `ACCEPTED` - Accept the assignment
- `DECLINED` - Decline the assignment

### SubstitutionReason
- `MEDICAL` - Medical reasons
- `FAMILY_EMERGENCY` - Family emergency
- `CONFLICT_OF_INTEREST` - Conflict of interest
- `OTHER` - Other reasons

### ApprovalStatus
- `PENDING` - Awaiting approval
- `APPROVED` - Approved
- `REJECTED` - Rejected

### UrgencyLevel
- `LOW` - Low urgency
- `MEDIUM` - Medium urgency
- `HIGH` - High urgency

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

---

## Workflow: Mission Assignment with Substitution

1. **Create Mission** → Department head creates a mission
2. **Auto-Assign** → System assigns eligible employees based on skills and fairness
3. **Employee Response** → Employee can:
   - **Accept** → Mission status changes to ASSIGNED
   - **Decline** → Simple decline
   - **Decline with Substitution** → Creates substitution request
4. **Substitution Approval** → Manager reviews and approves/rejects:
   - **Approved** → Original assignment marked as SUBSTITUTED, mission goes back to PENDING_ASSIGNMENT for re-assignment
   - **Rejected** → Original assignment reverts to PENDING
5. **Mission Approval** → After assignment, mission goes through approval workflow
6. **Mission Execution** → Mission proceeds through IN_PROGRESS to COMPLETED

---

## User Availability Feature

Users can set their availability status to control mission assignments:

```http
PATCH /api/users/:id/availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "availabilityStatus": "UNAVAILABLE"
}
```

When a user is marked as `UNAVAILABLE`, they will not be considered for auto-assignment to new missions.

---

## Notes

- All date fields use ISO 8601 format
- UUID format is required for all ID fields
- JWT tokens expire after 24 hours
- Password must be at least 6 characters
- Employees can only view and respond to their own assignments
- Department heads can view all missions in their department
- HR and Directors have broader access across departments
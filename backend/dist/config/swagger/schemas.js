"use strict";
/**
 * Swagger Schemas for Mission Assignment System API
 * These schemas define the data models used throughout the API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
exports.schemas = {
    // User Schemas
    User: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            employeeId: { type: "string" },
            email: { type: "string", format: "email" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            phone: { type: "string", nullable: true },
            role: { $ref: "#/components/schemas/Role" },
            position: { type: "string", nullable: true },
            profilePhoto: { type: "string", nullable: true },
            availabilityStatus: { $ref: "#/components/schemas/AvailabilityStatus" },
            accountStatus: { $ref: "#/components/schemas/AccountStatus" },
            lastLogin: { type: "string", format: "date-time", nullable: true },
            departmentId: { type: "string", format: "uuid", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
        },
    },
    Role: {
        type: "string",
        enum: ["ADMIN", "DIRECTOR", "HR", "FINANCE", "HEAD_OF_DEPARTMENT", "EMPLOYEE"],
        description: "User role in the system",
    },
    AvailabilityStatus: {
        type: "string",
        enum: ["AVAILABLE", "ON_LEAVE", "ON_MISSION", "UNAVAILABLE"],
        description: "Current availability status of the user",
    },
    AccountStatus: {
        type: "string",
        enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
        description: "Account status of the user",
    },
    CreateUserDto: {
        type: "object",
        required: ["email", "firstName", "lastName", "role"],
        properties: {
            employeeId: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            firstName: { type: "string" },
            lastName: { type: "string" },
            phone: { type: "string" },
            role: { $ref: "#/components/schemas/Role" },
            position: { type: "string" },
            departmentId: { type: "string", format: "uuid" },
        },
    },
    UpdateUserDto: {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            firstName: { type: "string" },
            lastName: { type: "string" },
            phone: { type: "string" },
            role: { $ref: "#/components/schemas/Role" },
            position: { type: "string" },
            availabilityStatus: { $ref: "#/components/schemas/AvailabilityStatus" },
            accountStatus: { $ref: "#/components/schemas/AccountStatus" },
            departmentId: { type: "string", format: "uuid" },
        },
    },
    UpdateAvailabilityDto: {
        type: "object",
        required: ["availabilityStatus"],
        properties: {
            availabilityStatus: { $ref: "#/components/schemas/AvailabilityStatus" },
        },
    },
    UserSkillDto: {
        type: "object",
        required: ["skillName"],
        properties: {
            skillName: { type: "string", description: "Name of the skill to add" },
        },
    },
    EmployeeSkill: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            skillName: { type: "string" },
            userId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
        },
    },
    // Department Schemas
    Department: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            code: { type: "string" },
            description: { type: "string", nullable: true },
            budgetAllocation: { type: "number", format: "decimal" },
            status: { type: "string" },
            headId: { type: "string", format: "uuid", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
        },
    },
    CreateDepartmentDto: {
        type: "object",
        required: ["name", "code"],
        properties: {
            name: { type: "string" },
            code: { type: "string" },
            description: { type: "string" },
            budgetAllocation: { type: "number" },
            headId: { type: "string", format: "uuid" },
        },
    },
    UpdateDepartmentDto: {
        type: "object",
        properties: {
            name: { type: "string" },
            code: { type: "string" },
            description: { type: "string" },
            budgetAllocation: { type: "number" },
            status: { type: "string" },
            headId: { type: "string", format: "uuid" },
        },
    },
    // Mission Type Schemas
    MissionType: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
            defaultBudgetMin: { type: "number", format: "decimal", nullable: true },
            defaultBudgetMax: { type: "number", format: "decimal", nullable: true },
            requiredQualifications: {
                type: "array",
                items: { type: "string" },
            },
            status: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
        },
    },
    CreateMissionTypeDto: {
        type: "object",
        required: ["name"],
        properties: {
            name: { type: "string" },
            description: { type: "string" },
            defaultBudgetMin: { type: "number" },
            defaultBudgetMax: { type: "number" },
            requiredQualifications: {
                type: "array",
                items: { type: "string" },
            },
            status: { type: "string" },
        },
    },
    UpdateMissionTypeDto: {
        type: "object",
        properties: {
            name: { type: "string" },
            description: { type: "string" },
            defaultBudgetMin: { type: "number" },
            defaultBudgetMax: { type: "number" },
            requiredQualifications: {
                type: "array",
                items: { type: "string" },
            },
            status: { type: "string" },
        },
    },
    // Mission Schemas
    Mission: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            missionNumber: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            destination: { type: "string" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            urgencyLevel: { $ref: "#/components/schemas/UrgencyLevel" },
            estimatedBudget: { type: "number", format: "decimal" },
            budgetCode: { type: "string", nullable: true },
            requiredQualifications: {
                type: "array",
                items: { type: "string" },
            },
            status: { $ref: "#/components/schemas/MissionStatus" },
            departmentId: { type: "string", format: "uuid" },
            createdById: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
        },
    },
    MissionStatus: {
        type: "string",
        enum: [
            "DRAFT",
            "PENDING_ASSIGNMENT",
            "ASSIGNED",
            "IN_APPROVAL",
            "APPROVED",
            "IN_PROGRESS",
            "COMPLETED",
            "REJECTED",
            "CANCELLED",
        ],
        description: "Current status of the mission",
    },
    UrgencyLevel: {
        type: "string",
        enum: ["LOW", "MEDIUM", "HIGH"],
        description: "Urgency level of the mission",
    },
    CreateMissionDto: {
        type: "object",
        required: ["title", "description", "destination", "startDate", "endDate", "departmentId", "estimatedBudget"],
        properties: {
            title: { type: "string" },
            description: { type: "string" },
            destination: { type: "string" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            departmentId: { type: "string", format: "uuid" },
            estimatedBudget: { type: "number" },
            urgencyLevel: { $ref: "#/components/schemas/UrgencyLevel" },
            budgetCode: { type: "string" },
            requiredQualifications: {
                type: "array",
                items: { type: "string" },
            },
        },
    },
    UpdateMissionDto: {
        type: "object",
        properties: {
            title: { type: "string" },
            description: { type: "string" },
            destination: { type: "string" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            estimatedBudget: { type: "number" },
            urgencyLevel: { $ref: "#/components/schemas/UrgencyLevel" },
            status: { $ref: "#/components/schemas/MissionStatus" },
            budgetCode: { type: "string" },
            requiredQualifications: {
                type: "array",
                items: { type: "string" },
            },
        },
    },
    MissionAssignment: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            assignmentReason: { type: "string" },
            fairnessScoreAtAssignment: { type: "number", format: "decimal" },
            assignmentStatus: { $ref: "#/components/schemas/AssignmentStatus" },
            responseNotes: { type: "string", nullable: true },
            isSubstitution: { type: "boolean" },
            missionId: { type: "string", format: "uuid" },
            employeeId: { type: "string", format: "uuid" },
            originalAssignmentId: { type: "string", format: "uuid", nullable: true },
            assignedAt: { type: "string", format: "date-time" },
            respondedAt: { type: "string", format: "date-time", nullable: true },
            updatedAt: { type: "string", format: "date-time" },
        },
    },
    AssignmentStatus: {
        type: "string",
        enum: ["PENDING", "ACCEPTED", "DECLINED", "SUBSTITUTED"],
        description: "Status of the mission assignment",
    },
    AssignmentResponseDto: {
        type: "object",
        required: ["response"],
        properties: {
            response: {
                type: "string",
                enum: ["ACCEPTED", "DECLINED"],
                description: "Employee's response to the assignment",
            },
            notes: {
                type: "string",
                description: "Optional notes from the employee",
            },
        },
    },
    SubstitutionRequest: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            reasonCategory: { $ref: "#/components/schemas/SubstitutionReason" },
            detailedReason: { type: "string" },
            supportingDocuments: {
                type: "array",
                items: { type: "string" },
            },
            status: { $ref: "#/components/schemas/ApprovalStatus" },
            reviewerComments: { type: "string", nullable: true },
            reviewedAt: { type: "string", format: "date-time", nullable: true },
            assignmentId: { type: "string", format: "uuid" },
            employeeId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
        },
    },
    CreateSubstitutionRequestDto: {
        type: "object",
        required: ["assignmentId", "reasonCategory", "detailedReason"],
        properties: {
            assignmentId: { type: "string", format: "uuid" },
            reasonCategory: { $ref: "#/components/schemas/SubstitutionReason" },
            detailedReason: {
                type: "string",
                description: "Detailed explanation for the substitution request",
            },
            supportingDocuments: {
                type: "array",
                items: { type: "string" },
                description: "Array of file paths or URLs for supporting documents",
            },
        },
    },
    SubstitutionReason: {
        type: "string",
        enum: ["MEDICAL", "FAMILY_EMERGENCY", "CONFLICT_OF_INTEREST", "OTHER"],
        description: "Category of reason for substitution request",
    },
    ApprovalStatus: {
        type: "string",
        enum: ["PENDING", "APPROVED", "REJECTED"],
        description: "Status of the approval request",
    },
    SubstitutionApprovalDto: {
        type: "object",
        properties: {
            status: { $ref: "#/components/schemas/ApprovalStatus" },
            reviewerComments: {
                type: "string",
                description: "Comments from the reviewer",
            },
        },
    },
    MissionApproval: {
        type: "object",
        properties: {
            id: { type: "string", format: "uuid" },
            approvalStage: { type: "integer", minimum: 1, maximum: 4 },
            approverRole: { $ref: "#/components/schemas/Role" },
            status: { $ref: "#/components/schemas/ApprovalStatus" },
            comments: { type: "string", nullable: true },
            missionId: { type: "string", format: "uuid" },
            approverId: { type: "string", format: "uuid", nullable: true },
            approvedAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
        },
    },
    MissionApprovalDto: {
        type: "object",
        properties: {
            comments: {
                type: "string",
                description: "Comments from the approver",
            },
            approvalLevel: {
                type: "string",
                description: "Optional approval level identifier",
            },
        },
    },
    MissionRejectionDto: {
        type: "object",
        properties: {
            comments: {
                type: "string",
                description: "Comments explaining the rejection",
            },
            rejectionReason: {
                type: "string",
                description: "Reason for rejection",
            },
        },
    },
    // Authentication Schemas
    LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
        },
    },
    LoginResponse: {
        type: "object",
        properties: {
            token: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
        },
    },
    // Common Response Schemas
    SuccessResponse: {
        type: "object",
        properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: { type: "object" },
        },
    },
    ErrorResponse: {
        type: "object",
        properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: {
                type: "array",
                items: { type: "object" },
            },
        },
    },
};

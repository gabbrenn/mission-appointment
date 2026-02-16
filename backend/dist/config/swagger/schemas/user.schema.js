"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemas = void 0;
exports.userSchemas = {
    User: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
            },
            employeeId: {
                type: "string",
            },
            email: {
                type: "string",
                format: "email",
            },
            firstName: {
                type: "string",
            },
            lastName: {
                type: "string",
            },
            phone: {
                type: "string",
                nullable: true,
            },
            role: {
                type: "string",
                enum: ["ADMIN", "DIRECTOR", "HR", "FINANCE", "HEAD_OF_DEPARTMENT", "EMPLOYEE"],
            },
            position: {
                type: "string",
                nullable: true,
            },
            profilePhoto: {
                type: "string",
                nullable: true,
            },
            availabilityStatus: {
                type: "string",
                enum: ["AVAILABLE", "ON_LEAVE", "ON_MISSION", "UNAVAILABLE"],
            },
            accountStatus: {
                type: "string",
                enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
            },
            departmentId: {
                type: "string",
                format: "uuid",
                nullable: true,
            },
            department: {
                $ref: "#/components/schemas/Department",
            },
            skills: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/EmployeeSkill",
                },
            },
            lastLogin: {
                type: "string",
                format: "date-time",
                nullable: true,
            },
            createdAt: {
                type: "string",
                format: "date-time",
            },
            updatedAt: {
                type: "string",
                format: "date-time",
            },
        },
    },
    CreateUserDto: {
        type: "object",
        required: ["employeeId", "email", "password", "firstName", "lastName", "role"],
        properties: {
            employeeId: {
                type: "string",
            },
            email: {
                type: "string",
                format: "email",
            },
            password: {
                type: "string",
                minLength: 6,
            },
            firstName: {
                type: "string",
            },
            lastName: {
                type: "string",
            },
            phone: {
                type: "string",
            },
            role: {
                type: "string",
                enum: ["ADMIN", "DIRECTOR", "HR", "FINANCE", "HEAD_OF_DEPARTMENT", "EMPLOYEE"],
            },
            position: {
                type: "string",
            },
            departmentId: {
                type: "string",
                format: "uuid",
            },
            profilePhoto: {
                type: "string",
            },
        },
    },
    UpdateUserDto: {
        type: "object",
        properties: {
            firstName: {
                type: "string",
            },
            lastName: {
                type: "string",
            },
            phone: {
                type: "string",
            },
            position: {
                type: "string",
            },
            email: {
                type: "string",
                format: "email",
            },
            employeeId: {
                type: "string",
            },
            role: {
                type: "string",
                enum: ["ADMIN", "DIRECTOR", "HR", "FINANCE", "HEAD_OF_DEPARTMENT", "EMPLOYEE"],
            },
            departmentId: {
                type: "string",
                format: "uuid",
            },
            availabilityStatus: {
                type: "string",
                enum: ["AVAILABLE", "ON_LEAVE", "ON_MISSION", "UNAVAILABLE"],
            },
            accountStatus: {
                type: "string",
                enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
            },
            profilePhoto: {
                type: "string",
            },
            password: {
                type: "string",
                minLength: 6,
            },
        },
    },
    // LoginDto: {
    //     type: "object",
    //     required: ["email", "password"],
    //     properties: {
    //         email: {
    //             type: "string",
    //             format: "email",
    //         },
    //         password: {
    //             type: "string",
    //         },
    //     },
    // },
    // LoginResponse: {
    //     type: "object",
    //     properties: {
    //         success: {
    //             type: "boolean",
    //             example: true,
    //         },
    //         message: {
    //             type: "string",
    //         },
    //         data: {
    //             type: "object",
    //             properties: {
    //                 token: {
    //                     type: "string",
    //                 },
    //                 user: {
    //                     type: "object",
    //                     properties: {
    //                         id: {
    //                             type: "string",
    //                         },
    //                         email: {
    //                             type: "string",
    //                         },
    //                         firstName: {
    //                             type: "string",
    //                         },
    //                         lastName: {
    //                             type: "string",
    //                         },
    //                         role: {
    //                             type: "string",
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     },
    // },
    EmployeeSkill: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
            },
            skillName: {
                type: "string",
            },
            userId: {
                type: "string",
                format: "uuid",
            },
            createdAt: {
                type: "string",
                format: "date-time",
            },
        },
    },
    UserSkillDto: {
        type: "object",
        required: ["skillName"],
        properties: {
            skillName: {
                type: "string",
            },
        },
    },
    UpdateAvailabilityDto: {
        type: "object",
        required: ["availabilityStatus"],
        properties: {
            availabilityStatus: {
                type: "string",
                enum: ["AVAILABLE", "ON_LEAVE", "ON_MISSION", "UNAVAILABLE"],
            },
        },
    },
};

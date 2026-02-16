"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentSchemas = void 0;
exports.departmentSchemas = {
    Department: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
            },
            name: {
                type: "string",
            },
            code: {
                type: "string",
            },
            description: {
                type: "string",
                nullable: true,
            },
            budgetAllocation: {
                type: "number",
                format: "decimal",
            },
            departmentHead: {
                type: "string",
                format: "uuid",
                nullable: true,
            },
            status: {
                type: "string",
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
    CreateDepartmentDto: {
        type: "object",
        required: ["name", "code"],
        properties: {
            name: {
                type: "string",
            },
            code: {
                type: "string",
            },
            departmentHead: {
                type: "string",
                format: "uuid",
                nullable: true,
            },
            budgetAllocation: {
                type: "number",
                format: "decimal",
            },
            status: {
                type: "string",
            },
        },
    },
    UpdateDepartmentDto: {
        type: "object",
        properties: {
            name: {
                type: "string",
            },
            code: {
                type: "string",
            },
            departmentHead: {
                type: "string",
                format: "uuid",
                nullable: true,
            },
            budgetAllocation: {
                type: "number",
                format: "decimal",
            },
            status: {
                type: "string",
            },
        },
    },
};

import swaggerJsdoc from "swagger-jsdoc";
import { schemas } from "./swagger/schemas";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mission Assignment System API",
            version: "1.0.0",
            description: "API documentation for the Mission Assignment System - handles user management, departments, mission types, and mission assignments",
            contact: {
                name: "API Support",
                email: "support@mas.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server",
            },
            {
                url: "https://mission-appointment.onrender.com",
                description: "Production server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas,
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        tags: [
            {
                name: "Authentication",
                description: "User authentication endpoints including login, logout, and login history",
            },
            {
                name: "Users",
                description: "User management endpoints including CRUD operations, availability, and skills",
            },
            {
                name: "Departments",
                description: "Department management endpoints",
            },
            {
                name: "Mission Types",
                description: "Mission type management endpoints",
            },
            {
                name: "Missions",
                description: "Mission management endpoints including creation, updates, and approval workflow",
            },
            {
                name: "Missions - Assignments",
                description: "Mission assignment endpoints including auto-assignment, employee responses, and substitution requests",
            },
            {
                name: "Missions - Substitution Requests",
                description: "Substitution request management for employees declining missions and managers approving/rejecting requests",
            },
        ],
    },
    // Swagger will automatically scan these route files for JSDoc comments
    apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

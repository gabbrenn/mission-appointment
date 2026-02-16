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
                description: "User authentication endpoints",
            },
            {
                name: "Users",
                description: "User management endpoints",
            },
            {
                name: "Departments",
                description: "Department management endpoints",
            },
            {
                name: "Mission Types",
                description: "Mission type management endpoints",
            },
        ],
    },
    // Swagger will automatically scan these route files for JSDoc comments
    apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

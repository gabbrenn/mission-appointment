"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchemas = void 0;
exports.authSchemas = {
    LoginDto: {
        type: "object",
        required: ["email", "password"],
        properties: {
            email: {
                type: "string",
                format: "email",
            },
            password: {
                type: "string",
            },
        },
    },
    LoginResponse: {
        type: "object",
        properties: {
            success: {
                type: "boolean",
                example: true,
            },
            message: {
                type: "string",
            },
            data: {
                type: "object",
                properties: {
                    token: {
                        type: "string",
                    },
                    user: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                            },
                            email: {
                                type: "string",
                            },
                            firstName: {
                                type: "string",
                            },
                            lastName: {
                                type: "string",
                            },
                            role: {
                                type: "string",
                            },
                        },
                    },
                },
            },
        },
    },
};

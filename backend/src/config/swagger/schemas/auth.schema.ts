export const authSchemas = {
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

    RegisterDto: {
        type: "object",
        required: ["email", "password", "firstName", "lastName", "role"],
        properties: {
            email: {
                type: "string",
                format: "email",
            },
            password: {
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
                enum: ["admin", "user"],
            },
        },
    },

    RegisterResponse: {
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
};
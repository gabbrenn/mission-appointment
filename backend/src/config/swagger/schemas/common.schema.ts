export const commonSchemas = {
    Error: {
        type: "object",
        properties: {
            success: {
                type: "boolean",
                example: false,
            },
            message: {
                type: "string",
            },
            errors: {
                type: "array",
                items: {
                    type: "object",
                },
            },
        },
    },
    SuccessResponse: {
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
            },
        },
    },
};

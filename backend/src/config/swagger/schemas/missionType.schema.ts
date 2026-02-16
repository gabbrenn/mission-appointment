export const missionTypeSchemas = {
    MissionType: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
            },
            name: {
                type: "string",
            },
            description: {
                type: "string",
                nullable: true,
            },
            defaultBudgetMin: {
                type: "number",
                format: "decimal",
                nullable: true,
            },
            defaultBudgetMax: {
                type: "number",
                format: "decimal",
                nullable: true,
            },
            requiredQualifications: {
                type: "array",
                items: {
                    type: "string",
                },
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
    CreateMissionTypeDto: {
        type: "object",
        required: ["name"],
        properties: {
            name: {
                type: "string",
            },
            description: {
                type: "string",
            },
            defaultBudgetMin: {
                type: "number",
                format: "decimal",
            },
            defaultBudgetMax: {
                type: "number",
                format: "decimal",
            },
            requiredQualifications: {
                type: "array",
                items: {
                    type: "string",
                },
            },
            status: {
                type: "string",
            },
        },
    },
    UpdateMissionTypeDto: {
        type: "object",
        properties: {
            name: {
                type: "string",
            },
            description: {
                type: "string",
            },
            defaultBudgetMin: {
                type: "number",
                format: "decimal",
            },
            defaultBudgetMax: {
                type: "number",
                format: "decimal",
            },
            requiredQualifications: {
                type: "array",
                items: {
                    type: "string",
                },
            },
            status: {
                type: "string",
            },
        },
    },
};

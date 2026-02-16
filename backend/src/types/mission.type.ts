export interface MissionTypeRequest {
    name: string;
    description?: string;
    defaultBudgetMin?: number;
    defaultBudgetMax?: number;
    requiredQualifications?: string[];
    status?: string;
}

export interface CreateMissionTypeDto {
    name: string;
    description?: string;
    defaultBudgetMin?: number;
    defaultBudgetMax?: number;
    requiredQualifications?: string[];
    status?: string;
}

export interface UpdateMissionTypeDto {
    name?: string;
    description?: string;
    defaultBudgetMin?: number;
    defaultBudgetMax?: number;
    requiredQualifications?: string[];
    status?: string;
}
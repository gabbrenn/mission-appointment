import { MissionStatus, UrgencyLevel } from "@prisma/client";

export interface CreateMissionDto {
    title: string;
    description: string;
    destination: string;
    startDate: string;
    endDate: string;
    // missionTypeId: string;
    departmentId: string;
    urgencyLevel?: UrgencyLevel;
    estimatedBudget: number;
    budgetCode?: string;
    requiredQualifications?: string[];
}

export interface UpdateMissionDto {
    title?: string;
    description?: string;
    destination?: string;
    startDate?: string;
    endDate?: string;
    // missionTypeId?: string;
    departmentId?: string;
    urgencyLevel?: UrgencyLevel;
    estimatedBudget?: number;
    budgetCode?: string;
    requiredQualifications?: string[];
    status?: MissionStatus;
}

export interface MissionFilterDto {
    departmentId?: string;
    status?: MissionStatus;
    urgencyLevel?: UrgencyLevel;
    startDate?: string;
    endDate?: string;
}

export interface AutoAssignmentDto {
    missionId: string;
    maxAssignees?: number;
}

export interface AssignmentResultDto {
    employeeId: string;
    employee: {
        firstName: string;
        lastName: string;
        email: string;
    };
    assignmentReason: string;
    fairnessScore: number;
}
export interface CreateDepartmentDto {
    name: string;
    code: string;
    description?: string;
    budgetAllocation?: number;
    status?: string;
    headId?: string;
}

export interface UpdateDepartmentDto {
    name?: string;
    code?: string;
    description?: string;
    budgetAllocation?: number;
    status?: string;
    headId?: string;
}

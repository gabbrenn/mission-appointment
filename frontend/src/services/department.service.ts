/**
 * Department Service
 * Handles department-related API calls
 */

import { apiClient, ApiResponse } from '@/lib/api';

export interface CreateDepartmentDto {
  name: string;
  code: string;
  description?: string;
  headId?: string;
  budgetAllocation?: number;
}

export interface UpdateDepartmentDto {
  name?: string;
  code?: string;
  description?: string;
  location?: string;
  headId?: string;
  budgetAllocation?: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  headId?: string;
  createdAt: string;
  updatedAt: string;
}

class DepartmentService {
  /**
   * Get all departments
   */
  async getAllDepartments(): Promise<Department[]> {
    const response = await apiClient.get<Department[]>('/departments');
    return response.data;
  }

  /**
   * Get department by ID
   */
  async getDepartmentById(id: string): Promise<Department> {
    const response = await apiClient.get<Department>(`/departments/${id}`);
    return response.data;
  }

  /**
   * Create new department
   */
  async createDepartment(departmentData: CreateDepartmentDto): Promise<Department> {
    const response = await apiClient.post<Department>('/departments', departmentData);
    return response.data;
  }

  /**
   * Update department
   */
  async updateDepartment(id: string, departmentData: UpdateDepartmentDto): Promise<Department> {
    const response = await apiClient.put<Department>(`/departments/${id}`, departmentData);
    return response.data;
  }

  /**
   * Delete department
   */
  async deleteDepartment(id: string): Promise<void> {
    await apiClient.delete(`/departments/${id}`);
  }
}

// Export singleton instance
export const departmentService = new DepartmentService();

/**
 * User Service
 * Handles user-related API calls
 */

import { apiClient } from '@/lib/api';
import { UserSkill } from '@/types/api.types';

export interface CreateUserDto {
  employeeId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  position?: string;
  departmentId?: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  phone?: string;
  position?: string;
  accountStatus?: string;
  departmentId?: string;
}

export interface User {
  id: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  position?: string;
  accountStatus: string;
  availabilityStatus: string;
  departmentId?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

class UserService {
  /**
   * Get all users (Admin/HR only)
   */
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  }

  /**
   * Create new user (Admin only)
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  }

  /**
   * Update user
   */
  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, userData);
    return response.data;
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  /**
   * Update user availability status
   */
  async updateAvailability(id: string, availabilityStatus: string): Promise<User> {
    const response = await apiClient.patch<User>(`/users/${id}/availability`, {
      availabilityStatus,
    });
    return response.data;
  }

  /**
   * Get user skills
   */
  async getUserSkills(id: string): Promise<UserSkill[]> {
    const response = await apiClient.get<UserSkill[]>(`/users/${id}/skills`);
    return response.data;
  }

  /**
   * Add skill to user
   */
  async addUserSkill(id: string, skillName: string): Promise<UserSkill> {
    const response = await apiClient.post<UserSkill>(`/users/${id}/skills`, { skillName });
    return response.data;
  }

  /**
   * Remove skill from user
   */
  async removeUserSkill(userId: string, skillId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/skills/${skillId}`);
  }
}

// Export singleton instance
export const userService = new UserService();

/**
 * Mission Type Service
 * Handles mission type-related API calls
 */

import { apiClient, ApiResponse } from '@/lib/api';

export interface CreateMissionTypeDto {
  name: string;
  code: string;
  description?: string;
  estimatedDuration?: number;
  requiresApproval?: boolean;
}

export interface UpdateMissionTypeDto {
  name?: string;
  code?: string;
  description?: string;
  estimatedDuration?: number;
  requiresApproval?: boolean;
}

export interface MissionType {
  id: string;
  name: string;
  code: string;
  description?: string;
  estimatedDuration?: number;
  requiresApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

class MissionTypeService {
  /**
   * Get all mission types
   */
  async getAllMissionTypes(): Promise<MissionType[]> {
    const response = await apiClient.get<MissionType[]>('/mission-type');
    return response.data;
  }

  /**
   * Get mission type by ID
   */
  async getMissionTypeById(id: string): Promise<MissionType> {
    const response = await apiClient.get<MissionType>(`/mission-type/${id}`);
    return response.data;
  }

  /**
   * Create new mission type
   */
  async createMissionType(missionTypeData: CreateMissionTypeDto): Promise<MissionType> {
    const response = await apiClient.post<MissionType>('/mission-type', missionTypeData);
    return response.data;
  }

  /**
   * Update mission type
   */
  async updateMissionType(id: string, missionTypeData: UpdateMissionTypeDto): Promise<MissionType> {
    const response = await apiClient.put<MissionType>(`/mission-type/${id}`, missionTypeData);
    return response.data;
  }

  /**
   * Delete mission type
   */
  async deleteMissionType(id: string): Promise<void> {
    await apiClient.delete(`/mission-type/${id}`);
  }
}

// Export singleton instance
export const missionTypeService = new MissionTypeService();

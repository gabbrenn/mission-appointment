import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Fixed: use 'token' instead of 'authToken'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.error('[MissionService] API Error:', error?.response?.status, error?.response?.data?.message || error.message);
  return Promise.reject(error);
});

export interface Mission {
  id: string;
  missionNumber: string;
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedBudget: string; // API returns this as string
  budgetCode?: string;
  requiredQualifications: string[];
  status: 'DRAFT' | 'PENDING_ASSIGNMENT' | 'ASSIGNED' | 'IN_APPROVAL' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  departmentId: string;
  createdById: string;
  department: {
    id: string;
    name: string;
    code: string;
    description?: string;
    budgetAllocation: string;
    status: string;
    headId: string;
    createdAt: string;
    updatedAt: string;
  };
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignments: MissionAssignment[];
  createdAt: string;
  updatedAt: string;
}

export interface MissionAssignment {
  id: string;
  assignmentReason: string;
  fairnessScoreAtAssignment: number;
  assignmentStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'SUBSTITUTED';
  responseNotes?: string;
  isSubstitution: boolean;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    availabilityStatus: string;
  };
  assignedAt: string;
  respondedAt?: string;
  mission?: Mission; // Optional for when full mission details are included
  substitutionRequest?: any;
}

export interface CreateMissionDto {
  title: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  departmentId: string;
  urgencyLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedBudget: number;
  budgetCode?: string;
  requiredQualifications?: string[];
}

export interface UpdateMissionDto extends Partial<CreateMissionDto> {
  status?: Mission['status'];
}

export interface AutoAssignmentResult {
  employeeId: string;
  employee: {
    firstName: string;
    lastName: string;
    email: string;
  };
  assignmentReason: string;
  fairnessScore: number;
}

export class MissionService {
  // Get all missions with optional filters
  async getAllMissions(filters?: {
    departmentId?: string;
    status?: string;
    urgencyLevel?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Mission[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const response = await api.get(`/missions?${params.toString()}`);
    return response.data.data;
  }

  // Get mission by ID
  async getMissionById(id: string): Promise<Mission> {
    const response = await api.get(`/missions/${id}`);
    
    // Based on your API response: { success: true, message: "...", data: Mission }
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else {
      console.error('[MissionService] Unexpected response structure:', response.data);
      throw new Error('Mission data not found in response');
    }
  }

  // Create new mission
  async createMission(data: CreateMissionDto): Promise<Mission> {
    const response = await api.post('/missions', data);
    return response.data.data;
  }

  // Update mission
  async updateMission(id: string, data: UpdateMissionDto): Promise<Mission> {
    const response = await api.put(`/missions/${id}`, data);
    return response.data.data;
  }

  // Mark mission as completed (employee action)
  async markMissionCompleted(missionId: string): Promise<Mission> {
    return this.updateMission(missionId, { status: 'COMPLETED' });
  }

  // Cancel mission
  async deleteMission(id: string): Promise<void> {
    await api.delete(`/missions/${id}`);
  }

  // Auto-assign mission to eligible employees
  async autoAssignMission(missionId: string, maxAssignees = 1): Promise<AutoAssignmentResult[]> {
    const response = await api.post(`/missions/${missionId}/auto-assign`, { maxAssignees });
    return response.data.data;
  }

  // Get mission assignments
  async getMissionAssignments(missionId: string): Promise<MissionAssignment[]> {
    const response = await api.get(`/missions/${missionId}/assignments`);
    return response.data.data;
  }

  // Get missions for current department (department head view)
  async getDepartmentMissions(): Promise<Mission[]> {
    const response = await api.get('/missions/department');
    return response.data.data;
  }

  // Get user assignments (employee view)
  async getUserAssignments(): Promise<MissionAssignment[]> {
    const response = await api.get('/missions/assignments');
    return response.data.data;
  }

  // Get user assignment by mission ID
  async getUserAssignmentByMission(missionId: string): Promise<MissionAssignment | null> {
    const response = await api.get(`/missions/${missionId}/assignment`);
    return response.data.data;
  }

  // Respond to mission assignment
  async respondToAssignment(assignmentId: string, response: 'ACCEPTED' | 'DECLINED', notes?: string): Promise<void> {
    await api.post(`/missions/assignments/${assignmentId}/respond`, { response, notes });
  }

  // Approve mission (multi-level approval)
  async approveMission(missionId: string, comments?: string, approvalLevel?: string): Promise<Mission> {
    const response = await api.post(`/missions/${missionId}/approve`, { comments, approvalLevel });
    return response.data.data;
  }

  // Reject mission
  async rejectMission(missionId: string, comments?: string, rejectionReason?: string): Promise<Mission> {
    const response = await api.post(`/missions/${missionId}/reject`, { comments, rejectionReason });
    return response.data.data;
  }

  // Get missions for current user (employee view)
  async getMyMissions(): Promise<Mission[]> {
    // This would be filtered on backend based on auth user
    return this.getAllMissions();
  }

  // Employee declines assignment with substitution
  async declineWithSubstitution(assignmentId: string, data: { reasonCategory: string, detailedReason: string, supportingDocuments?: string[] }): Promise<any> {
    const response = await api.post(`/missions/assignments/${assignmentId}/decline-with-substitution`, data);
    return response.data.data;
  }

  // Submit mission report
  async submitMissionReport(missionId: string, data: { activityReport: string }): Promise<any> {
    const response = await api.post(`/missions/${missionId}/report`, data);
    return response.data.data;
  }

  // Get mission report
  async getMissionReport(missionId: string): Promise<any> {
    const response = await api.get(`/missions/${missionId}/report`);
    return response.data.data;
  }

  // Process substitution request
  async processSubstitutionRequest(requestId: string, status: 'APPROVED' | 'REJECTED', reviewerComments?: string): Promise<any> {
    const response = await api.post(`/missions/substitution-requests/${requestId}/approve`, { status, reviewerComments });
    return response.data.data;
  }

  // Get substitution request by ID
  async getSubstitutionRequestById(requestId: string): Promise<any> {
    const response = await api.get(`/missions/substitution-requests/${requestId}`);
    return response.data.data;
  }
}

export const missionService = new MissionService();
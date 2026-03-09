import { Request, Response, NextFunction } from "express";
import { MissionService } from "../services/mission.service";
import { ApiResponseHelper } from "../utils/response";
import { AuthenticatedRequest } from "../middleware/auth";
import { CreateMissionDto, UpdateMissionDto, MissionFilterDto, AutoAssignmentDto } from "../types/mission.dto";

export class MissionController {
    private missionService: MissionService;

    constructor() {
        this.missionService = new MissionService();
    }

    async createMission(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const dto: CreateMissionDto = req.body;
            const createdById = req.user!.id;
            
            const mission = await this.missionService.createMission(dto, createdById);
            return ApiResponseHelper.created(res, mission, "Mission created successfully");
        } catch (error) {
            next(error);
        }
    }

    async getAllMissions(req: Request, res: Response, next: NextFunction) {
        try {
            const filters: MissionFilterDto = req.query;
            const missions = await this.missionService.getAllMissions(filters);
            return ApiResponseHelper.success(res, missions, "Missions fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async getMissionById(req: Request, res: Response, next: NextFunction) {
        try {
            const missionId = req.params.id as string;
            const mission = await this.missionService.getMissionById(missionId);
            return ApiResponseHelper.success(res, mission, "Mission fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async updateMission(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const missionId = req.params.id as string;
            const dto: UpdateMissionDto = req.body;
            
            const mission = await this.missionService.updateMission(missionId, dto);
            return ApiResponseHelper.success(res, mission, "Mission updated successfully");
        } catch (error) {
            next(error);
        }
    }

    async deleteMission(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const missionId = req.params.id as string;
            await this.missionService.deleteMission(missionId);
            return ApiResponseHelper.success(res, { id: missionId }, "Mission cancelled successfully");
        } catch (error) {
            next(error);
        }
    }

    async autoAssignMission(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const missionId = req.params.id as string;
            const { maxAssignees } = req.body;
            
            const dto: AutoAssignmentDto = {
                missionId,
                maxAssignees: maxAssignees || 1,
            };
            
            const assignments = await this.missionService.autoAssignMission(dto);
            return ApiResponseHelper.success(res, assignments, "Mission auto-assigned successfully");
        } catch (error) {
            next(error);
        }
    }

    async getMissionAssignments(req: Request, res: Response, next: NextFunction) {
        try {
            const missionId = req.params.id as string;
            const assignments = await this.missionService.getMissionAssignments(missionId);
            return ApiResponseHelper.success(res, assignments, "Mission assignments fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    // Get assignments for current user (employee view)
    async getUserAssignments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const assignments = await this.missionService.getUserAssignments(userId);
            return ApiResponseHelper.success(res, assignments, "User assignments fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    // Employee responds to mission assignment
    async respondToAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const assignmentId = req.params.assignmentId as string;
            const { response, notes } = req.body;
            const userId = req.user!.id;
            
            const assignment = await this.missionService.respondToAssignment(assignmentId, userId, response, notes);
            return ApiResponseHelper.success(res, assignment, "Response recorded successfully");
        } catch (error) {
            next(error);
        }
    }

    // Department head approves mission
    async approveMission(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const missionId = req.params.id as string;
            const { comments, approvalLevel } = req.body;
            const userId = req.user!.id;
            const userRole = req.user!.role;
            
            const mission = await this.missionService.approveMission(missionId, userId, userRole, comments, approvalLevel);
            return ApiResponseHelper.success(res, mission, "Mission approved successfully");
        } catch (error) {
            next(error);
        }
    }

    // Reject mission at any approval level
    async rejectMission(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const missionId = req.params.id as string;
            const { comments, rejectionReason } = req.body;
            const userId = req.user!.id;
            const userRole = req.user!.role;
            
            const mission = await this.missionService.rejectMission(missionId, userId, userRole, comments, rejectionReason);
            return ApiResponseHelper.success(res, mission, "Mission rejected successfully");
        } catch (error) {
            next(error);
        }
    }

    // Get missions for current user's department (department head view)
    async getDepartmentMissions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const missions = await this.missionService.getDepartmentMissions(userId);
            return ApiResponseHelper.success(res, missions, "Department missions fetched successfully");
        } catch (error) {
            next(error);
        }
    }
}
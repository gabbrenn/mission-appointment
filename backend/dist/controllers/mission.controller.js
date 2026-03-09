"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionController = void 0;
const mission_service_1 = require("../services/mission.service");
const response_1 = require("../utils/response");
class MissionController {
    constructor() {
        this.missionService = new mission_service_1.MissionService();
    }
    async createMission(req, res, next) {
        try {
            const dto = req.body;
            const createdById = req.user.id;
            const mission = await this.missionService.createMission(dto, createdById);
            return response_1.ApiResponseHelper.created(res, mission, "Mission created successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async getAllMissions(req, res, next) {
        try {
            const filters = req.query;
            const missions = await this.missionService.getAllMissions(filters);
            return response_1.ApiResponseHelper.success(res, missions, "Missions fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async getMissionById(req, res, next) {
        try {
            const missionId = req.params.id;
            const mission = await this.missionService.getMissionById(missionId);
            return response_1.ApiResponseHelper.success(res, mission, "Mission fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async updateMission(req, res, next) {
        try {
            const missionId = req.params.id;
            const dto = req.body;
            const mission = await this.missionService.updateMission(missionId, dto);
            return response_1.ApiResponseHelper.success(res, mission, "Mission updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async deleteMission(req, res, next) {
        try {
            const missionId = req.params.id;
            await this.missionService.deleteMission(missionId);
            return response_1.ApiResponseHelper.success(res, { id: missionId }, "Mission cancelled successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async autoAssignMission(req, res, next) {
        try {
            const missionId = req.params.id;
            const { maxAssignees } = req.body;
            const dto = {
                missionId,
                maxAssignees: maxAssignees || 1,
            };
            const assignments = await this.missionService.autoAssignMission(dto);
            return response_1.ApiResponseHelper.success(res, assignments, "Mission auto-assigned successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async getMissionAssignments(req, res, next) {
        try {
            const missionId = req.params.id;
            const assignments = await this.missionService.getMissionAssignments(missionId);
            return response_1.ApiResponseHelper.success(res, assignments, "Mission assignments fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
    // Get assignments for current user (employee view)
    async getUserAssignments(req, res, next) {
        try {
            const userId = req.user.id;
            const assignments = await this.missionService.getUserAssignments(userId);
            return response_1.ApiResponseHelper.success(res, assignments, "User assignments fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
    // Employee responds to mission assignment
    async respondToAssignment(req, res, next) {
        try {
            const assignmentId = req.params.assignmentId;
            const { response, notes } = req.body;
            const userId = req.user.id;
            const assignment = await this.missionService.respondToAssignment(assignmentId, userId, response, notes);
            return response_1.ApiResponseHelper.success(res, assignment, "Response recorded successfully");
        }
        catch (error) {
            next(error);
        }
    }
    // Department head approves mission
    async approveMission(req, res, next) {
        try {
            const missionId = req.params.id;
            const { comments, approvalLevel } = req.body;
            const userId = req.user.id;
            const userRole = req.user.role;
            const mission = await this.missionService.approveMission(missionId, userId, userRole, comments, approvalLevel);
            return response_1.ApiResponseHelper.success(res, mission, "Mission approved successfully");
        }
        catch (error) {
            next(error);
        }
    }
    // Reject mission at any approval level
    async rejectMission(req, res, next) {
        try {
            const missionId = req.params.id;
            const { comments, rejectionReason } = req.body;
            const userId = req.user.id;
            const userRole = req.user.role;
            const mission = await this.missionService.rejectMission(missionId, userId, userRole, comments, rejectionReason);
            return response_1.ApiResponseHelper.success(res, mission, "Mission rejected successfully");
        }
        catch (error) {
            next(error);
        }
    }
    // Get missions for current user's department (department head view)
    async getDepartmentMissions(req, res, next) {
        try {
            const userId = req.user.id;
            const missions = await this.missionService.getDepartmentMissions(userId);
            return response_1.ApiResponseHelper.success(res, missions, "Department missions fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MissionController = MissionController;

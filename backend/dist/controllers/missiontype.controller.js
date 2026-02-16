"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionTypeController = void 0;
const response_1 = require("../utils/response");
const missiontype_service_1 = require("../services/missiontype.service");
class MissionTypeController {
    constructor() {
        this.missionTypeService = new missiontype_service_1.MissionTypeService();
    }
    async createMissionType(req, res, next) {
        try {
            const dto = req.body;
            const missionType = await this.missionTypeService.createMissionType(dto);
            return response_1.ApiResponseHelper.created(res, missionType, "Mission type created successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async getAllMissionTypes(_req, res, next) {
        try {
            const missionTypes = await this.missionTypeService.getAllMissionTypes();
            return response_1.ApiResponseHelper.success(res, missionTypes, "Mission types fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async getMissionTypeById(req, res, next) {
        try {
            const missionType = await this.missionTypeService.getMissionTypeById(req.params.id);
            return response_1.ApiResponseHelper.success(res, missionType, "Mission type fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async updateMissionType(req, res, next) {
        try {
            const dto = req.body;
            const missionType = await this.missionTypeService.updateMissionType(req.params.id, dto);
            return response_1.ApiResponseHelper.success(res, missionType, "Mission type updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async deleteMissionType(req, res, next) {
        try {
            await this.missionTypeService.deleteMissionType(req.params.id);
            return response_1.ApiResponseHelper.success(res, { id: req.params.id }, "Mission type deactivated successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MissionTypeController = MissionTypeController;

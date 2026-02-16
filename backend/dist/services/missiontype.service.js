"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionTypeService = void 0;
const missiontype_repository_1 = require("../repositories/missiontype.repository");
const ApiError_1 = require("../utils/ApiError");
class MissionTypeService {
    constructor() {
        this.missionTypeRepository = new missiontype_repository_1.MissionTypeRepository();
    }
    async createMissionType(data) {
        const existing = await this.missionTypeRepository.findMissionTypeByName(data.name);
        if (existing) {
            throw new ApiError_1.ApiError("Mission type with this name already exists", 409);
        }
        return this.missionTypeRepository.createMissionType(data);
    }
    async getAllMissionTypes() {
        return this.missionTypeRepository.getAllMissionTypes();
    }
    async getMissionTypeById(id) {
        const missionType = await this.missionTypeRepository.getMissionTypeById(id);
        if (!missionType) {
            throw new ApiError_1.ApiError("Mission type not found", 404);
        }
        return missionType;
    }
    async updateMissionType(id, data) {
        await this.getMissionTypeById(id);
        if (data.name) {
            const existing = await this.missionTypeRepository.findMissionTypeByName(data.name);
            if (existing && existing.id !== id) {
                throw new ApiError_1.ApiError("Mission type with this name already exists", 409);
            }
        }
        return this.missionTypeRepository.updateMissionType(id, data);
    }
    async deleteMissionType(id) {
        await this.getMissionTypeById(id);
        return this.missionTypeRepository.softDeleteMissionType(id);
    }
}
exports.MissionTypeService = MissionTypeService;

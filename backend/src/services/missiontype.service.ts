import { MissionTypeRepository } from "../repositories/missiontype.repository";
import { CreateMissionTypeDto, UpdateMissionTypeDto } from "../types/mission.type";
import { ApiError } from "../utils/ApiError";

export class MissionTypeService {
    private missionTypeRepository: MissionTypeRepository;

    constructor() {
        this.missionTypeRepository = new MissionTypeRepository();
    }

    async createMissionType(data: CreateMissionTypeDto) {
        const existing = await this.missionTypeRepository.findMissionTypeByName(data.name);
        if (existing) {
            throw new ApiError("Mission type with this name already exists", 409);
        }
        return this.missionTypeRepository.createMissionType(data);
    }

    async getAllMissionTypes() {
        return this.missionTypeRepository.getAllMissionTypes();
    }

    async getMissionTypeById(id: string) {
        const missionType = await this.missionTypeRepository.getMissionTypeById(id);
        if (!missionType) {
            throw new ApiError("Mission type not found", 404);
        }
        return missionType;
    }

    async updateMissionType(id: string, data: UpdateMissionTypeDto) {
        await this.getMissionTypeById(id);

        if (data.name) {
            const existing = await this.missionTypeRepository.findMissionTypeByName(data.name);
            if (existing && existing.id !== id) {
                throw new ApiError("Mission type with this name already exists", 409);
            }
        }

        return this.missionTypeRepository.updateMissionType(id, data);
    }

    async deleteMissionType(id: string) {
        await this.getMissionTypeById(id);
        return this.missionTypeRepository.softDeleteMissionType(id);
    }
}
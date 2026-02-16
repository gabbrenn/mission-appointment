import { Request, Response, NextFunction } from "express";
import { ApiResponseHelper } from "../utils/response";
import { MissionTypeService } from "../services/missiontype.service";
import { CreateMissionTypeDto, UpdateMissionTypeDto } from "../types/mission.type";

export class MissionTypeController {
    private missionTypeService: MissionTypeService;

    constructor() {
        this.missionTypeService = new MissionTypeService();
    }

    async createMissionType(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: CreateMissionTypeDto = req.body;
            const missionType = await this.missionTypeService.createMissionType(dto);
            return ApiResponseHelper.created(res, missionType, "Mission type created successfully");
        } catch (error) {
            next(error);
        }
    }

    async getAllMissionTypes(_req: Request, res: Response, next: NextFunction) {
        try {
            const missionTypes = await this.missionTypeService.getAllMissionTypes();
            return ApiResponseHelper.success(res, missionTypes, "Mission types fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async getMissionTypeById(req: Request, res: Response, next: NextFunction) {
        try {
            const missionType = await this.missionTypeService.getMissionTypeById(req.params.id as string);
            return ApiResponseHelper.success(res, missionType, "Mission type fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async updateMissionType(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: UpdateMissionTypeDto = req.body;
            const missionType = await this.missionTypeService.updateMissionType(req.params.id as string, dto);
            return ApiResponseHelper.success(res, missionType, "Mission type updated successfully");
        } catch (error) {
            next(error);
        }
    }

    async deleteMissionType(req: Request, res: Response, next: NextFunction) {
        try {
            await this.missionTypeService.deleteMissionType(req.params.id as string);
            return ApiResponseHelper.success(res, { id: req.params.id }, "Mission type deactivated successfully");
        } catch (error) {
            next(error);
        }
    }
}
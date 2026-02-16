import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { ApiResponseHelper } from "../utils/response";
import { ApiError } from "../utils/ApiError";
import { AuthenticatedRequest } from "../middleware/auth";
import { AvailabilityStatus } from "@prisma/client";
import {
    CreateUserDto,
    RegisterUserDto,
    UpdateUserDto,
    UserSkillDto,
} from "../types/user.dto";

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async getAllUsers(_req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getAllUsers();
            return ApiResponseHelper.success(res, users, "Users fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id as string;
            const user = await this.userService.getUserById(userId);
            return ApiResponseHelper.success(res, user, "User fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: CreateUserDto = req.body;
            const user = await this.userService.createUser(dto);
            return ApiResponseHelper.created(res, user, "User created successfully");
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id as string;
            const dto: UpdateUserDto = { ...req.body };

            if (req.user?.role !== "ADMIN" && req.user?.id !== userId) {
                throw new ApiError("Forbidden", 403);
            }

            if (req.user?.role !== "ADMIN") {
                delete (dto as any).role;
                delete (dto as any).accountStatus;
                delete (dto as any).employeeId;
            }

            const user = await this.userService.updateUser(userId, dto);
            return ApiResponseHelper.success(res, user, "User updated successfully");
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id as string;
            await this.userService.softDeleteUser(userId);
            return ApiResponseHelper.success(res, { id: userId }, "User deactivated successfully");
        } catch (error) {
            next(error);
        }
    }

    async updateAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id as string;
            const { availabilityStatus } = req.body as { availabilityStatus: AvailabilityStatus };

            if (req.user?.id !== userId && req.user?.role !== "HR") {
                throw new ApiError("Forbidden", 403);
            }

            const user = await this.userService.updateAvailability(userId, availabilityStatus);
            return ApiResponseHelper.success(res, user, "Availability updated successfully");
        } catch (error) {
            next(error);
        }
    }

    async getUserSkills(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id as string;
            const skills = await this.userService.getUserSkills(userId);
            return ApiResponseHelper.success(res, skills, "Skills fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async addUserSkill(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id as string;
            const dto: UserSkillDto = req.body;
            const skill = await this.userService.addUserSkill(userId, dto);
            return ApiResponseHelper.created(res, skill, "Skill added successfully");
        } catch (error) {
            next(error);
        }
    }

    async removeUserSkill(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id as string;
            const skillId = req.params.skillId as string;
            const result = await this.userService.removeUserSkill(userId, skillId);
            return ApiResponseHelper.success(res, result, "Skill removed successfully");
        } catch (error) {
            next(error);
        }
    }
}
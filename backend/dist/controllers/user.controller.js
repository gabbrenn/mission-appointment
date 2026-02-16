"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const response_1 = require("../utils/response");
const ApiError_1 = require("../utils/ApiError");
class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    async getAllUsers(_req, res, next) {
        try {
            const users = await this.userService.getAllUsers();
            return response_1.ApiResponseHelper.success(res, users, "Users fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async getUserById(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await this.userService.getUserById(userId);
            return response_1.ApiResponseHelper.success(res, user, "User fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async createUser(req, res, next) {
        try {
            const dto = req.body;
            const user = await this.userService.createUser(dto);
            return response_1.ApiResponseHelper.created(res, user, "User created successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async updateUser(req, res, next) {
        try {
            const userId = req.params.id;
            const dto = { ...req.body };
            if (req.user?.role !== "ADMIN" && req.user?.id !== userId) {
                throw new ApiError_1.ApiError("Forbidden", 403);
            }
            if (req.user?.role !== "ADMIN") {
                delete dto.role;
                delete dto.accountStatus;
                delete dto.employeeId;
            }
            const user = await this.userService.updateUser(userId, dto);
            return response_1.ApiResponseHelper.success(res, user, "User updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async deleteUser(req, res, next) {
        try {
            const userId = req.params.id;
            await this.userService.softDeleteUser(userId);
            return response_1.ApiResponseHelper.success(res, { id: userId }, "User deactivated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async updateAvailability(req, res, next) {
        try {
            const userId = req.params.id;
            const { availabilityStatus } = req.body;
            if (req.user?.id !== userId && req.user?.role !== "HR") {
                throw new ApiError_1.ApiError("Forbidden", 403);
            }
            const user = await this.userService.updateAvailability(userId, availabilityStatus);
            return response_1.ApiResponseHelper.success(res, user, "Availability updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async getUserSkills(req, res, next) {
        try {
            const userId = req.params.id;
            const skills = await this.userService.getUserSkills(userId);
            return response_1.ApiResponseHelper.success(res, skills, "Skills fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async addUserSkill(req, res, next) {
        try {
            const userId = req.params.id;
            const dto = req.body;
            const skill = await this.userService.addUserSkill(userId, dto);
            return response_1.ApiResponseHelper.created(res, skill, "Skill added successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async removeUserSkill(req, res, next) {
        try {
            const userId = req.params.id;
            const skillId = req.params.skillId;
            const result = await this.userService.removeUserSkill(userId, skillId);
            return response_1.ApiResponseHelper.success(res, result, "Skill removed successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;

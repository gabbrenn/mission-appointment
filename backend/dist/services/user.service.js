"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const password_1 = require("../utils/password");
const ApiError_1 = require("../utils/ApiError");
const client_1 = require("@prisma/client");
class UserService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async registerUser(data) {
        return this.createUser(data);
    }
    async createUser(data) {
        await this.ensureUserUnique(data.email, data.employeeId);
        // Validate HEAD_OF_DEPARTMENT role constraints
        if (data.role === client_1.Role.HEAD_OF_DEPARTMENT && data.departmentId) {
            throw new ApiError_1.ApiError("Users with HEAD_OF_DEPARTMENT role cannot be assigned to a department as regular employees. They should be assigned as department heads.", 400);
        }
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        return this.userRepository.createUser({
            ...data,
            password: hashedPassword,
        });
    }
    async getAllUsers() {
        return this.userRepository.getAllUsers();
    }
    async getUserByEmail(email) {
        return this.userRepository.getUserByEmail(email);
    }
    async getUserById(id) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new ApiError_1.ApiError("User not found", 404);
        }
        return user;
    }
    async updateUser(id, data) {
        const existing = await this.userRepository.getUserById(id);
        if (!existing) {
            throw new ApiError_1.ApiError("User not found", 404);
        }
        if (data.email && data.email !== existing.email) {
            const emailExists = await this.userRepository.getUserByEmail(data.email);
            if (emailExists) {
                throw new ApiError_1.ApiError("Email already in use", 409);
            }
        }
        if (data.employeeId && data.employeeId !== existing.employeeId) {
            const employeeExists = await this.userRepository.getUserByEmployeeId(data.employeeId);
            if (employeeExists) {
                throw new ApiError_1.ApiError("Employee ID already in use", 409);
            }
        }
        // Validate role and department changes
        const newRole = data.role || existing.role;
        const newDepartmentId = data.departmentId !== undefined ? data.departmentId : existing.departmentId;
        // If user has or is being changed to HEAD_OF_DEPARTMENT role, they cannot have departmentId
        if (newRole === client_1.Role.HEAD_OF_DEPARTMENT && newDepartmentId) {
            throw new ApiError_1.ApiError("Users with HEAD_OF_DEPARTMENT role cannot be assigned to a department as regular employees. They should be assigned as department heads.", 400);
        }
        // If user is currently head of a department and trying to change role or assign to department
        const departmentLed = existing.departmentLed;
        if (departmentLed !== null && (data.role || data.departmentId)) {
            if (data.role && data.role !== client_1.Role.HEAD_OF_DEPARTMENT) {
                throw new ApiError_1.ApiError(`User is currently head of department: ${departmentLed.name}. Remove them as department head before changing their role.`, 400);
            }
        }
        const updatePayload = { ...data };
        if (data.password) {
            updatePayload.password = await (0, password_1.hashPassword)(data.password);
        }
        return this.userRepository.updateUser(id, updatePayload);
    }
    async softDeleteUser(id) {
        const existing = await this.userRepository.getUserById(id);
        if (!existing) {
            throw new ApiError_1.ApiError("User not found", 404);
        }
        return this.userRepository.softDeleteUser(id);
    }
    async updateAvailability(id, availabilityStatus) {
        await this.getUserById(id);
        return this.userRepository.updateAvailability(id, availabilityStatus);
    }
    async getUserSkills(userId) {
        await this.getUserById(userId);
        return this.userRepository.getUserSkills(userId);
    }
    async addUserSkill(userId, data) {
        await this.getUserById(userId);
        const exists = await this.userRepository.findUserSkillByName(userId, data.skillName);
        if (exists) {
            throw new ApiError_1.ApiError("Skill already exists for user", 409);
        }
        return this.userRepository.addUserSkill(userId, data.skillName);
    }
    async removeUserSkill(userId, skillId) {
        await this.getUserById(userId);
        const result = await this.userRepository.removeUserSkill(userId, skillId);
        if (result.count === 0) {
            throw new ApiError_1.ApiError("Skill not found for user", 404);
        }
        return { deleted: result.count };
    }
    async ensureUserUnique(email, employeeId) {
        const [emailExists, employeeExists] = await Promise.all([
            this.userRepository.getUserByEmail(email),
            this.userRepository.getUserByEmployeeId(employeeId),
        ]);
        if (emailExists) {
            throw new ApiError_1.ApiError("User with this email already exists", 409);
        }
        if (employeeExists) {
            throw new ApiError_1.ApiError("User with this employee ID already exists", 409);
        }
    }
}
exports.UserService = UserService;

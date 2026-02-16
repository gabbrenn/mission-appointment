"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentService = void 0;
const department_repository_1 = require("../repositories/department.repository");
const user_repository_1 = require("../repositories/user.repository");
const ApiError_1 = require("../utils/ApiError");
const client_1 = require("@prisma/client");
class DepartmentService {
    constructor() {
        this.departmentRepository = new department_repository_1.DepartmentRepository();
        this.userRepository = new user_repository_1.UserRepository();
    }
    async getAllDepartments() {
        return this.departmentRepository.getAll();
    }
    async getDepartmentById(id) {
        const department = await this.departmentRepository.getById(id);
        if (!department) {
            throw new ApiError_1.ApiError("Department not found", 404);
        }
        return department;
    }
    async createDepartment(data) {
        await this.ensureUnique(data.name, data.code);
        // Validate department head if provided
        if (data.headId) {
            await this.validateDepartmentHead(data.headId);
        }
        return this.departmentRepository.create(data);
    }
    async updateDepartment(id, data) {
        await this.getDepartmentById(id);
        if (data.name) {
            const existingByName = await this.departmentRepository.findByName(data.name);
            if (existingByName && existingByName.id !== id) {
                throw new ApiError_1.ApiError("Department name already exists", 409);
            }
        }
        if (data.code) {
            const existingByCode = await this.departmentRepository.findByCode(data.code);
            if (existingByCode && existingByCode.id !== id) {
                throw new ApiError_1.ApiError("Department code already exists", 409);
            }
        }
        // Validate department head if provided
        if (data.headId) {
            await this.validateDepartmentHead(data.headId, id);
        }
        return this.departmentRepository.update(id, data);
    }
    async deleteDepartment(id) {
        await this.getDepartmentById(id);
        return this.departmentRepository.softDelete(id);
    }
    async getDepartmentUsers(id) {
        await this.getDepartmentById(id);
        return this.departmentRepository.getDepartmentUsers(id);
    }
    async ensureUnique(name, code) {
        const [existingName, existingCode] = await Promise.all([
            this.departmentRepository.findByName(name),
            this.departmentRepository.findByCode(code),
        ]);
        if (existingName) {
            throw new ApiError_1.ApiError("Department name already exists", 409);
        }
        if (existingCode) {
            throw new ApiError_1.ApiError("Department code already exists", 409);
        }
    }
    async validateDepartmentHead(userId, currentDepartmentId) {
        // Check if user exists
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new ApiError_1.ApiError("User not found", 404);
        }
        // Check if user has HEAD_OF_DEPARTMENT role
        if (user.role !== client_1.Role.HEAD_OF_DEPARTMENT) {
            throw new ApiError_1.ApiError("User must have HEAD_OF_DEPARTMENT role to be assigned as department head", 400);
        }
        // Check if user is already assigned to another department as employee
        if (user.departmentId) {
            throw new ApiError_1.ApiError("User is already assigned to another department and cannot be a department head", 400);
        }
        // Check if user is already head of another department
        const departmentLed = user.departmentLed;
        if (departmentLed !== null && departmentLed.id !== currentDepartmentId) {
            throw new ApiError_1.ApiError(`User is already head of department: ${departmentLed.name}`, 400);
        }
    }
}
exports.DepartmentService = DepartmentService;

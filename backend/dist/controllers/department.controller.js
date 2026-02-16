"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentController = void 0;
const department_service_1 = require("../services/department.service");
const response_1 = require("../utils/response");
class DepartmentController {
    constructor() {
        this.departmentService = new department_service_1.DepartmentService();
    }
    async getAllDepartments(_req, res, next) {
        try {
            const departments = await this.departmentService.getAllDepartments();
            return response_1.ApiResponseHelper.success(res, departments, "Departments fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async getDepartmentById(req, res, next) {
        try {
            const department = await this.departmentService.getDepartmentById(req.params.id);
            return response_1.ApiResponseHelper.success(res, department, "Department fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async createDepartment(req, res, next) {
        try {
            const dto = req.body;
            const department = await this.departmentService.createDepartment(dto);
            return response_1.ApiResponseHelper.created(res, department, "Department created successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async updateDepartment(req, res, next) {
        try {
            const dto = req.body;
            const department = await this.departmentService.updateDepartment(req.params.id, dto);
            return response_1.ApiResponseHelper.success(res, department, "Department updated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async deleteDepartment(req, res, next) {
        try {
            await this.departmentService.deleteDepartment(req.params.id);
            return response_1.ApiResponseHelper.success(res, { id: req.params.id }, "Department deactivated successfully");
        }
        catch (error) {
            next(error);
        }
    }
    async getDepartmentUsers(req, res, next) {
        try {
            const users = await this.departmentService.getDepartmentUsers(req.params.id);
            return response_1.ApiResponseHelper.success(res, users, "Department users fetched successfully");
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DepartmentController = DepartmentController;

import { Request, Response, NextFunction } from "express";
import { DepartmentService } from "../services/department.service";
import { ApiResponseHelper } from "../utils/response";
import { CreateDepartmentDto, UpdateDepartmentDto } from "../types/department.dto";

export class DepartmentController {
    private departmentService: DepartmentService;

    constructor() {
        this.departmentService = new DepartmentService();
    }

    async getAllDepartments(_req: Request, res: Response, next: NextFunction) {
        try {
            const departments = await this.departmentService.getAllDepartments();
            return ApiResponseHelper.success(res, departments, "Departments fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async getDepartmentById(req: Request, res: Response, next: NextFunction) {
        try {
            const department = await this.departmentService.getDepartmentById(req.params.id as string);
            return ApiResponseHelper.success(res, department, "Department fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async createDepartment(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: CreateDepartmentDto = req.body;
            const department = await this.departmentService.createDepartment(dto);
            return ApiResponseHelper.created(res, department, "Department created successfully");
        } catch (error) {
            next(error);
        }
    }

    async updateDepartment(req: Request, res: Response, next: NextFunction) {
        try {
            const dto: UpdateDepartmentDto = req.body;
            const department = await this.departmentService.updateDepartment(req.params.id as string, dto);
            return ApiResponseHelper.success(res, department, "Department updated successfully");
        } catch (error) {
            next(error);
        }
    }

    async deleteDepartment(req: Request, res: Response, next: NextFunction) {
        try {
            await this.departmentService.deleteDepartment(req.params.id as string);
            return ApiResponseHelper.success(res, { id: req.params.id }, "Department deactivated successfully");
        } catch (error) {
            next(error);
        }
    }

    async getDepartmentUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.departmentService.getDepartmentUsers(req.params.id as string);
            return ApiResponseHelper.success(res, users, "Department users fetched successfully");
        } catch (error) {
            next(error);
        }
    }
}

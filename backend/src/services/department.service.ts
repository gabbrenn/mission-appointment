import { DepartmentRepository } from "../repositories/department.repository";
import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";
import { CreateDepartmentDto, UpdateDepartmentDto } from "../types/department.dto";
import { Role } from "@prisma/client";

export class DepartmentService {
    private departmentRepository: DepartmentRepository;
    private userRepository: UserRepository;

    constructor() {
        this.departmentRepository = new DepartmentRepository();
        this.userRepository = new UserRepository();
    }

    async getAllDepartments() {
        return this.departmentRepository.getAll();
    }

    async getDepartmentById(id: string) {
        const department = await this.departmentRepository.getById(id);
        if (!department) {
            throw new ApiError("Department not found", 404);
        }
        return department;
    }

    async createDepartment(data: CreateDepartmentDto) {
        await this.ensureUnique(data.name, data.code);
        
        // Validate department head if provided
        if (data.headId) {
            await this.validateDepartmentHead(data.headId);
        }
        
        return this.departmentRepository.create(data);
    }

    async updateDepartment(id: string, data: UpdateDepartmentDto) {
        await this.getDepartmentById(id);

        if (data.name) {
            const existingByName = await this.departmentRepository.findByName(data.name);
            if (existingByName && existingByName.id !== id) {
                throw new ApiError("Department name already exists", 409);
            }
        }

        if (data.code) {
            const existingByCode = await this.departmentRepository.findByCode(data.code);
            if (existingByCode && existingByCode.id !== id) {
                throw new ApiError("Department code already exists", 409);
            }
        }

        // Validate department head if provided
        if (data.headId) {
            await this.validateDepartmentHead(data.headId, id);
        }

        return this.departmentRepository.update(id, data);
    }

    async deleteDepartment(id: string) {
        await this.getDepartmentById(id);
        return this.departmentRepository.softDelete(id);
    }

    async getDepartmentUsers(id: string) {
        await this.getDepartmentById(id);
        return this.departmentRepository.getDepartmentUsers(id);
    }

    private async ensureUnique(name: string, code: string) {
        const [existingName, existingCode] = await Promise.all([
            this.departmentRepository.findByName(name),
            this.departmentRepository.findByCode(code),
        ]);

        if (existingName) {
            throw new ApiError("Department name already exists", 409);
        }

        if (existingCode) {
            throw new ApiError("Department code already exists", 409);
        }
    }

    private async validateDepartmentHead(userId: string, currentDepartmentId?: string) {
        // Check if user exists
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new ApiError("User not found", 404);
        }

        // Check if user has HEAD_OF_DEPARTMENT role
        if (user.role !== Role.HEAD_OF_DEPARTMENT) {
            throw new ApiError("User must have HEAD_OF_DEPARTMENT role to be assigned as department head", 400);
        }

        // Check if user is already assigned to another department as employee
        if (user.departmentId) {
            throw new ApiError("User is already assigned to another department and cannot be a department head", 400);
        }

        // Check if user is already head of another department
        const departmentLed = user.departmentLed;
        if (departmentLed !== null && departmentLed.id !== currentDepartmentId) {
            throw new ApiError(`User is already head of department: ${departmentLed.name}`, 400);
        }
    }
}

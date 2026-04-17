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
        const code = data.code || await this.generateDepartmentCode(data.name); 

        await this.ensureUnique(data.name, code);

        // Validate department head if provided
        if (data.headId) {
            await this.validateDepartmentHead(data.headId);
        }

        return this.departmentRepository.create({ ...data, code });
    }

    async updateDepartment(id: string, data: UpdateDepartmentDto) {
        const existing = await this.getDepartmentById(id);

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

        // Handle department head changes
        if (data.headId !== undefined) {
            // If removing head (setting to null)
            if (data.headId === null || data.headId === '') {
                // Simply allow removal
                data.headId = undefined;
            } else {
                // If assigning new head, validate
                await this.validateDepartmentHead(data.headId, id);
            }
        }

        return this.departmentRepository.update(id, data);
    }

    async deleteDepartment(id: string) {
        const department = await this.getDepartmentById(id);
        
        // Check if department has users assigned
        const users = await this.departmentRepository.getDepartmentUsers(id);
        if (users.length > 0) {
            throw new ApiError(`Cannot delete department. ${users.length} users are currently assigned to this department. Please reassign users first.`, 400);
        }
        
        // Check if department has a head assigned
        if (department.headId) {
            throw new ApiError("Cannot delete department. Please remove the department head assignment first.", 400);
        }
        
        return this.departmentRepository.softDelete(id);
    }

    async getDepartmentUsers(id: string) {
        await this.getDepartmentById(id);
        return this.departmentRepository.getDepartmentUsers(id);
    }

    async removeDepartmentHead(id: string) {
        const department = await this.getDepartmentById(id);
        
        if (!department.headId) {
            throw new ApiError("Department does not have a head assigned", 400);
        }
        
        return this.departmentRepository.update(id, { 
            departmentHead: {
                disconnect: true
            }
        });
    }

    async bulkTransferUsers(fromDepartmentId: string, toDepartmentId: string, userIds: string[]) {
        // Validate source department
        await this.getDepartmentById(fromDepartmentId);
        
        // Validate target department
        const targetDepartment = await this.getDepartmentById(toDepartmentId);
        if (targetDepartment.status !== 'ACTIVE') {
            throw new ApiError("Cannot transfer users to inactive department", 400);
        }
        
        if (userIds.length === 0) {
            throw new ApiError("At least one user ID is required", 400);
        }
        
        // Batch update users through user repository
        const results = [];
        for (const userId of userIds) {
            try {
                const user = await this.userRepository.getUserById(userId);
                if (!user) {
                    results.push({ userId, success: false, error: "User not found" });
                    continue;
                }
                
                if (user.departmentId !== fromDepartmentId) {
                    results.push({ userId, success: false, error: "User not in source department" });
                    continue;
                }
                
                if (user.role === Role.HEAD_OF_DEPARTMENT) {
                    results.push({ userId, success: false, error: "Cannot transfer department head as regular employee" });
                    continue;
                }
                
                await this.userRepository.updateUser(userId, { 
                    department: {
                        connect: { id: toDepartmentId }
                    }
                });
                results.push({ userId, success: true });
            } catch (error) {
                results.push({ userId, success: false, error: (error as Error).message });
            }
        }
        
        return {
            total: userIds.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results
        };
    }

    private async generateDepartmentCode(name: string): Promise<string> {
        // Simple code generator: first 3 letters of name + random 3 numbers
        const prefix = name.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase();
        let result = `${prefix}-`;
        for (let i = 0; i < 3; i++) {
            result += Math.floor(Math.random() * 10);
        }
        
        const existing = await this.departmentRepository.findByCode(result);
        if (existing) {
            return this.generateDepartmentCode(name);
        }

        return result;
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

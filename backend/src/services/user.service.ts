import { UserRepository } from "../repositories/user.repository";
import { hashPassword } from "../utils/password";
import { ApiError } from "../utils/ApiError";
import { AvailabilityStatus, Prisma, Role } from "@prisma/client";
import { CreateUserDto, RegisterUserDto, UpdateAvailabilityDto, UpdateUserDto, UserSkillDto } from "../types/user.dto";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async registerUser(data: RegisterUserDto) {
        return this.createUser(data);
    }

    async createUser(data: CreateUserDto) {
        await this.ensureUserUnique(data.email, data.employeeId);
        
        // Validate HEAD_OF_DEPARTMENT role constraints
        if (data.role === Role.HEAD_OF_DEPARTMENT && data.departmentId) {
            throw new ApiError("Users with HEAD_OF_DEPARTMENT role cannot be assigned to a department as regular employees. They should be assigned as department heads.", 400);
        }
        
        const hashedPassword = await hashPassword(data.password);

        return this.userRepository.createUser({
            ...data,
            password: hashedPassword,
        } as Prisma.UserCreateInput);
    }

    async getAllUsers() {
        return this.userRepository.getAllUsers();
    }

    async getUserByEmail(email: string) {
        return this.userRepository.getUserByEmail(email);
    }

    async getUserById(id: string) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new ApiError("User not found", 404);
        }
        return user;
    }

    async updateUser(id: string, data: UpdateUserDto) {
        const existing = await this.userRepository.getUserById(id);
        if (!existing) {
            throw new ApiError("User not found", 404);
        }

        if (data.email && data.email !== existing.email) {
            const emailExists = await this.userRepository.getUserByEmail(data.email);
            if (emailExists) {
                throw new ApiError("Email already in use", 409);
            }
        }

        if (data.employeeId && data.employeeId !== existing.employeeId) {
            const employeeExists = await this.userRepository.getUserByEmployeeId(data.employeeId);
            if (employeeExists) {
                throw new ApiError("Employee ID already in use", 409);
            }
        }

        // Validate role and department changes
        const newRole = data.role || existing.role;
        const newDepartmentId = data.departmentId !== undefined ? data.departmentId : existing.departmentId;

        // If user has or is being changed to HEAD_OF_DEPARTMENT role, they cannot have departmentId
        if (newRole === Role.HEAD_OF_DEPARTMENT && newDepartmentId) {
            throw new ApiError("Users with HEAD_OF_DEPARTMENT role cannot be assigned to a department as regular employees. They should be assigned as department heads.", 400);
        }

        // If user is currently head of a department and trying to change role or assign to department
        const departmentLed = existing.departmentLed;
        if (departmentLed !== null && (data.role || data.departmentId)) {
            if (data.role && data.role !== Role.HEAD_OF_DEPARTMENT) {
                throw new ApiError(`User is currently head of department: ${departmentLed.name}. Remove them as department head before changing their role.`, 400);
            }
        }

        const updatePayload = { ...data } as Prisma.UserUpdateInput;

        if (data.password) {
            updatePayload.password = await hashPassword(data.password);
        }

        return this.userRepository.updateUser(id, updatePayload);
    }

    async softDeleteUser(id: string) {
        const existing = await this.userRepository.getUserById(id);
        if (!existing) {
            throw new ApiError("User not found", 404);
        }
        return this.userRepository.softDeleteUser(id);
    }

    async updateAvailability(id: string, availabilityStatus: AvailabilityStatus) {
        await this.getUserById(id);
        return this.userRepository.updateAvailability(id, availabilityStatus);
    }

    async getUserSkills(userId: string) {
        await this.getUserById(userId);
        return this.userRepository.getUserSkills(userId);
    }

    async addUserSkill(userId: string, data: UserSkillDto) {
        await this.getUserById(userId);
        const exists = await this.userRepository.findUserSkillByName(userId, data.skillName);
        if (exists) {
            throw new ApiError("Skill already exists for user", 409);
        }
        return this.userRepository.addUserSkill(userId, data.skillName);
    }

    async removeUserSkill(userId: string, skillId: string) {
        await this.getUserById(userId);
        const result = await this.userRepository.removeUserSkill(userId, skillId);
        if (result.count === 0) {
            throw new ApiError("Skill not found for user", 404);
        }
        return { deleted: result.count };
    }

    private async ensureUserUnique(email: string, employeeId: string) {
        const [emailExists, employeeExists] = await Promise.all([
            this.userRepository.getUserByEmail(email),
            this.userRepository.getUserByEmployeeId(employeeId),
        ]);

        if (emailExists) {
            throw new ApiError("User with this email already exists", 409);
        }

        if (employeeExists) {
            throw new ApiError("User with this employee ID already exists", 409);
        }
    }
}

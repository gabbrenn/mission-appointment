import { AvailabilityStatus, AccountStatus, Role } from "@prisma/client";

export interface RegisterUserDto {
    employeeId: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    departmentId?: string;
    role: Role;
    phone?: string;
    position?: string;
}

export interface CreateUserDto extends RegisterUserDto {
    profilePhoto?: string;
}

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    position?: string;
    email?: string;
    employeeId?: string;
    role?: Role;
    departmentId?: string;
    availabilityStatus?: AvailabilityStatus;
    accountStatus?: AccountStatus;
    profilePhoto?: string;
    password?: string;
}

export interface UpdateAvailabilityDto {
    availabilityStatus: AvailabilityStatus;
}

export interface UserSkillDto {
    skillName: string;
}
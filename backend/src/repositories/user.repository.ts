import { Prisma, AvailabilityStatus, AccountStatus } from "@prisma/client";
import prisma from "../lib/prisma";

export class UserRepository {
    async createUser(data: Prisma.UserCreateInput) {
        return prisma.user.create({ data });
    }

    async getUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async getUserByEmployeeId(employeeId: string) {
        return prisma.user.findUnique({
            where: { employeeId },
        });
    }

    async getUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            include: {
                department: true,
                departmentLed: true,
                skills: true,
            },
        });
    }

    async getAllUsers() {
        return prisma.user.findMany({
            include: {
                department: true,
                skills: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async updateUser(id: string, data: Prisma.UserUpdateInput) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async softDeleteUser(id: string) {
        return prisma.user.update({
            where: { id },
            data: {
                accountStatus: AccountStatus.INACTIVE,
                availabilityStatus: AvailabilityStatus.UNAVAILABLE,
            },
        });
    }

    async updateAvailability(id: string, availabilityStatus: AvailabilityStatus) {
        return prisma.user.update({
            where: { id },
            data: { availabilityStatus },
        });
    }

    async getUserSkills(userId: string) {
        return prisma.employeeSkill.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }

    async addUserSkill(userId: string, skillName: string) {
        return prisma.employeeSkill.create({
            data: {
                userId,
                skillName,
            },
        });
    }

    async findUserSkillByName(userId: string, skillName: string) {
        return prisma.employeeSkill.findFirst({
            where: { userId, skillName },
        });
    }

    async removeUserSkill(userId: string, skillId: string) {
        return prisma.employeeSkill.deleteMany({
            where: { id: skillId, userId },
        });
    }
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../lib/prisma"));
class UserRepository {
    async createUser(data) {
        return prisma_1.default.user.create({ data });
    }
    async getUserByEmail(email) {
        return prisma_1.default.user.findUnique({
            where: { email },
        });
    }
    async getUserByEmployeeId(employeeId) {
        return prisma_1.default.user.findUnique({
            where: { employeeId },
        });
    }
    async getUserById(id) {
        return prisma_1.default.user.findUnique({
            where: { id },
            include: {
                department: true,
                departmentLed: true,
                skills: true,
            },
        });
    }
    async getAllUsers() {
        return prisma_1.default.user.findMany({
            include: {
                department: true,
                skills: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async updateUser(id, data) {
        return prisma_1.default.user.update({
            where: { id },
            data,
        });
    }
    async softDeleteUser(id) {
        return prisma_1.default.user.update({
            where: { id },
            data: {
                accountStatus: client_1.AccountStatus.INACTIVE,
                availabilityStatus: client_1.AvailabilityStatus.UNAVAILABLE,
            },
        });
    }
    async updateAvailability(id, availabilityStatus) {
        return prisma_1.default.user.update({
            where: { id },
            data: { availabilityStatus },
        });
    }
    async getUserSkills(userId) {
        return prisma_1.default.employeeSkill.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }
    async addUserSkill(userId, skillName) {
        return prisma_1.default.employeeSkill.create({
            data: {
                userId,
                skillName,
            },
        });
    }
    async findUserSkillByName(userId, skillName) {
        return prisma_1.default.employeeSkill.findFirst({
            where: { userId, skillName },
        });
    }
    async removeUserSkill(userId, skillId) {
        return prisma_1.default.employeeSkill.deleteMany({
            where: { id: skillId, userId },
        });
    }
}
exports.UserRepository = UserRepository;

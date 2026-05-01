"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentRepository = void 0;
const prisma_1 = require("../config/prisma");
class DepartmentRepository {
    async getAll() {
        return prisma_1.prisma.department.findMany({
            include: { users: true },
            orderBy: { name: "asc" },
        });
    }
    async getById(id) {
        return prisma_1.prisma.department.findUnique({
            where: { id },
            include: { users: true },
        });
    }
    async findByName(name) {
        return prisma_1.prisma.department.findUnique({ where: { name } });
    }
    async findByCode(code) {
        return prisma_1.prisma.department.findUnique({ where: { code } });
    }
    async create(data) {
        return prisma_1.prisma.department.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.department.update({
            where: { id },
            data,
        });
    }
    async softDelete(id) {
        return prisma_1.prisma.department.update({
            where: { id },
            data: { status: "INACTIVE" },
        });
    }
    async getDepartmentUsers(id) {
        return prisma_1.prisma.user.findMany({
            where: { departmentId: id },
            orderBy: { createdAt: "desc" },
        });
    }
}
exports.DepartmentRepository = DepartmentRepository;

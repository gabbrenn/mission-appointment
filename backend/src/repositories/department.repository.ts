import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

export class DepartmentRepository {
    async getAll() {
        return prisma.department.findMany({
            include: { users: true },
            orderBy: { name: "asc" },
        });
    }

    async getById(id: string) {
        return prisma.department.findUnique({
            where: { id },
            include: { users: true },
        });
    }

    async findByName(name: string) {
        return prisma.department.findUnique({ where: { name } });
    }

    async findByCode(code: string) {
        return prisma.department.findUnique({ where: { code } });
    }

    async create(data: Prisma.DepartmentCreateInput) {
        return prisma.department.create({ data });
    }

    async update(id: string, data: Prisma.DepartmentUpdateInput) {
        return prisma.department.update({
            where: { id },
            data,
        });
    }

    async softDelete(id: string) {
        return prisma.department.update({
            where: { id },
            data: { status: "INACTIVE" },
        });
    }

    async getDepartmentUsers(id: string) {
        return prisma.user.findMany({
            where: { departmentId: id },
            orderBy: { createdAt: "desc" },
        });
    }
}

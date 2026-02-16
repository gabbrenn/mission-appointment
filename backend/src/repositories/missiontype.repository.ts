import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

export class MissionTypeRepository {
    async createMissionType(data: Prisma.MissionTypeCreateInput) {
        return prisma.missionType.create({ data });
    }

    async getAllMissionTypes() {
        return prisma.missionType.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    async getMissionTypeById(id: string) {
        return prisma.missionType.findUnique({
            where: { id },
        });
    }

    async findMissionTypeByName(name: string) {
        return prisma.missionType.findUnique({
            where: { name },
        });
    }

    async updateMissionType(id: string, data: Prisma.MissionTypeUpdateInput) {
        return prisma.missionType.update({
            where: { id },
            data,
        });
    }

    async softDeleteMissionType(id: string) {
        return prisma.missionType.update({
            where: { id },
            data: { status: "INACTIVE" },
        });
    }
}
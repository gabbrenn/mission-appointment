"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionTypeRepository = void 0;
const prisma_1 = require("../config/prisma");
class MissionTypeRepository {
    async createMissionType(data) {
        return prisma_1.prisma.missionType.create({ data });
    }
    async getAllMissionTypes() {
        return prisma_1.prisma.missionType.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    async getMissionTypeById(id) {
        return prisma_1.prisma.missionType.findUnique({
            where: { id },
        });
    }
    async findMissionTypeByName(name) {
        return prisma_1.prisma.missionType.findUnique({
            where: { name },
        });
    }
    async updateMissionType(id, data) {
        return prisma_1.prisma.missionType.update({
            where: { id },
            data,
        });
    }
    async softDeleteMissionType(id) {
        return prisma_1.prisma.missionType.update({
            where: { id },
            data: { status: "INACTIVE" },
        });
    }
}
exports.MissionTypeRepository = MissionTypeRepository;

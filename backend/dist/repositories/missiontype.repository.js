"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionTypeRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class MissionTypeRepository {
    async createMissionType(data) {
        return prisma_1.default.missionType.create({ data });
    }
    async getAllMissionTypes() {
        return prisma_1.default.missionType.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    async getMissionTypeById(id) {
        return prisma_1.default.missionType.findUnique({
            where: { id },
        });
    }
    async findMissionTypeByName(name) {
        return prisma_1.default.missionType.findUnique({
            where: { name },
        });
    }
    async updateMissionType(id, data) {
        return prisma_1.default.missionType.update({
            where: { id },
            data,
        });
    }
    async softDeleteMissionType(id) {
        return prisma_1.default.missionType.update({
            where: { id },
            data: { status: "INACTIVE" },
        });
    }
}
exports.MissionTypeRepository = MissionTypeRepository;

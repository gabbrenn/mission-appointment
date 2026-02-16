"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class AuditLogRepository {
    async createAuditLog(data) {
        return prisma_1.default.auditLog.create({ data });
    }
    async getAuditLogsByUser(userId) {
        return prisma_1.default.auditLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAuditLogsByAction(action) {
        return prisma_1.default.auditLog.findMany({
            where: { action },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getLoginLogsByUser(userId) {
        return prisma_1.default.auditLog.findMany({
            where: {
                userId,
                action: { in: ['login', 'logout'] }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.AuditLogRepository = AuditLogRepository;

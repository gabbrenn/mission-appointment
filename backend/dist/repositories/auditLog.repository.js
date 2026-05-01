"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogRepository = void 0;
const prisma_1 = require("../config/prisma");
class AuditLogRepository {
    async createAuditLog(data) {
        return prisma_1.prisma.auditLog.create({ data });
    }
    async getAuditLogsByUser(userId) {
        return prisma_1.prisma.auditLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAuditLogsByAction(action) {
        return prisma_1.prisma.auditLog.findMany({
            where: { action },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getLoginLogsByUser(userId) {
        return prisma_1.prisma.auditLog.findMany({
            where: {
                userId,
                action: { in: ['login', 'logout'] }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.AuditLogRepository = AuditLogRepository;

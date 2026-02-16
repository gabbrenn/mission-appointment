import prisma from "../lib/prisma";
import { AuditLog } from "@prisma/client";

export class AuditLogRepository {
    async createAuditLog(data: {
        action: string;
        module: string;
        tableName?: string;
        recordId?: string;
        beforeValue?: string;
        afterValue?: string;
        ipAddress?: string;
        userAgent?: string;
        userId?: string;
    }) {
        return prisma.auditLog.create({ data });
    }

    async getAuditLogsByUser(userId: string) {
        return prisma.auditLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getAuditLogsByAction(action: string) {
        return prisma.auditLog.findMany({
            where: { action },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getLoginLogsByUser(userId: string) {
        return prisma.auditLog.findMany({
            where: {
                userId,
                action: { in: ['login', 'logout'] }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}

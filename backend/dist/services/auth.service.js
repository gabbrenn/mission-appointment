"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const user_repository_1 = require("../repositories/user.repository");
const auditLog_repository_1 = require("../repositories/auditLog.repository");
class AuthService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
        this.auditLogRepository = new auditLog_repository_1.AuditLogRepository();
    }
    async login(email, password, ipAddress, userAgent) {
        // Find user by email
        const user = await this.userRepository.getUserByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // Check if account is active
        if (user.accountStatus !== 'ACTIVE') {
            throw new Error('Account is not active');
        }
        // Verify password
        const isPasswordValid = await (0, password_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Generate JWT token with user and role info
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        });
        // Update lastLogin timestamp
        await this.userRepository.updateUser(user.id, {
            lastLogin: new Date(),
        });
        // Log the login action to AuditLog
        await this.auditLogRepository.createAuditLog({
            action: 'login',
            module: 'users',
            tableName: 'user',
            recordId: user.id,
            userId: user.id,
            ipAddress,
            userAgent,
        });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                phone: user.phone,
                position: user.position,
            },
        };
    }
    async logout(userId, ipAddress, userAgent) {
        // Log the logout action to AuditLog
        await this.auditLogRepository.createAuditLog({
            action: 'logout',
            module: 'users',
            tableName: 'user',
            recordId: userId,
            userId,
            ipAddress,
            userAgent,
        });
        return { message: 'Logged out successfully' };
    }
    async getLoginHistory(userId) {
        return await this.auditLogRepository.getLoginLogsByUser(userId);
    }
}
exports.AuthService = AuthService;

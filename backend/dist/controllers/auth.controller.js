"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
const appError_1 = require("../utils/appError");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            // Validate input
            if (!email || !password) {
                throw new appError_1.BadRequestError("Email and password are required");
            }
            // Get client IP and user agent
            const ipAddress = req.ip || req.connection.remoteAddress;
            const userAgent = req.get('user-agent');
            const result = await this.authService.login(email, password, ipAddress, userAgent);
            return response_1.ApiResponseHelper.success(res, result, "Login successful", 200);
        }
        catch (error) {
            if (error.message.includes("Invalid email or password")) {
                next(new appError_1.UnauthorizedError(error.message));
            }
            else if (error.message.includes("not active")) {
                next(new appError_1.UnauthorizedError(error.message));
            }
            else {
                next(error);
            }
        }
    }
    async logout(req, res, next) {
        try {
            // userId should be set by auth middleware
            const userId = req.user?.id;
            if (!userId) {
                throw new appError_1.UnauthorizedError("User not authenticated");
            }
            // Get client IP and user agent
            const ipAddress = req.ip || req.connection.remoteAddress;
            const userAgent = req.get('user-agent');
            const result = await this.authService.logout(userId, ipAddress, userAgent);
            return response_1.ApiResponseHelper.success(res, result, "Logout successful", 200);
        }
        catch (error) {
            next(error);
        }
    }
    async getLoginHistory(req, res, next) {
        try {
            // userId should be set by auth middleware
            const userId = req.user?.id;
            if (!userId) {
                throw new appError_1.UnauthorizedError("User not authenticated");
            }
            const history = await this.authService.getLoginHistory(userId);
            return response_1.ApiResponseHelper.success(res, history, "Login history retrieved successfully", 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;

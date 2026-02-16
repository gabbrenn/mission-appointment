import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponseHelper } from "../utils/response";
import { UnauthorizedError, BadRequestError } from "../utils/appError";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                throw new BadRequestError("Email and password are required");
            }

            // Get client IP and user agent
            const ipAddress = req.ip || req.connection.remoteAddress;
            const userAgent = req.get('user-agent');

            const result = await this.authService.login(email, password, ipAddress, userAgent);
            
            return ApiResponseHelper.success(
                res,
                result,
                "Login successful",
                200
            );
        } catch (error: any) {
            if (error.message.includes("Invalid email or password")) {
                next(new UnauthorizedError(error.message));
            } else if (error.message.includes("not active")) {
                next(new UnauthorizedError(error.message));
            } else {
                next(error);
            }
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            // userId should be set by auth middleware
            const userId = (req as any).user?.id;

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            // Get client IP and user agent
            const ipAddress = req.ip || req.connection.remoteAddress;
            const userAgent = req.get('user-agent');

            const result = await this.authService.logout(userId, ipAddress, userAgent);
            
            return ApiResponseHelper.success(
                res,
                result,
                "Logout successful",
                200
            );
        } catch (error) {
            next(error);
        }
    }

    async getLoginHistory(req: Request, res: Response, next: NextFunction) {
        try {
            // userId should be set by auth middleware
            const userId = (req as any).user?.id;

            if (!userId) {
                throw new UnauthorizedError("User not authenticated");
            }

            const history = await this.authService.getLoginHistory(userId);
            
            return ApiResponseHelper.success(
                res,
                history,
                "Login history retrieved successfully",
                200
            );
        } catch (error) {
            next(error);
        }
    }
}

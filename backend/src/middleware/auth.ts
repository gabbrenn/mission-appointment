import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

export interface AuthenticatedUser {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
}

export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError("Authentication required", 401));
    }

    const token = authHeader.substring(7);

    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return next(new ApiError("Invalid or expired token", 401));
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
        };

        return next();
    } catch (error) {
        return next(new ApiError("Authentication failed", 401));
    }
};

export const authorize = (roles: string[] = []) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ApiError("Authentication required", 401));
        }

        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return next(new ApiError("Forbidden", 403));
        }

        return next();
    };
};

export const authorizeSelfOrRoles = (roles: string[] = []) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ApiError("Authentication required", 401));
        }

        const isSelf = req.params?.id === req.user.id;
        if (isSelf) {
            return next();
        }

        if (roles.length === 0 || roles.includes(req.user.role)) {
            return next();
        }

        return next(new ApiError("Forbidden", 403));
    };
};

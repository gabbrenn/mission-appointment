"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const appError_1 = require("../utils/appError");
const authMiddleware = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new appError_1.UnauthorizedError("No token provided");
        }
        const token = authHeader.substring(7); // Remove "Bearer " prefix
        // Verify token
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            throw new appError_1.UnauthorizedError("Invalid or expired token");
        }
        // Attach user info to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
        };
        next();
    }
    catch (error) {
        next(new appError_1.UnauthorizedError("Authentication failed"));
    }
};
exports.authMiddleware = authMiddleware;
// Optional: Role-based access control middleware
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new appError_1.UnauthorizedError("User not authenticated"));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new appError_1.UnauthorizedError("Access denied: insufficient permissions"));
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;

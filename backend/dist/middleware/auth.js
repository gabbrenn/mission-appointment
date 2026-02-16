"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeSelfOrRoles = exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const ApiError_1 = require("../utils/ApiError");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError_1.ApiError("Authentication required", 401));
    }
    const token = authHeader.substring(7);
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            return next(new ApiError_1.ApiError("Invalid or expired token", 401));
        }
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
        };
        return next();
    }
    catch (error) {
        return next(new ApiError_1.ApiError("Authentication failed", 401));
    }
};
exports.authenticate = authenticate;
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError_1.ApiError("Authentication required", 401));
        }
        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return next(new ApiError_1.ApiError("Forbidden", 403));
        }
        return next();
    };
};
exports.authorize = authorize;
const authorizeSelfOrRoles = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError_1.ApiError("Authentication required", 401));
        }
        const isSelf = req.params?.id === req.user.id;
        if (isSelf) {
            return next();
        }
        if (roles.length === 0 || roles.includes(req.user.role)) {
            return next();
        }
        return next(new ApiError_1.ApiError("Forbidden", 403));
    };
};
exports.authorizeSelfOrRoles = authorizeSelfOrRoles;

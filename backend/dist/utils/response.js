"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseHelper = void 0;
class ApiResponseHelper {
    static success(res, data, message = "Success", statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
    static created(res, data, message = "Created successfully") {
        return this.success(res, data, message, 201);
    }
    static notFound(res, message = "Resource not found") {
        return res.status(404).json({
            success: false,
            message,
        });
    }
    static badRequest(res, message = "Bad request") {
        return res.status(400).json({
            success: false,
            message,
        });
    }
    static unauthorized(res, message = "Unauthorized") {
        return res.status(401).json({
            success: false,
            message,
        });
    }
    static conflict(res, message = "Resource already exists") {
        return res.status(409).json({
            success: false,
            message,
        });
    }
    static error(res, message = "Internal server error", statusCode = 500, errors) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    }
}
exports.ApiResponseHelper = ApiResponseHelper;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.UnauthorizedError = exports.BadRequestError = exports.NotFoundError = exports.AppError = void 0;
const ApiError_1 = require("./ApiError");
class AppError extends ApiError_1.ApiError {
    constructor(message, statusCode) {
        super(message, statusCode);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ConflictError extends AppError {
    constructor(message = "Resource already exists") {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;

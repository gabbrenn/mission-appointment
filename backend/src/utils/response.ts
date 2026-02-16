import { Response } from "express";

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export class ApiResponseHelper {
    static success<T>(res: Response, data: T, message = "Success", statusCode = 200): Response {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    static created<T>(res: Response, data: T, message = "Created successfully"): Response {
        return this.success(res, data, message, 201);
    }

    static notFound(res: Response, message = "Resource not found"): Response {
        return res.status(404).json({
            success: false,
            message,
        });
    }

    static badRequest(res: Response, message = "Bad request"): Response {
        return res.status(400).json({
            success: false,
            message,
        });
    }

    static unauthorized(res: Response, message = "Unauthorized"): Response {
        return res.status(401).json({
            success: false,
            message,
        });
    }

    static conflict(res: Response, message = "Resource already exists"): Response {
        return res.status(409).json({
            success: false,
            message,
        });
    }

    static error(res: Response, message = "Internal server error", statusCode = 500, errors?: any): Response {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    }
}

import { Router, Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { DepartmentController } from "../controllers/department.controller";
import { authenticate, authorize } from "../middleware/auth";
import { ApiError } from "../utils/ApiError";

const router = Router();
const departmentController = new DepartmentController();

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError("Validation failed", 400, errors.array()));
    }
    return next();
};

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
    "/",
    authenticate,
    authorize(["ADMIN", "HR", "HEAD_OF_DEPARTMENT"]),
    (req: Request, res: Response, next: NextFunction) => departmentController.getAllDepartments(req, res, next)
);

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Department'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Department not found
 */
router.get(
    "/:id",
    authenticate,
    authorize(["ADMIN", "HR", "HEAD_OF_DEPARTMENT"]),
    (req: Request, res: Response, next: NextFunction) => departmentController.getDepartmentById(req, res, next)
);

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartmentDto'
 *     responses:
 *       201:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Department'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       409:
 *         description: Department already exists
 */
router.post(
    "/",
    authenticate,
    authorize(["ADMIN"]),
    [
        body("name").notEmpty().withMessage("name is required"),
        body("code").notEmpty().withMessage("code is required"),
        body("budgetAllocation").optional().isNumeric().withMessage("budgetAllocation must be numeric"),
        body("headId").optional().isUUID().withMessage("headId must be a valid UUID"),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => departmentController.createDepartment(req, res, next)
);

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     summary: Update department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDepartmentDto'
 *     responses:
 *       200:
 *         description: Department updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Department'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Department not found
 *       409:
 *         description: Department name or code already exists
 */
router.put(
    "/:id",
    authenticate,
    authorize(["ADMIN"]),
    [
        param("id").notEmpty(),
        body("budgetAllocation").optional().isNumeric().withMessage("budgetAllocation must be numeric"),
        body("headId").optional().isUUID().withMessage("headId must be a valid UUID"),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => departmentController.updateDepartment(req, res, next)
);

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: Delete department (soft delete)
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Department not found
 */
router.delete(
    "/:id",
    authenticate,
    authorize(["ADMIN"]),
    (req: Request, res: Response, next: NextFunction) => departmentController.deleteDepartment(req, res, next)
);

/**
 * @swagger
 * /api/departments/{id}/users:
 *   get:
 *     summary: Get all users in a department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Department ID
 *     responses:
 *       200:
 *         description: List of users in the department
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Department not found
 */
router.get(
    "/:id/users",
    authenticate,
    authorize(["ADMIN", "HR", "HEAD_OF_DEPARTMENT"]),
    (req: Request, res: Response, next: NextFunction) => departmentController.getDepartmentUsers(req, res, next)
);

export default router;

import { Router, Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { MissionTypeController } from "../controllers/missiontype.controller";
import { authenticate, authorize } from "../middleware/auth";
import { ApiError } from "../utils/ApiError";

const router = Router();
const missionTypeController = new MissionTypeController();

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError("Validation failed", 400, errors.array()));
    }
    return next();
};

/**
 * @swagger
 * /api/mission-type:
 *   get:
 *     summary: Get all mission types
 *     tags: [Mission Types]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of mission types
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
 *                     $ref: '#/components/schemas/MissionType'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
    "/",
    authenticate,
    authorize(["ADMIN", "HR", "HEAD_OF_DEPARTMENT"]),
    (req: Request, res: Response, next: NextFunction) => missionTypeController.getAllMissionTypes(req, res, next)
);

/**
 * @swagger
 * /api/mission-type/{id}:
 *   get:
 *     summary: Get mission type by ID
 *     tags: [Mission Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Mission type ID
 *     responses:
 *       200:
 *         description: Mission type details
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
 *                   $ref: '#/components/schemas/MissionType'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Mission type not found
 */
router.get(
    "/:id",
    authenticate,
    authorize(["ADMIN", "HR", "HEAD_OF_DEPARTMENT"]),
    (req: Request, res: Response, next: NextFunction) => missionTypeController.getMissionTypeById(req, res, next)
);

/**
 * @swagger
 * /api/mission-type:
 *   post:
 *     summary: Create a new mission type
 *     tags: [Mission Types]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMissionTypeDto'
 *     responses:
 *       201:
 *         description: Mission type created successfully
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
 *                   $ref: '#/components/schemas/MissionType'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin/Head of Department only)
 *       409:
 *         description: Mission type already exists
 */
router.post(
    "/",
    authenticate,
    authorize(["ADMIN", "HEAD_OF_DEPARTMENT"]),
    [
        body("name").notEmpty().withMessage("name is required"),
        body("defaultBudgetMin").optional().isNumeric().withMessage("defaultBudgetMin must be numeric"),
        body("defaultBudgetMax").optional().isNumeric().withMessage("defaultBudgetMax must be numeric"),
        body("requiredQualifications").optional().isArray().withMessage("requiredQualifications must be an array"),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => missionTypeController.createMissionType(req, res, next)
);

/**
 * @swagger
 * /api/mission-type/{id}:
 *   put:
 *     summary: Update mission type
 *     tags: [Mission Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Mission type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMissionTypeDto'
 *     responses:
 *       200:
 *         description: Mission type updated successfully
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
 *                   $ref: '#/components/schemas/MissionType'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin/Head of Department only)
 *       404:
 *         description: Mission type not found
 *       409:
 *         description: Mission type name already exists
 */
router.put(
    "/:id",
    authenticate,
    authorize(["ADMIN", "HEAD_OF_DEPARTMENT"]),
    [
        param("id").notEmpty(),
        body("defaultBudgetMin").optional().isNumeric().withMessage("defaultBudgetMin must be numeric"),
        body("defaultBudgetMax").optional().isNumeric().withMessage("defaultBudgetMax must be numeric"),
        body("requiredQualifications").optional().isArray().withMessage("requiredQualifications must be an array"),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => missionTypeController.updateMissionType(req, res, next)
);

/**
 * @swagger
 * /api/mission-type/{id}:
 *   delete:
 *     summary: Delete mission type (soft delete)
 *     tags: [Mission Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Mission type ID
 *     responses:
 *       200:
 *         description: Mission type deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Mission type not found
 */
router.delete(
    "/:id",
    authenticate,
    authorize(["ADMIN"]),
    (req: Request, res: Response, next: NextFunction) => missionTypeController.deleteMissionType(req, res, next)
);

export default router;


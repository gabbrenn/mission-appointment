import { Router, Request, Response, NextFunction } from "express";
import { body, query, param, validationResult } from "express-validator";
import { MissionController } from "../controllers/mission.controller";
import { authenticate, authorize } from "../middleware/auth";
import { ApiError } from "../utils/ApiError";

const router = Router();
const missionController = new MissionController();

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError("Validation failed", 400, errors.array()));
    }
    return next();
};

/**
 * @swagger
 * /api/missions:
 *   get:
 *     summary: Get all missions with optional filters
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PENDING_ASSIGNMENT, ASSIGNED, IN_APPROVAL, APPROVED, IN_PROGRESS, COMPLETED, REJECTED, CANCELLED]
 *       - in: query
 *         name: urgencyLevel
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *     responses:
 *       200:
 *         description: Missions retrieved successfully
 */
router.get(
    "/",
    authenticate,
    authorize(["ADMIN", "HR", "DIRECTOR", "HEAD_OF_DEPARTMENT"]),
    [
        query("departmentId").optional().isUUID().withMessage("departmentId must be a valid UUID"),
        query("status").optional().isIn(["DRAFT", "PENDING_ASSIGNMENT", "ASSIGNED", "IN_APPROVAL", "APPROVED", "IN_PROGRESS", "COMPLETED", "REJECTED", "CANCELLED"]),
        query("urgencyLevel").optional().isIn(["LOW", "MEDIUM", "HIGH"]),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => missionController.getAllMissions(req, res, next)
);

/**
 * @swagger
 * /api/missions:
 *   post:
 *     summary: Create new mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - destination
 *               - startDate
 *               - endDate
 *               - departmentId
 *               - estimatedBudget
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               destination:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               departmentId:
 *                 type: string
 *                 format: uuid
 *               estimatedBudget:
 *                 type: number
 *               urgencyLevel:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               budgetCode:
 *                 type: string
 *               requiredQualifications:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Mission created successfully
 */
router.post(
    "/",
    authenticate,
    authorize(["ADMIN", "DIRECTOR", "HEAD_OF_DEPARTMENT"]),
    [
        body("title").notEmpty().withMessage("Title is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("destination").notEmpty().withMessage("Destination is required"),
        body("startDate").isISO8601().withMessage("Start date must be valid ISO date"),
        body("endDate").isISO8601().withMessage("End date must be valid ISO date"),
        body("departmentId").isUUID().withMessage("Department ID must be valid UUID"),
        body("estimatedBudget").isNumeric().withMessage("Estimated budget must be a number"),
        body("urgencyLevel").optional().isIn(["LOW", "MEDIUM", "HIGH"]),
        body("requiredQualifications").optional().isArray(),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => missionController.createMission(req, res, next)
);

/**
 * @swagger
 * /api/missions/assignments:
 *   get:
 *     summary: Get assignments for current user (employee view)
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User assignments retrieved successfully
 */
router.get(
    "/assignments",
    authenticate,
    authorize(["EMPLOYEE", "HEAD_OF_DEPARTMENT", "ADMIN"]),
    (req: Request, res: Response, next: NextFunction) => missionController.getUserAssignments(req, res, next)
);

/**
 * @swagger
 * /api/missions/department:
 *   get:
 *     summary: Get missions for current user's department (department head view)
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Department missions retrieved successfully
 */
router.get(
    "/department",
    authenticate,
    authorize(["HEAD_OF_DEPARTMENT", "DEPARTMENT_HEAD", "ADMIN"]),
    (req: Request, res: Response, next: NextFunction) => missionController.getDepartmentMissions(req, res, next)
);

/**
 * @swagger
 * /api/missions/{id}:
 *   get:
 *     summary: Get mission by ID
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Mission retrieved successfully
 *       404:
 *         description: Mission not found
 */
router.get(
    "/:id",
    authenticate,
    [param("id").isUUID().withMessage("Mission ID must be valid UUID")],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => missionController.getMissionById(req, res, next)
);

/**
 * @swagger
 * /api/missions/{id}:
 *   put:
 *     summary: Update mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               destination:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               estimatedBudget:
 *                 type: number
 *               urgencyLevel:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PENDING_ASSIGNMENT, ASSIGNED, IN_APPROVAL, APPROVED, IN_PROGRESS, COMPLETED, REJECTED, CANCELLED]
 *     responses:
 *       200:
 *         description: Mission updated successfully
 */
router.put(
    "/:id",
    authenticate,
    authorize(["ADMIN", "DIRECTOR", "HEAD_OF_DEPARTMENT",'EMPLOYEE']),
    [
        param("id").isUUID().withMessage("Mission ID must be valid UUID"),
        body("startDate").optional().isISO8601().withMessage("Start date must be valid ISO date"),
        body("endDate").optional().isISO8601().withMessage("End date must be valid ISO date"),
        body("estimatedBudget").optional().isNumeric().withMessage("Estimated budget must be a number"),
        body("urgencyLevel").optional().isIn(["LOW", "MEDIUM", "HIGH"]),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => missionController.updateMission(req, res, next)
);

/**
 * @swagger
 * /api/missions/{id}:
 *   delete:
 *     summary: Cancel mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Mission cancelled successfully
 */
router.delete(
    "/:id",
    authenticate,
    authorize(["ADMIN", "DIRECTOR"]),
    [param("id").isUUID().withMessage("Mission ID must be valid UUID")],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => missionController.deleteMission(req, res, next)
);

/**
 * @swagger
 * /api/missions/{id}/auto-assign:
 *   post:
 *     summary: Auto-assign mission to eligible employees
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maxAssignees:
 *                 type: number
 *                 minimum: 1
 *                 default: 1
 *     responses:
 *       200:
 *         description: Mission auto-assigned successfully
 *       400:
 *         description: No eligible employees found or mission not in DRAFT status
 */
router.post(
    "/:id/auto-assign",
    authenticate,
    authorize(["ADMIN", "HR", "DIRECTOR", "HEAD_OF_DEPARTMENT"]),
    [
        param("id").isUUID().withMessage("Mission ID must be valid UUID"),
        body("maxAssignees").optional().isInt({ min: 1 }).withMessage("Max assignees must be positive integer"),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => missionController.autoAssignMission(req, res, next)
);

/**
 * @swagger
 * /api/missions/{id}/assignments:
 *   get:
 *     summary: Get mission assignments
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Mission assignments retrieved successfully
 */
router.get(
    "/:id/assignments",
    authenticate,
    [param("id").isUUID().withMessage("Mission ID must be valid UUID")],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => missionController.getMissionAssignments(req, res, next)
);

/**
 * @swagger
 * /api/missions/assignments/{assignmentId}/respond:
 *   post:
 *     summary: Employee responds to mission assignment
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - response
 *             properties:
 *               response:
 *                 type: string
 *                 enum: [ACCEPTED, DECLINED]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Response recorded successfully
 */
router.post(
    "/assignments/:assignmentId/respond",
    authenticate,
    authorize(["EMPLOYEE", "ADMIN"]),
    [
        param("assignmentId").isUUID().withMessage("Assignment ID must be valid UUID"),
        body("response").isIn(["ACCEPTED", "DECLINED"]).withMessage("Response must be ACCEPTED or DECLINED"),
        body("notes").optional().isString().withMessage("Notes must be a string"),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => missionController.respondToAssignment(req, res, next)
);

/**
 * @swagger
 * /api/missions/{id}/approve:
 *   post:
 *     summary: Approve mission at different approval levels
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comments:
 *                 type: string
 *               approvalLevel:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mission approved successfully
 */
router.post(
    "/:id/approve",
    authenticate,
    authorize(["HEAD_OF_DEPARTMENT", "DEPARTMENT_HEAD", "FINANCE", "HR", "DIRECTOR", "ADMIN"]),
    [
        param("id").isUUID().withMessage("Mission ID must be valid UUID"),
        body("comments").optional().isString().withMessage("Comments must be a string"),
        body("approvalLevel").optional().isString().withMessage("Approval level must be a string"),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => missionController.approveMission(req, res, next)
);

/**
 * @swagger
 * /api/missions/{id}/reject:
 *   post:
 *     summary: Reject mission at any approval level
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comments:
 *                 type: string
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mission rejected successfully
 */
router.post(
    "/:id/reject",
    authenticate,
    authorize(["HEAD_OF_DEPARTMENT", "DEPARTMENT_HEAD", "FINANCE", "HR", "DIRECTOR", "ADMIN"]),
    [
        param("id").isUUID().withMessage("Mission ID must be valid UUID"),
        body("comments").optional().isString().withMessage("Comments must be a string"),
        body("rejectionReason").optional().isString().withMessage("Rejection reason must be a string"),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => missionController.rejectMission(req, res, next)
);

export default router;
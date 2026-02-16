"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const missiontype_controller_1 = require("../controllers/missiontype.controller");
const auth_1 = require("../middleware/auth");
const ApiError_1 = require("../utils/ApiError");
const router = (0, express_1.Router)();
const missionTypeController = new missiontype_controller_1.MissionTypeController();
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new ApiError_1.ApiError("Validation failed", 400, errors.array()));
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
router.get("/", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN", "HR", "HEAD_OF_DEPARTMENT"]), (req, res, next) => missionTypeController.getAllMissionTypes(req, res, next));
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
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN", "HR", "HEAD_OF_DEPARTMENT"]), (req, res, next) => missionTypeController.getMissionTypeById(req, res, next));
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
router.post("/", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN", "HEAD_OF_DEPARTMENT"]), [
    (0, express_validator_1.body)("name").notEmpty().withMessage("name is required"),
    (0, express_validator_1.body)("defaultBudgetMin").optional().isNumeric().withMessage("defaultBudgetMin must be numeric"),
    (0, express_validator_1.body)("defaultBudgetMax").optional().isNumeric().withMessage("defaultBudgetMax must be numeric"),
    (0, express_validator_1.body)("requiredQualifications").optional().isArray().withMessage("requiredQualifications must be an array"),
], validateRequest, (req, res, next) => missionTypeController.createMissionType(req, res, next));
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
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN", "HEAD_OF_DEPARTMENT"]), [
    (0, express_validator_1.param)("id").notEmpty(),
    (0, express_validator_1.body)("defaultBudgetMin").optional().isNumeric().withMessage("defaultBudgetMin must be numeric"),
    (0, express_validator_1.body)("defaultBudgetMax").optional().isNumeric().withMessage("defaultBudgetMax must be numeric"),
    (0, express_validator_1.body)("requiredQualifications").optional().isArray().withMessage("requiredQualifications must be an array"),
], validateRequest, (req, res, next) => missionTypeController.updateMissionType(req, res, next));
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
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)(["ADMIN"]), (req, res, next) => missionTypeController.deleteMissionType(req, res, next));
exports.default = router;

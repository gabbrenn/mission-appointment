import { Router, Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { UserController } from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";
import { authenticate, authorize, authorizeSelfOrRoles } from "../middleware/auth";
import { ApiError } from "../utils/ApiError";
import { AvailabilityStatus, Role, AccountStatus } from "@prisma/client";

const router = Router();
const userController = new UserController();
const authController = new AuthController();

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError("Validation failed", 400, errors.array()));
    }
    return next();
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
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
 */
router.get(
    "/",
    authenticate,
    authorize(["ADMIN", "HR"]),
    (req: Request, res: Response, next: NextFunction) => userController.getAllUsers(req, res, next)
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
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
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get(
    "/:id",
    authenticate,
    authorizeSelfOrRoles(["ADMIN", "HR"]),
    (req: Request, res: Response, next: NextFunction) => userController.getUserById(req, res, next)
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: User already exists
 */
router.post(
    "/",
    authenticate,
    authorize(["ADMIN"]),
    [
        body("employeeId").notEmpty().withMessage("employeeId is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("firstName").notEmpty().withMessage("firstName is required"),
        body("lastName").notEmpty().withMessage("lastName is required"),
        body("role")
            .isIn(Object.values(Role))
            .withMessage(`role must be one of: ${Object.values(Role).join(", ")}`),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => userController.createUser(req, res, next)
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       409:
 *         description: Email or employee ID already in use
 */
router.put(
    "/:id",
    authenticate,
    authorizeSelfOrRoles(["ADMIN"]),
    [
        param("id").notEmpty(),
        body("email").optional().isEmail().withMessage("Email must be valid"),
        body("password").optional().isLength({ min: 6 }),
        body("role")
            .optional()
            .isIn(Object.values(Role))
            .withMessage(`role must be one of: ${Object.values(Role).join(", ")}`),
        body("accountStatus")
            .optional()
            .isIn(Object.values(AccountStatus))
            .withMessage(`accountStatus must be one of: ${Object.values(AccountStatus).join(", ")}`),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => userController.updateUser(req, res, next)
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (soft delete)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: User not found
 */
router.delete(
    "/:id",
    authenticate,
    authorize(["ADMIN"]),
    (req: Request, res: Response, next: NextFunction) => userController.deleteUser(req, res, next)
);

/**
 * @swagger
 * /api/users/{id}/availability:
 *   patch:
 *     summary: Update user availability status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAvailabilityDto'
 *     responses:
 *       200:
 *         description: Availability updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch(
    "/:id/availability",
    authenticate,
    authorizeSelfOrRoles(["HR"]),
    [
        body("availabilityStatus")
            .isIn(Object.values(AvailabilityStatus))
            .withMessage(`availabilityStatus must be one of: ${Object.values(AvailabilityStatus).join(", ")}`),
    ],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => userController.updateAvailability(req, res, next)
);

/**
 * @swagger
 * /api/users/{id}/skills:
 *   get:
 *     summary: Get user skills
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User skills retrieved successfully
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
 *                     $ref: '#/components/schemas/EmployeeSkill'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get(
    "/:id/skills",
    authenticate,
    authorizeSelfOrRoles(["ADMIN", "HR"]),
    (req: Request, res: Response, next: NextFunction) => userController.getUserSkills(req, res, next)
);

/**
 * @swagger
 * /api/users/{id}/skills:
 *   post:
 *     summary: Add skill to user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSkillDto'
 *     responses:
 *       201:
 *         description: Skill added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       409:
 *         description: Skill already exists for user
 */
router.post(
    "/:id/skills",
    authenticate,
    authorizeSelfOrRoles(["ADMIN", "HR"]),
    [body("skillName").notEmpty().withMessage("skillName is required")],
    validateRequest,
    (req: Request, res: Response, next: NextFunction) => userController.addUserSkill(req, res, next)
);

/**
 * @swagger
 * /api/users/{id}/skills/{skillId}:
 *   delete:
 *     summary: Remove skill from user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Skill ID
 *     responses:
 *       200:
 *         description: Skill removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Skill not found
 */
router.delete(
    "/:id/skills/:skillId",
    authenticate,
    authorizeSelfOrRoles(["ADMIN", "HR"]),
    (req: Request, res: Response, next: NextFunction) => userController.removeUserSkill(req, res, next)
);

/**
 * @swagger
 * /api/users/login-history:
 *   get:
 *     summary: Get user login history
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Login history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/login-history", authenticate, (req: Request, res: Response, next: NextFunction) => {
    authController.getLoginHistory(req, res, next);
});

export default router;
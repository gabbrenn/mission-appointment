"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionService = void 0;
const mission_repository_1 = require("../repositories/mission.repository");
const user_repository_1 = require("../repositories/user.repository");
const department_repository_1 = require("../repositories/department.repository");
const ApiError_1 = require("../utils/ApiError");
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../lib/prisma"));
class MissionService {
    constructor() {
        this.missionRepository = new mission_repository_1.MissionRepository();
        this.userRepository = new user_repository_1.UserRepository();
        this.departmentRepository = new department_repository_1.DepartmentRepository();
    }
    async createMission(data, createdById) {
        // Validate department exists
        const department = await this.departmentRepository.getById(data.departmentId);
        if (!department) {
            throw new ApiError_1.ApiError("Department not found", 404);
        }
        // Generate unique mission number
        const missionNumber = await this.missionRepository.generateMissionNumber();
        const missionData = {
            missionNumber,
            title: data.title,
            description: data.description,
            destination: data.destination,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            urgencyLevel: data.urgencyLevel || "MEDIUM",
            estimatedBudget: data.estimatedBudget,
            budgetCode: data.budgetCode,
            requiredQualifications: data.requiredQualifications || [],
            // missionType: {
            //     connect: { id: data.missionTypeId },
            // },
            department: {
                connect: { id: data.departmentId },
            },
            createdBy: {
                connect: { id: createdById },
            },
        };
        return this.missionRepository.createMission(missionData);
    }
    async getAllMissions(filters) {
        return this.missionRepository.getAllMissions(filters);
    }
    async getMissionById(id) {
        const mission = await this.missionRepository.getMissionById(id);
        if (!mission) {
            throw new ApiError_1.ApiError("Mission not found", 404);
        }
        return mission;
    }
    async updateMission(id, data) {
        await this.getMissionById(id);
        const updateData = {
            ...data,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
        };
        return this.missionRepository.updateMission(id, updateData);
    }
    async deleteMission(id) {
        await this.getMissionById(id);
        return this.missionRepository.deleteMission(id);
    }
    // Auto-assignment logic
    async autoAssignMission(data) {
        const mission = await this.getMissionById(data.missionId);
        if (mission.status !== client_1.MissionStatus.DRAFT) {
            throw new ApiError_1.ApiError("Can only auto-assign missions in DRAFT status", 400);
        }
        // Get eligible employees from mission's department
        const eligibleEmployees = await this.missionRepository.getEligibleEmployees(mission.departmentId, mission.requiredQualifications);
        if (eligibleEmployees.length === 0) {
            throw new ApiError_1.ApiError("No eligible employees found for this mission", 400);
        }
        // Calculate scores for each employee
        const scoredEmployees = eligibleEmployees.map((employee) => {
            const skillScore = this.calculateSkillScore(employee.skills, mission.requiredQualifications);
            const fairnessScore = this.calculateFairnessScore(employee.assignments);
            const totalScore = skillScore * 0.7 + fairnessScore * 0.3; // 70% skills, 30% fairness
            return {
                employee,
                skillScore,
                fairnessScore,
                totalScore,
                assignmentReason: this.generateAssignmentReason(skillScore, fairnessScore),
            };
        });
        // Sort by total score (highest first) and take the requested number
        const maxAssignees = data.maxAssignees || 1;
        const selectedEmployees = scoredEmployees
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, maxAssignees);
        // Create assignments
        const assignments = [];
        for (const scored of selectedEmployees) {
            const assignment = await prisma_1.default.missionAssignment.create({
                data: {
                    mission: { connect: { id: mission.id } },
                    employee: { connect: { id: scored.employee.id } },
                    assignmentReason: scored.assignmentReason,
                    fairnessScoreAtAssignment: scored.fairnessScore,
                    assignmentStatus: client_1.AssignmentStatus.PENDING,
                },
                include: {
                    employee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            });
            assignments.push({
                employeeId: assignment.employeeId,
                employee: assignment.employee,
                assignmentReason: assignment.assignmentReason,
                fairnessScore: parseFloat(assignment.fairnessScoreAtAssignment.toString()),
            });
        }
        // Update mission status
        await this.missionRepository.updateMission(mission.id, {
            status: client_1.MissionStatus.PENDING_ASSIGNMENT,
        });
        return assignments;
    }
    // Calculate skill match score (0-100)
    calculateSkillScore(employeeSkills, requiredSkills) {
        if (requiredSkills.length === 0)
            return 80; // Base score when no specific skills required
        const employeeSkillNames = employeeSkills.map(skill => skill.skillName.toLowerCase());
        const requiredSkillsLower = requiredSkills.map(skill => skill.toLowerCase());
        const matchedSkills = requiredSkillsLower.filter(skill => employeeSkillNames.includes(skill));
        const matchRatio = matchedSkills.length / requiredSkills.length;
        return Math.round(matchRatio * 100);
    }
    // Calculate fairness score based on last missions (0-100, higher = less recent missions)
    calculateFairnessScore(assignments) {
        if (assignments.length === 0)
            return 100; // Highest score for never assigned
        const now = new Date();
        const recentAssignments = assignments.filter(assignment => {
            const assignedDate = new Date(assignment.assignedAt);
            const daysSince = (now.getTime() - assignedDate.getTime()) / (1000 * 60 * 60 * 24);
            return daysSince <= 90; // Consider assignments from last 90 days
        });
        if (recentAssignments.length === 0)
            return 90; // High score for no recent assignments
        // More recent assignments = lower fairness score
        const avgDaysSinceLastAssignment = recentAssignments.reduce((sum, assignment) => {
            const daysSince = (now.getTime() - new Date(assignment.assignedAt).getTime()) / (1000 * 60 * 60 * 24);
            return sum + daysSince;
        }, 0) / recentAssignments.length;
        // Convert to score: 90 days = 100 points, 0 days = 0 points
        return Math.max(0, Math.round((avgDaysSinceLastAssignment / 90) * 100));
    }
    // Generate human-readable assignment reason
    generateAssignmentReason(skillScore, fairnessScore) {
        const reasons = [];
        if (skillScore >= 90) {
            reasons.push("Excellent skill match");
        }
        else if (skillScore >= 70) {
            reasons.push("Good skill match");
        }
        else if (skillScore >= 50) {
            reasons.push("Adequate skill match");
        }
        else {
            reasons.push("Basic qualifications met");
        }
        if (fairnessScore >= 80) {
            reasons.push("has not been assigned recently");
        }
        else if (fairnessScore >= 50) {
            reasons.push("moderate recent assignment history");
        }
        else {
            reasons.push("recently assigned but available");
        }
        return reasons.join(" and ");
    }
    async getMissionAssignments(missionId) {
        await this.getMissionById(missionId);
        return prisma_1.default.missionAssignment.findMany({
            where: { missionId },
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                        availabilityStatus: true,
                    },
                },
                substitutionRequest: true,
            },
            orderBy: { assignedAt: "desc" },
        });
    }
    // Get assignments for current user (employee view)
    async getUserAssignments(userId) {
        return prisma_1.default.missionAssignment.findMany({
            where: { employeeId: userId },
            include: {
                mission: {
                    include: {
                        department: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
            },
            orderBy: { assignedAt: "desc" },
        });
    }
    // Employee responds to mission assignment
    async respondToAssignment(assignmentId, userId, response, notes) {
        const assignment = await prisma_1.default.missionAssignment.findUnique({
            where: { id: assignmentId },
            include: { mission: true },
        });
        if (!assignment) {
            throw new ApiError_1.ApiError("Assignment not found", 404);
        }
        if (assignment.employeeId !== userId) {
            throw new ApiError_1.ApiError("Unauthorized to respond to this assignment", 403);
        }
        if (assignment.assignmentStatus !== 'PENDING') {
            throw new ApiError_1.ApiError("Assignment has already been responded to", 400);
        }
        const updatedAssignment = await prisma_1.default.missionAssignment.update({
            where: { id: assignmentId },
            data: {
                assignmentStatus: response,
                responseNotes: notes,
                respondedAt: new Date(),
            },
            include: {
                mission: true,
                employee: true,
            },
        });
        // Update mission status if accepted
        if (response === 'ACCEPTED') {
            await prisma_1.default.mission.update({
                where: { id: assignment.missionId },
                data: { status: 'ASSIGNED' },
            });
        }
        return updatedAssignment;
    }
    // Approve mission at different approval levels
    async approveMission(missionId, userId, userRole, comments, approvalLevel) {
        const mission = await this.getMissionById(missionId);
        if (!mission) {
            throw new ApiError_1.ApiError("Mission not found", 404);
        }
        let newStatus;
        // Determine next status based on user role and current status
        switch (userRole) {
            case 'HEAD_OF_DEPARTMENT':
            case 'DEPARTMENT_HEAD':
                if (mission.status === 'ASSIGNED') {
                    newStatus = 'IN_APPROVAL';
                }
                else if (mission.status !== 'IN_APPROVAL') {
                    newStatus = 'IN_APPROVAL'; // Department head can give preliminary approval, but final approval is by finance/director
                }
                else {
                    throw new ApiError_1.ApiError("Mission must be assigned before department head approval", 400);
                }
                break;
            case 'FINANCE':
                if (mission.status === 'IN_APPROVAL') {
                    newStatus = 'APPROVED'; // Simplified: Finance approval leads to approved
                }
                else {
                    throw new ApiError_1.ApiError("Mission must be in approval stage for finance review", 400);
                }
                break;
            case 'HR':
                // HR can approve anytime after assignment
                newStatus = 'APPROVED';
                break;
            case 'DIRECTOR':
                // Director can give final approval
                newStatus = 'APPROVED';
                break;
            case 'ADMIN':
                // Admin can approve at any stage
                newStatus = 'APPROVED';
                break;
            default:
                throw new ApiError_1.ApiError("Unauthorized to approve missions", 403);
        }
        const updatedMission = await prisma_1.default.mission.update({
            where: { id: missionId },
            data: {
                status: newStatus,
                // You can add an approvals table later to track approval history
            },
            include: {
                department: true,
                createdBy: true,
                assignments: {
                    include: {
                        employee: true,
                    },
                },
            },
        });
        return updatedMission;
    }
    // Reject mission at any approval level
    async rejectMission(missionId, userId, userRole, comments, rejectionReason) {
        const mission = await this.getMissionById(missionId);
        if (!mission) {
            throw new ApiError_1.ApiError("Mission not found", 404);
        }
        // Check authorization to reject
        const authorizedRoles = ['HEAD_OF_DEPARTMENT', 'DEPARTMENT_HEAD', 'FINANCE', 'HR', 'DIRECTOR', 'ADMIN'];
        if (!authorizedRoles.includes(userRole)) {
            throw new ApiError_1.ApiError("Unauthorized to reject missions", 403);
        }
        const updatedMission = await prisma_1.default.mission.update({
            where: { id: missionId },
            data: {
                status: 'REJECTED',
                // You can add a rejections table later to track rejection history and reasons
            },
            include: {
                department: true,
                createdBy: true,
                assignments: {
                    include: {
                        employee: true,
                    },
                },
            },
        });
        return updatedMission;
    }
    // Get missions for current user's department (department head view)
    async getDepartmentMissions(userId) {
        // First get the user's department
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new ApiError_1.ApiError("User not found", 404);
        }
        let departmentId;
        // Check if user is head of department
        const headOfDepartment = await prisma_1.default.department.findFirst({
            where: { headId: userId }
        });
        if (headOfDepartment) {
            departmentId = headOfDepartment.id;
        }
        else if (user.departmentId) {
            // If not head, but has department, use their department
            departmentId = user.departmentId;
        }
        else {
            throw new ApiError_1.ApiError("User is not associated with any department", 403);
        }
        return prisma_1.default.mission.findMany({
            where: { departmentId },
            include: {
                department: true,
                createdBy: true,
                assignments: {
                    include: {
                        employee: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.MissionService = MissionService;

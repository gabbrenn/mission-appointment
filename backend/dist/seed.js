"use strict";
/**
 * Database Seed Script for Mission Assignment System
 *
 * This script populates the database with sample data for testing and development.
 * Run with: npx prisma db seed
 * Or: npm run seed (if configured in package.json)
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables first
dotenv_1.default.config();
// Declare prisma variable without initializing
var prisma;
// Helper function to hash passwords
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, bcryptjs_1.default.hash(password, 10)];
        });
    });
}
// Helper function to clear existing data
function clearDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🗑️  Clearing existing data...');
                    // Delete in order of dependencies
                    return [4 /*yield*/, prisma.substitutionRequest.deleteMany()];
                case 1:
                    // Delete in order of dependencies
                    _a.sent();
                    return [4 /*yield*/, prisma.missionAssignment.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.missionApproval.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.mission.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.missionType.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.employeeSkill.deleteMany()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma.department.deleteMany()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, prisma.auditLog.deleteMany()];
                case 9:
                    _a.sent();
                    console.log('✅ Database cleared');
                    return [2 /*return*/];
            }
        });
    });
}
// Create users with different roles
function createUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, users, createdUsers, _i, users_1, userData, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('👥 Creating users...');
                    return [4 /*yield*/, hashPassword('password123')];
                case 1:
                    hashedPassword = _a.sent();
                    users = [
                        // Admin
                        {
                            employeeId: 'EMP001',
                            email: 'admin@mas.com',
                            password: hashedPassword,
                            firstName: 'Admin',
                            lastName: 'User',
                            role: client_1.Role.ADMIN,
                            position: 'System Administrator',
                            phone: '+257 79 000 001',
                            availabilityStatus: client_1.AvailabilityStatus.AVAILABLE,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                        // Director
                        {
                            employeeId: 'EMP002',
                            email: 'director@mas.com',
                            password: hashedPassword,
                            firstName: 'John',
                            lastName: 'Mugisha',
                            role: client_1.Role.DIRECTOR,
                            position: 'Operations Director',
                            phone: '+257 79 000 002',
                            availabilityStatus: client_1.AvailabilityStatus.AVAILABLE,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                        // HR Manager
                        {
                            employeeId: 'EMP003',
                            email: 'hr@mas.com',
                            password: hashedPassword,
                            firstName: 'Marie',
                            lastName: 'Uwimana',
                            role: client_1.Role.HR,
                            position: 'HR Manager',
                            phone: '+257 79 000 003',
                            availabilityStatus: client_1.AvailabilityStatus.AVAILABLE,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                        // Finance Manager
                        {
                            employeeId: 'EMP004',
                            email: 'finance@mas.com',
                            password: hashedPassword,
                            firstName: 'Patrick',
                            lastName: 'Kamana',
                            role: client_1.Role.FINANCE,
                            position: 'Finance Manager',
                            phone: '+257 79 000 004',
                            availabilityStatus: client_1.AvailabilityStatus.AVAILABLE,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                        // Department Heads
                        {
                            employeeId: 'EMP005',
                            email: 'it.head@mas.com',
                            password: hashedPassword,
                            firstName: 'Jean',
                            lastName: 'Mucyo',
                            role: client_1.Role.HEAD_OF_DEPARTMENT,
                            position: 'IT Department Head',
                            phone: '+257 79 000 005',
                            availabilityStatus: client_1.AvailabilityStatus.AVAILABLE,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                        {
                            employeeId: 'EMP006',
                            email: 'ops.head@mas.com',
                            password: hashedPassword,
                            firstName: 'Grace',
                            lastName: 'Nyiraneza',
                            role: client_1.Role.HEAD_OF_DEPARTMENT,
                            position: 'Operations Department Head',
                            phone: '+257 79 000 006',
                            availabilityStatus: client_1.AvailabilityStatus.AVAILABLE,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                        // Employees - IT Department
                        {
                            employeeId: 'EMP007',
                            email: 'joseph@mas.com',
                            password: hashedPassword,
                            firstName: 'Joseph',
                            lastName: 'Ndayisenga',
                            role: client_1.Role.EMPLOYEE,
                            position: 'Senior Software Developer',
                            phone: '+257 79 000 007',
                            availabilityStatus: client_1.AvailabilityStatus.AVAILABLE,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                        {
                            employeeId: 'EMP008',
                            email: 'claire@mas.com',
                            password: hashedPassword,
                            firstName: 'Claire',
                            lastName: 'Mukankusi',
                            role: client_1.Role.EMPLOYEE,
                            position: 'System Administrator',
                            phone: '+257 79 000 008',
                            availabilityStatus: client_1.AvailabilityStatus.AVAILABLE,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                        {
                            employeeId: 'EMP009',
                            email: 'eric@mas.com',
                            password: hashedPassword,
                            firstName: 'Eric',
                            lastName: 'Hakizimana',
                            role: client_1.Role.EMPLOYEE,
                            position: 'Network Engineer',
                            phone: '+257 79 000 009',
                            availabilityStatus: client_1.AvailabilityStatus.ON_MISSION,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                        // Employees - Operations Department
                        {
                            employeeId: 'EMP010',
                            email: 'sarah@mas.com',
                            password: hashedPassword,
                            firstName: 'Sarah',
                            lastName: 'Ingabire',
                            role: client_1.Role.EMPLOYEE,
                            position: 'Operations Manager',
                            phone: '+257 79 000 010',
                            availabilityStatus: client_1.AvailabilityStatus.AVAILABLE,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                        {
                            employeeId: 'EMP011',
                            email: 'david@mas.com',
                            password: hashedPassword,
                            firstName: 'David',
                            lastName: 'Rutayisire',
                            role: client_1.Role.EMPLOYEE,
                            position: 'Quality Assurance Officer',
                            phone: '+257 79 000 011',
                            availabilityStatus: client_1.AvailabilityStatus.UNAVAILABLE,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                        {
                            employeeId: 'EMP012',
                            email: 'alice@mas.com',
                            password: hashedPassword,
                            firstName: 'Alice',
                            lastName: 'Mutesi',
                            role: client_1.Role.EMPLOYEE,
                            position: 'Project Coordinator',
                            phone: '+257 79 000 012',
                            availabilityStatus: client_1.AvailabilityStatus.ON_LEAVE,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                        // Additional Employees
                        {
                            employeeId: 'EMP013',
                            email: 'peter@mas.com',
                            password: hashedPassword,
                            firstName: 'Peter',
                            lastName: 'Nsengiyumva',
                            role: client_1.Role.EMPLOYEE,
                            position: 'Data Analyst',
                            phone: '+257 79 000 013',
                            availabilityStatus: client_1.AvailabilityStatus.AVAILABLE,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                        {
                            employeeId: 'EMP014',
                            email: 'beatha@mas.com',
                            password: hashedPassword,
                            firstName: 'Beatha',
                            lastName: 'Umurerwa',
                            role: client_1.Role.EMPLOYEE,
                            position: 'HR Officer',
                            phone: '+257 79 000 014',
                            availabilityStatus: client_1.AvailabilityStatus.AVAILABLE,
                            accountStatus: client_1.AccountStatus.ACTIVE,
                        },
                    ];
                    createdUsers = [];
                    _i = 0, users_1 = users;
                    _a.label = 2;
                case 2:
                    if (!(_i < users_1.length)) return [3 /*break*/, 5];
                    userData = users_1[_i];
                    return [4 /*yield*/, prisma.user.create({ data: userData })];
                case 3:
                    user = _a.sent();
                    createdUsers.push(user);
                    console.log("  \u2713 Created user: ".concat(user.firstName, " ").concat(user.lastName, " (").concat(user.email, ")"));
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, createdUsers];
            }
        });
    });
}
// Create departments
function createDepartments(users) {
    return __awaiter(this, void 0, void 0, function () {
        var itHead, opsHead, departments, createdDepartments, _i, departments_1, deptData, department, itDept, opsDept, hrDept;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🏢 Creating departments...');
                    itHead = users.find(function (u) { return u.role === 'HEAD_OF_DEPARTMENT' && u.position.includes('IT'); });
                    opsHead = users.find(function (u) { return u.role === 'HEAD_OF_DEPARTMENT' && u.position.includes('Operations'); });
                    departments = [
                        {
                            name: 'Information Technology',
                            code: 'IT',
                            description: 'Responsible for all IT infrastructure, software development, and technical support',
                            budgetAllocation: 500000,
                            status: 'ACTIVE',
                            headId: itHead === null || itHead === void 0 ? void 0 : itHead.id,
                        },
                        {
                            name: 'Operations',
                            code: 'OPS',
                            description: 'Manages daily operations, quality assurance, and project coordination',
                            budgetAllocation: 350000,
                            status: 'ACTIVE',
                            headId: opsHead === null || opsHead === void 0 ? void 0 : opsHead.id,
                        },
                        {
                            name: 'Human Resources',
                            code: 'HR',
                            description: 'Handles recruitment, employee relations, and organizational development',
                            budgetAllocation: 200000,
                            status: 'ACTIVE',
                            headId: null, // HR manager is not HEAD_OF_DEPARTMENT role
                        },
                        {
                            name: 'Finance',
                            code: 'FIN',
                            description: 'Manages budgeting, accounting, and financial planning',
                            budgetAllocation: 300000,
                            status: 'ACTIVE',
                            headId: null,
                        },
                    ];
                    createdDepartments = [];
                    _i = 0, departments_1 = departments;
                    _a.label = 1;
                case 1:
                    if (!(_i < departments_1.length)) return [3 /*break*/, 4];
                    deptData = departments_1[_i];
                    return [4 /*yield*/, prisma.department.create({ data: deptData })];
                case 2:
                    department = _a.sent();
                    createdDepartments.push(department);
                    console.log("  \u2713 Created department: ".concat(department.name, " (").concat(department.code, ")"));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    itDept = createdDepartments.find(function (d) { return d.code === 'IT'; });
                    opsDept = createdDepartments.find(function (d) { return d.code === 'OPS'; });
                    hrDept = createdDepartments.find(function (d) { return d.code === 'HR'; });
                    // Assign IT employees to IT department
                    return [4 /*yield*/, prisma.user.updateMany({
                            where: { employeeId: { in: ['EMP007', 'EMP008', 'EMP009'] } },
                            data: { departmentId: itDept === null || itDept === void 0 ? void 0 : itDept.id },
                        })];
                case 5:
                    // Assign IT employees to IT department
                    _a.sent();
                    // Assign Operations employees to Operations department
                    return [4 /*yield*/, prisma.user.updateMany({
                            where: { employeeId: { in: ['EMP010', 'EMP011', 'EMP012'] } },
                            data: { departmentId: opsDept === null || opsDept === void 0 ? void 0 : opsDept.id },
                        })];
                case 6:
                    // Assign Operations employees to Operations department
                    _a.sent();
                    // Assign HR employee to HR department
                    return [4 /*yield*/, prisma.user.updateMany({
                            where: { employeeId: 'EMP014' },
                            data: { departmentId: hrDept === null || hrDept === void 0 ? void 0 : hrDept.id },
                        })];
                case 7:
                    // Assign HR employee to HR department
                    _a.sent();
                    return [2 /*return*/, createdDepartments];
            }
        });
    });
}
// Create employee skills
function createEmployeeSkills(users) {
    return __awaiter(this, void 0, void 0, function () {
        var skillsData, _i, skillsData_1, skillData;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
        return __generator(this, function (_6) {
            switch (_6.label) {
                case 0:
                    console.log('💡 Creating employee skills...');
                    skillsData = [
                        // IT Department skills
                        { userId: (_a = users.find(function (u) { return u.employeeId === 'EMP007'; })) === null || _a === void 0 ? void 0 : _a.id, skillName: 'JavaScript' },
                        { userId: (_b = users.find(function (u) { return u.employeeId === 'EMP007'; })) === null || _b === void 0 ? void 0 : _b.id, skillName: 'TypeScript' },
                        { userId: (_c = users.find(function (u) { return u.employeeId === 'EMP007'; })) === null || _c === void 0 ? void 0 : _c.id, skillName: 'Node.js' },
                        { userId: (_d = users.find(function (u) { return u.employeeId === 'EMP007'; })) === null || _d === void 0 ? void 0 : _d.id, skillName: 'React' },
                        { userId: (_e = users.find(function (u) { return u.employeeId === 'EMP007'; })) === null || _e === void 0 ? void 0 : _e.id, skillName: 'PostgreSQL' },
                        { userId: (_f = users.find(function (u) { return u.employeeId === 'EMP007'; })) === null || _f === void 0 ? void 0 : _f.id, skillName: 'Project Management' },
                        { userId: (_g = users.find(function (u) { return u.employeeId === 'EMP008'; })) === null || _g === void 0 ? void 0 : _g.id, skillName: 'System Administration' },
                        { userId: (_h = users.find(function (u) { return u.employeeId === 'EMP008'; })) === null || _h === void 0 ? void 0 : _h.id, skillName: 'Linux' },
                        { userId: (_j = users.find(function (u) { return u.employeeId === 'EMP008'; })) === null || _j === void 0 ? void 0 : _j.id, skillName: 'Windows Server' },
                        { userId: (_k = users.find(function (u) { return u.employeeId === 'EMP008'; })) === null || _k === void 0 ? void 0 : _k.id, skillName: 'Network Security' },
                        { userId: (_l = users.find(function (u) { return u.employeeId === 'EMP009'; })) === null || _l === void 0 ? void 0 : _l.id, skillName: 'Network Engineering' },
                        { userId: (_m = users.find(function (u) { return u.employeeId === 'EMP009'; })) === null || _m === void 0 ? void 0 : _m.id, skillName: 'Cisco' },
                        { userId: (_o = users.find(function (u) { return u.employeeId === 'EMP009'; })) === null || _o === void 0 ? void 0 : _o.id, skillName: 'Firewall Management' },
                        { userId: (_p = users.find(function (u) { return u.employeeId === 'EMP009'; })) === null || _p === void 0 ? void 0 : _p.id, skillName: 'VPN Configuration' },
                        // Operations skills
                        { userId: (_q = users.find(function (u) { return u.employeeId === 'EMP010'; })) === null || _q === void 0 ? void 0 : _q.id, skillName: 'Operations Management' },
                        { userId: (_r = users.find(function (u) { return u.employeeId === 'EMP010'; })) === null || _r === void 0 ? void 0 : _r.id, skillName: 'Process Improvement' },
                        { userId: (_s = users.find(function (u) { return u.employeeId === 'EMP010'; })) === null || _s === void 0 ? void 0 : _s.id, skillName: 'Quality Assurance' },
                        { userId: (_t = users.find(function (u) { return u.employeeId === 'EMP011'; })) === null || _t === void 0 ? void 0 : _t.id, skillName: 'Quality Assurance' },
                        { userId: (_u = users.find(function (u) { return u.employeeId === 'EMP011'; })) === null || _u === void 0 ? void 0 : _u.id, skillName: 'ISO Standards' },
                        { userId: (_v = users.find(function (u) { return u.employeeId === 'EMP011'; })) === null || _v === void 0 ? void 0 : _v.id, skillName: 'Audit' },
                        { userId: (_w = users.find(function (u) { return u.employeeId === 'EMP012'; })) === null || _w === void 0 ? void 0 : _w.id, skillName: 'Project Management' },
                        { userId: (_x = users.find(function (u) { return u.employeeId === 'EMP012'; })) === null || _x === void 0 ? void 0 : _x.id, skillName: 'Stakeholder Management' },
                        { userId: (_y = users.find(function (u) { return u.employeeId === 'EMP012'; })) === null || _y === void 0 ? void 0 : _y.id, skillName: 'Risk Assessment' },
                        // Additional skills
                        { userId: (_z = users.find(function (u) { return u.employeeId === 'EMP013'; })) === null || _z === void 0 ? void 0 : _z.id, skillName: 'Data Analysis' },
                        { userId: (_0 = users.find(function (u) { return u.employeeId === 'EMP013'; })) === null || _0 === void 0 ? void 0 : _0.id, skillName: 'SQL' },
                        { userId: (_1 = users.find(function (u) { return u.employeeId === 'EMP013'; })) === null || _1 === void 0 ? void 0 : _1.id, skillName: 'Python' },
                        { userId: (_2 = users.find(function (u) { return u.employeeId === 'EMP013'; })) === null || _2 === void 0 ? void 0 : _2.id, skillName: 'Business Intelligence' },
                        { userId: (_3 = users.find(function (u) { return u.employeeId === 'EMP014'; })) === null || _3 === void 0 ? void 0 : _3.id, skillName: 'Recruitment' },
                        { userId: (_4 = users.find(function (u) { return u.employeeId === 'EMP014'; })) === null || _4 === void 0 ? void 0 : _4.id, skillName: 'Employee Relations' },
                        { userId: (_5 = users.find(function (u) { return u.employeeId === 'EMP014'; })) === null || _5 === void 0 ? void 0 : _5.id, skillName: 'Training & Development' },
                    ];
                    _i = 0, skillsData_1 = skillsData;
                    _6.label = 1;
                case 1:
                    if (!(_i < skillsData_1.length)) return [3 /*break*/, 4];
                    skillData = skillsData_1[_i];
                    if (!skillData.userId) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.employeeSkill.create({ data: skillData })];
                case 2:
                    _6.sent();
                    _6.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("  \u2713 Created ".concat(skillsData.length, " employee skills"));
                    return [2 /*return*/];
            }
        });
    });
}
// Create mission types
function createMissionTypes() {
    return __awaiter(this, void 0, void 0, function () {
        var missionTypes, _i, missionTypes_1, mtData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('📋 Creating mission types...');
                    missionTypes = [
                        {
                            name: 'IT Audit',
                            description: 'Comprehensive IT systems and infrastructure audit',
                            defaultBudgetMin: 2000,
                            defaultBudgetMax: 10000,
                            requiredQualifications: ['IT Audit', 'System Administration', 'Network Security'],
                            status: 'ACTIVE',
                        },
                        {
                            name: 'Training Mission',
                            description: 'Employee training and capacity building',
                            defaultBudgetMin: 500,
                            defaultBudgetMax: 5000,
                            requiredQualifications: [],
                            status: 'ACTIVE',
                        },
                        {
                            name: 'Client Support',
                            description: 'On-site client support and consultation',
                            defaultBudgetMin: 1000,
                            defaultBudgetMax: 8000,
                            requiredQualifications: ['Client Management', 'Technical Support'],
                            status: 'ACTIVE',
                        },
                        {
                            name: 'Project Implementation',
                            description: 'New project setup and implementation',
                            defaultBudgetMin: 3000,
                            defaultBudgetMax: 20000,
                            requiredQualifications: ['Project Management'],
                            status: 'ACTIVE',
                        },
                        {
                            name: 'Quality Assessment',
                            description: 'Quality assurance and compliance assessment',
                            defaultBudgetMin: 1500,
                            defaultBudgetMax: 7000,
                            requiredQualifications: ['Quality Assurance', 'Audit'],
                            status: 'ACTIVE',
                        },
                    ];
                    _i = 0, missionTypes_1 = missionTypes;
                    _a.label = 1;
                case 1:
                    if (!(_i < missionTypes_1.length)) return [3 /*break*/, 4];
                    mtData = missionTypes_1[_i];
                    return [4 /*yield*/, prisma.missionType.create({ data: mtData })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("  \u2713 Created ".concat(missionTypes.length, " mission types"));
                    return [2 /*return*/];
            }
        });
    });
}
// Create sample missions
function createMissions(users, departments) {
    return __awaiter(this, void 0, void 0, function () {
        var admin, itDept, opsDept, generateMissionNumber, missions, departmentAssignments, i, missionData, missionNumber, mission;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 Creating missions...');
                    admin = users.find(function (u) { return u.role === 'ADMIN'; });
                    itDept = departments.find(function (d) { return d.code === 'IT'; });
                    opsDept = departments.find(function (d) { return d.code === 'OPS'; });
                    generateMissionNumber = function () { return __awaiter(_this, void 0, void 0, function () {
                        var count;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prisma.mission.count()];
                                case 1:
                                    count = _a.sent();
                                    return [2 /*return*/, "MIS-".concat(String(count + 1).padStart(4, '0'))];
                            }
                        });
                    }); };
                    missions = [
                        {
                            title: 'Branch Network Upgrade',
                            description: 'Upgrade network infrastructure at Kigali branch office including new switches, routers, and firewall configuration',
                            destination: 'Kigali Branch Office',
                            startDate: new Date('2025-05-01'),
                            endDate: new Date('2025-05-07'),
                            urgencyLevel: client_1.UrgencyLevel.HIGH,
                            estimatedBudget: 8000,
                            status: client_1.MissionStatus.DRAFT,
                            requiredQualifications: ['Network Engineering', 'Cisco', 'Firewall Management'],
                        },
                        {
                            title: 'Annual IT Security Audit',
                            description: 'Comprehensive security audit of all IT systems, network infrastructure, and data protection measures',
                            destination: 'Headquarters',
                            startDate: new Date('2025-05-10'),
                            endDate: new Date('2025-05-15'),
                            urgencyLevel: client_1.UrgencyLevel.MEDIUM,
                            estimatedBudget: 6000,
                            status: client_1.MissionStatus.DRAFT,
                            requiredQualifications: ['IT Audit', 'Network Security', 'System Administration'],
                        },
                        {
                            title: 'Regional Operations Review',
                            description: 'Review and assess operations processes across regional offices for efficiency improvements',
                            destination: 'Multiple Regional Offices',
                            startDate: new Date('2025-05-20'),
                            endDate: new Date('2025-05-30'),
                            urgencyLevel: client_1.UrgencyLevel.MEDIUM,
                            estimatedBudget: 12000,
                            status: client_1.MissionStatus.DRAFT,
                            requiredQualifications: ['Operations Management', 'Process Improvement', 'Quality Assurance'],
                        },
                        {
                            title: 'Staff Training Workshop',
                            description: 'Conduct training workshop on new software systems and best practices',
                            destination: 'Training Center',
                            startDate: new Date('2025-06-01'),
                            endDate: new Date('2025-06-05'),
                            urgencyLevel: client_1.UrgencyLevel.LOW,
                            estimatedBudget: 3000,
                            status: client_1.MissionStatus.DRAFT,
                            requiredQualifications: [],
                        },
                    ];
                    departmentAssignments = [itDept === null || itDept === void 0 ? void 0 : itDept.id, itDept === null || itDept === void 0 ? void 0 : itDept.id, opsDept === null || opsDept === void 0 ? void 0 : opsDept.id, itDept === null || itDept === void 0 ? void 0 : itDept.id];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < missions.length)) return [3 /*break*/, 5];
                    missionData = missions[i];
                    return [4 /*yield*/, generateMissionNumber()];
                case 2:
                    missionNumber = _a.sent();
                    return [4 /*yield*/, prisma.mission.create({
                            data: __assign(__assign({ missionNumber: missionNumber }, missionData), { department: { connect: { id: departmentAssignments[i] } }, createdBy: { connect: { id: admin === null || admin === void 0 ? void 0 : admin.id } } }),
                        })];
                case 3:
                    mission = _a.sent();
                    console.log("  \u2713 Created mission: ".concat(mission.title, " (").concat(mission.missionNumber, ")"));
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Main seed function
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var users, departments, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Starting database seed...');
                    console.log('─────────────────────────────────────');
                    console.log('🔍 Checking Environment...');
                    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
                    // Initialize PrismaClient after environment variables are loaded
                    prisma = new client_1.PrismaClient();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, 9, 11]);
                    // Clear existing data
                    return [4 /*yield*/, clearDatabase()];
                case 2:
                    // Clear existing data
                    _a.sent();
                    return [4 /*yield*/, createUsers()];
                case 3:
                    users = _a.sent();
                    return [4 /*yield*/, createDepartments(users)];
                case 4:
                    departments = _a.sent();
                    // 5. Create Employee Skills using the created users
                    return [4 /*yield*/, createEmployeeSkills(users)];
                case 5:
                    // 5. Create Employee Skills using the created users
                    _a.sent();
                    return [4 /*yield*/, createMissionTypes()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, createMissions(users, departments)];
                case 7:
                    _a.sent();
                    console.log('─────────────────────────────────────');
                    console.log('✅ Database seeding completed successfully!');
                    console.log('');
                    console.log('📝 Sample Login Credentials:');
                    console.log('   Admin:    admin@mas.com / password123');
                    console.log('   Director: director@mas.com / password123');
                    console.log('   HR:       hr@mas.com / password123');
                    console.log('   Finance:  finance@mas.com / password123');
                    console.log('   Department Head:  dp.head@mas.com / password123');
                    console.log('   Employee: joseph@mas.com / password123');
                    console.log('─────────────────────────────────────');
                    return [3 /*break*/, 11];
                case 8:
                    error_1 = _a.sent();
                    console.error('❌ Error during seeding:', error_1);
                    throw error_1;
                case 9: return [4 /*yield*/, prisma.$disconnect()];
                case 10:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
main();

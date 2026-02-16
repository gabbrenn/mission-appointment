/**
 * Type definitions for API responses and DTOs
 * These types match the backend Prisma schema and DTOs
 */

// ===== User Types =====

export enum Role {
  ADMIN = 'ADMIN',
  DIRECTOR_GENERAL = 'DIRECTOR_GENERAL',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  FINANCE = 'FINANCE',
  HR = 'HR',
  EMPLOYEE = 'EMPLOYEE',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  ON_MISSION = 'ON_MISSION',
  ON_LEAVE = 'ON_LEAVE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export interface User {
  id: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
  position?: string;
  accountStatus: AccountStatus;
  availabilityStatus: AvailabilityStatus;
  departmentId?: string;
  department?: Department;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// ===== Department Types =====

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  headId?: string;
  head?: User;
  createdAt: string;
  updatedAt: string;
}

// ===== Mission Type =====

export interface MissionType {
  id: string;
  name: string;
  code: string;
  description?: string;
  estimatedDuration?: number;
  requiresApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===== Authentication Types =====

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
    position?: string;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  module: string;
  tableName?: string;
  recordId?: string;
  beforeValue?: string;
  afterValue?: string;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
  createdAt: string;
}

// ===== API Response Types =====

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  statusCode?: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, unknown>[];
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ===== DTO Types =====

export interface CreateUserDto {
  employeeId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone?: string;
  position?: string;
  departmentId?: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  phone?: string;
  position?: string;
  accountStatus?: AccountStatus;
  departmentId?: string;
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
  description?: string;
  location?: string;
  headId?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  code?: string;
  description?: string;
  location?: string;
  headId?: string;
}

export interface CreateMissionTypeDto {
  name: string;
  code: string;
  description?: string;
  estimatedDuration?: number;
  requiresApproval?: boolean;
}

export interface UpdateMissionTypeDto {
  name?: string;
  code?: string;
  description?: string;
  estimatedDuration?: number;
  requiresApproval?: boolean;
}

// ===== Skill Types =====

export interface Skill {
  id: string;
  name: string;
  createdAt: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skill: Skill;
  createdAt: string;
}

// ===== Form Types =====

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// ===== Utility Types =====

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

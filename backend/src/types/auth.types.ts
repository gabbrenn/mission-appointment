// Enhanced type definitions for authentication

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

export interface LogoutResponse {
  message: string;
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
  action: 'login' | 'logout' | string;
  module: string;
  tableName?: string;
  recordId?: string;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
  createdAt: Date;
}

export interface AuthenticatedUser extends TokenPayload {
  // Additional properties for authenticated context
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode?: number;
}

export interface AuthServiceInterface {
  login(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<LoginResponse>;
  logout(userId: string, ipAddress?: string, userAgent?: string): Promise<LogoutResponse>;
  getLoginHistory(userId: string): Promise<AuditLogEntry[]>;
}

export interface AuditLogRepositoryInterface {
  createAuditLog(data: {
    action: string;
    module: string;
    tableName?: string;
    recordId?: string;
    beforeValue?: string;
    afterValue?: string;
    ipAddress?: string;
    userAgent?: string;
    userId?: string;
  }): Promise<any>;
  
  getAuditLogsByUser(userId: string): Promise<AuditLogEntry[]>;
  getAuditLogsByAction(action: string): Promise<AuditLogEntry[]>;
  getLoginLogsByUser(userId: string): Promise<AuditLogEntry[]>;
}

// Request extension for authenticated requests
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
      };
    }
  }
}

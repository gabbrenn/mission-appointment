import { comparePassword } from '../utils/password';
import { generateToken, TokenPayload } from '../utils/jwt';
import { UserRepository } from '../repositories/user.repository';
import { AuditLogRepository } from '../repositories/auditLog.repository';
import { User } from '@prisma/client';
import { hashPassword } from '../utils/password';

export class AuthService {
  private userRepository: UserRepository;
  private auditLogRepository: AuditLogRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.auditLogRepository = new AuditLogRepository();
  }

  async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
    // Find user by email
    const user = await this.userRepository.getUserByEmail(email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if account is active
    if (user.accountStatus !== 'ACTIVE') {
      throw new Error('Account is not active');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token with user and role info
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Update lastLogin timestamp
    await this.userRepository.updateUser(user.id, {
      lastLogin: new Date(),
    });

    // Log the login action to AuditLog
    await this.auditLogRepository.createAuditLog({
      action: 'login',
      module: 'users',
      tableName: 'user',
      recordId: user.id,
      userId: user.id,
      ipAddress,
      userAgent,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        position: user.position,
      },
    };
  }

  // async register(data: {
  //   email: string;
  //   password: string;
  //   firstName: string;
  //   lastName: string;
  //   role: 'admin' | 'user';
  // }) {
  //   // Check if email already exists
  //   const existingUser = await this.userRepository.getUserByEmail(data.email);
  //   if (existingUser) {
  //     throw new Error('Email already in use');
  //   }
  //   data.password = await hashPassword(data.password);
  //   return this.userRepository.createUser(data);
  // }

  async logout(userId: string, ipAddress?: string, userAgent?: string) {
    // Log the logout action to AuditLog
    await this.auditLogRepository.createAuditLog({
      action: 'logout',
      module: 'users',
      tableName: 'user',
      recordId: userId,
      userId,
      ipAddress,
      userAgent,
    });

    return { message: 'Logged out successfully' };
  }

  async getLoginHistory(userId: string) {
    return await this.auditLogRepository.getLoginLogsByUser(userId);
  }
}
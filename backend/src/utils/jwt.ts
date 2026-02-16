import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // In production, use environment variables

export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export function generateToken(payload: {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}, expiresIn: string | number = "24h"): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn as any });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload;
    return decoded;
  } catch (error) {
    console.log('Invalid or expired token:', error);
    return null;
  }
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch (error) {
    console.log('Invalid token format:', error);
    return null;
  }
}

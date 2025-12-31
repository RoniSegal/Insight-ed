import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// Hardcoded teacher account for 3-day MVP demo
const TEACHER_ACCOUNT = {
  id: '1',
  email: 'teacher@example.com',
  password: 'Test123!', // Plain text for demo - NOT for production!
  role: 'teacher',
  name: 'Demo Teacher',
};

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Validate hardcoded credentials
 */
export function validateCredentials(email: string, password: string): boolean {
  return email === TEACHER_ACCOUNT.email && password === TEACHER_ACCOUNT.password;
}

/**
 * Generate JWT token with user info
 */
export function generateToken(userId: string, email: string, role: string): string {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Verify JWT token and return payload
 * Supports both string tokens and NextRequest objects
 */
export function verifyToken(tokenOrRequest: string | NextRequest): JWTPayload | null {
  let token: string;

  if (typeof tokenOrRequest === 'string') {
    // Direct token string
    token = tokenOrRequest;
  } else {
    // NextRequest object - extract token from Authorization header
    const authHeader = tokenOrRequest.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    token = authHeader.substring(7);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Get hardcoded teacher account info (without password)
 */
export function getTeacherAccount() {
  return {
    id: TEACHER_ACCOUNT.id,
    email: TEACHER_ACCOUNT.email,
    role: TEACHER_ACCOUNT.role,
    name: TEACHER_ACCOUNT.name,
  };
}

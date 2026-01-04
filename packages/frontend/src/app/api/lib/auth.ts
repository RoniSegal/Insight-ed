import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
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

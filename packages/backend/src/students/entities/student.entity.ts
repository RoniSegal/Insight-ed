/**
 * Student entity interface
 * Simplified representation for MVP demo
 *
 * Note: The Prisma schema has a more complex Student model with firstName, lastName,
 * schoolId, etc. This simplified entity matches the frontend API for the MVP.
 *
 * For MVP, we use an in-memory store. When migrating to Prisma, we'll need to:
 * 1. Map this simplified interface to the Prisma Student model
 * 2. Handle the firstName/lastName split
 * 3. Associate students with schools
 */
export interface Student {
  id: string;
  name: string;
  grade: string;
  class?: string;
  createdAt: string;
}

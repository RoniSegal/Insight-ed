/**
 * In-Memory Student Store for 3-Day MVP Demo
 *
 * IMPORTANT: This is a temporary implementation for demo purposes.
 * Data is stored in memory and will be lost on server restart.
 *
 * Production version should use a proper database.
 */

export interface Student {
  id: string;
  name: string;
  grade: string;
  class?: string;
  createdAt: string;
}

class StudentsStore {
  private students: Map<string, Student> = new Map();
  private nextId: number = 1;

  /**
   * Create a new student
   */
  create(data: Omit<Student, 'id' | 'createdAt'>): Student {
    const id = String(this.nextId++);
    const student: Student = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.students.set(id, student);
    return student;
  }

  /**
   * Get all students
   */
  getAll(): Student[] {
    return Array.from(this.students.values());
  }

  /**
   * Get student by ID
   */
  getById(id: string): Student | undefined {
    return this.students.get(id);
  }

  /**
   * Update student by ID
   */
  update(id: string, data: Partial<Omit<Student, 'id' | 'createdAt'>>): Student | undefined {
    const student = this.students.get(id);
    if (!student) {
      return undefined;
    }

    const updatedStudent: Student = {
      ...student,
      ...data,
    };

    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  /**
   * Delete student by ID
   */
  delete(id: string): boolean {
    return this.students.delete(id);
  }

  /**
   * Seed store with demo data
   * Only runs if store is empty
   */
  seed() {
    if (this.students.size === 0) {
      this.create({
        name: 'שרה כהן',
        grade: 'כיתה ג׳',
        class: 'גב׳ לוי'
      });
      this.create({
        name: 'מיכאל דוד',
        grade: 'כיתה ג׳',
        class: 'גב׳ לוי'
      });
      this.create({
        name: 'נועה אברהם',
        grade: 'כיתה ד׳',
        class: 'מר רוזנברג'
      });
      this.create({
        name: 'דניאל יוסף',
        grade: 'כיתה ה׳',
        class: 'גב׳ שפירא'
      });
      this.create({
        name: 'תמר לוי',
        grade: 'כיתה ד׳',
        class: 'מר רוזנברג'
      });
    }
  }
}

// Declare global type for Next.js to ensure singleton across route segments
declare global {
  var __studentsStore: StudentsStore | undefined;
}

// Use globalThis to ensure a true singleton across all Next.js routes
// This prevents the issue where different route segments get different instances
const studentsStore = globalThis.__studentsStore ?? new StudentsStore();
globalThis.__studentsStore = studentsStore;

// Export singleton instance
export { studentsStore };

// Seed with demo data on first import
studentsStore.seed();

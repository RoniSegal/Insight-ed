import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';

import { CreateStudentDto } from './dto/create-student.dto';
import { StudentDto } from './dto/student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

/**
 * Service for managing students
 *
 * IMPORTANT: This is a temporary in-memory implementation for MVP demo.
 * Data is stored in memory and will be lost on server restart.
 *
 * TODO: Migrate to Prisma database when ready:
 * - Replace in-memory Map with Prisma queries
 * - Map simplified Student interface to Prisma Student model
 * - Handle firstName/lastName split
 * - Associate students with schools
 */
@Injectable()
export class StudentsService implements OnModuleInit {
  private readonly logger = new Logger(StudentsService.name);

  // In-memory store (MVP - will move to database)
  private readonly students = new Map<string, Student>();
  private nextId = 1;

  onModuleInit() {
    // Seed with demo data on startup if empty
    this.seedData();
    this.logger.log(`Students Service initialized with ${this.students.size} students`);
  }

  /**
   * Create a new student
   */
  async create(createStudentDto: CreateStudentDto): Promise<StudentDto> {
    // Trim and normalize input (Unicode-aware)
    const name = createStudentDto.name.trim().normalize('NFC');
    const grade = createStudentDto.grade.trim().normalize('NFC');
    const className = createStudentDto.class?.trim().normalize('NFC');

    // Validate name (already validated by class-validator, but double-check)
    if (!name) {
      throw new BadRequestException('שם הוא שדה חובה');
    }

    if (!grade) {
      throw new BadRequestException('כיתה היא שדה חובה');
    }

    // Create student
    const id = String(this.nextId++);
    const student: Student = {
      id,
      name,
      grade,
      class: className,
      createdAt: new Date().toISOString(),
    };

    this.students.set(id, student);

    this.logger.log(`Created student: ${id} - ${name}`);

    return student;
  }

  /**
   * Get all students
   */
  async findAll(): Promise<StudentDto[]> {
    return Array.from(this.students.values());
  }

  /**
   * Get student by ID
   */
  async findOne(id: string): Promise<StudentDto> {
    const student = this.students.get(id);

    if (!student) {
      throw new NotFoundException(`Student ${id} not found`);
    }

    return student;
  }

  /**
   * Update student by ID
   */
  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<StudentDto> {
    const student = this.students.get(id);

    if (!student) {
      throw new NotFoundException(`Student ${id} not found`);
    }

    // Validate at least one field is provided
    if (!updateStudentDto.name && !updateStudentDto.grade && !updateStudentDto.class) {
      throw new BadRequestException('לפחות שדה אחד נדרש לעדכון');
    }

    // Update fields (trim and normalize)
    if (updateStudentDto.name !== undefined) {
      student.name = updateStudentDto.name.trim().normalize('NFC');
    }
    if (updateStudentDto.grade !== undefined) {
      student.grade = updateStudentDto.grade.trim().normalize('NFC');
    }
    if (updateStudentDto.class !== undefined) {
      student.class = updateStudentDto.class.trim().normalize('NFC');
    }

    this.students.set(id, student);

    this.logger.log(`Updated student: ${id} - ${student.name}`);

    return student;
  }

  /**
   * Delete student by ID
   */
  async remove(id: string): Promise<{ success: boolean }> {
    const student = this.students.get(id);

    if (!student) {
      throw new NotFoundException(`Student ${id} not found`);
    }

    this.students.delete(id);

    this.logger.log(`Deleted student: ${id} - ${student.name}`);

    return { success: true };
  }

  /**
   * Seed store with demo data
   * Only runs if store is empty
   * @private
   */
  private seedData() {
    if (this.students.size === 0) {
      const seedStudents = [
        { name: 'שרה כהן', grade: 'כיתה ג׳', class: 'גב׳ לוי' },
        { name: 'מיכאל דוד', grade: 'כיתה ג׳', class: 'גב׳ לוי' },
        { name: 'נועה אברהם', grade: 'כיתה ד׳', class: 'מר רוזנברג' },
        { name: 'דניאל יוסף', grade: 'כיתה ה׳', class: 'גב׳ שפירא' },
        { name: 'תמר לוי', grade: 'כיתה ד׳', class: 'מר רוזנברג' },
      ];

      for (const seedStudent of seedStudents) {
        const id = String(this.nextId++);
        const student: Student = {
          id,
          ...seedStudent,
          createdAt: new Date().toISOString(),
        };
        this.students.set(id, student);
      }

      this.logger.log(`Seeded ${seedStudents.length} demo students`);
    }
  }
}

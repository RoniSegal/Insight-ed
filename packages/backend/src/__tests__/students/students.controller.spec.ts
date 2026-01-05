import { Test, TestingModule } from '@nestjs/testing';

import { CreateStudentDto } from '../../students/dto/create-student.dto';
import { UpdateStudentDto } from '../../students/dto/update-student.dto';
import { StudentsController } from '../../students/students.controller';
import { StudentsService } from '../../students/students.service';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [StudentsService],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);

    // Initialize service (seeds data)
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all students', async () => {
      const result = await controller.findAll();

      expect(result).toHaveProperty('students');
      expect(Array.isArray(result.students)).toBe(true);
      expect(result.students.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return a single student', async () => {
      const students = await service.findAll();
      const studentId = students[0].id;

      const result = await controller.findOne(studentId);

      expect(result).toHaveProperty('student');
      expect(result.student.id).toBe(studentId);
    });

    it('should throw NotFoundException for non-existent student', async () => {
      await expect(controller.findOne('999999')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new student', async () => {
      const createDto: CreateStudentDto = {
        name: 'יוסף לוי',
        grade: 'כיתה ו׳',
        class: 'מר כהן',
      };

      const result = await controller.create(createDto);

      expect(result).toHaveProperty('student');
      expect(result.student.name).toBe('יוסף לוי');
      expect(result.student.grade).toBe('כיתה ו׳');
      expect(result.student.class).toBe('מר כהן');
    });

    it('should create student without optional class field', async () => {
      const createDto: CreateStudentDto = {
        name: 'Test Student',
        grade: 'כיתה א׳',
      };

      const result = await controller.create(createDto);

      expect(result.student.class).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const students = await service.findAll();
      const studentId = students[0].id;

      const updateDto: UpdateStudentDto = {
        grade: 'כיתה ו׳',
      };

      const result = await controller.update(studentId, updateDto);

      expect(result).toHaveProperty('student');
      expect(result.student.grade).toBe('כיתה ו׳');
    });

    it('should throw NotFoundException for non-existent student', async () => {
      const updateDto: UpdateStudentDto = {
        grade: 'כיתה ו׳',
      };

      await expect(controller.update('999999', updateDto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete a student', async () => {
      const students = await service.findAll();
      const studentId = students[students.length - 1].id; // Delete last student

      const result = await controller.remove(studentId);

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);

      // Verify student is deleted - should throw NotFoundException
      await expect(service.findOne(studentId)).rejects.toThrow();
    });

    it('should throw NotFoundException for non-existent student', async () => {
      await expect(controller.remove('999999')).rejects.toThrow();
    });
  });
});

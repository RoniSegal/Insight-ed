import { Test, TestingModule } from '@nestjs/testing';

import { StudentsService } from '../../students/students.service';

describe('StudentsService', () => {
  let service: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentsService],
    }).compile();

    service = module.get<StudentsService>(StudentsService);

    // Initialize service (seeds data)
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initialization', () => {
    it('should seed 5 demo students on startup', async () => {
      const students = await service.findAll();
      expect(students).toHaveLength(5);
    });

    it('should seed students with correct Hebrew names', async () => {
      const students = await service.findAll();
      const names = students.map((s) => s.name);

      expect(names).toContain('שרה כהן');
      expect(names).toContain('מיכאל דוד');
      expect(names).toContain('נועה אברהם');
      expect(names).toContain('דניאל יוסף');
      expect(names).toContain('תמר לוי');
    });
  });

  describe('create', () => {
    it('should create a new student', async () => {
      const studentData = {
        name: 'יוסף לוי',
        grade: 'כיתה ו׳',
        class: 'מר כהן',
      };

      const student = await service.create(studentData);

      expect(student).toBeDefined();
      expect(student.id).toBeDefined();
      expect(student.name).toBe('יוסף לוי');
      expect(student.grade).toBe('כיתה ו׳');
      expect(student.class).toBe('מר כהן');
      expect(student.createdAt).toBeDefined();
    });

    it('should auto-increment student IDs', async () => {
      const student1 = await service.create({
        name: 'Test 1',
        grade: 'כיתה א׳',
      });

      const student2 = await service.create({
        name: 'Test 2',
        grade: 'כיתה ב׳',
      });

      expect(Number(student2.id)).toBeGreaterThan(Number(student1.id));
    });

    it('should normalize Unicode strings (NFC)', async () => {
      // Test with combining characters (NFD form)
      const studentData = {
        name: 'שָׁרָה', // Hebrew with nikud (combining chars)
        grade: 'כיתה א׳',
      };

      const student = await service.create(studentData);

      // Name should be normalized to NFC
      expect(student.name).toBe(studentData.name.normalize('NFC'));
    });

    it('should trim whitespace from name and grade', async () => {
      const studentData = {
        name: '  יוסף לוי  ',
        grade: '  כיתה ו׳  ',
        class: '  מר כהן  ',
      };

      const student = await service.create(studentData);

      expect(student.name).toBe('יוסף לוי');
      expect(student.grade).toBe('כיתה ו׳');
      expect(student.class).toBe('מר כהן');
    });
  });

  describe('findAll', () => {
    it('should return all students', async () => {
      const students = await service.findAll();
      expect(students.length).toBeGreaterThan(0);
    });

    it('should return students with all required fields', async () => {
      const students = await service.findAll();
      const student = students[0];

      expect(student).toHaveProperty('id');
      expect(student).toHaveProperty('name');
      expect(student).toHaveProperty('grade');
      expect(student).toHaveProperty('createdAt');
    });
  });

  describe('findOne', () => {
    it('should return a student by ID', async () => {
      const allStudents = await service.findAll();
      const firstStudent = allStudents[0];

      const student = await service.findOne(firstStudent.id);

      expect(student).toBeDefined();
      expect(student.id).toBe(firstStudent.id);
      expect(student.name).toBe(firstStudent.name);
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      await expect(service.findOne('999999')).rejects.toThrow('Student 999999 not found');
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const students = await service.findAll();
      const studentId = students[0].id;

      const updateData = {
        name: 'Updated Name',
        grade: 'Updated Grade',
      };

      const updated = await service.update(studentId, updateData);

      expect(updated).toBeDefined();
      expect(updated.name).toBe('Updated Name');
      expect(updated.grade).toBe('Updated Grade');
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      await expect(service.update('999999', { name: 'Test' })).rejects.toThrow(
        'Student 999999 not found'
      );
    });

    it('should allow partial updates', async () => {
      const students = await service.findAll();
      const student = students[0];
      const originalName = student.name;

      const updated = await service.update(student.id, {
        grade: 'New Grade',
      });

      expect(updated).toBeDefined();
      expect(updated.name).toBe(originalName); // Name unchanged
      expect(updated.grade).toBe('New Grade');
    });

    it('should normalize and trim updated fields', async () => {
      const students = await service.findAll();
      const studentId = students[0].id;

      const updated = await service.update(studentId, {
        name: '  Updated  ',
      });

      expect(updated.name).toBe('Updated');
    });

    it('should throw BadRequestException if no fields provided', async () => {
      const students = await service.findAll();
      const studentId = students[0].id;

      await expect(service.update(studentId, {})).rejects.toThrow('לפחות שדה אחד נדרש לעדכון');
    });
  });

  describe('remove', () => {
    it('should remove a student', async () => {
      const students = await service.findAll();
      const initialCount = students.length;
      const studentId = students[0].id;

      const result = await service.remove(studentId);

      expect(result).toEqual({ success: true });

      const remainingStudents = await service.findAll();
      expect(remainingStudents.length).toBe(initialCount - 1);

      // Verify student is deleted
      await expect(service.findOne(studentId)).rejects.toThrow();
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      await expect(service.remove('999999')).rejects.toThrow('Student 999999 not found');
    });
  });
});

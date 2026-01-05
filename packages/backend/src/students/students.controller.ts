import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentDto } from './dto/student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

/**
 * Controller for students REST API endpoints
 *
 * Provides endpoints for:
 * - Creating students
 * - Listing students
 * - Getting student details
 * - Updating students
 * - Deleting students
 *
 * All endpoints require JWT authentication
 */
@ApiTags('students')
@ApiBearerAuth()
@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * Create a new student
   *
   * POST /api/v1/students
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new student',
    description: 'Create a new student with name, grade, and optional class/teacher information.',
  })
  @ApiResponse({
    status: 201,
    description: 'Student created successfully',
    type: StudentDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request (validation failed)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createStudentDto: CreateStudentDto
  ): Promise<{ student: StudentDto }> {
    const student = await this.studentsService.create(createStudentDto);
    return { student };
  }

  /**
   * Get all students
   *
   * GET /api/v1/students
   */
  @Get()
  @ApiOperation({
    summary: 'Get all students',
    description: 'Retrieve a list of all students.',
  })
  @ApiResponse({
    status: 200,
    description: 'Students retrieved successfully',
    type: [StudentDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async findAll(): Promise<{ students: StudentDto[] }> {
    const students = await this.studentsService.findAll();
    return { students };
  }

  /**
   * Get a student by ID
   *
   * GET /api/v1/students/:id
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get student by ID',
    description: 'Retrieve a single student by their ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The student ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Student found',
    type: StudentDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async findOne(@Param('id') id: string): Promise<{ student: StudentDto }> {
    const student = await this.studentsService.findOne(id);
    return { student };
  }

  /**
   * Update a student
   *
   * PUT /api/v1/students/:id
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Update student',
    description: 'Update student information. At least one field must be provided.',
  })
  @ApiParam({
    name: 'id',
    description: 'The student ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Student updated successfully',
    type: StudentDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request (validation failed or no fields provided)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateStudentDto: UpdateStudentDto
  ): Promise<{ student: StudentDto }> {
    const student = await this.studentsService.update(id, updateStudentDto);
    return { student };
  }

  /**
   * Delete a student
   *
   * DELETE /api/v1/students/:id
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete student',
    description: 'Delete a student by their ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The student ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Student deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return await this.studentsService.remove(id);
  }
}

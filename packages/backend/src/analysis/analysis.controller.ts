import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { AnalysisService } from './analysis.service';
import {
  AnalysisDto,
  ChatMessageDto,
  ChatResponseDto,
  CompleteAnalysisDto,
  CompleteAnalysisResponseDto,
  StartAnalysisDto,
  StartAnalysisResponseDto,
} from './dto';

/**
 * Controller for student analysis REST API endpoints
 *
 * Provides endpoints for:
 * - Starting analysis conversations
 * - Sending chat messages
 * - Completing analyses
 * - Retrieving analysis results
 *
 * All endpoints require JWT authentication
 */
@ApiTags('analysis')
@ApiBearerAuth()
@Controller('analysis')
@UseGuards(JwtAuthGuard)
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  /**
   * Start a new analysis conversation for a student
   *
   * POST /api/v1/analysis/start
   */
  @Post('start')
  @ApiOperation({
    summary: 'Start a new analysis conversation',
    description:
      'Initialize a new analysis conversation for a student. Returns a conversation ID and the first AI question.',
  })
  @ApiResponse({
    status: 201,
    description: 'Conversation started successfully',
    type: StartAnalysisResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request (missing studentId)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async startAnalysis(
    @Body() dto: StartAnalysisDto,
    @Request() req: any
  ): Promise<StartAnalysisResponseDto> {
    const userId = req.user.userId;

    // TODO: In future, fetch student name from database if not provided
    const studentName = dto.studentName || `Student ${dto.studentId}`;

    const result = await this.analysisService.startConversation(dto.studentId, studentName, userId);

    return result;
  }

  /**
   * Send a chat message in an ongoing analysis conversation
   *
   * POST /api/v1/analysis/chat
   */
  @Post('chat')
  @ApiOperation({
    summary: 'Send a chat message',
    description:
      'Continue an analysis conversation by sending a user message. Returns the AI response.',
  })
  @ApiResponse({
    status: 200,
    description: 'Message sent successfully, AI responded',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request (missing conversationId or message)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'Conversation not found',
  })
  @ApiResponse({
    status: 429,
    description: 'Rate limit exceeded',
  })
  async chat(@Body() dto: ChatMessageDto): Promise<ChatResponseDto> {
    // TODO: Add rate limiting per user (current implementation uses in-memory map)
    const result = await this.analysisService.continueConversation(dto.conversationId, dto.message);

    return result;
  }

  /**
   * Complete an analysis and generate the final report
   *
   * POST /api/v1/analysis/complete
   */
  @Post('complete')
  @ApiOperation({
    summary: 'Complete an analysis',
    description:
      'Generate the final analysis report and save it to the database. Returns the analysis ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Analysis completed and saved',
    type: CompleteAnalysisResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or conversation not ready to complete',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'Conversation not found',
  })
  async completeAnalysis(
    @Body() dto: CompleteAnalysisDto,
    @Request() req: any
  ): Promise<CompleteAnalysisResponseDto> {
    const userId = req.user.userId;

    const result = await this.analysisService.completeAnalysis(dto.conversationId, userId);

    return result;
  }

  /**
   * Get an analysis by ID
   *
   * GET /api/v1/analysis/:id
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get analysis by ID',
    description: 'Retrieve a saved analysis result by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The analysis ID',
    example: '42',
  })
  @ApiResponse({
    status: 200,
    description: 'Analysis found',
    type: AnalysisDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'Analysis not found',
  })
  async getAnalysisById(@Param('id') id: string): Promise<{ analysis: AnalysisDto }> {
    // TODO: Add authorization check (teachers can only view their analyses, principals can view all)
    const analysis = await this.analysisService.getAnalysisById(id);
    return { analysis };
  }

  /**
   * Get all analyses for a student
   *
   * GET /api/v1/analysis/student/:studentId
   */
  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get all analyses for a student',
    description:
      'Retrieve all analysis results for a specific student, sorted by date (newest first).',
  })
  @ApiParam({
    name: 'studentId',
    description: 'The student ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Analyses retrieved successfully',
    type: [AnalysisDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getAnalysesByStudent(
    @Param('studentId') studentId: string
  ): Promise<{ analyses: AnalysisDto[] }> {
    // TODO: Add authorization check (teachers can only view analyses for their students)
    const analyses = await this.analysisService.getAnalysesByStudentId(studentId);
    return { analyses };
  }

  /**
   * Get the latest analysis for a student
   *
   * GET /api/v1/analysis/student/:studentId/latest
   */
  @Get('student/:studentId/latest')
  @ApiOperation({
    summary: 'Get latest analysis for a student',
    description: 'Retrieve the most recent analysis result for a specific student.',
  })
  @ApiParam({
    name: 'studentId',
    description: 'The student ID',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'Latest analysis found',
    type: AnalysisDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 404,
    description: 'No analyses found for this student',
  })
  async getLatestAnalysisByStudent(
    @Param('studentId') studentId: string
  ): Promise<{ analysis: AnalysisDto }> {
    // TODO: Add authorization check (teachers can only view analyses for their students)
    const analysis = await this.analysisService.getLatestAnalysisByStudentId(studentId);

    if (!analysis) {
      throw new NotFoundException(`No analyses found for student ${studentId}`);
    }

    return { analysis };
  }
}

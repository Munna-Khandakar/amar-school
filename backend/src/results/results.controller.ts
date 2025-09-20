import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request
} from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto, BulkResultDto, UpdateResultDto, ResultQueryDto, StudentReportCardDto, ClassResultsDto, CreateSubjectDto } from '../common/dto/result.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('results')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  createResult(@Body() createResultDto: CreateResultDto, @Request() req: any) {
    return this.resultsService.createResult(createResultDto, req.user.id);
  }

  @Post('bulk')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  createBulkResults(@Body() bulkResultDto: BulkResultDto, @Request() req: any) {
    return this.resultsService.createBulkResults(bulkResultDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN, UserRole.STUDENT)
  getResults(@Query() query: ResultQueryDto, @Request() req: any) {
    return this.resultsService.getResults(query, req.user.id);
  }

  @Get('report-card')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN, UserRole.STUDENT)
  getStudentReportCard(@Query() query: StudentReportCardDto, @Request() req: any) {
    return this.resultsService.getStudentReportCard(query, req.user.id);
  }

  @Get('class-results')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  getClassResults(@Query() query: ClassResultsDto, @Request() req: any) {
    return this.resultsService.getClassResults(query, req.user.id);
  }

  @Patch(':id')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  updateResult(
    @Param('id') id: string,
    @Body() updateResultDto: UpdateResultDto,
    @Request() req: any
  ) {
    return this.resultsService.updateResult(id, updateResultDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  deleteResult(@Param('id') id: string, @Request() req: any) {
    return this.resultsService.deleteResult(id, req.user.id);
  }

  // Subject management endpoints
  @Post('subjects')
  @Roles(UserRole.SCHOOL_ADMIN)
  createSubject(@Body() createSubjectDto: CreateSubjectDto, @Request() req: any) {
    return this.resultsService.createSubject(createSubjectDto, req.user.id);
  }

  @Get('subjects/:schoolId')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  getSubjects(
    @Param('schoolId') schoolId: string,
    @Query('grade') grade?: string
  ) {
    const gradeNumber = grade ? parseInt(grade) : undefined;
    return this.resultsService.getSubjects(schoolId, gradeNumber);
  }
}
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
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto, BulkAttendanceDto, UpdateAttendanceDto, AttendanceQueryDto, AttendanceReportDto, StudentAttendanceStatsDto } from '../common/dto/attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  markAttendance(@Body() markAttendanceDto: MarkAttendanceDto, @Request() req: any) {
    return this.attendanceService.markAttendance(markAttendanceDto, req.user.id);
  }

  @Post('mark-bulk')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  markBulkAttendance(@Body() bulkAttendanceDto: BulkAttendanceDto, @Request() req: any) {
    return this.attendanceService.markBulkAttendance(bulkAttendanceDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN, UserRole.STUDENT)
  getAttendance(@Query() query: AttendanceQueryDto, @Request() req: any) {
    return this.attendanceService.getAttendance(query, req.user.id);
  }

  @Get('student-stats')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN, UserRole.STUDENT)
  getStudentAttendanceStats(@Query() query: StudentAttendanceStatsDto, @Request() req: any) {
    return this.attendanceService.getStudentAttendanceStats(query, req.user.id);
  }

  @Get('class-report')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  getClassAttendanceReport(@Query() query: AttendanceReportDto, @Request() req: any) {
    return this.attendanceService.getClassAttendanceReport(query, req.user.id);
  }

  @Patch(':id')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  updateAttendance(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @Request() req: any
  ) {
    return this.attendanceService.updateAttendance(id, updateAttendanceDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN)
  deleteAttendance(@Param('id') id: string, @Request() req: any) {
    return this.attendanceService.deleteAttendance(id, req.user.id);
  }
}
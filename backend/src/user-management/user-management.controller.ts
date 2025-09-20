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
  ParseIntPipe,
  DefaultValuePipe,
  Request
} from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { CreateTeacherDto, CreateStudentDto, UpdateUserDto, CreateClassDto } from '../common/dto/user-management.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('user-management')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post('teachers')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN)
  createTeacher(@Body() createTeacherDto: CreateTeacherDto, @Request() req: any) {
    return this.userManagementService.createTeacher(createTeacherDto, req.user.id);
  }

  @Post('students')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN)
  createStudent(@Body() createStudentDto: CreateStudentDto, @Request() req: any) {
    return this.userManagementService.createStudent(createStudentDto, req.user.id);
  }

  @Get('schools/:schoolId/teachers')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN)
  getSchoolTeachers(
    @Param('schoolId') schoolId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Request() req?: any,
  ) {
    return this.userManagementService.getSchoolUsers(schoolId, UserRole.TEACHER, req.user.id, page, limit, search);
  }

  @Get('schools/:schoolId/students')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  getSchoolStudents(
    @Param('schoolId') schoolId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Request() req?: any,
  ) {
    return this.userManagementService.getSchoolUsers(schoolId, UserRole.STUDENT, req.user.id, page, limit, search);
  }

  @Get('users/:id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  getUserById(@Param('id') id: string, @Request() req: any) {
    return this.userManagementService.getUserById(id, req.user.id);
  }

  @Patch('users/:id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN)
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    return this.userManagementService.updateUser(id, updateUserDto, req.user.id);
  }

  @Delete('users/:id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN)
  deleteUser(@Param('id') id: string, @Request() req: any) {
    return this.userManagementService.deleteUser(id, req.user.id);
  }

  @Post('classes')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN)
  createClass(@Body() createClassDto: CreateClassDto, @Request() req: any) {
    return this.userManagementService.createClass(createClassDto, req.user.id);
  }

  @Get('schools/:schoolId/classes')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  getSchoolClasses(@Param('schoolId') schoolId: string, @Request() req: any) {
    return this.userManagementService.getSchoolClasses(schoolId, req.user.id);
  }

  @Get('schools/:schoolId/stats')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN)
  getSchoolStats(@Param('schoolId') schoolId: string, @Request() req: any) {
    return this.userManagementService.getSchoolStats(schoolId, req.user.id);
  }
}
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
  DefaultValuePipe
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto, UpdateSchoolDto, UpdateSmsQuotaDto } from '../common/dto/school.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolService.create(createSchoolDto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.schoolService.findAll(page, limit, search);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  findOne(@Param('id') id: string) {
    return this.schoolService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.schoolService.remove(id);
  }

  @Patch(':id/sms-quota')
  @Roles(UserRole.SUPER_ADMIN)
  updateSmsQuota(
    @Param('id') id: string,
    @Body() updateSmsQuotaDto: UpdateSmsQuotaDto,
  ) {
    return this.schoolService.updateSmsQuota(id, updateSmsQuotaDto);
  }

  @Get(':id/stats')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  getSchoolStats(@Param('id') id: string) {
    return this.schoolService.getSchoolStats(id);
  }
}
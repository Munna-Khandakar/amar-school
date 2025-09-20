import { IsString, IsOptional, IsBoolean, IsEnum, IsDateString, IsMongoId, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../schemas/attendance.schema';

export class PeriodDetailsDto {
  @IsNumber()
  period: number;

  @IsString()
  subject: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

export class MarkAttendanceDto {
  @IsMongoId()
  studentId: string;

  @IsMongoId()
  classId: string;

  @IsDateString()
  date: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsDateString()
  timeIn?: string;

  @IsOptional()
  @IsDateString()
  timeOut?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PeriodDetailsDto)
  periodDetails?: PeriodDetailsDto;

  @IsOptional()
  @IsBoolean()
  isHalfDay?: boolean;
}

export class BulkAttendanceDto {
  @IsMongoId()
  classId: string;

  @IsDateString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAttendanceDto)
  students: StudentAttendanceDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PeriodDetailsDto)
  periodDetails?: PeriodDetailsDto;
}

export class StudentAttendanceDto {
  @IsMongoId()
  studentId: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsDateString()
  timeIn?: string;

  @IsOptional()
  @IsDateString()
  timeOut?: string;

  @IsOptional()
  @IsBoolean()
  isHalfDay?: boolean;
}

export class UpdateAttendanceDto {
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsDateString()
  timeIn?: string;

  @IsOptional()
  @IsDateString()
  timeOut?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PeriodDetailsDto)
  periodDetails?: PeriodDetailsDto;

  @IsOptional()
  @IsBoolean()
  isHalfDay?: boolean;
}

export class AttendanceQueryDto {
  @IsOptional()
  @IsMongoId()
  studentId?: string;

  @IsOptional()
  @IsMongoId()
  classId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}

export class AttendanceReportDto {
  @IsMongoId()
  classId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  format?: 'json' | 'csv' | 'pdf';
}

export class StudentAttendanceStatsDto {
  @IsMongoId()
  studentId: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
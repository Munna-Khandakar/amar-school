import { IsString, IsEmail, IsOptional, IsBoolean, IsNumber, IsEnum, IsObject, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SchoolSettingsDto {
  @IsString()
  academicYear: string;

  @IsEnum(['semester', 'trimester', 'quarterly'])
  termSystem: 'semester' | 'trimester' | 'quarterly';

  @IsEnum(['percentage', 'gpa', 'letter'])
  gradeSystem: 'percentage' | 'gpa' | 'letter';

  @IsNumber()
  @Min(0)
  @Max(100)
  attendanceThreshold: number;
}

export class CreateSchoolDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  zipCode: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsString()
  adminId: string;

  @ValidateNested()
  @Type(() => SchoolSettingsDto)
  settings: SchoolSettingsDto;

  @IsOptional()
  @IsString({ each: true })
  allowedDomains?: string[];
}

export class UpdateSchoolDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => SchoolSettingsDto)
  settings?: SchoolSettingsDto;

  @IsOptional()
  @IsString({ each: true })
  allowedDomains?: string[];
}

export class UpdateSmsQuotaDto {
  @IsNumber()
  @Min(0)
  monthlyLimit: number;
}
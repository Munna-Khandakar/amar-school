import { IsString, IsOptional, IsBoolean, IsEnum, IsDateString, IsMongoId, IsArray, ValidateNested, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { AssessmentType, Term } from '../schemas/result.schema';

export class GradingDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  weightage: number;

  @IsString()
  category: string;
}

export class CreateResultDto {
  @IsMongoId()
  studentId: string;

  @IsMongoId()
  classId: string;

  @IsString()
  subject: string;

  @IsString()
  subjectCode: string;

  @IsEnum(AssessmentType)
  assessmentType: AssessmentType;

  @IsString()
  assessmentName: string;

  @IsNumber()
  @Min(0)
  marksObtained: number;

  @IsNumber()
  @Min(1)
  totalMarks: number;

  @IsEnum(Term)
  term: Term;

  @IsString()
  academicYear: string;

  @IsDateString()
  examDate: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @ValidateNested()
  @Type(() => GradingDto)
  grading: GradingDto;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class BulkResultDto {
  @IsMongoId()
  classId: string;

  @IsString()
  subject: string;

  @IsString()
  subjectCode: string;

  @IsEnum(AssessmentType)
  assessmentType: AssessmentType;

  @IsString()
  assessmentName: string;

  @IsNumber()
  @Min(1)
  totalMarks: number;

  @IsEnum(Term)
  term: Term;

  @IsString()
  academicYear: string;

  @IsDateString()
  examDate: string;

  @ValidateNested()
  @Type(() => GradingDto)
  grading: GradingDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentResultDto)
  students: StudentResultDto[];

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class StudentResultDto {
  @IsMongoId()
  studentId: string;

  @IsNumber()
  @Min(0)
  marksObtained: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateResultDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  marksObtained?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  totalMarks?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  revisionReason?: string;
}

export class ResultQueryDto {
  @IsOptional()
  @IsMongoId()
  studentId?: string;

  @IsOptional()
  @IsMongoId()
  classId?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsEnum(AssessmentType)
  assessmentType?: AssessmentType;

  @IsOptional()
  @IsEnum(Term)
  term?: Term;

  @IsOptional()
  @IsString()
  academicYear?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}

export class StudentReportCardDto {
  @IsMongoId()
  studentId: string;

  @IsEnum(Term)
  term: Term;

  @IsString()
  academicYear: string;

  @IsOptional()
  @IsString()
  format?: 'json' | 'pdf';
}

export class ClassResultsDto {
  @IsMongoId()
  classId: string;

  @IsString()
  subject: string;

  @IsEnum(Term)
  term: Term;

  @IsString()
  academicYear: string;

  @IsOptional()
  @IsString()
  format?: 'json' | 'csv' | 'pdf';
}

export class SubjectAnalyticsDto {
  @IsMongoId()
  classId: string;

  @IsString()
  subject: string;

  @IsEnum(Term)
  term: Term;

  @IsString()
  academicYear: string;
}

export class MarkingSchemeDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  theory: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  practical: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  internal: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  external: number;
}

export class GradingCriteriaDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  passPercentage: number;

  @IsNumber()
  @Min(1)
  maxMarks: number;

  @IsEnum(['percentage', 'gpa', 'letter'])
  gradeSystem: string;
}

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  grade: number;

  @IsNumber()
  @Min(1)
  credits: number;

  @IsOptional()
  @IsBoolean()
  isOptional?: boolean;

  @ValidateNested()
  @Type(() => MarkingSchemeDto)
  markingScheme: MarkingSchemeDto;

  @ValidateNested()
  @Type(() => GradingCriteriaDto)
  gradingCriteria: GradingCriteriaDto;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  teachers?: string[];
}

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  credits?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isOptional?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => MarkingSchemeDto)
  markingScheme?: MarkingSchemeDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => GradingCriteriaDto)
  gradingCriteria?: GradingCriteriaDto;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  teachers?: string[];
}
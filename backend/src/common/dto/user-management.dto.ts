import { IsString, IsEmail, IsOptional, IsBoolean, IsNumber, IsEnum, IsArray, IsDateString, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';

export class TeachingSubjectDto {
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsNumber()
  experience?: number;
}

export class ParentDetailsDto {
  @IsOptional()
  @IsString()
  fatherName?: string;

  @IsOptional()
  @IsString()
  motherName?: string;

  @IsOptional()
  @IsString()
  guardianName?: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class MedicalInfoDto {
  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medicalConditions?: string[];

  @IsOptional()
  @IsString()
  emergencyContact?: string;
}

export class DocumentDto {
  @IsString()
  documentType: string;

  @IsString()
  documentNumber: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}

export class CreateTeacherDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsMongoId()
  schoolId: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TeachingSubjectDto)
  teachingSubjects?: TeachingSubjectDto[];

  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  assignedClasses?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents?: DocumentDto[];
}

export class CreateStudentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsMongoId()
  schoolId: string;

  @IsMongoId()
  classId: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  studentId?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  admissionNumber?: string;

  @IsOptional()
  @IsDateString()
  admissionDate?: string;

  @IsOptional()
  @IsString()
  rollNumber?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ParentDetailsDto)
  parentDetails?: ParentDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MedicalInfoDto)
  medicalInfo?: MedicalInfoDto;

  @IsOptional()
  @IsString()
  previousSchool?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents?: DocumentDto[];
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsString()
  studentId?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TeachingSubjectDto)
  teachingSubjects?: TeachingSubjectDto[];

  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsDateString()
  joiningDate?: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  assignedClasses?: string[];

  @IsOptional()
  @IsMongoId()
  classId?: string;

  @IsOptional()
  @IsString()
  admissionNumber?: string;

  @IsOptional()
  @IsDateString()
  admissionDate?: string;

  @IsOptional()
  @IsString()
  rollNumber?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ParentDetailsDto)
  parentDetails?: ParentDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MedicalInfoDto)
  medicalInfo?: MedicalInfoDto;

  @IsOptional()
  @IsString()
  previousSchool?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents?: DocumentDto[];
}

export class CreateClassDto {
  @IsString()
  name: string;

  @IsString()
  section: string;

  @IsNumber()
  grade: number;

  @IsMongoId()
  schoolId: string;

  @IsMongoId()
  classTeacher: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  subjectTeachers?: string[];

  @IsString()
  academicYear: string;

  @IsOptional()
  @IsArray()
  subjects?: {
    name: string;
    code: string;
    teacher: string;
    credits: number;
  }[];

  @ValidateNested()
  @Type(() => Object)
  schedule: {
    startTime: string;
    endTime: string;
    days: string[];
  };

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
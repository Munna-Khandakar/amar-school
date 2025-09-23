export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  SCHOOL_ADMIN = 'school_admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export interface TeachingSubject {
  subject: string;
  specialization?: string;
  experience?: number;
}

export interface ParentDetails {
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  relationship?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
}

export interface MedicalInfo {
  bloodGroup?: string;
  allergies?: string[];
  medicalConditions?: string[];
  emergencyContact?: string;
}

export interface Document {
  documentType: string;
  documentNumber: string;
  fileUrl?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string;
  isActive: boolean;
  lastLoginAt?: string;
  employeeId?: string;
  studentId?: string;
  dateOfBirth?: string;
  gender?: string;
  assignedClasses?: string[];
  classId?: string;
  // Teacher specific
  teachingSubjects?: TeachingSubject[];
  qualification?: string;
  experience?: number;
  joiningDate?: string;
  salary?: number;
  // Student specific
  admissionNumber?: string;
  admissionDate?: string;
  rollNumber?: string;
  parentDetails?: ParentDetails;
  medicalInfo?: MedicalInfo;
  previousSchool?: string;
  documents?: Document[];
}

export interface CreateTeacherData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  schoolId: string;
  phoneNumber?: string;
  address?: string;
  employeeId?: string;
  dateOfBirth?: string;
  gender?: string;
  teachingSubjects?: TeachingSubject[];
  qualification?: string;
  experience?: number;
  joiningDate?: string;
  salary?: number;
  assignedClasses?: string[];
  documents?: Document[];
}

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  schoolId: string;
  classId: string;
  phoneNumber?: string;
  address?: string;
  studentId?: string;
  dateOfBirth?: string;
  gender?: string;
  admissionNumber?: string;
  admissionDate?: string;
  rollNumber?: string;
  parentDetails?: ParentDetails;
  medicalInfo?: MedicalInfo;
  previousSchool?: string;
  documents?: Document[];
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  isActive?: boolean;
  employeeId?: string;
  studentId?: string;
  dateOfBirth?: string;
  gender?: string;
  teachingSubjects?: TeachingSubject[];
  qualification?: string;
  experience?: number;
  joiningDate?: string;
  salary?: number;
  assignedClasses?: string[];
  classId?: string;
  admissionNumber?: string;
  admissionDate?: string;
  rollNumber?: string;
  parentDetails?: ParentDetails;
  medicalInfo?: MedicalInfo;
  previousSchool?: string;
  documents?: Document[];
}

export interface Class {
  id: string;
  name: string;
  section: string;
  grade: number;
  schoolId: string;
  classTeacher: string;
  subjectTeachers?: string[];
  academicYear: string;
  subjects?: {
    name: string;
    code: string;
    teacher: string;
    credits: number;
  }[];
  schedule: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  capacity?: number;
  description?: string;
  studentsCount?: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  schoolId?: string;
  phoneNumber?: string;
  address?: string;
  employeeId?: string;
  studentId?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface SchoolSettings {
  academicYear: string;
  termSystem: 'semester' | 'trimester' | 'quarterly';
  gradeSystem: 'percentage' | 'gpa' | 'letter';
  attendanceThreshold: number;
}

export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  isActive: boolean;
  adminId: string;
  settings: SchoolSettings;
  allowedDomains?: string[];
  createdAt: string;
  updatedAt: string;
  smsQuota?: {
    monthlyLimit: number;
    used: number;
  };
  stats?: {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
  };
}

export interface CreateSchoolData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  adminId: string;
  settings: SchoolSettings;
  allowedDomains?: string[];
}

export interface UpdateSchoolData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive?: boolean;
  settings?: SchoolSettings;
  allowedDomains?: string[];
}
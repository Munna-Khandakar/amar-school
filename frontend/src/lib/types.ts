export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  SCHOOL_ADMIN = 'school_admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
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

export interface School {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { User, UpdateUserData, CreateTeacherData, CreateStudentData, UpdateSchoolData } from './types';
import { School, CreateSchoolData, SchoolStats } from '@/stores/schools';
import { AttendanceRecord, BulkAttendanceData } from '@/stores/attendance';
import { Result, BulkResultData, StudentReportCard, ClassResults, Subject } from '@/stores/results';
import { Class, CreateClassData, UserManagementStats } from '@/stores/user-management';

// API Response interfaces
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }

        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          statusCode: error.response?.status || 500,
          error: error.response?.data?.error,
        };

        return Promise.reject(apiError);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          return parsed.state?.token || null;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  private handleUnauthorized() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
  }

  // Generic HTTP methods
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Authentication methods
  async login(credentials: { email: string; password: string }): Promise<AuthResult> {
    const response = await this.post<LoginResponse>('/auth/login', credentials);

    return {
      user: response.user,
      token: response.access_token
    };
  }

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage');
    }
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  async refreshToken() {
    const response = await this.post<{ access_token: string }>('/auth/refresh');
    return {
      token: response.access_token
    };
  }

  // School management methods
  async getSchools(params?: { page?: number; limit?: number; search?: string }) {
    return this.get<PaginatedResponse<School>>('/schools', { params });
  }

  async createSchool(schoolData: CreateSchoolData): Promise<School> {
    return this.post<School>('/schools', schoolData);
  }

  async getSchool(id: string): Promise<School> {
    return this.get<School>(`/schools/${id}`);
  }

  async updateSchool(id: string, schoolData: UpdateSchoolData): Promise<School> {
    return this.patch<School>(`/schools/${id}`, schoolData);
  }

  async deleteSchool(id: string): Promise<void> {
    return this.delete(`/schools/${id}`);
  }

  async getSchoolStats(id: string): Promise<SchoolStats> {
    return this.get<SchoolStats>(`/schools/${id}/stats`);
  }

  // User management methods
  async createTeacher(teacherData: CreateTeacherData): Promise<User> {
    return this.post<User>('/user-management/teachers', teacherData);
  }

  async createStudent(studentData: CreateStudentData): Promise<User> {
    return this.post<User>('/user-management/students', studentData);
  }

  async getSchoolTeachers(schoolId: string, params?: { page?: number; limit?: number; search?: string }) {
    return this.get<PaginatedResponse<User>>(`/user-management/schools/${schoolId}/teachers`, { params });
  }

  async getSchoolStudents(schoolId: string, params?: { page?: number; limit?: number; search?: string }) {
    return this.get<PaginatedResponse<User>>(`/user-management/schools/${schoolId}/students`, { params });
  }

  async getUser(id: string): Promise<User> {
    return this.get<User>(`/user-management/users/${id}`);
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    return this.patch<User>(`/user-management/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<void> {
    return this.delete(`/user-management/users/${id}`);
  }

  async createClass(classData: CreateClassData): Promise<Class> {
    return this.post<Class>('/user-management/classes', classData);
  }

  async getSchoolClasses(schoolId: string): Promise<Class[]> {
    return this.get<Class[]>(`/user-management/schools/${schoolId}/classes`);
  }

  async getUserManagementStats(schoolId: string): Promise<UserManagementStats> {
    return this.get<UserManagementStats>(`/user-management/schools/${schoolId}/stats`);
    return this.get(`/user-management/schools/${schoolId}/stats`);
  }

  // Attendance methods
  async markAttendance(attendanceData: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    return this.post<AttendanceRecord>('/attendance/mark', attendanceData);
  }

  async markBulkAttendance(bulkData: BulkAttendanceData): Promise<AttendanceRecord[]> {
    return this.post<AttendanceRecord[]>('/attendance/mark-bulk', bulkData);
  }

  async getAttendance(params?: Record<string, unknown>): Promise<PaginatedResponse<AttendanceRecord>> {
    return this.get<PaginatedResponse<AttendanceRecord>>('/attendance', { params });
  }

  async getStudentAttendanceStats(params?: Record<string, unknown>) {
    return this.get('/attendance/student-stats', { params });
  }

  async getClassAttendanceReport(params?: Record<string, unknown>) {
    return this.get('/attendance/class-report', { params });
  }

  async updateAttendance(id: string, attendanceData: Record<string, unknown>) {
    return this.patch(`/attendance/${id}`, attendanceData);
  }

  async deleteAttendance(id: string) {
    return this.delete(`/attendance/${id}`);
  }

  // Results methods
  async createResult(resultData: Partial<Result>): Promise<Result> {
    return this.post<Result>('/results', resultData);
  }

  async createBulkResults(bulkData: BulkResultData): Promise<Result[]> {
    return this.post<Result[]>('/results/bulk', bulkData);
  }

  async getResults(params?: Record<string, unknown>): Promise<PaginatedResponse<Result>> {
    return this.get<PaginatedResponse<Result>>('/results', { params });
  }

  async getStudentReportCard(params?: Record<string, unknown>): Promise<StudentReportCard> {
    return this.get<StudentReportCard>('/results/report-card', { params });
    return this.get('/results/report-card', { params });
  }

  async getClassResults(params?: Record<string, unknown>): Promise<ClassResults> {
    return this.get<ClassResults>('/results/class-results', { params });
  }

  async updateResult(id: string, resultData: Partial<Result>): Promise<Result> {
    return this.patch<Result>(`/results/${id}`, resultData);
  }

  async deleteResult(id: string) {
    return this.delete(`/results/${id}`);
  }

  async createSubject(subjectData: Partial<Subject>): Promise<Subject> {
    return this.post<Subject>('/results/subjects', subjectData);
  }

  async getSubjects(schoolId: string, grade?: number): Promise<Subject[]> {
    const params = grade ? { grade: grade.toString() } : {};
    return this.get<Subject[]>(`/results/subjects/${schoolId}`, { params });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
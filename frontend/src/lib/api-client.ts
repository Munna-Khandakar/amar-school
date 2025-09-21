import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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
  async login(credentials: { email: string; password: string }) {
    const response = await this.post<{ user: any; access_token: string }>('/auth/login', credentials);

    return {
      user: response.user as any,
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
    return this.get<PaginatedResponse<Record<string, unknown>>>('/schools', { params });
  }

  async createSchool(schoolData: Record<string, unknown>) {
    return this.post('/schools', schoolData);
  }

  async getSchool(id: string) {
    return this.get(`/schools/${id}`);
  }

  async updateSchool(id: string, schoolData: Record<string, unknown>) {
    return this.patch(`/schools/${id}`, schoolData);
  }

  async deleteSchool(id: string) {
    return this.delete(`/schools/${id}`);
  }

  async getSchoolStats(id: string) {
    return this.get(`/schools/${id}/stats`);
  }

  // User management methods
  async createTeacher(teacherData: Record<string, unknown>) {
    return this.post('/user-management/teachers', teacherData);
  }

  async createStudent(studentData: Record<string, unknown>) {
    return this.post('/user-management/students', studentData);
  }

  async getSchoolTeachers(schoolId: string, params?: { page?: number; limit?: number; search?: string }) {
    return this.get<PaginatedResponse<Record<string, unknown>>>(`/user-management/schools/${schoolId}/teachers`, { params });
  }

  async getSchoolStudents(schoolId: string, params?: { page?: number; limit?: number; search?: string }) {
    return this.get<PaginatedResponse<Record<string, unknown>>>(`/user-management/schools/${schoolId}/students`, { params });
  }

  async getUser(id: string) {
    return this.get(`/user-management/users/${id}`);
  }

  async updateUser(id: string, userData: Record<string, unknown>) {
    return this.patch(`/user-management/users/${id}`, userData);
  }

  async deleteUser(id: string) {
    return this.delete(`/user-management/users/${id}`);
  }

  async createClass(classData: Record<string, unknown>) {
    return this.post('/user-management/classes', classData);
  }

  async getSchoolClasses(schoolId: string) {
    return this.get(`/user-management/schools/${schoolId}/classes`);
  }

  async getUserManagementStats(schoolId: string) {
    return this.get(`/user-management/schools/${schoolId}/stats`);
  }

  // Attendance methods
  async markAttendance(attendanceData: Record<string, unknown>) {
    return this.post('/attendance/mark', attendanceData);
  }

  async markBulkAttendance(bulkData: Record<string, unknown>) {
    return this.post('/attendance/mark-bulk', bulkData);
  }

  async getAttendance(params?: Record<string, unknown>) {
    return this.get('/attendance', { params });
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
  async createResult(resultData: Record<string, unknown>) {
    return this.post('/results', resultData);
  }

  async createBulkResults(bulkData: Record<string, unknown>) {
    return this.post('/results/bulk', bulkData);
  }

  async getResults(params?: Record<string, unknown>) {
    return this.get('/results', { params });
  }

  async getStudentReportCard(params?: Record<string, unknown>) {
    return this.get('/results/report-card', { params });
  }

  async getClassResults(params?: Record<string, unknown>) {
    return this.get('/results/class-results', { params });
  }

  async updateResult(id: string, resultData: Record<string, unknown>) {
    return this.patch(`/results/${id}`, resultData);
  }

  async deleteResult(id: string) {
    return this.delete(`/results/${id}`);
  }

  async createSubject(subjectData: Record<string, unknown>) {
    return this.post('/results/subjects', subjectData);
  }

  async getSubjects(schoolId: string, grade?: number) {
    const params = grade ? { grade: grade.toString() } : {};
    return this.get(`/results/subjects/${schoolId}`, { params });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
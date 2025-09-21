import { create } from 'zustand';
import { apiClient, ApiError, PaginatedResponse } from '@/lib/api-client';
import { User } from '@/lib/types';

export interface Class {
  id: string;
  name: string;
  section: string;
  grade: number;
  schoolId: string;
  classTeacher: string;
  subjectTeachers: string[];
  students: string[];
  academicYear: string;
  subjects: {
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
  isActive: boolean;
  capacity: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  employeeId: string;
  department?: string;
  qualification?: string;
  experience?: number;
  schoolId: string;
  assignedClasses?: string[];
}

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  studentId: string;
  rollNumber: string;
  admissionNumber: string;
  admissionDate: string;
  classId: string;
  schoolId: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
}

export interface CreateClassData {
  name: string;
  section: string;
  grade: number;
  schoolId: string;
  classTeacher: string;
  academicYear: string;
  capacity: number;
  description?: string;
  schedule: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  subjects: {
    name: string;
    code: string;
    teacher: string;
    credits: number;
  }[];
}

export interface UserManagementStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeStudents: number;
  activeTeachers: number;
  classesWithCapacity: number;
}

interface UserManagementState {
  teachers: User[];
  students: User[];
  classes: Class[];
  currentUser: User | null;
  stats: UserManagementStats | null;
  isLoading: boolean;
  error: string | null;
  teachersPagination: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
  studentsPagination: {
    total: number;
    totalPages: number;
    currentPage: number;
  };

  // Teacher actions
  getTeachers: (schoolId: string, params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  createTeacher: (teacherData: CreateTeacherData) => Promise<User>;

  // Student actions
  getStudents: (schoolId: string, params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  createStudent: (studentData: CreateStudentData) => Promise<User>;

  // User actions
  getUser: (id: string) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Class actions
  getClasses: (schoolId: string) => Promise<void>;
  createClass: (classData: CreateClassData) => Promise<Class>;

  // Stats
  getStats: (schoolId: string) => Promise<void>;

  // Utility
  clearError: () => void;
  clearCurrentUser: () => void;
}

export const useUserManagementStore = create<UserManagementState>((set) => ({
  teachers: [],
  students: [],
  classes: [],
  currentUser: null,
  stats: null,
  isLoading: false,
  error: null,
  teachersPagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1,
  },
  studentsPagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1,
  },

  getTeachers: async (schoolId, params) => {
    set({ isLoading: true, error: null });
    try {
      const response: PaginatedResponse<User> = await apiClient.getSchoolTeachers(schoolId, params);
      set({
        teachers: response.data,
        teachersPagination: {
          total: response.total,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
        },
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch teachers',
        isLoading: false,
      });
    }
  },

  createTeacher: async (teacherData) => {
    set({ isLoading: true, error: null });
    try {
      const newTeacher: User = await apiClient.createTeacher(teacherData);
      set((state) => ({
        teachers: [newTeacher, ...state.teachers],
        isLoading: false,
      }));
      return newTeacher;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to create teacher',
        isLoading: false,
      });
      throw error;
    }
  },

  getStudents: async (schoolId, params) => {
    set({ isLoading: true, error: null });
    try {
      const response: PaginatedResponse<User> = await apiClient.getSchoolStudents(schoolId, params);
      set({
        students: response.data,
        studentsPagination: {
          total: response.total,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
        },
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch students',
        isLoading: false,
      });
    }
  },

  createStudent: async (studentData) => {
    set({ isLoading: true, error: null });
    try {
      const newStudent: User = await apiClient.createStudent(studentData);
      set((state) => ({
        students: [newStudent, ...state.students],
        isLoading: false,
      }));
      return newStudent;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to create student',
        isLoading: false,
      });
      throw error;
    }
  },

  getUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const user: User = await apiClient.getUser(id);
      set({
        currentUser: user,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch user',
        isLoading: false,
      });
    }
  },

  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser: User = await apiClient.updateUser(id, userData);
      set((state) => ({
        teachers: state.teachers.map((teacher) =>
          teacher.id === id ? updatedUser : teacher
        ),
        students: state.students.map((student) =>
          student.id === id ? updatedUser : student
        ),
        currentUser: state.currentUser?.id === id ? updatedUser : state.currentUser,
        isLoading: false,
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to update user',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteUser(id);
      set((state) => ({
        teachers: state.teachers.filter((teacher) => teacher.id !== id),
        students: state.students.filter((student) => student.id !== id),
        currentUser: state.currentUser?.id === id ? null : state.currentUser,
        isLoading: false,
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to delete user',
        isLoading: false,
      });
      throw error;
    }
  },

  getClasses: async (schoolId) => {
    set({ isLoading: true, error: null });
    try {
      const classes: Class[] = await apiClient.getSchoolClasses(schoolId);
      set({
        classes,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch classes',
        isLoading: false,
      });
    }
  },

  createClass: async (classData) => {
    set({ isLoading: true, error: null });
    try {
      const newClass: Class = await apiClient.createClass(classData);
      set((state) => ({
        classes: [newClass, ...state.classes],
        isLoading: false,
      }));
      return newClass;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to create class',
        isLoading: false,
      });
      throw error;
    }
  },

  getStats: async (schoolId) => {
    set({ isLoading: true, error: null });
    try {
      const stats: UserManagementStats = await apiClient.getUserManagementStats(schoolId);
      set({
        stats,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch stats',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),

  clearCurrentUser: () => set({ currentUser: null }),
}));
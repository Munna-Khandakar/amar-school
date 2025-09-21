import { create } from 'zustand';
import { apiClient, ApiError, PaginatedResponse } from '@/lib/api-client';

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
  adminId: string;
  isActive: boolean;
  smsQuota: {
    monthlyLimit: number;
    used: number;
    resetDate: string;
  };
  settings: {
    academicYear: string;
    termSystem: 'semester' | 'trimester' | 'quarterly';
    gradeSystem: 'percentage' | 'gpa' | 'letter';
    attendanceThreshold: number;
  };
  allowedDomains: string[];
  createdAt: string;
  updatedAt: string;
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
  settings: {
    academicYear: string;
    termSystem: 'semester' | 'trimester' | 'quarterly';
    gradeSystem: 'percentage' | 'gpa' | 'letter';
    attendanceThreshold: number;
  };
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeStudents: number;
  activeTeachers: number;
  classesWithCapacity: number;
}

interface SchoolsState {
  schools: School[];
  currentSchool: School | null;
  schoolStats: SchoolStats | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
  };

  // Actions
  getSchools: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  createSchool: (schoolData: CreateSchoolData) => Promise<School>;
  getSchool: (id: string) => Promise<void>;
  updateSchool: (id: string, schoolData: Partial<CreateSchoolData>) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
  getSchoolStats: (id: string) => Promise<void>;
  updateSmsQuota: (id: string, quota: number) => Promise<void>;
  clearError: () => void;
  clearCurrentSchool: () => void;
}

export const useSchoolsStore = create<SchoolsState>((set, get) => ({
  schools: [],
  currentSchool: null,
  schoolStats: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1,
  },

  getSchools: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response: PaginatedResponse<School> = await apiClient.getSchools(params);
      set({
        schools: response.data,
        pagination: {
          total: response.total,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
        },
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch schools',
        isLoading: false,
      });
    }
  },

  createSchool: async (schoolData) => {
    set({ isLoading: true, error: null });
    try {
      const newSchool: School = await apiClient.createSchool(schoolData);
      set((state) => ({
        schools: [newSchool, ...state.schools],
        isLoading: false,
      }));
      return newSchool;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to create school',
        isLoading: false,
      });
      throw error;
    }
  },

  getSchool: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const school: School = await apiClient.getSchool(id);
      set({
        currentSchool: school,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch school',
        isLoading: false,
      });
    }
  },

  updateSchool: async (id, schoolData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSchool: School = await apiClient.updateSchool(id, schoolData);
      set((state) => ({
        schools: state.schools.map((school) =>
          school.id === id ? updatedSchool : school
        ),
        currentSchool: state.currentSchool?.id === id ? updatedSchool : state.currentSchool,
        isLoading: false,
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to update school',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteSchool: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteSchool(id);
      set((state) => ({
        schools: state.schools.filter((school) => school.id !== id),
        currentSchool: state.currentSchool?.id === id ? null : state.currentSchool,
        isLoading: false,
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to delete school',
        isLoading: false,
      });
      throw error;
    }
  },

  getSchoolStats: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const stats: SchoolStats = await apiClient.getSchoolStats(id);
      set({
        schoolStats: stats,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch school stats',
        isLoading: false,
      });
    }
  },

  updateSmsQuota: async (id, quota) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.patch(`/schools/${id}/sms-quota`, { monthlyLimit: quota });
      const { getSchool } = get();
      await getSchool(id);
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to update SMS quota',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  clearCurrentSchool: () => set({ currentSchool: null, schoolStats: null }),
}));
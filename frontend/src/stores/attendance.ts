import { create } from 'zustand';
import { apiClient, ApiError } from '@/lib/api-client';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: string;
  notes?: string;
  markedAt: string;
  updatedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
    rollNumber: string;
  };
}

export interface BulkAttendanceData {
  classId: string;
  date: string;
  attendanceRecords: {
    studentId: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
  }[];
}

export interface AttendanceStats {
  studentId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendancePercentage: number;
  student?: {
    firstName: string;
    lastName: string;
    studentId: string;
    rollNumber: string;
  };
}

export interface ClassAttendanceReport {
  classId: string;
  date: string;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  lateStudents: number;
  excusedStudents: number;
  attendancePercentage: number;
  records: AttendanceRecord[];
}

interface AttendanceState {
  attendanceRecords: AttendanceRecord[];
  currentClassAttendance: AttendanceRecord[];
  studentStats: AttendanceStats | null;
  classReport: ClassAttendanceReport | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  markAttendance: (attendanceData: Omit<AttendanceRecord, 'id' | 'markedAt' | 'updatedAt'>) => Promise<AttendanceRecord>;
  markBulkAttendance: (bulkData: BulkAttendanceData) => Promise<AttendanceRecord[]>;
  getAttendance: (params?: {
    studentId?: string;
    classId?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
  getStudentAttendanceStats: (params: {
    studentId: string;
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
  getClassAttendanceReport: (params: {
    classId: string;
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
  updateAttendance: (id: string, attendanceData: Partial<AttendanceRecord>) => Promise<void>;
  deleteAttendance: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  attendanceRecords: [],
  currentClassAttendance: [],
  studentStats: null,
  classReport: null,
  isLoading: false,
  error: null,

  markAttendance: async (attendanceData) => {
    set({ isLoading: true, error: null });
    try {
      const newRecord = await apiClient.markAttendance(attendanceData) as AttendanceRecord;
      set((state) => ({
        attendanceRecords: [newRecord, ...state.attendanceRecords],
        currentClassAttendance: [newRecord, ...state.currentClassAttendance],
        isLoading: false,
      }));
      return newRecord;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to mark attendance',
        isLoading: false,
      });
      throw error;
    }
  },

  markBulkAttendance: async (bulkData) => {
    set({ isLoading: true, error: null });
    try {
      const newRecords = await apiClient.markBulkAttendance(bulkData) as AttendanceRecord[];
      set((state) => ({
        attendanceRecords: [...newRecords, ...state.attendanceRecords],
        currentClassAttendance: newRecords,
        isLoading: false,
      }));
      return newRecords;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to mark bulk attendance',
        isLoading: false,
      });
      throw error;
    }
  },

  getAttendance: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getAttendance(params);
      const records = response.data;
      if (params?.classId) {
        set({
          currentClassAttendance: records,
          isLoading: false,
        });
      } else {
        set({
          attendanceRecords: records,
          isLoading: false,
        });
      }
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch attendance',
        isLoading: false,
      });
    }
  },

  getStudentAttendanceStats: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const stats = await apiClient.getStudentAttendanceStats(params) as AttendanceStats;
      set({
        studentStats: stats,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch attendance stats',
        isLoading: false,
      });
    }
  },

  getClassAttendanceReport: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const report = await apiClient.getClassAttendanceReport(params) as ClassAttendanceReport;
      set({
        classReport: report,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch class attendance report',
        isLoading: false,
      });
    }
  },

  updateAttendance: async (id, attendanceData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedRecord = await apiClient.updateAttendance(id, attendanceData) as AttendanceRecord;
      set((state) => ({
        attendanceRecords: state.attendanceRecords.map((record) =>
          record.id === id ? updatedRecord : record
        ),
        currentClassAttendance: state.currentClassAttendance.map((record) =>
          record.id === id ? updatedRecord : record
        ),
        isLoading: false,
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to update attendance',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteAttendance: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteAttendance(id);
      set((state) => ({
        attendanceRecords: state.attendanceRecords.filter((record) => record.id !== id),
        currentClassAttendance: state.currentClassAttendance.filter((record) => record.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to delete attendance',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
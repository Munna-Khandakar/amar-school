import { create } from 'zustand';
import { apiClient, ApiError } from '@/lib/api-client';

export interface Result {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  subjectCode: string;
  assessmentType: 'quiz' | 'test' | 'midterm' | 'final' | 'project' | 'assignment' | 'practical' | 'oral';
  assessmentName: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  term: 'first' | 'second' | 'third' | 'annual';
  academicYear: string;
  examDate: string;
  remarks?: string;
  isPublished: boolean;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
    rollNumber: string;
  };
}

export interface BulkResultData {
  classId: string;
  subject: string;
  subjectCode: string;
  assessmentType: 'quiz' | 'test' | 'midterm' | 'final' | 'project' | 'assignment' | 'practical' | 'oral';
  assessmentName: string;
  totalMarks: number;
  term: 'first' | 'second' | 'third' | 'annual';
  academicYear: string;
  examDate: string;
  isPublished?: boolean;
  students: {
    studentId: string;
    marksObtained: number;
    remarks?: string;
  }[];
}

export interface StudentReportCard {
  studentId: string;
  term: string;
  academicYear: string;
  results: Result[];
  summary: {
    totalSubjects: number;
    averagePercentage: number;
    overallGPA: number;
    overallGrade: string;
    rank: number;
    totalStudents: number;
  };
  student: {
    firstName: string;
    lastName: string;
    studentId: string;
    rollNumber: string;
    class: string;
  };
}

export interface ClassResults {
  classId: string;
  subject: string;
  term: string;
  academicYear: string;
  results: Result[];
  analytics: {
    totalStudents: number;
    averageMarks: number;
    highestMarks: number;
    lowestMarks: number;
    passCount: number;
    failCount: number;
    gradeDistribution: {
      [grade: string]: number;
    };
  };
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  grade: number;
  credits: number;
  isOptional: boolean;
  markingScheme: {
    theory: number;
    practical: number;
    internal: number;
    external: number;
  };
  gradingCriteria: {
    passPercentage: number;
    maxMarks: number;
    gradeSystem: string;
  };
  teachers: string[];
  schoolId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ResultsState {
  results: Result[];
  currentStudentResults: Result[];
  reportCard: StudentReportCard | null;
  classResults: ClassResults | null;
  subjects: Subject[];
  isLoading: boolean;
  error: string | null;

  // Actions
  createResult: (resultData: Omit<Result, 'id' | 'percentage' | 'grade' | 'gpa' | 'createdAt' | 'updatedAt'>) => Promise<Result>;
  createBulkResults: (bulkData: BulkResultData) => Promise<Result[]>;
  getResults: (params?: {
    studentId?: string;
    classId?: string;
    subject?: string;
    assessmentType?: string;
    term?: string;
    academicYear?: string;
    isPublished?: boolean;
  }) => Promise<void>;
  getStudentReportCard: (params: {
    studentId: string;
    term: string;
    academicYear: string;
    format?: 'json' | 'pdf';
  }) => Promise<void>;
  getClassResults: (params: {
    classId: string;
    subject: string;
    term: string;
    academicYear: string;
    format?: 'json' | 'csv' | 'pdf';
  }) => Promise<void>;
  updateResult: (id: string, resultData: Partial<Result>) => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  createSubject: (subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Subject>;
  getSubjects: (schoolId: string, grade?: number) => Promise<void>;
  clearError: () => void;
}

export const useResultsStore = create<ResultsState>((set) => ({
  results: [],
  currentStudentResults: [],
  reportCard: null,
  classResults: null,
  subjects: [],
  isLoading: false,
  error: null,

  createResult: async (resultData) => {
    set({ isLoading: true, error: null });
    try {
      const newResult: Result = await apiClient.createResult(resultData);
      set((state) => ({
        results: [newResult, ...state.results],
        currentStudentResults: resultData.studentId === newResult.studentId
          ? [newResult, ...state.currentStudentResults]
          : state.currentStudentResults,
        isLoading: false,
      }));
      return newResult;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to create result',
        isLoading: false,
      });
      throw error;
    }
  },

  createBulkResults: async (bulkData) => {
    set({ isLoading: true, error: null });
    try {
      const newResults: Result[] = await apiClient.createBulkResults(bulkData);
      set((state) => ({
        results: [...newResults, ...state.results],
        isLoading: false,
      }));
      return newResults;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to create bulk results',
        isLoading: false,
      });
      throw error;
    }
  },

  getResults: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getResults(params);
      const results = response.data;
      if (params?.studentId) {
        set({
          currentStudentResults: results,
          isLoading: false,
        });
      } else {
        set({
          results,
          isLoading: false,
        });
      }
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch results',
        isLoading: false,
      });
    }
  },

  getStudentReportCard: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const reportCard: StudentReportCard = await apiClient.getStudentReportCard(params);
      set({
        reportCard,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch report card',
        isLoading: false,
      });
    }
  },

  getClassResults: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const classResults: ClassResults = await apiClient.getClassResults(params);
      set({
        classResults,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch class results',
        isLoading: false,
      });
    }
  },

  updateResult: async (id, resultData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedResult: Result = await apiClient.updateResult(id, resultData);
      set((state) => ({
        results: state.results.map((result) =>
          result.id === id ? updatedResult : result
        ),
        currentStudentResults: state.currentStudentResults.map((result) =>
          result.id === id ? updatedResult : result
        ),
        isLoading: false,
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to update result',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteResult: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteResult(id);
      set((state) => ({
        results: state.results.filter((result) => result.id !== id),
        currentStudentResults: state.currentStudentResults.filter((result) => result.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to delete result',
        isLoading: false,
      });
      throw error;
    }
  },

  createSubject: async (subjectData) => {
    set({ isLoading: true, error: null });
    try {
      const newSubject: Subject = await apiClient.createSubject(subjectData);
      set((state) => ({
        subjects: [newSubject, ...state.subjects],
        isLoading: false,
      }));
      return newSubject;
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to create subject',
        isLoading: false,
      });
      throw error;
    }
  },

  getSubjects: async (schoolId, grade) => {
    set({ isLoading: true, error: null });
    try {
      const subjects: Subject[] = await apiClient.getSubjects(schoolId, grade);
      set({
        subjects,
        isLoading: false,
      });
    } catch (error) {
      const apiError = error as ApiError;
      set({
        error: apiError.message || 'Failed to fetch subjects',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { User, CreateTeacherData, CreateStudentData, UpdateUserData, Class, UserRole } from '@/lib/types';
import { useAuthStore } from '@/stores/auth';

interface UseUsersReturn {
  teachers: User[];
  students: User[];
  classes: Class[];
  isLoading: boolean;
  error: string | null;
  createTeacher: (data: CreateTeacherData) => Promise<User>;
  createStudent: (data: CreateStudentData) => Promise<User>;
  updateUser: (id: string, data: UpdateUserData) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  toggleUserStatus: (id: string, isActive: boolean) => Promise<User>;
  refreshTeachers: () => Promise<void>;
  refreshStudents: () => Promise<void>;
  refreshClasses: () => Promise<void>;
}

export function useUsers(): UseUsersReturn {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const schoolId = user?.schoolId;

  const fetchTeachers = useCallback(async () => {
    if (!schoolId) return;

    try {
      setError(null);
      const response = await apiClient.getSchoolTeachers(schoolId, { limit: 100 });
      setTeachers(response.data || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch teachers';
      setError(errorMessage);
      console.error('Error fetching teachers:', err);
    }
  }, [schoolId]);

  const fetchStudents = useCallback(async () => {
    if (!schoolId) return;

    try {
      setError(null);
      const response = await apiClient.getSchoolStudents(schoolId, { limit: 100 });
      setStudents(response.data || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch students';
      setError(errorMessage);
      console.error('Error fetching students:', err);
    }
  }, [schoolId]);

  const fetchClasses = useCallback(async () => {
    if (!schoolId) return;

    try {
      setError(null);
      const response = await apiClient.getSchoolClasses(schoolId);
      setClasses(response || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch classes';
      setError(errorMessage);
      console.error('Error fetching classes:', err);
    }
  }, [schoolId]);

  const fetchAllData = useCallback(async () => {
    if (!schoolId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      await Promise.all([
        fetchTeachers(),
        fetchStudents(),
        fetchClasses(),
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [schoolId, fetchTeachers, fetchStudents, fetchClasses]);

  const createTeacher = async (data: CreateTeacherData): Promise<User> => {
    try {
      setError(null);
      const newTeacher = await apiClient.createTeacher({
        ...data,
        schoolId: schoolId!,
      });
      setTeachers(prev => [...prev, newTeacher]);
      return newTeacher;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create teacher';
      setError(errorMessage);
      throw err;
    }
  };

  const createStudent = async (data: CreateStudentData): Promise<User> => {
    try {
      setError(null);
      const newStudent = await apiClient.createStudent({
        ...data,
        schoolId: schoolId!,
      });
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create student';
      setError(errorMessage);
      throw err;
    }
  };

  const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
    try {
      setError(null);
      const updatedUser = await apiClient.updateUser(id, data);

      // Update in the appropriate array based on role
      if (updatedUser.role === UserRole.TEACHER) {
        setTeachers(prev => prev.map(teacher =>
          teacher.id === id ? updatedUser : teacher
        ));
      } else if (updatedUser.role === UserRole.STUDENT) {
        setStudents(prev => prev.map(student =>
          student.id === id ? updatedUser : student
        ));
      }

      return updatedUser;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    try {
      setError(null);
      await apiClient.deleteUser(id);

      // Remove from both arrays (we don't know which one it's in)
      setTeachers(prev => prev.filter(teacher => teacher.id !== id));
      setStudents(prev => prev.filter(student => student.id !== id));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      throw err;
    }
  };

  const toggleUserStatus = async (id: string, isActive: boolean): Promise<User> => {
    return updateUser(id, { isActive });
  };

  const refreshTeachers = async () => {
    await fetchTeachers();
  };

  const refreshStudents = async () => {
    await fetchStudents();
  };

  const refreshClasses = async () => {
    await fetchClasses();
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    teachers,
    students,
    classes,
    isLoading,
    error,
    createTeacher,
    createStudent,
    updateUser,
    deleteUser,
    toggleUserStatus,
    refreshTeachers,
    refreshStudents,
    refreshClasses,
  };
}
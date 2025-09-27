import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { School, CreateSchoolData, UpdateSchoolData } from '@/lib/types';

interface UseSchoolsReturn {
  schools: School[];
  isLoading: boolean;
  error: string | null;
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  createSchool: (data: CreateSchoolData) => Promise<School>;
  updateSchool: (id: string, data: UpdateSchoolData) => Promise<School>;
  deleteSchool: (id: string) => Promise<void>;
  toggleSchoolStatus: (id: string, isActive: boolean) => Promise<School>;
  refreshSchools: () => Promise<void>;
}

export function useSchools(): UseSchoolsReturn {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getSchools();
      setSchools(response.data || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch schools';
      setError(errorMessage);
      console.error('Error fetching schools:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createSchool = async (data: CreateSchoolData): Promise<School> => {
    try {
      setError(null);
      const newSchool = await apiClient.createSchool(data);
      setSchools(prev => [...prev, newSchool]);
      return newSchool;
    } catch (err: unknown) {
      throw err;
    }
  };

  const updateSchool = async (id: string, data: UpdateSchoolData): Promise<School> => {
    try {
      setError(null);
      const updatedSchool = await apiClient.updateSchool(id, data);
      setSchools(prev => prev.map(school =>
        school.id === id ? updatedSchool : school
      ));
      return updatedSchool;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update school';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteSchool = async (id: string): Promise<void> => {
    try {
      setError(null);
      await apiClient.deleteSchool(id);
      setSchools(prev => prev.filter(school => school.id !== id));
    } catch (err: unknown) {
      throw err;
    }
  };

  const toggleSchoolStatus = async (id: string, isActive: boolean): Promise<School> => {
    return updateSchool(id, { isActive });
  };

  const refreshSchools = async () => {
    await fetchSchools();
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // Calculate totals
  const totalSchools = schools.length;
  const totalStudents = schools.reduce((sum, school) => sum + (school.stats?.totalStudents || 0), 0);
  const totalTeachers = schools.reduce((sum, school) => sum + (school.stats?.totalTeachers || 0), 0);

  return {
    schools,
    isLoading,
    error,
    totalSchools,
    totalStudents,
    totalTeachers,
    createSchool,
    updateSchool,
    deleteSchool,
    toggleSchoolStatus,
    refreshSchools,
  };
}
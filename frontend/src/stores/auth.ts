import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginData } from '@/lib/types';
import { apiClient, ApiError } from '@/lib/api-client';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.login(data);
          set({
            user: response.user,
            token: response.token,
            isLoading: false,
          });
        } catch (error: unknown) {
          const apiError = error as ApiError;
          set({
            error: apiError.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
        apiClient.logout();
      },

      clearError: () => set({ error: null }),

      refreshToken: async () => {
        try {
          const response = await apiClient.refreshToken();
          set({ token: response.token });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
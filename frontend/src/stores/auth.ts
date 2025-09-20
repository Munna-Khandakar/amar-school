import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse, LoginData } from '@/lib/types';
import { authApi } from '@/lib/api';

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
          const response: AuthResponse = await authApi.login(data);
          set({
            user: response.user,
            token: response.access_token,
            isLoading: false,
          });
          localStorage.setItem('token', response.access_token);
        } catch (error: unknown) {
          const errorMessage = error && typeof error === 'object' && 'response' in error
            ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed')
            : 'Login failed';
          
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },

      clearError: () => set({ error: null }),

      refreshToken: async () => {
        try {
          const response = await authApi.refresh();
          set({ token: response.access_token });
          localStorage.setItem('token', response.access_token);
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
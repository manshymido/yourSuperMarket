import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api-client';

interface User {
  id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  token: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      loading: true,
      token: null,
      refreshToken: null,

      setTokens: (accessToken: string, refreshToken: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }
        set({ token: accessToken, refreshToken });
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user, loading: false });
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
          loading: false,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        
        if (typeof window === 'undefined') {
          set({ loading: false });
          return;
        }

        // Get token from localStorage if not in state
        const storedToken = token || localStorage.getItem('accessToken');
        
        if (!storedToken) {
          set({ isAuthenticated: false, user: null, loading: false });
          return;
        }

        // If we have a user and token, assume authenticated (avoid unnecessary API call)
        if (get().user && storedToken) {
          set({ isAuthenticated: true, loading: false });
          return;
        }

        // Verify token by fetching user profile
        set({ loading: true });
        try {
          const response = await apiClient.get('/users/profile');
          set({
            isAuthenticated: true,
            user: response.data,
            token: storedToken,
            loading: false,
          });
        } catch (error) {
          // Token is invalid or expired
          get().clearAuth();
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        
        try {
          if (refreshToken) {
            await apiClient.post('/auth/logout', { refreshToken });
          }
        } catch (error) {
          // Continue with logout even if API call fails
          console.error('Logout error:', error);
        } finally {
          get().clearAuth();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        // Don't persist user data, fetch it on mount
      }),
    }
  )
);

// Helper function for logout with redirect
export const logoutAndRedirect = async (router: any) => {
  const { logout } = useAuthStore.getState();
  await logout();
  router.push('/login');
};

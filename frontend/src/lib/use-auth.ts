'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from './store/auth-store';

export function useAuth() {
  const pathname = usePathname();
  const {
    isAuthenticated,
    user,
    loading,
    checkAuth,
    logout,
  } = useAuthStore();

  // Check auth on mount and route changes
  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  return {
    isAuthenticated,
    user,
    loading,
    logout,
  };
}

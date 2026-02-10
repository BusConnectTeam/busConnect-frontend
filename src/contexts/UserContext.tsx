'use client';

// Backward compatibility — use AuthContext and useAuth() for new code
import { useAuth } from './AuthContext';
import { User } from '@/types';

export function useCurrentUser() {
  const { user, updateUser, isLoading, logout } = useAuth();

  return {
    currentUser: user,
    setCurrentUser: (newUser: User | null) => {
      if (newUser) {
        updateUser(newUser);
      } else {
        logout();
      }
    },
    isLoading,
  };
}

export { AuthProvider as UserProvider } from './AuthContext';

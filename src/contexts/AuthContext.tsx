'use client';

import { AuthResponse, User } from '@/types';
import { authApi } from '@/lib/api/auth';
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
} from '@/lib/api/client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'busconnect_current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = getStoredToken();
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as User);

        authApi.getMe()
          .then((freshUser) => {
            setUser(freshUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
          })
          .catch(() => {
            removeStoredToken();
            localStorage.removeItem(USER_STORAGE_KEY);
            setToken(null);
            setUser(null);
          })
          .finally(() => setIsLoading(false));
      } else {
        removeStoredToken();
        localStorage.removeItem(USER_STORAGE_KEY);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
      removeStoredToken();
      localStorage.removeItem(USER_STORAGE_KEY);
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((authResponse: AuthResponse) => {
    setStoredToken(authResponse.token);
    setToken(authResponse.token);

    authApi.getMe()
      .then((fullUser) => {
        setUser(fullUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fullUser));
      })
      .catch(() => {
        const partialUser = {
          id: 0,
          email: authResponse.email,
          firstName: authResponse.firstName,
          lastName: authResponse.lastName,
          phone: null,
          role: authResponse.role,
          active: true,
          createdAt: authResponse.issuedAt,
          updatedAt: authResponse.issuedAt,
        } as User;
        setUser(partialUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(partialUser));
      });
  }, []);

  const logout = useCallback(() => {
    removeStoredToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

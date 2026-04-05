'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { AuthApi } from '@/lib/auth';
import { tokenStorage } from '@/lib/token-storage';

type Role = 'USER' | 'REVIEWER' | 'ADMIN' | 'REGISTRAR';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // 🔥 المصدر الوحيد للـ token
  const token = tokenStorage.getAccessToken();

  /**
   * Restore session
   */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser && token) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        tokenStorage.clear();
      }
    }

    setIsLoading(false);
  }, []);

  /**
   * LOGIN
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const res = await AuthApi.login({ email, password });

      const user: User = res.data?.data?.user;
      const tokens = res.data?.data?.tokens;

      if (!user || !tokens?.accessToken) {
        throw new Error('Invalid login response');
      }

      // 🔥 التخزين في مكان واحد فقط
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);

      redirectByRole(user.role);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * REGISTER
   */
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);

    try {
      await AuthApi.register({ name, email, password });
      router.replace('/login');
    } catch (error) {
      console.error('Register failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * LOGOUT
   */
  const logout = async () => {
    try {
      await AuthApi.logout();
    } catch {}

    tokenStorage.clear();
    setUser(null);

    router.replace('/login');
  };

  /**
   * Role redirect
   */
  const redirectByRole = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        router.replace('/admin/dashboard');
        break;
      case 'REVIEWER':
        router.replace('/reviewer/dashboard');
        break;
      case 'REGISTRAR':
        router.replace('/registrar/dashboard');
        break;
      default:
        router.replace('/dashboard');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

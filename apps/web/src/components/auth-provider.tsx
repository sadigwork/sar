'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { AuthApi } from '@/app/api/auth';

type Role = 'user' | 'reviewer' | 'admin' | 'registrar';

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
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

  /**
   * Restore session on page refresh
   */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
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
      const res = await AuthApi.login({
        email,
        password,
      });

      const user: User = res.user;

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
      await AuthApi.register({
        name,
        email,
        password,
      });

      router.push('/login');
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

    localStorage.removeItem('user');

    setUser(null);

    router.push('/login');
  };

  /**
   * Role based redirect
   */
  const redirectByRole = (role: Role) => {
    if (role === 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    if (role === 'reviewer') {
      router.push('/reviewer/dashboard');
      return;
    }

    if (role === 'registrar') {
      router.push('/registrar/dashboard');
      return;
    }

    router.push('/dashboard');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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

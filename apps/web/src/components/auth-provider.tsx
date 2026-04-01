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
  setToken: (token: string | null) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  /**
   * Restore session on refresh
   */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');

    if (storedUser && storedToken) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        // redirectByRole(parsedUser.role); // Redirect immediately if already logged in
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
      const res = await AuthApi.login({
        email,
        password,
      });
      console.log('LOGIN RESPONSE', res);

      // ⚡ تحديث الوصول للبنية الجديدة
      const user: User = res.data?.data?.user;
      const tokens = res.data?.data?.tokens;

      if (!user || !tokens?.accessToken) {
        console.error('Login successful but invalid response', res);
        throw new Error('Invalid login response');
      }

      // حفظ البيانات في localStorage و tokenStorage
      localStorage.setItem('user', JSON.stringify(user));
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);

      setUser(user);
      setToken(tokens.accessToken);

      redirectByRole(user.role);
      console.log('تم تسجيل الدخول بنجاح!');
    } catch (error) {
      console.error('Login failed', error);
      console.log(error || 'Login failed');
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
    setToken(null);

    router.replace('/login');
  };

  /**
   * Role based redirect
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
        setToken,
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

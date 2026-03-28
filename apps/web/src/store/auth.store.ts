import { create } from 'zustand';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;

  setAuth: (data: { user: User; accessToken: string }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  setAuth: ({ user, accessToken }) => {
    localStorage.setItem('accessToken', accessToken);

    // 👇 مهم للميدل وير
    document.cookie = `accessToken=${accessToken}; path=/`;

    set({
      user,
      accessToken,
    });
  },

  logout: () => {
    localStorage.removeItem('accessToken');

    document.cookie = 'accessToken=; Max-Age=0; path=/';

    set({
      user: null,
      accessToken: null,
    });

    window.location.href = '/login';
  },
}));

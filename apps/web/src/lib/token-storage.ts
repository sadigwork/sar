const isBrowser = typeof window !== 'undefined';

export const tokenStorage = {
  getAccessToken: () => {
    if (!isBrowser) return null;
    return localStorage.getItem('accessToken');
  },

  getRefreshToken: () => {
    if (!isBrowser) return null;
    return localStorage.getItem('refreshToken');
  },

  setTokens: (accessToken: string, refreshToken: string) => {
    if (!isBrowser) return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  clear: () => {
    if (!isBrowser) return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

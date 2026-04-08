'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
// import { AuthProvider } from '@/context/AuthContext';
import { AuthProvider } from '@/components/auth-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

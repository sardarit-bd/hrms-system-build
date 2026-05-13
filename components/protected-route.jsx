'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (requiredRole && user.role !== requiredRole) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-slate-950">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary dark:bg-blue-600 rounded-full mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-foreground dark:text-white font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}

'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { PageLoader } from '@/components/ui/LoadingSpinner';

/**
 * PublicRoute is for pages like Login and Register.
 * If the user is already logged in, they should be redirected to the Dashboard.
 */
export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (!loading && user) {
      router.push(redirect);
    }
  }, [user, loading, router, redirect]);

  if (loading) {
    return <PageLoader />;
  }

  // If user exists, we don't render children because we're redirecting
  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { PageLoader } from '@/components/ui/LoadingSpinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to home (landing page) as per requirement #4
      router.push(`/?redirect=${pathname}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

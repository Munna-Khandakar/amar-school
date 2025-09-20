'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { UserRole } from '@/lib/types';

export default function DashboardRedirect() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Redirect to role-specific dashboard
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        router.push('/dashboard/super-admin');
        break;
      case UserRole.SCHOOL_ADMIN:
        router.push('/dashboard/school-admin');
        break;
      case UserRole.TEACHER:
        router.push('/dashboard/teacher');
        break;
      case UserRole.STUDENT:
        router.push('/dashboard/student');
        break;
      default:
        router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}
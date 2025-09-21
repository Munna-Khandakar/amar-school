'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    // If authentication is required but user is not logged in
    if (requireAuth && (!user || !token)) {
      router.push('/login');
      return;
    }

    // If user is logged in but doesn't have required role
    if (requireAuth && user && allowedRoles.length > 0 && !allowedRoles.includes(user.role as UserRole)) {
      // Redirect to appropriate dashboard based on their actual role
      const userDashboard = getDashboardPath(user.role);
      router.push(userDashboard);
      return;
    }

    // If user is logged in and accessing login page, redirect to dashboard
    if (!requireAuth && user && token) {
      const userDashboard = getDashboardPath(user.role);
      router.push(userDashboard);
      return;
    }
  }, [user, token, allowedRoles, requireAuth, router]);

  // Show loading or nothing while redirecting
  if (requireAuth && (!user || !token)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show unauthorized message if user doesn't have required role
  if (requireAuth && user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
          <p className="text-lg text-gray-600 mb-8">You don&apos;t have permission to access this page.</p>
          <button 
            onClick={() => router.push(getDashboardPath(user.role))}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function getDashboardPath(role: UserRole | string): string {
  // Handle both enum values and string values
  const roleString = typeof role === 'string' ? role : role;

  switch (roleString) {
    case UserRole.SUPER_ADMIN:
    case 'super_admin':
      return '/dashboard/super-admin';
    case UserRole.SCHOOL_ADMIN:
    case 'school_admin':
      return '/dashboard/school-admin';
    case UserRole.TEACHER:
    case 'teacher':
      return '/dashboard/teacher';
    case UserRole.STUDENT:
    case 'student':
      return '/dashboard/student';
    default:
      return '/login';
  }
}
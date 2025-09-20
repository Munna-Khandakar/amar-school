'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  userRole: UserRole;
}

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export default function DashboardLayout({ children, title, userRole }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigationItems = getNavigationItems(userRole);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              ☰
            </button>
            <h1 className="text-xl font-bold text-gray-900">Amar School</h1>
            <span className="text-sm text-gray-500">|</span>
            <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{user?.firstName} {user?.lastName}</span>
              <span className="block text-xs text-gray-500 capitalize">
                {user?.role.replace('_', ' ')}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-white shadow-sm border-r min-h-screen`}>
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function getNavigationItems(role: UserRole): NavItem[] {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return [
        { label: 'Dashboard', path: '/dashboard/super-admin', icon: '📊' },
        { label: 'Schools', path: '/dashboard/super-admin/schools', icon: '🏫' },
        { label: 'School Admins', path: '/dashboard/super-admin/admins', icon: '👨‍💼' },
        { label: 'Analytics', path: '/dashboard/super-admin/analytics', icon: '📈' },
        { label: 'SMS Usage', path: '/dashboard/super-admin/sms', icon: '💬' },
      ];
    
    case UserRole.SCHOOL_ADMIN:
      return [
        { label: 'Dashboard', path: '/dashboard/school-admin', icon: '📊' },
        { label: 'Teachers', path: '/dashboard/school-admin/teachers', icon: '👨‍🏫' },
        { label: 'Students', path: '/dashboard/school-admin/students', icon: '🎓' },
        { label: 'Classes', path: '/dashboard/school-admin/classes', icon: '📚' },
        { label: 'Reports', path: '/dashboard/school-admin/reports', icon: '📋' },
        { label: 'SMS Settings', path: '/dashboard/school-admin/sms', icon: '💬' },
        { label: 'School Settings', path: '/dashboard/school-admin/settings', icon: '⚙️' },
      ];
    
    case UserRole.TEACHER:
      return [
        { label: 'Dashboard', path: '/dashboard/teacher', icon: '📊' },
        { label: 'My Classes', path: '/dashboard/teacher/classes', icon: '📚' },
        { label: 'Attendance', path: '/dashboard/teacher/attendance', icon: '✅' },
        { label: 'Results', path: '/dashboard/teacher/results', icon: '📝' },
        { label: 'Students', path: '/dashboard/teacher/students', icon: '🎓' },
        { label: 'Reports', path: '/dashboard/teacher/reports', icon: '📋' },
      ];
    
    case UserRole.STUDENT:
      return [
        { label: 'Dashboard', path: '/dashboard/student', icon: '📊' },
        { label: 'My Attendance', path: '/dashboard/student/attendance', icon: '✅' },
        { label: 'My Results', path: '/dashboard/student/results', icon: '📝' },
        { label: 'Schedule', path: '/dashboard/student/schedule', icon: '📅' },
        { label: 'Reports', path: '/dashboard/student/reports', icon: '📋' },
        { label: 'Profile', path: '/dashboard/student/profile', icon: '👤' },
      ];
    
    default:
      return [];
  }
}
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Amar School</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push('/login')}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
              School Management
              <span className="block text-blue-600">Made Simple</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Comprehensive multi-tenant school management system with role-based access control,
              attendance tracking, results management, and SMS notifications.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Button size="lg" onClick={() => router.push('/login')}>
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Everything you need to manage your school
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features designed for modern educational institutions
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">👥 User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage students, teachers, and administrators with role-based access control
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 Attendance Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Real-time attendance marking with automated SMS notifications to parents
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📈 Results Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive exam results tracking with analytics and report generation
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🏫 Multi-Tenant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Support multiple schools with complete data isolation and security
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* User Roles Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Built for Every Role
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tailored interfaces for different user types
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-600">🔑 Super Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Platform-wide management, school oversight, and system analytics
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">🏫 School Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Complete school operations, user management, and SMS configuration
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">👨‍🏫 Teacher</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Attendance marking, results entry, and student progress tracking
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-orange-600">🎓 Student</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  View attendance, results, schedules, and download reports
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Amar School</h3>
            <p className="mt-2 text-gray-600">
              Modern school management system built with love
            </p>
            <div className="mt-8 flex justify-center space-x-6">
              <Button variant="ghost" onClick={() => router.push('/login')}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </ProtectedRoute>
  );
}

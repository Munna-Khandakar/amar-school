'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SuperAdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
      <DashboardLayout title="Super Admin Dashboard" userRole={UserRole.SUPER_ADMIN}>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Welcome, Super Admin!</h1>
            <p className="text-purple-100">
              Manage all schools and monitor platform-wide activities from this central dashboard.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                <span className="text-2xl">🏫</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-600">+2 new this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <span className="text-2xl">👥</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-gray-600">+184 new this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Schools</CardTitle>
                <span className="text-2xl">✅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">11</div>
                <p className="text-xs text-gray-600">91.7% uptime</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SMS Sent</CardTitle>
                <span className="text-2xl">💬</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8,942</div>
                <p className="text-xs text-gray-600">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">➕</span>
                  Add New School
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">👨‍💼</span>
                  Create School Admin
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">📊</span>
                  View Platform Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">💬</span>
                  Monitor SMS Usage
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New school &quot;Green Valley High&quot; added</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">School admin created for &quot;Sunrise Academy&quot;</p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">SMS limit reached for &quot;Oak Tree School&quot;</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schools Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Schools Overview</CardTitle>
              <CardDescription>Monitor all schools in the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Placeholder for schools list */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <h4 className="font-semibold">School Name {i}</h4>
                      <p className="text-sm text-gray-600">Students: 245 | Teachers: 18</p>
                      <p className="text-sm text-gray-600">Status: Active</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  View All Schools
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SchoolAdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.SCHOOL_ADMIN]}>
      <DashboardLayout title="School Admin Dashboard" userRole={UserRole.SCHOOL_ADMIN}>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Welcome, School Administrator!</h1>
            <p className="text-blue-100">
              Manage your school operations, users, and monitor academic activities.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <span className="text-2xl">🎓</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-gray-600">+12 new admissions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <span className="text-2xl">👨‍🏫</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-gray-600">2 new hires</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Classes</CardTitle>
                <span className="text-2xl">📚</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-600">Grades 1-12</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <span className="text-2xl">✅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-gray-600">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common school management tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">👨‍🏫</span>
                  Add Teacher
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">🎓</span>
                  Add Student
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">📚</span>
                  Create Class
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">📊</span>
                  View Reports
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Summary</CardTitle>
                <CardDescription>Current day overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Present Students</span>
                    <span className="text-sm font-medium">231/245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Teachers</span>
                    <span className="text-sm font-medium">18/18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Classes in Session</span>
                    <span className="text-sm font-medium">8/12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">SMS Sent Today</span>
                    <span className="text-sm font-medium">42</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities & Notifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest school activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New student John Doe enrolled in Grade 9</p>
                      <p className="text-xs text-gray-500">30 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Teacher Sarah updated Grade 10 results</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Attendance marked for all classes</p>
                      <p className="text-xs text-gray-500">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Class Overview</CardTitle>
                <CardDescription>Current class status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Grade 1', 'Grade 2', 'Grade 3'].map((grade, i) => (
                    <div key={grade} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{grade}</h4>
                        <p className="text-sm text-gray-600">Students: {20 + i * 5} | Teacher: Mrs. Smith</p>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        95% Attendance
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Classes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
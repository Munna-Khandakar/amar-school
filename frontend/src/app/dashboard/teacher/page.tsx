'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TeacherDashboard() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
      <DashboardLayout title="Teacher Dashboard" userRole={UserRole.TEACHER}>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Welcome, Teacher!</h1>
            <p className="text-green-100">
              Manage your classes, track attendance, and update student results efficiently.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Classes</CardTitle>
                <span className="text-2xl">📚</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-gray-600">Grade 8, 9, 10</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <span className="text-2xl">🎓</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87</div>
                <p className="text-xs text-gray-600">Across all classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today&apos;s Attendance</CardTitle>
                <span className="text-2xl">✅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92.3%</div>
                <p className="text-xs text-gray-600">80/87 present</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Results</CardTitle>
                <span className="text-2xl">📝</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-gray-600">Need to submit</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common teaching tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">✅</span>
                  Mark Attendance
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">📝</span>
                  Enter Results
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">🎓</span>
                  View Students
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">📊</span>
                  Generate Reports
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Schedule</CardTitle>
                <CardDescription>Your classes for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <div>
                      <p className="font-medium">Grade 8 - Mathematics</p>
                      <p className="text-sm text-gray-600">9:00 AM - 10:00 AM</p>
                    </div>
                    <span className="text-sm text-blue-600">Active</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Grade 9 - Mathematics</p>
                      <p className="text-sm text-gray-600">11:00 AM - 12:00 PM</p>
                    </div>
                    <span className="text-sm text-gray-600">Upcoming</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Grade 10 - Mathematics</p>
                      <p className="text-sm text-gray-600">2:00 PM - 3:00 PM</p>
                    </div>
                    <span className="text-sm text-gray-600">Upcoming</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Class Overview */}
          <Card>
            <CardHeader>
              <CardTitle>My Classes Overview</CardTitle>
              <CardDescription>Overview of all your assigned classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { grade: 'Grade 8', subject: 'Mathematics', students: 28, attendance: '96%' },
                  { grade: 'Grade 9', subject: 'Mathematics', students: 30, attendance: '94%' },
                  { grade: 'Grade 10', subject: 'Mathematics', students: 29, attendance: '88%' },
                ].map((classInfo, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-lg">{classInfo.grade}</h4>
                    <p className="text-gray-600">{classInfo.subject}</p>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Students:</span>
                        <span className="font-medium">{classInfo.students}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg. Attendance:</span>
                        <span className="font-medium text-green-600">{classInfo.attendance}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Attendance
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Results
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your recent teaching activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Marked attendance for Grade 8 Mathematics</p>
                    <p className="text-xs text-gray-500">30 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Updated test results for Grade 9</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">SMS sent to 5 parents about attendance</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
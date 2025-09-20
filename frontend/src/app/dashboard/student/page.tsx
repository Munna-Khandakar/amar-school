'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function StudentDashboard() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <DashboardLayout title="Student Dashboard" userRole={UserRole.STUDENT}>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Welcome, Student!</h1>
            <p className="text-orange-100">
              Track your attendance, view results, and monitor your academic progress.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Class</CardTitle>
                <span className="text-2xl">📚</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Grade 10</div>
                <p className="text-xs text-gray-600">Section A</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <span className="text-2xl">✅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.5%</div>
                <p className="text-xs text-gray-600">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
                <span className="text-2xl">📊</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">A-</div>
                <p className="text-xs text-gray-600">85.6% average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
                <span className="text-2xl">📝</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-gray-600">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common student activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">✅</span>
                  View Attendance
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">📝</span>
                  Check Results
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">📅</span>
                  View Schedule
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <span className="mr-2">📋</span>
                  Download Reports
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
                      <p className="font-medium">Mathematics</p>
                      <p className="text-sm text-gray-600">9:00 AM - 10:00 AM</p>
                    </div>
                    <span className="text-sm text-blue-600">Now</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">English</p>
                      <p className="text-sm text-gray-600">10:15 AM - 11:15 AM</p>
                    </div>
                    <span className="text-sm text-gray-600">Next</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Science</p>
                      <p className="text-sm text-gray-600">11:30 AM - 12:30 PM</p>
                    </div>
                    <span className="text-sm text-gray-600">Later</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Academic Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
                <CardDescription>Your latest test scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { subject: 'Mathematics', score: '92%', grade: 'A', date: '2 days ago' },
                    { subject: 'English', score: '88%', grade: 'B+', date: '1 week ago' },
                    { subject: 'Science', score: '95%', grade: 'A+', date: '2 weeks ago' },
                  ].map((result, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{result.subject}</h4>
                        <p className="text-sm text-gray-600">{result.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{result.score}</p>
                        <p className="text-sm text-gray-600">Grade: {result.grade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
                <CardDescription>Your attendance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="text-sm font-medium text-green-600">5/5 Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="text-sm font-medium text-green-600">19/20 Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Semester</span>
                    <span className="text-sm font-medium text-green-600">85/90 Days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '94.5%' }}></div>
                  </div>
                  <p className="text-sm text-center text-gray-600">94.5% Overall Attendance</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Announcements & Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>School Announcements</CardTitle>
              <CardDescription>Latest updates from your school</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Annual Sports Day scheduled for next Friday</p>
                    <p className="text-xs text-gray-500">Please bring your sports uniform and water bottle</p>
                    <p className="text-xs text-gray-400">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Monthly test results are now available</p>
                    <p className="text-xs text-gray-500">Check your results section for detailed scores</p>
                    <p className="text-xs text-gray-400">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Library hours extended during exam week</p>
                    <p className="text-xs text-gray-500">Open until 8 PM from Monday to Friday</p>
                    <p className="text-xs text-gray-400">2 days ago</p>
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
'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ReportsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.SCHOOL_ADMIN]}>
      <DashboardLayout title="Reports & Analytics" userRole={UserRole.SCHOOL_ADMIN}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports &amp; Analytics</h1>
              <p className="text-gray-600">Generate and view various school reports</p>
            </div>
            <div className="flex space-x-3">
              <Select defaultValue="current">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                Export All
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <span className="text-2xl">📊</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-green-600">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Marks</CardTitle>
                <span className="text-2xl">📈</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.5%</div>
                <p className="text-xs text-green-600">+1.8% from last term</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SMS Sent</CardTitle>
                <span className="text-2xl">💬</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">847</div>
                <p className="text-xs text-blue-600">153 remaining</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
                <span className="text-2xl">⚠️</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-red-600">Require attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Report Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Attendance Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-xl">📊</span>
                  <span>Attendance Reports</span>
                </CardTitle>
                <CardDescription>
                  Generate attendance reports for students and classes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Daily Attendance Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Monthly Attendance Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Student Attendance History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Class-wise Attendance
                </Button>
              </CardContent>
            </Card>

            {/* Academic Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-xl">📚</span>
                  <span>Academic Reports</span>
                </CardTitle>
                <CardDescription>
                  Track academic performance and results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Class Results Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Subject Performance
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Student Progress Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Grade Distribution
                </Button>
              </CardContent>
            </Card>

            {/* Student Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-xl">🎓</span>
                  <span>Student Reports</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive student information and records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Student Directory
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Enrollment Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Student Demographics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Parent Contact List
                </Button>
              </CardContent>
            </Card>

            {/* Teacher Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-xl">👨‍🏫</span>
                  <span>Teacher Reports</span>
                </CardTitle>
                <CardDescription>
                  Teacher performance and workload analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Teacher Directory
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Class Assignments
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Workload Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Teaching Schedule
                </Button>
              </CardContent>
            </Card>

            {/* Financial Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-xl">💰</span>
                  <span>Financial Reports</span>
                </CardTitle>
                <CardDescription>
                  Fee collection and financial summaries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Fee Collection Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Outstanding Dues
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Monthly Revenue
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Payment History
                </Button>
              </CardContent>
            </Card>

            {/* Communication Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-xl">💬</span>
                  <span>Communication Reports</span>
                </CardTitle>
                <CardDescription>
                  SMS usage and communication analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  SMS Usage Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Message History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Parent Communication
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Notification Logs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Recently generated reports and downloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Monthly Attendance Report - January 2024', type: 'Attendance', date: '2024-01-31', size: '2.3 MB' },
                  { name: 'Grade 10 Result Summary', type: 'Academic', date: '2024-01-28', size: '1.8 MB' },
                  { name: 'Teacher Directory Report', type: 'Staff', date: '2024-01-25', size: '956 KB' },
                  { name: 'SMS Usage Report - January', type: 'Communication', date: '2024-01-24', size: '445 KB' },
                  { name: 'Student Demographics Report', type: 'Student', date: '2024-01-20', size: '1.2 MB' }
                ].map((report, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">{report.name}</p>
                        <p className="text-xs text-gray-600">{report.type} • {report.date} • {report.size}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>Monthly attendance percentage by grade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { grade: 'Grade 9', percentage: 96.2, color: 'bg-green-500' },
                    { grade: 'Grade 10', percentage: 94.8, color: 'bg-blue-500' },
                    { grade: 'Grade 11', percentage: 92.5, color: 'bg-yellow-500' },
                    { grade: 'Grade 12', percentage: 91.3, color: 'bg-red-500' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.grade}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Average marks by subject this term</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { subject: 'Mathematics', average: 82.5, color: 'bg-purple-500' },
                    { subject: 'English', average: 79.8, color: 'bg-blue-500' },
                    { subject: 'Physics', average: 76.3, color: 'bg-green-500' },
                    { subject: 'Chemistry', average: 74.9, color: 'bg-yellow-500' },
                    { subject: 'Biology', average: 71.2, color: 'bg-red-500' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.subject}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${item.average}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{item.average}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
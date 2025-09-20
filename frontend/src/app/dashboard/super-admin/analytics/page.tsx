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

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
      <DashboardLayout title="Platform Analytics" userRole={UserRole.SUPER_ADMIN}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
              <p className="text-gray-600">Monitor platform-wide performance and usage</p>
            </div>
            <div className="flex space-x-3">
              <Select defaultValue="7d">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <span className="text-2xl">💰</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$24,580</div>
                <p className="text-xs text-green-600">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <span className="text-2xl">👥</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-green-600">+8.2% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SMS Sent</CardTitle>
                <span className="text-2xl">💬</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45,230</div>
                <p className="text-xs text-blue-600">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <span className="text-2xl">✅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-green-600">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Usage Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>School Growth</CardTitle>
                <CardDescription>New schools joining the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">January 2024</span>
                    <span className="text-sm font-medium">3 schools</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">February 2024</span>
                    <span className="text-sm font-medium">5 schools</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">March 2024</span>
                    <span className="text-sm font-medium">4 schools</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Platform usage by user role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Students</span>
                    </div>
                    <span className="text-sm font-medium">2,456 (86%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Teachers</span>
                    </div>
                    <span className="text-sm font-medium">324 (11%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">School Admins</span>
                    </div>
                    <span className="text-sm font-medium">54 (2%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Super Admins</span>
                    </div>
                    <span className="text-sm font-medium">13 (1%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Statistics</CardTitle>
              <CardDescription>Most used features across all schools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Attendance Management</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily Usage</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Results Management</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly Usage</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">SMS Notifications</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Usage</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Platform health and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Response Time</span>
                    <span className="text-sm font-medium text-green-600">245ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className="text-sm font-medium text-green-600">0.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Performance</span>
                    <span className="text-sm font-medium text-green-600">Excellent</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Availability</span>
                    <span className="text-sm font-medium text-green-600">99.98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support Metrics</CardTitle>
                <CardDescription>Customer support and satisfaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Open Tickets</span>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Resolution Time</span>
                    <span className="text-sm font-medium text-green-600">4.2 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="text-sm font-medium text-green-600">4.8/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Feature Requests</span>
                    <span className="text-sm font-medium">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
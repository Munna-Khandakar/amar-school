'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function SmsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [smsData] = useState([
    {
      schoolId: '1',
      schoolName: 'Green Valley High School',
      monthlyLimit: 1000,
      used: 847,
      remaining: 153,
      lastReset: '2024-01-01',
      avgDaily: 28,
      status: 'normal'
    },
    {
      schoolId: '2',
      schoolName: 'Sunrise Academy',
      monthlyLimit: 800,
      used: 756,
      remaining: 44,
      lastReset: '2024-01-01',
      avgDaily: 25,
      status: 'warning'
    },
    {
      schoolId: '3',
      schoolName: 'Oak Tree School',
      monthlyLimit: 500,
      used: 502,
      remaining: 0,
      lastReset: '2024-01-01',
      avgDaily: 17,
      status: 'exceeded'
    }
  ]);

  const filteredData = smsData.filter(data =>
    data.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSent = smsData.reduce((sum, data) => sum + data.used, 0);
  const totalLimit = smsData.reduce((sum, data) => sum + data.monthlyLimit, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'default';
      case 'warning': return 'destructive';
      case 'exceeded': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'warning': return 'Near Limit';
      case 'exceeded': return 'Exceeded';
      default: return 'Unknown';
    }
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
      <DashboardLayout title="SMS Usage" userRole={UserRole.SUPER_ADMIN}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SMS Usage Monitoring</h1>
              <p className="text-gray-600">Monitor and manage SMS usage across all schools</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                Export Report
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    Update Quotas
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Bulk Update SMS Quotas</DialogTitle>
                    <DialogDescription>
                      Update SMS quotas for multiple schools
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Select Schools</label>
                      <Input placeholder="Search schools..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium">New Monthly Limit</label>
                      <Input placeholder="1000" type="number" />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline">Cancel</Button>
                      <Button>Update Quotas</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* SMS Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total SMS Sent</CardTitle>
                <span className="text-2xl">💬</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
                <p className="text-xs text-gray-600">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quota</CardTitle>
                <span className="text-2xl">📊</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLimit.toLocaleString()}</div>
                <p className="text-xs text-gray-600">Monthly limit</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilization</CardTitle>
                <span className="text-2xl">📈</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((totalSent / totalLimit) * 100)}%
                </div>
                <p className="text-xs text-gray-600">Of total quota</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schools Over Limit</CardTitle>
                <span className="text-2xl">⚠️</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {smsData.filter(d => d.status === 'exceeded').length}
                </div>
                <p className="text-xs text-gray-600">Need attention</p>
              </CardContent>
            </Card>
          </div>

          {/* SMS Usage Table */}
          <Card>
            <CardHeader>
              <CardTitle>School SMS Usage</CardTitle>
              <CardDescription>
                Monitor SMS usage for each school and manage quotas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Input
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Reset All
                  </Button>
                  <Button variant="outline" size="sm">
                    Filter
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School</TableHead>
                      <TableHead>Monthly Limit</TableHead>
                      <TableHead>Used</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Usage %</TableHead>
                      <TableHead>Avg/Day</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((data) => (
                      <TableRow key={data.schoolId}>
                        <TableCell>
                          <div className="font-medium">{data.schoolName}</div>
                        </TableCell>
                        <TableCell>{data.monthlyLimit.toLocaleString()}</TableCell>
                        <TableCell>{data.used.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={data.remaining < 50 ? 'text-red-600' : 'text-green-600'}>
                            {data.remaining.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  (data.used / data.monthlyLimit) > 0.9 ? 'bg-red-600' : 
                                  (data.used / data.monthlyLimit) > 0.7 ? 'bg-yellow-600' : 'bg-green-600'
                                }`}
                                style={{ width: `${Math.min((data.used / data.monthlyLimit) * 100, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">
                              {Math.round((data.used / data.monthlyLimit) * 100)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{data.avgDaily}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(data.status) as "default" | "destructive" | "secondary"}>
                            {getStatusText(data.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Edit Quota
                            </Button>
                            <Button variant="outline" size="sm">
                              Reset
                            </Button>
                            <Button variant="outline" size="sm">
                              History
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Recent SMS Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent SMS Activity</CardTitle>
              <CardDescription>Latest SMS notifications sent across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { school: 'Green Valley High School', type: 'Attendance Alert', count: 15, time: '2 hours ago' },
                  { school: 'Sunrise Academy', type: 'Result Notification', count: 28, time: '4 hours ago' },
                  { school: 'Oak Tree School', type: 'Meeting Reminder', count: 12, time: '6 hours ago' },
                  { school: 'Pine Hill Elementary', type: 'Attendance Alert', count: 8, time: '8 hours ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">{activity.school}</p>
                        <p className="text-xs text-gray-600">{activity.type} - {activity.count} messages</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
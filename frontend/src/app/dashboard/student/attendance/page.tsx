'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function StudentAttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock data - replace with actual API calls
  const [attendanceRecords] = useState([
    {
      id: '1',
      date: '2024-01-22',
      day: 'Monday',
      status: 'present',
      timeIn: '08:00',
      timeOut: '14:30',
      period: 'Full Day',
      markedBy: 'Mrs. Sarah Johnson',
      remarks: ''
    },
    {
      id: '2',
      date: '2024-01-21',
      day: 'Sunday',
      status: 'absent',
      timeIn: null,
      timeOut: null,
      period: 'Full Day',
      markedBy: 'Mrs. Sarah Johnson',
      remarks: 'Sick leave'
    },
    {
      id: '3',
      date: '2024-01-20',
      day: 'Saturday',
      status: 'late',
      timeIn: '08:30',
      timeOut: '14:30',
      period: 'Full Day',
      markedBy: 'Mrs. Sarah Johnson',
      remarks: 'Traffic delay'
    },
    {
      id: '4',
      date: '2024-01-19',
      day: 'Friday',
      status: 'present',
      timeIn: '08:00',
      timeOut: '14:30',
      period: 'Full Day',
      markedBy: 'Mrs. Sarah Johnson',
      remarks: ''
    },
    {
      id: '5',
      date: '2024-01-18',
      day: 'Thursday',
      status: 'present',
      timeIn: '08:00',
      timeOut: '14:30',
      period: 'Full Day',
      markedBy: 'Mrs. Sarah Johnson',
      remarks: ''
    },
    {
      id: '6',
      date: '2024-01-17',
      day: 'Wednesday',
      status: 'excused',
      timeIn: null,
      timeOut: null,
      period: 'Full Day',
      markedBy: 'Mrs. Sarah Johnson',
      remarks: 'Medical appointment'
    },
    {
      id: '7',
      date: '2024-01-16',
      day: 'Tuesday',
      status: 'present',
      timeIn: '08:00',
      timeOut: '12:00',
      period: 'Half Day',
      markedBy: 'Mrs. Sarah Johnson',
      remarks: 'Early dismissal'
    }
  ]);

  const [studentInfo] = useState({
    firstName: 'Alex',
    lastName: 'Smith',
    studentId: 'S001',
    class: 'Grade 10-A',
    rollNumber: '001',
    admissionNumber: 'ADM2024001'
  });

  const getAttendanceStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    const excused = attendanceRecords.filter(r => r.status === 'excused').length;

    const attendanceRate = total > 0 ? ((present + late + excused) / total) * 100 : 0;

    return { total, present, absent, late, excused, attendanceRate };
  };

  const stats = getAttendanceStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'excused': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return '✓';
      case 'absent': return '✗';
      case 'late': return '⏰';
      case 'excused': return '📝';
      default: return '—';
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [2024, 2023, 2022];

  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <DashboardLayout title="My Attendance" userRole={UserRole.STUDENT}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
              <p className="text-gray-600">View your attendance records and statistics</p>
            </div>
            <div className="flex space-x-3">
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                Download Report
              </Button>
            </div>
          </div>

          {/* Student Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{studentInfo.firstName} {studentInfo.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-medium">{studentInfo.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="font-medium">{studentInfo.class}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Roll Number</p>
                  <p className="font-medium">{studentInfo.rollNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <p className="text-xs text-gray-600">Total Days</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                <p className="text-xs text-gray-600">Present</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                <p className="text-xs text-gray-600">Absent</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                <p className="text-xs text-gray-600">Late</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(stats.attendanceRate)}%
                </div>
                <p className="text-xs text-gray-600">Attendance Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Rate Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Progress</CardTitle>
              <CardDescription>Your attendance rate for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Attendance Rate</span>
                  <span className="text-sm text-gray-600">{Math.round(stats.attendanceRate)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      stats.attendanceRate >= 85 ? 'bg-green-500' :
                      stats.attendanceRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(stats.attendanceRate, 100)}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Present: {stats.present}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Absent: {stats.absent}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Late: {stats.late}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Excused: {stats.excused}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Detailed attendance records for {months[selectedMonth]} {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time In</TableHead>
                      <TableHead>Time Out</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.date}</TableCell>
                        <TableCell>{record.day}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>
                            {getStatusIcon(record.status)} {record.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.timeIn || '—'}</TableCell>
                        <TableCell>{record.timeOut || '—'}</TableCell>
                        <TableCell>{record.period}</TableCell>
                        <TableCell>{record.remarks || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Calendar View */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Calendar View</CardTitle>
              <CardDescription>Visual representation of your attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {/* Sample calendar days - this would be dynamically generated */}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const hasRecord = attendanceRecords.find(r =>
                    new Date(r.date).getDate() === day
                  );

                  return (
                    <div
                      key={day}
                      className={`
                        aspect-square flex items-center justify-center text-sm border rounded
                        ${hasRecord
                          ? `${getStatusColor(hasRecord.status)} border-current`
                          : 'bg-gray-50 text-gray-400 border-gray-200'
                        }
                      `}
                    >
                      <div className="text-center">
                        <div>{day}</div>
                        {hasRecord && (
                          <div className="text-xs">
                            {getStatusIcon(hasRecord.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-100 border border-green-800 rounded"></div>
                  <span>Present</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-100 border border-red-800 rounded"></div>
                  <span>Absent</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-800 rounded"></div>
                  <span>Late</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-100 border border-blue-800 rounded"></div>
                  <span>Excused</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
                  <span>No School</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
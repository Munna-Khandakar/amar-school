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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function TeacherAttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [attendance, setAttendance] = useState<{[key: string]: string}>({});

  // Mock data - replace with actual API calls
  const [classes] = useState([
    { id: '1', name: 'Grade 10-A', subject: 'Mathematics' },
    { id: '2', name: 'Grade 11-B', subject: 'Physics' },
    { id: '3', name: 'Grade 9-C', subject: 'Mathematics' }
  ]);

  const [periods] = useState([
    { id: '1', period: 1, subject: 'Mathematics', time: '08:00-08:45' },
    { id: '2', period: 2, subject: 'Physics', time: '08:45-09:30' },
    { id: '3', period: 3, subject: 'Mathematics', time: '09:45-10:30' },
    { id: '4', period: 4, subject: 'Study Hall', time: '10:30-11:15' }
  ]);

  const [students] = useState([
    {
      id: '1',
      firstName: 'Alex',
      lastName: 'Smith',
      studentId: 'S001',
      rollNumber: '001',
      photoUrl: null
    },
    {
      id: '2',
      firstName: 'Emma',
      lastName: 'Johnson',
      studentId: 'S002',
      rollNumber: '002',
      photoUrl: null
    },
    {
      id: '3',
      firstName: 'David',
      lastName: 'Brown',
      studentId: 'S003',
      rollNumber: '003',
      photoUrl: null
    },
    {
      id: '4',
      firstName: 'Sarah',
      lastName: 'Wilson',
      studentId: 'S004',
      rollNumber: '004',
      photoUrl: null
    },
    {
      id: '5',
      firstName: 'Michael',
      lastName: 'Davis',
      studentId: 'S005',
      rollNumber: '005',
      photoUrl: null
    }
  ]);

  const [attendanceHistory] = useState([
    {
      id: '1',
      date: '2024-01-22',
      class: 'Grade 10-A',
      period: 'Period 1',
      subject: 'Mathematics',
      present: 24,
      absent: 4,
      late: 2,
      total: 30
    },
    {
      id: '2',
      date: '2024-01-21',
      class: 'Grade 11-B',
      period: 'Period 2',
      subject: 'Physics',
      present: 22,
      absent: 3,
      late: 1,
      total: 26
    },
    {
      id: '3',
      date: '2024-01-21',
      class: 'Grade 10-A',
      period: 'Period 3',
      subject: 'Mathematics',
      present: 26,
      absent: 2,
      late: 2,
      total: 30
    }
  ]);

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmitAttendance = () => {
    if (!selectedClass || !selectedDate) {
      alert('Please select class and date');
      return;
    }

    // Here you would make API call to submit attendance
    console.log('Submitting attendance:', {
      classId: selectedClass,
      date: selectedDate,
      period: selectedPeriod,
      attendance
    });

    alert('Attendance submitted successfully!');
    setAttendance({});
  };

  const getAttendanceStats = () => {
    const marked = Object.keys(attendance).length;
    const present = Object.values(attendance).filter(status => status === 'present').length;
    const absent = Object.values(attendance).filter(status => status === 'absent').length;
    const late = Object.values(attendance).filter(status => status === 'late').length;

    return { marked, present, absent, late, total: students.length };
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

  return (
    <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
      <DashboardLayout title="Mark Attendance" userRole={UserRole.TEACHER}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
              <p className="text-gray-600">Record student attendance for your classes</p>
            </div>
            <div className="flex space-x-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    View History
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Attendance History</DialogTitle>
                    <DialogDescription>
                      Recent attendance records you have marked
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead>Present</TableHead>
                          <TableHead>Absent</TableHead>
                          <TableHead>Late</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceHistory.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.class}</TableCell>
                            <TableCell>{record.period}</TableCell>
                            <TableCell className="text-green-600">{record.present}</TableCell>
                            <TableCell className="text-red-600">{record.absent}</TableCell>
                            <TableCell className="text-yellow-600">{record.late}</TableCell>
                            <TableCell>{record.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                onClick={handleSubmitAttendance}
                disabled={!selectedClass || stats.marked === 0}
              >
                Submit Attendance
              </Button>
            </div>
          </div>

          {/* Selection Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Settings</CardTitle>
              <CardDescription>Select class, date, and period to mark attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} - {cls.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Period (Optional)</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map(period => (
                        <SelectItem key={period.id} value={period.id}>
                          Period {period.period} - {period.time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setAttendance({})}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {selectedClass && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <p className="text-xs text-gray-600">Total Students</p>
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
                  <div className="text-2xl font-bold text-gray-600">
                    {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
                  </div>
                  <p className="text-xs text-gray-600">Attendance Rate</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Student Attendance Grid */}
          {selectedClass ? (
            <Card>
              <CardHeader>
                <CardTitle>Mark Student Attendance</CardTitle>
                <CardDescription>
                  Click on student status to change attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Quick Actions */}
                  <div className="flex space-x-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newAttendance: {[key: string]: string} = {};
                        students.forEach(student => {
                          newAttendance[student.id] = 'present';
                        });
                        setAttendance(newAttendance);
                      }}
                    >
                      Mark All Present
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newAttendance: {[key: string]: string} = {};
                        students.forEach(student => {
                          newAttendance[student.id] = 'absent';
                        });
                        setAttendance(newAttendance);
                      }}
                    >
                      Mark All Absent
                    </Button>
                  </div>

                  {/* Students Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((student) => (
                      <Card key={student.id} className="relative">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-lg font-medium">
                                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{student.firstName} {student.lastName}</h4>
                              <p className="text-sm text-gray-600">ID: {student.studentId} | Roll: {student.rollNumber}</p>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-4 gap-2">
                            {['present', 'absent', 'late', 'excused'].map((status) => (
                              <Button
                                key={status}
                                variant={attendance[student.id] === status ? "default" : "outline"}
                                size="sm"
                                className={`text-xs ${attendance[student.id] === status ? getStatusColor(status) : ''}`}
                                onClick={() => handleAttendanceChange(student.id, status)}
                              >
                                <span className="mr-1">{getStatusIcon(status)}</span>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Button>
                            ))}
                          </div>
                          {attendance[student.id] && (
                            <div className="mt-2">
                              <Badge className={getStatusColor(attendance[student.id])}>
                                {getStatusIcon(attendance[student.id])} {attendance[student.id].toUpperCase()}
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
                <p className="text-gray-600">Choose a class and date above to start marking attendance</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
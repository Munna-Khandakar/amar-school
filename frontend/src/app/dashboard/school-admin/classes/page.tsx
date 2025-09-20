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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classes] = useState([
    {
      id: '1',
      name: 'Grade 10-A',
      section: 'A',
      grade: 10,
      classTeacher: 'Sarah Johnson',
      classTeacherId: '1',
      totalStudents: 28,
      capacity: 30,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'],
      schedule: {
        startTime: '08:00',
        endTime: '14:30',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      academicYear: '2024-25',
      isActive: true
    },
    {
      id: '2',
      name: 'Grade 10-B',
      section: 'B',
      grade: 10,
      classTeacher: 'Michael Brown',
      classTeacherId: '2',
      totalStudents: 25,
      capacity: 30,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'],
      schedule: {
        startTime: '08:00',
        endTime: '14:30',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      academicYear: '2024-25',
      isActive: true
    },
    {
      id: '3',
      name: 'Grade 11-A',
      section: 'A',
      grade: 11,
      classTeacher: 'Emily Davis',
      classTeacherId: '3',
      totalStudents: 22,
      capacity: 25,
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'],
      schedule: {
        startTime: '08:00',
        endTime: '15:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      },
      academicYear: '2024-25',
      isActive: true
    }
  ]);

  const [teachers] = useState([
    { id: '1', name: 'Sarah Johnson', subject: 'Mathematics' },
    { id: '2', name: 'Michael Brown', subject: 'English' },
    { id: '3', name: 'Emily Davis', subject: 'Chemistry' },
    { id: '4', name: 'Robert Wilson', subject: 'Physics' },
    { id: '5', name: 'Lisa Anderson', subject: 'Biology' }
  ]);

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.grade.toString().includes(searchTerm)
  );

  return (
    <ProtectedRoute allowedRoles={[UserRole.SCHOOL_ADMIN]}>
      <DashboardLayout title="Classes Management" userRole={UserRole.SCHOOL_ADMIN}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Classes Management</h1>
              <p className="text-gray-600">Manage classes, schedules, and teacher assignments</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <span className="mr-2">➕</span>
                  Create New Class
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Class</DialogTitle>
                  <DialogDescription>
                    Set up a new class with teacher assignments and schedule
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Class Name</label>
                        <Input placeholder="Grade 10-A" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Section</label>
                        <Input placeholder="A" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Grade</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9">Grade 9</SelectItem>
                            <SelectItem value="10">Grade 10</SelectItem>
                            <SelectItem value="11">Grade 11</SelectItem>
                            <SelectItem value="12">Grade 12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Academic Year</label>
                        <Input placeholder="2024-25" />
                      </div>
                    </div>
                  </div>

                  {/* Teacher Assignment */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Teacher Assignment</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Class Teacher</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map(teacher => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.name} - {teacher.subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Capacity</label>
                        <Input type="number" placeholder="30" />
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Schedule</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Start Time</label>
                        <Input type="time" defaultValue="08:00" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Time</label>
                        <Input type="time" defaultValue="14:30" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-medium">Class Days</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                          <label key={day} className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked={day !== 'Saturday'} />
                            <span className="text-sm">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Subjects</h3>
                    <div className="space-y-3">
                      {['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'].map((subject, i) => (
                        <div key={i} className="grid grid-cols-3 gap-4 items-end">
                          <div>
                            <label className="text-sm font-medium">Subject</label>
                            <Input defaultValue={subject} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Subject Code</label>
                            <Input placeholder={`${subject.slice(0, 3).toUpperCase()}101`} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Teacher</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select teacher" />
                              </SelectTrigger>
                              <SelectContent>
                                {teachers.map(teacher => (
                                  <SelectItem key={teacher.id} value={teacher.id}>
                                    {teacher.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-medium">Description (Optional)</label>
                    <Input placeholder="Class description or notes" />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Class</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <span className="text-2xl">🏫</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classes.length}</div>
                <p className="text-xs text-gray-600">
                  {classes.filter(c => c.isActive).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <span className="text-2xl">🎓</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {classes.reduce((sum, c) => sum + c.totalStudents, 0)}
                </div>
                <p className="text-xs text-gray-600">Enrolled students</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Capacity</CardTitle>
                <span className="text-2xl">📊</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (classes.reduce((sum, c) => sum + c.totalStudents, 0) /
                     classes.reduce((sum, c) => sum + c.capacity, 0)) * 100
                  )}%
                </div>
                <p className="text-xs text-gray-600">Utilization rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                <span className="text-2xl">📚</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Array.from(new Set(classes.flatMap(c => c.subjects))).length}
                </div>
                <p className="text-xs text-gray-600">Total subjects</p>
              </CardContent>
            </Card>
          </div>

          {/* Classes Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Classes</CardTitle>
              <CardDescription>
                Manage class schedules, teacher assignments, and student enrollment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Input
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Export
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
                      <TableHead>Class</TableHead>
                      <TableHead>Class Teacher</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{cls.name}</div>
                            <div className="text-sm text-gray-500">Grade {cls.grade} - Section {cls.section}</div>
                          </div>
                        </TableCell>
                        <TableCell>{cls.classTeacher}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{cls.totalStudents}/{cls.capacity}</span>
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(cls.totalStudents / cls.capacity) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{cls.capacity}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{cls.schedule.startTime} - {cls.schedule.endTime}</div>
                            <div className="text-gray-500">Mon-Fri</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={cls.isActive ? "default" : "secondary"}>
                            {cls.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              Students
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
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
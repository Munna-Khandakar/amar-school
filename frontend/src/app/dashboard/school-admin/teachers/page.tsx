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

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers] = useState([
    {
      id: '1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@school.edu',
      employeeId: 'T001',
      phoneNumber: '+1 555-0101',
      subjects: ['Mathematics', 'Physics'],
      qualification: 'M.Sc Mathematics',
      experience: 8,
      joiningDate: '2020-08-15',
      salary: 55000,
      assignedClasses: ['Grade 10-A', 'Grade 11-B'],
      isActive: true
    },
    {
      id: '2',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@school.edu',
      employeeId: 'T002',
      phoneNumber: '+1 555-0102',
      subjects: ['English', 'Literature'],
      qualification: 'M.A English',
      experience: 12,
      joiningDate: '2018-07-01',
      salary: 62000,
      assignedClasses: ['Grade 9-A', 'Grade 12-C'],
      isActive: true
    },
    {
      id: '3',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@school.edu',
      employeeId: 'T003',
      phoneNumber: '+1 555-0103',
      subjects: ['Chemistry', 'Biology'],
      qualification: 'M.Sc Chemistry',
      experience: 5,
      joiningDate: '2022-09-01',
      salary: 48000,
      assignedClasses: ['Grade 11-A'],
      isActive: false
    }
  ]);

  const [classes] = useState([
    { id: '1', name: 'Grade 9-A' },
    { id: '2', name: 'Grade 9-B' },
    { id: '3', name: 'Grade 10-A' },
    { id: '4', name: 'Grade 10-B' },
    { id: '5', name: 'Grade 11-A' },
    { id: '6', name: 'Grade 11-B' },
    { id: '7', name: 'Grade 12-A' },
    { id: '8', name: 'Grade 12-B' },
    { id: '9', name: 'Grade 12-C' }
  ]);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <ProtectedRoute allowedRoles={[UserRole.SCHOOL_ADMIN]}>
      <DashboardLayout title="Teachers Management" userRole={UserRole.SCHOOL_ADMIN}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teachers Management</h1>
              <p className="text-gray-600">Manage teaching staff and their assignments</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <span className="mr-2">➕</span>
                  Add New Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Teacher</DialogTitle>
                  <DialogDescription>
                    Create a new teacher account with personal and professional details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">First Name</label>
                        <Input placeholder="John" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <Input placeholder="Doe" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input placeholder="john.doe@school.edu" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input placeholder="+1 555-0123" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Date of Birth</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Gender</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-medium">Address</label>
                      <Input placeholder="Full address" />
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Professional Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Employee ID</label>
                        <Input placeholder="T001" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Qualification</label>
                        <Input placeholder="M.Sc Mathematics" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Experience (Years)</label>
                        <Input type="number" placeholder="5" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Joining Date</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Monthly Salary</label>
                        <Input type="number" placeholder="50000" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Primary Subject</label>
                        <Input placeholder="Mathematics" />
                      </div>
                    </div>
                  </div>

                  {/* Class Assignment */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Class Assignment</h3>
                    <div>
                      <label className="text-sm font-medium">Assigned Classes</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select classes" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map(cls => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Teacher</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <span className="text-2xl">👨‍🏫</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teachers.length}</div>
                <p className="text-xs text-gray-600">
                  {teachers.filter(t => t.isActive).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Experience</CardTitle>
                <span className="text-2xl">📊</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(teachers.reduce((sum, t) => sum + t.experience, 0) / teachers.length)} years
                </div>
                <p className="text-xs text-gray-600">Across all teachers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <span className="text-2xl">📚</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teachers.reduce((sum, t) => sum + t.assignedClasses.length, 0)}
                </div>
                <p className="text-xs text-gray-600">Assigned classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <span className="text-2xl">📅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-gray-600">New teachers added</p>
              </CardContent>
            </Card>
          </div>

          {/* Teachers Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Teachers</CardTitle>
              <CardDescription>
                Manage teaching staff, their subjects, and class assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Input
                  placeholder="Search teachers..."
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
                      <TableHead>Teacher</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {teacher.firstName} {teacher.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{teacher.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{teacher.employeeId}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {teacher.subjects.map((subject, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{teacher.experience} years</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {teacher.assignedClasses.length} classes
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={teacher.isActive ? "default" : "secondary"}>
                            {teacher.isActive ? 'Active' : 'Inactive'}
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
                            <Button
                              variant="outline"
                              size="sm"
                              className={teacher.isActive ? "text-red-600" : "text-green-600"}
                            >
                              {teacher.isActive ? 'Disable' : 'Enable'}
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
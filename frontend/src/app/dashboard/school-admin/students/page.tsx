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

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students] = useState([
    {
      id: '1',
      firstName: 'Alex',
      lastName: 'Smith',
      email: 'alex.smith@student.edu',
      studentId: 'S001',
      admissionNumber: 'ADM2024001',
      rollNumber: '001',
      phoneNumber: '+1 555-0201',
      class: 'Grade 10-A',
      classId: '1',
      dateOfBirth: '2008-05-15',
      gender: 'Male',
      parentName: 'John Smith',
      parentContact: '+1 555-0101',
      admissionDate: '2024-04-01',
      isActive: true
    },
    {
      id: '2',
      firstName: 'Emma',
      lastName: 'Johnson',
      email: 'emma.johnson@student.edu',
      studentId: 'S002',
      admissionNumber: 'ADM2024002',
      rollNumber: '002',
      phoneNumber: '+1 555-0202',
      class: 'Grade 10-A',
      classId: '1',
      dateOfBirth: '2008-08-22',
      gender: 'Female',
      parentName: 'Sarah Johnson',
      parentContact: '+1 555-0102',
      admissionDate: '2024-04-01',
      isActive: true
    },
    {
      id: '3',
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@student.edu',
      studentId: 'S003',
      admissionNumber: 'ADM2023045',
      rollNumber: '015',
      phoneNumber: '+1 555-0203',
      class: 'Grade 11-B',
      classId: '2',
      dateOfBirth: '2007-12-10',
      gender: 'Male',
      parentName: 'Michael Brown',
      parentContact: '+1 555-0103',
      admissionDate: '2023-07-15',
      isActive: false
    }
  ]);

  const [classes] = useState([
    { id: '1', name: 'Grade 10-A', grade: 10, section: 'A' },
    { id: '2', name: 'Grade 10-B', grade: 10, section: 'B' },
    { id: '3', name: 'Grade 11-A', grade: 11, section: 'A' },
    { id: '4', name: 'Grade 11-B', grade: 11, section: 'B' },
    { id: '5', name: 'Grade 12-A', grade: 12, section: 'A' },
    { id: '6', name: 'Grade 12-B', grade: 12, section: 'B' }
  ]);

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={[UserRole.SCHOOL_ADMIN]}>
      <DashboardLayout title="Students Management" userRole={UserRole.SCHOOL_ADMIN}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
              <p className="text-gray-600">Manage student records and class assignments</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <span className="mr-2">➕</span>
                  Add New Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Create a new student account with personal and academic details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">First Name</label>
                        <Input placeholder="Alex" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <Input placeholder="Smith" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input placeholder="alex.smith@student.edu" />
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

                  {/* Academic Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Academic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Student ID</label>
                        <Input placeholder="S001" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Admission Number</label>
                        <Input placeholder="ADM2024001" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Roll Number</label>
                        <Input placeholder="001" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Admission Date</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Class</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
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
                      <div>
                        <label className="text-sm font-medium">Previous School</label>
                        <Input placeholder="Previous school name" />
                      </div>
                    </div>
                  </div>

                  {/* Parent Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Parent/Guardian Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Father&apos;s Name</label>
                        <Input placeholder="John Smith" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Mother&apos;s Name</label>
                        <Input placeholder="Jane Smith" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Guardian Contact</label>
                        <Input placeholder="+1 555-0123" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Guardian Email</label>
                        <Input placeholder="parent@email.com" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-medium">Parent Address</label>
                      <Input placeholder="Parent/Guardian address" />
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Medical Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Blood Group</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="a+">A+</SelectItem>
                            <SelectItem value="a-">A-</SelectItem>
                            <SelectItem value="b+">B+</SelectItem>
                            <SelectItem value="b-">B-</SelectItem>
                            <SelectItem value="ab+">AB+</SelectItem>
                            <SelectItem value="ab-">AB-</SelectItem>
                            <SelectItem value="o+">O+</SelectItem>
                            <SelectItem value="o-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Emergency Contact</label>
                        <Input placeholder="+1 555-0123" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-medium">Allergies (if any)</label>
                      <Input placeholder="List any allergies separated by commas" />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Student</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <span className="text-2xl">🎓</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
                <p className="text-xs text-gray-600">
                  {students.filter(s => s.isActive).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Grade 10</CardTitle>
                <span className="text-2xl">📚</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {students.filter(s => s.class.includes('Grade 10')).length}
                </div>
                <p className="text-xs text-gray-600">Students</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Grade 11</CardTitle>
                <span className="text-2xl">📖</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {students.filter(s => s.class.includes('Grade 11')).length}
                </div>
                <p className="text-xs text-gray-600">Students</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <span className="text-2xl">📅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-gray-600">New admissions</p>
              </CardContent>
            </Card>
          </div>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Students</CardTitle>
              <CardDescription>
                Manage student records, class assignments, and academic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Input
                  placeholder="Search students..."
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
                      <TableHead>Student</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Parent Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.studentId}</div>
                            <div className="text-sm text-gray-500">{student.admissionNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.parentName}</div>
                            <div className="text-sm text-gray-500">{student.parentContact}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.isActive ? "default" : "secondary"}>
                            {student.isActive ? 'Active' : 'Inactive'}
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
                              className={student.isActive ? "text-red-600" : "text-green-600"}
                            >
                              {student.isActive ? 'Disable' : 'Enable'}
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
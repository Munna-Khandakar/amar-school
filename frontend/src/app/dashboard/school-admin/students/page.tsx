'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole, User, CreateStudentData, UpdateUserData } from '@/lib/types';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import CreateStudentForm from '@/components/users/CreateStudentForm';
import EditUserForm from '@/components/users/EditUserForm';
import { useUsers } from '@/hooks/useUsers';

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    students,
    classes,
    isLoading,
    error,
    createStudent,
    updateUser,
    deleteUser,
    toggleUserStatus,
    refreshStudents,
  } = useUsers();

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.admissionNumber && student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.rollNumber && student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateStudent = async (data: CreateStudentData) => {
    setActionLoading(true);
    try {
      await createStudent(data);
      setCreateDialogOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditStudent = async (data: UpdateUserData) => {
    if (!selectedStudent) return;

    setActionLoading(true);
    try {
      await updateUser(selectedStudent.id, data);
      setEditDialogOpen(false);
      setSelectedStudent(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;

    setActionLoading(true);
    try {
      await deleteUser(selectedStudent.id);
      setDeleteDialogOpen(false);
      setSelectedStudent(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (student: User) => {
    setActionLoading(true);
    try {
      await toggleUserStatus(student.id, !student.isActive);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditDialog = (student: User) => {
    setSelectedStudent(student);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (student: User) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const getClassById = (classId: string) => {
    return classes.find(cls => cls.id === classId);
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.SCHOOL_ADMIN]}>
      <DashboardLayout title="Students Management" userRole={UserRole.SCHOOL_ADMIN}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
              <p className="text-gray-600">Manage student enrollment and academic records</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={refreshStudents} disabled={isLoading}>
                🔄 Refresh
              </Button>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
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
                      Enroll a new student with personal and academic details
                    </DialogDescription>
                  </DialogHeader>
                  <CreateStudentForm
                    onSubmit={handleCreateStudent}
                    onCancel={() => setCreateDialogOpen(false)}
                    classes={classes}
                    isLoading={actionLoading}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshStudents}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <span className="text-2xl">🎓</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : students.length}
                </div>
                <p className="text-xs text-gray-600">
                  {isLoading ? '...' : students.filter(s => s.isActive).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Classes</CardTitle>
                <span className="text-2xl">📚</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : classes.length}
                </div>
                <p className="text-xs text-gray-600">Total classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average per Class</CardTitle>
                <span className="text-2xl">📊</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : classes.length > 0
                    ? Math.round(students.length / classes.length)
                    : 0}
                </div>
                <p className="text-xs text-gray-600">Students per class</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <span className="text-2xl">📅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : students.filter(s => {
                    if (!s.admissionDate) return false;
                    const admissionDate = new Date(s.admissionDate);
                    const thisMonth = new Date();
                    return admissionDate.getMonth() === thisMonth.getMonth() &&
                           admissionDate.getFullYear() === thisMonth.getFullYear();
                  }).length}
                </div>
                <p className="text-xs text-gray-600">New admissions</p>
              </CardContent>
            </Card>
          </div>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Students</CardTitle>
              <CardDescription>
                Manage student enrollment and track academic progress
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
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Admission Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2">Loading students...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-gray-500">
                            {searchTerm ? 'No students match your search.' : 'No students found.'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => {
                        const studentClass = getClassById(student.classId || '');
                        return (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {student.firstName} {student.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>{student.studentId || 'N/A'}</TableCell>
                            <TableCell>
                              {studentClass ? `${studentClass.name} - ${studentClass.section}` : 'N/A'}
                            </TableCell>
                            <TableCell>{student.rollNumber || 'N/A'}</TableCell>
                            <TableCell>
                              {student.admissionDate
                                ? new Date(student.admissionDate).toLocaleDateString()
                                : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={student.isActive ? "default" : "secondary"}>
                                {student.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(student)}
                                  disabled={actionLoading}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleStatus(student)}
                                  disabled={actionLoading}
                                  className={student.isActive ? "text-red-600" : "text-green-600"}
                                >
                                  {student.isActive ? 'Disable' : 'Enable'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDeleteDialog(student)}
                                  disabled={actionLoading}
                                  className="text-red-600"
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Student Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>
                Update student information and settings
              </DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <EditUserForm
                user={selectedStudent}
                onSubmit={handleEditStudent}
                onCancel={() => {
                  setEditDialogOpen(false);
                  setSelectedStudent(null);
                }}
                classes={classes}
                isLoading={actionLoading}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Student Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Student</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedStudent?.firstName} {selectedStudent?.lastName}"? This action cannot be undone.
                All associated data including academic records and attendance will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedStudent(null);
                }}
                disabled={actionLoading}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteStudent}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {actionLoading ? 'Deleting...' : 'Delete Student'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
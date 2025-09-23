'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole, User, CreateTeacherData, UpdateUserData } from '@/lib/types';
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
import CreateTeacherForm from '@/components/users/CreateTeacherForm';
import EditUserForm from '@/components/users/EditUserForm';
import { useUsers } from '@/hooks/useUsers';

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    teachers,
    classes,
    isLoading,
    error,
    createTeacher,
    updateUser,
    deleteUser,
    toggleUserStatus,
    refreshTeachers,
  } = useUsers();

  const filteredTeachers = teachers.filter(teacher =>
    teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.employeeId && teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (teacher.teachingSubjects && teacher.teachingSubjects.some(subject =>
      subject.subject.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const handleCreateTeacher = async (data: CreateTeacherData) => {
    setActionLoading(true);
    try {
      await createTeacher(data);
      setCreateDialogOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditTeacher = async (data: UpdateUserData) => {
    if (!selectedTeacher) return;

    setActionLoading(true);
    try {
      await updateUser(selectedTeacher.id, data);
      setEditDialogOpen(false);
      setSelectedTeacher(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;

    setActionLoading(true);
    try {
      await deleteUser(selectedTeacher.id);
      setDeleteDialogOpen(false);
      setSelectedTeacher(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (teacher: User) => {
    setActionLoading(true);
    try {
      await toggleUserStatus(teacher.id, !teacher.isActive);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditDialog = (teacher: User) => {
    setSelectedTeacher(teacher);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (teacher: User) => {
    setSelectedTeacher(teacher);
    setDeleteDialogOpen(true);
  };

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
            <div className="flex space-x-2">
              <Button variant="outline" onClick={refreshTeachers} disabled={isLoading}>
                🔄 Refresh
              </Button>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
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
                  <CreateTeacherForm
                    onSubmit={handleCreateTeacher}
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
                onClick={refreshTeachers}
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
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <span className="text-2xl">👨‍🏫</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : teachers.length}
                </div>
                <p className="text-xs text-gray-600">
                  {isLoading ? '...' : teachers.filter(t => t.isActive).length} active
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
                  {isLoading ? '...' : teachers.length > 0
                    ? Math.round(teachers.reduce((sum, t) => sum + (t.experience || 0), 0) / teachers.length)
                    : 0} years
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
                  {isLoading ? '...' : teachers.reduce((sum, t) => sum + (t.assignedClasses?.length || 0), 0)}
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
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : teachers.filter(t => {
                    if (!t.joiningDate) return false;
                    const joinDate = new Date(t.joiningDate);
                    const thisMonth = new Date();
                    return joinDate.getMonth() === thisMonth.getMonth() &&
                           joinDate.getFullYear() === thisMonth.getFullYear();
                  }).length}
                </div>
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
                      <TableHead>Qualification</TableHead>
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
                            <span className="ml-2">Loading teachers...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredTeachers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-gray-500">
                            {searchTerm ? 'No teachers match your search.' : 'No teachers found.'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTeachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {teacher.firstName} {teacher.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{teacher.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{teacher.employeeId || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {teacher.teachingSubjects?.map((subject, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {subject.subject}
                                </Badge>
                              )) || <span className="text-gray-500">No subjects</span>}
                            </div>
                          </TableCell>
                          <TableCell>{teacher.experience || 0} years</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {teacher.qualification || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={teacher.isActive ? "default" : "secondary"}>
                              {teacher.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(teacher)}
                                disabled={actionLoading}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(teacher)}
                                disabled={actionLoading}
                                className={teacher.isActive ? "text-red-600" : "text-green-600"}
                              >
                                {teacher.isActive ? 'Disable' : 'Enable'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteDialog(teacher)}
                                disabled={actionLoading}
                                className="text-red-600"
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Teacher Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Teacher</DialogTitle>
              <DialogDescription>
                Update teacher information and settings
              </DialogDescription>
            </DialogHeader>
            {selectedTeacher && (
              <EditUserForm
                user={selectedTeacher}
                onSubmit={handleEditTeacher}
                onCancel={() => {
                  setEditDialogOpen(false);
                  setSelectedTeacher(null);
                }}
                classes={classes}
                isLoading={actionLoading}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Teacher Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedTeacher?.firstName} {selectedTeacher?.lastName}"? This action cannot be undone.
                All associated data including class assignments and records will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedTeacher(null);
                }}
                disabled={actionLoading}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTeacher}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {actionLoading ? 'Deleting...' : 'Delete Teacher'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
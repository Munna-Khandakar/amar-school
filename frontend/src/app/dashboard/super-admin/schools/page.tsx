'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole, School, CreateSchoolData, UpdateSchoolData } from '@/lib/types';
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
import CreateSchoolForm from '@/components/schools/CreateSchoolForm';
import EditSchoolForm from '@/components/schools/EditSchoolForm';
import { useSchools } from '@/hooks/useSchools';

export default function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    schools,
    isLoading,
    error,
    totalSchools,
    totalStudents,
    totalTeachers,
    createSchool,
    updateSchool,
    deleteSchool,
    toggleSchoolStatus,
    refreshSchools,
  } = useSchools();

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSchool = async (data: CreateSchoolData) => {
    setActionLoading(true);
    try {
      await createSchool(data);
      setCreateDialogOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSchool = async (data: UpdateSchoolData) => {
    if (!selectedSchool) return;

    setActionLoading(true);
    try {
      await updateSchool(selectedSchool.id, data);
      setEditDialogOpen(false);
      setSelectedSchool(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSchool = async () => {
    if (!selectedSchool) return;

    setActionLoading(true);
    try {
      await deleteSchool(selectedSchool.id);
      setDeleteDialogOpen(false);
      setSelectedSchool(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (school: School) => {
    setActionLoading(true);
    try {
      await toggleSchoolStatus(school.id, !school.isActive);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditDialog = (school: School) => {
    setSelectedSchool(school);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (school: School) => {
    setSelectedSchool(school);
    setDeleteDialogOpen(true);
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
      <DashboardLayout title="Schools Management" userRole={UserRole.SUPER_ADMIN}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Schools Management</h1>
              <p className="text-gray-600">Manage all schools in the platform</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={refreshSchools} disabled={isLoading}>
                🔄 Refresh
              </Button>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <span className="mr-2">➕</span>
                    Add New School
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New School</DialogTitle>
                    <DialogDescription>
                      Create a new school in the platform
                    </DialogDescription>
                  </DialogHeader>
                  <CreateSchoolForm
                    onSubmit={handleCreateSchool}
                    onCancel={() => setCreateDialogOpen(false)}
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
                onClick={refreshSchools}
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
                <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                <span className="text-2xl">🏫</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : totalSchools}
                </div>
                <p className="text-xs text-gray-600">
                  {isLoading ? '...' : schools.filter(s => s.isActive).length} active
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
                  {isLoading ? '...' : totalStudents}
                </div>
                <p className="text-xs text-gray-600">Across all schools</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <span className="text-2xl">👨‍🏫</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : totalTeachers}
                </div>
                <p className="text-xs text-gray-600">Across all schools</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <span className="text-2xl">📅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : schools.filter(s => {
                    const schoolDate = new Date(s.createdAt);
                    const thisMonth = new Date();
                    return schoolDate.getMonth() === thisMonth.getMonth() &&
                           schoolDate.getFullYear() === thisMonth.getFullYear();
                  }).length}
                </div>
                <p className="text-xs text-gray-600">New schools added</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>All Schools</CardTitle>
              <CardDescription>
                Manage and monitor all schools in the platform
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
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    Filter
                  </Button>
                </div>
              </div>

              {/* Schools Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Teachers</TableHead>
                      <TableHead>Academic Year</TableHead>
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
                            <span className="ml-2">Loading schools...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredSchools.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-gray-500">
                            {searchTerm ? 'No schools match your search.' : 'No schools found.'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSchools.map((school) => (
                        <TableRow key={school.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{school.name}</div>
                              <div className="text-sm text-gray-500">{school.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{school.city}, {school.state}</div>
                              <div className="text-sm text-gray-500">{school.country}</div>
                            </div>
                          </TableCell>
                          <TableCell>{school.stats?.totalStudents || 0}</TableCell>
                          <TableCell>{school.stats?.totalTeachers || 0}</TableCell>
                          <TableCell>{school.settings.academicYear}</TableCell>
                          <TableCell>
                            <Badge variant={school.isActive ? "default" : "secondary"}>
                              {school.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(school)}
                                disabled={actionLoading}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(school)}
                                disabled={actionLoading}
                                className={school.isActive ? "text-red-600" : "text-green-600"}
                              >
                                {school.isActive ? 'Disable' : 'Enable'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteDialog(school)}
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

        {/* Edit School Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit School</DialogTitle>
              <DialogDescription>
                Update school information and settings
              </DialogDescription>
            </DialogHeader>
            {selectedSchool && (
              <EditSchoolForm
                school={selectedSchool}
                onSubmit={handleEditSchool}
                onCancel={() => {
                  setEditDialogOpen(false);
                  setSelectedSchool(null);
                }}
                isLoading={actionLoading}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete School Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete School</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedSchool?.name}"? This action cannot be undone.
                All associated data including students, teachers, and records will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedSchool(null);
                }}
                disabled={actionLoading}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteSchool}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {actionLoading ? 'Deleting...' : 'Delete School'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
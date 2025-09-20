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

export default function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [schools] = useState([
    {
      id: '1',
      name: 'Green Valley High School',
      email: 'admin@greenvalley.edu',
      city: 'Springfield',
      state: 'California',
      students: 245,
      teachers: 18,
      admin: 'John Smith',
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sunrise Academy',
      email: 'contact@sunrise.edu',
      city: 'Denver',
      state: 'Colorado',
      students: 189,
      teachers: 14,
      admin: 'Sarah Johnson',
      isActive: true,
      createdAt: '2024-02-20'
    },
    {
      id: '3',
      name: 'Oak Tree School',
      email: 'info@oaktree.edu',
      city: 'Austin',
      state: 'Texas',
      students: 156,
      teachers: 12,
      admin: 'Michael Brown',
      isActive: false,
      createdAt: '2023-11-08'
    }
  ]);

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <span className="mr-2">➕</span>
                  Add New School
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New School</DialogTitle>
                  <DialogDescription>
                    Create a new school in the platform
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">School Name</label>
                    <Input placeholder="Enter school name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input placeholder="school@example.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">City</label>
                      <Input placeholder="City" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">State</label>
                      <Input placeholder="State" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create School</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
                <span className="text-2xl">🏫</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{schools.length}</div>
                <p className="text-xs text-gray-600">
                  {schools.filter(s => s.isActive).length} active
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
                  {schools.reduce((sum, school) => sum + school.students, 0)}
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
                  {schools.reduce((sum, school) => sum + school.teachers, 0)}
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
                <div className="text-2xl font-bold">2</div>
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
                      <TableHead>Admin</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Teachers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{school.name}</div>
                            <div className="text-sm text-gray-500">{school.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{school.admin}</TableCell>
                        <TableCell>{school.city}, {school.state}</TableCell>
                        <TableCell>{school.students}</TableCell>
                        <TableCell>{school.teachers}</TableCell>
                        <TableCell>
                          <Badge variant={school.isActive ? "default" : "secondary"}>
                            {school.isActive ? 'Active' : 'Inactive'}
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
                              className={school.isActive ? "text-red-600" : "text-green-600"}
                            >
                              {school.isActive ? 'Disable' : 'Enable'}
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
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

export default function SchoolAdminsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [admins] = useState([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@greenvalley.edu',
      school: 'Green Valley High School',
      schoolId: '1',
      phone: '+1 555-0101',
      isActive: true,
      lastLogin: '2024-01-20',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@sunrise.edu',
      school: 'Sunrise Academy',
      schoolId: '2',
      phone: '+1 555-0102',
      isActive: true,
      lastLogin: '2024-01-19',
      createdAt: '2024-02-20'
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@oaktree.edu',
      school: 'Oak Tree School',
      schoolId: '3',
      phone: '+1 555-0103',
      isActive: false,
      lastLogin: '2024-01-10',
      createdAt: '2023-11-08'
    }
  ]);

  const [schools] = useState([
    { id: '1', name: 'Green Valley High School' },
    { id: '2', name: 'Sunrise Academy' },
    { id: '3', name: 'Oak Tree School' },
    { id: '4', name: 'Pine Hill Elementary' }
  ]);

  const filteredAdmins = admins.filter(admin =>
    admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
      <DashboardLayout title="School Admins" userRole={UserRole.SUPER_ADMIN}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">School Administrators</h1>
              <p className="text-gray-600">Manage school administrators across the platform</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <span className="mr-2">➕</span>
                  Add School Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add School Administrator</DialogTitle>
                  <DialogDescription>
                    Create a new school administrator account
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <Input placeholder="John" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input placeholder="admin@school.edu" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="+1 555-0123" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Assign School</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a school" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.map(school => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Admin</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                <span className="text-2xl">👨‍💼</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{admins.length}</div>
                <p className="text-xs text-gray-600">
                  {admins.filter(a => a.isActive).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
                <span className="text-2xl">✅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {admins.filter(a => a.isActive).length}
                </div>
                <p className="text-xs text-gray-600">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Schools Covered</CardTitle>
                <span className="text-2xl">🏫</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(admins.map(a => a.schoolId)).size}
                </div>
                <p className="text-xs text-gray-600">With assigned admins</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <span className="text-2xl">📅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-gray-600">New admins added</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>All School Administrators</CardTitle>
              <CardDescription>
                Manage all school administrators in the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Input
                  placeholder="Search administrators..."
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

              {/* Admins Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Administrator</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdmins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {admin.firstName} {admin.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{admin.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{admin.school}</TableCell>
                        <TableCell>{admin.phone}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(admin.lastLogin).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={admin.isActive ? "default" : "secondary"}>
                            {admin.isActive ? 'Active' : 'Inactive'}
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
                              className={admin.isActive ? "text-red-600" : "text-green-600"}
                            >
                              {admin.isActive ? 'Disable' : 'Enable'}
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
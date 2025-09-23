'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, UpdateUserData, UserRole, Class } from '@/lib/types';

const editUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean(),
  employeeId: z.string().optional(),
  studentId: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.number().min(0).optional(),
  joiningDate: z.string().optional(),
  salary: z.number().min(0).optional(),
  primarySubject: z.string().optional(),
  classId: z.string().optional(),
  admissionNumber: z.string().optional(),
  admissionDate: z.string().optional(),
  rollNumber: z.string().optional(),
  previousSchool: z.string().optional(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserFormProps {
  user: User;
  onSubmit: (data: UpdateUserData) => Promise<void>;
  onCancel: () => void;
  classes: Class[];
  isLoading?: boolean;
}

export default function EditUserForm({ user, onSubmit, onCancel, classes, isLoading }: EditUserFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  const gender = watch('gender');
  const isActive = watch('isActive');
  const classId = watch('classId');

  useEffect(() => {
    // Pre-populate form with user data
    setValue('firstName', user.firstName);
    setValue('lastName', user.lastName);
    setValue('email', user.email);
    setValue('phoneNumber', user.phoneNumber || '');
    setValue('address', user.address || '');
    setValue('isActive', user.isActive);
    setValue('employeeId', user.employeeId || '');
    setValue('studentId', user.studentId || '');
    setValue('dateOfBirth', user.dateOfBirth || '');
    setValue('gender', user.gender || '');
    setValue('qualification', user.qualification || '');
    setValue('experience', user.experience || 0);
    setValue('joiningDate', user.joiningDate || '');
    setValue('salary', user.salary || 0);
    setValue('primarySubject', user.teachingSubjects?.[0]?.subject || '');
    setValue('classId', user.classId || '');
    setValue('admissionNumber', user.admissionNumber || '');
    setValue('admissionDate', user.admissionDate || '');
    setValue('rollNumber', user.rollNumber || '');
    setValue('previousSchool', user.previousSchool || '');
  }, [user, setValue]);

  const onFormSubmit = async (data: EditUserFormData) => {
    try {
      setSubmitError(null);

      const updateData: UpdateUserData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        isActive: data.isActive,
        employeeId: data.employeeId,
        studentId: data.studentId,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        qualification: data.qualification,
        experience: data.experience,
        joiningDate: data.joiningDate,
        salary: data.salary,
        teachingSubjects: data.primarySubject ? [{
          subject: data.primarySubject,
        }] : undefined,
        classId: data.classId,
        admissionNumber: data.admissionNumber,
        admissionDate: data.admissionDate,
        rollNumber: data.rollNumber,
        previousSchool: data.previousSchool,
      };

      await onSubmit(updateData);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to update user');
    }
  };

  const isTeacher = user.role === UserRole.TEACHER;
  const isStudent = user.role === UserRole.STUDENT;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-medium mb-3">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              placeholder="John"
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              {...register('lastName')}
              placeholder="Doe"
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="john.doe@school.edu"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              {...register('phoneNumber')}
              placeholder="+1 555-0123"
            />
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
            />
          </div>

          <div>
            <Label>Gender</Label>
            <Select value={gender} onValueChange={(value) => setValue('gender', value)}>
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
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...register('address')}
            placeholder="Full address"
          />
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setValue('isActive', !!checked)}
          />
          <Label htmlFor="isActive">User is active</Label>
        </div>
      </div>

      {/* Teacher-specific fields */}
      {isTeacher && (
        <div>
          <h3 className="text-lg font-medium mb-3">Professional Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                {...register('employeeId')}
                placeholder="T001"
              />
            </div>

            <div>
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                {...register('qualification')}
                placeholder="M.Sc Mathematics"
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience (Years)</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                {...register('experience', { valueAsNumber: true })}
                placeholder="5"
              />
            </div>

            <div>
              <Label htmlFor="joiningDate">Joining Date</Label>
              <Input
                id="joiningDate"
                type="date"
                {...register('joiningDate')}
              />
            </div>

            <div>
              <Label htmlFor="salary">Monthly Salary</Label>
              <Input
                id="salary"
                type="number"
                min="0"
                {...register('salary', { valueAsNumber: true })}
                placeholder="50000"
              />
            </div>

            <div>
              <Label htmlFor="primarySubject">Primary Subject</Label>
              <Input
                id="primarySubject"
                {...register('primarySubject')}
                placeholder="Mathematics"
              />
            </div>
          </div>
        </div>
      )}

      {/* Student-specific fields */}
      {isStudent && (
        <div>
          <h3 className="text-lg font-medium mb-3">Academic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                {...register('studentId')}
                placeholder="S001"
              />
            </div>

            <div>
              <Label htmlFor="admissionNumber">Admission Number</Label>
              <Input
                id="admissionNumber"
                {...register('admissionNumber')}
                placeholder="ADM001"
              />
            </div>

            <div>
              <Label htmlFor="admissionDate">Admission Date</Label>
              <Input
                id="admissionDate"
                type="date"
                {...register('admissionDate')}
              />
            </div>

            <div>
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                {...register('rollNumber')}
                placeholder="101"
              />
            </div>

            <div>
              <Label>Class</Label>
              <Select value={classId} onValueChange={(value) => setValue('classId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - {cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="previousSchool">Previous School</Label>
              <Input
                id="previousSchool"
                {...register('previousSchool')}
                placeholder="Previous school name"
              />
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{submitError}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update User'}
        </Button>
      </div>
    </form>
  );
}
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateStudentData, Class } from '@/lib/types';

const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  classId: z.string().min(1, 'Class is required'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  studentId: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  admissionNumber: z.string().optional(),
  admissionDate: z.string().optional(),
  rollNumber: z.string().optional(),
  previousSchool: z.string().optional(),
  // Parent details
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().email().optional().or(z.literal('')),
  // Medical info
  bloodGroup: z.string().optional(),
  emergencyContact: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface CreateStudentFormProps {
  onSubmit: (data: CreateStudentData) => Promise<void>;
  onCancel: () => void;
  classes: Class[];
  isLoading?: boolean;
}

export default function CreateStudentForm({ onSubmit, onCancel, classes, isLoading }: CreateStudentFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      admissionDate: new Date().toISOString().split('T')[0],
    },
  });

  const gender = watch('gender');
  const classId = watch('classId');
  const bloodGroup = watch('bloodGroup');

  const onFormSubmit = async (data: StudentFormData) => {
    try {
      setSubmitError(null);

      const studentData: CreateStudentData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        schoolId: '', // Will be set by the hook
        classId: data.classId,
        phoneNumber: data.phoneNumber,
        address: data.address,
        studentId: data.studentId,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        admissionNumber: data.admissionNumber,
        admissionDate: data.admissionDate,
        rollNumber: data.rollNumber,
        previousSchool: data.previousSchool,
        parentDetails: {
          fatherName: data.fatherName,
          motherName: data.motherName,
          guardianName: data.guardianName,
          contactNumber: data.guardianPhone,
          email: data.guardianEmail,
        },
        medicalInfo: {
          bloodGroup: data.bloodGroup,
          emergencyContact: data.emergencyContact,
        },
      };

      await onSubmit(studentData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create student';
      setSubmitError(errorMessage);
    }
  };

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
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
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
      </div>

      {/* Academic Information */}
      <div>
        <h3 className="text-lg font-medium mb-3">Academic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Class *</Label>
            <Select value={classId} onValueChange={(value) => setValue('classId', value)}>
              <SelectTrigger className={errors.classId ? 'border-red-500' : ''}>
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
            {errors.classId && <p className="text-sm text-red-600">{errors.classId.message}</p>}
          </div>

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
            <Label htmlFor="previousSchool">Previous School</Label>
            <Input
              id="previousSchool"
              {...register('previousSchool')}
              placeholder="Previous school name"
            />
          </div>
        </div>
      </div>

      {/* Parent/Guardian Information */}
      <div>
        <h3 className="text-lg font-medium mb-3">Parent/Guardian Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fatherName">Father&apos;s Name</Label>
            <Input
              id="fatherName"
              {...register('fatherName')}
              placeholder="Father&apos;s full name"
            />
          </div>

          <div>
            <Label htmlFor="motherName">Mother&apos;s Name</Label>
            <Input
              id="motherName"
              {...register('motherName')}
              placeholder="Mother&apos;s full name"
            />
          </div>

          <div>
            <Label htmlFor="guardianName">Guardian Name</Label>
            <Input
              id="guardianName"
              {...register('guardianName')}
              placeholder="Guardian&apos;s full name"
            />
          </div>

          <div>
            <Label htmlFor="guardianPhone">Guardian Phone</Label>
            <Input
              id="guardianPhone"
              {...register('guardianPhone')}
              placeholder="+1 555-0123"
            />
          </div>

          <div>
            <Label htmlFor="guardianEmail">Guardian Email</Label>
            <Input
              id="guardianEmail"
              type="email"
              {...register('guardianEmail')}
              placeholder="guardian@example.com"
            />
            {errors.guardianEmail && <p className="text-sm text-red-600">{errors.guardianEmail.message}</p>}
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div>
        <h3 className="text-lg font-medium mb-3">Medical Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Blood Group</Label>
            <Select value={bloodGroup} onValueChange={(value) => setValue('bloodGroup', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              {...register('emergencyContact')}
              placeholder="+1 555-0123"
            />
          </div>
        </div>
      </div>

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
          {isLoading ? 'Creating...' : 'Create Student'}
        </Button>
      </div>
    </form>
  );
}
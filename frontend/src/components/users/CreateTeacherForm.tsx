'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateTeacherData, Class } from '@/lib/types';

const teacherSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  employeeId: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.number().min(0).optional(),
  joiningDate: z.string().optional(),
  salary: z.number().min(0).optional(),
  primarySubject: z.string().optional(),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

interface CreateTeacherFormProps {
  onSubmit: (data: CreateTeacherData) => Promise<void>;
  onCancel: () => void;
  classes: Class[];
  isLoading?: boolean;
}

export default function CreateTeacherForm({ onSubmit, onCancel, classes, isLoading }: CreateTeacherFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      joiningDate: new Date().toISOString().split('T')[0],
    },
  });

  const gender = watch('gender');

  const onFormSubmit = async (data: TeacherFormData) => {
    try {
      setSubmitError(null);

      const teacherData: CreateTeacherData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        schoolId: '', // Will be set by the hook
        phoneNumber: data.phoneNumber,
        address: data.address,
        employeeId: data.employeeId,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        qualification: data.qualification,
        experience: data.experience,
        joiningDate: data.joiningDate,
        salary: data.salary,
        teachingSubjects: data.primarySubject ? [{
          subject: data.primarySubject,
        }] : undefined,
      };

      await onSubmit(teacherData);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to create teacher');
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

      {/* Professional Information */}
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
          {isLoading ? 'Creating...' : 'Create Teacher'}
        </Button>
      </div>
    </form>
  );
}
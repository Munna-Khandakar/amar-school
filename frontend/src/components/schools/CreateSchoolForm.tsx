'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateSchoolData } from '@/lib/types';

const schoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  website: z.string().optional(),
  adminId: z.string().min(1, 'Admin ID is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  termSystem: z.enum(['semester', 'trimester', 'quarterly']),
  gradeSystem: z.enum(['percentage', 'gpa', 'letter']),
  attendanceThreshold: z.number().min(0).max(100),
});

type SchoolFormData = z.infer<typeof schoolSchema>;

interface CreateSchoolFormProps {
  onSubmit: (data: CreateSchoolData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CreateSchoolForm({ onSubmit, onCancel, isLoading }: CreateSchoolFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      country: 'United States',
      termSystem: 'semester',
      gradeSystem: 'percentage',
      attendanceThreshold: 75,
      academicYear: '2024-2025',
    },
  });

  const termSystem = watch('termSystem');
  const gradeSystem = watch('gradeSystem');

  const onFormSubmit = async (data: SchoolFormData) => {
    try {
      setSubmitError(null);
      const schoolData: CreateSchoolData = {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode,
        phone: data.phone,
        email: data.email,
        website: data.website || undefined,
        adminId: data.adminId,
        settings: {
          academicYear: data.academicYear,
          termSystem: data.termSystem,
          gradeSystem: data.gradeSystem,
          attendanceThreshold: data.attendanceThreshold,
        },
      };

      await onSubmit(schoolData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create school';
      setSubmitError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>

        <div>
          <Label htmlFor="name">School Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter school name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="school@example.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="+1 (555) 123-4567"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            {...register('website')}
            placeholder="https://school.edu"
          />
        </div>

        <div>
          <Label htmlFor="adminId">School Admin ID *</Label>
          <Input
            id="adminId"
            {...register('adminId')}
            placeholder="Enter school admin user ID"
            className={errors.adminId ? 'border-red-500' : ''}
          />
          {errors.adminId && <p className="text-sm text-red-600">{errors.adminId.message}</p>}
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Address</h3>

        <div>
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            {...register('address')}
            placeholder="123 Main Street"
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="City"
              className={errors.city ? 'border-red-500' : ''}
            />
            {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
          </div>

          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              {...register('state')}
              placeholder="State"
              className={errors.state ? 'border-red-500' : ''}
            />
            {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              {...register('zipCode')}
              placeholder="12345"
              className={errors.zipCode ? 'border-red-500' : ''}
            />
            {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode.message}</p>}
          </div>

          <div>
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              {...register('country')}
              placeholder="Country"
              className={errors.country ? 'border-red-500' : ''}
            />
            {errors.country && <p className="text-sm text-red-600">{errors.country.message}</p>}
          </div>
        </div>
      </div>

      {/* Academic Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Academic Settings</h3>

        <div>
          <Label htmlFor="academicYear">Academic Year *</Label>
          <Input
            id="academicYear"
            {...register('academicYear')}
            placeholder="2024-2025"
            className={errors.academicYear ? 'border-red-500' : ''}
          />
          {errors.academicYear && <p className="text-sm text-red-600">{errors.academicYear.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Term System *</Label>
            <Select value={termSystem} onValueChange={(value) => setValue('termSystem', value as 'semester' | 'trimester' | 'quarterly')}>
              <SelectTrigger>
                <SelectValue placeholder="Select term system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semester">Semester</SelectItem>
                <SelectItem value="trimester">Trimester</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Grade System *</Label>
            <Select value={gradeSystem} onValueChange={(value) => setValue('gradeSystem', value as 'percentage' | 'gpa' | 'letter')}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="gpa">GPA</SelectItem>
                <SelectItem value="letter">Letter Grade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="attendanceThreshold">Attendance Threshold (%) *</Label>
          <Input
            id="attendanceThreshold"
            type="number"
            min="0"
            max="100"
            {...register('attendanceThreshold', { valueAsNumber: true })}
            placeholder="75"
            className={errors.attendanceThreshold ? 'border-red-500' : ''}
          />
          {errors.attendanceThreshold && (
            <p className="text-sm text-red-600">{errors.attendanceThreshold.message}</p>
          )}
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
          {isLoading ? 'Creating...' : 'Create School'}
        </Button>
      </div>
    </form>
  );
}
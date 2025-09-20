import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '../enums/user-role.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      delete ret.password;
      return ret;
    }
  }
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ type: Types.ObjectId, ref: 'School', required: false })
  schoolId?: Types.ObjectId;

  @Prop({ required: false })
  phoneNumber?: string;

  @Prop({ required: false })
  address?: string;

  @Prop({ required: false })
  profilePicture?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  lastLoginAt?: Date;

  // Additional fields for different roles
  @Prop({ required: false })
  employeeId?: string; // For teachers and admins

  @Prop({ required: false })
  studentId?: string; // For students

  @Prop({ required: false })
  dateOfBirth?: Date;

  @Prop({ required: false })
  gender?: string;

  @Prop([{ type: Types.ObjectId, ref: 'Class' }])
  assignedClasses?: Types.ObjectId[]; // For teachers

  @Prop({ type: Types.ObjectId, ref: 'Class', required: false })
  classId?: Types.ObjectId; // For students

  // Teacher specific fields
  @Prop({
    type: [{
      subject: { type: String, required: true },
      specialization: { type: String },
      experience: { type: Number, default: 0 }
    }],
    required: false
  })
  teachingSubjects?: {
    subject: string;
    specialization?: string;
    experience: number;
  }[];

  @Prop({ required: false })
  qualification?: string; // For teachers

  @Prop({ required: false })
  experience?: number; // Years of experience for teachers

  @Prop({ required: false })
  joiningDate?: Date; // For teachers and admins

  @Prop({ required: false })
  salary?: number; // For teachers and admins

  // Student specific fields
  @Prop({ required: false })
  admissionNumber?: string; // For students

  @Prop({ required: false })
  admissionDate?: Date; // For students

  @Prop({ required: false })
  rollNumber?: string; // For students

  @Prop({
    type: {
      fatherName: { type: String },
      motherName: { type: String },
      guardianName: { type: String },
      relationship: { type: String },
      contactNumber: { type: String },
      email: { type: String },
      address: { type: String }
    },
    required: false
  })
  parentDetails?: {
    fatherName?: string;
    motherName?: string;
    guardianName?: string;
    relationship?: string;
    contactNumber?: string;
    email?: string;
    address?: string;
  };

  @Prop({
    type: {
      bloodGroup: { type: String },
      allergies: [{ type: String }],
      medicalConditions: [{ type: String }],
      emergencyContact: { type: String }
    },
    required: false
  })
  medicalInfo?: {
    bloodGroup?: string;
    allergies?: string[];
    medicalConditions?: string[];
    emergencyContact?: string;
  };

  @Prop({ required: false })
  previousSchool?: string; // For students

  @Prop({
    type: [{
      documentType: { type: String, required: true },
      documentNumber: { type: String, required: true },
      fileUrl: { type: String }
    }],
    default: []
  })
  documents?: {
    documentType: string;
    documentNumber: string;
    fileUrl?: string;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create indexes for better performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ schoolId: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ classId: 1 });
UserSchema.index({ assignedClasses: 1 });
UserSchema.index({ employeeId: 1 });
UserSchema.index({ studentId: 1 });
UserSchema.index({ admissionNumber: 1 });
UserSchema.index({ isActive: 1 });
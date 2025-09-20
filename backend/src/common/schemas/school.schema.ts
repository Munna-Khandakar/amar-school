import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SchoolDocument = School & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})
export class School {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  state: string;

  @Prop({ required: true, trim: true })
  country: string;

  @Prop({ required: true, trim: true })
  zipCode: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ trim: true })
  website?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  adminId: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ 
    type: {
      monthlyLimit: { type: Number, default: 1000 },
      used: { type: Number, default: 0 },
      resetDate: { type: Date, default: () => new Date() }
    },
    default: () => ({
      monthlyLimit: 1000,
      used: 0,
      resetDate: new Date()
    })
  })
  smsQuota: {
    monthlyLimit: number;
    used: number;
    resetDate: Date;
  };

  @Prop({
    type: {
      academicYear: { type: String, required: true },
      termSystem: { type: String, enum: ['semester', 'trimester', 'quarterly'], default: 'semester' },
      gradeSystem: { type: String, enum: ['percentage', 'gpa', 'letter'], default: 'percentage' },
      attendanceThreshold: { type: Number, default: 75 }
    },
    required: true
  })
  settings: {
    academicYear: string;
    termSystem: 'semester' | 'trimester' | 'quarterly';
    gradeSystem: 'percentage' | 'gpa' | 'letter';
    attendanceThreshold: number;
  };

  @Prop({ type: [String], default: [] })
  allowedDomains: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const SchoolSchema = SchemaFactory.createForClass(School);

// Create indexes for better performance
SchoolSchema.index({ email: 1 }, { unique: true });
SchoolSchema.index({ adminId: 1 });
SchoolSchema.index({ isActive: 1 });
SchoolSchema.index({ createdAt: -1 });
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused'
}

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
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Class', required: true })
  classId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  schoolId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  markedBy: Types.ObjectId; // Teacher who marked attendance

  @Prop({ required: true })
  date: Date;

  @Prop({
    type: String,
    enum: Object.values(AttendanceStatus),
    required: true
  })
  status: AttendanceStatus;

  @Prop({ required: false, trim: true })
  remarks?: string;

  @Prop({ required: false })
  timeIn?: Date; // When student arrived (for late arrivals)

  @Prop({ required: false })
  timeOut?: Date; // When student left early

  @Prop({
    type: {
      period: { type: Number }, // Which period (1, 2, 3, etc.)
      subject: { type: String },
      startTime: { type: String },
      endTime: { type: String }
    },
    required: false
  })
  periodDetails?: {
    period: number;
    subject: string;
    startTime: string;
    endTime: string;
  };

  @Prop({ default: false })
  isHalfDay: boolean; // For half-day attendance

  @Prop({ default: false })
  isNotified: boolean; // SMS notification sent to parent

  @Prop({ required: false, trim: true })
  parentNotificationMessage?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

// Create compound indexes for better performance
AttendanceSchema.index({ studentId: 1, date: 1, classId: 1 }, { unique: true });
AttendanceSchema.index({ classId: 1, date: 1 });
AttendanceSchema.index({ schoolId: 1, date: 1 });
AttendanceSchema.index({ markedBy: 1, date: 1 });
AttendanceSchema.index({ status: 1 });
AttendanceSchema.index({ date: -1 });
AttendanceSchema.index({ isNotified: 1 });
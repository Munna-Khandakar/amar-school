import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClassDocument = Class & Document;

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
export class Class {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  section: string;

  @Prop({ required: true })
  grade: number;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  schoolId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  classTeacher: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  subjectTeachers: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  students: Types.ObjectId[];

  @Prop({ required: true })
  academicYear: string;

  @Prop({
    type: [{
      name: { type: String, required: true },
      code: { type: String, required: true },
      teacher: { type: Types.ObjectId, ref: 'User', required: true },
      credits: { type: Number, default: 1 }
    }],
    default: []
  })
  subjects: {
    name: string;
    code: string;
    teacher: Types.ObjectId;
    credits: number;
  }[];

  @Prop({
    type: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      days: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }]
    },
    required: true
  })
  schedule: {
    startTime: string;
    endTime: string;
    days: string[];
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Number, default: 0 })
  capacity: number;

  @Prop({ trim: true })
  description?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ClassSchema = SchemaFactory.createForClass(Class);

// Create indexes for better performance
ClassSchema.index({ schoolId: 1 });
ClassSchema.index({ classTeacher: 1 });
ClassSchema.index({ students: 1 });
ClassSchema.index({ academicYear: 1 });
ClassSchema.index({ grade: 1 });
ClassSchema.index({ isActive: 1 });
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubjectDocument = Subject & Document;

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
export class Subject {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, uppercase: true })
  code: string;

  @Prop({ required: false, trim: true })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  schoolId: Types.ObjectId;

  @Prop({ required: true })
  grade: number; // Which grade this subject is for

  @Prop({ required: true })
  credits: number; // Credit hours for the subject

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isOptional: boolean; // Whether the subject is optional

  @Prop({
    type: {
      theory: { type: Number, default: 70 }, // Theory percentage
      practical: { type: Number, default: 30 }, // Practical percentage
      internal: { type: Number, default: 25 }, // Internal assessment percentage
      external: { type: Number, default: 75 } // External assessment percentage
    },
    required: true
  })
  markingScheme: {
    theory: number;
    practical: number;
    internal: number;
    external: number;
  };

  @Prop({
    type: {
      passPercentage: { type: Number, default: 35 },
      maxMarks: { type: Number, default: 100 },
      gradeSystem: { type: String, enum: ['percentage', 'gpa', 'letter'], default: 'percentage' }
    },
    required: true
  })
  gradingCriteria: {
    passPercentage: number;
    maxMarks: number;
    gradeSystem: string;
  };

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  teachers: Types.ObjectId[]; // Teachers assigned to this subject

  @Prop({
    type: [{
      grade: { type: String, required: true },
      minPercentage: { type: Number, required: true },
      maxPercentage: { type: Number, required: true },
      gpaValue: { type: Number, required: false }
    }],
    default: [
      { grade: 'A+', minPercentage: 90, maxPercentage: 100, gpaValue: 4.0 },
      { grade: 'A', minPercentage: 80, maxPercentage: 89, gpaValue: 3.5 },
      { grade: 'B+', minPercentage: 70, maxPercentage: 79, gpaValue: 3.0 },
      { grade: 'B', minPercentage: 60, maxPercentage: 69, gpaValue: 2.5 },
      { grade: 'C+', minPercentage: 50, maxPercentage: 59, gpaValue: 2.0 },
      { grade: 'C', minPercentage: 40, maxPercentage: 49, gpaValue: 1.5 },
      { grade: 'D', minPercentage: 35, maxPercentage: 39, gpaValue: 1.0 },
      { grade: 'F', minPercentage: 0, maxPercentage: 34, gpaValue: 0.0 }
    ]
  })
  gradeScale: {
    grade: string;
    minPercentage: number;
    maxPercentage: number;
    gpaValue?: number;
  }[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);

// Create indexes for better performance
SubjectSchema.index({ schoolId: 1, grade: 1 });
SubjectSchema.index({ code: 1, schoolId: 1 }, { unique: true });
SubjectSchema.index({ name: 1, schoolId: 1 });
SubjectSchema.index({ isActive: 1 });
SubjectSchema.index({ teachers: 1 });
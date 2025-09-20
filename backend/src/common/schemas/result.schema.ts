import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResultDocument = Result & Document;

export enum AssessmentType {
  QUIZ = 'quiz',
  TEST = 'test',
  MIDTERM = 'midterm',
  FINAL = 'final',
  PROJECT = 'project',
  ASSIGNMENT = 'assignment',
  PRACTICAL = 'practical',
  ORAL = 'oral'
}

export enum GradeSystem {
  PERCENTAGE = 'percentage',
  GPA = 'gpa',
  LETTER = 'letter'
}

export enum Term {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third',
  ANNUAL = 'annual'
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
export class Result {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Class', required: true })
  classId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School', required: true })
  schoolId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teacherId: Types.ObjectId; // Teacher who entered the marks

  @Prop({ required: true, trim: true })
  subject: string;

  @Prop({ required: true, trim: true })
  subjectCode: string;

  @Prop({
    type: String,
    enum: Object.values(AssessmentType),
    required: true
  })
  assessmentType: AssessmentType;

  @Prop({ required: true, trim: true })
  assessmentName: string; // e.g., "Math Quiz 1", "Science Final Exam"

  @Prop({ required: true })
  marksObtained: number;

  @Prop({ required: true })
  totalMarks: number;

  @Prop({ required: true })
  percentage: number; // Auto-calculated: (marksObtained/totalMarks)*100

  @Prop({ required: false })
  grade?: string; // A+, A, B+, etc. or GPA value

  @Prop({ required: false })
  gpa?: number; // Grade Point Average

  @Prop({
    type: String,
    enum: Object.values(Term),
    required: true
  })
  term: Term;

  @Prop({ required: true })
  academicYear: string;

  @Prop({ required: true })
  examDate: Date;

  @Prop({ required: false, trim: true })
  remarks?: string;

  @Prop({
    type: {
      weightage: { type: Number, required: true }, // Percentage weightage in final grade
      category: { type: String, required: true } // "Internal", "External", etc.
    },
    required: true
  })
  grading: {
    weightage: number;
    category: string;
  };

  @Prop({ default: false })
  isPublished: boolean; // Whether results are visible to students

  @Prop({ default: false })
  isNotified: boolean; // SMS notification sent to parent

  @Prop({ required: false, trim: true })
  parentNotificationMessage?: string;

  @Prop({
    type: [{
      date: { type: Date, required: true },
      oldMarks: { type: Number, required: true },
      newMarks: { type: Number, required: true },
      reason: { type: String, required: true },
      updatedBy: { type: Types.ObjectId, ref: 'User', required: true }
    }],
    default: []
  })
  revisionHistory: {
    date: Date;
    oldMarks: number;
    newMarks: number;
    reason: string;
    updatedBy: Types.ObjectId;
  }[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ResultSchema = SchemaFactory.createForClass(Result);

// Create compound indexes for better performance
ResultSchema.index({ studentId: 1, subject: 1, assessmentType: 1, term: 1, academicYear: 1 });
ResultSchema.index({ classId: 1, subject: 1, term: 1, academicYear: 1 });
ResultSchema.index({ schoolId: 1, term: 1, academicYear: 1 });
ResultSchema.index({ teacherId: 1, subject: 1 });
ResultSchema.index({ isPublished: 1 });
ResultSchema.index({ examDate: -1 });
ResultSchema.index({ percentage: -1 });
ResultSchema.index({ gpa: -1 });
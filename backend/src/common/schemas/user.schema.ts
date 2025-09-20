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
}

export const UserSchema = SchemaFactory.createForClass(User);
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';
import { User, UserSchema } from '../common/schemas/user.schema';
import { School, SchoolSchema } from '../common/schemas/school.schema';
import { Class, ClassSchema } from '../common/schemas/class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: School.name, schema: SchoolSchema },
      { name: Class.name, schema: ClassSchema }
    ])
  ],
  controllers: [UserManagementController],
  providers: [UserManagementService],
  exports: [UserManagementService]
})
export class UserManagementModule {}
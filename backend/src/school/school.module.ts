import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { School, SchoolSchema } from '../common/schemas/school.schema';
import { User, UserSchema } from '../common/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [SchoolController],
  providers: [SchoolService],
  exports: [SchoolService]
})
export class SchoolModule {}
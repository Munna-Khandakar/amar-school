import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { Result, ResultSchema } from '../common/schemas/result.schema';
import { Subject, SubjectSchema } from '../common/schemas/subject.schema';
import { User, UserSchema } from '../common/schemas/user.schema';
import { Class, ClassSchema } from '../common/schemas/class.schema';
import { School, SchoolSchema } from '../common/schemas/school.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Result.name, schema: ResultSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: User.name, schema: UserSchema },
      { name: Class.name, schema: ClassSchema },
      { name: School.name, schema: SchoolSchema }
    ])
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
  exports: [ResultsService]
})
export class ResultsModule {}
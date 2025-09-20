import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './services/seed.service';
import { User, UserSchema } from './schemas/user.schema';
import { School, SchoolSchema } from './schemas/school.schema';
import { Class, ClassSchema } from './schemas/class.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: School.name, schema: SchoolSchema },
      { name: Class.name, schema: ClassSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
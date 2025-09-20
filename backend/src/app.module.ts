import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SchoolModule } from './school/school.module';
import { UserManagementModule } from './user-management/user-management.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ResultsModule } from './results/results.module';
import { SeedModule } from './common/seed.module';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      load: [databaseConfig, appConfig],
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Database
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        ...configService.get('database.options'),
      }),
      inject: [ConfigService],
    }),
    
    // Modules
    AuthModule,
    SchoolModule,
    UserManagementModule,
    AttendanceModule,
    ResultsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
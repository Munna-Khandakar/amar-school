import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from '../schemas/user.schema';
import { School, SchoolDocument } from '../schemas/school.schema';
import { Class, ClassDocument } from '../schemas/class.schema';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const shouldSeed = this.configService.get<string>('NODE_ENV') === 'development';
    if (shouldSeed) {
      await this.seedDemoData();
    }
  }

  async seedDemoData() {
    try {
      this.logger.log('Starting minimal database seeding...');

      // Check if super admin already exists
      const existingSuperAdmin = await this.userModel.findOne({ email: 'superadmin@amarschool.com' });

      if (!existingSuperAdmin) {
        await this.createSuperAdmin();
        this.logger.log('Super Admin created');
      }

      // Check if demo school exists
      const existingSchool = await this.schoolModel.findOne({ name: 'Demo High School' });
      let demoSchool;

      if (!existingSchool) {
        demoSchool = await this.createDemoSchool();
        this.logger.log('Demo school created');
      } else {
        demoSchool = existingSchool;
      }

      // Check if demo school admin exists
      const existingSchoolAdmin = await this.userModel.findOne({ email: 'schooladmin@amarschool.com' });

      if (!existingSchoolAdmin) {
        await this.createSchoolAdmin(demoSchool._id.toString());
        this.logger.log('Demo school admin created');
      } else if (!existingSchoolAdmin.schoolId) {
        // Update existing school admin with schoolId
        await this.userModel.findByIdAndUpdate(existingSchoolAdmin._id, {
          schoolId: demoSchool._id
        });
        this.logger.log('Demo school admin updated with schoolId');
      }

      // Check if demo teacher exists
      const existingTeacher = await this.userModel.findOne({ email: 'teacher@amarschool.com' });

      if (!existingTeacher) {
        await this.createDemoTeacher(demoSchool._id.toString());
        this.logger.log('Demo teacher created');
      } else if (!existingTeacher.schoolId) {
        // Update existing teacher with schoolId
        await this.userModel.findByIdAndUpdate(existingTeacher._id, {
          schoolId: demoSchool._id
        });
        this.logger.log('Demo teacher updated with schoolId');
      }

      // Check if demo student exists
      const existingStudent = await this.userModel.findOne({ email: 'student1@amarschool.com' });

      if (!existingStudent) {
        await this.createDemoStudentWithSchool(demoSchool._id.toString());
        this.logger.log('Demo student created');
      } else if (!existingStudent.schoolId) {
        // Update existing student with schoolId
        await this.userModel.findByIdAndUpdate(existingStudent._id, {
          schoolId: demoSchool._id
        });
        this.logger.log('Demo student updated with schoolId');
      }

      // Check if demo classes exist
      const existingClasses = await this.classModel.find({ schoolId: demoSchool._id });

      if (existingClasses.length === 0) {
        await this.createDemoClasses(demoSchool._id.toString());
        this.logger.log('Demo classes created');
      }

      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Database seeding failed:', error);
    }
  }

  private async createSuperAdmin() {
    const hashedPassword = await bcrypt.hash('SuperAdmin123!', 10);

    const superAdmin = new this.userModel({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@amarschool.com',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      isEmailVerified: true,
    });

    await superAdmin.save();
  }

  private async createSimpleTeacher() {
    const hashedPassword = await bcrypt.hash('Teacher123!', 10);

    const teacher = new this.userModel({
      firstName: 'John',
      lastName: 'Smith',
      email: 'teacher@amarschool.com',
      password: hashedPassword,
      role: UserRole.TEACHER,
      employeeId: 'TEACH001',
      department: 'Mathematics',
      qualification: 'M.Sc. Mathematics',
      experience: 5,
      isActive: true,
      isEmailVerified: true,
    });

    await teacher.save();
  }

  private async createSimpleSchoolAdmin() {
    const hashedPassword = await bcrypt.hash('SchoolAdmin123!', 10);

    const schoolAdmin = new this.userModel({
      firstName: 'School',
      lastName: 'Admin',
      email: 'schooladmin@amarschool.com',
      password: hashedPassword,
      role: UserRole.SCHOOL_ADMIN,
      employeeId: 'EMP001',
      isActive: true,
      isEmailVerified: true,
    });

    await schoolAdmin.save();
  }

  private async createDemoStudentWithSchool(schoolId: string) {
    const hashedPassword = await bcrypt.hash('Student123!', 10);

    const student = new this.userModel({
      firstName: 'Alex',
      lastName: 'Smith',
      email: 'student1@amarschool.com',
      password: hashedPassword,
      role: UserRole.STUDENT,
      schoolId: schoolId,
      studentId: 'S001',
      rollNumber: '001',
      admissionNumber: 'ADM001',
      admissionDate: new Date(),
      isActive: true,
      isEmailVerified: true,
    });

    await student.save();
  }

  private async createDemoSchool() {
    // First create the super admin to use as adminId
    const superAdmin = await this.userModel.findOne({ email: 'superadmin@amarschool.com' });

    const demoSchool = new this.schoolModel({
      name: 'Demo High School',
      email: 'demo@amarschool.com',
      phone: '+1234567890',
      address: '123 Education Street',
      city: 'Demo City',
      state: 'Demo State',
      zipCode: '12345',
      country: 'Demo Country',
      adminId: superAdmin._id,
      isActive: true,
      settings: {
        academicYear: '2024-25',
        termSystem: 'semester',
        gradeSystem: 'percentage',
        attendanceThreshold: 75
      }
    });

    return await demoSchool.save();
  }

  private async createSchoolAdmin(schoolId: string) {
    const hashedPassword = await bcrypt.hash('SchoolAdmin123!', 10);

    const schoolAdmin = new this.userModel({
      firstName: 'School',
      lastName: 'Admin',
      email: 'schooladmin@amarschool.com',
      password: hashedPassword,
      role: UserRole.SCHOOL_ADMIN,
      schoolId: schoolId,
      employeeId: 'EMP001',
      isActive: true,
      isEmailVerified: true,
    });

    await schoolAdmin.save();
  }

  private async createDemoTeacher(schoolId: string) {
    const hashedPassword = await bcrypt.hash('Teacher123!', 10);

    const teacher = new this.userModel({
      firstName: 'John',
      lastName: 'Smith',
      email: 'teacher@amarschool.com',
      password: hashedPassword,
      role: UserRole.TEACHER,
      schoolId: schoolId,
      employeeId: 'TEACH001',
      department: 'Mathematics',
      qualification: 'M.Sc. Mathematics',
      experience: 5,
      isActive: true,
      isEmailVerified: true,
    });

    return await teacher.save();
  }

  private async createDemoClasses(schoolId: string) {
    const teacher = await this.userModel.findOne({
      email: 'teacher@amarschool.com',
      role: UserRole.TEACHER
    });

    if (!teacher) return;

    const classes = [
      {
        name: 'Grade 10-A',
        section: 'A',
        grade: 10,
        academicYear: '2024-25',
        capacity: 35,
        schoolId: schoolId,
        classTeacher: teacher._id,
        subjectTeachers: [teacher._id],
        subjects: [
          { name: 'Mathematics', code: 'MATH10', teacher: teacher._id, credits: 4 },
          { name: 'Physics', code: 'PHY10', teacher: teacher._id, credits: 4 },
          { name: 'Chemistry', code: 'CHEM10', teacher: teacher._id, credits: 4 },
          { name: 'English', code: 'ENG10', teacher: teacher._id, credits: 3 },
          { name: 'Biology', code: 'BIO10', teacher: teacher._id, credits: 4 }
        ],
        schedule: {
          startTime: '08:00',
          endTime: '15:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      },
      {
        name: 'Grade 11-B',
        section: 'B',
        grade: 11,
        academicYear: '2024-25',
        capacity: 30,
        schoolId: schoolId,
        classTeacher: teacher._id,
        subjectTeachers: [teacher._id],
        subjects: [
          { name: 'Mathematics', code: 'MATH11', teacher: teacher._id, credits: 4 },
          { name: 'Physics', code: 'PHY11', teacher: teacher._id, credits: 4 },
          { name: 'Chemistry', code: 'CHEM11', teacher: teacher._id, credits: 4 },
          { name: 'English', code: 'ENG11', teacher: teacher._id, credits: 3 }
        ],
        schedule: {
          startTime: '08:00',
          endTime: '15:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      },
      {
        name: 'Grade 9-C',
        section: 'C',
        grade: 9,
        academicYear: '2024-25',
        capacity: 40,
        schoolId: schoolId,
        classTeacher: teacher._id,
        subjectTeachers: [teacher._id],
        subjects: [
          { name: 'Mathematics', code: 'MATH9', teacher: teacher._id, credits: 4 },
          { name: 'Science', code: 'SCI9', teacher: teacher._id, credits: 4 },
          { name: 'English', code: 'ENG9', teacher: teacher._id, credits: 3 },
          { name: 'Social Studies', code: 'SS9', teacher: teacher._id, credits: 3 }
        ],
        schedule: {
          startTime: '08:00',
          endTime: '15:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      }
    ];

    const savedClasses = await this.classModel.insertMany(classes);

    // Update teacher with assigned classes
    await this.userModel.findByIdAndUpdate(teacher._id, {
      assignedClasses: savedClasses.map(cls => cls._id)
    });
  }

  private async createDemoStudents(schoolId: string) {
    const classes = await this.classModel.find({ schoolId });

    if (classes.length === 0) return;

    const students = [];
    let studentCounter = 1;

    for (const cls of classes) {
      // Create 5 students per class
      for (let i = 1; i <= 5; i++) {
        const hashedPassword = await bcrypt.hash('Student123!', 10);

        const student = {
          firstName: `Student${studentCounter}`,
          lastName: `Last${studentCounter}`,
          email: `student${studentCounter}@amarschool.com`,
          password: hashedPassword,
          role: UserRole.STUDENT,
          schoolId: schoolId,
          classId: cls._id,
          studentId: `S${studentCounter.toString().padStart(3, '0')}`,
          rollNumber: i.toString().padStart(3, '0'),
          admissionNumber: `ADM${studentCounter.toString().padStart(3, '0')}`,
          admissionDate: new Date(),
          isActive: true,
          isEmailVerified: true,
        };

        students.push(student);
        studentCounter++;
      }
    }

    const savedStudents = await this.userModel.insertMany(students);

    // Update classes with students
    for (const cls of classes) {
      const classStudents = savedStudents.filter(student =>
        student.classId.toString() === cls._id.toString()
      );

      await this.classModel.findByIdAndUpdate(cls._id, {
        students: classStudents.map(student => student._id)
      });
    }
  }
}
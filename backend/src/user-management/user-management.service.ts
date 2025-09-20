import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../common/schemas/user.schema';
import { School, SchoolDocument } from '../common/schemas/school.schema';
import { Class, ClassDocument } from '../common/schemas/class.schema';
import { CreateTeacherDto, CreateStudentDto, UpdateUserDto, CreateClassDto } from '../common/dto/user-management.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class UserManagementService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
  ) {}

  async createTeacher(createTeacherDto: CreateTeacherDto, requestingUserId: string): Promise<User> {
    // Verify requesting user is school admin and has access to this school
    const requestingUser = await this.userModel.findById(requestingUserId);
    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    if (requestingUser.role !== UserRole.SCHOOL_ADMIN && requestingUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only school admins can create teachers');
    }

    if (requestingUser.role === UserRole.SCHOOL_ADMIN && requestingUser.schoolId?.toString() !== createTeacherDto.schoolId) {
      throw new ForbiddenException('You can only create teachers for your own school');
    }

    // Check if school exists
    const school = await this.schoolModel.findById(createTeacherDto.schoolId);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Check if email already exists
    const existingUser = await this.userModel.findOne({ email: createTeacherDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createTeacherDto.password, 10);

    // Create teacher
    const teacher = new this.userModel({
      ...createTeacherDto,
      password: hashedPassword,
      role: UserRole.TEACHER,
      schoolId: createTeacherDto.schoolId
    });

    return await teacher.save();
  }

  async createStudent(createStudentDto: CreateStudentDto, requestingUserId: string): Promise<User> {
    // Verify requesting user is school admin and has access to this school
    const requestingUser = await this.userModel.findById(requestingUserId);
    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    if (requestingUser.role !== UserRole.SCHOOL_ADMIN && requestingUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only school admins can create students');
    }

    if (requestingUser.role === UserRole.SCHOOL_ADMIN && requestingUser.schoolId?.toString() !== createStudentDto.schoolId) {
      throw new ForbiddenException('You can only create students for your own school');
    }

    // Check if school exists
    const school = await this.schoolModel.findById(createStudentDto.schoolId);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Check if class exists and belongs to the school
    const classEntity = await this.classModel.findById(createStudentDto.classId);
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }
    if (classEntity.schoolId.toString() !== createStudentDto.schoolId) {
      throw new BadRequestException('Class does not belong to the specified school');
    }

    // Check if email already exists
    const existingUser = await this.userModel.findOne({ email: createStudentDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

    // Create student
    const student = new this.userModel({
      ...createStudentDto,
      password: hashedPassword,
      role: UserRole.STUDENT,
      schoolId: createStudentDto.schoolId
    });

    const savedStudent = await student.save();

    // Add student to class
    await this.classModel.findByIdAndUpdate(
      createStudentDto.classId,
      { $addToSet: { students: savedStudent._id } }
    );

    return savedStudent;
  }

  async getSchoolUsers(schoolId: string, role: UserRole, requestingUserId: string, page: number = 1, limit: number = 10, search?: string): Promise<{
    users: User[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    // Verify requesting user has access to this school
    const requestingUser = await this.userModel.findById(requestingUserId);
    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    if (requestingUser.role === UserRole.SCHOOL_ADMIN && requestingUser.schoolId?.toString() !== schoolId) {
      throw new ForbiddenException('You can only view users from your own school');
    }

    const skip = (page - 1) * limit;
    const searchQuery = search
      ? {
          schoolId: schoolId,
          role: role,
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { employeeId: { $regex: search, $options: 'i' } },
            { studentId: { $regex: search, $options: 'i' } }
          ]
        }
      : { schoolId: schoolId, role: role };

    const [users, total] = await Promise.all([
      this.userModel
        .find(searchQuery)
        .populate('classId', 'name section grade')
        .populate('assignedClasses', 'name section grade')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(searchQuery)
    ]);

    return {
      users,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  async getUserById(id: string, requestingUserId: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel
      .findById(id)
      .populate('schoolId', 'name email')
      .populate('classId', 'name section grade')
      .populate('assignedClasses', 'name section grade')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify requesting user has access to this user
    const requestingUser = await this.userModel.findById(requestingUserId);
    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    if (requestingUser.role === UserRole.SCHOOL_ADMIN && requestingUser.schoolId?.toString() !== user.schoolId?.toString()) {
      throw new ForbiddenException('You can only view users from your own school');
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, requestingUserId: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify requesting user has access to this user
    const requestingUser = await this.userModel.findById(requestingUserId);
    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    if (requestingUser.role === UserRole.SCHOOL_ADMIN && requestingUser.schoolId?.toString() !== user.schoolId?.toString()) {
      throw new ForbiddenException('You can only update users from your own school');
    }

    // Check if email is being updated and if it conflicts
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        email: updateUserDto.email,
        _id: { $ne: id }
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .populate('schoolId', 'name email')
      .populate('classId', 'name section grade')
      .populate('assignedClasses', 'name section grade')
      .exec();

    return updatedUser!;
  }

  async deleteUser(id: string, requestingUserId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify requesting user has access to this user
    const requestingUser = await this.userModel.findById(requestingUserId);
    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    if (requestingUser.role === UserRole.SCHOOL_ADMIN && requestingUser.schoolId?.toString() !== user.schoolId?.toString()) {
      throw new ForbiddenException('You can only delete users from your own school');
    }

    // Remove user from classes if student
    if (user.role === UserRole.STUDENT && user.classId) {
      await this.classModel.findByIdAndUpdate(
        user.classId,
        { $pull: { students: user._id } }
      );
    }

    // Remove teacher from classes if teacher
    if (user.role === UserRole.TEACHER && user.assignedClasses) {
      await this.classModel.updateMany(
        { _id: { $in: user.assignedClasses } },
        { $pull: { subjectTeachers: user._id } }
      );
    }

    await this.userModel.findByIdAndDelete(id);
  }

  async createClass(createClassDto: CreateClassDto, requestingUserId: string): Promise<Class> {
    // Verify requesting user is school admin and has access to this school
    const requestingUser = await this.userModel.findById(requestingUserId);
    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    if (requestingUser.role !== UserRole.SCHOOL_ADMIN && requestingUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only school admins can create classes');
    }

    if (requestingUser.role === UserRole.SCHOOL_ADMIN && requestingUser.schoolId?.toString() !== createClassDto.schoolId) {
      throw new ForbiddenException('You can only create classes for your own school');
    }

    // Check if school exists
    const school = await this.schoolModel.findById(createClassDto.schoolId);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Check if class teacher exists and is a teacher
    const classTeacher = await this.userModel.findById(createClassDto.classTeacher);
    if (!classTeacher || classTeacher.role !== UserRole.TEACHER) {
      throw new BadRequestException('Class teacher must be a valid teacher');
    }

    // Create class
    const classEntity = new this.classModel(createClassDto);
    const savedClass = await classEntity.save();

    // Add class to teacher's assigned classes
    await this.userModel.findByIdAndUpdate(
      createClassDto.classTeacher,
      { $addToSet: { assignedClasses: savedClass._id } }
    );

    return savedClass;
  }

  async getSchoolClasses(schoolId: string, requestingUserId: string): Promise<Class[]> {
    // Verify requesting user has access to this school
    const requestingUser = await this.userModel.findById(requestingUserId);
    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    if (requestingUser.role === UserRole.SCHOOL_ADMIN && requestingUser.schoolId?.toString() !== schoolId) {
      throw new ForbiddenException('You can only view classes from your own school');
    }

    return await this.classModel
      .find({ schoolId })
      .populate('classTeacher', 'firstName lastName email')
      .populate('subjectTeachers', 'firstName lastName email')
      .populate('students', 'firstName lastName email studentId')
      .sort({ grade: 1, section: 1 })
      .exec();
  }

  async getSchoolStats(schoolId: string, requestingUserId: string): Promise<{
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    activeStudents: number;
    activeTeachers: number;
    classesWithCapacity: number;
  }> {
    // Verify requesting user has access to this school
    const requestingUser = await this.userModel.findById(requestingUserId);
    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    if (requestingUser.role === UserRole.SCHOOL_ADMIN && requestingUser.schoolId?.toString() !== schoolId) {
      throw new ForbiddenException('You can only view stats from your own school');
    }

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      activeStudents,
      activeTeachers,
      classesWithCapacity
    ] = await Promise.all([
      this.userModel.countDocuments({ schoolId, role: UserRole.STUDENT }),
      this.userModel.countDocuments({ schoolId, role: UserRole.TEACHER }),
      this.classModel.countDocuments({ schoolId }),
      this.userModel.countDocuments({ schoolId, role: UserRole.STUDENT, isActive: true }),
      this.userModel.countDocuments({ schoolId, role: UserRole.TEACHER, isActive: true }),
      this.classModel.countDocuments({ schoolId, capacity: { $gt: 0 } })
    ]);

    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      activeStudents,
      activeTeachers,
      classesWithCapacity
    };
  }
}
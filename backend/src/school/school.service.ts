import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { School, SchoolDocument } from '../common/schemas/school.schema';
import { User, UserDocument } from '../common/schemas/user.schema';
import { CreateSchoolDto, UpdateSchoolDto, UpdateSmsQuotaDto } from '../common/dto/school.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    // Check if school with email already exists
    const existingSchool = await this.schoolModel.findOne({ email: createSchoolDto.email });
    if (existingSchool) {
      throw new ConflictException('School with this email already exists');
    }

    // Verify admin user exists and has SCHOOL_ADMIN role
    const admin = await this.userModel.findById(createSchoolDto.adminId);
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }
    if (admin.role !== UserRole.SCHOOL_ADMIN) {
      throw new BadRequestException('User must have SCHOOL_ADMIN role to be assigned as school admin');
    }
    if (admin.schoolId) {
      throw new ConflictException('Admin is already assigned to another school');
    }

    // Create school
    const school = new this.schoolModel(createSchoolDto);
    const savedSchool = await school.save();

    // Update admin user's schoolId
    await this.userModel.findByIdAndUpdate(
      createSchoolDto.adminId,
      { schoolId: savedSchool._id }
    );

    return savedSchool;
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{
    schools: School[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;
    const searchQuery = search 
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const [schools, total] = await Promise.all([
      this.schoolModel
        .find(searchQuery)
        .populate('adminId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.schoolModel.countDocuments(searchQuery)
    ]);

    return {
      schools,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  async findOne(id: string): Promise<School> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid school ID');
    }

    const school = await this.schoolModel
      .findById(id)
      .populate('adminId', 'firstName lastName email phone')
      .exec();

    if (!school) {
      throw new NotFoundException('School not found');
    }

    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid school ID');
    }

    // Check if email is being updated and if it conflicts
    if (updateSchoolDto.email) {
      const existingSchool = await this.schoolModel.findOne({
        email: updateSchoolDto.email,
        _id: { $ne: id }
      });
      if (existingSchool) {
        throw new ConflictException('School with this email already exists');
      }
    }

    const updatedSchool = await this.schoolModel
      .findByIdAndUpdate(id, updateSchoolDto, { new: true })
      .populate('adminId', 'firstName lastName email phone')
      .exec();

    if (!updatedSchool) {
      throw new NotFoundException('School not found');
    }

    return updatedSchool;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid school ID');
    }

    const school = await this.schoolModel.findById(id);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    // Remove school reference from admin user
    await this.userModel.findByIdAndUpdate(
      school.adminId,
      { $unset: { schoolId: 1 } }
    );

    // Remove school reference from all users in this school
    await this.userModel.updateMany(
      { schoolId: id },
      { $unset: { schoolId: 1 } }
    );

    await this.schoolModel.findByIdAndDelete(id);
  }

  async updateSmsQuota(id: string, updateSmsQuotaDto: UpdateSmsQuotaDto): Promise<School> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid school ID');
    }

    const updatedSchool = await this.schoolModel
      .findByIdAndUpdate(
        id,
        {
          'smsQuota.monthlyLimit': updateSmsQuotaDto.monthlyLimit,
          'smsQuota.resetDate': new Date()
        },
        { new: true }
      )
      .populate('adminId', 'firstName lastName email')
      .exec();

    if (!updatedSchool) {
      throw new NotFoundException('School not found');
    }

    return updatedSchool;
  }

  async incrementSmsUsage(schoolId: string, count: number = 1): Promise<void> {
    if (!Types.ObjectId.isValid(schoolId)) {
      throw new BadRequestException('Invalid school ID');
    }

    await this.schoolModel.findByIdAndUpdate(
      schoolId,
      { $inc: { 'smsQuota.used': count } }
    );
  }

  async resetMonthlySmsUsage(): Promise<void> {
    // Reset SMS usage for all schools at the beginning of each month
    await this.schoolModel.updateMany(
      {},
      {
        'smsQuota.used': 0,
        'smsQuota.resetDate': new Date()
      }
    );
  }

  async getSchoolStats(id: string): Promise<{
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    smsUsage: {
      used: number;
      limit: number;
      remaining: number;
    };
  }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid school ID');
    }

    const school = await this.schoolModel.findById(id);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    const [totalStudents, totalTeachers] = await Promise.all([
      this.userModel.countDocuments({ schoolId: id, role: UserRole.STUDENT }),
      this.userModel.countDocuments({ schoolId: id, role: UserRole.TEACHER })
    ]);

    return {
      totalStudents,
      totalTeachers,
      totalClasses: 0, // Will be updated when class schema is implemented
      smsUsage: {
        used: school.smsQuota.used,
        limit: school.smsQuota.monthlyLimit,
        remaining: Math.max(0, school.smsQuota.monthlyLimit - school.smsQuota.used)
      }
    };
  }
}
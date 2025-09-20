import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument, AttendanceStatus } from '../common/schemas/attendance.schema';
import { User, UserDocument } from '../common/schemas/user.schema';
import { Class, ClassDocument } from '../common/schemas/class.schema';
import { School, SchoolDocument } from '../common/schemas/school.schema';
import { MarkAttendanceDto, BulkAttendanceDto, UpdateAttendanceDto, AttendanceQueryDto, AttendanceReportDto, StudentAttendanceStatsDto } from '../common/dto/attendance.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
  ) {}

  async markAttendance(markAttendanceDto: MarkAttendanceDto, teacherId: string): Promise<Attendance> {
    // Verify teacher has permission to mark attendance for this class
    const teacher = await this.userModel.findById(teacherId);
    if (!teacher || teacher.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Only teachers can mark attendance');
    }

    // Verify class exists and teacher is assigned to it
    const classEntity = await this.classModel.findById(markAttendanceDto.classId);
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    const isAssigned = classEntity.classTeacher.toString() === teacherId ||
                      classEntity.subjectTeachers.some(t => t.toString() === teacherId);
    if (!isAssigned) {
      throw new ForbiddenException('You are not assigned to this class');
    }

    // Verify student exists and is in the class
    const student = await this.userModel.findById(markAttendanceDto.studentId);
    if (!student || student.role !== UserRole.STUDENT) {
      throw new NotFoundException('Student not found');
    }

    if (student.classId?.toString() !== markAttendanceDto.classId) {
      throw new BadRequestException('Student is not in this class');
    }

    // Check if attendance already exists for this date
    const existingAttendance = await this.attendanceModel.findOne({
      studentId: markAttendanceDto.studentId,
      classId: markAttendanceDto.classId,
      date: new Date(markAttendanceDto.date)
    });

    if (existingAttendance) {
      throw new ConflictException('Attendance already marked for this student on this date');
    }

    // Create attendance record
    const attendance = new this.attendanceModel({
      ...markAttendanceDto,
      schoolId: classEntity.schoolId,
      markedBy: teacherId,
      date: new Date(markAttendanceDto.date),
      timeIn: markAttendanceDto.timeIn ? new Date(markAttendanceDto.timeIn) : undefined,
      timeOut: markAttendanceDto.timeOut ? new Date(markAttendanceDto.timeOut) : undefined
    });

    return await attendance.save();
  }

  async markBulkAttendance(bulkAttendanceDto: BulkAttendanceDto, teacherId: string): Promise<AttendanceDocument[]> {
    // Verify teacher has permission to mark attendance for this class
    const teacher = await this.userModel.findById(teacherId);
    if (!teacher || teacher.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Only teachers can mark attendance');
    }

    // Verify class exists and teacher is assigned to it
    const classEntity = await this.classModel.findById(bulkAttendanceDto.classId);
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    const isAssigned = classEntity.classTeacher.toString() === teacherId ||
                      classEntity.subjectTeachers.some(t => t.toString() === teacherId);
    if (!isAssigned) {
      throw new ForbiddenException('You are not assigned to this class');
    }

    // Check if attendance already exists for this date
    const existingAttendance = await this.attendanceModel.find({
      classId: bulkAttendanceDto.classId,
      date: new Date(bulkAttendanceDto.date)
    });

    if (existingAttendance.length > 0) {
      throw new ConflictException('Attendance already marked for some students on this date');
    }

    // Verify all students are in the class
    const studentIds = bulkAttendanceDto.students.map(s => s.studentId);
    const students = await this.userModel.find({
      _id: { $in: studentIds },
      role: UserRole.STUDENT,
      classId: bulkAttendanceDto.classId
    });

    if (students.length !== studentIds.length) {
      throw new BadRequestException('Some students are not in this class');
    }

    // Create attendance records
    const attendanceRecords = bulkAttendanceDto.students.map(studentData => ({
      studentId: new Types.ObjectId(studentData.studentId),
      classId: new Types.ObjectId(bulkAttendanceDto.classId),
      schoolId: classEntity.schoolId,
      markedBy: new Types.ObjectId(teacherId),
      date: new Date(bulkAttendanceDto.date),
      status: studentData.status,
      remarks: studentData.remarks,
      timeIn: studentData.timeIn ? new Date(studentData.timeIn) : undefined,
      timeOut: studentData.timeOut ? new Date(studentData.timeOut) : undefined,
      isHalfDay: studentData.isHalfDay || false,
      periodDetails: bulkAttendanceDto.periodDetails
    }));

    const result = await this.attendanceModel.insertMany(attendanceRecords);
    return result as AttendanceDocument[];
  }

  async updateAttendance(attendanceId: string, updateAttendanceDto: UpdateAttendanceDto, userId: string): Promise<Attendance> {
    if (!Types.ObjectId.isValid(attendanceId)) {
      throw new BadRequestException('Invalid attendance ID');
    }

    const attendance = await this.attendanceModel.findById(attendanceId);
    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    // Verify user has permission to update this attendance
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.TEACHER) {
      // Teachers can only update attendance they marked
      if (attendance.markedBy.toString() !== userId) {
        throw new ForbiddenException('You can only update attendance records you marked');
      }
    } else if (user.role === UserRole.SCHOOL_ADMIN) {
      // School admins can update any attendance in their school
      if (user.schoolId?.toString() !== attendance.schoolId.toString()) {
        throw new ForbiddenException('You can only update attendance in your school');
      }
    } else {
      throw new ForbiddenException('You do not have permission to update attendance');
    }

    const updatedAttendance = await this.attendanceModel.findByIdAndUpdate(
      attendanceId,
      {
        ...updateAttendanceDto,
        timeIn: updateAttendanceDto.timeIn ? new Date(updateAttendanceDto.timeIn) : undefined,
        timeOut: updateAttendanceDto.timeOut ? new Date(updateAttendanceDto.timeOut) : undefined,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('studentId', 'firstName lastName studentId email')
     .populate('markedBy', 'firstName lastName email');

    return updatedAttendance!;
  }

  async getAttendance(query: AttendanceQueryDto, userId: string): Promise<{
    attendance: Attendance[];
    total: number;
    totalPages: number;
    currentPage: number;
    stats?: any;
  }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    let baseQuery: any = {};

    // Role-based access control
    if (user.role === UserRole.TEACHER) {
      // Teachers can only see attendance for classes they teach
      const assignedClasses = await this.classModel.find({
        $or: [
          { classTeacher: userId },
          { subjectTeachers: userId }
        ]
      }).select('_id');
      baseQuery.classId = { $in: assignedClasses.map(c => c._id) };
    } else if (user.role === UserRole.SCHOOL_ADMIN) {
      // School admins can see all attendance in their school
      baseQuery.schoolId = user.schoolId;
    } else if (user.role === UserRole.STUDENT) {
      // Students can only see their own attendance
      baseQuery.studentId = userId;
    } else {
      throw new ForbiddenException('You do not have permission to view attendance');
    }

    // Apply filters
    if (query.studentId) baseQuery.studentId = query.studentId;
    if (query.classId) baseQuery.classId = query.classId;
    if (query.status) baseQuery.status = query.status;

    if (query.startDate || query.endDate) {
      baseQuery.date = {};
      if (query.startDate) baseQuery.date.$gte = new Date(query.startDate);
      if (query.endDate) baseQuery.date.$lte = new Date(query.endDate);
    }

    const [attendance, total] = await Promise.all([
      this.attendanceModel
        .find(baseQuery)
        .populate('studentId', 'firstName lastName studentId email')
        .populate('classId', 'name section grade')
        .populate('markedBy', 'firstName lastName email')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.attendanceModel.countDocuments(baseQuery)
    ]);

    // Calculate basic stats
    const stats = await this.getAttendanceStats(baseQuery);

    return {
      attendance,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      stats
    };
  }

  async getStudentAttendanceStats(query: StudentAttendanceStatsDto, userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify permission to view this student's stats
    if (user.role === UserRole.STUDENT && userId !== query.studentId) {
      throw new ForbiddenException('You can only view your own attendance');
    } else if (user.role === UserRole.TEACHER) {
      // Verify teacher teaches this student
      const student = await this.userModel.findById(query.studentId);
      if (!student?.classId) {
        throw new NotFoundException('Student not found or not assigned to a class');
      }

      const classEntity = await this.classModel.findById(student.classId);
      const isAssigned = classEntity?.classTeacher.toString() === userId ||
                        classEntity?.subjectTeachers.some(t => t.toString() === userId);
      if (!isAssigned) {
        throw new ForbiddenException('You do not teach this student');
      }
    } else if (user.role === UserRole.SCHOOL_ADMIN) {
      // Verify student is in the same school
      const student = await this.userModel.findById(query.studentId);
      if (student?.schoolId?.toString() !== user.schoolId?.toString()) {
        throw new ForbiddenException('Student is not in your school');
      }
    }

    let dateQuery: any = { studentId: query.studentId };

    if (query.startDate || query.endDate) {
      dateQuery.date = {};
      if (query.startDate) dateQuery.date.$gte = new Date(query.startDate);
      if (query.endDate) dateQuery.date.$lte = new Date(query.endDate);
    }

    const stats = await this.attendanceModel.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalDays = await this.attendanceModel.countDocuments(dateQuery);
    const present = stats.find(s => s._id === AttendanceStatus.PRESENT)?.count || 0;
    const absent = stats.find(s => s._id === AttendanceStatus.ABSENT)?.count || 0;
    const late = stats.find(s => s._id === AttendanceStatus.LATE)?.count || 0;
    const excused = stats.find(s => s._id === AttendanceStatus.EXCUSED)?.count || 0;

    const attendanceRate = totalDays > 0 ? ((present + late + excused) / totalDays) * 100 : 0;

    return {
      totalDays,
      present,
      absent,
      late,
      excused,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      breakdown: stats
    };
  }

  async getClassAttendanceReport(query: AttendanceReportDto, userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify permission to generate report for this class
    if (user.role === UserRole.TEACHER) {
      const classEntity = await this.classModel.findById(query.classId);
      const isAssigned = classEntity?.classTeacher.toString() === userId ||
                        classEntity?.subjectTeachers.some(t => t.toString() === userId);
      if (!isAssigned) {
        throw new ForbiddenException('You are not assigned to this class');
      }
    } else if (user.role === UserRole.SCHOOL_ADMIN) {
      const classEntity = await this.classModel.findById(query.classId);
      if (classEntity?.schoolId.toString() !== user.schoolId?.toString()) {
        throw new ForbiddenException('Class is not in your school');
      }
    } else {
      throw new ForbiddenException('You do not have permission to generate reports');
    }

    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    const attendance = await this.attendanceModel
      .find({
        classId: query.classId,
        date: { $gte: startDate, $lte: endDate }
      })
      .populate('studentId', 'firstName lastName studentId')
      .sort({ date: 1, 'studentId.lastName': 1 })
      .exec();

    // Group by student and calculate stats
    const studentStats = new Map();

    attendance.forEach(record => {
      const studentId = record.studentId._id.toString();
      if (!studentStats.has(studentId)) {
        studentStats.set(studentId, {
          student: record.studentId,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          total: 0
        });
      }

      const stats = studentStats.get(studentId);
      stats[record.status]++;
      stats.total++;
    });

    const reportData = Array.from(studentStats.values()).map(stats => ({
      ...stats,
      attendanceRate: stats.total > 0 ? ((stats.present + stats.late + stats.excused) / stats.total) * 100 : 0
    }));

    return {
      classId: query.classId,
      startDate: query.startDate,
      endDate: query.endDate,
      totalStudents: reportData.length,
      students: reportData,
      summary: {
        totalRecords: attendance.length,
        averageAttendanceRate: reportData.length > 0
          ? reportData.reduce((sum, s) => sum + s.attendanceRate, 0) / reportData.length
          : 0
      }
    };
  }

  private async getAttendanceStats(baseQuery: any): Promise<any> {
    const stats = await this.attendanceModel.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRecords = await this.attendanceModel.countDocuments(baseQuery);
    const present = stats.find(s => s._id === AttendanceStatus.PRESENT)?.count || 0;
    const absent = stats.find(s => s._id === AttendanceStatus.ABSENT)?.count || 0;
    const late = stats.find(s => s._id === AttendanceStatus.LATE)?.count || 0;
    const excused = stats.find(s => s._id === AttendanceStatus.EXCUSED)?.count || 0;

    const attendanceRate = totalRecords > 0 ? ((present + late + excused) / totalRecords) * 100 : 0;

    return {
      totalRecords,
      present,
      absent,
      late,
      excused,
      attendanceRate: Math.round(attendanceRate * 100) / 100
    };
  }

  async deleteAttendance(attendanceId: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(attendanceId)) {
      throw new BadRequestException('Invalid attendance ID');
    }

    const attendance = await this.attendanceModel.findById(attendanceId);
    if (!attendance) {
      throw new NotFoundException('Attendance record not found');
    }

    // Verify user has permission to delete this attendance
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.TEACHER) {
      // Teachers can only delete attendance they marked
      if (attendance.markedBy.toString() !== userId) {
        throw new ForbiddenException('You can only delete attendance records you marked');
      }
    } else if (user.role === UserRole.SCHOOL_ADMIN) {
      // School admins can delete any attendance in their school
      if (user.schoolId?.toString() !== attendance.schoolId.toString()) {
        throw new ForbiddenException('You can only delete attendance in your school');
      }
    } else {
      throw new ForbiddenException('You do not have permission to delete attendance');
    }

    await this.attendanceModel.findByIdAndDelete(attendanceId);
  }
}
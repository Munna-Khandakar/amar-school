import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Result, ResultDocument } from '../common/schemas/result.schema';
import { Subject, SubjectDocument } from '../common/schemas/subject.schema';
import { User, UserDocument } from '../common/schemas/user.schema';
import { Class, ClassDocument } from '../common/schemas/class.schema';
import { School, SchoolDocument } from '../common/schemas/school.schema';
import { CreateResultDto, BulkResultDto, UpdateResultDto, ResultQueryDto, StudentReportCardDto, ClassResultsDto, SubjectAnalyticsDto, CreateSubjectDto, UpdateSubjectDto } from '../common/dto/result.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class ResultsService {
  constructor(
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(School.name) private schoolModel: Model<SchoolDocument>,
  ) {}

  async createResult(createResultDto: CreateResultDto, teacherId: string): Promise<Result> {
    // Verify teacher has permission to enter results for this class and subject
    const teacher = await this.userModel.findById(teacherId);
    if (!teacher || teacher.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Only teachers can enter results');
    }

    // Verify class exists and teacher is assigned to it
    const classEntity = await this.classModel.findById(createResultDto.classId);
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    const isAssigned = classEntity.classTeacher.toString() === teacherId ||
                      classEntity.subjectTeachers.some(t => t.toString() === teacherId) ||
                      classEntity.subjects.some(s => s.teacher.toString() === teacherId);
    if (!isAssigned) {
      throw new ForbiddenException('You are not assigned to teach this class/subject');
    }

    // Verify student exists and is in the class
    const student = await this.userModel.findById(createResultDto.studentId);
    if (!student || student.role !== UserRole.STUDENT) {
      throw new NotFoundException('Student not found');
    }

    if (student.classId?.toString() !== createResultDto.classId) {
      throw new BadRequestException('Student is not in this class');
    }

    // Calculate percentage and grade
    const percentage = (createResultDto.marksObtained / createResultDto.totalMarks) * 100;
    const { grade, gpa } = this.calculateGrade(percentage);

    // Check if result already exists
    const existingResult = await this.resultModel.findOne({
      studentId: createResultDto.studentId,
      subject: createResultDto.subject,
      assessmentType: createResultDto.assessmentType,
      term: createResultDto.term,
      academicYear: createResultDto.academicYear
    });

    if (existingResult) {
      throw new ConflictException('Result already exists for this student, subject, and assessment');
    }

    // Create result
    const result = new this.resultModel({
      ...createResultDto,
      teacherId,
      schoolId: classEntity.schoolId,
      percentage,
      grade,
      gpa,
      examDate: new Date(createResultDto.examDate)
    });

    return await result.save();
  }

  async createBulkResults(bulkResultDto: BulkResultDto, teacherId: string): Promise<ResultDocument[]> {
    // Verify teacher has permission
    const teacher = await this.userModel.findById(teacherId);
    if (!teacher || teacher.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Only teachers can enter results');
    }

    // Verify class exists and teacher is assigned
    const classEntity = await this.classModel.findById(bulkResultDto.classId);
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }

    const isAssigned = classEntity.classTeacher.toString() === teacherId ||
                      classEntity.subjectTeachers.some(t => t.toString() === teacherId) ||
                      classEntity.subjects.some(s => s.teacher.toString() === teacherId);
    if (!isAssigned) {
      throw new ForbiddenException('You are not assigned to teach this class/subject');
    }

    // Verify all students are in the class
    const studentIds = bulkResultDto.students.map(s => s.studentId);
    const students = await this.userModel.find({
      _id: { $in: studentIds },
      role: UserRole.STUDENT,
      classId: bulkResultDto.classId
    });

    if (students.length !== studentIds.length) {
      throw new BadRequestException('Some students are not in this class');
    }

    // Check for existing results
    const existingResults = await this.resultModel.find({
      studentId: { $in: studentIds },
      subject: bulkResultDto.subject,
      assessmentType: bulkResultDto.assessmentType,
      term: bulkResultDto.term,
      academicYear: bulkResultDto.academicYear
    });

    if (existingResults.length > 0) {
      throw new ConflictException('Results already exist for some students');
    }

    // Create results
    const resultRecords = bulkResultDto.students.map(studentData => {
      const percentage = (studentData.marksObtained / bulkResultDto.totalMarks) * 100;
      const { grade, gpa } = this.calculateGrade(percentage);

      return {
        studentId: new Types.ObjectId(studentData.studentId),
        classId: new Types.ObjectId(bulkResultDto.classId),
        schoolId: classEntity.schoolId,
        teacherId: new Types.ObjectId(teacherId),
        subject: bulkResultDto.subject,
        subjectCode: bulkResultDto.subjectCode,
        assessmentType: bulkResultDto.assessmentType,
        assessmentName: bulkResultDto.assessmentName,
        marksObtained: studentData.marksObtained,
        totalMarks: bulkResultDto.totalMarks,
        percentage,
        grade,
        gpa,
        term: bulkResultDto.term,
        academicYear: bulkResultDto.academicYear,
        examDate: new Date(bulkResultDto.examDate),
        remarks: studentData.remarks,
        grading: bulkResultDto.grading,
        isPublished: bulkResultDto.isPublished || false
      };
    });

    const result = await this.resultModel.insertMany(resultRecords);
    return result as ResultDocument[];
  }

  async updateResult(resultId: string, updateResultDto: UpdateResultDto, userId: string): Promise<Result> {
    if (!Types.ObjectId.isValid(resultId)) {
      throw new BadRequestException('Invalid result ID');
    }

    const result = await this.resultModel.findById(resultId);
    if (!result) {
      throw new NotFoundException('Result not found');
    }

    // Verify user has permission to update
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.TEACHER) {
      if (result.teacherId.toString() !== userId) {
        throw new ForbiddenException('You can only update results you entered');
      }
    } else if (user.role === UserRole.SCHOOL_ADMIN) {
      if (user.schoolId?.toString() !== result.schoolId.toString()) {
        throw new ForbiddenException('You can only update results in your school');
      }
    } else {
      throw new ForbiddenException('You do not have permission to update results');
    }

    // If marks are being updated, recalculate percentage and grade
    let updateData: any = { ...updateResultDto };

    if (updateResultDto.marksObtained !== undefined || updateResultDto.totalMarks !== undefined) {
      const newMarksObtained = updateResultDto.marksObtained ?? result.marksObtained;
      const newTotalMarks = updateResultDto.totalMarks ?? result.totalMarks;
      const newPercentage = (newMarksObtained / newTotalMarks) * 100;
      const { grade, gpa } = this.calculateGrade(newPercentage);

      updateData = {
        ...updateData,
        percentage: newPercentage,
        grade,
        gpa
      };

      // Add to revision history if marks changed
      if (updateResultDto.marksObtained !== undefined && updateResultDto.marksObtained !== result.marksObtained) {
        result.revisionHistory.push({
          date: new Date(),
          oldMarks: result.marksObtained,
          newMarks: updateResultDto.marksObtained,
          reason: updateResultDto.revisionReason || 'Marks correction',
          updatedBy: new Types.ObjectId(userId)
        });
        updateData.revisionHistory = result.revisionHistory;
      }
    }

    updateData.updatedAt = new Date();

    const updatedResult = await this.resultModel.findByIdAndUpdate(
      resultId,
      updateData,
      { new: true }
    ).populate('studentId', 'firstName lastName studentId')
     .populate('teacherId', 'firstName lastName email');

    return updatedResult!;
  }

  async getResults(query: ResultQueryDto, userId: string): Promise<{
    results: Result[];
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
      baseQuery.teacherId = userId;
    } else if (user.role === UserRole.SCHOOL_ADMIN) {
      baseQuery.schoolId = user.schoolId;
    } else if (user.role === UserRole.STUDENT) {
      baseQuery.studentId = userId;
      baseQuery.isPublished = true; // Students can only see published results
    } else {
      throw new ForbiddenException('You do not have permission to view results');
    }

    // Apply filters
    if (query.studentId) baseQuery.studentId = query.studentId;
    if (query.classId) baseQuery.classId = query.classId;
    if (query.subject) baseQuery.subject = query.subject;
    if (query.assessmentType) baseQuery.assessmentType = query.assessmentType;
    if (query.term) baseQuery.term = query.term;
    if (query.academicYear) baseQuery.academicYear = query.academicYear;
    if (query.isPublished !== undefined) baseQuery.isPublished = query.isPublished;

    const [results, total] = await Promise.all([
      this.resultModel
        .find(baseQuery)
        .populate('studentId', 'firstName lastName studentId')
        .populate('teacherId', 'firstName lastName email')
        .populate('classId', 'name section grade')
        .sort({ examDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.resultModel.countDocuments(baseQuery)
    ]);

    return {
      results,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  async getStudentReportCard(query: StudentReportCardDto, userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify permission to view this student's report card
    if (user.role === UserRole.STUDENT && userId !== query.studentId) {
      throw new ForbiddenException('You can only view your own report card');
    } else if (user.role === UserRole.TEACHER || user.role === UserRole.SCHOOL_ADMIN) {
      const student = await this.userModel.findById(query.studentId);
      if (!student || student.schoolId?.toString() !== user.schoolId?.toString()) {
        throw new ForbiddenException('Student not found in your school');
      }
    }

    const student = await this.userModel.findById(query.studentId)
      .populate('classId', 'name section grade')
      .populate('schoolId', 'name');

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const results = await this.resultModel
      .find({
        studentId: query.studentId,
        term: query.term,
        academicYear: query.academicYear,
        isPublished: true
      })
      .populate('teacherId', 'firstName lastName')
      .sort({ subject: 1, examDate: 1 })
      .exec();

    // Group results by subject
    const subjectResults = new Map();
    let totalMarks = 0;
    let totalObtained = 0;
    let totalCredits = 0;
    let weightedGpaSum = 0;

    results.forEach(result => {
      if (!subjectResults.has(result.subject)) {
        subjectResults.set(result.subject, []);
      }
      subjectResults.get(result.subject).push(result);

      totalMarks += result.totalMarks;
      totalObtained += result.marksObtained;

      // For GPA calculation (assuming each subject has equal weight)
      if (result.gpa) {
        weightedGpaSum += result.gpa;
        totalCredits += 1;
      }
    });

    const overallPercentage = totalMarks > 0 ? (totalObtained / totalMarks) * 100 : 0;
    const overallGpa = totalCredits > 0 ? weightedGpaSum / totalCredits : 0;
    const { grade: overallGrade } = this.calculateGrade(overallPercentage);

    return {
      student: {
        name: `${student.firstName} ${student.lastName}`,
        studentId: student.studentId,
        class: student.classId,
        school: student.schoolId
      },
      term: query.term,
      academicYear: query.academicYear,
      subjects: Array.from(subjectResults.entries()).map(([subject, subjectRes]) => ({
        subject,
        assessments: subjectRes
      })),
      summary: {
        totalSubjects: subjectResults.size,
        totalAssessments: results.length,
        overallPercentage: Math.round(overallPercentage * 100) / 100,
        overallGpa: Math.round(overallGpa * 100) / 100,
        overallGrade,
        totalMarks,
        totalObtained
      }
    };
  }

  async getClassResults(query: ClassResultsDto, userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify permission
    if (user.role === UserRole.TEACHER || user.role === UserRole.SCHOOL_ADMIN) {
      const classEntity = await this.classModel.findById(query.classId);
      if (!classEntity || classEntity.schoolId.toString() !== user.schoolId?.toString()) {
        throw new ForbiddenException('Class not found in your school');
      }
    } else {
      throw new ForbiddenException('You do not have permission to view class results');
    }

    const results = await this.resultModel
      .find({
        classId: query.classId,
        subject: query.subject,
        term: query.term,
        academicYear: query.academicYear
      })
      .populate('studentId', 'firstName lastName studentId rollNumber')
      .sort({ 'studentId.lastName': 1, 'studentId.firstName': 1 })
      .exec();

    // Calculate class statistics
    const percentages = results.map(r => r.percentage);
    const average = percentages.length > 0 ? percentages.reduce((sum, p) => sum + p, 0) / percentages.length : 0;
    const highest = percentages.length > 0 ? Math.max(...percentages) : 0;
    const lowest = percentages.length > 0 ? Math.min(...percentages) : 0;

    const gradeDistribution = results.reduce((acc, result) => {
      acc[result.grade] = (acc[result.grade] || 0) + 1;
      return acc;
    }, {} as {[key: string]: number});

    return {
      classId: query.classId,
      subject: query.subject,
      term: query.term,
      academicYear: query.academicYear,
      results,
      statistics: {
        totalStudents: results.length,
        average: Math.round(average * 100) / 100,
        highest,
        lowest,
        gradeDistribution
      }
    };
  }

  async createSubject(createSubjectDto: CreateSubjectDto, userId: string): Promise<Subject> {
    const user = await this.userModel.findById(userId);
    if (!user || user.role !== UserRole.SCHOOL_ADMIN) {
      throw new ForbiddenException('Only school admins can create subjects');
    }

    // Check if subject code already exists in the school
    const existingSubject = await this.subjectModel.findOne({
      code: createSubjectDto.code,
      schoolId: user.schoolId
    });

    if (existingSubject) {
      throw new ConflictException('Subject code already exists in this school');
    }

    const subject = new this.subjectModel({
      ...createSubjectDto,
      schoolId: user.schoolId,
      teachers: createSubjectDto.teachers?.map(id => new Types.ObjectId(id)) || []
    });

    return await subject.save();
  }

  async getSubjects(schoolId: string, grade?: number): Promise<Subject[]> {
    const query: any = { schoolId, isActive: true };
    if (grade) query.grade = grade;

    return await this.subjectModel
      .find(query)
      .populate('teachers', 'firstName lastName email')
      .sort({ name: 1 })
      .exec();
  }

  private calculateGrade(percentage: number): { grade: string; gpa: number } {
    if (percentage >= 90) return { grade: 'A+', gpa: 4.0 };
    if (percentage >= 80) return { grade: 'A', gpa: 3.5 };
    if (percentage >= 70) return { grade: 'B+', gpa: 3.0 };
    if (percentage >= 60) return { grade: 'B', gpa: 2.5 };
    if (percentage >= 50) return { grade: 'C+', gpa: 2.0 };
    if (percentage >= 40) return { grade: 'C', gpa: 1.5 };
    if (percentage >= 35) return { grade: 'D', gpa: 1.0 };
    return { grade: 'F', gpa: 0.0 };
  }

  async deleteResult(resultId: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(resultId)) {
      throw new BadRequestException('Invalid result ID');
    }

    const result = await this.resultModel.findById(resultId);
    if (!result) {
      throw new NotFoundException('Result not found');
    }

    // Verify user has permission to delete
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.TEACHER) {
      if (result.teacherId.toString() !== userId) {
        throw new ForbiddenException('You can only delete results you entered');
      }
    } else if (user.role === UserRole.SCHOOL_ADMIN) {
      if (user.schoolId?.toString() !== result.schoolId.toString()) {
        throw new ForbiddenException('You can only delete results in your school');
      }
    } else {
      throw new ForbiddenException('You do not have permission to delete results');
    }

    await this.resultModel.findByIdAndDelete(resultId);
  }
}
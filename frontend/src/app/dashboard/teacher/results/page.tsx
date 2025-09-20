'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function TeacherResultsPage() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedAssessmentType, setSelectedAssessmentType] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [assessmentName, setAssessmentName] = useState('');
  const [totalMarks, setTotalMarks] = useState('100');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [results, setResults] = useState<{[key: string]: string}>({});

  // Mock data - replace with actual API calls
  const [classes] = useState([
    { id: '1', name: 'Grade 10-A', subject: 'Mathematics' },
    { id: '2', name: 'Grade 11-B', subject: 'Physics' },
    { id: '3', name: 'Grade 9-C', subject: 'Mathematics' }
  ]);

  const [subjects] = useState([
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Geography'
  ]);

  const [students] = useState([
    {
      id: '1',
      firstName: 'Alex',
      lastName: 'Smith',
      studentId: 'S001',
      rollNumber: '001'
    },
    {
      id: '2',
      firstName: 'Emma',
      lastName: 'Johnson',
      studentId: 'S002',
      rollNumber: '002'
    },
    {
      id: '3',
      firstName: 'David',
      lastName: 'Brown',
      studentId: 'S003',
      rollNumber: '003'
    },
    {
      id: '4',
      firstName: 'Sarah',
      lastName: 'Wilson',
      studentId: 'S004',
      rollNumber: '004'
    },
    {
      id: '5',
      firstName: 'Michael',
      lastName: 'Davis',
      studentId: 'S005',
      rollNumber: '005'
    }
  ]);

  const [resultsHistory] = useState([
    {
      id: '1',
      class: 'Grade 10-A',
      subject: 'Mathematics',
      assessment: 'Mid-term Exam',
      term: 'First',
      date: '2024-01-15',
      studentsCount: 28,
      avgMarks: 78.5,
      highest: 95,
      lowest: 42
    },
    {
      id: '2',
      class: 'Grade 11-B',
      subject: 'Physics',
      assessment: 'Quiz 1',
      term: 'First',
      date: '2024-01-10',
      studentsCount: 25,
      avgMarks: 82.3,
      highest: 98,
      lowest: 55
    }
  ]);

  const assessmentTypes = [
    { value: 'quiz', label: 'Quiz' },
    { value: 'test', label: 'Test' },
    { value: 'midterm', label: 'Mid-term Exam' },
    { value: 'final', label: 'Final Exam' },
    { value: 'project', label: 'Project' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'practical', label: 'Practical' },
    { value: 'oral', label: 'Oral Exam' }
  ];

  const terms = [
    { value: 'first', label: 'First Term' },
    { value: 'second', label: 'Second Term' },
    { value: 'third', label: 'Third Term' },
    { value: 'annual', label: 'Annual' }
  ];

  const handleMarksChange = (studentId: string, marks: string) => {
    setResults(prev => ({
      ...prev,
      [studentId]: marks
    }));
  };

  const handleSubmitResults = () => {
    if (!selectedClass || !selectedSubject || !selectedTerm || !selectedAssessmentType) {
      alert('Please fill all required fields');
      return;
    }

    const totalMarksNum = parseInt(totalMarks);
    const hasInvalidMarks = Object.values(results).some(marks => {
      const marksNum = parseInt(marks);
      return isNaN(marksNum) || marksNum < 0 || marksNum > totalMarksNum;
    });

    if (hasInvalidMarks) {
      alert(`Please enter valid marks between 0 and ${totalMarks}`);
      return;
    }

    // Here you would make API call to submit results
    console.log('Submitting results:', {
      classId: selectedClass,
      subject: selectedSubject,
      term: selectedTerm,
      assessmentType: selectedAssessmentType,
      assessmentName,
      totalMarks: totalMarksNum,
      examDate,
      academicYear,
      results
    });

    alert('Results submitted successfully!');
    setResults({});
  };

  const getResultsStats = () => {
    const entered = Object.keys(results).length;
    const totalMarksNum = parseInt(totalMarks) || 100;
    const validMarks = Object.values(results).filter(marks => {
      const marksNum = parseInt(marks);
      return !isNaN(marksNum) && marksNum >= 0 && marksNum <= totalMarksNum;
    });

    const sum = validMarks.reduce((acc, marks) => acc + parseInt(marks), 0);
    const average = validMarks.length > 0 ? sum / validMarks.length : 0;
    const highest = validMarks.length > 0 ? Math.max(...validMarks.map(m => parseInt(m))) : 0;
    const lowest = validMarks.length > 0 ? Math.min(...validMarks.map(m => parseInt(m))) : 0;

    return { entered, total: students.length, average, highest, lowest };
  };

  const stats = getResultsStats();

  const getGrade = (marks: number, totalMarks: number) => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-500' };
    if (percentage >= 50) return { grade: 'C+', color: 'text-yellow-600' };
    if (percentage >= 40) return { grade: 'C', color: 'text-yellow-500' };
    if (percentage >= 35) return { grade: 'D', color: 'text-orange-500' };
    return { grade: 'F', color: 'text-red-500' };
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.TEACHER]}>
      <DashboardLayout title="Enter Results" userRole={UserRole.TEACHER}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enter Student Results</h1>
              <p className="text-gray-600">Record marks and grades for your classes</p>
            </div>
            <div className="flex space-x-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    View History
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Results History</DialogTitle>
                    <DialogDescription>
                      Recent results you have entered
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Assessment</TableHead>
                          <TableHead>Students</TableHead>
                          <TableHead>Average</TableHead>
                          <TableHead>Range</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resultsHistory.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.class}</TableCell>
                            <TableCell>{record.subject}</TableCell>
                            <TableCell>{record.assessment}</TableCell>
                            <TableCell>{record.studentsCount}</TableCell>
                            <TableCell>{record.avgMarks}%</TableCell>
                            <TableCell>{record.lowest} - {record.highest}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                onClick={handleSubmitResults}
                disabled={!selectedClass || stats.entered === 0}
              >
                Submit Results
              </Button>
            </div>
          </div>

          {/* Assessment Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Configuration</CardTitle>
              <CardDescription>Set up the assessment details before entering marks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Term</label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      {terms.map(term => (
                        <SelectItem key={term.value} value={term.value}>
                          {term.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Assessment Type</label>
                  <Select value={selectedAssessmentType} onValueChange={setSelectedAssessmentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assessmentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Assessment Name</label>
                  <Input
                    placeholder="e.g., Math Quiz 1"
                    value={assessmentName}
                    onChange={(e) => setAssessmentName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Total Marks</label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Exam Date</label>
                  <Input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Academic Year</label>
                  <Input
                    placeholder="2024-25"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          {selectedClass && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <p className="text-xs text-gray-600">Total Students</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{stats.entered}</div>
                  <p className="text-xs text-gray-600">Marks Entered</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(stats.average)}
                  </div>
                  <p className="text-xs text-gray-600">Average Marks</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-500">{stats.highest}</div>
                  <p className="text-xs text-gray-600">Highest Marks</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-500">{stats.lowest || '—'}</div>
                  <p className="text-xs text-gray-600">Lowest Marks</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Marks Entry */}
          {selectedClass ? (
            <Card>
              <CardHeader>
                <CardTitle>Enter Student Marks</CardTitle>
                <CardDescription>
                  Enter marks for each student. Grades will be calculated automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Bulk Actions */}
                  <div className="flex space-x-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setResults({})}
                    >
                      Clear All
                    </Button>
                    <div className="flex space-x-2 items-center">
                      <span className="text-sm text-gray-600">Quick fill:</span>
                      <Input
                        type="number"
                        placeholder="Marks"
                        className="w-20 h-8"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = (e.target as HTMLInputElement).value;
                            const newResults: {[key: string]: string} = {};
                            students.forEach(student => {
                              newResults[student.id] = value;
                            });
                            setResults(newResults);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <span className="text-sm text-gray-500">Press Enter to fill all</span>
                    </div>
                  </div>

                  {/* Students Table */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Roll No.</TableHead>
                          <TableHead>Marks Obtained</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => {
                          const marks = parseInt(results[student.id] || '0');
                          const totalMarksNum = parseInt(totalMarks) || 100;
                          const percentage = marks > 0 ? (marks / totalMarksNum) * 100 : 0;
                          const gradeInfo = marks > 0 ? getGrade(marks, totalMarksNum) : null;

                          return (
                            <TableRow key={student.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {student.firstName} {student.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">ID: {student.studentId}</div>
                                </div>
                              </TableCell>
                              <TableCell>{student.rollNumber}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    value={results[student.id] || ''}
                                    onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                    className="w-20"
                                    min="0"
                                    max={totalMarks}
                                  />
                                  <span className="text-sm text-gray-500">/ {totalMarks}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {marks > 0 ? (
                                  <span className="font-medium">
                                    {Math.round(percentage * 100) / 100}%
                                  </span>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {gradeInfo ? (
                                  <Badge className={`${gradeInfo.color} bg-transparent border`}>
                                    {gradeInfo.grade}
                                  </Badge>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Configure Assessment</h3>
                <p className="text-gray-600">
                  Select class, subject, and assessment type above to start entering marks
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StudentResultsPage() {
  const [selectedTerm, setSelectedTerm] = useState('first');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [academicYear] = useState('2024-25');

  // Mock student data - replace with actual API calls
  const [studentInfo] = useState({
    id: 'S001',
    firstName: 'Alex',
    lastName: 'Smith',
    rollNumber: '001',
    class: 'Grade 10-A',
    section: 'A',
    admissionNumber: 'ADM001'
  });

  const [subjects] = useState([
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Geography'
  ]);

  const [results] = useState([
    {
      id: '1',
      subject: 'Mathematics',
      assessmentType: 'midterm',
      assessmentName: 'Mid-term Exam',
      term: 'first',
      date: '2024-01-15',
      marksObtained: 85,
      totalMarks: 100,
      percentage: 85,
      grade: 'A',
      gpa: 3.5,
      teacher: 'Ms. Johnson',
      remarks: 'Excellent performance'
    },
    {
      id: '2',
      subject: 'Physics',
      assessmentType: 'quiz',
      assessmentName: 'Physics Quiz 1',
      term: 'first',
      date: '2024-01-10',
      marksObtained: 78,
      totalMarks: 80,
      percentage: 97.5,
      grade: 'A+',
      gpa: 4.0,
      teacher: 'Mr. Wilson',
      remarks: 'Outstanding'
    },
    {
      id: '3',
      subject: 'Chemistry',
      assessmentType: 'test',
      assessmentName: 'Organic Chemistry Test',
      term: 'first',
      date: '2024-01-12',
      marksObtained: 72,
      totalMarks: 90,
      percentage: 80,
      grade: 'A',
      gpa: 3.5,
      teacher: 'Dr. Brown',
      remarks: 'Good understanding'
    },
    {
      id: '4',
      subject: 'English',
      assessmentType: 'assignment',
      assessmentName: 'Essay Writing',
      term: 'first',
      date: '2024-01-08',
      marksObtained: 88,
      totalMarks: 100,
      percentage: 88,
      grade: 'A',
      gpa: 3.5,
      teacher: 'Mrs. Davis',
      remarks: 'Creative writing skills'
    },
    {
      id: '5',
      subject: 'Biology',
      assessmentType: 'practical',
      assessmentName: 'Lab Practical',
      term: 'first',
      date: '2024-01-20',
      marksObtained: 92,
      totalMarks: 100,
      percentage: 92,
      grade: 'A+',
      gpa: 4.0,
      teacher: 'Dr. Smith',
      remarks: 'Excellent lab skills'
    }
  ]);

  const [performanceData] = useState({
    currentGPA: 3.7,
    classRank: 5,
    totalStudents: 45,
    attendancePercentage: 95,
    strengths: ['Mathematics', 'Physics', 'Biology'],
    improvements: ['Chemistry practical work'],
    achievements: [
      'Science Olympiad - 2nd Place',
      'Math Competition - Participation',
      'Perfect Attendance Award'
    ]
  });

  const terms = [
    { value: 'first', label: 'First Term' },
    { value: 'second', label: 'Second Term' },
    { value: 'third', label: 'Third Term' },
    { value: 'annual', label: 'Annual' }
  ];

  const assessmentTypeLabels: { [key: string]: string } = {
    quiz: 'Quiz',
    test: 'Test',
    midterm: 'Mid-term Exam',
    final: 'Final Exam',
    project: 'Project',
    assignment: 'Assignment',
    practical: 'Practical',
    oral: 'Oral Exam'
  };

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800 border-green-300';
      case 'A': return 'bg-green-100 text-green-700 border-green-300';
      case 'B+': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'B': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'C+': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'C': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'D': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'F': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredResults = results.filter(result => {
    const termMatch = selectedTerm === 'all' || result.term === selectedTerm;
    const subjectMatch = selectedSubject === 'all' || result.subject === selectedSubject;
    return termMatch && subjectMatch;
  });

  const getSubjectAverage = (subject: string) => {
    const subjectResults = results.filter(r => r.subject === subject && r.term === selectedTerm);
    if (subjectResults.length === 0) return 0;
    const total = subjectResults.reduce((sum, r) => sum + r.percentage, 0);
    return Math.round(total / subjectResults.length);
  };

  const getTermStats = () => {
    const termResults = results.filter(r => r.term === selectedTerm);
    if (termResults.length === 0) return { average: 0, highest: 0, lowest: 0, totalTests: 0 };

    const percentages = termResults.map(r => r.percentage);
    const average = Math.round(percentages.reduce((sum, p) => sum + p, 0) / percentages.length);
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);

    return { average, highest, lowest, totalTests: termResults.length };
  };

  const termStats = getTermStats();

  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <DashboardLayout title="My Results" userRole={UserRole.STUDENT}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Academic Results</h1>
              <p className="text-gray-600">View your grades, performance, and progress</p>
            </div>
            <div className="flex space-x-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    📊 Performance Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Academic Performance Report</DialogTitle>
                    <DialogDescription>
                      Detailed analysis of your academic performance
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-600">{performanceData.currentGPA}</div>
                          <p className="text-xs text-gray-600">Current GPA</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">
                            {performanceData.classRank}
                          </div>
                          <p className="text-xs text-gray-600">Class Rank</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-purple-600">
                            {performanceData.attendancePercentage}%
                          </div>
                          <p className="text-xs text-gray-600">Attendance</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-orange-600">
                            {performanceData.totalStudents}
                          </div>
                          <p className="text-xs text-gray-600">Class Size</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-green-600">Strengths</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {performanceData.strengths.map((strength, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-orange-600">Areas for Improvement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {performanceData.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-blue-600">Achievements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {performanceData.achievements.map((achievement, index) => (
                            <Badge key={index} variant="secondary" className="p-2 text-center">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
              <Button>
                📄 Download Report Card
              </Button>
            </div>
          </div>

          {/* Student Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{studentInfo.firstName} {studentInfo.lastName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Class:</span>
                  <p className="font-medium">{studentInfo.class}</p>
                </div>
                <div>
                  <span className="text-gray-600">Roll Number:</span>
                  <p className="font-medium">{studentInfo.rollNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">Academic Year:</span>
                  <p className="font-medium">{academicYear}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <label className="text-sm font-medium text-gray-700">Term</label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Terms</SelectItem>
                      {terms.map(term => (
                        <SelectItem key={term.value} value={term.value}>
                          {term.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          {selectedTerm !== 'all' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{termStats.average}%</div>
                  <p className="text-xs text-gray-600">Term Average</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{termStats.highest}%</div>
                  <p className="text-xs text-gray-600">Highest Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">{termStats.lowest}%</div>
                  <p className="text-xs text-gray-600">Lowest Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">{termStats.totalTests}</div>
                  <p className="text-xs text-gray-600">Total Assessments</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Display */}
          <Tabs defaultValue="detailed" className="space-y-4">
            <TabsList>
              <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
              <TabsTrigger value="summary">Subject Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="detailed">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Results</CardTitle>
                  <CardDescription>
                    Detailed view of all your assessment results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredResults.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Assessment</TableHead>
                            <TableHead>Marks</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Teacher</TableHead>
                            <TableHead>Remarks</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredResults.map((result) => (
                            <TableRow key={result.id}>
                              <TableCell className="text-sm">
                                {new Date(result.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="font-medium">{result.subject}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{result.assessmentName}</div>
                                  <div className="text-xs text-gray-500">
                                    {assessmentTypeLabels[result.assessmentType]}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{result.marksObtained}/{result.totalMarks}</TableCell>
                              <TableCell>
                                <span className="font-medium">{result.percentage}%</span>
                              </TableCell>
                              <TableCell>
                                <Badge className={getGradeBadgeColor(result.grade)}>
                                  {result.grade}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{result.teacher}</TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {result.remarks}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-6xl mb-4">📊</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                      <p className="text-gray-600">
                        No assessment results found for the selected filters
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Subject-wise Performance</CardTitle>
                  <CardDescription>
                    Average performance across all subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjects.map((subject) => {
                      const average = getSubjectAverage(subject);
                      const subjectResults = results.filter(r => r.subject === subject && r.term === selectedTerm);

                      return (
                        <div key={subject} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{subject}</div>
                            <div className="text-sm text-gray-600">
                              {subjectResults.length} assessment(s)
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-bold text-lg">{average}%</div>
                              <div className="text-xs text-gray-600">Average</div>
                            </div>
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${Math.min(average, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
School Management System - Architecture & Role Responsibilities
System Overview
A multi-tenant school management system with role-based access control supporting multiple schools under a super-admin architecture.
Technology Stack
Frontend

Framework: Next.js 14 (Latest LTS)
Styling: Tailwind CSS + shadcn/ui
Language: TypeScript
Routing: App Router
State Management: Zustand/Redux Toolkit

Backend

Framework: NestJS 10 (Latest LTS)
Database: MongoDB with Mongoose
Language: TypeScript
Authentication: JWT + Role-based Guards
Validation: class-validator + class-transformer


User Roles & Responsibilities
1. Super Admin
   Primary Role: Platform-wide management and school oversight
   Core Responsibilities:

✅ School Management

Add/edit/delete schools
View all schools list with basic stats
Activate/deactivate schools


✅ School Admin Management

Create school admin accounts
Assign school admins to specific schools
Reset school admin passwords


✅ Platform Analytics

View total schools count
View total users across platform
Basic platform usage statistics
Monitor platform-wide SMS usage and billing



Access Level: Full platform access, read-only for school-specific data

2. School Admin
   Primary Role: Complete school operations management
   Core Responsibilities:

✅ Teacher Management

Add/edit/remove teachers
Assign teachers to subjects/classes
View teacher profiles and basic info


✅ Student Management

Add/edit/remove students
Assign students to classes
View student profiles and academic records


✅ Class Management

Create/manage classes (Grade 1, 2, etc.)
Assign class teachers
Set class schedules (basic)


✅ Academic Oversight

View all attendance reports
View all exam results and analytics
Generate school-wide academic reports
Monitor SMS usage and costs


✅ SMS Management

Configure SMS settings and templates
View SMS usage statistics and costs
Set SMS quotas and limits
Enable/disable SMS notifications for different events


✅ School Settings

Update school information
Manage academic year settings
Configure grading system



Access Level: Full access within assigned school only

3. Teacher
   Primary Role: Classroom management and student assessment
   Core Responsibilities:

✅ Attendance Management

Mark daily attendance for assigned classes
View attendance history of their students
Generate attendance reports for their classes
Trigger SMS notifications for absences (automated)


✅ Results Management

Enter/edit exam results for their students (offline exams)
View results history and trends
Trigger SMS notifications for marks updates


✅ Student Information

View profiles of their assigned students
Add notes/comments about student performance
View student attendance records


✅ Class Management

View their class schedules
Update class-related information
Communicate with school admin (basic messaging)



Access Level: Limited to assigned classes and subjects only

4. Student
   Primary Role: View personal academic information
   Core Responsibilities:

✅ Personal Dashboard

View personal profile information
See class schedule and assigned teachers


✅ Attendance Tracking

View their attendance history
See attendance percentage and trends
Receive SMS notifications for absences (automatic)


✅ Academic Records

View exam results and marks
See grade reports and academic progress
Download report cards (PDF)
Receive SMS notifications for new results


✅ Basic Interactions

Update personal information (limited fields)
View school announcements
Access basic school information



Access Level: Personal data only, read-only for most information
Minimal Feature Set (MVP)
Phase 1 - Core Setup

Authentication System (JWT-based)
User Management (All roles)
School Management (Super admin)
Basic Dashboard (All roles)

Phase 2 - Academic Features

Attendance System (Teacher marking, student viewing, SMS alerts)
Results Management (Teacher entering offline exam results)
SMS Integration (Automated notifications, usage tracking)
Basic Reporting (Attendance, marks, SMS usage)

Phase 3 - Enhanced Features

Class Scheduling
Parent Portal (Optional)
Advanced SMS Templates & Automation
Advanced Analytics & SMS Cost Management
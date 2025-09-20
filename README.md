# Amar School Management System

A multi-tenant school management system with role-based access control supporting multiple schools under a super-admin architecture.

## Technology Stack

### Backend
- **Framework**: NestJS 10 (Latest LTS)
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript
- **Authentication**: JWT + Role-based Guards
- **Validation**: class-validator + class-transformer

### Frontend
- **Framework**: Next.js 14 (Latest LTS)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **Routing**: App Router
- **State Management**: Zustand

## User Roles

1. **Super Admin**: Platform-wide management and school oversight
2. **School Admin**: Complete school operations management
3. **Teacher**: Classroom management and student assessment
4. **Student**: View personal academic information

## Project Structure

```
amar-school/
├── backend/              # NestJS backend
├── frontend/             # Next.js frontend
├── requirements.md       # Project requirements
├── implementation-steps.md # Implementation plan
└── README.md            # This file
```

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for all projects:
   ```bash
   npm run install:all
   ```

3. Set up environment variables (see Environment Setup section)

4. Start development servers:
   ```bash
   npm run dev
   ```

### Development Commands

```bash
# Install dependencies
npm run install:all           # Install all dependencies
npm run install:backend       # Install backend dependencies only
npm run install:frontend      # Install frontend dependencies only

# Development
npm run dev                   # Start both backend and frontend
npm run dev:backend          # Start backend only
npm run dev:frontend         # Start frontend only

# Build
npm run build                # Build both projects
npm run build:backend        # Build backend only
npm run build:frontend       # Build frontend only
```

## Environment Setup

### Backend Environment Variables
Create `backend/.env` file:
```env
DB_CONNECTION_STRING=mongodb://localhost:27017/school-management
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
SMS_API_KEY=your-sms-provider-key
SMS_API_SECRET=your-sms-provider-secret
PORT=3001
```

### Frontend Environment Variables
Create `frontend/.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Features

### Core Features
- ✅ Multi-tenant architecture
- ✅ Role-based access control
- ✅ JWT authentication
- ✅ School management
- ✅ User management (Teachers, Students)
- ✅ Attendance tracking
- ✅ Results/marks management
- ✅ SMS notifications
- ✅ Reporting and analytics

### Advanced Features
- ✅ PDF report generation
- ✅ SMS usage tracking and billing
- ✅ Platform analytics
- ✅ Responsive design
- ✅ Real-time notifications

## Development

### Backend Development
- API endpoints follow RESTful conventions
- All routes are protected with JWT authentication
- Role-based guards ensure proper access control
- Data validation using class-validator
- MongoDB with Mongoose for data persistence

### Frontend Development
- Built with Next.js 14 App Router
- Styled with Tailwind CSS and shadcn/ui
- TypeScript for type safety
- Zustand for state management
- Responsive design for all devices

## Contributing

1. Follow the implementation steps in `implementation-steps.md`
2. Ensure all tests pass before submitting
3. Follow TypeScript and ESLint conventions
4. Update documentation as needed

## License

MIT License
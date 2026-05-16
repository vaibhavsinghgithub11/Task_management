# 🚀 Team Task Management System

A full-stack web application for managing projects, tasks, and team collaboration with role-based access control.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.2.6-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-6.0.2-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with JWT authentication
- Role-based access control (Admin & Member roles)
- Secure password hashing with bcrypt
- Persistent authentication with token management
- Auto-logout on token expiration

### 📁 Project Management
- Create, read, update, and delete projects
- Assign team members to projects
- View project details and team composition
- Role-based project editing (admin or creator only)
- Project statistics and analytics

### ✅ Task Management
- Create and assign tasks to team members
- Update task status (Todo, In Progress, Completed, Overdue)
- Set task priority (Low, Medium, High)
- Set due dates with overdue tracking
- Quick status updates via dropdown
- Task filtering and search functionality

### 🔍 Advanced Filtering & Search
- Filter tasks by status and priority
- Search tasks by title, description, project, or assignee
- Real-time filtering with instant results
- Combined filter support
- Clear all filters option

### 📊 Dashboard & Analytics
- Task statistics (total, completed, in progress, overdue)
- Project count and overview
- User statistics (admin only)
- Completion rate tracking
- Recent tasks display
- Visual task status charts

### 👥 User Management (Admin Only)
- View all users
- Update user roles
- Delete users
- User statistics and activity

### 🎨 Modern UI/UX
- Clean, responsive design with Tailwind CSS
- Intuitive navigation and layout
- Loading states and spinners
- Error handling with user-friendly messages
- Success notifications
- Confirmation dialogs for destructive actions
- Empty states with call-to-action
- Color-coded status and priority badges

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Express Validator
- **CORS**: cors middleware

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **State Management**: React Context API

### Development Tools
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Package Manager**: npm
- **Version Control**: Git

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (v6.0 or higher)
- **Git**

### Check Versions
```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
mongod --version # Should be >= 6.0
```

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod

# Or on macOS with Homebrew
brew services start mongodb-community
```

**Option B: MongoDB Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option C: MongoDB Atlas**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Use it in the `.env` file

## 🔧 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/team-task-manager

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Important Notes:**
- `JWT_SECRET`: Use a strong, random string (minimum 32 characters)
- `MONGO_URI`: Update with your MongoDB connection string
- `JWT_EXPIRE`: Token expiration time (e.g., 7d, 24h, 30m)

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5001/api
```

**Important Notes:**
- `VITE_API_URL`: Must match your backend URL and include `/api`
- Vite requires `VITE_` prefix for environment variables

## 🏃 Running the Application

### Development Mode

**Terminal 1: Start Backend**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5001`

**Terminal 2: Start Frontend**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Mode

**Build Backend**
```bash
cd backend
npm run build
npm start
```

**Build Frontend**
```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5001/api
Production: https://your-domain.com/api
```

### Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### Authentication Endpoints
```http
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/me            # Get current user (Protected)
POST   /api/auth/logout        # Logout user (Protected)
```

#### Project Endpoints
```http
GET    /api/projects           # Get all projects (Protected)
POST   /api/projects           # Create project (Protected)
GET    /api/projects/:id       # Get single project (Protected)
PUT    /api/projects/:id       # Update project (Protected, Admin/Creator)
DELETE /api/projects/:id       # Delete project (Protected, Admin/Creator)
POST   /api/projects/:id/members        # Add member (Protected, Admin)
DELETE /api/projects/:id/members/:userId # Remove member (Protected, Admin)
GET    /api/projects/my/created         # Get my created projects (Protected)
```

#### Task Endpoints
```http
GET    /api/tasks              # Get all tasks (Protected)
POST   /api/tasks              # Create task (Protected, Admin)
GET    /api/tasks/:id          # Get single task (Protected)
PUT    /api/tasks/:id          # Update task (Protected, Admin)
PATCH  /api/tasks/:id/status   # Update task status (Protected, Admin/Assignee)
DELETE /api/tasks/:id          # Delete task (Protected, Admin)
GET    /api/tasks/project/:id  # Get tasks by project (Protected)
GET    /api/tasks/my/assigned  # Get my assigned tasks (Protected)
```

#### User Endpoints (Admin Only)
```http
GET    /api/users              # Get all users (Protected, Admin)
GET    /api/users/:id          # Get single user (Protected, Admin)
PUT    /api/users/:id/role     # Update user role (Protected, Admin)
DELETE /api/users/:id          # Delete user (Protected, Admin)
GET    /api/users/stats        # Get user statistics (Protected, Admin)
```

#### Dashboard Endpoints
```http
GET    /api/dashboard/stats              # Get dashboard statistics (Protected)
GET    /api/dashboard/tasks/by-priority  # Get tasks by priority (Protected)
GET    /api/dashboard/tasks/by-status    # Get tasks by status (Protected)
GET    /api/dashboard/tasks/recent       # Get recent tasks (Protected)
GET    /api/dashboard/tasks/upcoming     # Get upcoming tasks (Protected)
GET    /api/dashboard/team/performance   # Get team performance (Protected, Admin)
```

### Request/Response Examples

#### Register User
**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "member"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

#### Create Project
**Request:**
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Website Redesign",
  "description": "Redesign company website with modern UI",
  "members": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Website Redesign",
    "description": "Redesign company website with modern UI",
    "createdBy": {
      "id": "507f1f77bcf86cd799439010",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "members": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create Task
**Request:**
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design Homepage",
  "description": "Create mockups for the new homepage",
  "status": "Todo",
  "priority": "High",
  "dueDate": "2024-12-31",
  "assignedTo": "507f1f77bcf86cd799439011",
  "project": "507f1f77bcf86cd799439013"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "title": "Design Homepage",
    "description": "Create mockups for the new homepage",
    "status": "Todo",
    "priority": "High",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "assignedTo": {...},
    "project": {...},
    "createdBy": {...},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts           # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.ts     # Authentication logic
│   │   │   ├── dashboardController.ts # Dashboard logic
│   │   │   ├── projectController.ts  # Project CRUD
│   │   │   ├── taskController.ts     # Task CRUD
│   │   │   └── userController.ts     # User management
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT verification
│   │   │   └── errorHandler.ts       # Global error handler
│   │   ├── models/
│   │   │   ├── User.ts               # User schema
│   │   │   ├── Project.ts            # Project schema
│   │   │   └── Task.ts               # Task schema
│   │   ├── routes/
│   │   │   ├── authRoutes.ts         # Auth routes
│   │   │   ├── dashboardRoutes.ts    # Dashboard routes
│   │   │   ├── projectRoutes.ts      # Project routes
│   │   │   ├── taskRoutes.ts         # Task routes
│   │   │   └── userRoutes.ts         # User routes
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript types
│   │   ├── utils/
│   │   │   ├── asyncHandler.ts       # Async error wrapper
│   │   │   └── errorResponse.ts      # Error response class
│   │   ├── app.ts                    # Express app setup
│   │   └── server.ts                 # Server entry point
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Environment template
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.ts               # Auth API calls
│   │   │   ├── axios.ts              # Axios configuration
│   │   │   ├── dashboard.ts          # Dashboard API calls
│   │   │   ├── projects.ts           # Project API calls
│   │   │   ├── tasks.ts              # Task API calls
│   │   │   └── users.ts              # User API calls
│   │   ├── components/
│   │   │   ├── common/               # Reusable components
│   │   │   ├── dashboard/            # Dashboard components
│   │   │   ├── layout/               # Layout components
│   │   │   ├── projects/             # Project components
│   │   │   └── tasks/                # Task components
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # Auth state management
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx   # Main layout
│   │   ├── pages/
│   │   │   ├── ApiTest.tsx           # API testing page
│   │   │   ├── Dashboard.tsx         # Dashboard page
│   │   │   ├── Login.tsx             # Login page
│   │   │   ├── Projects.tsx          # Projects page
│   │   │   ├── Register.tsx          # Register page
│   │   │   ├── Tasks.tsx             # Tasks page
│   │   │   └── Users.tsx             # Users page
│   │   ├── routes/
│   │   │   ├── AppRoutes.tsx         # Route configuration
│   │   │   └── ProtectedRoute.tsx    # Route protection
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript types
│   │   ├── utils/
│   │   │   └── apiTest.ts            # API testing utility
│   │   ├── App.tsx                   # Root component
│   │   ├── App.css                   # App styles
│   │   ├── index.css                 # Global styles
│   │   └── main.tsx                  # Entry point
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Environment template
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
├── README.md                         # This file
└── LICENSE
```

## 👥 User Roles

### Admin
**Permissions:**
- ✅ All member permissions
- ✅ Create, edit, delete any project
- ✅ Create, edit, delete any task
- ✅ Update status of any task
- ✅ View all users
- ✅ Update user roles
- ✅ Delete users
- ✅ View user statistics
- ✅ Access admin-only features

### Member
**Permissions:**
- ✅ View all projects
- ✅ Create projects
- ✅ Edit/delete own projects
- ✅ View all tasks
- ✅ Update status of assigned tasks
- ✅ View own statistics
- ❌ Cannot create/edit/delete tasks
- ❌ Cannot manage users
- ❌ Cannot access admin features

## 📸 Screenshots

### Login Page
![Login Page](./screenshots/login.png)
*User authentication with email and password*

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Overview of tasks, projects, and statistics*

### Projects Page
![Projects](./screenshots/projects.png)
*Project management with team members*

### Tasks Page
![Tasks](./screenshots/tasks.png)
*Task management with filters and search*

### Create Task Modal
![Create Task](./screenshots/create-task.png)
*Task creation form with all fields*

### User Management (Admin)
![Users](./screenshots/users.png)
*User management interface for admins*

> **Note:** Add actual screenshots to the `screenshots/` directory

## 🧪 Testing

### Manual Testing

1. **Authentication Flow**
   ```bash
   # Register a new user
   # Login with credentials
   # Verify token is stored
   # Access protected routes
   # Logout and verify redirect
   ```

2. **Project Management**
   ```bash
   # Create a new project
   # Add team members
   # Edit project details
   # Delete project
   ```

3. **Task Management**
   ```bash
   # Create tasks
   # Update task status
   # Filter and search tasks
   # Delete tasks
   ```

### API Testing

**Using the Built-in API Test Page:**
1. Login as admin
2. Navigate to `/api-test`
3. Click "Run All Tests"
4. Review results

**Using Browser Console:**
```javascript
await testApiConnection()
```

**Using cURL:**
```bash
# Health check
curl http://localhost:5001/health

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get projects (with token)
curl http://localhost:5001/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Credentials

For testing purposes, create these users:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`
- Role: `admin`

**Member User:**
- Email: `member@example.com`
- Password: `member123`
- Role: `member`

## 🚀 Deployment

**Your project is fully configured for deployment!** 🎉

### Quick Deploy (5 minutes)

```bash
# 1. Setup environment
./scripts/setup-env.sh

# 2. Deploy to cloud (Railway + Vercel)
./scripts/deploy-all.sh

# OR deploy with Docker
./scripts/docker-deploy.sh up
```

### 📚 Deployment Documentation

We've created comprehensive deployment guides for you:

| Guide | Purpose | Link |
|-------|---------|------|
| **Quick Start** | Deploy in 5 minutes | [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md) |
| **Full Guide** | Comprehensive deployment | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| **Overview** | Scripts & options | [README_DEPLOYMENT.md](./README_DEPLOYMENT.md) |
| **Summary** | What's been set up | [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) |

### 🎯 Deployment Options

#### Option 1: Cloud Deployment ⭐ RECOMMENDED
Deploy to Railway (Backend) + Vercel (Frontend) + MongoDB Atlas (Database)

```bash
./scripts/deploy-all.sh
```

**Features**: Automatic HTTPS, CDN, Auto-scaling, Free tier  
**Time**: ~5 minutes  
**Best for**: Production

#### Option 2: Docker Deployment
Run everything with Docker Compose

```bash
./scripts/docker-deploy.sh up
```

**Features**: Self-hosted, Full control, All-in-one  
**Time**: ~2 minutes  
**Best for**: Development, Testing

#### Option 3: CI/CD Deployment
Automated deployment on every push

1. Configure GitHub secrets (see [.github/DEPLOYMENT_SECRETS.md](./.github/DEPLOYMENT_SECRETS.md))
2. Push to main branch
3. Automatic deployment!

**Features**: Fully automated, Deploy on push  
**Best for**: Team collaboration

### 🛠️ Deployment Scripts

All scripts are ready to use in the `scripts/` directory:

```bash
./scripts/setup-env.sh              # Setup environment files
./scripts/pre-deploy-check.sh       # Validate deployment readiness
./scripts/deploy-all.sh             # Deploy everything
./scripts/deploy-backend.sh railway # Deploy backend only
./scripts/deploy-frontend.sh vercel # Deploy frontend only
./scripts/docker-deploy.sh up       # Docker deployment
./scripts/health-check.sh           # Check service health
./scripts/rollback.sh railway       # Rollback deployment
```

### 📦 What's Included

✅ **8 Deployment Scripts** - Automated deployment tools  
✅ **Docker Configuration** - Full containerization setup  
✅ **Platform Configs** - Railway, Vercel ready  
✅ **CI/CD Pipelines** - GitHub Actions workflows  
✅ **Comprehensive Docs** - Step-by-step guides  

### 🚦 Quick Start

```bash
# 1. Setup
./scripts/setup-env.sh

# 2. Verify
./scripts/pre-deploy-check.sh

# 3. Deploy
./scripts/deploy-all.sh  # Cloud
# OR
./scripts/docker-deploy.sh up  # Docker

# 4. Check
./scripts/health-check.sh <backend_url> <frontend_url>
```

### 📖 Detailed Guides

For detailed deployment instructions, see:
- **[START_HERE.md](./START_HERE.md)** - Simple starting point
- **[DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)** - 5-minute guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete documentation

**Docker Compose:**
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/team-task-manager
      - JWT_SECRET=${JWT_SECRET}
      - FRONTEND_URL=${FRONTEND_URL}
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=${BACKEND_URL}/api
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## 🔧 Troubleshooting

### Common Issues

#### Backend won't start
**Problem:** Port already in use
```bash
# Find process using port 5001
lsof -i :5001

# Kill the process
kill -9 <PID>
```

**Problem:** MongoDB connection failed
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB
mongod
# or
brew services start mongodb-community
```

#### Frontend can't connect to backend
**Problem:** CORS error
- Check `FRONTEND_URL` in backend `.env`
- Verify CORS configuration in `backend/src/app.ts`
- Restart backend server

**Problem:** API URL incorrect
- Check `VITE_API_URL` in frontend `.env`
- Ensure it includes `/api` at the end
- Restart frontend dev server

#### Authentication issues
**Problem:** Token not working
```javascript
// Clear localStorage and login again
localStorage.clear()
// Then login through the UI
```

**Problem:** Auto-logout on every request
- Check JWT_SECRET is set in backend
- Verify token expiration time
- Check browser console for errors

#### Database issues
**Problem:** Validation errors
- Check required fields in models
- Verify data types match schema
- Review error messages in console

**Problem:** Duplicate key error
- Email already exists
- Clear database or use different email

### Debug Mode

**Backend:**
```bash
# Enable debug logging
NODE_ENV=development npm run dev
```

**Frontend:**
```bash
# Check environment variables
console.log(import.meta.env)

# Check API configuration
console.log(axios.defaults.baseURL)
```

### Getting Help

1. Check the [Issues](https://github.com/yourusername/team-task-manager/issues) page
2. Review the troubleshooting section
3. Check backend and frontend logs
4. Verify environment variables
5. Test API endpoints manually

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards
- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Backend framework
- [React](https://react.dev/) - Frontend library
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool

## 📞 Support

For support, email your.email@example.com or open an issue on GitHub.

---

**Made with ❤️ by Your Name**

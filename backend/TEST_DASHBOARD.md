# Dashboard API Testing Guide

## Overview

Dashboard APIs provide real-time statistics and analytics for tasks, projects, and team performance. Admins see system-wide data, while members see only their own data.

---

## Dashboard Endpoints

### 1. Get Dashboard Statistics

**GET** `/api/dashboard/stats`

Returns comprehensive statistics including tasks, projects, and users.

```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Admin Response:**
```json
{
  "success": true,
  "data": {
    "tasks": {
      "total": 15,
      "completed": 8,
      "inProgress": 4,
      "todo": 2,
      "overdue": 1,
      "pending": 6,
      "completionRate": 53
    },
    "projects": {
      "total": 3
    },
    "users": {
      "totalUsers": 5,
      "adminCount": 1,
      "memberCount": 4
    }
  }
}
```

**Member Response:**
```json
{
  "success": true,
  "data": {
    "tasks": {
      "total": 5,
      "completed": 3,
      "inProgress": 1,
      "todo": 1,
      "overdue": 0,
      "pending": 2,
      "completionRate": 60
    },
    "projects": {
      "total": 2
    },
    "users": null
  }
}
```

---

### 2. Get Tasks by Priority

**GET** `/api/dashboard/tasks/by-priority`

Returns task count grouped by priority.

```bash
curl -X GET http://localhost:5000/api/dashboard/tasks/by-priority \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "priority": "High",
      "count": 6
    },
    {
      "priority": "Medium",
      "count": 7
    },
    {
      "priority": "Low",
      "count": 2
    }
  ]
}
```

---

### 3. Get Tasks by Status

**GET** `/api/dashboard/tasks/by-status`

Returns task count grouped by status.

```bash
curl -X GET http://localhost:5000/api/dashboard/tasks/by-status \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "status": "Todo",
      "count": 5
    },
    {
      "status": "In Progress",
      "count": 4
    },
    {
      "status": "Completed",
      "count": 8
    },
    {
      "status": "Overdue",
      "count": 1
    }
  ]
}
```

---

### 4. Get Recent Tasks

**GET** `/api/dashboard/tasks/recent?limit=5`

Returns most recently created tasks.

```bash
curl -X GET "http://localhost:5000/api/dashboard/tasks/recent?limit=5" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "title": "Design Homepage UI",
      "description": "Create wireframes and mockups",
      "status": "In Progress",
      "priority": "High",
      "dueDate": "2026-05-20T00:00:00.000Z",
      "assignedTo": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@test.com"
      },
      "project": {
        "_id": "...",
        "title": "E-Commerce Platform"
      },
      "createdBy": {
        "_id": "...",
        "name": "Admin User",
        "email": "admin@test.com"
      },
      "createdAt": "2026-05-15T..."
    }
  ]
}
```

---

### 5. Get Upcoming Tasks

**GET** `/api/dashboard/tasks/upcoming?limit=5`

Returns tasks with nearest due dates (not completed).

```bash
curl -X GET "http://localhost:5000/api/dashboard/tasks/upcoming?limit=5" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "title": "Setup Database Schema",
      "status": "In Progress",
      "priority": "High",
      "dueDate": "2026-05-18T00:00:00.000Z",
      "assignedTo": {...},
      "project": {...}
    }
  ]
}
```

---

### 6. Get Tasks by Project (Admin Only)

**GET** `/api/dashboard/tasks/by-project`

Returns task statistics grouped by project.

```bash
curl -X GET http://localhost:5000/api/dashboard/tasks/by-project \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "projectId": "...",
      "projectTitle": "E-Commerce Platform",
      "total": 10,
      "completed": 5,
      "inProgress": 3,
      "todo": 1,
      "overdue": 1,
      "completionRate": 50
    },
    {
      "projectId": "...",
      "projectTitle": "Mobile App",
      "total": 5,
      "completed": 3,
      "inProgress": 1,
      "todo": 1,
      "overdue": 0,
      "completionRate": 60
    }
  ]
}
```

---

### 7. Get Team Performance (Admin Only)

**GET** `/api/dashboard/team/performance`

Returns performance metrics for each team member.

```bash
curl -X GET http://localhost:5000/api/dashboard/team/performance \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "userId": "...",
      "userName": "John Doe",
      "userEmail": "john@test.com",
      "totalTasks": 8,
      "completedTasks": 5,
      "inProgressTasks": 2,
      "overdueTasks": 1,
      "completionRate": 62.5
    },
    {
      "userId": "...",
      "userName": "Jane Smith",
      "userEmail": "jane@test.com",
      "totalTasks": 7,
      "completedTasks": 3,
      "inProgressTasks": 2,
      "overdueTasks": 0,
      "completionRate": 42.86
    }
  ]
}
```

---

### 8. Get Activity Summary

**GET** `/api/dashboard/activity`

Returns activity summary for the last 7 days.

```bash
curl -X GET http://localhost:5000/api/dashboard/activity \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "Last 7 days",
    "tasksCreated": 12,
    "tasksCompleted": 8,
    "projectsCreated": 2
  }
}
```

---

## Complete Test Script

Save as `test-dashboard.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "==================================="
echo "Dashboard API Testing"
echo "==================================="
echo ""

# Create Admin
echo "1. Creating Admin..."
ADMIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@dashboard.com",
    "password": "admin123",
    "role": "admin"
  }')
ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.data.token')
echo "✅ Admin created"
echo ""

# Create Members
echo "2. Creating Members..."
MEMBER1_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@dashboard.com",
    "password": "member123",
    "role": "member"
  }')
MEMBER1_TOKEN=$(echo $MEMBER1_RESPONSE | jq -r '.data.token')
MEMBER1_ID=$(echo $MEMBER1_RESPONSE | jq -r '.data.user.id')
echo "✅ Member 1 created"

MEMBER2_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@dashboard.com",
    "password": "member123",
    "role": "member"
  }')
MEMBER2_ID=$(echo $MEMBER2_RESPONSE | jq -r '.data.user.id')
echo "✅ Member 2 created"
echo ""

# Create Project
echo "3. Creating Project..."
PROJECT_RESPONSE=$(curl -s -X POST $BASE_URL/api/projects \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"E-Commerce Platform\",
    \"description\": \"Build a full-stack e-commerce website\",
    \"members\": [\"$MEMBER1_ID\", \"$MEMBER2_ID\"]
  }")
PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.data._id')
echo "✅ Project created"
echo ""

# Create Tasks
echo "4. Creating Tasks..."
for i in {1..5}; do
  STATUS=("Todo" "In Progress" "Completed" "Todo" "In Progress")
  PRIORITY=("High" "Medium" "Low" "High" "Medium")
  ASSIGNED=($MEMBER1_ID $MEMBER2_ID $MEMBER1_ID $MEMBER2_ID $MEMBER1_ID)
  
  curl -s -X POST $BASE_URL/api/tasks \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"title\": \"Task $i\",
      \"description\": \"Description for task $i\",
      \"status\": \"${STATUS[$i-1]}\",
      \"priority\": \"${PRIORITY[$i-1]}\",
      \"dueDate\": \"2026-05-20T00:00:00.000Z\",
      \"assignedTo\": \"${ASSIGNED[$i-1]}\",
      \"project\": \"$PROJECT_ID\"
    }" > /dev/null
done
echo "✅ 5 tasks created"
echo ""

# Get Dashboard Stats
echo "5. Getting Dashboard Stats (Admin)..."
curl -s -X GET $BASE_URL/api/dashboard/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo ""

# Get Tasks by Priority
echo "6. Getting Tasks by Priority..."
curl -s -X GET $BASE_URL/api/dashboard/tasks/by-priority \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo ""

# Get Tasks by Status
echo "7. Getting Tasks by Status..."
curl -s -X GET $BASE_URL/api/dashboard/tasks/by-status \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo ""

# Get Recent Tasks
echo "8. Getting Recent Tasks..."
curl -s -X GET "$BASE_URL/api/dashboard/tasks/recent?limit=3" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo ""

# Get Upcoming Tasks
echo "9. Getting Upcoming Tasks..."
curl -s -X GET "$BASE_URL/api/dashboard/tasks/upcoming?limit=3" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo ""

# Get Tasks by Project
echo "10. Getting Tasks by Project (Admin Only)..."
curl -s -X GET $BASE_URL/api/dashboard/tasks/by-project \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo ""

# Get Team Performance
echo "11. Getting Team Performance (Admin Only)..."
curl -s -X GET $BASE_URL/api/dashboard/team/performance \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo ""

# Get Activity Summary
echo "12. Getting Activity Summary..."
curl -s -X GET $BASE_URL/api/dashboard/activity \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo ""

# Member View
echo "13. Getting Dashboard Stats (Member View)..."
curl -s -X GET $BASE_URL/api/dashboard/stats \
  -H "Authorization: Bearer $MEMBER1_TOKEN" | jq '.'
echo ""

echo "==================================="
echo "Dashboard Tests Complete"
echo "==================================="
```

---

## API Endpoints Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/stats` | All | Overall statistics |
| GET | `/api/dashboard/tasks/by-priority` | All | Tasks grouped by priority |
| GET | `/api/dashboard/tasks/by-status` | All | Tasks grouped by status |
| GET | `/api/dashboard/tasks/recent` | All | Recent tasks |
| GET | `/api/dashboard/tasks/upcoming` | All | Upcoming tasks by due date |
| GET | `/api/dashboard/tasks/by-project` | Admin | Tasks grouped by project |
| GET | `/api/dashboard/team/performance` | Admin | Team member performance |
| GET | `/api/dashboard/activity` | All | Activity summary (7 days) |

---

## Data Visibility

### Admin Dashboard
- ✅ All tasks across all projects
- ✅ All projects
- ✅ User statistics
- ✅ Team performance metrics
- ✅ System-wide analytics

### Member Dashboard
- ✅ Only their assigned tasks
- ✅ Only projects they're members of
- ❌ No user statistics
- ❌ No team performance
- ✅ Personal analytics only

---

## Use Cases

### For Admin
1. **Monitor overall progress** - Total tasks, completion rate
2. **Identify bottlenecks** - Overdue tasks, stuck projects
3. **Track team performance** - Who's completing tasks
4. **Resource allocation** - Task distribution by priority
5. **Project health** - Completion rates per project

### For Members
1. **Personal progress** - My task completion rate
2. **Workload overview** - Total assigned tasks
3. **Upcoming deadlines** - Tasks due soon
4. **Recent activity** - Latest task updates
5. **Priority management** - High priority tasks

---

## Chart/Widget Ideas

Based on these APIs, you can build:

1. **Stats Cards**
   - Total Tasks
   - Completed Tasks
   - Pending Tasks
   - Overdue Tasks

2. **Pie Charts**
   - Tasks by Status
   - Tasks by Priority

3. **Bar Charts**
   - Tasks by Project
   - Team Performance

4. **Lists**
   - Recent Tasks
   - Upcoming Tasks

5. **Progress Bars**
   - Completion Rate
   - Project Progress

6. **Activity Timeline**
   - Last 7 days activity

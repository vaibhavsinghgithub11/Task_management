# Task Module Testing Guide

## Overview

Tasks are the core work items in the system. Admins can create and assign tasks to project members. Members can update the status of tasks assigned to them.

**Task Properties:**
- Title & Description
- Status: Todo, In Progress, Completed, Overdue
- Priority: Low, Medium, High
- Due Date
- Assigned To (User)
- Project (must belong to a project)

---

## Setup: Create Test Data

### 1. Create Admin User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@task.com",
    "password": "admin123",
    "role": "admin"
  }'
```

**Save: `ADMIN_TOKEN`, `ADMIN_ID`**

### 2. Create Member Users

```bash
# Member 1
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@task.com",
    "password": "member123",
    "role": "member"
  }'
```

**Save: `MEMBER1_TOKEN`, `MEMBER1_ID`**

```bash
# Member 2
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@task.com",
    "password": "member123",
    "role": "member"
  }'
```

**Save: `MEMBER2_TOKEN`, `MEMBER2_ID`**

### 3. Create a Project

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "E-Commerce Platform",
    "description": "Build a full-stack e-commerce website",
    "members": ["MEMBER1_ID", "MEMBER2_ID"]
  }'
```

**Save: `PROJECT_ID`**

---

## Task CRUD Operations

### 1. Create Task (Admin Only)

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Homepage UI",
    "description": "Create wireframes and mockups for the homepage",
    "status": "Todo",
    "priority": "High",
    "dueDate": "2026-05-20T00:00:00.000Z",
    "assignedTo": "MEMBER1_ID",
    "project": "PROJECT_ID"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "TASK_ID",
    "title": "Design Homepage UI",
    "description": "Create wireframes and mockups for the homepage",
    "status": "Todo",
    "priority": "High",
    "dueDate": "2026-05-20T00:00:00.000Z",
    "assignedTo": {
      "_id": "MEMBER1_ID",
      "name": "John Doe",
      "email": "john@task.com",
      "role": "member"
    },
    "project": {
      "_id": "PROJECT_ID",
      "title": "E-Commerce Platform"
    },
    "createdBy": {
      "_id": "ADMIN_ID",
      "name": "Admin User",
      "email": "admin@task.com",
      "role": "admin"
    },
    "createdAt": "2026-05-15T...",
    "updatedAt": "2026-05-15T..."
  }
}
```

**Save: `TASK_ID`**

### 2. Create Multiple Tasks

```bash
# Task 2
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Setup Database Schema",
    "description": "Design and implement MongoDB schema for products",
    "status": "In Progress",
    "priority": "High",
    "dueDate": "2026-05-18T00:00:00.000Z",
    "assignedTo": "MEMBER2_ID",
    "project": "PROJECT_ID"
  }'

# Task 3
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Write API Documentation",
    "description": "Document all REST API endpoints",
    "status": "Todo",
    "priority": "Low",
    "dueDate": "2026-05-25T00:00:00.000Z",
    "assignedTo": "MEMBER1_ID",
    "project": "PROJECT_ID"
  }'
```

### 3. Get All Tasks (Admin View)

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected:** Admin sees ALL tasks

### 4. Get All Tasks (Member View)

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer MEMBER1_TOKEN"
```

**Expected:** Member sees ONLY tasks assigned to them

### 5. Get Single Task

```bash
curl -X GET http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 6. Update Task (Admin Only)

```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Homepage UI (Updated)",
    "priority": "Medium",
    "dueDate": "2026-05-22T00:00:00.000Z"
  }'
```

### 7. Update Task Status (Members Can Update Their Own)

```bash
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID/status \
  -H "Authorization: Bearer MEMBER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Progress"
  }'
```

**Expected:** Success (member updating their own task)

### 8. Delete Task (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Filtering & Search

### 9. Filter by Status

```bash
curl -X GET "http://localhost:5000/api/tasks?status=Todo" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 10. Filter by Priority

```bash
curl -X GET "http://localhost:5000/api/tasks?priority=High" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 11. Filter by Project

```bash
curl -X GET "http://localhost:5000/api/tasks?project=PROJECT_ID" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 12. Search by Title

```bash
curl -X GET "http://localhost:5000/api/tasks?search=Design" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 13. Combined Filters

```bash
curl -X GET "http://localhost:5000/api/tasks?status=Todo&priority=High&project=PROJECT_ID" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Special Endpoints

### 14. Get Tasks by Project

```bash
curl -X GET http://localhost:5000/api/tasks/project/PROJECT_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 15. Get My Assigned Tasks

```bash
curl -X GET http://localhost:5000/api/tasks/my/assigned \
  -H "Authorization: Bearer MEMBER1_TOKEN"
```

---

## Access Control Tests

### ❌ Test 16: Member Cannot Create Task

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer MEMBER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Unauthorized Task",
    "description": "This should fail",
    "dueDate": "2026-05-20T00:00:00.000Z",
    "assignedTo": "MEMBER2_ID",
    "project": "PROJECT_ID"
  }'
```

**Expected:** 403 - "Access denied. Admin privileges required"

### ❌ Test 17: Member Cannot Update Full Task

```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer MEMBER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hacked Title"
  }'
```

**Expected:** 403 - Access denied

### ✅ Test 18: Member CAN Update Their Own Task Status

```bash
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID/status \
  -H "Authorization: Bearer MEMBER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Completed"
  }'
```

**Expected:** 200 - Success

### ❌ Test 19: Member Cannot Update Other's Task Status

```bash
# MEMBER1 tries to update MEMBER2's task
curl -X PATCH http://localhost:5000/api/tasks/MEMBER2_TASK_ID/status \
  -H "Authorization: Bearer MEMBER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Completed"
  }'
```

**Expected:** 403 - "You can only update tasks assigned to you"

### ❌ Test 20: Member Cannot Delete Task

```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer MEMBER1_TOKEN"
```

**Expected:** 403 - Access denied

### ❌ Test 21: Member Cannot Access Other's Task

```bash
curl -X GET http://localhost:5000/api/tasks/MEMBER2_TASK_ID \
  -H "Authorization: Bearer MEMBER1_TOKEN"
```

**Expected:** 403 - "Not authorized to access this task"

---

## Validation Tests

### ❌ Test 22: Create Task Without Required Fields

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Incomplete Task"
  }'
```

**Expected:** 400 - "Please provide all required fields"

### ❌ Test 23: Assign Task to Non-Project Member

```bash
# Create a user not in the project
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Outsider",
    "email": "outsider@task.com",
    "password": "password123",
    "role": "member"
  }'

# Try to assign task to them
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Invalid Assignment",
    "description": "This should fail",
    "dueDate": "2026-05-20T00:00:00.000Z",
    "assignedTo": "OUTSIDER_ID",
    "project": "PROJECT_ID"
  }'
```

**Expected:** 400 - "User must be a member of the project to be assigned tasks"

### ❌ Test 24: Invalid Status Value

```bash
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID/status \
  -H "Authorization: Bearer MEMBER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "InvalidStatus"
  }'
```

**Expected:** 400 - "Invalid status value"

---

## Complete Test Script

Save as `test-tasks.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "==================================="
echo "Task Module Testing"
echo "==================================="
echo ""

# Create Admin
echo "1. Creating Admin..."
ADMIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@tasktest.com",
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
    "email": "john@tasktest.com",
    "password": "member123",
    "role": "member"
  }')
MEMBER1_TOKEN=$(echo $MEMBER1_RESPONSE | jq -r '.data.token')
MEMBER1_ID=$(echo $MEMBER1_RESPONSE | jq -r '.data.user.id')
echo "✅ Member 1 created: $MEMBER1_ID"

MEMBER2_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@tasktest.com",
    "password": "member123",
    "role": "member"
  }')
MEMBER2_ID=$(echo $MEMBER2_RESPONSE | jq -r '.data.user.id')
echo "✅ Member 2 created: $MEMBER2_ID"
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
echo "✅ Project created: $PROJECT_ID"
echo ""

# Create Task
echo "4. Creating Task..."
TASK_RESPONSE=$(curl -s -X POST $BASE_URL/api/tasks \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Design Homepage UI\",
    \"description\": \"Create wireframes and mockups\",
    \"status\": \"Todo\",
    \"priority\": \"High\",
    \"dueDate\": \"2026-05-20T00:00:00.000Z\",
    \"assignedTo\": \"$MEMBER1_ID\",
    \"project\": \"$PROJECT_ID\"
  }")
echo $TASK_RESPONSE | jq '.'
TASK_ID=$(echo $TASK_RESPONSE | jq -r '.data._id')
echo ""

# Get All Tasks (Admin)
echo "5. Getting All Tasks (Admin View)..."
curl -s -X GET $BASE_URL/api/tasks \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo ""

# Get All Tasks (Member)
echo "6. Getting All Tasks (Member View)..."
curl -s -X GET $BASE_URL/api/tasks \
  -H "Authorization: Bearer $MEMBER1_TOKEN" | jq '.'
echo ""

# Member Updates Task Status
echo "7. Member Updates Task Status..."
curl -s -X PATCH $BASE_URL/api/tasks/$TASK_ID/status \
  -H "Authorization: Bearer $MEMBER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Progress"
  }' | jq '.'
echo ""

# Member Tries to Create Task (Should Fail)
echo "8. Member Tries to Create Task (Should Fail)..."
curl -s -X POST $BASE_URL/api/tasks \
  -H "Authorization: Bearer $MEMBER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Unauthorized Task\",
    \"description\": \"This should fail\",
    \"dueDate\": \"2026-05-20T00:00:00.000Z\",
    \"assignedTo\": \"$MEMBER2_ID\",
    \"project\": \"$PROJECT_ID\"
  }" | jq '.'
echo ""

echo "==================================="
echo "Task Tests Complete"
echo "==================================="
```

---

## API Endpoints Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/tasks` | Admin | Create task |
| GET | `/api/tasks` | All | Get tasks (filtered by role) |
| GET | `/api/tasks/:id` | All | Get single task |
| PUT | `/api/tasks/:id` | Admin | Update task |
| PATCH | `/api/tasks/:id/status` | All | Update task status |
| DELETE | `/api/tasks/:id` | Admin | Delete task |
| GET | `/api/tasks/project/:projectId` | All | Get tasks by project |
| GET | `/api/tasks/my/assigned` | All | Get my assigned tasks |

---

## Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| status | string | Filter by status | `?status=Todo` |
| priority | string | Filter by priority | `?priority=High` |
| project | string | Filter by project ID | `?project=123` |
| search | string | Search in title | `?search=Design` |

---

## Access Control Matrix

| Action | Admin | Member (Assigned) | Member (Not Assigned) |
|--------|-------|-------------------|----------------------|
| Create Task | ✅ | ❌ | ❌ |
| View All Tasks | ✅ (all) | ✅ (assigned only) | ✅ (none) |
| View Single Task | ✅ | ✅ | ❌ |
| Update Task (Full) | ✅ | ❌ | ❌ |
| Update Task Status | ✅ | ✅ (own only) | ❌ |
| Delete Task | ✅ | ❌ | ❌ |
| Get Tasks by Project | ✅ (all) | ✅ (assigned only) | ❌ |

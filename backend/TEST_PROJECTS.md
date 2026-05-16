# Project Module Testing Guide

## Overview

Projects are the core organizational unit where tasks will be assigned. Only admins can create and manage projects, but members can view projects they're assigned to.

---

## Setup: Create Test Users

### 1. Create Admin User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "admin"
  }'
```

**Save the token as `ADMIN_TOKEN` and user ID as `ADMIN_ID`**

### 2. Create Member Users

```bash
# Member 1
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "member123",
    "role": "member"
  }'
```

**Save the token as `MEMBER1_TOKEN` and user ID as `MEMBER1_ID`**

```bash
# Member 2
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@test.com",
    "password": "member123",
    "role": "member"
  }'
```

**Save the token as `MEMBER2_TOKEN` and user ID as `MEMBER2_ID`**

---

## Project CRUD Operations

### 1. Create Project (Admin Only)

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "E-Commerce Website",
    "description": "Build a full-stack e-commerce platform with React and Node.js",
    "members": ["MEMBER1_ID", "MEMBER2_ID"]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "_id": "PROJECT_ID",
    "title": "E-Commerce Website",
    "description": "Build a full-stack e-commerce platform with React and Node.js",
    "createdBy": {
      "_id": "ADMIN_ID",
      "name": "Admin User",
      "email": "admin@test.com",
      "role": "admin"
    },
    "members": [
      {
        "_id": "MEMBER1_ID",
        "name": "John Doe",
        "email": "john@test.com",
        "role": "member"
      },
      {
        "_id": "MEMBER2_ID",
        "name": "Jane Smith",
        "email": "jane@test.com",
        "role": "member"
      }
    ],
    "createdAt": "2026-05-15T...",
    "updatedAt": "2026-05-15T..."
  }
}
```

**Save the project ID as `PROJECT_ID`**

### 2. Create Project Without Members

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mobile App Development",
    "description": "Create a cross-platform mobile app using React Native"
  }'
```

### 3. Get All Projects (Admin View)

```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected:** Admin sees ALL projects

### 4. Get All Projects (Member View)

```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer MEMBER1_TOKEN"
```

**Expected:** Member sees ONLY projects they're assigned to

### 5. Get Single Project

```bash
curl -X GET http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 6. Update Project (Admin Only)

```bash
curl -X PUT http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "E-Commerce Platform (Updated)",
    "description": "Build a full-stack e-commerce platform with advanced features"
  }'
```

### 7. Delete Project (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Member Management

### 8. Add Member to Project

```bash
curl -X POST http://localhost:5000/api/projects/PROJECT_ID/members \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "MEMBER1_ID"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Member added to project successfully",
  "data": {
    "_id": "PROJECT_ID",
    "title": "E-Commerce Website",
    "members": [
      {
        "_id": "MEMBER1_ID",
        "name": "John Doe",
        "email": "john@test.com",
        "role": "member"
      }
    ]
  }
}
```

### 9. Remove Member from Project

```bash
curl -X DELETE http://localhost:5000/api/projects/PROJECT_ID/members/MEMBER1_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 10. Get Projects Created by Me (Admin Only)

```bash
curl -X GET http://localhost:5000/api/projects/my/created \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Access Control Tests

### ❌ Test 11: Member Cannot Create Project

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer MEMBER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Unauthorized Project",
    "description": "This should fail"
  }'
```

**Expected:** 403 - "Access denied. Admin privileges required"

### ❌ Test 12: Member Cannot Update Project

```bash
curl -X PUT http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer MEMBER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hacked Title"
  }'
```

**Expected:** 403 - Access denied

### ❌ Test 13: Member Cannot Delete Project

```bash
curl -X DELETE http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer MEMBER1_TOKEN"
```

**Expected:** 403 - Access denied

### ❌ Test 14: Member Cannot Add Members

```bash
curl -X POST http://localhost:5000/api/projects/PROJECT_ID/members \
  -H "Authorization: Bearer MEMBER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "MEMBER2_ID"
  }'
```

**Expected:** 403 - Access denied

### ❌ Test 15: Member Cannot Access Unassigned Project

Create a project without assigning MEMBER1, then try to access it:

```bash
curl -X GET http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer MEMBER1_TOKEN"
```

**Expected:** 403 - "Not authorized to access this project"

---

## Validation Tests

### ❌ Test 16: Create Project Without Title

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Missing title"
  }'
```

**Expected:** 400 - "Please provide title and description"

### ❌ Test 17: Add Invalid Member ID

```bash
curl -X POST http://localhost:5000/api/projects/PROJECT_ID/members \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "invalid_id_123"
  }'
```

**Expected:** 400 - "Invalid user ID"

### ❌ Test 18: Add Non-Existent User

```bash
curl -X POST http://localhost:5000/api/projects/PROJECT_ID/members \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011"
  }'
```

**Expected:** 404 - "User not found with ID: ..."

### ❌ Test 19: Add Duplicate Member

Add the same member twice:

```bash
# First time - should succeed
curl -X POST http://localhost:5000/api/projects/PROJECT_ID/members \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "MEMBER1_ID"
  }'

# Second time - should fail
curl -X POST http://localhost:5000/api/projects/PROJECT_ID/members \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "MEMBER1_ID"
  }'
```

**Expected:** 400 - "User is already a member of this project"

---

## Complete Test Script

Save as `test-projects.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "==================================="
echo "Project Module Testing"
echo "==================================="
echo ""

# Create Admin
echo "1. Creating Admin..."
ADMIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@project.com",
    "password": "admin123",
    "role": "admin"
  }')
ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.data.token')
ADMIN_ID=$(echo $ADMIN_RESPONSE | jq -r '.data.user.id')
echo "✅ Admin created: $ADMIN_ID"
echo ""

# Create Members
echo "2. Creating Members..."
MEMBER1_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@project.com",
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
    "email": "jane@project.com",
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
echo $PROJECT_RESPONSE | jq '.'
PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.data._id')
echo ""

# Get All Projects (Admin)
echo "4. Getting All Projects (Admin View)..."
curl -s -X GET $BASE_URL/api/projects \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'
echo ""

# Get All Projects (Member)
echo "5. Getting All Projects (Member View)..."
curl -s -X GET $BASE_URL/api/projects \
  -H "Authorization: Bearer $MEMBER1_TOKEN" | jq '.'
echo ""

# Member tries to create project (should fail)
echo "6. Member Tries to Create Project (Should Fail)..."
curl -s -X POST $BASE_URL/api/projects \
  -H "Authorization: Bearer $MEMBER1_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Unauthorized Project",
    "description": "This should fail"
  }' | jq '.'
echo ""

echo "==================================="
echo "Project Tests Complete"
echo "==================================="
```

---

## API Endpoints Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects` | All | Get projects (filtered by role) |
| GET | `/api/projects/:id` | All | Get single project |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |
| POST | `/api/projects/:id/members` | Admin | Add member |
| DELETE | `/api/projects/:id/members/:userId` | Admin | Remove member |
| GET | `/api/projects/my/created` | Admin | Get my created projects |

---

## Access Control Matrix

| Action | Admin | Member (Assigned) | Member (Not Assigned) |
|--------|-------|-------------------|----------------------|
| Create Project | ✅ | ❌ | ❌ |
| View All Projects | ✅ (all) | ✅ (assigned only) | ✅ (none) |
| View Single Project | ✅ | ✅ | ❌ |
| Update Project | ✅ | ❌ | ❌ |
| Delete Project | ✅ | ❌ | ❌ |
| Add Members | ✅ | ❌ | ❌ |
| Remove Members | ✅ | ❌ | ❌ |

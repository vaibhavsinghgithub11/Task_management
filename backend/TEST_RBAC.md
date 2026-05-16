# Role-Based Access Control (RBAC) Testing Guide

## Overview

This guide demonstrates how role-based access control works in the application.

**Roles:**
- **Admin** - Full access to all routes
- **Member** - Limited access, cannot access admin routes

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

**Save the token as `ADMIN_TOKEN`**

### 2. Create Member User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Member User",
    "email": "member@test.com",
    "password": "member123",
    "role": "member"
  }'
```

**Save the token as `MEMBER_TOKEN`**

---

## Testing Admin Routes

### ✅ Test 1: Admin Can Access User List

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected:** 200 - List of all users

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "name": "Admin User",
      "email": "admin@test.com",
      "role": "admin",
      "createdAt": "..."
    },
    {
      "_id": "...",
      "name": "Member User",
      "email": "member@test.com",
      "role": "member",
      "createdAt": "..."
    }
  ]
}
```

### ✅ Test 2: Admin Can Get User Statistics

```bash
curl -X GET http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected:** 200 - User statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 2,
    "adminCount": 1,
    "memberCount": 1,
    "recentUsers": 2
  }
}
```

### ✅ Test 3: Admin Can Get Single User

First, get a user ID from the user list, then:

```bash
curl -X GET http://localhost:5000/api/users/USER_ID_HERE \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected:** 200 - User details

### ✅ Test 4: Admin Can Update User Role

```bash
curl -X PUT http://localhost:5000/api/users/USER_ID_HERE/role \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

**Expected:** 200 - Role updated successfully

### ✅ Test 5: Admin Can Delete User

```bash
curl -X DELETE http://localhost:5000/api/users/USER_ID_HERE \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected:** 200 - User deleted successfully

---

## Testing Member Restrictions

### ❌ Test 6: Member CANNOT Access User List

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer MEMBER_TOKEN"
```

**Expected:** 403 - Access denied

**Response:**
```json
{
  "success": false,
  "error": "Access denied. Admin privileges required"
}
```

### ❌ Test 7: Member CANNOT Get User Statistics

```bash
curl -X GET http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer MEMBER_TOKEN"
```

**Expected:** 403 - Access denied

### ❌ Test 8: Member CANNOT Update User Role

```bash
curl -X PUT http://localhost:5000/api/users/USER_ID_HERE/role \
  -H "Authorization: Bearer MEMBER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

**Expected:** 403 - Access denied

### ❌ Test 9: Member CANNOT Delete User

```bash
curl -X DELETE http://localhost:5000/api/users/USER_ID_HERE \
  -H "Authorization: Bearer MEMBER_TOKEN"
```

**Expected:** 403 - Access denied

---

## Testing Authentication Requirements

### ❌ Test 10: Unauthenticated User Cannot Access Admin Routes

```bash
curl -X GET http://localhost:5000/api/users
```

**Expected:** 401 - Not authorized

**Response:**
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### ❌ Test 11: Invalid Token Cannot Access Admin Routes

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer invalid_token_12345"
```

**Expected:** 401 - Not authorized

---

## Complete Test Script

Save this as `test-rbac.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "==================================="
echo "RBAC Testing Script"
echo "==================================="
echo ""

# Register Admin
echo "1. Creating Admin User..."
ADMIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@rbac.com",
    "password": "admin123",
    "role": "admin"
  }')
ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.data.token')
echo "✅ Admin created"
echo ""

# Register Member
echo "2. Creating Member User..."
MEMBER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Member User",
    "email": "member@rbac.com",
    "password": "member123",
    "role": "member"
  }')
MEMBER_TOKEN=$(echo $MEMBER_RESPONSE | jq -r '.data.token')
echo "✅ Member created"
echo ""

# Test Admin Access
echo "3. Testing Admin Access to User List..."
ADMIN_ACCESS=$(curl -s -X GET $BASE_URL/api/users \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo $ADMIN_ACCESS | jq '.'
echo ""

# Test Member Access (Should Fail)
echo "4. Testing Member Access to User List (Should Fail)..."
MEMBER_ACCESS=$(curl -s -X GET $BASE_URL/api/users \
  -H "Authorization: Bearer $MEMBER_TOKEN")
echo $MEMBER_ACCESS | jq '.'
echo ""

# Test User Stats (Admin Only)
echo "5. Testing Admin Access to User Stats..."
STATS=$(curl -s -X GET $BASE_URL/api/users/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo $STATS | jq '.'
echo ""

# Test No Token (Should Fail)
echo "6. Testing Access Without Token (Should Fail)..."
NO_TOKEN=$(curl -s -X GET $BASE_URL/api/users)
echo $NO_TOKEN | jq '.'
echo ""

echo "==================================="
echo "RBAC Tests Complete"
echo "==================================="
```

Run with:
```bash
chmod +x test-rbac.sh
./test-rbac.sh
```

---

## API Endpoints Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | Get all users |
| GET | `/api/users/stats` | Admin | Get user statistics |
| GET | `/api/users/:id` | Admin | Get single user |
| PUT | `/api/users/:id/role` | Admin | Update user role |
| DELETE | `/api/users/:id` | Admin | Delete user |

---

## How RBAC Works

### 1. Middleware Chain

```
Request → protect → adminOnly → Controller
```

### 2. Protect Middleware
- Verifies JWT token
- Attaches user info to request
- Returns 401 if token invalid

### 3. AdminOnly Middleware
- Checks if user role is 'admin'
- Returns 403 if not admin
- Allows request to continue if admin

### 4. Route Protection

```typescript
// All routes require authentication AND admin role
router.use(protect);
router.use(adminOnly);

router.get('/', getAllUsers);
```

---

## Expected Behavior

✅ **Admin users can:**
- View all users
- Get user statistics
- View individual user details
- Update user roles
- Delete users (except themselves)

❌ **Member users cannot:**
- Access any admin routes
- View user lists
- Modify user data
- Delete users

❌ **Unauthenticated users cannot:**
- Access any protected routes
- Must provide valid JWT token

---

## Security Features

1. **Token Verification** - All requests verified
2. **Role Checking** - Admin privileges enforced
3. **Self-Protection** - Admins cannot delete themselves
4. **Consistent Errors** - Clear error messages
5. **Status Codes** - Proper HTTP status codes (401, 403)

# Authentication API Testing Guide

## Available Endpoints

### 1. Register User
**POST** `/api/auth/register`

### 2. Login User
**POST** `/api/auth/login`

### 3. Get Current User
**GET** `/api/auth/me` (Protected)

---

## Testing with cURL

### 1. Register a New Admin User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Register a Member User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "member"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. Get Current User (Protected Route)

**Important:** Replace `YOUR_TOKEN_HERE` with the actual token from login/register response.

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2026-05-15T..."
  }
}
```

---

## Testing with Postman

### Setup

1. Create a new collection called "Team Task Manager"
2. Add environment variables:
   - `base_url`: `http://localhost:5000`
   - `token`: (will be set automatically)

### 1. Register User

- **Method:** POST
- **URL:** `{{base_url}}/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

**Tests Tab (Auto-save token):**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
}
```

### 2. Login

- **Method:** POST
- **URL:** `{{base_url}}/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Tests Tab (Auto-save token):**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
}
```

### 3. Get Current User

- **Method:** GET
- **URL:** `{{base_url}}/api/auth/me`
- **Headers:** 
  - `Authorization: Bearer {{token}}`

---

## Error Cases to Test

### 1. Register with Existing Email
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another User",
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Expected:** 400 - "User already exists with this email"

### 2. Login with Wrong Password
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "wrongpassword"
  }'
```

**Expected:** 401 - "Invalid credentials"

### 3. Access Protected Route Without Token
```bash
curl -X GET http://localhost:5000/api/auth/me
```

**Expected:** 401 - "Not authorized to access this route"

### 4. Access Protected Route With Invalid Token
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected:** 401 - "Not authorized to access this route"

---

## Quick Test Script

Save this as `test-auth.sh` and run with `bash test-auth.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "=== Testing Authentication APIs ==="
echo ""

echo "1. Registering Admin User..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "admin"
  }')
echo $REGISTER_RESPONSE | jq '.'
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')
echo ""

echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }')
echo $LOGIN_RESPONSE | jq '.'
echo ""

echo "3. Getting current user..."
curl -s -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo "=== Tests Complete ==="
```

**Note:** Requires `jq` for JSON formatting. Install with `brew install jq` (macOS) or `apt-get install jq` (Linux).

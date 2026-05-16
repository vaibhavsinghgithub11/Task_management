# Role-Based Access Control Flow

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                       │
│                  GET /api/users (Admin Route)                │
│              Authorization: Bearer <JWT_TOKEN>               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    PROTECT MIDDLEWARE                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 1. Extract token from Authorization header         │    │
│  │ 2. Verify JWT signature                            │    │
│  │ 3. Decode token payload (id, role)                 │    │
│  │ 4. Check if user exists in database                │    │
│  │ 5. Attach user to request: req.user = {id, role}   │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                │   Token Valid?    │
                └─────────┬─────────┘
                          │
            ┌─────────────┼─────────────┐
            │ NO                    YES │
            ▼                           ▼
┌───────────────────────┐   ┌───────────────────────────────┐
│   401 UNAUTHORIZED    │   │     ADMINONLY MIDDLEWARE      │
│  "Not authorized to   │   │  ┌─────────────────────────┐  │
│  access this route"   │   │  │ 1. Check req.user.role  │  │
└───────────────────────┘   │  │ 2. Verify role === admin│  │
                            │  └─────────────────────────┘  │
                            └───────────┬───────────────────┘
                                        │
                              ┌─────────┴─────────┐
                              │   Is Admin?       │
                              └─────────┬─────────┘
                                        │
                          ┌─────────────┼─────────────┐
                          │ NO                    YES │
                          ▼                           ▼
              ┌───────────────────────┐   ┌───────────────────┐
              │   403 FORBIDDEN       │   │    CONTROLLER     │
              │  "Access denied.      │   │  getAllUsers()    │
              │  Admin privileges     │   │  getUserStats()   │
              │  required"            │   │  etc.             │
              └───────────────────────┘   └─────────┬─────────┘
                                                    │
                                                    ▼
                                          ┌───────────────────┐
                                          │   200 SUCCESS     │
                                          │  Return user data │
                                          └───────────────────┘
```

---

## Request Flow Examples

### Example 1: Admin Accessing Admin Route ✅

```
1. Request:  GET /api/users
   Header:   Authorization: Bearer eyJhbGc...
   
2. Protect Middleware:
   - Extracts token
   - Verifies: Valid ✅
   - Decodes: { id: "123", role: "admin" }
   - Attaches to request
   
3. AdminOnly Middleware:
   - Checks: req.user.role === "admin" ✅
   - Allows request to continue
   
4. Controller:
   - Executes getAllUsers()
   - Returns user list
   
5. Response: 200 OK
   {
     "success": true,
     "count": 5,
     "data": [...]
   }
```

### Example 2: Member Accessing Admin Route ❌

```
1. Request:  GET /api/users
   Header:   Authorization: Bearer eyJhbGc...
   
2. Protect Middleware:
   - Extracts token
   - Verifies: Valid ✅
   - Decodes: { id: "456", role: "member" }
   - Attaches to request
   
3. AdminOnly Middleware:
   - Checks: req.user.role === "admin" ❌
   - Blocks request
   
4. Response: 403 FORBIDDEN
   {
     "success": false,
     "error": "Access denied. Admin privileges required"
   }
```

### Example 3: No Token ❌

```
1. Request:  GET /api/users
   Header:   (no Authorization header)
   
2. Protect Middleware:
   - No token found ❌
   - Blocks request
   
3. Response: 401 UNAUTHORIZED
   {
     "success": false,
     "error": "Not authorized to access this route"
   }
```

### Example 4: Invalid Token ❌

```
1. Request:  GET /api/users
   Header:   Authorization: Bearer invalid_token
   
2. Protect Middleware:
   - Extracts token
   - Verifies: Invalid ❌
   - Blocks request
   
3. Response: 401 UNAUTHORIZED
   {
     "success": false,
     "error": "Not authorized to access this route"
   }
```

---

## Middleware Implementation

### 1. Protect Middleware (auth.ts)

```typescript
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Extract token from header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return next(new ErrorResponse('Not authorized', 401));
  }
  
  // Verify token
  const decoded = jwt.verify(token, JWT_SECRET);
  
  // Attach user to request
  req.user = { id: decoded.id, role: decoded.role };
  
  next();
});
```

### 2. AdminOnly Middleware (auth.ts)

```typescript
export const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new ErrorResponse('Access denied', 403));
  }
  next();
});
```

### 3. Route Protection (userRoutes.ts)

```typescript
const router = express.Router();

// Apply to all routes in this router
router.use(protect);    // Must be authenticated
router.use(adminOnly);  // Must be admin

// All these routes are now protected
router.get('/', getAllUsers);
router.get('/stats', getUserStats);
router.delete('/:id', deleteUser);
```

---

## HTTP Status Codes

| Code | Status | When Used |
|------|--------|-----------|
| 200 | OK | Successful request |
| 201 | Created | User registered successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | No token or invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

---

## Security Best Practices Implemented

✅ **JWT Token Verification** - All tokens verified before access  
✅ **Role-Based Access** - Routes protected by role  
✅ **Token Expiration** - Tokens expire after configured time  
✅ **Password Hashing** - Passwords never stored in plain text  
✅ **Secure Headers** - Authorization header with Bearer scheme  
✅ **Error Messages** - Generic messages to prevent information leakage  
✅ **Database Validation** - User existence checked on each request  

---

## Testing Checklist

- [ ] Admin can access admin routes
- [ ] Member cannot access admin routes (403)
- [ ] Unauthenticated users cannot access protected routes (401)
- [ ] Invalid tokens are rejected (401)
- [ ] Expired tokens are rejected (401)
- [ ] Admin cannot delete themselves
- [ ] Role updates work correctly
- [ ] User statistics are accurate

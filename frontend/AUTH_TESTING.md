# Authentication Testing Guide

## Overview

Complete authentication system with Login, Register, Protected Routes, and automatic redirects.

---

## 🚀 How to Test

### 1. Start Backend
```bash
cd backend
npm run dev
```

Backend should be running on: `http://localhost:5000`

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

Frontend should be running on: `http://localhost:5173`

### 3. Open Browser
Navigate to: `http://localhost:5173`

---

## 📋 Test Scenarios

### Scenario 1: Register New User

1. **Navigate to Register Page**
   - URL: `http://localhost:5173/register`
   - Or click "Register here" from login page

2. **Fill in the form:**
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `test123`
   - Confirm Password: `test123`
   - Role: `Member` or `Admin`

3. **Click "Create Account"**

4. **Expected Result:**
   - ✅ Loading spinner appears
   - ✅ Redirected to `/dashboard`
   - ✅ Welcome message with user name
   - ✅ User info displayed
   - ✅ Token saved in localStorage

### Scenario 2: Login with Existing User

1. **Navigate to Login Page**
   - URL: `http://localhost:5173/login`

2. **Use demo credentials:**
   - **Admin:** admin@test.com / admin123
   - **Member:** member@test.com / member123

3. **Click "Sign In"**

4. **Expected Result:**
   - ✅ Loading spinner appears
   - ✅ Redirected to `/dashboard`
   - ✅ Welcome message displayed
   - ✅ Correct role badge shown

### Scenario 3: Logout

1. **From Dashboard, click "Logout" button**

2. **Expected Result:**
   - ✅ Redirected to `/login`
   - ✅ Token removed from localStorage
   - ✅ User state cleared

### Scenario 4: Protected Route Access

1. **Logout if logged in**

2. **Try to access:** `http://localhost:5173/dashboard`

3. **Expected Result:**
   - ✅ Automatically redirected to `/login`
   - ✅ Cannot access dashboard without authentication

### Scenario 5: Persistent Login

1. **Login with any user**

2. **Refresh the page (F5)**

3. **Expected Result:**
   - ✅ Still logged in
   - ✅ Dashboard still accessible
   - ✅ User info persists

4. **Close browser and reopen**

5. **Navigate to:** `http://localhost:5173`

6. **Expected Result:**
   - ✅ Still logged in
   - ✅ Redirected to dashboard

### Scenario 6: Validation Errors

#### Register Page Validation

1. **Try to register with empty fields**
   - Expected: "Please fill in all fields"

2. **Try password less than 6 characters**
   - Password: `12345`
   - Expected: "Password must be at least 6 characters"

3. **Try mismatched passwords**
   - Password: `password123`
   - Confirm: `password456`
   - Expected: "Passwords do not match"

4. **Try existing email**
   - Email: `admin@test.com`
   - Expected: "User already exists with this email"

#### Login Page Validation

1. **Try to login with empty fields**
   - Expected: "Please fill in all fields"

2. **Try wrong password**
   - Email: `admin@test.com`
   - Password: `wrongpassword`
   - Expected: "Invalid credentials"

3. **Try non-existent email**
   - Email: `nonexistent@test.com`
   - Password: `password123`
   - Expected: "Invalid credentials"

### Scenario 7: Navigation Flow

1. **Start at root:** `http://localhost:5173/`
   - If not logged in → Redirects to `/login`
   - If logged in → Redirects to `/dashboard`

2. **Try to access `/login` when logged in**
   - Expected: Redirects to `/dashboard`

3. **Try to access `/register` when logged in**
   - Expected: Redirects to `/dashboard`

4. **Try to access non-existent route:** `/random-page`
   - Expected: 404 page with "Go Home" button

---

## 🔍 What to Check

### Visual Elements

#### Login Page
- ✅ Clean, centered layout
- ✅ Gradient background
- ✅ Logo and title
- ✅ Email and password fields
- ✅ "Sign In" button
- ✅ "Register here" link
- ✅ Demo credentials box
- ✅ Footer

#### Register Page
- ✅ Similar layout to login
- ✅ Name field
- ✅ Email field
- ✅ Password field
- ✅ Confirm password field
- ✅ Role dropdown
- ✅ "Create Account" button
- ✅ "Sign in here" link
- ✅ Helper text for password and role

#### Dashboard Page
- ✅ Welcome message with user name
- ✅ Role badge (blue for admin, green for member)
- ✅ Logout button
- ✅ User account details
- ✅ Success message

### Functionality

- ✅ Form validation works
- ✅ Error messages display correctly
- ✅ Loading states show during API calls
- ✅ Successful login redirects to dashboard
- ✅ Successful register redirects to dashboard
- ✅ Logout clears state and redirects
- ✅ Protected routes require authentication
- ✅ Persistent login across page refreshes
- ✅ Error messages can be dismissed

### Browser Console

Check for:
- ✅ No console errors
- ✅ API calls to `http://localhost:5000/api`
- ✅ Token in localStorage after login
- ✅ User object in localStorage

### Network Tab

Check for:
- ✅ POST `/api/auth/register` - 201 Created
- ✅ POST `/api/auth/login` - 200 OK
- ✅ Authorization header with Bearer token on protected requests

---

## 🐛 Common Issues & Solutions

### Issue 1: "Network Error" or "Failed to fetch"

**Cause:** Backend not running

**Solution:**
```bash
cd backend
npm run dev
```

### Issue 2: "CORS Error"

**Cause:** Backend CORS not configured for frontend URL

**Solution:** Check `backend/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

### Issue 3: "Invalid credentials" on correct password

**Cause:** User doesn't exist in database

**Solution:** Register a new user first, or check MongoDB connection

### Issue 4: Redirects to login after refresh

**Cause:** Token expired or localStorage cleared

**Solution:** Login again. Check JWT_EXPIRE in backend `.env`

### Issue 5: Styles not loading

**Cause:** TailwindCSS not compiled

**Solution:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📱 Responsive Testing

Test on different screen sizes:

1. **Desktop (1920x1080)**
   - ✅ Centered login/register forms
   - ✅ Proper spacing

2. **Tablet (768x1024)**
   - ✅ Forms still centered
   - ✅ Readable text

3. **Mobile (375x667)**
   - ✅ Forms fit screen
   - ✅ No horizontal scroll
   - ✅ Touch-friendly buttons

---

## 🔐 Security Checks

- ✅ Passwords are hidden (type="password")
- ✅ Passwords not visible in network requests (hashed on backend)
- ✅ JWT token stored securely in localStorage
- ✅ Token sent in Authorization header
- ✅ Protected routes check authentication
- ✅ 401 errors automatically logout user

---

## 📊 Test Checklist

### Registration
- [ ] Can register with valid data
- [ ] Cannot register with empty fields
- [ ] Cannot register with short password
- [ ] Cannot register with mismatched passwords
- [ ] Cannot register with existing email
- [ ] Can choose admin or member role
- [ ] Redirects to dashboard after registration
- [ ] Token saved in localStorage

### Login
- [ ] Can login with valid credentials
- [ ] Cannot login with empty fields
- [ ] Cannot login with wrong password
- [ ] Cannot login with non-existent email
- [ ] Redirects to dashboard after login
- [ ] Token saved in localStorage
- [ ] Demo credentials work

### Logout
- [ ] Logout button works
- [ ] Redirects to login page
- [ ] Token removed from localStorage
- [ ] User state cleared

### Protected Routes
- [ ] Cannot access dashboard without login
- [ ] Redirects to login when not authenticated
- [ ] Can access dashboard when authenticated
- [ ] Login persists across page refresh

### Navigation
- [ ] Root redirects correctly based on auth state
- [ ] Cannot access login when logged in
- [ ] Cannot access register when logged in
- [ ] 404 page shows for invalid routes

### UI/UX
- [ ] Loading spinners show during API calls
- [ ] Error messages display correctly
- [ ] Error messages can be dismissed
- [ ] Forms are responsive
- [ ] Buttons are disabled during loading
- [ ] Visual feedback on form submission

---

## 🎯 Expected User Flow

```
1. User visits site
   ↓
2. Redirected to /login (if not authenticated)
   ↓
3. User clicks "Register here"
   ↓
4. Fills registration form
   ↓
5. Submits form
   ↓
6. API call to backend
   ↓
7. Token received and saved
   ↓
8. Redirected to /dashboard
   ↓
9. Welcome message displayed
   ↓
10. User can logout
    ↓
11. Redirected to /login
```

---

## 🔧 Developer Tools

### Check localStorage
```javascript
// In browser console
localStorage.getItem('token')
localStorage.getItem('user')
```

### Clear localStorage
```javascript
localStorage.clear()
```

### Check Auth State
```javascript
// In React DevTools
// Find AuthProvider component
// Check state: user, token, loading
```

---

## ✅ Success Criteria

Authentication is working correctly if:

1. ✅ Users can register new accounts
2. ✅ Users can login with credentials
3. ✅ Users can logout
4. ✅ Protected routes require authentication
5. ✅ Login persists across page refreshes
6. ✅ Form validation works correctly
7. ✅ Error messages display properly
8. ✅ Loading states show during API calls
9. ✅ Redirects work as expected
10. ✅ No console errors

---

## 📝 Notes

- **Demo Credentials:** Create these users in backend first
- **Token Expiry:** Default is 7 days (configurable in backend)
- **Role-Based Access:** Will be used in later steps for admin-only features
- **Persistent Login:** Uses localStorage (consider httpOnly cookies for production)

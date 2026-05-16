# 🔧 Fix Vite Cache Issue

## Problem
```
TaskStatusBadge.tsx:2 Uncaught SyntaxError: The requested module '/src/types/index.ts' 
does not provide an export named 'TaskPriority'
```

## Solution

This is a Vite dev server caching issue. Follow these steps:

### Option 1: Restart Dev Server (Quick Fix)

```bash
# Stop the frontend dev server (Ctrl+C)
# Then restart it
cd frontend
npm run dev
```

### Option 2: Clear Vite Cache (Recommended)

```bash
# Stop the frontend dev server (Ctrl+C)

# Clear Vite cache
cd frontend
rm -rf node_modules/.vite
rm -rf dist

# Restart dev server
npm run dev
```

### Option 3: Hard Refresh Browser

After restarting the dev server:
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

Or use keyboard shortcut:
- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`

### Option 4: Full Clean (If above don't work)

```bash
# Stop the frontend dev server (Ctrl+C)

cd frontend

# Remove all caches and dependencies
rm -rf node_modules
rm -rf node_modules/.vite
rm -rf dist
rm -rf .vite

# Reinstall dependencies
npm install

# Restart dev server
npm run dev
```

## Why This Happens

Vite's Hot Module Replacement (HMR) sometimes caches old module exports. When you add new exports to a file, the cache might not update properly.

## Prevention

To avoid this in the future:
1. Restart dev server after major type changes
2. Clear browser cache regularly during development
3. Use `npm run dev -- --force` to force rebuild

## Verify Fix

After applying the fix:
1. Open http://localhost:5173
2. Open browser console (F12)
3. Check for no errors
4. Navigate to /tasks page
5. Verify tasks display correctly with badges

## Still Not Working?

If the issue persists:

1. **Check the import path**
   ```typescript
   // In TaskStatusBadge.tsx
   import { TaskStatus, TaskPriority } from '../../types';
   ```

2. **Verify types are exported**
   ```typescript
   // In src/types/index.ts
   export type TaskStatus = 'Todo' | 'In Progress' | 'Completed' | 'Overdue';
   export type TaskPriority = 'Low' | 'Medium' | 'High';
   ```

3. **Check for TypeScript errors**
   ```bash
   cd frontend
   npx tsc --noEmit
   ```

4. **Restart your IDE/Editor**
   - Close and reopen VS Code or your editor
   - This refreshes the TypeScript language server

## Quick Command

Run this single command to fix everything:

```bash
cd frontend && rm -rf node_modules/.vite dist && npm run dev
```

---

**This should resolve the issue! 🎉**

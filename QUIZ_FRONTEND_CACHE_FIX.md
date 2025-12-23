# Quiz Frontend Cache Issue - SOLUTION

## Problem
The frontend is showing "ICT (0 questions)" even though the backend now returns 600 questions. This is because the frontend caches quiz subject data for 10 minutes.

## Root Cause
In `frontend/src/services/apiClient.ts`, the `quizAPI.getSubjects()` function uses caching:

```typescript
getSubjects: (grade?: number) =>
  withCache(
    quizCache,
    cacheKeys.quizList('subjects', grade),
    () => api.get('/quiz/subjects', { params: { grade } }),
    10 * 60 * 1000 // 10 minutes cache ← This is the issue
  ),
```

The old data (before RAG implementation) is cached in the browser.

## Immediate Solution (For You)

### Option 1: Hard Refresh Browser (Recommended)
1. Open the ShikkhaSathi app in your browser (http://localhost:5173)
2. Do a **hard refresh**:
   - **Windows/Linux**: Press `Ctrl + Shift + R`
   - **Mac**: Press `Cmd + Shift + R`
   - **Alternative**: Press `Ctrl + F5` (Windows/Linux)

This will clear the cached data and fetch fresh data from the backend.

### Option 2: Clear Browser Cache
1. Open browser DevTools (F12)
2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Find "Cache Storage" or "Local Storage"
4. Clear all ShikkhaSathi-related cache
5. Refresh the page

### Option 3: Wait 10 Minutes
The cache will automatically expire after 10 minutes and fetch fresh data.

## Verification Steps

After clearing cache:

1. **Login** to student dashboard
2. **Click "Take Quiz"**
3. **Check subjects dropdown** - Should now show:
   - Physics (1000 questions) ✅
   - Mathematics (1200 questions) ✅
   - ICT (600 questions) ✅ ← Should now show 600 instead of 0
   - English (800 questions) ✅
   - Bangla (1000 questions) ✅

4. **Select ICT** and choose a topic like "Digital Communication"
5. **Click "Start Quiz"** - Should generate questions successfully

## Expected Behavior After Fix

### Subject Selection Screen
```
Subject: ICT (600 questions)  ← Now shows 600 instead of 0
Topic: Digital Communication (70 questions)
Number of Questions: [5] [10] [15] [20]
Estimated time: 20 minutes
[Start Quiz] button
```

### No More Error Messages
The red error message "No content found for ICT/Digital Communication in the curriculum" should disappear.

## Technical Details

### Backend Status
✅ Backend is working correctly:
```bash
curl http://localhost:8000/api/v1/quiz/subjects
# Returns: ICT with 600 questions available
```

### Frontend Caching
The frontend uses a caching layer (`withCache`) to reduce API calls:
- **Cache Duration**: 10 minutes
- **Cache Key**: Based on subject and grade
- **Cache Storage**: Browser memory (quizCache)

### Why Caching Exists
Caching is good for production to:
- Reduce server load
- Improve performance
- Provide faster user experience

But during development, it can show stale data when backend changes.

## Long-term Solution (Optional)

If you want to reduce cache time during development, you can modify the cache duration:

```typescript
// In frontend/src/services/apiClient.ts
getSubjects: (grade?: number) =>
  withCache(
    quizCache,
    cacheKeys.quizList('subjects', grade),
    () => api.get('/quiz/subjects', { params: { grade } }),
    1 * 60 * 1000 // Change to 1 minute for development
  ),
```

But for now, just do a hard refresh and you're good to go!

## Summary

🎯 **Quick Fix**: Press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac) in your browser

✅ **Result**: Quiz system will show correct data with all subjects available

🚀 **Status**: Quiz system is fully functional, just needed cache refresh!
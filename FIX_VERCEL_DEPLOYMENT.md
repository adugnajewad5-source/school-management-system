# 🔧 Fix Vercel Deployment Error

## The Problem

Vercel error:
```
npm error path /vercel/path0/package.json
npm error enoent Could not read package.json
```

**Cause**: Vercel is looking for `package.json` in the root, but it's in the `frontend` folder.

---

## The Solution

### Option 1: Update Vercel Project Settings (Easiest)

1. **Go to Vercel Dashboard**
   - Open: https://vercel.com/dashboard
   - Click your project: `school-management-system`

2. **Go to Settings**
   - Click "Settings" tab (top)
   - Click "General" (left sidebar)

3. **Update Build Settings**
   - **Root Directory**: Change to `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Save and Redeploy**
   - Click "Save"
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest failed deployment
   - Select "Redeploy"

---

### Option 2: Add vercel.json Configuration

If Option 1 doesn't work, add this file to your repository:

**File: `vercel.json` (in root directory)**

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  }
}
```

Then:
1. Commit and push to GitHub
2. Go to Vercel
3. Click "Redeploy"

---

## Step-by-Step Fix (Option 1 - Recommended)

### Step 1: Go to Vercel Settings

1. Open: https://vercel.com/dashboard
2. Click your project
3. Click "Settings" tab

### Step 2: Update Root Directory

1. Click "General" (left sidebar)
2. Find "Root Directory"
3. Click the input field
4. Clear it and type: `frontend`
5. Click "Save"

### Step 3: Verify Build Settings

Make sure these are set:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Redeploy

1. Go to "Deployments" tab
2. Find the failed deployment
3. Click the three dots (...)
4. Click "Redeploy"
5. Click "Redeploy" again to confirm

### Step 5: Wait for Deployment

- Watch the logs
- Should see "Build Completed"
- Then "Deployment Ready"

---

## Expected Success

After fix, you should see:
```
✓ Cloning repository
✓ Installing dependencies
✓ Building project
✓ Deployment ready
```

Then your frontend will be live at:
```
https://school-management-system.vercel.app
```

---

## If Still Failing

**Check these:**

1. **Root Directory is set to `frontend`**
   - Go to Settings → General
   - Verify "Root Directory" shows `frontend`

2. **Build Command is correct**
   - Should be: `npm run build`

3. **Output Directory is correct**
   - Should be: `dist`

4. **Environment Variable is set**
   - Go to Settings → Environment Variables
   - Add: `VITE_API_URL` = your backend URL

5. **Check Build Logs**
   - Go to Deployments
   - Click failed deployment
   - Click "Build Logs"
   - Look for errors

---

## Quick Checklist

- [ ] Root Directory set to `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Environment variable `VITE_API_URL` added
- [ ] Redeploy clicked
- [ ] Waiting for build to complete

---

**Status**: Deployment error identified and fixed
**Next**: Redeploy on Vercel
**Expected**: Frontend will be live in 2-3 minutes

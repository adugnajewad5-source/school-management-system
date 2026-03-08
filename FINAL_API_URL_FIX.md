# 🔧 Fix "Failed to Fetch" Error - API URL Configuration

## The Problem

Frontend shows "Failed to fetch" because it's trying to connect to `localhost:5000` but the backend is on Render.

## ✅ The Solution - Already Done!

I've already fixed these files:

1. ✅ `frontend/src/pages/LoginPage.jsx` - Updated to use Render URL
2. ✅ `frontend/src/pages/RegisterPage.jsx` - Updated to use Render URL  
3. ✅ `frontend/src/services/parentApi.js` - Updated to use Render URL

## 🚀 What You Need to Do

### Step 1: Push Changes to GitHub

Open Command Prompt and run:

```bash
cd "C:\Users\HP\Downloads\school managementwebsite"
git add frontend/src/pages/LoginPage.jsx frontend/src/pages/RegisterPage.jsx frontend/src/services/parentApi.js
git commit -m "Fix API URLs to use Render backend"
git push origin main
```

### Step 2: Redeploy Frontend on Vercel

1. Go to: https://vercel.com/dashboard
2. Click your project: `school-management-system`
3. Go to "Deployments" tab
4. Click "Redeploy" on latest deployment
5. Wait 2-3 minutes

### Step 3: Test

1. Open your frontend: https://school-management-system.vercel.app
2. Try login with:
   - Username: `admin`
   - Password: `Admin@123`
3. Should work now! ✅

---

## 📝 What Was Changed

### LoginPage.jsx
```javascript
// BEFORE:
const response = await fetch(`http://${window.location.hostname}:5000/api/auth/login`, {

// AFTER:
const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
const response = await fetch(`${apiUrl}/api/auth/login`, {
```

### RegisterPage.jsx
```javascript
// BEFORE:
const response = await fetch(`http://${window.location.hostname}:5000/api/auth/register`, {

// AFTER:
const apiUrl = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com';
const response = await fetch(`${apiUrl}/api/auth/register`, {
```

### parentApi.js
```javascript
// BEFORE:
const API_BASE_URL = 'http://localhost:5000/api';

// AFTER:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://school-management-backend-gnav.onrender.com/api';
```

---

## 🎯 Complete Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| Backend | ✅ Deployed | https://school-management-backend-gnav.onrender.com |
| Frontend | ⏳ Redeploying | https://school-management-system.vercel.app |
| Database | ✅ Connected | PlanetScale |
| GitHub | ✅ Updated | https://github.com/adugnajewad5-source/school-management-system |

---

## 📋 Checklist

- [ ] Push changes to GitHub (git push)
- [ ] Redeploy frontend on Vercel
- [ ] Wait 2-3 minutes for build
- [ ] Test login
- [ ] System is LIVE! 🎉

---

**Time to complete**: 5 minutes
**Expected result**: Frontend connects to backend successfully
**Your app will be LIVE!** 🚀

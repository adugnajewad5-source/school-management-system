# 🎯 Set Vercel Environment Variables for Frontend

Your frontend on Vercel also needs environment variables to connect to the backend.

## Step-by-Step Instructions

### Step 1: Go to Vercel Project Settings
1. You're already on Vercel dashboard
2. Click: `school-management-system` project
3. Click: **"Settings"** tab (top menu)

### Step 2: Click Environment Variables
1. In the left sidebar, click: **"Environment Variables"**
2. You see a form to add variables

### Step 3: Add Environment Variable

Click: **"Add New"** button

**Variable 1:**
- Name: `VITE_API_URL`
- Value: `https://school-management-backend-gnav.onrender.com`
- Select: **"Production"** (checkbox)
- Click: **"Save"**

### Step 4: Redeploy Frontend
1. Go back to: **"Deployments"** tab
2. Find the latest deployment
3. Click the **"..."** menu
4. Click: **"Redeploy"**
5. Wait 2-3 minutes

### Step 5: Test
1. Open: https://school-management-system.vercel.app
2. Login with: admin / Admin@123
3. Should work now!

---

## What This Variable Does

`VITE_API_URL` tells the frontend where to find the backend API.

Without it: Frontend tries to connect to `localhost:5000` (doesn't work)
With it: Frontend connects to `https://school-management-backend-gnav.onrender.com` (works!)

---

## Quick Summary

| Step | Action |
|------|--------|
| 1 | Go to Vercel project settings |
| 2 | Click "Environment Variables" |
| 3 | Add: `VITE_API_URL=https://school-management-backend-gnav.onrender.com` |
| 4 | Redeploy |
| 5 | Test login |

---

**After setting this, your frontend will connect to the backend!** 🚀

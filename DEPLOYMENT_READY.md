# 🚀 Deployment Guide - Render & Vercel

## Prerequisites
✅ GitHub repository pushed (complete COMPLETE_GITHUB_PUSH.md first)
✅ Cloudinary account created
✅ MySQL database ready

---

## Part 1: Deploy Backend on Render (10 Minutes)

### Step 1: Create Render Account
1. Go to: https://render.com
2. Click "Get Started"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 2: Create Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your repository: `school-management-system`
4. Click "Connect"

### Step 3: Configure Service
Fill in these settings:

**Basic Settings:**
- Name: `school-management-backend`
- Region: Choose closest to you
- Branch: `main`
- Root Directory: `backend`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `node index.js`

**Instance Type:**
- Select: `Free` (for testing) or `Starter` (for production)

### Step 4: Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add these variables:

```
DB_HOST=your-mysql-host
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_NAME=school_management
DB_PORT=3306

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

PORT=10000
NODE_ENV=production
```

**Important:**
- Replace all `your-*` values with actual credentials
- JWT_SECRET: Use a long random string (at least 32 characters)
- Get Cloudinary credentials from: https://cloudinary.com/console

### Step 5: Create MySQL Database on Render

1. Click "New +" → "PostgreSQL" or use external MySQL
2. For MySQL, use external service like:
   - **PlanetScale** (recommended, free tier): https://planetscale.com
   - **Railway**: https://railway.app
   - **Aiven**: https://aiven.io

**Using PlanetScale (Recommended):**
1. Go to: https://planetscale.com
2. Sign up with GitHub
3. Create new database: `school-management`
4. Click "Connect" → "Node.js"
5. Copy connection details
6. Update Render environment variables with these details

### Step 6: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend will be live at: `https://school-management-backend.onrender.com`

### Step 7: Initialize Database
1. Connect to your MySQL database
2. Run the schema:
   ```bash
   mysql -h your-host -u your-user -p your-database < database/schema.sql
   ```
3. Or use a MySQL client (MySQL Workbench, DBeaver, etc.)

---

## Part 2: Deploy Frontend on Vercel (5 Minutes)

### Step 1: Create Vercel Account
1. Go to: https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click "Add New" → "Project"
2. Find your repository: `school-management-system`
3. Click "Import"

### Step 3: Configure Project
Fill in these settings:

**Project Settings:**
- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Step 4: Add Environment Variables
Click "Environment Variables" and add:

```
VITE_API_URL=https://school-management-backend.onrender.com
```

**Important:** Replace with your actual Render backend URL

### Step 5: Deploy
1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Your frontend will be live at: `https://school-management-system.vercel.app`

### Step 6: Update Backend CORS
1. Go back to Render dashboard
2. Open your backend service
3. Add environment variable:
   ```
   FRONTEND_URL=https://school-management-system.vercel.app
   ```
4. Update `backend/index.js` CORS configuration (if needed)
5. Redeploy backend

---

## Part 3: Update Frontend API URL

### Option 1: Environment Variable (Recommended)
Already done in Vercel environment variables above.

### Option 2: Update Code Directly
If you need to update the API URL in code:

1. Open `frontend/src/App.jsx`
2. Find API calls
3. Replace `http://localhost:5000` with your Render URL
4. Commit and push changes
5. Vercel will auto-deploy

---

## Part 4: Test Your Deployment

### Test Backend
1. Visit: `https://school-management-backend.onrender.com/health`
2. Should return: `{"status":"ok"}`

### Test Frontend
1. Visit: `https://school-management-system.vercel.app`
2. Try logging in with admin credentials
3. Test all features:
   - Student portal
   - Teacher portal
   - Admin dashboard
   - Parent portal
   - File uploads
   - Notifications

### Test Database Connection
1. Try registering a new student
2. Try adding marks
3. Check if data persists

---

## Part 5: Custom Domain (Optional)

### For Vercel (Frontend)
1. Go to Vercel dashboard
2. Select your project
3. Click "Settings" → "Domains"
4. Add your domain: `www.yourschool.com`
5. Follow DNS configuration instructions

### For Render (Backend)
1. Go to Render dashboard
2. Select your service
3. Click "Settings" → "Custom Domain"
4. Add your domain: `api.yourschool.com`
5. Follow DNS configuration instructions

---

## Troubleshooting

### Backend Issues

**Error: Cannot connect to database**
- Check DB_HOST, DB_USER, DB_PASSWORD in Render environment variables
- Verify database is accessible from Render's IP
- Check database firewall settings

**Error: Module not found**
- Check Build Command is: `npm install`
- Verify package.json is in backend folder
- Check Node version compatibility

**Error: Port already in use**
- Render automatically assigns PORT
- Make sure your code uses: `process.env.PORT || 5000`

### Frontend Issues

**Error: API calls failing**
- Check VITE_API_URL is correct
- Verify backend is running
- Check CORS configuration in backend

**Error: Build failed**
- Check Build Command is: `npm run build`
- Verify all dependencies are in package.json
- Check for TypeScript errors

**Error: Page not found**
- Check Output Directory is: `dist`
- Verify vite.config.js is correct

### Database Issues

**Error: Table doesn't exist**
- Run database schema: `database/schema.sql`
- Check database name matches DB_NAME

**Error: Connection timeout**
- Check database host is accessible
- Verify firewall allows connections
- Check database credentials

---

## Monitoring & Maintenance

### Render Monitoring
- View logs: Render Dashboard → Your Service → Logs
- Check metrics: CPU, Memory, Response time
- Set up alerts for downtime

### Vercel Monitoring
- View deployments: Vercel Dashboard → Your Project → Deployments
- Check analytics: Traffic, Performance
- Monitor build times

### Database Monitoring
- Regular backups (daily recommended)
- Monitor storage usage
- Check query performance

---

## Cost Estimate

### Free Tier (Testing)
- Render: Free (with limitations)
- Vercel: Free (hobby plan)
- PlanetScale: Free (1 database)
- Cloudinary: Free (25 credits/month)
- **Total: $0/month**

### Production (Recommended)
- Render: $7/month (Starter plan)
- Vercel: Free (hobby) or $20/month (Pro)
- PlanetScale: $29/month (Scaler plan)
- Cloudinary: $0-$99/month (based on usage)
- **Total: ~$36-155/month**

---

## Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS (automatic on Render & Vercel)
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Add input validation
- [ ] Sanitize user inputs
- [ ] Use environment variables for secrets
- [ ] Enable database SSL connection
- [ ] Set up monitoring and alerts
- [ ] Review and test all API endpoints

---

## Next Steps

1. ✅ Push to GitHub (COMPLETE_GITHUB_PUSH.md)
2. ✅ Deploy backend on Render (this guide)
3. ✅ Deploy frontend on Vercel (this guide)
4. ✅ Test everything
5. ✅ Add custom domain (optional)
6. ✅ Set up monitoring
7. ✅ Configure backups
8. ✅ Go live! 🚀

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **PlanetScale Docs**: https://planetscale.com/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

## Your URLs After Deployment

- **Frontend**: https://school-management-system.vercel.app
- **Backend**: https://school-management-backend.onrender.com
- **GitHub**: https://github.com/adugnajewad5-source/school-management-system

---

## Congratulations! 🎉

Your school management system is now live and accessible from anywhere!

Share the frontend URL with your users and start managing your school digitally.

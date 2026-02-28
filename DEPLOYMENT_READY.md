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
# Database Configuration (Use your production database)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=school_management
DB_PORT=3306

# JWT Secret (IMPORTANT: Generate a strong secret!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-32-plus-characters

# Cloudinary Configuration (Get from https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Server Configuration
PORT=10000
NODE_ENV=production

# Frontend URL (Update after Vercel deployment)
FRONTEND_URL=https://your-app.vercel.app
```

**Important Notes:**

**For Database:**
- **Local Development**: Use `localhost`, `root`, and empty password
- **Production**: Use cloud database credentials (see Step 5 below)
- If using PlanetScale/Railway/Aiven, replace with their connection details

**For JWT_SECRET:**
- Generate a strong random string (32+ characters)
- Example: `school_mgmt_2026_super_secret_jwt_key_production_xyz123`
- Never use the default value in production!

**For Cloudinary:**
- Sign up at: https://cloudinary.com
- Go to Dashboard → Copy credentials
- Cloud Name, API Key, and API Secret

**For FRONTEND_URL:**
- Leave as placeholder initially
- Update after deploying frontend on Vercel (Step 2)

### Step 5: Set Up Production Database

You have several options for production database:

#### Option 1: PlanetScale (Recommended - Free Tier Available)

**Why PlanetScale?**
- Free tier available
- Serverless MySQL
- No connection limits
- Automatic backups
- Easy to use

**Setup Steps:**
1. Go to: https://planetscale.com
2. Sign up with GitHub
3. Click "Create database"
4. Name: `school-management`
5. Region: Choose closest to your users
6. Click "Create database"

**Get Connection Details:**
1. Click "Connect" button
2. Select "Node.js" from dropdown
3. Copy the connection details:
   ```
   DB_HOST=aws.connect.psdb.cloud
   DB_USER=xxxxxxxxxx
   DB_PASSWORD=pscale_pw_xxxxxxxxxx
   DB_NAME=school-management
   DB_PORT=3306
   ```
4. Update these in Render environment variables

**Import Schema:**
1. Click "Console" tab in PlanetScale
2. Copy contents of `database/schema.sql`
3. Paste and execute in console
4. Or use PlanetScale CLI to import

#### Option 2: Railway (Easy Setup)

**Setup Steps:**
1. Go to: https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Provision MySQL"
4. Copy connection details from "Connect" tab
5. Update Render environment variables

**Connection Details:**
```
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=xxxxxxxxxx
DB_NAME=railway
DB_PORT=xxxx
```

#### Option 3: Aiven (Free Tier Available)

**Setup Steps:**
1. Go to: https://aiven.io
2. Sign up (free tier available)
3. Create MySQL service
4. Wait for service to start
5. Copy connection details
6. Update Render environment variables

#### Option 4: Use Your Local Database (Not Recommended for Production)

If you want to use your local MySQL database temporarily:

**Requirements:**
- Your computer must be always on
- MySQL must be accessible from internet
- Need to configure port forwarding
- Not secure or reliable for production

**Better Alternative:** Use one of the cloud options above

### Step 6: Update Render Environment Variables

After setting up your database, update these in Render:

1. Go to Render dashboard
2. Select your web service
3. Click "Environment" tab
4. Update these variables with your actual database credentials:
   ```
   DB_HOST=your-actual-database-host
   DB_USER=your-actual-database-user
   DB_PASSWORD=your-actual-database-password
   DB_NAME=school_management
   DB_PORT=3306
   ```

### Step 7: Deploy Backend
1. Click "Create Web Service" (if not already created)
2. Wait for deployment (5-10 minutes)
3. Check logs for any errors
4. Your backend will be live at: `https://school-management-backend.onrender.com`

### Step 8: Verify Backend Deployment

**Test the backend:**
1. Visit: `https://your-backend-url.onrender.com/health` (if you have a health endpoint)
2. Or test login endpoint with Postman/curl
3. Check Render logs for any errors

**Common Issues:**
- Database connection error → Check DB credentials in environment variables
- Module not found → Make sure `npm install` ran successfully
- Port error → Render automatically assigns PORT, make sure your code uses `process.env.PORT`

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


---

## 📋 Complete Environment Variables Reference

### Backend Environment Variables (Render)

Copy these to Render → Environment tab:

```bash
# Database Configuration
# For local: localhost, root, empty password
# For production: Use PlanetScale/Railway/Aiven credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=school_management
DB_PORT=3306

# JWT Secret (CRITICAL: Change in production!)
# Generate strong random string (32+ characters)
JWT_SECRET=school_mgmt_2026_super_secret_jwt_key_production_xyz123

# Cloudinary Configuration
# Get from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
PORT=10000
NODE_ENV=production

# Frontend URL (Update after Vercel deployment)
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend Environment Variables (Vercel)

Copy these to Vercel → Settings → Environment Variables:

```bash
# Backend API URL (Update with your Render URL)
VITE_API_URL=https://school-management-backend.onrender.com
```

---

## 🔐 How to Get Each Credential

### Database Credentials

**For Local Development:**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          (leave empty)
DB_NAME=school_management
DB_PORT=3306
```

**For Production (PlanetScale):**
1. Go to https://planetscale.com
2. Create database
3. Click "Connect" → "Node.js"
4. Copy credentials:
```
DB_HOST=aws.connect.psdb.cloud
DB_USER=xxxxxxxxxx
DB_PASSWORD=pscale_pw_xxxxxxxxxx
DB_NAME=school-management
DB_PORT=3306
```

### JWT Secret

**Generate a strong secret:**

Option 1: Use Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Option 2: Use online generator
- Go to: https://randomkeygen.com
- Copy a "Fort Knox Password"

Option 3: Create your own
- Use 32+ characters
- Mix letters, numbers, symbols
- Example: `SchoolMgmt2026!SecureJWT#Key$Production%xyz123`

### Cloudinary Credentials

1. Go to: https://cloudinary.com
2. Sign up (free tier available)
3. Go to Dashboard
4. Copy these values:
   - Cloud Name: `your-cloud-name`
   - API Key: `123456789012345`
   - API Secret: `your-api-secret`

### Frontend URL

1. Deploy frontend on Vercel first
2. Copy the URL: `https://your-app.vercel.app`
3. Add to Render backend environment variables

---

## ⚠️ Important Security Notes

### DO NOT:
- ❌ Use default JWT_SECRET in production
- ❌ Commit .env file to git
- ❌ Share credentials publicly
- ❌ Use weak passwords
- ❌ Use localhost database in production

### DO:
- ✅ Use strong, unique JWT_SECRET
- ✅ Use environment variables
- ✅ Use cloud database for production
- ✅ Enable SSL/TLS connections
- ✅ Regular backups
- ✅ Monitor access logs

---

## 🧪 Test Your Configuration

### Test Backend Locally

Create `test-config.js` in backend folder:

```javascript
require('dotenv').config();

console.log('Environment Variables Check:');
console.log('✓ DB_HOST:', process.env.DB_HOST);
console.log('✓ DB_USER:', process.env.DB_USER);
console.log('✓ DB_NAME:', process.env.DB_NAME);
console.log('✓ JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('✓ CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing');
console.log('✓ PORT:', process.env.PORT);
```

Run: `node test-config.js`

### Test Database Connection

```javascript
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully!');
  }
  connection.end();
});
```

---

## 📝 Deployment Checklist

### Before Deploying:

- [ ] GitHub repository pushed
- [ ] Database credentials ready
- [ ] Cloudinary account created
- [ ] JWT_SECRET generated
- [ ] All environment variables prepared
- [ ] Local testing completed

### During Deployment:

- [ ] Backend deployed on Render
- [ ] Environment variables added to Render
- [ ] Database schema imported
- [ ] Backend tested and working
- [ ] Frontend deployed on Vercel
- [ ] Frontend environment variables added
- [ ] CORS updated with frontend URL

### After Deployment:

- [ ] Test login functionality
- [ ] Test all user portals
- [ ] Test file uploads
- [ ] Test notifications
- [ ] Test database operations
- [ ] Monitor logs for errors
- [ ] Set up backups
- [ ] Configure monitoring

---

## 🎯 Quick Reference

### Your Configuration Files

**Local Development:**
- `backend/.env` - Your local environment variables
- `backend/.env.example` - Template for others

**Production:**
- Render → Environment tab - Backend variables
- Vercel → Settings → Environment Variables - Frontend variables

### Your Credentials Location

- **Database**: PlanetScale/Railway/Aiven dashboard
- **Cloudinary**: https://cloudinary.com/console
- **JWT Secret**: Generate new for production
- **URLs**: Render and Vercel dashboards

---

**Updated**: February 28, 2026
**Status**: Ready for deployment with correct database configuration

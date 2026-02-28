# Deployment Guide - Render & Vercel

## Overview
Deploy your School Management System to the cloud:
- **Frontend**: Vercel (React app)
- **Backend**: Render (Node.js API)
- **Database**: MySQL (Cloud or Local)

---

## Part 1: Prepare Your Project

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create repository: `school-management-system`
3. Clone to your computer:
```bash
git clone https://github.com/YOUR_USERNAME/school-management-system.git
cd school-management-system
```

4. Copy your project files into this folder
5. Create `.gitignore` file:
```
node_modules/
.env
.env.local
dist/
build/
.DS_Store
```

6. Push to GitHub:
```bash
git add .
git commit -m "Initial commit - School Management System"
git push origin main
```

### Step 2: Prepare Backend

**File**: `backend/.env`
```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
PORT=5000
NODE_ENV=production
```

**File**: `backend/package.json` - Ensure it has:
```json
{
  "name": "school-management-backend",
  "version": "1.0.0",
  "description": "School Management System Backend",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "mysql2": "^3.2.0",
    "bcryptjs": "^2.4.3"
  }
}
```

### Step 3: Prepare Frontend

**File**: `frontend/package.json` - Ensure it has:
```json
{
  "name": "school-management-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "lucide-react": "^0.263.1",
    "jspdf": "^2.5.1",
    "jspdf-autotable": "^3.5.31"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.2.0"
  }
}
```

---

## Part 2: Deploy Backend on Render

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### Step 2: Connect GitHub Repository

1. Select your GitHub repository
2. Choose branch: `main`
3. Fill in details:
   - **Name**: `school-management-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or paid for better performance)

### Step 3: Add Environment Variables

1. In Render dashboard, go to your service
2. Click "Environment"
3. Add variables:
```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
NODE_ENV=production
PORT=5000
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Get your backend URL: `https://school-management-backend.onrender.com`

### Step 5: Update Backend Code

In `backend/index.js`, update CORS:
```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

---

## Part 3: Deploy Frontend on Vercel

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"

### Step 2: Import GitHub Repository

1. Select your GitHub repository
2. Click "Import"

### Step 3: Configure Project

1. **Framework Preset**: `Vite`
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### Step 4: Add Environment Variables

1. Go to "Settings" → "Environment Variables"
2. Add variable:
```
VITE_API_URL=https://school-management-backend.onrender.com
```

### Step 5: Update Frontend Code

In `frontend/src/services/parentApi.js` and other API calls, update:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Example API call
fetch(`${API_URL}/api/admin/results`)
```

### Step 6: Deploy

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Get your frontend URL: `https://school-management-frontend.vercel.app`

---

## Part 4: Setup MySQL Database

### Option A: Use Cloud MySQL (Recommended)

1. **PlanetScale** (Free tier):
   - Go to https://planetscale.com
   - Create account
   - Create database
   - Get connection string
   - Use in Render environment variables

2. **AWS RDS** (Free tier):
   - Go to https://aws.amazon.com
   - Create RDS MySQL instance
   - Get endpoint
   - Use in Render environment variables

3. **Clever Cloud** (Free tier):
   - Go to https://www.clever-cloud.com
   - Create MySQL addon
   - Get connection details

### Option B: Use Local MySQL

1. Keep MySQL running on your computer
2. Use your computer's public IP or domain
3. Update `DB_HOST` in Render environment variables

---

## Part 5: Final Configuration

### Update API Endpoints

**Frontend** - Update all API calls to use environment variable:

In `frontend/src/pages/ResultPage.jsx`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fetchResults = async () => {
  const response = await fetch(`${API_URL}/api/admin/results`);
  // ...
};
```

### Update CORS in Backend

In `backend/index.js`:
```javascript
const allowedOrigins = [
  'https://school-management-frontend.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

---

## Part 6: Testing

### Test Backend
```
https://school-management-backend.onrender.com/
```
Should show: "School Management System API"

### Test Frontend
```
https://school-management-frontend.vercel.app/
```
Should load the login page

### Test Login
1. Go to frontend URL
2. Login with credentials:
   - Username: `admin`
   - Password: `Admin@123`
3. Should redirect to dashboard

---

## Part 7: Troubleshooting

### Backend Not Connecting
1. Check Render logs: Dashboard → Service → Logs
2. Verify environment variables are set
3. Check database connection
4. Verify CORS settings

### Frontend Not Loading
1. Check Vercel logs: Dashboard → Project → Deployments
2. Verify `VITE_API_URL` is set correctly
3. Check browser console for errors
4. Clear cache and reload

### Database Connection Error
1. Verify `DB_HOST`, `DB_USER`, `DB_PASSWORD`
2. Check database is running
3. Verify firewall allows connections
4. Test connection locally first

### CORS Errors
1. Check backend CORS configuration
2. Verify frontend URL is in allowed origins
3. Restart backend service
4. Clear browser cache

---

## Part 8: Monitoring & Maintenance

### Monitor Backend
- Render Dashboard → Logs
- Check for errors
- Monitor resource usage

### Monitor Frontend
- Vercel Dashboard → Analytics
- Check deployment status
- Monitor performance

### Database Backups
- Set up automatic backups
- Test restore process
- Keep backup schedule

---

## Part 9: Custom Domain (Optional)

### Add Domain to Vercel
1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records
4. Wait for verification (24-48 hours)

### Add Domain to Render
1. Go to Render Dashboard → Settings → Custom Domains
2. Add your domain
3. Update DNS records
4. Wait for verification

---

## Quick Deployment Checklist

- [ ] GitHub repository created and pushed
- [ ] Backend `.env` file configured
- [ ] Frontend `package.json` updated
- [ ] Render account created
- [ ] Backend deployed on Render
- [ ] Backend URL obtained
- [ ] Vercel account created
- [ ] Frontend deployed on Vercel
- [ ] Frontend URL obtained
- [ ] Environment variables set in both services
- [ ] API endpoints updated in frontend
- [ ] CORS configured in backend
- [ ] Database connection verified
- [ ] Login tested
- [ ] Dashboard tested
- [ ] All features tested

---

## Deployment URLs

After deployment, you'll have:

**Backend**: `https://school-management-backend.onrender.com`
**Frontend**: `https://school-management-frontend.vercel.app`

Users can access the system at the frontend URL.

---

## Support

If you encounter issues:
1. Check Render logs
2. Check Vercel logs
3. Verify environment variables
4. Test locally first
5. Check database connection
6. Review CORS settings

---

## Next Steps

1. Set up monitoring
2. Configure backups
3. Add custom domain
4. Set up SSL certificate
5. Configure email notifications
6. Add analytics
7. Set up error tracking

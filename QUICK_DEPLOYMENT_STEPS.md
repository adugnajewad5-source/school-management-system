# Quick Deployment Steps - 15 Minutes

## Step 1: Push to GitHub (2 minutes)

```bash
# In your project root
git init
git add .
git commit -m "School Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/school-management-system.git
git push -u origin main
```

---

## Step 2: Deploy Backend on Render (5 minutes)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your GitHub repository
5. Fill in:
   - **Name**: `school-management-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

6. Click "Create Web Service"
7. Go to "Environment" tab
8. Add these variables:
```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
NODE_ENV=production
```

9. Wait for deployment (5-10 minutes)
10. Copy your backend URL (e.g., `https://school-management-backend.onrender.com`)

---

## Step 3: Deploy Frontend on Vercel (5 minutes)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Select your GitHub repository
5. Click "Import"
6. Configure:
   - **Framework**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

7. Click "Environment Variables"
8. Add:
```
VITE_API_URL=https://school-management-backend.onrender.com
```

9. Click "Deploy"
10. Wait for deployment (2-5 minutes)
11. Copy your frontend URL (e.g., `https://school-management-frontend.vercel.app`)

---

## Step 4: Update Code (2 minutes)

### Update Backend CORS

In `backend/index.js`, find the CORS section and update:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-url.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

Replace `your-frontend-url` with your actual Vercel URL.

### Update Frontend API URL

In `frontend/src/pages/ResultPage.jsx` and other files, update API calls:

```javascript
// Change from:
const response = await fetch(`http://${window.location.hostname}:5000/api/admin/results`);

// To:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const response = await fetch(`${API_URL}/api/admin/results`);
```

---

## Step 5: Push Updates (1 minute)

```bash
git add .
git commit -m "Update API endpoints for production"
git push origin main
```

Both Render and Vercel will automatically redeploy.

---

## Step 6: Test (1 minute)

1. Go to your frontend URL: `https://your-frontend-url.vercel.app`
2. Login with:
   - Username: `admin`
   - Password: `Admin@123`
3. Test dashboard and features

---

## Done! 🎉

Your system is now live:
- **Frontend**: `https://your-frontend-url.vercel.app`
- **Backend**: `https://school-management-backend.onrender.com`

---

## If Something Goes Wrong

### Backend not connecting
1. Check Render logs: Dashboard → Service → Logs
2. Verify database connection
3. Check environment variables

### Frontend not loading
1. Check Vercel logs: Dashboard → Deployments
2. Check browser console (F12)
3. Verify `VITE_API_URL` is correct

### Database error
1. Verify `DB_HOST`, `DB_USER`, `DB_PASSWORD`
2. Test connection locally first
3. Check firewall settings

---

## Next: Setup MySQL Database

### Option 1: PlanetScale (Easiest)
1. Go to https://planetscale.com
2. Create free account
3. Create database
4. Get connection string
5. Update `DB_HOST`, `DB_USER`, `DB_PASSWORD` in Render

### Option 2: AWS RDS
1. Go to https://aws.amazon.com
2. Create RDS MySQL instance
3. Get endpoint
4. Update environment variables in Render

### Option 3: Keep Local MySQL
1. Keep MySQL running on your computer
2. Use your computer's IP address
3. Update `DB_HOST` in Render

---

## Useful Links

- Render: https://render.com
- Vercel: https://vercel.com
- PlanetScale: https://planetscale.com
- GitHub: https://github.com

---

## Support

Need help? Check:
1. Render logs
2. Vercel logs
3. Browser console (F12)
4. Database connection
5. Environment variables

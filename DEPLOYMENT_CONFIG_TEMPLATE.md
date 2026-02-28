# Deployment Configuration Template

## Your Deployment Information

Fill in this template with your deployment details:

---

## GitHub Repository

```
Repository URL: https://github.com/YOUR_USERNAME/school-management-system
Branch: main
```

---

## Backend (Render)

### Service Details
```
Service Name: school-management-backend
Service URL: https://school-management-backend.onrender.com
Environment: Node
Region: (select closest to you)
Instance Type: Free
```

### Environment Variables
```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
NODE_ENV=production
PORT=5000
```

### Build & Start Commands
```
Build Command: npm install
Start Command: npm start
Root Directory: backend
```

---

## Frontend (Vercel)

### Project Details
```
Project Name: school-management-frontend
Project URL: https://school-management-frontend.vercel.app
Framework: Vite
```

### Environment Variables
```
VITE_API_URL=https://school-management-backend.onrender.com
```

### Build Configuration
```
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

---

## Database

### Option 1: PlanetScale
```
Host: (from PlanetScale)
User: (from PlanetScale)
Password: (from PlanetScale)
Database: school_management
Port: 3306
```

### Option 2: AWS RDS
```
Endpoint: (from AWS)
User: (from AWS)
Password: (from AWS)
Database: school_management
Port: 3306
```

### Option 3: Local MySQL
```
Host: your_computer_ip
User: root
Password: your_password
Database: school_management
Port: 3306
```

---

## CORS Configuration

Update in `backend/index.js`:

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

## API Endpoints

### Backend
```
Base URL: https://school-management-backend.onrender.com
API Routes:
- /api/auth - Authentication
- /api/admin - Admin operations
- /api/parent - Parent operations
- /api/notifications - Notifications
```

### Frontend
```
Base URL: https://school-management-frontend.vercel.app
Pages:
- /login - Login page
- /admin - Admin dashboard
- /teacher - Teacher dashboard
- /student - Student dashboard
- /parent - Parent dashboard
```

---

## Login Credentials

### Admin
```
Username: admin
Password: Admin@123
```

### Teacher
```
Username: teacher1
Password: Teacher@123
```

### Student (hayu)
```
Username: hayu551
Password: Hayu@123
```

---

## Deployment Checklist

### Before Deployment
- [ ] GitHub repository created
- [ ] All code committed and pushed
- [ ] `.env` file configured locally
- [ ] `.gitignore` includes `.env`
- [ ] `package.json` files updated
- [ ] Database ready (local or cloud)

### Render Setup
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] Backend service created
- [ ] Environment variables added
- [ ] Build command verified
- [ ] Start command verified
- [ ] Deployment successful
- [ ] Backend URL obtained

### Vercel Setup
- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Frontend project created
- [ ] Environment variables added
- [ ] Build configuration verified
- [ ] Deployment successful
- [ ] Frontend URL obtained

### Code Updates
- [ ] Backend CORS updated
- [ ] Frontend API URL updated
- [ ] All API calls use environment variable
- [ ] Changes committed and pushed
- [ ] Services redeployed

### Testing
- [ ] Backend URL responds
- [ ] Frontend loads
- [ ] Login works
- [ ] Dashboard displays
- [ ] Add marks works
- [ ] View results works
- [ ] Notifications work
- [ ] All features tested

---

## Monitoring

### Render Monitoring
- Dashboard: https://dashboard.render.com
- Check logs regularly
- Monitor resource usage
- Set up alerts

### Vercel Monitoring
- Dashboard: https://vercel.com/dashboard
- Check deployments
- Monitor analytics
- Set up alerts

---

## Troubleshooting

### Issue: Backend not connecting
**Solution:**
1. Check Render logs
2. Verify environment variables
3. Test database connection
4. Check CORS settings

### Issue: Frontend not loading
**Solution:**
1. Check Vercel logs
2. Check browser console
3. Verify API URL
4. Clear cache

### Issue: Database error
**Solution:**
1. Verify connection string
2. Check database is running
3. Test locally first
4. Check firewall

### Issue: CORS error
**Solution:**
1. Update CORS in backend
2. Verify frontend URL
3. Restart backend
4. Clear browser cache

---

## Support Resources

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- GitHub Docs: https://docs.github.com
- Node.js Docs: https://nodejs.org/docs
- React Docs: https://react.dev

---

## Post-Deployment

### Setup Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Log aggregation (LogRocket)

### Setup Backups
- [ ] Database backups
- [ ] Code backups
- [ ] Configuration backups
- [ ] Test restore process

### Setup Security
- [ ] SSL certificate
- [ ] Firewall rules
- [ ] Rate limiting
- [ ] Input validation

### Setup Analytics
- [ ] User tracking
- [ ] Performance metrics
- [ ] Error tracking
- [ ] Usage statistics

---

## Notes

```
Add any additional notes or configurations here:

_____________________________________________

_____________________________________________

_____________________________________________
```

---

## Deployment Date

```
Date Deployed: _______________
Deployed By: _______________
Notes: _______________
```

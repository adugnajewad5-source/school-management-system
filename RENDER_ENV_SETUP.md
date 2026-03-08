# 🔧 Set Up Environment Variables on Render

The backend is not connecting because Render doesn't have the PlanetScale database credentials. You need to set them manually on Render.

## Step 1: Get Your PlanetScale Credentials

You should have these from when you created the PlanetScale database:
- **DB_HOST**: `aws.connect.psdb.cloud`
- **DB_USER**: `root` (or your username)
- **DB_PASSWORD**: Your PlanetScale password
- **DB_NAME**: `school_management`

If you don't have these, go to: https://app.planetscale.com

---

## Step 2: Set Environment Variables on Render

### Instructions:

1. Go to: https://dashboard.render.com
2. Click: `school-management-backend-gnav` service
3. Click: **"Environment"** tab (on the left sidebar)
4. You'll see a list of environment variables
5. Add or update these variables:

| Variable | Value | Example |
|----------|-------|---------|
| `DB_HOST` | Your PlanetScale host | `aws.connect.psdb.cloud` |
| `DB_USER` | Your PlanetScale username | `root` |
| `DB_PASSWORD` | Your PlanetScale password | `pscale_pw_xxxxx` |
| `DB_NAME` | Database name | `school_management` |
| `DB_PORT` | Port number | `3306` |
| `NODE_ENV` | Environment | `production` |
| `JWT_SECRET` | Secret key | `your_super_secret_jwt_key_123_change_in_production` |
| `FRONTEND_URL` | Frontend URL | `https://school-management-system.vercel.app` |

### How to Add/Edit Variables:

1. Click: **"Add Environment Variable"** button
2. Enter: Variable name (e.g., `DB_HOST`)
3. Enter: Variable value (e.g., `aws.connect.psdb.cloud`)
4. Click: **"Save"** button
5. Repeat for each variable

---

## Step 3: Redeploy Backend

After setting all environment variables:

1. Click: **"Redeploy"** button (top right)
2. Wait: 2-3 minutes
3. Check: **"Logs"** tab
4. Look for: `"Connected to MySQL database"`

---

## Environment Variables to Set

### Database Configuration
```
DB_HOST=aws.connect.psdb.cloud
DB_USER=root
DB_PASSWORD=pscale_pw_xxxxx
DB_NAME=school_management
DB_PORT=3306
```

### Application Configuration
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your_super_secret_jwt_key_123_change_in_production
FRONTEND_URL=https://school-management-system.vercel.app
```

### Cloudinary (Optional - if using file uploads)
```
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

---

## Verify Connection

After redeploy:

1. Check Render logs
2. Should see: `Connected to MySQL database`
3. Should NOT see: `Error connecting to MySQL`

If you see the error, check:
- All environment variables are set correctly
- DB_PASSWORD is correct
- DB_HOST is correct (aws.connect.psdb.cloud)
- Network access is allowed on PlanetScale

---

## If Still Not Working

### Check PlanetScale Settings:

1. Go to: https://app.planetscale.com
2. Click your database
3. Click: **"Settings"** tab
4. Check: **"Connections"** section
5. Verify: SSL/TLS is enabled
6. Verify: Your IP is allowed (or allow all)

### Check Render Logs:

1. Go to Render dashboard
2. Click your service
3. Click: **"Logs"** tab
4. Look for exact error message
5. Common errors:
   - `Access denied for user` - Wrong password
   - `Unknown host` - Wrong host
   - `Connection timeout` - Network issue

---

## Quick Reference

**Render Dashboard:** https://dashboard.render.com
**PlanetScale Dashboard:** https://app.planetscale.com
**Backend Service:** school-management-backend-gnav

---

**Set these environment variables and redeploy to fix the database connection!**

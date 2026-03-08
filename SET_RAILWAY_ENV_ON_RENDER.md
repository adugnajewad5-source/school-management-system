# 🚂 Set Railway Database on Render

Your Railway database credentials are ready. Here's what to set on Render:

## Environment Variables to Set on Render

```
DB_HOST=${{RAILWAY_PRIVATE_DOMAIN}}
DB_USER=root
DB_PASSWORD=oGGYFZAYYVfJyMReLooWEFXCiWETNGep
DB_NAME=railway
DB_PORT=3306
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_123_change_in_production
FRONTEND_URL=https://school-management-system.vercel.app
```

## Steps to Set on Render

1. Go to: https://dashboard.render.com
2. Click: `school-management-backend-gnav`
3. Click: "Environment" tab
4. Remove old variables (if any)
5. Add these 8 variables:

| Name | Value |
|------|-------|
| DB_HOST | ${{RAILWAY_PRIVATE_DOMAIN}} |
| DB_USER | root |
| DB_PASSWORD | oGGYFZAYYVfJyMReLooWEFXCiWETNGep |
| DB_NAME | railway |
| DB_PORT | 3306 |
| NODE_ENV | production |
| JWT_SECRET | your_super_secret_jwt_key_123_change_in_production |
| FRONTEND_URL | https://school-management-system.vercel.app |

6. Click: "Redeploy"
7. Wait: 2-3 minutes
8. Check: Logs for "Connected to MySQL database"

## After Setting

1. Test login at: https://school-management-system.vercel.app
2. Username: admin
3. Password: Admin@123

Your system will work! 🚀

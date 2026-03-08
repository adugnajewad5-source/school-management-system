# 🔑 Get Your PlanetScale Credentials

Your backend needs the PlanetScale database credentials to connect. Follow these steps to get them.

## Step 1: Go to PlanetScale Dashboard

1. Open: https://app.planetscale.com
2. Login with your account
3. You should see your databases listed

---

## Step 2: Find Your Database

1. Look for: `school-management` database
2. Click on it
3. You're now in the database details page

---

## Step 3: Get Connection String

1. Click: **"Connect"** button (top right)
2. A dialog appears with connection options
3. Select: **"Node.js"** from the dropdown
4. You'll see a connection string like:

```
const connection = mysql.createConnection({
  host: 'aws.connect.psdb.cloud',
  user: 'xxxxxxxxxxxxx',
  password: 'pscale_pw_xxxxxxxxxxxxx',
  database: 'school-management'
});
```

---

## Step 4: Copy Your Credentials

From the connection string, copy these values:

| Variable | Value from Connection String |
|----------|------------------------------|
| `DB_HOST` | `aws.connect.psdb.cloud` |
| `DB_USER` | The `user` value (looks like: `xxxxxxxxxxxxx`) |
| `DB_PASSWORD` | The `password` value (looks like: `pscale_pw_xxxxxxxxxxxxx`) |
| `DB_NAME` | `school-management` |
| `DB_PORT` | `3306` |

**Example:**
```
DB_HOST=aws.connect.psdb.cloud
DB_USER=xxxxxxxxxxxxxxxx
DB_PASSWORD=pscale_pw_xxxxxxxxxxxxxxxx
DB_NAME=school-management
DB_PORT=3306
```

---

## Step 5: Set on Render

1. Go to: https://dashboard.render.com
2. Click: `school-management-backend-gnav` service
3. Click: **"Environment"** tab
4. Add these variables with your copied values:
   - `DB_HOST` = `aws.connect.psdb.cloud`
   - `DB_USER` = (your copied user)
   - `DB_PASSWORD` = (your copied password)
   - `DB_NAME` = `school-management`
   - `DB_PORT` = `3306`
   - `NODE_ENV` = `production`

5. Click: **"Save"** for each variable
6. Click: **"Redeploy"** button

---

## Step 6: Verify Connection

1. Check Render logs
2. Should see: `Connected to MySQL database`
3. If error, verify credentials are correct

---

## If You Don't Have PlanetScale Account

If you don't have a PlanetScale database yet:

1. Go to: https://planetscale.com
2. Sign up (free tier available)
3. Create a new database called `school-management`
4. Import the schema from: `database/schema.sql`
5. Get the connection credentials
6. Set them on Render

---

## Common Issues

### "Access denied for user"
- Check DB_USER is correct
- Check DB_PASSWORD is correct
- Verify credentials match PlanetScale

### "Unknown host"
- Check DB_HOST is `aws.connect.psdb.cloud`
- Don't use localhost for production

### "Connection timeout"
- Check network access on PlanetScale
- Go to PlanetScale dashboard
- Click database → Settings → Connections
- Verify your IP is allowed (or allow all)

---

**Get your credentials from PlanetScale and set them on Render to fix the database connection!**

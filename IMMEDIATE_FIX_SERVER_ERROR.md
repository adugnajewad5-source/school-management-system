# 🔧 Fix "Server Error" - Immediate Solution

Your frontend shows "Server error" because the backend can't connect to the database. Here's the immediate fix:

## The Problem
1. ✅ Frontend is deployed on Vercel
2. ✅ Backend is deployed on Render
3. ❌ Backend has NO database credentials
4. ❌ So it can't connect to database
5. ❌ Frontend gets "Server error"

## The Solution (Choose ONE)

### OPTION A: Use Local MySQL (FASTEST - 5 minutes)

**Step 1: Install XAMPP**
1. Download: https://www.apachefriends.org/download.html
2. Install XAMPP
3. Start XAMPP Control Panel
4. Click "Start" next to MySQL

**Step 2: Create Database**
1. Open: http://localhost/phpmyadmin
2. Click "New" (left sidebar)
3. Enter: `school_management`
4. Click "Create"

**Step 3: Import Schema**
1. Click: `school_management` database
2. Click: "Import" tab
3. Click: "Choose File"
4. Select: `database/schema.sql` from your project
5. Click: "Import"

**Step 4: Set on Render**
1. Go to: https://dashboard.render.com
2. Click: `school-management-backend-gnav`
3. Click: "Environment" tab
4. Add these variables:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=(leave empty if no password)
   DB_NAME=school_management
   NODE_ENV=production
   ```
5. Click: "Redeploy"
6. Wait 2-3 minutes

**Step 5: Test**
1. Check Render logs for: "Connected to MySQL database"
2. Refresh frontend: https://school-management-system.vercel.app
3. Login with: admin / Admin@123

---

### OPTION B: Use Railway (If XAMPP doesn't work)

**Step 1: Create Railway Database**
1. Go to: https://railway.app
2. Sign up (free)
3. Create new project
4. Add MySQL database
5. Copy connection credentials
* creating /opt/render/project/.mix/elixir/1-18-otp-28/rebar3
==> Running build command 'npm install'...
==> Using Node.js version 22.22.0 (default)
==> Docs on specifying a Node.js version: https://render.com/docs/node-version
up to date, audited 115 packages in 2s
29 packages are looking for funding
  run `npm fund` for details
2 high severity vulnerabilities
To address all issues (including breaking changes), run:
  npm audit fix --force
Run `npm audit` for details.
==> Uploading build...
==> Uploaded in 4.4s. Compression took 1.6s
==> Build successful 🎉
==> Deploying...
==> Setting WEB_CONCURRENCY=1 by default, based on available CPUs in the instance
Menu
==> Using Erlang version 28.0.2 (default)
==> Using Elixir version 1.18.4 (default)
==> Docs on specifying Elixir and Erlang versions: https://render.com/docs/elixir-erlang-versions
==> Running 'node index.js'
[dotenv@17.3.1] injecting env (0) from .env -- tip: 🛡️ auth for agents: https://vestauth.com
[dotenv@17.3.1] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
[dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
[dotenv@17.3.1] injecting env (0) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
[dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  enable debug logging with { debug: true }
[dotenv@17.3.1] injecting env (0) from .env -- tip: ⚙️  suppress all logs with { quiet: true }
[dotenv@17.3.1] injecting env (0) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
[dotenv@17.3.1] injecting env (0) from .env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
[dotenv@17.3.1] injecting env (0) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
Server is running securely on all network interfaces on port 10000
Error connecting to MySQL: Error: getaddrinfo ENOTFOUND mysql.railway.internal
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:122:26) {
  errno: -3008,
  code: 'ENOTFOUND',
  syscall: 'getaddrinfo',
  hostname: 'mysql.railway.internal',
  fatal: true
}
==> Your service is live 🎉
==> 
==> ///////////////////////////////////////////////////////////
==> 
==> Available at your primary URL https://school-management-backend-gnav.onrender.com
==> 
==> ///////////////////////////////////////////////////////////
**Step 2: Set on Render**
1. Go to: https://dashboard.render.com
2. Click: `school-management-backend-gnav`
3. Click: "Environment" tab
4. Add these variables:
   ```
   DB_HOST=(from Railway)
   DB_USER=(from Railway)
   DB_PASSWORD=(from Railway)
   DB_NAME=(from Railway)
   NODE_ENV=production
   ```
5. Click: "Redeploy"

---

### OPTION C: Use PlanetScale (If it's working now)

**Step 1: Get Credentials**
1. Go to: https://app.planetscale.com
2. Click your database
3. Click "Connect"
4. Select "Node.js"
5. Copy credentials

**Step 2: Set on Render**
1. Go to: https://dashboard.render.com
2. Click: `school-management-backend-gnav`
3. Click: "Environment" tab
4. Add these variables:
   ```
   DB_HOST=aws.connect.psdb.cloud
   DB_USER=(from PlanetScale)
   DB_PASSWORD=(from PlanetScale)
   DB_NAME=school_management
   NODE_ENV=production
   ```
5. Click: "Redeploy"

---

## Quick Checklist

- [ ] Chose an option (A, B, or C)
- [ ] Got database credentials
- [ ] Set environment variables on Render
- [ ] Clicked "Redeploy"
- [ ] Waited 2-3 minutes
- [ ] Checked logs for "Connected to MySQL database"
- [ ] Refreshed frontend
- [ ] Logged in successfully

---

## If Still Getting "Server error"

1. Check Render logs:
   - Go to: https://dashboard.render.com
   - Click: `school-management-backend-gnav`
   - Click: "Logs" tab
   - Look for error message

2. Common errors:
   - "Access denied" = Wrong password
   - "Unknown host" = Wrong host
   - "Connection timeout" = Database not running

3. Try redeploy again:
   - Click "Redeploy" button
   - Wait 2-3 minutes

---

## Recommended: Use XAMPP (Option A)

✅ Easiest
✅ Fastest
✅ Works immediately
✅ Free
✅ No waiting

Just follow Option A above!

---

**Your system will work in 5-10 minutes!** 🚀

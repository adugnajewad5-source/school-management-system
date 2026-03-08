# 🔴 ETIMEDOUT Error - Connection Timeout Fix

## What This Error Means

```
Error connecting to MySQL: Error: connect ETIMEDOUT
```

**ETIMEDOUT** = "Connection Timed Out"

Translation: "I tried to connect to the database, but it took too long and gave up."

---

## 🔍 Common Causes

### 1. Wrong Public Domain (Most Common)
- You're using an incorrect or non-existent domain
- The domain doesn't resolve to a valid server
- Typo in the domain name

### 2. Railway Database is Down
- The MySQL service isn't running
- Railway is having issues
- Database was deleted or suspended

### 3. Network/Firewall Issue
- Connection is being blocked
- Port 3306 is not accessible
- Network configuration issue

---

## ✅ How to Fix

### Step 1: Verify Your Railway Public Domain

1. Go to: https://railway.app/dashboard
2. Click your MySQL database
3. Look for "Public Domain" or "TCP Proxy Domain"
4. **Copy the EXACT domain** (no extra spaces)

**Common public domains look like:**
- `gateway.railway.app`
- `mysql-prod-1234.railway.app`
- `mysql.railway.app`

### Step 2: Check if Railway Database is Running

1. Go to: https://railway.app/dashboard
2. Click your MySQL database
3. Look for the status - should show **"Running"** or **"Active"**
4. If it shows "Stopped" or "Crashed", click to restart it

### Step 3: Update Render with Correct Domain

1. Go to: https://dashboard.render.com
2. Click: `school-management-backend-gnav`
3. Click: `Environment`
4. Find: `DB_HOST`
5. **Make sure it's set to your EXACT public domain**
6. Click: **Save**
7. Click: **Redeploy**

### Step 4: Wait and Check Logs

1. Wait 2-3 minutes for deployment
2. Click: **Logs**
3. Look for: `Connected to MySQL database` ✅

---

## 🎯 Troubleshooting Steps

### Is the domain correct?

**Check 1: Copy the domain again**
```
1. Go to Railway dashboard
2. Click MySQL database
3. Find "Public Domain"
4. Copy it EXACTLY (no spaces, no typos)
5. Paste it in Render DB_HOST
```

**Check 2: Verify it's not a variable name**
```
❌ WRONG: ${{RAILWAY_TCP_PROXY_DOMAIN}}
✅ RIGHT: gateway.railway.app
```

**Check 3: Make sure it ends with .railway.app**
```
✅ Correct: gateway.railway.app
✅ Correct: mysql-prod-1234.railway.app
❌ Wrong: mysql.railway.internal (this is private)
❌ Wrong: localhost
```

### Is Railway database running?

**Check 1: Go to Railway dashboard**
```
1. https://railway.app/dashboard
2. Click your MySQL database
3. Look at the status
```

**Check 2: Status should be "Running"**
```
✅ Running - Database is active
❌ Stopped - Database is not running (click to start)
❌ Crashed - Database crashed (click to restart)
```

**Check 3: If stopped, restart it**
```
1. Click the database
2. Look for "Start" or "Restart" button
3. Click it
4. Wait for it to start
```

### Is the port correct?

**Check: DB_PORT should be 3306**
```
✅ Correct: DB_PORT = 3306
❌ Wrong: DB_PORT = 5432 (that's PostgreSQL)
❌ Wrong: DB_PORT = 3307
```

---

## 📋 Complete Checklist

- [ ] Railway database is running (check status)
- [ ] Public domain is correct (copy from Railway dashboard)
- [ ] DB_HOST is set to the public domain (not a variable name)
- [ ] DB_HOST doesn't have extra spaces
- [ ] DB_PORT is 3306
- [ ] DB_USER is root
- [ ] DB_PASSWORD is correct
- [ ] Render has been redeployed
- [ ] Waited 2-3 minutes after redeploy

---

## 🔧 Step-by-Step Fix

### Step 1: Get Fresh Domain from Railway

1. Open: https://railway.app/dashboard
2. Click your MySQL database
3. Click "Connect" tab
4. Find "Public Domain"
5. **Copy it** (Ctrl+C)
6. Write it down or paste it somewhere

### Step 2: Update Render

1. Open: https://dashboard.render.com
2. Click: `school-management-backend-gnav`
3. Click: `Environment`
4. Find: `DB_HOST`
5. **Delete the current value**
6. **Paste the domain you just copied**
7. Click: **Save**
8. Click: **Redeploy**

### Step 3: Wait and Verify

1. Wait 2-3 minutes
2. Click: **Logs**
3. Scroll down to see latest logs
4. Look for: `Connected to MySQL database` ✅

---

## 🆘 Still Not Working?

### If you still see ETIMEDOUT:

1. **Check Railway database status**
   - Go to Railway dashboard
   - Is the database "Running"?
   - If not, restart it

2. **Verify the domain is correct**
   - Copy it again from Railway
   - Make sure there are no typos
   - Make sure there are no extra spaces

3. **Check if it's a network issue**
   - Try from a different network (mobile hotspot)
   - Check if your ISP is blocking port 3306
   - Try using a VPN

4. **Restart Railway database**
   - Go to Railway dashboard
   - Click your MySQL database
   - Look for "Restart" or "Stop/Start" button
   - Click it
   - Wait for it to restart

5. **Check Render logs for more details**
   - Go to Render dashboard
   - Click your backend service
   - Click "Logs"
   - Look for any other error messages

---

## 📞 Quick Reference

| Item | Value |
|------|-------|
| Railway Dashboard | https://railway.app/dashboard |
| Render Dashboard | https://dashboard.render.com |
| DB_PORT | 3306 |
| DB_USER | root |
| Error | ETIMEDOUT (connection timeout) |
| Cause | Wrong domain or database not running |
| Fix | Verify domain and restart database |

---

## ✅ Success Indicators

When it's working:
- ✅ Logs show "Connected to MySQL database"
- ✅ No ETIMEDOUT errors
- ✅ No other error messages
- ✅ Service shows as "Live"

---

## 🎯 Next Steps

1. **Verify Railway database is running**
2. **Copy the exact public domain from Railway**
3. **Update Render DB_HOST with the domain**
4. **Redeploy Render**
5. **Check logs for "Connected to MySQL database"**


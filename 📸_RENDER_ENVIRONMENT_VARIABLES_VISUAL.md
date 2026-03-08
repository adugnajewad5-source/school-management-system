# 📸 RENDER ENVIRONMENT VARIABLES - VISUAL GUIDE

## What You'll See on Render Dashboard

### Step 1: Open Your Backend Service
```
Render Dashboard
├── Services
│   └── school-management-backend-gnav ← CLICK HERE
```

### Step 2: Click Environment Tab
```
Your Backend Service Page
├── Logs
├── Environment ← CLICK HERE
├── Settings
└── Deploys
```

### Step 3: Add Environment Variables Section
```
Environment Variables
┌─────────────────────────────────────────────────────────┐
│ Add Environment Variable                                │
│                                                         │
│ Key:   [________________]                              │
│ Value: [________________]                              │
│                                                         │
│ [Save]  [Cancel]                                       │
└─────────────────────────────────────────────────────────┘

Existing Variables:
┌─────────────────────────────────────────────────────────┐
│ KEY              │ VALUE                                │
├──────────────────┼────────────────────────────────────┤
│ (empty at first) │                                    │
└─────────────────────────────────────────────────────────┘
```

---

## How to Add Each Variable

### Adding Variable 1: DB_HOST

```
┌─────────────────────────────────────────────────────────┐
│ Add Environment Variable                                │
│                                                         │
│ Key:   [DB_HOST                    ]                   │
│ Value: [${{RAILWAY_PRIVATE_DOMAIN}}]                   │
│                                                         │
│ [Save]  [Cancel]                                       │
└─────────────────────────────────────────────────────────┘
```

**IMPORTANT:** Make sure you type it EXACTLY:
- `${{RAILWAY_PRIVATE_DOMAIN}}`
- Note the double curly braces: `${{` not `${`

### Adding Variable 2: DB_USER

```
┌─────────────────────────────────────────────────────────┐
│ Add Environment Variable                                │
│                                                         │
│ Key:   [DB_USER]                                       │
│ Value: [root   ]                                       │
│                                                         │
│ [Save]  [Cancel]                                       │
└─────────────────────────────────────────────────────────┘
```

### Adding Variable 3: DB_PASSWORD

```
┌─────────────────────────────────────────────────────────┐
│ Add Environment Variable                                │
│                                                         │
│ Key:   [DB_PASSWORD                                   ]│
│ Value: [oGGYFZAYYVfJyMReLooWEFXCiWETNGep              ]│
│                                                         │
│ [Save]  [Cancel]                                       │
└─────────────────────────────────────────────────────────┘
```

**IMPORTANT:** Copy the password EXACTLY - it's case-sensitive!

### Adding Variable 4: DB_NAME

```
┌─────────────────────────────────────────────────────────┐
│ Add Environment Variable                                │
│                                                         │
│ Key:   [DB_NAME ]                                      │
│ Value: [railway ]                                      │
│                                                         │
│ [Save]  [Cancel]                                       │
└─────────────────────────────────────────────────────────┘
```

### Adding Variable 5: DB_PORT

```
┌─────────────────────────────────────────────────────────┐
│ Add Environment Variable                                │
│                                                         │
│ Key:   [DB_PORT]                                       │
│ Value: [3306   ]                                       │
│                                                         │
│ [Save]  [Cancel]                                       │
└─────────────────────────────────────────────────────────┘
```

### Adding Variable 6: NODE_ENV

```
┌─────────────────────────────────────────────────────────┐
│ Add Environment Variable                                │
│                                                         │
│ Key:   [NODE_ENV   ]                                   │
│ Value: [production ]                                   │
│                                                         │
│ [Save]  [Cancel]                                       │
└─────────────────────────────────────────────────────────┘
```

### Adding Variable 7: JWT_SECRET

```
┌─────────────────────────────────────────────────────────┐
│ Add Environment Variable                                │
│                                                         │
│ Key:   [JWT_SECRET                                    ]│
│ Value: [your_super_secret_jwt_key_123_change_in_prod ]│
│                                                         │
│ [Save]  [Cancel]                                       │
└─────────────────────────────────────────────────────────┘
```

### Adding Variable 8: FRONTEND_URL

```
┌─────────────────────────────────────────────────────────┐
│ Add Environment Variable                                │
│                                                         │
│ Key:   [FRONTEND_URL                                  ]│
│ Value: [https://school-management-system.vercel.app  ]│
│                                                         │
│ [Save]  [Cancel]                                       │
└─────────────────────────────────────────────────────────┘
```

---

## After Adding All 8 Variables

You should see this in your Environment Variables list:

```
Existing Variables:
┌──────────────────┬──────────────────────────────────────────┐
│ KEY              │ VALUE                                    │
├──────────────────┼──────────────────────────────────────────┤
│ DB_HOST          │ ${{RAILWAY_PRIVATE_DOMAIN}}             │
│ DB_USER          │ root                                     │
│ DB_PASSWORD      │ oGGYFZAYYVfJyMReLooWEFXCiWETNGep        │
│ DB_NAME          │ railway                                  │
│ DB_PORT          │ 3306                                     │
│ NODE_ENV         │ production                               │
│ JWT_SECRET       │ your_super_secret_jwt_key_123_change... │
│ FRONTEND_URL     │ https://school-management-system.vercel │
└──────────────────┴──────────────────────────────────────────┘
```

---

## Click Redeploy

After all 8 variables are added:

```
Your Backend Service Page
├── Logs
├── Environment
├── Settings
├── Deploys
│   └── [Redeploy] ← CLICK HERE
└── ...
```

Or scroll to the top of the page and look for a **"Redeploy"** button.

---

## Check Logs

After clicking Redeploy:

```
Your Backend Service Page
├── Logs ← CLICK HERE
├── Environment
├── Settings
└── Deploys
```

Wait 2-3 minutes and watch the logs. You should see:

```
==> Running 'node index.js'
[dotenv] injecting env...
Server is running securely on all network interfaces on port 10000
Connected to MySQL database ✅ ← THIS IS WHAT YOU WANT TO SEE
```

If you see `Connected to MySQL database`, then ✅ SUCCESS!

---

## If You See Errors

### Error: ECONNREFUSED
```
Error connecting to MySQL: AggregateError [ECONNREFUSED]:
  Error: connect ECONNREFUSED ::1:3306
```
**Means:** Environment variables not set correctly. Go back and verify all 8 are there.

### Error: ENOTFOUND
```
Error connecting to MySQL: Error: getaddrinfo ENOTFOUND mysql.railway.internal
```
**Means:** `DB_HOST` is wrong. Make sure it's exactly: `${{RAILWAY_PRIVATE_DOMAIN}}`

### Error: Access denied for user
```
Error connecting to MySQL: Error: Access denied for user 'root'@'...'
```
**Means:** Password is wrong. Make sure it's exactly: `oGGYFZAYYVfJyMReLooWEFXCiWETNGep`

---

## ✅ Success Indicators

When everything is working:
- ✅ Logs show: `Connected to MySQL database`
- ✅ No error messages
- ✅ Service shows as "Live" (green)
- ✅ Frontend can login successfully


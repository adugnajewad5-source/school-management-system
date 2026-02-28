# How to Access School Management System on Your Phone

## Prerequisites
- Your computer with the system running
- Your phone on the same WiFi network as your computer
- Phone browser (Chrome, Safari, Firefox, etc.)

## Step 1: Find Your Computer's IP Address

### On Windows (Your Computer):
1. Open Command Prompt (Press `Win + R`, type `cmd`, press Enter)
2. Type: `ipconfig`
3. Look for "IPv4 Address" under your WiFi connection
4. Example: `192.168.x.x` or `10.0.x.x`

**Write down this IP address** - you'll need it on your phone

## Step 2: Start the Backend Server

### On Your Computer:
1. Open Command Prompt or PowerShell
2. Navigate to the backend folder:
   ```
   cd backend
   ```
3. Start the server:
   ```
   npm start
   ```
   Or if that doesn't work:
   ```
   node index.js
   ```
4. You should see: `Server is running on port 5000`
5. **Keep this window open** - don't close it

## Step 3: Start the Frontend Server

### On Your Computer (Open a NEW Command Prompt):
1. Open another Command Prompt or PowerShell
2. Navigate to the frontend folder:
   ```
   cd frontend
   ```
3. Start the frontend:
   ```
   npm run dev
   ```
4. You should see: `Local: http://localhost:5173`
5. **Keep this window open** - don't close it

## Step 4: Access on Your Phone

### On Your Phone:
1. Make sure your phone is connected to the **same WiFi** as your computer
2. Open your phone's browser (Chrome, Safari, etc.)
3. In the address bar, type:
   ```
   http://YOUR_COMPUTER_IP:5173
   ```
   
   **Example**: `http://192.168.1.100:5173`

4. Press Enter
5. **The system should load on your phone!**

## Step 5: Login Credentials

### Teacher Login:
- Username: `teacher1`
- Password: `Teacher@123`

### Student Login (hayu):
- Username: `hayu551`
- Password: `Hayu@123`

### Admin Login:
- Username: `admin`
- Password: `Admin@123`

## Troubleshooting

### "Cannot connect to server"
- Check both servers are running (backend and frontend)
- Check your phone is on the same WiFi as your computer
- Check the IP address is correct
- Try pinging from phone: `http://YOUR_IP:5000` (should show "School Management System API")

### "Page not loading"
- Make sure frontend server is running (`npm run dev`)
- Check the IP address in the URL
- Try refreshing the page

### "Cannot add marks / see results"
- Make sure backend server is running (`node index.js`)
- Check the backend is showing no errors
- Try refreshing the page

### "Database connection error"
- Make sure MySQL is running on your computer
- Check `.env` file has correct database credentials

## Quick Start Commands

### Terminal 1 (Backend):
```bash
cd backend
npm start
```

### Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### On Phone Browser:
```
http://YOUR_COMPUTER_IP:5173
```

## Features Available on Phone

✓ Student Portal - View marks and results
✓ Teacher Portal - Add and update marks
✓ Admin Dashboard - Manage students and teachers
✓ Notifications - See new marks notifications
✓ Responsive Design - Works on all screen sizes

## Tips for Phone Usage

1. **Bookmark the URL**: Save `http://YOUR_IP:5173` as a bookmark for quick access
2. **Keep Servers Running**: Don't close the command windows while using the app
3. **Same WiFi**: Always connect to the same WiFi as your computer
4. **Refresh if Issues**: If something doesn't work, refresh the page
5. **Check Console**: If errors occur, check the backend terminal for error messages

## Network Diagram

```
Your Computer (Windows)
├── Backend Server (Port 5000)
├── Frontend Server (Port 5173)
└── MySQL Database

        ↓ (WiFi Connection)

Your Phone
└── Browser
    └── http://192.168.x.x:5173
```

## Example Setup

### Computer Terminal 1:
```
C:\Users\YourName\school-management\backend> npm start
[dotenv] injecting env
Connected to MySQL database
Server is running on all network interfaces on port 5000
```

### Computer Terminal 2:
```
C:\Users\YourName\school-management\frontend> npm run dev
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Phone Browser:
```
Address Bar: http://192.168.1.100:5173
↓
School Management System loads
↓
Login with credentials
↓
Use the system!
```

## Common IP Addresses

Your computer IP might be one of these:
- `192.168.1.x` (Most common home WiFi)
- `192.168.0.x` (Some home WiFi)
- `10.0.0.x` (Some office WiFi)
- `172.16.x.x` (Some networks)

**Always check with `ipconfig` command to be sure**

## Still Having Issues?

1. Check both servers are running
2. Verify IP address with `ipconfig`
3. Verify phone is on same WiFi
4. Try accessing `http://YOUR_IP:5000` on phone (should show API message)
5. Restart both servers
6. Restart your phone's WiFi connection

## Security Note

⚠️ This setup is for **local network only**. Don't expose your computer's IP to the internet.

For production/remote access, you would need:
- Cloud hosting (AWS, Heroku, etc.)
- Domain name
- SSL certificate
- Proper security setup

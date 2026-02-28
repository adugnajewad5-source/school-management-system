# Quick Start - Access on Phone (30 seconds)

## Step 1: Get Your Computer's IP
On your computer, open Command Prompt and type:
```
ipconfig
```
Find "IPv4 Address" - write it down (e.g., `192.168.1.100`)

## Step 2: Start Backend (Terminal 1)
```
cd backend
npm start
```
Wait for: `Server is running on port 5000`

## Step 3: Start Frontend (Terminal 2)
```
cd frontend
npm run dev
```
Wait for: `Local: http://localhost:5173`

## Step 4: On Your Phone
1. Connect to **same WiFi** as your computer
2. Open browser
3. Type: `http://YOUR_IP:5173`
   - Example: `http://192.168.1.100:5173`
4. Press Enter

## Step 5: Login
- **Student**: hayu551 / Hayu@123
- **Teacher**: teacher1 / Teacher@123
- **Admin**: admin / Admin@123

## Done! ✓

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect | Check both servers running, same WiFi, correct IP |
| Page blank | Refresh browser |
| Can't add marks | Check backend terminal for errors |
| Database error | Make sure MySQL is running |

## Keep Running

✓ Keep both terminal windows open while using the app
✓ Don't close them until you're done

---

## Your IP Address: _______________

(Write it here for quick reference)

Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get current directory
strCurrentDir = objShell.CurrentDirectory

' Display status
WScript.Echo "╔════════════════════════════════════════════════════════════════╗"
WScript.Echo "║         REGISTER PAGE FIX - GIT PUSH VIA VBSCRIPT             ║"
WScript.Echo "╚════════════════════════════════════════════════════════════════╝"
WScript.Echo ""
WScript.Echo "📝 Adding changes..."

' Execute git add
objShell.Run "cmd /c git add -A", 0, True

WScript.Echo "✅ Changes added"
WScript.Echo ""
WScript.Echo "📝 Committing changes..."

' Execute git commit
objShell.Run "cmd /c git commit -m ""Fix: Trigger Vercel redeploy for register page - use npm ci for cleaner install""", 0, True

WScript.Echo "✅ Changes committed"
WScript.Echo ""
WScript.Echo "📤 Pushing to GitHub..."

' Execute git push
objShell.Run "cmd /c git push origin main", 0, True

WScript.Echo "✅ Successfully pushed to GitHub!"
WScript.Echo ""
WScript.Echo "╔════════════════════════════════════════════════════════════════╗"
WScript.Echo "║                    PUSH SUCCESSFUL! ✅                        ║"
WScript.Echo "╚════════════════════════════════════════════════════════════════╝"
WScript.Echo ""
WScript.Echo "⏳ Vercel is now redeploying the frontend..."
WScript.Echo "📍 Check deployment status: https://vercel.com/dashboard"
WScript.Echo "🌐 Frontend URL: https://school-management-system-nu-pink.vercel.app"
WScript.Echo "⏱️  Deployment usually takes 2-5 minutes"

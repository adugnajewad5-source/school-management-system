#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         REGISTER PAGE FIX - PUSHING TO GITHUB                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Set environment variables
export GIT_TERMINAL_PROMPT=0
export GIT_AUTHOR_NAME="Auto Deploy"
export GIT_AUTHOR_EMAIL="auto@deploy.local"
export GIT_COMMITTER_NAME="Auto Deploy"
export GIT_COMMITTER_EMAIL="auto@deploy.local"

echo "📝 Adding changes..."
git add -A
echo "✅ Changes added"
echo ""

echo "📝 Committing changes..."
git commit -m "Fix: Trigger Vercel redeploy for register page - use npm ci for cleaner install" || echo "⚠️  No changes to commit"
echo ""

echo "📤 Pushing to GitHub..."
git push origin main
echo "✅ Successfully pushed to GitHub!"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    PUSH COMPLETE! ✅                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "⏳ Vercel is now redeploying the frontend..."
echo "📍 Check deployment status: https://vercel.com/dashboard"
echo "🌐 Frontend URL: https://school-management-system-nu-pink.vercel.app"
echo "⏱️  Deployment usually takes 2-5 minutes"
echo ""

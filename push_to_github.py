#!/usr/bin/env python3
import subprocess
import sys
import os

# Set environment variables to suppress prompts
os.environ['GIT_TERMINAL_PROMPT'] = '0'

def run_command(cmd, description):
    """Run a command and return success status"""
    try:
        print(f"\n📝 {description}...")
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            print(f"✅ {description} completed")
            if result.stdout:
                print(result.stdout)
            return True
        else:
            print(f"❌ Error during {description}")
            if result.stderr:
                print(f"Error: {result.stderr}")
            return False
    except subprocess.TimeoutExpired:
        print(f"❌ {description} timed out")
        return False
    except Exception as e:
        print(f"❌ Exception during {description}: {str(e)}")
        return False

def main():
    print("🚀 Starting automated push to GitHub...\n")
    
    # Check git status
    try:
        result = subprocess.run(
            'git status --porcelain',
            shell=True,
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            if result.stdout.strip():
                print("📊 Changes detected:")
                print(result.stdout)
            else:
                print("✅ No changes to commit")
                return
    except Exception as e:
        print(f"Error checking git status: {str(e)}")
    
    # Add all changes
    if not run_command('git add -A', 'Adding changes'):
        return
    
    # Commit changes
    if not run_command(
        'git commit -m "Fix: Trigger Vercel redeploy for register page - use npm ci for cleaner install"',
        'Committing changes'
    ):
        return
    
    # Push to GitHub
    if not run_command('git push origin main', 'Pushing to GitHub'):
        return
    
    print("\n🎉 Successfully pushed to GitHub!")
    print("⏳ Vercel will automatically redeploy the frontend...")
    print("📍 Check deployment at: https://school-management-system-nu-pink.vercel.app")
    print("⏱️  Deployment usually takes 2-5 minutes")

if __name__ == '__main__':
    main()

@echo off
set GIT_PATH="C:\Program Files\Git\bin\git.exe"
echo Resetting last commit...
%GIT_PATH% reset --soft HEAD~1
echo Done!
pause

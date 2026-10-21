@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js is not installed. Please install Node.js 22 LTS from https://nodejs.org/ and retry.
 pause
 exit /b 1
)
if not exist node_modules (
 echo Installing project dependencies...
 call npm install
 if errorlevel 1 (
   echo Dependency installation failed. Check internet access and npm configuration.
   pause
   exit /b 1
 )
)
if not exist .env.local if exist .env.example copy .env.example .env.local >nul
echo Starting TROLLBELLE at http://localhost:3000
call npm run dev
pause

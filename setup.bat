@echo off
echo --- GStack Antigravity Quick Setup ---
echo.

REM 1. Install dependencies
echo [1/3] Installing NPM dependencies...
call npm install
if %ERRORLEVEL% neq 0 goto error

REM 2. Initialize GStack submodule
echo [2/3] Initializing GStack (this may take a while)...
call git submodule update --init --recursive
if %ERRORLEVEL% neq 0 (
    echo [!] Warning: Git submodule update failed. Checking if gstack folder exists...
    if not exist "gstack\SKILL.md" (
        echo [!] ERROR: GStack not found. Please run: git clone https://github.com/garrytan/gstack.git gstack
        goto error
    )
)

REM 3. Run internal setup
echo [3/3] Running configuration and workflow generation...
node setup.js
if %ERRORLEVEL% neq 0 goto error

echo.
echo --- Setup Successful! ---
echo.
echo Tip: Use "npm run global:install" to use these workflows in all projects.
echo.
pause
exit /b 0

:error
echo.
echo --- Setup Failed! ---
echo Please check the error messages above.
pause
exit /b 1

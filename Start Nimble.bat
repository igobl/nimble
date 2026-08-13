@echo off
cd /d "%~dp0"

echo Starting Nimble...
echo.

where node >nul 2>&1
if errorlevel 1 goto :missing_node
where npm >nul 2>&1
if errorlevel 1 goto :missing_node

echo Installing (this can take a few minutes the first time)...
echo.
call npm install
if errorlevel 1 goto :install_failed

echo.
echo Launching Nimble. A browser window should open at http://localhost:3000
echo Leave this window open while you use the app. Close it when you are finished.
echo.
call npm start
goto :end

:missing_node
echo Nimble needs Node.js to run, and it does not look like it is installed.
echo.
echo 1. Open https://nodejs.org
echo 2. Download the LTS version and install it
echo 3. Double-click this file again
echo.
start https://nodejs.org
goto :end

:install_failed
echo.
echo Something went wrong while installing. Leave this window open and send a screenshot to whoever shared Nimble with you.

:end
echo.
pause

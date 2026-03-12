@echo off
setlocal
echo =======================================================
echo PREPARATION DE L'INSTALLATEUR YOOL STATION AGENT
echo =======================================================
echo.

:: 1. Verification de Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe. Merci de l'installer avant de continuer.
    pause
    exit /b
)

:: 2. Installation des dependances et Build de l'interface
echo 1/2 Installation des composants...
cd /d "%~dp0YOOL_Station_App\yool-station-agent"
call npm install

echo.
echo 2/2 Creation de l'installateur Windows...
call npm run build

echo.
echo =======================================================
echo ✅ SUCCES ! L'installateur a ete cree.
echo Retrouvez le fichier dans :
echo YOOL_Station_App\yool-station-agent\release\
echo =======================================================
echo.
pause

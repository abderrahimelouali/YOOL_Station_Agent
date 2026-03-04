@echo off
setlocal
echo --------------------------------------------------
echo ARRET CIBLE : YOOL STATION AGENT + STATION SERVER
echo (card system backend restera actif)
echo --------------------------------------------------

echo 1. Fermeture de l'Agent UI (Electron)...
taskkill /F /IM electron.exe /T 2>nul

echo 2. Nettoyage du Serveur Local (Port 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo 3. Nettoyage de Vite (Port 5174)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo.
echo ✅ Nettoyage termine. Les processus YOOL Station ont ete arretes.
echo (Si card system backend est sur le port 3001, il n'a pas été touché).
echo.
pause

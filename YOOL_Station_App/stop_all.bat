@echo off
echo Fermeture des processus YOOL Station...

taskkill /F /IM node.exe /T 2>NUL
taskkill /F /IM electron.exe /T 2>NUL

echo Termine.
timeout /t 3 > NUL

@echo off
setlocal
echo --------------------------------------------------
echo ARRET CIBLE : YOOL STATION AGENT + STATION SERVER
echo (Module 1 restera actif)
echo --------------------------------------------------

echo 1. Arret des processus en cours...
powershell -Command "Stop-Process -Name 'electron', 'YOOL Scan Station', 'node' -ErrorAction SilentlyContinue"

echo 2. Nettoyage des ports (3000, 5174)...
powershell -Command "$p3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue; if ($p3000) { Stop-Process -Id $p3000.OwningProcess -Force -ErrorAction SilentlyContinue }; $p5174 = Get-NetTCPConnection -LocalPort 5174 -ErrorAction SilentlyContinue; if ($p5174) { Stop-Process -Id $p5174.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo.
echo ✅ Nettoyage termine. Les processus YOOL Station ont ete arretes.
echo.
pause

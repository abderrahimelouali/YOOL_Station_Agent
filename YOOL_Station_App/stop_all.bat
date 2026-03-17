@echo off
echo Fermeture des processus Agent et Serveur Station...

:: Utilisation de PowerShell pour cibler uniquement les processus liés au projet AgentPost
:: Cela évite de fermer le backend principal (Card System) s'il tourne sur la même machine.
powershell -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*AgentPost*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"

:: On ferme aussi Electron s'il est ouvert
taskkill /F /IM electron.exe /T 2>NUL

echo.
echo Termine. (Le Card System Backend n'a pas ete interrompu).
timeout /t 3 > NUL

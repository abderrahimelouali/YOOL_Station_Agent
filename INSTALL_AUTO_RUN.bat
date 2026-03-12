@echo off
:: Ajout au dossier de demarrage Windows
set "VBS_PATH=%~dp0YOOL_Station_App\silent_launch.vbs"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

echo Creation du lien vers l'agent YOOL...
powershell -Command "$s=(New-Object -COM WScript.Shell).CreateShortcut('%STARTUP_FOLDER%\YOOL_Station.lnk');$s.TargetPath='%VBS_PATH%';$s.WorkingDirectory='%~dp0YOOL_Station_App';$s.Save()"

echo.
echo ✅ Configuration terminee !
echo L'Agent YOOL se lancera automatiquement a chaque demarrage de Windows.
echo.
pause

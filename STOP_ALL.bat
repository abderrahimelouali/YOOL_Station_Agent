@echo off
:: Arret de tous les processus YOOL
cd /d "%~dp0YOOL_Station_App"
call stop_all.bat
exit

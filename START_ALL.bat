@echo off
:: Lancement du YOOL Station Agent via VBS (Mode Silencieux)
cd /d "%~dp0YOOL_Station_App"
start silent_launch.vbs
exit

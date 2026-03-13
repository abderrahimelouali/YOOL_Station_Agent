@echo off
setlocal
echo =======================================================
echo CONFIGURATION DE LA BASE DE DONNEES YOOL
echo =======================================================
echo.

:: Verification de MySQL
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] MySQL n'est pas installe ou n'est pas dans le PATH.
    echo Merci d'installer MySQL 8.0 avant de continuer.
    pause
    exit /b
)

echo Entrez vos identifiants MySQL pour creer la base de donnees :
set /p MYSQL_USER="Utilisateur (ex: root) : "
set /p MYSQL_PASS="Mot de passe : "

echo.
echo Creation de la base de donnees et des tables...
mysql -u%MYSQL_USER% -p%MYSQL_PASS% < "%~dp0database\setup_database.sql"

if %errorlevel% neq 0 (
    echo.
    echo [ERREUR] Impossible de creer la base de donnees. 
    echo Verifiez vos identifiants ou si la base existe deja.
) else (
    echo.
    echo ✅ Base de donnees 'yool_station_agent' cree avec succes !
)

echo.
pause

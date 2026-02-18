# start.ps1
# Automise le lancement séparé du Serveur et de l'Agent pour YOOL Station

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $PSScriptRoot

Write-Host "--- DÉMARRAGE YOOL STATION (MODE SÉPARÉ) ---" -ForegroundColor Cyan

# 1. Démarrer le Serveur Backend
Write-Host "[1/3] Lancement du Serveur sur le port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\yool-station-server'; npm start" -WindowStyle Normal

# 2. Démarrer le Serveur Vite (Indispensable pour l'UI en dev)
Write-Host "[2/3] Lancement de Vite (Port 5174)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\yool-station-agent'; npx vite" -WindowStyle Normal

# Attendre que Vite soit prêt (4s)
Start-Sleep -Seconds 4

# 3. Démarrer l'Agent Electron
Write-Host "[3/3] Lancement de l'Agent UI (Electron)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\yool-station-agent'; npm start" -WindowStyle Normal

Write-Host "--------------------------------------------" -ForegroundColor Cyan
Write-Host "Les trois composants sont lancés (Serveur, Vite, Electron)."

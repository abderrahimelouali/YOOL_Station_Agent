# YOOL Station Agent - Installation Script
# Run as Administrator

Write-Host ">>> Installation YOOL Station Agent..." -ForegroundColor Cyan

# 1. Vérification Node.js
try {
    $nodeVersion = node -v
    Write-Host "Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Error "Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
}

# 2. Installation Dépendances Serveur
Write-Host ">>> Installation dépendances Serveur..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot/../../yool-station-server"
if (!(Test-Path "package.json")) {
    Write-Error "Impossible de trouver le dossier serveur."
    exit 1
}
npm install
Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue

# 3. Installation Dépendances Client
Write-Host ">>> Installation dépendances Client..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot/.."
if (!(Test-Path "package.json")) {
    Write-Error "Impossible de trouver le dossier client."
    exit 1
}
npm install
Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue

# 4. Build Client
Write-Host ">>> Compilation Client..." -ForegroundColor Yellow
npm run build

Write-Host ">>> Installation terminée!" -ForegroundColor Green
Write-Host "Pour démarrer:"
Write-Host "1. Lancer la Base de données (importez schema.sql)"
Write-Host "2. Serveur: cd yool-station-server; npm start"
Write-Host "3. Client: cd yool-station-agent; npm start"

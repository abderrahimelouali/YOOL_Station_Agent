# YOOL Station Agent

Système de contrôle d'accès pour postes informatiques via cartes YOOL.

## Structure
- **yool-station-agent/**: Application Electron (Client)
- **yool-station-server/**: API Node.js/Express (Serveur)
- **database/**: Schéma SQL

## Prérequis
- Node.js (v16+)
- MySQL
- Windows 10/11 (pour le client)

## Démarrage Rapide

### 1. Base de données
Créez une base de données MySQL et importez le schéma :
```bash
mysql -u root -p yool_station_db < database/schema.sql
```

### 2. Configuration
Copiez les fichiers `.env.example` en `.env` dans `yool-station-server` et `yool-station-agent` et ajustez les variables (DB users, IPs).

### 3. Installation
Exécutez le script d'installation (PowerShell) :
```powershell
./yool-station-agent/installer/install.ps1
```

Ou manuellement :
```bash
# Serveur
cd yool-station-server
npm install

# Client
cd yool-station-agent
npm install
```

### 4. Lancement
**Serveur :**
```bash
cd yool-station-server
npm run dev
```

**Client :**
```bash
cd yool-station-agent
npm run dev
```

## Utilisation
- Le client démarre en plein écran (verrouillé).
- **Simulation de scan** : Appuyez sur `Entrée` pour simuler le scan d'une carte valide.

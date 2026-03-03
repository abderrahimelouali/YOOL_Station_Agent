# 🛠️ Documentation Technique - YOOL Station Agent

Ce dossier contient une version portable et optimisée pour la production (Kiosk) de la YOOL Station.

## 📋 Prérequis
- **Node.js** (v18+) installé sur la machine.
- **MySQL** (via XAMPP ou installation directe).
- Une base de données nommée `yool_station_agent`.

## ⚙️ Installation & Configuration

### 1. Variables d'Environnement
Vérifiez les fichiers `.env` aux emplacements suivants :
- **Serveur** : `.ps1/yool-station-server/.env`
- **Agent UI** : `.ps1/yool-station-agent/renderer/.env`

Assurez-vous que les ports (3000, 3001, 8000) correspondent à votre environnement.

### 2. Base de Données
Importez ou créez les tables suivantes (voir [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)) :
- `stations` : Liste des PC agents.
- `sessions` : Historique des connexions.
- `station_logs` : Événements techniques.
- `used_jtis` : Sécurité anti-rejeu SSO (Détails complets dans [SSO_TECHNICAL_V3.md](./docs/SSO_TECHNICAL_V3.md)).

## 🚀 Utilisation (Mode Production)

### Lancement Silencieux
Double-cliquez sur **`silent_launch.vbs`**. 
- Aucune fenêtre terminal n'apparaîtra.
- L'application se lancera en plein écran (Kiosk).

### Mode Développeur
Double-cliquez sur **`start.ps1`** pour voir la console et déboguer les erreurs.

### Arrêter le système
Comme le serveur tourne en arrière-plan, utilisez le script :
👉 **`stop_all.bat`** (Arrête l'Agent, le Serveur et Vite proprement).

---
*Documentation générée pour l'équipe YOOL - 2024*

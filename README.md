# YOOL Station Agent 💎🚀

[![Project Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen)](https://github.com/abderrahimelouali/YOOL_Station_Agent)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](https://github.com/abderrahimelouali/YOOL_Station_Agent)

**YOOL Station Agent** est une solution logicielle robuste pour la gestion des stations de scan de cartes (RFID/QR), conçue pour le contrôle d'accès dans un environnement kiosque hautement sécurisé.

---

## 🚀 Guide d'Installation Rapide

Pour une installation pas à pas, veuillez consulter notre nouveau guide :
👉 **[SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)**

---

## 📁 Structure du Projet

```bash
├── YOOL_Station_App/     # Branche principale de développement
│   ├── yool-station-agent # Client Electron
│   ├── yool-station-server # Backend API
│   └── silent_launch.vbs  # Lancement silencieux (Auto-run)
├── docs/                 # Documentation technique unifiée
│   ├── SETUP_GUIDE.md       # Installation et configuration
│   ├── DOCUMENTATION.md     # Architecture, API, BDD et Sécurité
│   └── SSO_TECHNICAL_V3.md  # Détails techniques SSO & JWT
├── database/             # Schémas SQL
│   └── setup_database.sql   # Script d'initialisation automatique
```

---

## 🚀 Démarrage

### 1. Installation des Dépendances
Naviguez dans les dossiers `YOOL_Station_App/yool-station-agent` et `YOOL_Station_App/yool-station-server` et exécutez :
```bash
npm install
npm audit fix
```

### 2. Base de Données
Initialisez votre base de données avec le script :
`database/setup_database.sql`

---

## 🛠️ Maintenance & Sécurité

- **Démarrage Rapide** : Double-cliquez sur `YOOL_Station_App/silent_launch.vbs` pour tout lancer en arrière-plan.
### 6. Arrêt du Projet
Pour tout arrêter en un seul clic, **double-cliquez** sur le fichier `stop_all.bat` situé dans le dossier `YOOL_Station_App/`.
- **Auto-Start** : Voir [DOCUMENTATION.md](./docs/DOCUMENTATION.md) pour configurer le démarrage automatique avec Windows.
- **Logs** : Les logs du serveur sont disponibles dans `YOOL_Station_App/yool-station-server/logs/`.

---
*Fait avec ❤️ pour une expérience utilisateur sans faille.*

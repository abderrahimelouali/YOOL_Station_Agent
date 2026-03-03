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
│   └── silent_launch.vbs  # Lancement silencieux
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
Naviguez dans les dossiers `.ps1/yool-station-agent` et `.ps1/yool-station-server` et exécutez :
```bash
npm install
npm audit fix
```

### 2. Base de Données
Initialisez votre base de données avec le script :
`database/setup_database.sql`

---

## 🛠️ Maintenance & Sécurité

- **Arrêt Propre** : Utilisez le script `stopall.bat` à la racine pour fermer les processus proprement.
- **Auto-Start** : Voir [TECHNICAL_DEPLOYMENT.md](./docs/TECHNICAL_DEPLOYMENT.md) pour configurer le démarrage automatique avec Windows.
- **Logs** : Les logs du serveur sont disponibles dans le dossier `logs/` généré à la racine du serveur.

---
*Fait avec ❤️ pour une expérience utilisateur sans faille.*

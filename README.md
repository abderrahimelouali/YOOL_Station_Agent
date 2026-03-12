# YOOL Station Agent 💎🚀

**YOOL Station Agent** est une solution complète pour la gestion des stations de scan (RFID/QR), conçue pour le contrôle d'accès sécurisé en mode Kiosk.

---

## 📁 Structure du Projet

```bash
├── YOOL_Station_App/     # Cœur de l'application (Agent + Serveur Proxy)
│   ├── yool-station-agent/ # Frontend Electron (React + Vite)
│   ├── yool-station-server/# Backend Proxy Node.js (MySQL)
│   ├── silent_launch.vbs   # Script de lancement silencieux
│   └── stop_all.bat        # Script d'arrêt propre
├── database/             # Schémas SQL et scripts de configuration
└── docs/                 # Guides techniques détaillés
    ├── DOCUMENTATION.md      # Architecture & Sécurité
    ├── SETUP_GUIDE.md        # Guide d'installation complet
    └── TECHNICAL_DEPLOYMENT.md # Déploiement Production / Kiosk
```

---

## 🚀 Actions Rapides (Racine)

Pour simplifier l'utilisation quotidienne, utilisez les scripts situés à la racine du projet :

1.  **`START_ALL.bat`** : Double-cliquez pour lancer le serveur et l'agent en mode silencieux (via VBS).
2.  **`STOP_ALL.bat`** : Double-cliquez pour arrêter tous les processus YOOL (Agent + Serveur).
3.  **`INSTALL_AUTO_RUN.bat`** : Configure Windows pour lancer l'application automatiquement au démarrage.

👉 **[SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)** | **[TECHNICAL_DEPLOYMENT.md](./docs/TECHNICAL_DEPLOYMENT.md)** | **[CAHIER_DES_CHARGES_MODULE2.md](./docs/CAHIER_DES_CHARGES_MODULE2.md)** | **[CAHIER_DES_CHARGES_MODULE6.md](./docs/CAHIER_DES_CHARGES_MODULE6.md)** | **[DOCUMENTATION.md](./docs/DOCUMENTATION.md)**

---

## 🛠️ Maintenance & Sécurité

- **Vérification** : L'agent station communique avec le **Card System** (Backend Principal) via le proxy local.
- **Accès Refusé ?** : Assurez-vous que le `CARD_SYSTEM_SECRET` dans `YOOL_Station_App/yool-station-server/.env` correspond exactement au `AGENT_KEY` du Card System.
- **Kiosk Mode** : L'application Electron est configurée pour verrouiller Windows et empêcher l'utilisation d'autres applications pendant la session.

---
*Fait avec ❤️ pour une expérience utilisateur sécurisée.*

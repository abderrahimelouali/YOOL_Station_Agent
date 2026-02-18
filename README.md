# YOOL Station Agent 💎🚀

[![Project Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen)](https://github.com/abderrahimelouali/YOOL_Station_Agent)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](https://github.com/abderrahimelouali/YOOL_Station_Agent)

**YOOL Station Agent** est une solution logicielle robuste pour la gestion des stations de scan de cartes (RFID/QR), conçue pour le contrôle d'accès dans un environnement kiosque hautement sécurisé.

---

## 🌟 Points Forts

- **Total Kiosk Experience** : Verrouillage complet de Windows (Kiosk mode, Fullscreen, Blocage des raccourcis Alt+F4, Alt+Tab, Touche Windows).
- **Dual-Branch Architecture** : 
  - **`/exe`** : Version prête pour la production avec installation optimisée.
  - **`/.ps1`** : Version pour le développement et l'automatisation avancée.
- **Smart Focus** : Système de redirection intelligente du focus pour les douchettes de scan externes.
- **SSO Intégré** : Authentification fluide via JWT avec protection anti-replay complète (JTI).
- **Docker-Ready** : Backend et base de données isolés via Docker pour un déploiement éclair.
- **Design Premium** : Interface moderne, minimalist et responsive (React + Vite).

---

## 📁 Structure du Projet

```bash
├── exe/                  # Branche de production principale
│   ├── build_ui/         # Frontend compilé (Vite)
│   ├── release/          # Exécutables et Installeurs (win-unpacked)
│   ├── main/             # Processus Electron (Système)
│   └── stop_all.bat      # Script de nettoyage des processus
├── .ps1/                 # Branche de développement (Automatisation)
├── docs/                 # Documentation technique détaillée
│   ├── TECHNICAL_DEPLOYMENT.md
│   ├── DOCKER_GUIDE.md
│   ├── SSO_TECHNICAL_V3.md
│   └── ...
├── database/             # Schémas SQL et exemples
└── docker-compose.yml    # Orchestration Backend + MySQL
```

---

## 🚀 Démarrage Rapide

### 1. Backend (Docker)
Assurez-vous d'avoir Docker installé, puis :
```powershell
docker-compose up -d
```

### 2. Agent Station (Production)
Allez dans le dossier `exe/yool-station-agent` et lancez le build :
```powershell
npm run build
```
L'application prête à l'emploi se trouvera dans `release/win-unpacked/YOOL Scan Station.exe`.

---

## 🛠️ Maintenance & Sécurité

- **Arrêt Propre** : Utilisez toujours le script `stop_all.bat` dans le dossier `/exe` pour fermer l'agent et le serveur proprement.
- **Auto-Start** : Voir [TECHNICAL_DEPLOYMENT.md](./docs/TECHNICAL_DEPLOYMENT.md) pour configurer le démarrage automatique avec Windows.
- **Logs** : Les logs du serveur sont disponibles dans le dossier `logs/` généré à la racine du serveur.

---
*Fait avec ❤️ pour une expérience utilisateur sans faille.*

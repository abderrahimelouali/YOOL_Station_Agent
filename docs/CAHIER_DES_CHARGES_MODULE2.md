# Cahier des charges – Module 2
## Agent de contrôle des postes (YOOL Station Agent)

### 1. Contexte & objectif
Dans le cadre des YOOL Workspaces, chaque ordinateur doit être utilisé uniquement par un étudiant disposant d’une YOOL Card valide.
Ce module consiste à développer un agent logiciel (programme léger) qui tourne sur chaque poste du workspace et qui :
- Affiche un écran de connexion pour l’étudiant.
- Valide la carte via l’API du Card System (Module 1).
- Autorise ou bloque l’accès au poste selon la validité de la carte.
- Appelle le service SSO (Module 6) pour le déverrouillage de la session web.
- Remonte les informations d’utilisation vers le serveur central.

---

### 2. Fonctionnalités & État de Conformité

| Exigence | État | Détails de l'implémentation |
| :--- | :---: | :--- |
| **Interface de Connexion** | ✅ | Application Electron.js avec écran de verrouillage plein écran. |
| **Validation de Carte** | ✅ | Proxy local relayant vers `POST /cards/verify` du Card System. |
| **Messages d'Erreur** | ✅ | Alertes spécifiques pour cartes expirées, suspendues ou inconnues. |
| **Verrouillage Automatique** | ✅ | Inactivité configurable (VITE_INACTIVITY_TIMEOUT) + Détection déverrouillage Electron. |
| **Intégration SSO** | ✅ | Utilise le **Module 6** pour la génération de jetons d'accès plateforme. |
| **Enregistrement des Sessions** | ✅ | API `POST /sessions/start` et `/sessions/end` avec UUID unique. |
| **Remontée des Logs** | ✅ | Endpoint `POST /stations/logs` pour historique d'audit. |
| **Auto-lancement** | ✅ | Script d'installation `INSTALL_AUTO_RUN.bat` (Shortcut Windows Startup). |
| **Compatibilité Windows 10** | ✅ | Testé et optimisé pour Windows 10 Kiosk. |
| **Sécurité (HTTPS/JWT)** | ✅ | JWT court (60s) avec anti-replay (JTI) + Secret partagé backend. |

---

### 3. Architecture Technique
- **Client** : Electron.js (UI React + Vite).
- **Serveur Proxy** : Node.js / Express.
- **Base de Données local** : MySQL (Tables `stations`, `sessions`, `station_logs`, `used_jtis`).
- **Communication** : REST API / JSON sécurisé par secret.

### 4. Livrables Inclus
- **Code Source** : Dépôts synchronisés sur GitHub.
- **Schéma BDD** : [setup_database.sql](../database/setup_database.sql)
- **Docs Techniques** : [DOCUMENTATION.md](DOCUMENTATION.md) et [TECHNICAL_DEPLOYMENT.md](TECHNICAL_DEPLOYMENT.md).
- **Scripts d'Installation** : Scripts `.bat` à la racine pour le démarrage et l'arrêt.

---
*Ce document sert de base pour la validation finale par le Tech Leader.*

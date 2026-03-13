# Guide de Déploiement Technique - YOOL Station Agent

Ce document détaille les étapes nécessaires pour déployer le système **YOOL Station Agent** dans un environnement de production (Kiosk Windows 10).

---

## 🏗️ 1. Prérequis Serveur (Local ou Central)
Le **Station Server** agit comme un proxy sécurisé. Il doit être installé sur une machine accessible par toutes les stations.

- **Runtime** : Node.js v16.x ou supérieur.
- **Base de données** : MySQL 8.0+.
- **Windows** : Le **Mode Développeur** doit être activé dans les paramètres système pour permettre la création de liens symboliques et l'accès aux APIs natives lors du build.
- **Dépendances** : `npm install` dans le dossier `YOOL_Station_App/yool-station-server`.

### Configuration de la Base de Données
1. Exécutez le script `database/setup_database.sql` pour créer la base `yool_station_db`.
2. Assurez-vous que l'utilisateur MySQL a les droits `SELECT`, `INSERT`, `UPDATE` sur cette base.

### Variables d'Environnement (`.env`)
```env
PORT=3000
DB_HOST=localhost
DB_USER=votre_user
DB_PASSWORD=votre_password
DB_NAME=yool_station_db

# Synchronisation avec le Card System
CARD_SYSTEM_API_URL=https://votre-backend-principal.com/api
CARD_SYSTEM_SECRET=votre_cle_partagee_securisee

# SSO & Securité
JWT_SECRET=votre_secret_jwt_robuste
JWT_AUDIENCE=yool-platform
PLATFORM_LOGOUT_URL=https://votre-plateforme.com/api/sso/logout
```

---

## 💻 2. Déploiement des Stations (Postes Clients)
Chaque poste doit être configuré individuellement pour garantir l'isolation et la sécurité.

- **OS** : Windows 10 (Recommandé).
- **Mode Kiosk** : L'agent Electron se lance en plein écran et verrouille les raccourcis système.
- **Génération Build** : Utilisation du script simplifié pour créer l'installateur.
- **Auto-Run** : Utilisation du script automatisé.

### Étapes d'installation sur chaque poste :
1. Copiez le dossier `YOOL_Station_App` sur le disque local (ex: `C:\YOOL_Station`).
2. Configurez le fichier `.env` de l'agent dans `YOOL_Station_App/yool-station-agent/renderer/.env` :
   - `VITE_STATION_ID` : Nom unique du poste (ex: `POSTE-01`).
   - `VITE_AGENT_KEY` : Clé secrète de la station (sera hashée en BDD lors du premier lancement).
   - `VITE_SERVER_URL` : URL du Station Server configuré à l'étape 1.

3. **Génération de l'Installateur** :
   - Double-cliquez sur **`PREPARE_INSTALLER.bat`** à la racine pour générer l'exécutable Windows.
   - Le fichier `.exe` sera créé dans `YOOL_Station_App/yool-station-agent/release/`.

> [!WARNING]
> Toute modification du code source ou des fichiers de configuration nécessite une nouvelle exécution de **`PREPARE_INSTALLER.bat`** pour être prise en compte dans l'agent installé.

4. **Lancement Automatisé** :
   - Double-cliquez sur **`INSTALL_AUTO_RUN.bat`** à la racine pour ajouter l'agent au démarrage de Windows.

---

## 🛡️ 3. Sécurisation Kiosk
Pour transformer le PC en véritable borne interactive :
1. **Verrouillage Système** : Dans `YOOL_Station_App/yool-station-agent/main/index.js`, assurez-vous que les options `kiosk: true` et le blocage des touches (`Alt+Tab`, `Alt+F4`) sont activés.
2. **Utilisateur Dédié** : Il est recommandé de créer un utilisateur Windows standard (non-admin) sans mot de passe pour le lancement automatique.

---

## 🔄 4. Maintenance & Logs
- **Logs Serveur** : Situés dans `YOOL_Station_App/yool-station-server/logs/` (si activés) ou via la table `station_logs`.
- **Arrêt d'urgence** : Utilisez `STOP_ALL.bat` à la racine pour fermer tous les processus.
- **Mise à jour** : Un `git pull` suivi d'un redémarrage des services suffit généralement.

---
*Document technique - Équipe YOOL Card System*

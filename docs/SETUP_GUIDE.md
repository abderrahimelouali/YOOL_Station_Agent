# Guide de Configuration Rapide - YOOL Station 🚀

Ce guide vous explique comment configurer et lancer le projet **AgentPost** étape par étape.

---

## 📋 Prérequis

- [Node.js](https://nodejs.org/) (version 16+)
- [MySQL](https://www.mysql.com/) ou [MariaDB](https://mariadb.org/)
- [Git](https://git-scm.com/) (pour cloner le projet)

---

## 🚀 Étapes d'Installation

### 1. Cloner le Projet
```bash
git clone https://github.com/votre-user/YOOL_Station_Agent.git
cd YOOL_Station_Agent
```

### 2. Installer les Dépendances

1. Naviguez dans le dossier `YOOL_Station_App`.
2. Installez les dépendances pour chaque composant :

**Pour l'Agent (UI) :**
```bash
cd yool-station-agent
npm install
npm audit fix
```

> [!TIP]
> `npm audit fix` met à jour vos dépendances pour corriger les failles de sécurité connues sans casser votre code.

**Pour le Serveur (Backend) :**
```bash
cd ../yool-station-server
npm install
npm audit fix
```

### 3. Configuration de l'Environnement
Copiez le fichier d'exemple dans chaque dossier pour créer votre propre configuration :

**Backend (Station Server)**
1. Naviguez vers `YOOL_Station_App/yool-station-server`.
2. Copiez `.env.example` en `.env`.

**Frontend (Station Agent)**
1. Naviguez vers `YOOL_Station_App/yool-station-agent`.
2. Copiez `.env.example` en `.env`.

Modifiez ces fichiers `.env` avec vos accès base de données et clés secrètes.

### 4. Initialisation de la Base de Données
Exécutez le script SQL fourni dans votre client MySQL (ex: phpMyAdmin, MySQL Workbench) :

**Fichier :** `database/setup_database.sql`

Ce script va :
1. Créer la base `yool_station_db`.
2. Créer toutes les tables nécessaires (`stations`, `sessions`, `station_logs`).

### 5. Lancement du Projet

Vous avez trois options pour lancer le projet :

- **Option A (Développement)** :
  Lancez `npm run dev` dans chaque dossier.
- **Option B (Automatisation)** :
  Lancez `./YOOL_Station_App/start.ps1` via PowerShell.
- **Option C (Mode Silencieux)** :
  Créez un raccourci vers `YOOL_Station_App/silent_launch.vbs` (situé dans le dossier `YOOL_Station_App`) et déposez-le dans ce dossier.

---

## 🛠️ Aide & Support
Pour plus de détails techniques, consultez le dossier `docs/` ou contactez l'équipe **YOOL**.

# YOOL Station Agent - Guide de Configuration 💎🚀

Ce guide détaille les étapes manuelles d'installation et de lancement pour l'environnement de développement ou de production.

---

## 📋 Étape 1 : Prérequis
1.  **Node.js (LTS)**
2.  **MySQL (XAMPP ou programme similaire)**

---

## 🏁 Étape 2 : Serveur & Base de Données

1.  **Cloner le projet** :
    ```bash
    git clone [URL_DU_DEPOT]
    cd AgentPost
    ```

2.  **Installer les composants du Serveur** :
    ```bash
    cd YOOL_Station_App/yool-station-server
    npm i
    npm audit fix # Exécuter en cas de failles signalées
    ```

3.  **Création de la Base de Données** :
    - Lancez **XAMPP** (Apache et MySQL).
    - Ouvrez **phpMyAdmin** dans votre navigateur.
    - Créez une nouvelle base de données nommée `yool_station_agent`.
    - Allez dans l'onglet **SQL**, copiez tout le contenu du fichier `database/setup_database.sql` du projet, collez-le, et cliquez sur **Exécuter**.

4.  **Configuration Serveur (.env)** :
    - Dans le dossier `yool-station-server`, copiez (ou renommez) le fichier `.env.example` en **`.env`**.
    - Modifiez le fichier `.env` pour y insérer vos paramètres MySQL (`DB_USER`, `DB_PASSWORD`).

---

## 💻 Étape 3 : Installation de l'Agent

1.  **Installer les composants de l'Agent** :
    ```bash
    cd ../yool-station-agent
    npm i
    npm audit fix # Exécuter si nécessaire
    ```

2.  **Configuration Agent (.env)** :
    - Dans le dossier `yool-station-agent/renderer/`, copiez le fichier `.env.example` en **`.env`**.
    - Modifiez `VITE_STATION_ID` si besoin.

---

## 🚀 Étape 4 : Lancement en mode DEV (Test)

Pour vérifier que tout fonctionne avant de compiler :
Ouvrez **deux terminaux** différents.

**Terminal 1 (Serveur)** :
```bash
cd YOOL_Station_App/yool-station-server
npm run dev
```

**Terminal 2 (Agent)** :
```bash
cd YOOL_Station_App/yool-station-agent
npm run dev
```

---

## 🛠️ Étape 5 : Création du programme final (.exe)

**Avant de commencer** : Activez impérativement le **Mode Développeur** dans Windows (`Paramètres > Mise à jour et sécurité > Pour les développeurs`).

Pour générer le fichier exécutable qui sera installé sur les stations :
```bash
cd YOOL_Station_App/yool-station-agent
npm run build
```
L'installateur final **`.exe`** sera généré et disponible dans le dossier : `YOOL_Station_App/yool-station-agent/release/`.

---
*Fait avec ❤️ pour le projet YOOL Card System.*

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
    git clone https://github.com/abderrahimlouali/YOOL_Station_Agent.git
    cd YOOL_Station_Agent
    ```

2.  **Installer les composants du Serveur** :
    ```bash
    cd YOOL_Station_App/server
    npm i
    npm audit fix # Exécuter en cas de failles signalées
    ```

3.  **Création de la Base de Données** :
    - Lancez **XAMPP** (Apache et MySQL).
    - Ouvrez **phpMyAdmin** dans votre navigateur.
    - Créez une nouvelle base de données nommée `yool_station_agent`.
    - Allez dans l'onglet **SQL**, copiez tout le contenu du fichier `database/setup_database.sql` du projet, collez-le, et cliquez sur **Exécuter**.

4.  **Configuration Serveur (.env)** :
    - Dans le dossier `YOOL_Station_App/server`, copiez le fichier `.env.example` et renommez la copie en **`.env`**.
    - Modifiez le fichier `.env` pour y insérer vos **variables principales** :
      * `DB_USER` et `DB_PASSWORD` : Identifiants de votre base de données locale (souvent `root` et vide sur XAMPP).
      * `CARD_SYSTEM_API_URL` : URL de l'API centrale (ex: `http://127.0.0.1:3001/api`).
      * `STATION_KEY` : Le mot de passe réseau (doit être identique au backend principal).

---

## 💻 Étape 3 : Installation de l'Agent

1.  **Installer les composants de l'Agent** :
    ```bash
    cd ../agent
    npm i
    npm audit fix # Exécuter si nécessaire
    ```

2.  **Configuration Agent (.env)** :
    - Dans le dossier `YOOL_Station_App/agent/renderer/`, copiez le fichier `.env.example` et renommez la copie en **`.env`**.
    - Modifiez vos **variables principales** :
      * `VITE_STATION_ID` : L'identifiant physique de cette machine (ex: `STATION_0001`).
      * `VITE_STATION_KEY` : La clé locale de sécurité de cette machine.

---

## 🚀 Étape 4 : Lancement en mode DEV (Test)

Pour vérifier que tout fonctionne avant de compiler :
Ouvrez **deux terminaux** différents.

**Terminal 1 (Serveur)** :
```bash
cd YOOL_Station_App/server
npm run dev
```

**Terminal 2 (Agent)** :
```bash
cd YOOL_Station_App/agent
npm run dev
```

### 👻 Option 2 : Lancement Silencieux (VBS)
Si vous ne voulez pas garder de terminaux ouverts, vous pouvez lancer l'Agent et le Serveur en arrière-plan :
- Double-cliquez sur le fichier `YOOL_Station_App/silent_launch.vbs`.
*(Pour les arrêter, double-cliquez sur `YOOL_Station_App/stop_all.bat` ou tapez `taskkill /F /IM node.exe` dans un terminal).*

---

## 🛠️ Étape 5 : Création du programme final (.exe)

**Avant de commencer** : Activez impérativement le **Mode Développeur** dans Windows (`Paramètres > Mise à jour et sécurité > Pour les développeurs`).

Pour générer le fichier exécutable qui sera installé sur les stations :
```bash
cd YOOL_Station_App/agent
npm run build
```
L'installateur final **`.exe`** sera généré et disponible dans le dossier : `YOOL_Station_App/agent/release/`.

---
*Fait avec ❤️ pour le projet YOOL Card System.*

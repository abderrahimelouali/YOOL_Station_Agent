# YOOL Station Agent - Guide de Configuration 💎🚀

Ce guide vous explique comment installer et lancer la station **YOOL** étape par étape.

---

## 📋 Étape 1 : Prérequis
Assurez-vous d'avoir installé :
1.  **Node.js (LTS)** : [Lien de téléchargement](https://nodejs.org/)
2.  **MySQL (XAMPP ou autre)** : [Lien de téléchargement](https://www.apachefriends.org/fr/index.html)

---

## 🏁 Étape 2 : Installation
Ouvrez un terminal et suivez ces commandes :

1.  **Cloner le projet** :
    ```bash
    git clone [URL_DU_DEPOT]
    cd AgentPost
    ```

2.  **Installer les composants** :
    ```bash
    # Installer le serveur
    cd YOOL_Station_App/yool-station-server
    npm install

    # Installer l'agent
    cd ../yool-station-agent
    npm install
    ```

---

## 🗄️ Étape 3 : Base de Données
1.  Lancez **XAMPP** (ou votre outil MySQL) et allez sur **phpMyAdmin**.
2.  Créez une base de données nommée `yool_station_agent`.
3.  Ouvrez le fichier `database/setup_database.sql` (dans le dossier du projet).
4.  Copiez tout le contenu et collez-le dans l'onglet **SQL** de phpMyAdmin, puis cliquez sur **Exécuter**.

---

## ⚙️ Étape 4 : Configuration (.env)
Vérifiez ces deux fichiers avec un éditeur de texte :

1.  **Serveur** (`YOOL_Station_App/yool-station-server/.env`) : Configurez `DB_USER`, `DB_PASSWORD` et `CARD_SYSTEM_API_URL`.
2.  **Agent** (`YOOL_Station_App/yool-station-agent/renderer/.env`) : Modifiez `VITE_STATION_ID` (ex: POSTE-01).

---

## 🛠️ Étape 5 : Lancement et Build
### Mode Test (Développement)
Pour tester si tout fonctionne sans erreur :
```bash
# Dans le dossier yool-station-server
npm run dev

# Dans le dossier yool-station-agent
npm run dev
```

### Création du programme (.exe)
**Avant de commencer** : Activez le **Mode Développeur** dans Windows (`Paramètres > Mise à jour et sécurité > Pour les développeurs`).

Pour générer le fichier exécutable final :
```bash
cd YOOL_Station_App/yool-station-agent
npm run build
```
Le fichier **`.exe`** sera disponible dans : `YOOL_Station_App/yool-station-agent/release/`.

---
*Fait avec ❤️ pour le projet YOOL Card System.*

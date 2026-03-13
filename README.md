# YOOL Station Agent - Guide de Lancement Rapide 💎🚀

Ce guide est conçu pour vous aider à installer et lancer la station **YOOL** en 5 étapes simples, sans avoir besoin de connaissances en programmation.

---

## 📋 Étape 1 : Prérequis (À faire une fois)
Assurez-vous que ces deux programmes sont installés sur votre ordinateur :
1.  **Node.js (v18+)** : [Télécharger ici](https://nodejs.org/) (Prendre la version "LTS").
2.  **MySQL (v8.0+)** : [Télécharger ici](https://dev.mysql.com/downloads/installer/).
3.  **Mode Développeur Windows** : Allez dans `Paramètres > Mise à jour et sécurité > Pour les développeurs` et activez le **Mode développeur**.

---

## 🗄️ Étape 2 : Configurer la Base de Données
1.  Double-cliquez sur **`SETUP_DATABASE.bat`** à la racine de ce dossier.
2.  Entrez votre nom d'utilisateur et mot de passe MySQL (généralement `root`).
3.  Le script va créer automatiquement toutes les tables nécessaires.

---

## ⚙️ Étape 3 : Configuration Rapide (.env)
Avant de lancer, vérifiez ces deux fichiers avec le Bloc-notes :

1.  **Le Serveur** (`YOOL_Station_App/yool-station-server/.env`) :
    - Remplissez `DB_USER` et `DB_PASSWORD` avec vos codes MySQL.
    - Vérifiez que `CARD_SYSTEM_API_URL` pointe bien vers votre Backend principal.

2.  **L'Agent** (`YOOL_Station_App/yool-station-agent/renderer/.env`) :
    - Donnez un nom à votre poste (`VITE_STATION_ID`).

---

## 🛠️ Étape 4 : Préparer l'Application
Pour créer le programme final pour Windows :
1.  Double-cliquez sur **`PREPARE_INSTALLER.bat`** à la racine.
2.  Attendez quelques minutes. Un fichier **`.exe`** sera créé.
3.  Vous pouvez trouver l'installateur dans : `YOOL_Station_App/yool-station-agent/release/`.

> [!IMPORTANT]
> **Important** : Si vous modifiez le code ou le fichier `.env`, vous devez impérativement relancer **`PREPARE_INSTALLER.bat`** pour mettre à jour votre fichier `.exe`.

---

## 🚀 Étape 5 : Lancer et Travailler
Une fois installé :
- **Pour démarrer** : Double-cliquez sur **`START_ALL.bat`**. Le serveur et l'agent se lancent tout seuls.
- **Pour arrêter** : Double-cliquez sur **`STOP_ALL.bat`**.
- **Lancement automatique** : Double-cliquez sur **`INSTALL_AUTO_RUN.bat`** pour que l'app se lance toute seule à chaque démarrage du PC.

---

## 📚 Liens Utiles (Pour les Experts)
- [Guide de Déploiement Kiosk](./docs/TECHNICAL_DEPLOYMENT.md)
- [Documentation Technique Complète](./docs/DOCUMENTATION.md)
- [Cahier des Charges Module 2](./docs/CAHIER_DES_CHARGES_MODULE2.md)

---
*Fait avec ❤️ pour une gestion client simplifiée.*

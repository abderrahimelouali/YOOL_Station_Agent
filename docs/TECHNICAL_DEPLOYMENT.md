# Guide de Déploiement Technique - YOOL Station Agent

Ce document détaille les étapes techniques pour déployer la station de travail.

## 1. Installation Serveur
Le serveur agit comme un proxy sécurisé entre l'agent et le Card System.

1.  Allez dans `YOOL_Station_App/server`.
2.  Exécutez `npm install`.
3.  Configurez le fichier `.env` avec vos accès MySQL et les accès au Card System (Module 1).
4.  Initialisez la base de données via phpMyAdmin en utilisant `database/setup_database.sql`.

## 2. Installation Agent (Client)
L'agent est l'interface de verrouillage du poste.

1.  Activez le **Mode Développeur** de Windows.
2.  Allez dans `YOOL_Station_App/agent`.
3.  Exécutez `npm install`.
4.  Configurez le fichier `.env` dans `renderer/`.
5.  **Build** : Exécutez `npm run build` pour générer l'installateur Windows.
6.  **Installation** : Lancez le fichier `.exe` généré dans le dossier `release/`.

## 3. Lancement Quotidien
Pour faire fonctionner la station, le serveur doit être actif.
```bash
# Lancer le serveur
cd YOOL_Station_App/server
npm run start
```
Ensuite, lancez l'application YOOL Station Agent depuis le menu Démarrer de Windows.

---
*Document technique YOOL.*

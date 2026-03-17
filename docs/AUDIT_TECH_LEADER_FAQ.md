# Guide de Validation : Réponses pour le Tech Leader 💡

Ce document est votre "antisèche" pour l'audit de votre Tech Leader. Pour chaque exigence du **Module 2**, vous trouverez ici la réponse technique et la preuve dans le code.

---

### 1. Contexte & Objectif
**Q : Comment garantissez-vous qu'un étudiant ne peut pas contourner l'agent ?**
*   **Réponse** : L'agent est en mode "Kiosk" natif (`mainWindow.setKiosk(true)`). Tous les raccourcis système Windows (Alt+Tab, Alt+F4, Touche Windows) sont interceptés et bloqués via `globalShortcut` dans `agent/main/index.js`. L'application est configurée pour être `alwaysOnTop` (toujours au premier plan).

---

### 2. Périmètre du projet
**Q : Est-ce vraiment un "agent léger" ? Comment se lance-t-il ?**
*   **Réponse** : Oui, c'est une application Electron optimisée. Pour le déploiement, nous utilisons `silent_launch.vbs` qui lance le serveur Node (proxy) et l'interface de manière invisible. Le script `INSTALL_AUTO_RUN.bat` automatise l'ajout au dossier `Startup` de Windows pour un lancement sans intervention.

---

### 3. Fonctionnalités (Client)
**Q : Comment l'agent gère-t-il les erreurs de carte (expirée, suspendue) ?**
*   **Réponse** : L'agent ne prend aucune décision seul. Il utilise un proxy local (`/api/stations/verify`) qui interroge l'API du Module 1. L'agent affiche dynamiquement le message d'erreur précis renvoyé par le backend principal (ex: "Carte suspendue").

---

### 4. Architecture Technique
**Q : Pourquoi ce choix technologique (Electron + Node) ?**
*   **Réponse** : Electron permet un contrôle total sur l'OS (verrouillage matériel) tout en utilisant des technologies web modernes (React/Vite). Node.js côté serveur (`server`) assure une communication asynchrone rapide et une gestion robuste des logs MySQL.

---

### 5. Livrables & Packaging
**Q : Comment générer l'exécutable final pour les stations ?**
*   **Réponse** : Nous utilisons `electron-builder`. J'ai simplifié le processus avec le script `PREPARE_INSTALLER.bat`. Il installe les dépendances, compile le code avec Vite, et produit un `.exe` Windows prêt à installer dans le dossier `release/`.

---

### 6. Sécurité & SSO (Module 6)
**Q : Comment est assurée la sécurité du Single Sign-On ?**
*   **Réponse** : Le Module 6 est strictement séparé. Il génère des jetons **JWT signés** (HS256) avec une durée de vie très courte (60s). Nous utilisons des **JTI (unique IDs)** stockés en base de données pour empêcher toute réutilisation de jeton (protection anti-rejeu).

---

### 7. Maintenance & Audit
**Q : Où sont stockées les preuves d'utilisation ?**
*   **Réponse** : Dans la table `sessions` de la base `yool_station_agent`. Chaque entrée contient le `student_id`, l'UUID de session, ainsi que les horodatages précis (`start_time`, `end_time`). Les incidents techniques sont consignés dans `station_logs`.

---

### 8. Base de données
**Q : Pourquoi avoir haché les clés d'agent ?**
*   **Réponse** : Sécurité "Zero Knowledge". Même si un attaquant accède à la base de données MySQL, il ne peut pas voler les clés des stations car elles sont stockées sous forme de hash via **BCrypt**.

---
*En cas de question complexe sur le code, référez-vous aux commentaires JSDoc présents dans chaque fichier contrôleur.*

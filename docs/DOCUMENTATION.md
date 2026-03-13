# Document de Documentation - YOOL Station Agent

Ce document contient les informations techniques de référence.

## Architecture
Le système est composé d'un serveur local (Node.js/Express) et d'un agent client (Electron.js).
La communication est sécurisée entre les deux via des clés d'agent et des secrets partagés.

## Base de données
Utilisez le script `database/setup_database.sql` pour créer les tables :
- `stations` : Liste des PC identifiés.
- `sessions` : Journal des utilisations étudiants.
- `station_logs` : Journal d'audit système.

## Procédure de validation technique
Pour tester l'intégrité du code avant livraison :
1.  Vérifiez les dépendances : `npm install`.
2.  Testez le démarrage : `npm run dev`.
3.  Vérifiez le build : `npm run build`.

---
*Documentation technique Module 2.*

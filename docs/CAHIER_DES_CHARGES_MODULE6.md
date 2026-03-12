# Cahier des charges – Module 6
## Intégration SSO (Single Sign-On) YOOL

### 1. Contexte & objectif
Dans le cadre de l'écosystème YOOL, les stations de travail (Module 2) doivent permettre une connexion fluide aux plateformes web de formation sans authentification manuelle supplémentaire. 
Ce module gère l'émission de jetons de confiance et la synchronisation des états de session entre le local et le cloud.

---

### 2. Fonctionnalités SSO

| Fonctionnalité | Description |
| :--- | :--- |
| **Génération JWT** | Création de jetons signés (HS256) contenant l'ID étudiant et l'UUID de session. |
| **Sécurité Anti-rejeu** | Utilisation de claims `jti` (unique ID) stockés en base de données pour empêcher la réutilisation de jetons. |
| **Validité Courte** | Jetons limités à 60 secondes pour minimiser les risques en cas d'interception. |
| **Logout Synchronisé** | Notification automatique à la plateforme cloud (Webhook) lors de la fermeture d'une session locale. |
| **Maintenance TTL** | Nettoyage automatique des jetons expirés pour garantir les performances. |

---

### 3. Spécifications Techniques
- **Standard** : JSON Web Token (JWT).
- **Algorithme** : HS256 (Secret partagé).
- **Claims Requis** :
  - `iss` : Emetteur (yool-station-server).
  - `sub` : Sujet (ID Étudiant).
  - `jti` : ID unique du jeton.
  - `sid` : ID de la session locale.
  - `exp` : Expiration (60s).

### 4. Intégration avec Module 2
Le **Module 6** agit comme un service complémentaire au **Module 2**. Lorsqu'une session démarre dans l'agent de contrôle, le service SSO est appelé pour fournir le sésame d'accès à la plateforme Web.

---
*Ce document définit les standards d'interopérabilité SSO pour le réseau YOOL.*

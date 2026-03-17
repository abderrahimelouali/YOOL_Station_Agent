# Documentation Technique SSO - YOOL Platform
**Version:** 3.0 (Production Ready)  
**Date:** 14 février 2026  
**Destinataire:** ÉQUIPE YOOL (Production & Infrastructure)

---

## 📋 Vue d'ensemble
Cette documentation décrit l'implémentation complète du système **Single Sign-On (SSO) basé sur JWT** pour la plateforme YOOL. Elle a été conçue pour garantir une sécurité maximale, une protection contre les attaques par rejeu, et une synchronisation parfaite des sessions entre les stations physiques et la plateforme cloud.

## 🏗️ Architecture Hybride
Le système repose sur deux composants interconnectés :

1.  **Agent Station (Local)** : Installé sur les postes de travail windows. Il gère l'interface de badgeage, communique avec le lecteur RFID, et génère des jetons JWT éphémères et signés.
2.  **Plateforme YOOL (Cloud)** : Application Laravel 11 hébergée en ligne. Elle valide les jetons, crée les sessions web et reçoit les signaux de déconnexion.

### Flux de données :
*   **Authentification (SSO)** : Le navigateur local est redirigé vers `/sso/verify?token={JWT}`.
*   **Synchronisation (Logout)** : Lors d'une déconnexion locale (inactivité ou verrouillage), l'Agent envoie une requête API `GET /api/sso/logout?token={JWT}` pour invalider instantanément la session cloud.

---

## 🚀 Spécifications des Routes

### 1. Login SSO (Entrée)
**URL** : `GET /sso/verify?token={JWT}`  
**Contrôleur** : `app/Http/Controllers/SSOController.php`

**Validation des Claims :**
| Claim | Valeur attendue | Description |
| :--- | :--- | :--- |
| `iss` | `yool-station-server` | Identifie l'émetteur légitime. |
| `aud` | `yool-platform` | Identifie le destinataire correct. |
| `exp` | Timestamp futur | Durée de validité courte (recommandé : 60s). |
| `jti` | UUID unique | Identifiant de jeton (Protection Anti-rejeu). |
| `sub` | Student ID | Identifiant unique de l'étudiant (lié à `users.id`). |
| `sid` | Station Session ID | ID de session unique côté station pour le mapping. |

---

### 2. Logout à Distance (Webhook)
**URL** : `GET /api/sso/logout?token={JWT}`  
**Contrôleur** : `app/Http/Controllers/Api/RemoteLogoutController.php`

**Action** : Cette route décode le JWT, vérifie que l'action est bien `logout`, puis utilise le claim `sid` pour trouver et détruire la session Laravel correspondante dans la base de données.

---

### 3. Vérification de Session (Client)
**URL** : `GET /api/session/check`

Utilisé par le frontend Laravel pour détecter en temps réel si la session a été invalidée par la station (Auto-reload vers login).

---

## 🗄️ Schéma de Base de Données

### Table: `used_jtis` (Anti-Rejeu)
Stocke tous les identifiants de jetons utilisés pour empêcher qu'un même jeton soit réutilisé.
```sql
CREATE TABLE used_jtis (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    jti VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_jti ON used_jtis(jti);
```

### Table: `station_sessions` (Mapping)
Permet de lier une session physique (Station) à une session web (Laravel).
```sql
CREATE TABLE station_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sid VARCHAR(255) NOT NULL UNIQUE,
    laravel_session_id VARCHAR(255) NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛡️ Modèle de Menace & Sécurité (Threat Model)

### 1. Replay Attack (Attaque par rejeu)
*   **Menace** : Un attaquant intercepte un lien SSO et tente de se connecter avec.
*   **Atténuation** : **Claim JTI + Table used_jtis**. Chaque jeton est enregistré lors de sa première utilisation. Toute tentative ultérieure avec le même ID est bloquée (403 Forbidden).

### 2. Network Interception (Homme du milieu)
*   **Menace** : Interception du jeton sur un réseau Wi-Fi public ou local.
*   **Atténuation** : **HTTPS OBLIGATOIRE**. TLS 1.2+ chiffre le tunnel de communication. L'utilisation du header **HSTS** force les navigateurs à n'utiliser que le HTTPS.

### 3. Fuite de Token (Referrer Leak)
*   **Menace** : Le token présent dans l'URL est envoyé à un site tiers via le header `Referer`.
*   **Atténuation** : **Referrer-Policy: no-referrer**. Ajouté aux en-têtes de réponse pour garantir que l'URL complète n'est jamais divulguée lors des redirections.

### 4. Exposition dans les Logs (Access Logs)
*   **Menace** : Le token apparaît en clair dans les logs d'accès Nginx ou Apache.
*   **Atténuation** : **Désactivation des logs** pour les routes `/sso/verify` et `/api/sso/logout`.
```nginx
location /sso/verify {
    access_log off;
    try_files $uri $uri/ /index.php?$query_string;
}
```

---

## ✅ Checklist de Mise en Production (Critical)

### 🔴 Niveau de Risque : Élevé
- [ ] **SSL/TLS** : Certificat valide (Let's Encrypt ou autre) installé.
- [ ] **JWT_SECRET** : Minimum 64 caractères, unique à la production, stocké en variable d'environnement (Vault recommandé).
- [ ] **Session Driver** : Doit être réglé sur `database` dans `.env` pour permettre le logout à distance.
- [ ] **Nettoyage BDD** : Configurer une tâche CRON (Laravel Scheduler) pour nettoyer les JTIs expirés.

### 🟡 Niveau de Risque : Moyen
- [ ] **IP Whitelisting** : Si possible, limiter les appels `/api/sso/logout` aux IPs connues des stations.
- [ ] **Rate Limiting** : Appliquer un throttle sur la route de vérification pour limiter les tentatives de brute-force.
- [ ] **Monitoring** : Surveiller les pics d'erreurs 403 (indiquent des tentatives de rejeu).

---
**Document validé pour le déploiement.**  

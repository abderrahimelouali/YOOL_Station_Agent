# 🗄️ Schéma de la Base de Données

La YOOL Station utilise une base de données MySQL locale pour gérer l'état et la sécurité.

## Tables Principales

### 1. `stations`
Enregistre chaque ordinateur (station) utilisant l'agent.
- `station_code` (Unique) : Identifiant du PC.
- `agent_key_hash` : Clé de l'agent hashée avec BCrypt.
- `status` : `online`, `pending` (attente activation), `maintenance`.
- `location` : Emplacement physique du poste.
- `last_seen` : Horodatage du dernier battement de coeur (Heartbeat).

### 2. `sessions`
Stocke l'historique des étudiants qui ont scanné leur badge.
- `session_uuid` : ID unique de la session (standard UUID v4).
- `student_id` : ID de l'étudiant vérifié par Module 1.
- `card_uid` : Identifiant physique de la carte.
- `status` : `active`, `completed`, `expired`.

### 3. `station_logs`
Audit technique de la station.
- `log_type` : `info`, `warning`, `error`.
- `category` : `auth`, `system`, `sync`.

### 4. `used_jtis` (🛡️ Sécurité)
Protège contre les attaques par rejeu du jeton SSO.
- `jti` : Identifiant unique du jeton JWT.
- `expires_at` : Date d'expiration (supprimé automatiquement après 60s).

---
> [!TIP]
> Le serveur nettoie automatiquement les JTIs expirés toutes les 5 minutes pour optimiser l'espace.

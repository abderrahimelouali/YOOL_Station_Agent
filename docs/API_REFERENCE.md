# 🔌 Documentation de l'API Locale (Station Server)

Le Station Server agit comme un relais (Proxy) sécurisé entre l'Agent UI et le backend principal (Module 1).

## Base URL : `http://127.0.0.1:3000/api`

---

### 1. Vérification de Carte (Relais)
`POST /api/stations/verify`
**Payload :**
```json
{
  "station_code": "STA-001",
  "agent_key": "votre_cle_secrete",
  "card_identifier": "UID_OU_QR_CODE",
  "workspace_id": "WS-ID"
}
```
**Réponse :** Retourne directement l'objet de validation du Module 1.

### 2. Démarrage de Session
`POST /api/sessions/start`
**Payload :**
```json
{
  "station_code": "STA-001",
  "agent_key": "votre_cle_secrete",
  "card_uid": "UID",
  "student_id": "STUD-123",
  "student_name": "Nom de l'étudiant"
}
```
**Réponse :** Fournit un **Token JWT** (SSO) de 60 secondes.

### 3. Fin de Session (Logout)
`POST /api/sessions/end`
**Payload :**
```json
{
  "session_uuid": "UUID-V4"
}
```
**Effet :** Ferme la session locale et envoie un webhook de déconnexion à la plateforme YOOL.

### 4. Heartbeat (État du Poste)
`POST /api/stations/heartbeat`
**Payload :**
```json
{
  "station_code": "STA-001",
  "agent_key": "votre_cle_secrete"
}
```
**Réponse :** `{ "success": true }`. Met à jour le champ `last_seen` en BDD.

---

### 4. Diagnostic Santé
`GET /health`
Vérifie si le serveur est bien démarré et connecté à la BDD.

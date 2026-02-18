# Guide de Déploiement - YOOL Station 🚀

## 📋 Vue d'Ensemble

Ce guide détaille le déploiement complet de la solution YOOL Station en production :
- **Serveur Backend** : Hébergé sur Linux via Docker
- **Stations Clients** : Déployées sur Windows (EXE ou .ps1)

---

## 🐳 **Partie 1 : Déploiement du Serveur (Linux)**

### Prérequis
- Docker + Docker Compose installés
- Port 3000 ouvert (ou personnalisé)
- Accès SSH au serveur

### Étape 1 : Transfert des Fichiers

Copiez le dossier `yool-station-server` sur votre serveur Linux :

```bash
scp -r .ps1/yool-station-server/ user@serveur:/opt/yool-server
```

### Étape 2 : Configuration Environnement

```bash
cd /opt/yool-server
cp .env.example .env
nano .env
```

**Fichier `.env` à configurer :**
```env
PORT=3000
DB_ROOT_PASSWORD=VotreMotDePasse_Root_2024
DB_USER=yool_user
DB_PASSWORD=VotreMotDePasse_Utilisateur_2024
DB_NAME=yool_station_db
JWT_SECRET=VotreCle_JWT_Tres_Securisee_2024
SSO_API_URL=https://certifications.web4jobs.ma/api
SSO_SERVER_SECRET=SecretPartagéAvecLaravel
```

### Étape 3 : Lancement via Docker

```bash
# Construction et démarrage
docker-compose up -d

# Vérification des logs
docker-compose logs -f server

# Vérifier que MySQL est prêt
docker-compose logs mysql | grep "ready for connections"
```

### Étape 4 : Test du Serveur

```bash
curl http://localhost:3000/api/health
# Réponse attendue : {"status":"ok"}
```

---

## 💻 **Partie 2 : Déploiement des Stations (Windows)**

### Option A : EXE (Recommandé pour Production)

#### Installation sur chaque station :

1. **Copier le fichier** :
   ```
   release/yool-scan-station Setup 1.0.0.exe
   ```

2. **Double-cliquer pour installer**

3. **Créer le fichier de configuration** :
   ```
   Créer : C:\Users\[user]\AppData\Local\Programs\yool-scan-station\.env
   ```

   **Contenu :**
   ```env
   VITE_STATION_ID=STATION_ORAN_001
   VITE_AGENT_KEY=demo_agent_key_001
   VITE_SERVER_URL=http://192.168.1.50:3000
   VITE_PLATFORM_URL=https://certifications.web4jobs.ma/
   VITE_USE_VERIFY_API=true
   VITE_INACTIVITY_TIMEOUT=15
   ```

4. **Lancer l'application**

⚠️ **Important** : Changez `STATION_ID` et `AGENT_KEY` pour chaque station.

---

### Option B : .ps1 (Pour Développement/Tests)

#### Installation sur chaque station :

1. **Copier le dossier complet** :
   ```
   Copier le dossier .ps1 vers C:\YOOL\Station\
   ```

2. **Installer les dépendances** :
   ```powershell
   cd C:\YOOL\Station\.ps1\yool-station-agent
   npm install
   
   cd ..\yool-station-server
   npm install
   ```

3. **Configurer les variables** :
   
   **Fichier `.ps1/yool-station-agent/.env` :**
   ```env
   VITE_STATION_ID=STATION_ORAN_001
   VITE_AGENT_KEY=demo_agent_key_001
   VITE_SERVER_URL=http://192.168.1.50:3000
   VITE_PLATFORM_URL=https://certifications.web4jobs.ma/
   VITE_USE_VERIFY_API=true
   VITE_INACTIVITY_TIMEOUT=15
   ```

   **Fichier `.ps1/yool-station-server/.env` :**
   ```env
   PORT=3000
   DB_HOST=192.168.1.50
   DB_USER=yool_user
   DB_PASSWORD=VotreMotDePasse
   DB_NAME=yool_station_db
   JWT_SECRET=VotreCle_JWT
   SSO_API_URL=https://certifications.web4jobs.ma/api
   SSO_SERVER_SECRET=SecretPartagé
   ```

4. **Lancer la station** :
   ```powershell
   # Mode standard
   cd C:\YOOL\Station\.ps1
   .\start.ps1
   
   # Mode silencieux (sans console)
   Double-cliquer sur silent_launch.vbs
   ```

---

## 🧪 **Partie 3 : Cartes de Test**

Les cartes suivantes sont automatiquement insérées dans la base :

| Carte ID | Étudiant | Statut | Résultat Attendu |
|----------|----------|--------|------------------|
| `QRMLHY43AHXV7ZVF` | Ahmed Bennani | ✅ Active | Accès autorisé |
| `QRMLFJQPENAKVGW3` | Fatima Alaoui | ✅ Active | Accès SSO |
| `QRMLFJQ1K0BOJ0XU` | Mohammed El Fassi | ⛔ Suspendue | Accès refusé |
| `QRMLGRQZFW8T1HCT` | Sara Idrissi | 🗿 Révoquée | Accès refusé |
| `QRMLGRRH07P8JV1Y` | Youssef Tazi | ⚰️ Expirée | Accès refusé |

**Test depuis l'Agent** :
- Appuyez sur **Entrée** (simulation scan)
- Ou saisissez manuellement l'ID dans le champ

---

## 🔒 **Partie 4 : Configuration Kiosk (Production)**

### Mode Kiosk Actif par Défaut

✅ **Activé** :
- Plein écran forcé
- Blocage de fermeture (Alt+F4, taskbar, etc.)

🔓 **Commentés (pour tests)** :
- Blocage Alt+Tab
- Blocage touche Windows
- Blocage Escape, F11, etc.

### Pour Activer le Verrouillage Total

Dans `main/index.js`, décommentez le bloc ligne ~152 :

```javascript
// --- DÉCOMMENTEZ POUR ACTIVER LE VERROUILLAGE TOTAL ---
/*
globalShortcut.register('Alt+F4', () => console.log('[SECURITY] Alt+F4 bloqué'));
globalShortcut.register('Alt+Tab', () => console.log('[SECURITY] Alt+Tab bloqué'));
// ... etc
*/
```

Retirez les `/*` et `*/`, puis rebuild.

---

## 🛠️ **Partie 5 : Dépannage**

### Le serveur ne démarre pas

```bash
# Vérifier les logs
docker-compose logs server

# Redémarrer les services
docker-compose restart
```

### L'Agent affiche "Erreur réseau"

1. Vér ifier que le serveur est accessible :
   ```powershell
   curl http://192.168.1.50:3000/api/health
   ```

2. Vérifier l'URL dans `.env` de l'Agent

### Écran blanc (EXE)

1. Vérifier que le fichier `.env` existe dans le dossier d'installation
2. Relancer l'installation
3. Consulter les logs : `%APPDATA%\yool-scan-station\logs\`

---

## 📊 **Partie 6 : Maintenance**

### Backup de la Base de Données

```bash
docker exec yool_mysql mysqldump -u root -p yool_station_db > backup_$(date +%Y%m%d).sql
```

### Mise à Jour du Serveur

```bash
cd /opt/yool-server
git pull  # Si depuis un repo
docker-compose down
docker-compose up -d --build
```

### Mise à Jour des Stations

- **EXE** : Redistribuer le nouveau `.exe`
- **.ps1** : Copier les nouveaux fichiers et `npm install`

---

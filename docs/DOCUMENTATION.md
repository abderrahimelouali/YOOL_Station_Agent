# YOOL Station Agent - Documentation Technique & Guide d'Utilisation

Bienvenue dans la documentation officielle du système **YOOL Station Agent**. Ce système sécurise l'accès aux postes de travail via une authentification par carte (QR/RFID) avec une architecture proxy centralisée.

---

## 1. Architecture du Système

Le système repose sur une architecture en trois couches pour garantir une sécurité maximale :

```mermaid
graph LR
    A["Station Agent (Poste)"] -->|"Authentification Station (Clé + ID)"| B["Station Server (Local/Central)"]
    B -->|"Vérification Carte (Proxy)"| C["Module 1 (Backend Principal)"]
    B -->|"Logs & Sessions"| D["Base de Données (MySQL)"]
```

### Structure des données (BDD) :
- **`stations`** : Registre des postes configurés et leur statut (pending/online).
- **`sessions`** : Historique complet des utilisations par les étudiants.
- **`used_jtis`** : Protection anti-rejeu pour les jetons SSO (JWT).
- **`station_logs`** : Journal d'audit système interne.

### Concepts Clés de Sécurité :
1.  **Proxy Sécurisé** : L'Agent de station ne communique jamais directement avec le Module 1. Il passe par le **Station Server**.
2.  **Secret Partagé** : La communication entre le Station Server et le Module 1 est authentifiée par une clé `MODULE1_SERVER_SECRET` inaccessible aux postes clients.
3.  **Hachage des Clés** : Les clés des stations (`AGENT_KEY`) sont stockées sous forme de hachage (BCrypt) en base de données. Même un accès à la BDD ne permet pas de connaître les clés en clair.
4.  **Auto-Enregistrement** : Toute nouvelle station se connectant avec un nouvel ID est enregistrée avec le statut **`pending`** et une localisation par défaut (ex: `Tinghir`). Elle doit être validée manuellement pour devenir opérationnelle.

---

## 🐋 2. Déploiement Rapide avec Docker

Pour un déploiement instantané du Backend et de la Base de données :
```bash
docker-compose up -d --build
```
Consultez le [**DOCKER_GUIDE.md**](./DOCKER_GUIDE.md) pour plus de détails sur la configuration des conteneurs.

---

## 3. Guide d'Installation (Manuel)
- Node.js (v16+)
- MySQL
- Electron (inclus dans les dépendances)

### Configuration du Serveur (Station Server)
1.  Copiez `.env.example` vers `.env` dans le dossier `yool-station-server`.
2.  Configurez vos identifiants MySQL.
3.  Définissez `MODULE1_API_URL` (URL du backend principal) et `MODULE1_SERVER_SECRET`.
4.  Optionnel : `DEFAULT_STATION_LOCATION=Tinghir` pour définir la localisation par défaut des nouveaux postes.

### Configuration de l'Agent (Station Agent)
1.  Copiez `.env.example` vers `.env` dans le dossier `yool-station-agent/renderer`.
2.  `VITE_STATION_ID` : L'identifiant unique de ce poste (ex: `STA-001`).
3.  `VITE_AGENT_KEY` : Une clé secrète complexe générée pour ce poste.
4.  `VITE_API_URL` : L'URL de votre Station Server (ex: `http://localhost:3000/api`).

### 🚀 Lancement Automatique (Windows 10)
Conformément au cahier des charges, l'agent doit se lancer au démarrage du poste :
1.  **Méthode Recommandée** :
    *   Appuyez sur `Win + R`, tapez `shell:startup` et validez.
    *   Créez un raccourci vers `YOOL Station Agent.exe` (situé dans le dossier `exe`) et déposez-le dans ce dossier.
2.  **Vérification** : Redémarrez le poste. L'application doit se lancer automatiquement en mode Kiosque.

---

## 3. Guide d'Utilisation (Opérationnel)

### Étape 1 : Onboarding d'une Station
Lorsqu'une nouvelle station est lancée pour la première fois :
- Elle envoie sa clé et son ID au serveur.
- Le serveur l'enregistre automatiquement.
- L'utilisateur verra le message : **"En attente de validation admin"**.

### Étape 2 : Validation par l'Administrateur
Pour activer la station :
1.  Connectez-vous à votre base de données MySQL.
2.  Dans la table `stations`, trouvez la ligne correspondant au `station_code` du nouveau poste.
3.  Changez la colonne `status` de `'pending'` à **`'online'`**.
4.  La station est maintenant opérationnelle !

### Étape 3 : Utilisation Quotidienne
- **Scan de carte** : L'utilisateur scanne sa carte. L'agent demande au proxy de vérifier.
- **Déverrouillage** : Si autorisé par le Module 1, le poste se déverrouille (l'application Electron se cache/minimise).
- **Session** : Une session est créée en base de données avec l'heure de début.
- **Inactivité** : Si le poste est inactif trop longtemps, il se reverrouille automatiquement et ferme la session.
- **Déconnexion** : L'utilisateur peut se déconnecter manuellement via la touche `Echap` ou le bouton de déconnexion.

---

## 4. Maintenance et Troubleshooting

### Logs d'Audit
Consultez la table `station_logs` pour voir les événements système (erreurs d'auth, démarrages, etc.).

### Erreur "Clé Agent Invalide"
Cela signifie que la `VITE_AGENT_KEY` dans le fichier `.env` de l'agent ne correspond pas au hash stocké en base de données.
**Solution** : Supprimez la ligne de la station dans la BDD pour qu'elle se ré-enregistre proprement avec sa nouvelle clé.

### Port HMR (Vite)
En développement, si vous voyez un écran blanc, vérifiez que le port Vite dans `main/index.js` (souvent `5174` ou `5173`) correspond à celui affiché par `npm run dev` dans le dossier agent.

---

## 5. Intégration SSO JWT

Le système utilise des jetons JWT (JSON Web Tokens) pour authentifier l'utilisateur lors de la redirection vers la plateforme YOOL.

### Spécifications du Jeton
- **Algorithme** : HS256 (Symétrique).
- **Clé Secrète** : Configurable dans le `.env` du serveur (`JWT_SECRET`). 
- **Sécurité** : La clé **doit** faire au moins 32 caractères (256 bits) pour l'algorithme HS256. Clé actuelle de test : `super_secret_jwt_key_yool_platform_2024_secret_key`.
- **Expiration** : Très courte (60 secondes) pour éviter les détournements.

### Claims obligatoires (Payload)
- `iss` : `yool-station-server` (Émetteur).
- `aud` : `yool-platform` (Destinataire).
- `jti` : UUID unique (ID du jeton pour protection anti-rejeu).
- `sub` : ID de l'étudiant (ex: `204`).
- `exp` : Timestamp d'expiration (Unix epoch).

### Vérification côté Plateforme (ex: Laravel)
1. Récupérer le jeton via le paramètre `?token=` dans l'URL.
2. Valider la signature avec le secret partagé.
3. Vérifier que `iss` et `aud` correspondent aux valeurs attendues.
4. **Anti-Rejeu** : Vérifier en base de données que le `jti` n'a jamais été consommé.
5. **Session & Redirection** : Une fois validé, créer une session utilisateur (cookie) et rediriger l'étudiant vers son espace personnel (ex: `/mes-cours`).

---

*Développé avec ❤️ pour YOOL Card System.*

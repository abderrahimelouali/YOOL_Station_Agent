# 🐳 Guide de Déploiement Docker (Backend & BDD)

Ce guide explique comment déployer l'infrastructure backend (Station Server + MySQL) en utilisant Docker pour une installation en un clic.

## 🚀 Démarrage Rapide

1.  **Prérequis** : Assurez-vous que [Docker Desktop](https://www.docker.com/products/docker-desktop/) est installé et lancé.
2.  **Lancement** : Ouvrez un terminal à la racine du projet et lancez :
    ```bash
    docker-compose up -d --build
    ```
    *Cette commande télécharge MySQL, construit l'image du serveur et lance le tout en arrière-plan.*

## ⚙️ Services Inclus

| Service | Port Externe | Description |
| :--- | :--- | :--- |
| **yool-server** | `3000` | API Proxy (Node.js) |
| **yool-db** | `3306` | Base de données MySQL |

## 📁 Configuration (.env)

Le fichier `docker-compose.yml` utilise des variables d'environnement par défaut sécurisées pour Docker :
- **Utilisateur DB** : `root`
- **Mot de passe DB** : `password`
- **Nom de la BDD** : `yool_station_db`
- **Host de la BDD** : `db` (Utilisé par le conteneur serveur pour parler à MySQL)

## 📊 Administration de la Base de Données

Les données MySQL sont persistées dans un volume Docker nommé `db_data`. Elles ne sont pas perdues lors du redémarrage des conteneurs.

Pour accéder à la console MySQL depuis le terminal :
```bash
docker exec -it yool-db mysql -u root -ppassword yool_station_db
```

## 🛠️ Maintenance

- **Voir les logs** : `docker-compose logs -f`
- **Arrêter les services** : `docker-compose down`
- **Réinitialiser tout** : `docker-compose down -v` (Attention : Supprime la BDD)

---
*Note : Pour le déploiement de l'Agent (.exe), référez-vous au guide [DOCUMENTATION.md](./DOCUMENTATION.md) principal.*

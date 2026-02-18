# =============================================================================
# YOOL STATION SERVER - DOCKERFILE (PRODUCTION)
# =============================================================================
# Image légère Alpine Linux avec Node.js 18
FROM node:18-alpine

# Métadonnées
LABEL maintainer="YOOL Team"
LABEL description="Serveur API pour YOOL Station Agent"

# Création du dossier de l'application
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances de production uniquement
RUN npm ci --only=production

# Copie du code source
COPY src ./src

# Exposition du port (défini dans .env, par défaut 3000)
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production

# Utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Commande de démarrage
CMD ["node", "src/index.js"]

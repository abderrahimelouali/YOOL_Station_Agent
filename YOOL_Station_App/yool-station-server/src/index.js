/**
 * ============================================================================
 * YOOL STATION SERVER - ENTRY POINT
 * ============================================================================
 * Serveur Node.js/Express agissant comme passerelle de sécurité pour la
 * gestion des sessions étudiants en mode Kiosk.
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const db = require('./config/database');

// Chargement des variables d'environnement (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * CONFIGURATION DES MIDDLEWARES
 * ----------------------------
 */
app.use(express.json()); // Permet de lire les JSON dans les requêtes POST
app.use(cors());         // Autorise les requêtes provenant de l'Agent UI (Vite)
app.use(helmet());       // Sécurise les en-têtes HTTP (Protection XSS, etc.)

// Logging : Affiche les requêtes dans la console selon le niveau debug
app.use(morgan(process.env.LOG_LEVEL === 'debug' ? 'dev' : 'combined'));

/**
 * ROUTES DE BASE & DIAGNOSTIC
 * ---------------------------
 */

// Route de santé (utilisée pour vérifier que le serveur répond)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Montage des routes API principales (/api/stations, /api/sessions...)
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

/**
 * GESTION GLOBALE DES ERREURS
 * ---------------------------
 */
app.use((err, req, res, next) => {
    console.error('[SERVER ERROR]', err.stack);
    res.status(500).json({
        error: 'Erreur Interne du Serveur',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur s\'est produite.'
    });
});

/**
 * MODULE 6 (SSO) - MAINTENANCE AUTOMATIQUE
 * --------------------------------------
 * TTL Cleanup : Supprime les jetons JTI expirés de la base de données 
 * toutes les 5 minutes pour éviter l'engorgement de la table.
 */
setInterval(async () => {
    try {
        const result = await db.query('DELETE FROM used_jtis WHERE expires_at < NOW()');
        if (result.affectedRows > 0) {
            console.log(`🧹 Maintenance: ${result.affectedRows} JTIs expirés supprimés.`);
        }
    } catch (err) {
        console.error('❌ Erreur Maintenance TTL:', err.message);
    }
}, 5 * 60 * 1000);

/**
 * DÉMARRAGE DU SERVEUR
 * --------------------
 */
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 YOOL Station Server opérationnel sur le port ${PORT}`);
    });
}

// Export de l'application (utile pour les futurs tests ou intégrations)
module.exports = app;

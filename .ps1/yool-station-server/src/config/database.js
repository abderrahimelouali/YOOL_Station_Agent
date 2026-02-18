/**
 * ============================================================================
 * YOOL STATION SERVER - DATABASE CONFIGURATION
 * ============================================================================
 * Gère la connexion au pool MySQL et l'initialisation des tables de sécurité.
 * ============================================================================
 */

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Chargement de la configuration technique
dotenv.config();

/**
 * CONFIGURATION DU POOL DE CONNEXION
 * ----------------------------------
 * Utilise un pool pour optimiser les performances et la réutilisation 
 * des connexions vers MySQL.
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME || 'yool_station_agent',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * HELPER DE REQUÊTE UNIFIÉ
 * ------------------------
 * Encapsule l'exécution des requêtes SQL pour uniformiser le log des erreurs.
 */
async function query(sql, params) {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('❌ Erreur SQL :', error.message);
        throw error;
    }
}

/**
 * AUTO-INITIALISATION TECHNIQUE
 * -----------------------------
 * Vérifie la connexion au démarrage et s'assure que la table de tracker JTI
 * existe pour la sécurité SSO.
 */
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connexion MySQL établie');
        
        // Table critique pour la protection anti-rejeu JWT
        await connection.query(`
            CREATE TABLE IF NOT EXISTS used_jtis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                jti VARCHAR(255) NOT NULL UNIQUE,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('🛡️  Initialisation Sécurité JTI terminée');
        
        connection.release();
    } catch (err) {
        console.error('❌ Échec initialisation BDD :', err.message);
        console.error('👉 Vérifiez que MySQL est lancé et que la base de données existe.');
    }
})();

module.exports = {
    pool,
    query
};

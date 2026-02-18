/**
 * ============================================================================
 * YOOL STATION SERVER - API ROUTES
 * ============================================================================
 * Définit les endpoints disponibles pour la communication entre l'Agent UI
 * et le serveur local.
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

/**
 * ROUTES DE GESTION DES SESSIONS
 * -----------------------------
 */
router.post('/sessions/start', sessionController.startSession); // Ouvre session locale + JWT SSO
router.post('/sessions/end', sessionController.endSession);     // Ferme session + Webhook Cloud

/**
 * ROUTES DE GESTION DES STATIONS
 * ------------------------------
 */
router.post('/stations/heartbeat', sessionController.heartbeat); // Signal de vie périodique
router.post('/stations/verify', sessionController.verifyProxy);   // Relais validation carte (Proxy)

/**
 * ingestion des LOGS (Point d'extension)
 * --------------------------------------
 */
router.post('/logs', (req, res) => {
    // Note: Peut être utilisé pour centraliser les logs de l'interface
    res.json({ success: true });
});

module.exports = router;

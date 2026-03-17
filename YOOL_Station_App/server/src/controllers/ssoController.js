/**
 * ============================================================================
 * YOOL STATION SERVER - SSO CONTROLLER (MODULE 6)
 * ============================================================================
 * Ce contrôleur gère la logique spécifique au Single Sign-On (SSO) :
 * 1. Génération des jetons JWT pour la plateforme
 * 2. Gestion des JTIs pour l'anti-rejeu
 * 3. Synchronisation du Logout avec la plateforme Cloud
 * ============================================================================
 */

const jwt = require('jsonwebtoken');
const axios = require('axios');
const crypto = require('crypto');
const db = require('../config/database');

/**
 * GÉNÉRATION D'UN JETON SSO
 * @param {string} student_id 
 * @param {string} session_uuid 
 * @returns {Promise<string>} Token JWT
 */
exports.generateSSOToken = async (student_id, session_uuid) => {
    const jti = crypto.randomUUID();
    const tokenPayload = {
        iss: 'yool-station-server',
        aud: process.env.JWT_AUDIENCE || 'yool-platform',
        jti: jti,
        sub: student_id,
        sid: session_uuid
    };

    const secret = process.env.JWT_SECRET || 'yool_default_secret_key';
    const token = jwt.sign(tokenPayload, secret, { expiresIn: '60s' });

    // Enregistrement du JTI pour l'anti-rejeu
    const expiresAt = new Date(Date.now() + 60 * 1000);
    await db.query('INSERT INTO used_jtis (jti, expires_at) VALUES (?, ?)', [jti, expiresAt]);

    return token;
};

/**
 * SYNCHRONISATION DU LOGOUT (WEBHOOK)
 * @param {string} session_uuid 
 */
exports.syncLogout = async (session_uuid) => {
    const logoutUrlRaw = process.env.PLATFORM_LOGOUT_URL;
    if (!logoutUrlRaw) return;

    const secret = process.env.JWT_SECRET || 'yool_default_secret_key';
    const logoutToken = jwt.sign({
        iss: 'yool-station-server',
        action: 'logout',
        sid: session_uuid
    }, secret, { expiresIn: '1m' });

    // Envoi asynchrone (pas besoin d'attendre la réponse pour fermer la session locale)
    axios.get(`${logoutUrlRaw}?token=${logoutToken}`)
        .then(r => console.log(`[MODULE 6] Logout Sync OK: ${session_uuid}`))
        .catch(e => console.error(`[MODULE 6] Logout Sync FAILED: ${e.message}`));
};

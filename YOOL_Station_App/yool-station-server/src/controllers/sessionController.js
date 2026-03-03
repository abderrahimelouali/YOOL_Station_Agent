/**
 * ============================================================================
 * YOOL STATION SERVER - SESSION CONTROLLER
 * ============================================================================
 * Ce contrôleur gère la logique métier centrale de la station :
 * 1. Vérification des cartes (Proxy vers Backend Principal)
 * 2. Gestion des sessions locales (Démarrage, Fin)
 * 3. Génération des jetons SSO (JWT)
 * 4. Heartbeat (État de santé des stations)
 * ============================================================================
 */

const crypto = require('crypto'); // Utilisation du module natif pour les UUIDs
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * PROXY DE VÉRIFICATION DE CARTE
 * -----------------------------
 * Intercepte les demandes des agents locaux (badgeage), vérifie l'identité 
 * de la station (Agent Key), et relaie la demande au Module 1 (Backend Principal).
 */
exports.verifyProxy = async (req, res) => {
    const { station_code, agent_key, card_identifier, workspace_id } = req.body;

    // Validation des entrées obligatoires
    if (!station_code || !agent_key || !card_identifier) {
        return res.status(400).json({ success: false, message: 'Données de vérification manquantes' });
    }

    try {
        // 1. Authentification et Auto-enregistrement de la station
        let stations = await db.query('SELECT agent_key_hash, status FROM stations WHERE station_code = ?', [station_code]);

        // Si la station est nouvelle, on l'inscrit automatiquement en mode 'pending'
        if (stations.length === 0) {
            const hash = await bcrypt.hash(agent_key, 10);
            const defaultLocation = (process.env.DEFAULT_STATION_LOCATION || 'Inconnue').trim();
            console.log(`[AUTH] Auto-enregistrement nouvelle station: ${station_code}`);

            await db.query(
                'INSERT INTO stations (station_code, agent_key_hash, status, location) VALUES (?, ?, ?, ?)',
                [station_code, hash, 'pending', defaultLocation]
            );

            return res.status(403).json({
                success: false,
                message: 'Poste en attente d\'activation (Pending). Contactez l\'admin.',
                registered: true
            });
        }

        const station = stations[0];

        // 2. Vérification de la clé de l'agent (Bcrypt)
        const isMatch = await bcrypt.compare(agent_key, station.agent_key_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Clé agent invalide' });
        }

        // 3. Vérification du statut (Seules les stations 'online' peuvent travailler)
        if (station.status !== 'online') {
            return res.status(403).json({ success: false, message: 'Poste non activé' });
        }

        // Mise à jour de l'activité (last_seen)
        await db.query('UPDATE stations SET last_seen = NOW() WHERE station_code = ?', [station_code]);

        // 4. Relais vers le Backend Principal (Module 1)
        const module1Url = process.env.MODULE1_API_URL;
        const serverSecret = process.env.MODULE1_SERVER_SECRET;

        const response = await axios.post(`${module1Url}/cards/verify`, {
            card_identifier,
            workspace_id,
            agent_key: serverSecret
        });

        // On renvoie la réponse reçue directement à l'Agent UI
        res.json(response.data);

    } catch (error) {
        console.error('[PROXY ERROR]', error.message);
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Erreur communication Module 1';
        res.status(status).json({ success: false, message, valid: false });
    }
};

/**
 * DÉMARRAGE DE SESSION & GÉNÉRATION SSO
 * -------------------------------------
 * Enregistre le début d'une session locale et crée le jeton JWT pour le SSO.
 */
exports.startSession = async (req, res) => {
    const { station_code, agent_key, card_uid, student_id, student_name } = req.body;

    if (!station_code || !agent_key || !card_uid || !student_id) {
        return res.status(400).json({ success: false, message: 'Données incomplètes' });
    }

    try {
        // Authentification de la station
        const stations = await db.query('SELECT id, agent_key_hash, status FROM stations WHERE station_code = ?', [station_code]);
        if (stations.length === 0 || !(await bcrypt.compare(agent_key, stations[0].agent_key_hash))) {
            return res.status(401).json({ success: false, message: 'Station non identifiée' });
        }

        const stationId = stations[0].id;
        const sessionUuid = crypto.randomUUID(); // ID unique pour cette session
        const jti = crypto.randomUUID();         // ID unique pour le jeton SSO (Anti-rejeu)

        // --- NOUVEAU : Mise à jour de l'activité (last_seen) ---
        await db.query('UPDATE stations SET last_seen = NOW() WHERE station_code = ?', [station_code]);

        // 1. Enregistrement en base de données locale
        await db.query(
            'INSERT INTO sessions (session_uuid, station_id, student_id, card_uid, status) VALUES (?, ?, ?, ?, ?)',
            [sessionUuid, stationId, student_id, card_uid, 'active']
        );

        // 2. Construction du Payload JWT (SSO)
        const tokenPayload = {
            iss: 'yool-station-server',
            aud: process.env.JWT_AUDIENCE || 'yool-platform',
            jti: jti,
            sub: student_id,
            sid: sessionUuid // Utilisé pour le logout synchronisé
        };

        const secret = process.env.JWT_SECRET || 'yool_default_secret_key';
        const token = jwt.sign(tokenPayload, secret, { expiresIn: '60s' }); // Validité courte de 60s

        // 3. Stockage du JTI pour éviter qu'un jeton soit utilisé deux fois
        const expiresAt = new Date(Date.now() + 60 * 1000);
        await db.query('INSERT INTO used_jtis (jti, expires_at) VALUES (?, ?)', [jti, expiresAt]);

        // Audit log
        await db.query('INSERT INTO station_logs (station_id, log_type, category, message) VALUES (?, ?, ?, ?)',
            [stationId, 'info', 'auth', `Session ouverte: ${student_name || student_id}`]);

        res.json({
            success: true,
            token: token,
            session: {
                session_uuid: sessionUuid,
                student_name: student_name || "Étudiant",
                start_time: new Date()
            }
        });

    } catch (error) {
        console.error('[DB ERROR]', error.message);
        res.status(500).json({ success: false, message: 'Erreur base de données' });
    }
};

/**
 * CLÔTURE DE SESSION & LOGOUT SYNCHRONISÉ
 * ---------------------------------------
 * Termine la session locale et informe la plateforme Cloud pour le déconnecter du Web.
 */
exports.endSession = async (req, res) => {
    const { session_uuid } = req.body;

    if (!session_uuid) return res.status(400).json({ success: false });

    try {
        // 1. Fermeture locale
        await db.query(
            'UPDATE sessions SET end_time = NOW(), status = ? WHERE session_uuid = ? AND status = ?',
            ['completed', session_uuid, 'active']
        );

        // 2. Webhook de déconnexion (Synchronisation Cloud)
        const logoutUrlRaw = process.env.PLATFORM_LOGOUT_URL;

        if (logoutUrlRaw) {
            /**
             * LOGIQUE HTTPS vs HTTP (Production)
             * En production, décommentez la ligne avec https:// et supprimez/commentez le http://
             */
            let finalLogoutUrl = logoutUrlRaw; // Valeur du .env par défaut

            // --- CONFIGURATION PRODUCTION (HTTPS) ---
            // finalLogoutUrl = logoutUrlRaw.replace('http://', 'https://'); // FORCE HTTPS
            // -----------------------------------------

            const secret = process.env.JWT_SECRET || 'yool_default_secret_key';
            const logoutToken = jwt.sign({
                iss: 'yool-station-server',
                action: 'logout',
                sid: session_uuid
            }, secret, { expiresIn: '1m' });

            // Envoi de la requête de déconnexion en arrière-plan
            axios.get(`${finalLogoutUrl}?token=${logoutToken}`)
                .then(r => console.log(`[SYNC] Logout OK: ${session_uuid}`))
                .catch(e => console.error(`[SYNC] Logout FAILED: ${e.message}`));
        }

        res.json({ success: true, message: 'Session close' });

    } catch (error) {
        console.error('[LOGOUT ERROR]', error.message);
        res.status(500).json({ success: false });
    }
};

/**
 * BATTEMENT DE COEUR (HEARTBEAT)
 * ------------------------------
 * Permet aux stations d'indiquer qu'elles sont toujours en ligne et actives.
 */
exports.heartbeat = async (req, res) => {
    const { station_code, agent_key } = req.body;

    if (!station_code || !agent_key) return res.status(400).json({ success: false });

    try {
        const stations = await db.query('SELECT agent_key_hash FROM stations WHERE station_code = ?', [station_code]);
        if (stations.length > 0 && await bcrypt.compare(agent_key, stations[0].agent_key_hash)) {
            await db.query('UPDATE stations SET last_seen = NOW() WHERE station_code = ?', [station_code]);
            return res.json({ success: true });
        }
        res.status(401).json({ success: false });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};
/**
 * ENREGISTREMENT DES LOGS GÉNÉRIQUES
 * ----------------------------------
 */
exports.saveLog = async (req, res) => {
    const { station_code, log_type, category, message } = req.body;

    if (!station_code || !message) {
        return res.status(400).json({ success: false, message: 'Données de log incomplètes' });
    }

    try {
        const stations = await db.query('SELECT id FROM stations WHERE station_code = ?', [station_code]);
        const stationId = stations.length > 0 ? stations[0].id : null;

        await db.query(
            'INSERT INTO station_logs (station_id, log_type, category, message) VALUES (?, ?, ?, ?)',
            [stationId, log_type || 'info', category || 'system', message]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('[LOG ERROR]', error.message);
        res.status(500).json({ success: false });
    }
};

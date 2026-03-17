
/**
 * Service de gestion des logs de station (sessions).
 * Pour l'instant, c'est purement local (console.log).
 * À terme, cela enverra des requêtes au backend.
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Service de gestion des logs de station (sessions).
 * Envoie désormais les données au backend.
 */

export const startSession = async (cardId, stationId, studentId, studentName, agentKey) => {
    try {
        const response = await axios.post(`${API_URL}/sessions/start`, {
            station_code: stationId,
            agent_key: agentKey,
            card_uid: cardId,
            student_id: studentId,
            student_name: studentName
        });

        if (response.data.success) {
            console.log(`[SESSION STARTED] ID: ${response.data.session.session_uuid}`);
            return {
                sessionId: response.data.session.session_uuid,
                token: response.data.token, // Le token JWT généré pour le SSO
                card_id: cardId,
                student_id: studentId,
                student_name: studentName,
                startTime: response.data.session.start_time,
                status: 'active'
            };
        }
    } catch (error) {
        console.error('[SESSION ERROR] Failed to start:', error);
        return null; 
    }
};

export const endSession = async (session, reason = 'user_logout') => {
    console.log('[DEBUG] endSession called with:', session);
    if (!session || !session.sessionId) {
        console.error('[DEBUG] No sessionId found in session object');
        return;
    }

    try {
        console.log(`[DEBUG] Sending end request for ${session.sessionId}`);
        await axios.post(`${API_URL}/sessions/end`, {
            session_uuid: session.sessionId,
            reason: reason
        });
        console.log('[DEBUG] Session ended successfully backend side');
    } catch (error) {
        console.error('[SESSION ERROR] Failed to end:', error);
    }
    
    return {
        ...session,
        endTime: new Date().toISOString(),
        status: 'closed',
        closeReason: reason
    };
};

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const STATION_ID = import.meta.env.VITE_STATION_ID || 'STATION_DEV';

function App() {
    const [locked, setLocked] = useState(true);
    const [statusMessage, setStatusMessage] = useState('Veuillez scanner votre carte YOOL');
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Simulate Card Scan Event Listener
        const handleKeyDown = (e) => {
            // In production, this would parse the RFID string
            // For demo: Press 'Enter' to simulate a scan
            if (e.key === 'Enter' && locked && !loading) {
                handleCardScan("MOCK_CARD_12345");
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [locked, loading]);

    const handleCardScan = async (cardId) => {
        setLoading(true);
        setStatusMessage('Validation en cours...');

        try {
            const response = await axios.post(`${API_URL}/sessions/start`, {
                station_code: STATION_ID,
                card_uid: cardId
            });

            if (response.data.success) {
                setLocked(false);
                setSession(response.data.session);
                setStatusMessage('Session active');
                // Notify Main Process to allow minimizing if needed
                // window.ipcRenderer.send('unlock-request');
            } else {
                setStatusMessage('Accès refusé: ' + response.data.message);
                setTimeout(() => setStatusMessage('Veuillez scanner votre carte YOOL'), 3000);
            }
        } catch (error) {
            console.error(error);
            setStatusMessage('Erreur de connexion serveur');
            setTimeout(() => setStatusMessage('Veuillez scanner votre carte YOOL'), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (!session) return;
        try {
            await axios.post(`${API_URL}/sessions/end`, {
                session_uuid: session.session_uuid
            });
        } catch (e) {
            console.error("Error ending session", e);
        }
        setSession(null);
        setLocked(true);
        setStatusMessage('Veuillez scanner votre carte YOOL');
    };

    if (locked) {
        return (
            <div className="lock-screen">
                <div className="lock-container">
                    <h1>YOOL STATION</h1>
                    <div className="status-box">
                        <p className={loading ? 'blink' : ''}>{statusMessage}</p>
                    </div>
                    <p className="instruction">Posez votre carte sur le lecteur pour déverrouiller ce poste.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="desktop-screen">
            <div className="toolbar">
                <span>Poste: {STATION_ID}</span>
                <span>Utilisateur: {session?.student_name || 'Etudiant'}</span>
                <button onClick={handleLogout} className="logout-btn">Fin de session</button>
            </div>
            <div className="content">
                <h2>Bienvenue</h2>
                <p>Vous pouvez utiliser ce poste.</p>
                <p>N'oubliez pas de vous déconnecter en partant.</p>
            </div>
        </div>
    );
}

export default App;

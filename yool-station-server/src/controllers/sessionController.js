const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const module1Service = require('../services/module1Service');

// Start Session
exports.startSession = async (req, res) => {
    const { station_code, card_uid } = req.body;

    if (!station_code || !card_uid) {
        return res.status(400).json({ success: false, message: 'Missing station_code or card_uid' });
    }

    try {
        // 1. Validate Station
        const [stations] = await db.query('SELECT id, status FROM stations WHERE station_code = ?', [station_code]);
        let stationId;

        if (stations.length === 0) {
            // Auto-register station for dev convenience, or reject in strict mode
            // For this MVP, we create it if not exists
            const result = await db.query('INSERT INTO stations (station_code, status) VALUES (?, ?)', [station_code, 'online']);
            stationId = result.insertId;
        } else {
            stationId = stations[0].id;
            // Optional: Check if station is in maintenance
        }

        // 2. Validate Card via Module 1
        const verification = await module1Service.verifyCard(card_uid);

        if (!verification.valid) {
            await db.query('INSERT INTO station_logs (station_id, log_type, category, message) VALUES (?, ?, ?, ?)',
                [stationId, 'warning', 'auth', `Failed login attempt with card ${card_uid}: ${verification.reason}`]);

            return res.status(403).json({ success: false, message: verification.reason });
        }

        // 3. Create Session
        const sessionUuid = uuidv4();
        await db.query(
            'INSERT INTO sessions (session_uuid, station_id, student_id, card_uid, status) VALUES (?, ?, ?, ?, ?)',
            [sessionUuid, stationId, verification.student.id, card_uid, 'active']
        );

        // 4. Log Success
        await db.query('INSERT INTO station_logs (station_id, log_type, category, message) VALUES (?, ?, ?, ?)',
            [stationId, 'info', 'auth', `Session started for ${verification.student.name}`]);

        res.json({
            success: true,
            session: {
                session_uuid: sessionUuid,
                student_name: verification.student.name,
                start_time: new Date()
            }
        });

    } catch (error) {
        console.error('Start Session Error:', error);
        res.status(500).json({ success: false, message: 'Server Internal Error' });
    }
};

// End Session
exports.endSession = async (req, res) => {
    const { session_uuid } = req.body;

    if (!session_uuid) {
        return res.status(400).json({ success: false, message: 'Missing session_uuid' });
    }

    try {
        await db.query(
            'UPDATE sessions SET end_time = NOW(), status = ? WHERE session_uuid = ? AND status = ?',
            ['completed', session_uuid, 'active']
        );

        res.json({ success: true, message: 'Session ended' });
    } catch (error) {
        console.error('End Session Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Heartbeat
exports.heartbeat = async (req, res) => {
    const { station_code } = req.body;
    try {
        await db.query(
            'UPDATE stations SET last_seen = NOW(), status = ? WHERE station_code = ?',
            ['online', station_code]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

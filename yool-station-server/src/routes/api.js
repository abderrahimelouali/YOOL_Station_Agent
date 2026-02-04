const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Routes definitions
router.post('/sessions/start', sessionController.startSession);
router.post('/sessions/end', sessionController.endSession);
router.post('/stations/heartbeat', sessionController.heartbeat);

// Placeholder for logs
router.post('/logs', (req, res) => {
    // TODO: Implement log ingestion
    res.json({ success: true });
});

module.exports = router;

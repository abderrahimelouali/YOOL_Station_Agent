# =============================================================================
# YOOL STATION SERVER - INIT SQL (DOCKER)
# =============================================================================
# Fichier exécuté automatiquement au premier démarrage du conteneur MySQL
# Crée les tables et insère les données de test

USE yool_station_db;

-- Table des stations
CREATE TABLE IF NOT EXISTS stations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    agent_key VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des cartes
CREATE TABLE IF NOT EXISTS cards (
    card_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    status ENUM('active', 'suspended', 'expired', 'revoked') DEFAULT 'active',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des JTI (anti-replay SSO)
CREATE TABLE IF NOT EXISTS jti_used (
    jti VARCHAR(255) PRIMARY KEY,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des sessions
CREATE TABLE IF NOT EXISTS station_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    card_id VARCHAR(50) NOT NULL,
    station_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50),
    student_name VARCHAR(255),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    end_reason VARCHAR(50),
    status ENUM('active', 'ended') DEFAULT 'active',
    INDEX idx_card (card_id),
    INDEX idx_station (station_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- DONNÉES DE TEST
-- =============================================================================

-- Insertion d'une station de test
INSERT INTO stations (id, name, location, agent_key, status, last_seen) 
VALUES ('STATION_0001', 'Station de Test', 'Salle A101', 'demo_agent_key_001', 'active', NOW())
ON DUPLICATE KEY UPDATE last_seen = NOW();

-- Insertion de cartes de test avec différents statuts
INSERT INTO cards (card_id, student_id, student_name, status, expires_at) VALUES
-- ✅ Carte Active
('QRMLHY43AHXV7ZVF', 'STU_001', 'Ahmed Bennani', 'active', DATE_ADD(NOW(), INTERVAL 1 YEAR)),

-- ✅ Carte Active (pour tests SSO)
('QRMLFJQPENAKVGW3', 'STU_002', 'Fatima Alaoui', 'active', DATE_ADD(NOW(), INTERVAL 1 YEAR)),

-- ⛔ Carte Suspendue
('QRMLFJQ1K0BOJ0XU', 'STU_003', 'Mohammed El Fassi', 'suspended', DATE_ADD(NOW(), INTERVAL 1 YEAR)),

-- 🗿 Carte Révoquée
('QRMLGRQZFW8T1HCT', 'STU_004', 'Sara Idrissi', 'revoked', DATE_ADD(NOW(), INTERVAL 1 YEAR)),

-- ⚰️ Carte Expirée
('QRMLGRRH07P8JV1Y', 'STU_005', 'Youssef Tazi', 'active', DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE student_name = VALUES(student_name);

-- =============================================================================
-- NETTOYAGE AUTOMATIQUE DES JTI EXPIRÉS (EVENT SCHEDULER)
-- =============================================================================
SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS cleanup_expired_jti
ON SCHEDULE EVERY 1 HOUR
DO
  DELETE FROM jti_used WHERE expires_at < NOW();

-- Schema Base de Données YOOL Station Agent

-- Table des stations (postes)
CREATE TABLE IF NOT EXISTS stations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  station_code VARCHAR(50) NOT NULL UNIQUE, -- Identifiant unique (ex: STA-LAB1-01)
  name VARCHAR(100), -- Nom lisible
  location VARCHAR(100), -- Emplacement physique
  ip_address VARCHAR(45), -- IPv4 ou IPv6
  status ENUM('online', 'offline', 'maintenance') DEFAULT 'offline',
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des sessions (utilisations)
CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_uuid VARCHAR(36) NOT NULL UNIQUE, -- UUID généré par le serveur
  station_id INT NOT NULL,
  student_id VARCHAR(50) NOT NULL, -- ID étudiant provenant du Module 1
  card_uid VARCHAR(50), -- UID de la carte utilisée
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP NULL,
  status ENUM('active', 'completed', 'terminated_forcefully') DEFAULT 'active',
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
  INDEX idx_student_date (student_id, start_time),
  INDEX idx_active_sessions (station_id, status)
);

-- Table des logs d'audit
CREATE TABLE IF NOT EXISTS station_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  station_id INT,
  log_type ENUM('info', 'warning', 'error', 'security') DEFAULT 'info',
  category VARCHAR(50), -- ex: 'auth', 'heartbeat', 'system'
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE SET NULL
);

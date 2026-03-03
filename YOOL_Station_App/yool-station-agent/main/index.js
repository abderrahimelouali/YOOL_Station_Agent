/**
 * ============================================================================
 * YOOL STATION AGENT - MAIN PROCESS (ELECTRON)
 * ============================================================================
 * Gère le cycle de vie de l'application, le mode Kiosk, et l'interaction
 * avec le système d'exploitation.
 * ============================================================================
 */

const { app, BrowserWindow, ipcMain, powerMonitor, shell, globalShortcut, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let inactivityInterval;
let isLocked = true; // État par défaut : Station verrouillée sur l'interface de scan
let idleThresholdSeconds = 60; // Seuil d'inactivité par défaut (60s pour test)

/**
 * CRÉATION DE LA FENÊTRE PRINCIPALE
 * --------------------------------
 */
function createWindow() {
    // Suppression de la barre de menu par défaut (Fichier, Édition, etc.)
    Menu.setApplicationMenu(null); 

    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        title: "YOOL Scan Station",
        icon: path.join(__dirname, '../renderer/assets/yool-icon.png'),
        
        /**
         * CONFIGURATION PRODUCTION (KIOSK)
         * -------------------------------
         * Activé automatiquement si process.env.NODE_ENV !== 'development'
         */
        kiosk: true,            // Force le mode Kiosk
        fullscreen: true,       // Force le plein écran
        alwaysOnTop: true,      // Reste au-dessus
        // -----------------------------------------

        frame: false,             // Supprime le cadre OS
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, 
            webSecurity: false       
        },
    });

    // Détermination de l'URL à charger (Dev vs Prod)
    const startURL = isDev
        ? 'http://127.0.0.1:5174'
        : `file://${path.join(__dirname, '../dist/renderer/index.html')}`;

    console.log('[SYSTEM] Chargement de l\'interface:', startURL);
    
    // Logique de chargement avec tentative de reconnexion (évite les erreurs pendant le démarrage de Vite)
    const loadURLWithRetry = (url, retries = 5) => {
        mainWindow.loadURL(url).catch(e => {
            console.error('[FATAL] Impossible de charger l\'URL:', e.message);
            
            // Affiche une erreur native si le chargement échoue (visible même sur écran blanc)
            if (retries === 0) {
                const { dialog } = require('electron');
                dialog.showErrorBox('Erreur de Chargement', `Impossible de charger l'interface.\nURL: ${url}\nErreur: ${e.message}`);
            }

            if (retries > 0) {
                console.log(`[RETRY] Tentative de connexion... (${retries} restantes)`);
                setTimeout(() => loadURLWithRetry(url, retries - 1), 1000);
            }
        });
    };

    loadURLWithRetry(startURL);

    mainWindow.on('closed', () => (mainWindow = null));

    /**
     * BLOCAGE DE LA FERMETURE (PRODUCTION)
     * Empêche l'utilisateur de fermer l'appli (Alt+F4, clic sur X, taskbar, etc.)
     */
    mainWindow.on('close', (e) => {
        e.preventDefault(); // Bloque TOUTE tentative de fermeture
        console.log('[SECURITY] Tentative de fermeture bloquée');
    });

    // Démarrage de la surveillance d'inactivité
    startIdleCheck();
}

/**
 * SURVEILLANCE DE L'INACTIVITÉ
 * ----------------------------
 * Utilise powerMonitor pour détecter quand l'utilisateur ne touche plus au PC.
 */
function startIdleCheck() {
    inactivityInterval = setInterval(() => {
        if (isLocked) return; 

        const idleTime = powerMonitor.getSystemIdleTime();
        
        if (idleTime >= idleThresholdSeconds) {
            console.log(`[IDLE] ${idleTime}s d'inactivité. Verrouillage de la station...`);
            lockStation();
        }
    }, 5000); // Vérification toutes les 5 secondes
}

/**
 * VERROUILLAGE DE LA STATION
 * --------------------------
 * Ramène l'application au premier plan et prévient l'interface (Logout).
 */
function lockStation(notifyRenderer = true) {
    isLocked = true;
    if (mainWindow) {
        console.log('[SYSTEM] Verrouillage Kiosque (Plein Écran)');
        
        // Force les paramètres restrictifs
        mainWindow.setKiosk(true);
        mainWindow.setFullScreen(true);
        mainWindow.setAlwaysOnTop(true, "screen-saver");
        mainWindow.restore();
        mainWindow.focus();
        
        if (notifyRenderer) {
            mainWindow.webContents.send('session-timeout');
        }
    }
}

/**
 * DÉVERROUILLAGE DE LA STATION
 * ----------------------------
 * Autorise l'accès au bureau après un scan de carte réussi.
 */
function unlockStation(timeoutMinutes) {
    isLocked = false;
    if (timeoutMinutes) {
        idleThresholdSeconds = timeoutMinutes * 60;
        console.log(`[SYSTEM] Seuil d'inactivité mis à jour : ${idleThresholdSeconds}s`);
    }

    if (mainWindow) {
        console.log('[SYSTEM] Déverrouillage : Accès Bureau autorisé');
        
        // Libère les restrictions pour permettre la réduction
        mainWindow.setKiosk(false);
        mainWindow.setFullScreen(false);
        mainWindow.setAlwaysOnTop(false);
        mainWindow.minimize(); 
    }
}

/**
 * ÉVÉNEMENTS GLOBAUX DE L'APPLICATION
 * -----------------------------------
 */
app.on('ready', () => {
    createWindow();
    
    /**
     * BLOCAGE DES RACCOURCIS DE SÉCURITÉ (PRODUCTION)
     * ----------------------------------------------
     * Empêche l'utilisateur de quitter l'interface contrôlée.
     */
    if (!isDev) {
        globalShortcut.register('Alt+F4', () => console.warn('[SECURITY] Alt+F4 bloqué'));
        globalShortcut.register('Ctrl+W', () => console.warn('[SECURITY] Ctrl+W bloqué'));
        globalShortcut.register('Alt+Tab', () => console.warn('[SECURITY] Alt+Tab bloqué'));
        globalShortcut.register('CommandOrControl+Q', () => console.warn('[SECURITY] Ctrl+Q bloqué'));
        globalShortcut.register('F11', () => console.warn('[SECURITY] F11 bloqué'));
        
        // Désactivation de la touche Windows / Search
        globalShortcut.register('Meta', () => console.warn('[SECURITY] Touche Windows bloquée'));
    }
    // --------------------------------------------------------
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});

/**
 * COMMUNICATION INTER-PROCESSUS (IPC)
 * -----------------------------------
 * Permet à l'interface (React) de commander le système Electron.
 */

// Demande de déverrouillage (suite à scan valide)
ipcMain.on('unlock-request', (event, arg) => {
    console.log('[IPC] Demande de déverrouillage reçue');
    unlockStation(arg?.timeout || 15);
});

// Demande de verrouillage (bouton Quitter ou Inactivité UI)
ipcMain.on('lock-request', (event) => {
    console.log('[IPC] Demande de verrouillage manuelle');
    lockStation(false);
});

// Ouverture d'URL externe (Basculement vers SSO Laravel)
ipcMain.on('open-url', (event, url) => {
    if (url) {
        // Masquage du token dans les logs pour la sécurité
        const maskedUrl = url.replace(/token=[^&]+/, 'token=***HIDDEN***');
        console.log('[IPC] Ouverture URL SSO:', maskedUrl);
        shell.openExternal(url);
    }
});

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        kiosk: !isDev, // Kiosk mode via Kiosk user in Production
        fullscreen: !isDev,
        alwaysOnTop: !isDev, // Lock screen behavior
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For simplicity in this demo, use preload in prod
            webSecurity: false
        },
    });

    const startURL = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../dist/renderer/index.html')}`;

    mainWindow.loadURL(startURL);

    mainWindow.on('closed', () => (mainWindow = null));

    // Prevent closing in production
    if (!isDev) {
        mainWindow.on('close', (e) => {
            e.preventDefault(); // Block close
        });
    }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// IPC communication placeholders
ipcMain.on('unlock-request', (event, arg) => {
    console.log('Unlock requested', arg);
    // Logic to validate and unlock (e.g. minimize or close kiosk window if allowed)
    // For a station agent, we usually just change the UI state, not close the app.
});

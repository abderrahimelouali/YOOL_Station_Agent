import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

/**
 * COMPOSANT : SCANNER QR (PRODUCTION READY)
 * ---------------------------------------
 * Utilise la bibliothèque Html5Qrcode pour une lecture fluide et performante.
 * Gère les permissions, l'affichage vidéo, et le nettoyage des ressources.
 */
function QRScanner({ onScanSuccess, onClose, t = {} }) {
  const [error, setError] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const scannerRef = useRef(null);
  const containerId = "qr-reader";

  /**
   * ARRÊT DE LA CAMÉRA & NETTOYAGE
   * ------------------------------
   * Indispensable pour éviter que la caméra ne reste allumée en arrière-plan.
   */
  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
        console.log('[QR Scanner] Stopped');
      } catch (err) {
        console.warn('[QR Scanner] Stop error:', err);
      } finally {
        scannerRef.current = null;
        setHasStarted(false);
      }
    }
  };

  const handleStart = async () => {
    if (scannerRef.current) return;
    
    setError('');
    setHasStarted(true);
    
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode(containerId);
        scannerRef.current = scanner;
        
        console.log('[QR Scanner] Starting camera...');
        
        const config = {
          fps: 15,
          qrbox: { width: 350, height: 220 },
          aspectRatio: 1.6
        };

        await scanner.start(
          { facingMode: "user" },
          config,
          (decodedText) => {
            console.log(`[QR Scanner] Scanned: ${decodedText}`);
            stopCamera().then(() => onScanSuccess(decodedText));
          },
          (errorMessage) => {
            // Standard scan noise
          }
        );
      } catch (err) {
        console.error('[QR Scanner] Start error:', err);
        setError(t.camera_error);
        setHasStarted(false);
        scannerRef.current = null;
      }
    }, 50);
  };

  const handleClose = async () => {
    await stopCamera();
    onClose();
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {}).finally(() => {
          scannerRef.current.clear().catch(() => {});
        });
      }
    };
  }, []);

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-modal">
        <div className="qr-scanner-header">
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            {t.scan_title}
          </h2>
          <button className="close-btn" onClick={handleClose} aria-label="Fermer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {error && (
          <div className="error-banner">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             {error}
          </div>
        )}

        <div className={`qr-reader-container ${hasStarted ? 'active' : ''}`}>
           <div id={containerId}></div>
           {!hasStarted && (
             <div className="qr-scanner-placeholder">
               <div className="qr-icon-hero">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
               </div>
               <p>{t.camera_permission_msg}</p>
             </div>
           )}
        </div>

        <div className="qr-scanner-footer">
          {!hasStarted && (
            <button className="btn primary" onClick={handleStart}>
              {t.start_scanner_btn}
            </button>
          )}
          <button className="btn secondary" onClick={handleClose}>
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRScanner;

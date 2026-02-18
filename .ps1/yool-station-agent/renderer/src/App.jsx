import React, { useEffect, useMemo, useState, useRef } from "react";
import "./index.css";
import logo from "../assets/yool-logo.png";
import { verifyCard } from "./services/cardVerifyApi";
import { startSession, endSession } from "./services/stationLogs";
import { translations } from "./translations";
import QRScanner from "./components/QRScanner";

/**
 * CONFIGURATION GLOBALE
 * Extraite des variables d'environnement (Vite)
 */
const STATION_ID = import.meta.env.VITE_STATION_ID || "STATION_0001";
const AGENT_KEY = import.meta.env.VITE_AGENT_KEY || "";
const USE_VERIFY = String(import.meta.env.VITE_USE_VERIFY_API || "true") === "true";
const INACTIVITY_TIMEOUT = Number(import.meta.env.VITE_INACTIVITY_TIMEOUT || 15);
const PLATFORM_URL = import.meta.env.VITE_PLATFORM_URL || "https://certifications.web4jobs.ma/"

/**
 * COMPOSANT PRINCIPAL (STATION AGENT)
 * Gère le verrouillage, le scan de carte et la journalisation des sessions.
 */
function App() {
  // États de Verrouillage & Chargement
  const [locked, setLocked] = useState(true);
  const [loading, setLoading] = useState(false);

  // État de l'Interface Utilisateur (Status UI)
  const [status, setStatus] = useState("idle");
  const [customMsg, setCustomMsg] = useState("");

  // Gestion de Session
  const [session, setSession] = useState(null);
  const [manualId, setManualId] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Multilingue
  const [lang, setLang] = useState("fr");
  const t = translations[lang];
  const isRTL = lang === "ar";

  // Références
  const sessionRef = useRef(session);
  const inputRef = useRef(null);

  // Synchronisation de la ref avec l'état
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  /**
   * EFFET : SMART FOCUS POUR MATÉRIEL EXTERNE (QR / RFID)
   * Garde le focus sur le champ de saisie pour les lecteurs fonctionnant en "Keyboard Wedge".
   */
  useEffect(() => {
    if (locked && !showQRScanner) {
      // Focus initial
      const timer = setTimeout(() => inputRef.current?.focus(), 100);

      // Re-focus si clic ailleurs
      const handleGlobalClick = (e) => {
        // Ne pas re-focus si on clique sur un bouton ou un sélecteur de langue
        if (e.target.closest('button') || e.target.closest('.langBtn')) return;
        inputRef.current?.focus();
      };

      window.addEventListener("click", handleGlobalClick);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("click", handleGlobalClick);
      };
    }
  }, [locked, showQRScanner]);

  /**
   * EFFET : ÉCOUTE DES ÉVÉNEMENTS SYSTEME (IPC ELECTRON)
   * Gère le timeout d'inactivité envoyé par le processus Main d'Electron.
   */
  useEffect(() => {
    if (window.require) {
       const { ipcRenderer } = window.require('electron');

       const onTimeout = async () => {
          console.log("[IPC] Timeout d'inactivité reçu.");
          await handleLogout("inactivity");
       };

       ipcRenderer.on('session-timeout', onTimeout);

       return () => {
          ipcRenderer.removeListener('session-timeout', onTimeout);
       };
    }
  }, []);
  // manual input
  // ✅ TEST/DEMO CARDS
  const DEMO_CARD_ID = useMemo(() => {
    // Décommentez la ligne souhaitée pour tester différents scénarios
    return "QRMLHY43AHXV7ZVF"; // ✅ Card Active
    // return "QRMLFJQPENAKVGW3"; // ✅ Card Active for test (sso)
    // return "QRMLFJQ1K0BOJ0XU"; // ⛔ Card Suspended
    // return "QRMLGRQZFW8T1HCT"; // 🗿 Card Revoked
    // return "QRMLGRRH07P8JV1Y"; // ⚰️ Card Expired
  }, []);

  /**
   * EFFET : RACCOURCIS CLAVIERS & GESTION DU FOCUS
   * --------------------------------------------
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape permet de verrouiller manuellement la session (Logout)
      if (e.key === "Escape" && !locked && !loading) {
        handleLogout("user_logout");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [locked, loading]);

  /**
   * RÉINITIALISATION DE L'ÉCRAN D'ACCUEIL
   */
  const setIdle = () => {
    setStatus("idle");
    setCustomMsg("");
  };

  // --- MAPPING SIMPLE POUR LES TITRES/TEXTES ---
  const uiStrings = {
    idle: { title: t.scan_please, text: t.scan_hint },
    loading: { title: t.verifying, text: t.wait_moment },
    ok: { title: t.access_granted, text: customMsg || t.session_started },
    not_found: { title: t.unknown_card, text: t.unknown_card_msg },
    suspended: { title: t.suspended_access, text: t.suspended_msg },
    expired: { title: t.expired_card, text: t.expired_msg },
    revoked: { title: t.revoked_card, text: t.revoked_msg },
    error: { title: t.access_denied, text: customMsg || t.access_denied_msg },
  };
  const { title: statusTitle, text: statusText } = uiStrings[status] || uiStrings.error;

  /**
   * CLASSIFICATION DES ERREURS SERVEUR
   * @param {string} backendMessage
   * @param {string} backendStatus
   * @returns {string} type d'erreur UI
   */
  const classifyDenied = (backendMessage, backendStatus) => {
    const msg = String(backendMessage || "").toLowerCase();
    const st = String(backendStatus || "").toLowerCase();

    if (st.includes("suspend") || msg.includes("suspend")) return "suspended";
    if (st.includes("expire") || msg.includes("expire")) return "expired";
    if (st.includes("revoke") || msg.includes("revoke")) return "revoked";

    return "error";
  };

  /**
   * UTILITAIRE : MISE À JOUR VISUELLE DU STATUT
   * ------------------------------------------
   * @param {string} kind - Type de statut (ok, error, loading, etc.)
   * @param {string} message - Message personnalisé optionnel
   */
  const applyStatus = (kind, message) => {
    setStatus(kind);
    if (message) setCustomMsg(message);
    else if (kind === "idle") setCustomMsg("");
  };

  /**
   * POINT D'ENTRÉE : SCAN DE CARTE / VÉRIFICATION
   * @param {string} cardId
   */
  const handleCardScan = async (cardId) => {
    if (!cardId) return;

    setLoading(true);
    applyStatus("loading");

    try {
      if (!USE_VERIFY) {
        applyStatus("error", "verify_disabled");
        return;
      }

      // 1. Appel au Proxy local (Station Server)
      const verify = await verifyCard(cardId, STATION_ID, AGENT_KEY);

      if (!verify?.success) {
        applyStatus("error", verify.message || "invalid_server_response");
        return;
      }

      // Cas : Carte trouvée mais invalide (suspendue, expirée, etc.)
      if (!verify.valid) {
        const deniedKind = classifyDenied(verify.message, verify?.data?.status);
        applyStatus(deniedKind);
        setTimeout(() => setIdle(), 5000);
        return;
      }

      // 2. LOGIQUE SI OK
      // Extraction des données étudiant
      const studentId = verify?.data?.student_id || verify?.student_id || t.id_unknown;
      const studentName = verify?.data?.student_name || verify?.student_name || t.student_unknown;
      const actualCardId = verify?.data?.card_id || verify?.card_id || cardId;

      // 3. ENREGISTREMENT DE SESSION (Backend Local)
      const sessLog = await startSession(actualCardId, STATION_ID, studentId, studentName, AGENT_KEY);

      if (sessLog) {
          setSession(sessLog);
      }

      // 4. DÉVERROUILLAGE (Signal vers Electron Main)
      if (window.require) {
          const { ipcRenderer } = window.require('electron');
          ipcRenderer.send('unlock-request', { timeout: INACTIVITY_TIMEOUT });

          // 5. OUVERTURE PLATEFORME (SSO Start)
          // On joint le token JWT généré pour l'authentification côté plateforme
          const ssoUrl = verify.sso_url || PLATFORM_URL;
          const separator = ssoUrl.includes('?') ? '&' : '?';
          const finalUrl = `${ssoUrl}${separator}token=${sessLog?.token || ""}`;
          
          ipcRenderer.send('open-url', finalUrl);
      }

      applyStatus("ok", "open_platform");

      setTimeout(() => {
        setLocked(false);
      }, 500);

    } catch (error) {
      const code = error?.response?.status;
      const serverMsg = error?.response?.data?.message;

      if (code === 401) {
        applyStatus("error", t.agent_key_error);
      } else if (code === 403) {
        // Affiche le message explicatif du serveur (Station en attente, etc.)
        applyStatus("error", serverMsg || t.pending_station);
      } else if (code === 404) {
        applyStatus("not_found");
      } else {
        applyStatus("error", t.network_error);
      }

      setTimeout(() => setIdle(), 15000);
    } finally {
      setLoading(false);
    }
  };

  /**
   * DÉCONNEXION / RE-VERROUILLAGE
   * @param {string} reason 'user_logout' | 'inactivity'
   */
  const handleLogout = async (reason = "user_logout") => {
    console.log('[DEBUG] handleLogout triggered. Reason:', reason);
    
    // On utilise la ref pour être certain d'avoir la session la plus récente
    // (Crucial pour les appels depuis powerMonitor/IPC)
    const currentSession = sessionRef.current;
    console.log('[DEBUG] currentSession from ref:', currentSession);

    // Fermeture propre au backend si une session était active
    if (currentSession) {
      try {
        console.log('[DEBUG] Calling endSession...');
        await endSession(currentSession, reason);
      } catch (error) {
        console.error('[handleLogout] Erreur backend:', error);
      }
    } else {
        console.warn('[DEBUG] No active session to close.');
    }

    // Signal de verrouillage (Electron Main)
    if (window.require) {
       const { ipcRenderer } = window.require('electron');
       ipcRenderer.send('lock-request');
    }

    setSession(null);
    setLocked(true);
    setManualId("");
    setIdle();
  };

  /**
   * UTILITAIRE : RENDU DE L'UI DE VERROUILLAGE
   */
  if (locked) {
    return (
      <div className="ui" dir={isRTL ? "rtl" : "ltr"}>
        <header className="top">
          <div className="brand">
            <img src={logo} alt="YOOL" className="logoImg" />
            <div className="brandMeta">
              <div className="brandTitle">YOOL Scan Station</div>
              <div className="brandSub">{t.poste}: {STATION_ID}</div>
            </div>
          </div>
          <div className="topActions">
            <LanguageSwitcher current={lang} onSelect={setLang} />
          </div>
        </header>

        <main className="wrap">
          <section className="card">
            <div className="titleRow">
              <div>
                <h1 className="h1">{statusTitle}</h1>
                <p className="muted">{statusText}</p>
              </div>

              <button
                className="btn primary"
                onClick={() => setShowQRScanner(true)}
                disabled={loading}
              >
                {t.scan_title}
              </button>
            </div>

            <div className="resultArea">
              {status === "idle" ? (
                <div className="emptyHint">
                  {t.scanning_instruction}
                </div>
              ) : (
                <StatusCard status={status} title={statusTitle} text={statusText} />
              )}
            </div>

            <div className="manualBox">
              <label className="label">{t.manual_input}</label>
              <form className="inputRow" onSubmit={(e) => { e.preventDefault(); handleCardScan(manualId.trim()); }}>
                <input
                  ref={inputRef}
                  className="input mono"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  placeholder={t.card_id_placeholder}
                  disabled={loading}
                  autoComplete="off"
                />
                <button className="btn" type="submit" disabled={loading || !manualId.trim()}>
                  {t.verify}
                </button>
              </form>
              <div className="footer">
                <span className="muted">{t.esc_reset}</span>
                <span className="muted mono">{t.station}: {STATION_ID}</span>
              </div>
            </div>
          </section>
        </main>

        {/* Toasts de notification */}
        {status === "loading" && <Toast type="warn" text={t.loading_toast} />}
        {status === "ok" && <Toast type="ok" text={t.redirect_toast} />}
        {(status === "suspended" || status === "expired" || status === "revoked" || status === "not_found" || status === "error") && (
          <Toast type="bad" text={statusTitle} />
        )}

        {/* Scanner QR Code Modal */}
        {showQRScanner && (
          <QRScanner
            t={t}
            onScanSuccess={(cardId) => {
              setShowQRScanner(false);
              handleCardScan(cardId);
            }}
            onClose={() => setShowQRScanner(false)}
          />
        )}
      </div>
    );
  }

  // Screen after unlock
  return (
    <div className="ui" dir={isRTL ? "rtl" : "ltr"}>
      <header className="top">
        <div className="brand">
          <img src={logo} alt="YOOL" className="logoImg" />
          <div className="brandMeta">
            <div className="brandTitle">YOOL Scan Station</div>
            <div className="brandSub">{t.poste}: {STATION_ID}</div>
          </div>
        </div>
        <div className="topActions">
          <LanguageSwitcher current={lang} onSelect={setLang} />
          <button className="btn danger tiny" onClick={() => handleLogout("user_logout")}>
            {t.lock}
          </button>
        </div>
      </header>

      <main className="wrap">
        <section className="card big">
          <h1 className="h1">{t.welcome}</h1>
          <p className="muted">{t.welcome_msg}</p>

          <div className="grid3">
            <div className="kv">
              <div className="k">{t.user}</div>
              <div className="v">{session?.student_name || t.user}</div>
            </div>
            <div className="kv">
              <div className="k">{t.card}</div>
              <div className="v mono">{session?.card_id || "-"}</div>
            </div>
            <div className="kv">
              <div className="k">{t.status}</div>
              <div className="v">{session?.status || t.active}</div>
            </div>
          </div>

          <div className="hint">
            {t.shortcuts_hint}
          </div>
        </section>
      </main>
    </div>
  );
}

function LanguageSwitcher({ current, onSelect }) {
  const langs = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
    { code: "ar", label: "عربي" },
  ];

  return (
    <div className="langSwitcher">
      {langs.map((l) => (
        <button
          key={l.code}
          className={`langBtn ${current === l.code ? "active" : ""}`}
          onClick={() => onSelect(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}



function StatusCard({ status, title, text }) {
  const map = {
    loading: { cls: "warn", icon: "⏳" },
    ok: { cls: "ok", icon: "✅" },
    not_found: { cls: "not_found", icon: "🔍" },
    suspended: { cls: "suspended", icon: "⏸️" },
    expired: { cls: "expired", icon: "📅" },
    revoked: { cls: "revoked", icon: "🚫" },
    error: { cls: "bad", icon: "⚠️" },
  };
  const s = map[status] || map.error;

  return (
    <div className={`statusCard ${s.cls}`}>
      <div className="statusIcon">{s.icon}</div>
      <div>
        <div className="statusTitle">{title}</div>
        <div className="statusSub">{text}</div>
      </div>
    </div>
  );
}

function Toast({ type = "ok", text }) {
  return (
    <div className={`toast ${type}`}>
      <span className="toastDot" />
      <span>{text}</span>
    </div>
  );
}

export default App;

import { useEffect, useRef, useCallback } from 'react';

// Common events to track user activity

const EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

/**
 * useInactivityLock
 * Execute un callback après X minutes d'inactivité.
 * @param {Function} onTimeout - Action à effectuer (ex: logout)
 * @param {number} timeoutMinutes - Durée en minutes avant timeout
 * @param {boolean} isActive - Si le hook doit être actif (ex: utilisateur connecté)
 */
export function useInactivityLock(onTimeout, timeoutMinutes = 15, isActive = true) {
    const timerRef = useRef(null);
    const lastActivityRef = useRef(Date.now());

    // Convert minutes to ms
    const timeoutMs = timeoutMinutes * 60 * 1000;

    const resetTimer = useCallback(() => {
        if (!isActive) return;

        lastActivityRef.current = Date.now();
        
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            // Double check timestamp to be safe (in case of weird timer behavior)
            const now = Date.now();
            if (now - lastActivityRef.current >= timeoutMs) {
                console.log(`[INACTIVITY] Timeout reached (${timeoutMinutes}m). Locking...`);
                onTimeout();
            }
        }, timeoutMs);
    }, [isActive, timeoutMs, onTimeout, timeoutMinutes]);

    useEffect(() => {
        if (!isActive) {
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }

        // Initial start
        resetTimer();

        // Throttle verify to avoid too many clears (optional, but good for performance on mousemove)
        let throttleTimer = null;
        const handleActivity = () => {
            if (!throttleTimer) {
                throttleTimer = setTimeout(() => {
                    resetTimer();
                    throttleTimer = null;
                }, 1000); // Check/Reset at most once per second
            }
        };

        // Attach listeners
        EVENTS.forEach(event => window.addEventListener(event, handleActivity));

        // Cleanup
        return () => {
            EVENTS.forEach(event => window.removeEventListener(event, handleActivity));
            if (timerRef.current) clearTimeout(timerRef.current);
            if (throttleTimer) clearTimeout(throttleTimer);
        };
    }, [isActive, resetTimer]);
}

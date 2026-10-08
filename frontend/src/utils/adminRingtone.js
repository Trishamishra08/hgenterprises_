/**
 * Incoming video-call ringtone for admin panel (production-safe public asset).
 * Place file at: frontend/public/vc-incoming-ring.wav
 */
const RING_SRC = `${import.meta.env.BASE_URL || '/'}vc-incoming-ring.wav`;

let sharedAudio = null;
let unlocked = false;

const MUTE_KEY = 'hg_admin_ring_muted';

export function isAdminRingMuted() {
    try {
        return localStorage.getItem(MUTE_KEY) === '1';
    } catch (_) {
        return false;
    }
}

export function setAdminRingMuted(muted) {
    try {
        localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch (_) {
        /* ignore (private browsing / storage disabled) */
    }
}

function getAudio() {
    if (typeof window === 'undefined') return null;
    if (!sharedAudio) {
        sharedAudio = new Audio(RING_SRC);
        sharedAudio.preload = 'auto';
        sharedAudio.volume = 1;
    }
    return sharedAudio;
}

/** Call once after any admin click so browsers allow later autoplay. */
export function unlockAdminRingtone() {
    const audio = getAudio();
    if (!audio || unlocked) return;
    audio
        .play()
        .then(() => {
            audio.pause();
            audio.currentTime = 0;
            unlocked = true;
        })
        .catch(() => {
            /* still blocked until a real gesture */
        });
}

export async function playAdminIncomingRing() {
    if (isAdminRingMuted()) return;

    const audio = getAudio();
    if (!audio) return;

    try {
        audio.pause();
        audio.currentTime = 0;
        await audio.play();
        unlocked = true;
    } catch (err) {
        console.warn('[vc-ring] Autoplay blocked until user interacts with the page:', err?.message);
        // Retry unlock on next gesture
        const unlockOnce = () => {
            unlockAdminRingtone();
            window.removeEventListener('pointerdown', unlockOnce);
            window.removeEventListener('keydown', unlockOnce);
        };
        window.addEventListener('pointerdown', unlockOnce, { once: true });
        window.addEventListener('keydown', unlockOnce, { once: true });
    }
}

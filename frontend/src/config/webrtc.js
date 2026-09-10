/**
 * Central ICE config — add TURN later without changing WebRTC call sites.
 * Do not put TURN credentials in frontend source; inject via env when needed.
 */
export const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
];

export const RTC_CONFIGURATION = {
    iceServers: ICE_SERVERS,
};

export const CALL_STATES = {
    IDLE: 'idle',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    ENDED: 'ended',
    FAILED: 'failed',
};

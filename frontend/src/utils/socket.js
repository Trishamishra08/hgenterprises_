import { io } from 'socket.io-client';

const API_BASE_URL = (
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD
        ? 'https://hg-enterprises.onrender.com/api'
        : 'http://localhost:5001/api')
).replace(/\/$/, '');

/** Socket.IO attaches to the same host as the API (without /api). */
export const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    API_BASE_URL.replace(/\/api$/, '');

let socketInstance = null;

/**
 * Singleton authenticated Socket.IO client.
 * Reuses one connection across the app — do not create extra io() instances.
 */
export function getSocket() {
    const token = localStorage.getItem('hg_token');
    if (!token) {
        throw new Error('Login required for video calls');
    }

    if (socketInstance?.connected) {
        return socketInstance;
    }

    if (socketInstance) {
        socketInstance.auth = { token };
        socketInstance.connect();
        return socketInstance;
    }

    socketInstance = io(SOCKET_URL, {
        auth: { token },
        autoConnect: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 8,
    });

    return socketInstance;
}

export function disconnectSocket() {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
}

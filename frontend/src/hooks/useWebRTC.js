import { useCallback, useEffect, useRef, useState } from 'react';
import { getSocket } from '../utils/socket';
import { CALL_STATES, RTC_CONFIGURATION } from '../config/webrtc';

function isWebRTCSupported() {
    return !!(
        typeof window !== 'undefined' &&
        window.RTCPeerConnection &&
        navigator.mediaDevices?.getUserMedia
    );
}

/**
 * 1-to-1 WebRTC call over Socket.IO signaling.
 * Keeps a single peer connection + local stream; cleans up on end/unmount.
 */
export default function useWebRTC({ callId, enabled = true }) {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callState, setCallState] = useState(CALL_STATES.IDLE);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
    const [error, setError] = useState(null);
    const [peerInfo, setPeerInfo] = useState(null);
    const [supportsSinkId, setSupportsSinkId] = useState(false);

    const pcRef = useRef(null);
    const localStreamRef = useRef(null);
    const socketRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const makingOfferRef = useRef(false);
    const politeRef = useRef(true);
    const ignoreOfferRef = useRef(false);
    const endedRef = useRef(false);
    const peerUserIdRef = useRef(null);

    const cleanupMedia = useCallback(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((t) => t.stop());
            localStreamRef.current = null;
        }
        setLocalStream(null);
        setRemoteStream(null);

        if (pcRef.current) {
            try {
                pcRef.current.onicecandidate = null;
                pcRef.current.ontrack = null;
                pcRef.current.onconnectionstatechange = null;
                pcRef.current.onnegotiationneeded = null;
                pcRef.current.close();
            } catch (_) {
                /* ignore */
            }
            pcRef.current = null;
        }
    }, []);

    const endCall = useCallback(
        (notifyPeer = true) => {
            if (endedRef.current) return;
            endedRef.current = true;

            const socket = socketRef.current;
            if (notifyPeer && socket && callId) {
                socket.emit('call:end', { callId });
            }

            cleanupMedia();
            setCallState(CALL_STATES.ENDED);
            setPeerInfo(null);
            peerUserIdRef.current = null;
        },
        [callId, cleanupMedia]
    );

    const createPeerConnection = useCallback(() => {
        if (pcRef.current) return pcRef.current;

        const pc = new RTCPeerConnection(RTC_CONFIGURATION);
        pcRef.current = pc;

        pc.onicecandidate = (event) => {
            if (event.candidate && socketRef.current && callId) {
                socketRef.current.emit('call:ice-candidate', {
                    callId,
                    candidate: event.candidate,
                    targetUserId: peerUserIdRef.current || undefined,
                });
            }
        };

        pc.ontrack = (event) => {
            const stream = event.streams[0] || new MediaStream([event.track]);
            setRemoteStream(stream);
        };

        pc.onconnectionstatechange = () => {
            const state = pc.connectionState;
            if (state === 'connected') {
                setCallState(CALL_STATES.CONNECTED);
                setError(null);
            } else if (state === 'failed') {
                setCallState(CALL_STATES.FAILED);
                setError('Unable to establish the video connection.');
            } else if (state === 'disconnected' || state === 'closed') {
                if (!endedRef.current) {
                    setCallState(CALL_STATES.ENDED);
                }
            }
        };

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStreamRef.current);
            });
        }

        return pc;
    }, [callId]);

    const ensureLocalMedia = useCallback(async () => {
        if (localStreamRef.current) return localStreamRef.current;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            localStreamRef.current = stream;
            setLocalStream(stream);
            return stream;
        } catch (err) {
            // Retry video-only if mic fails
            if (err.name === 'NotFoundError' || err.name === 'NotReadableError') {
                try {
                    const videoOnly = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false,
                    });
                    localStreamRef.current = videoOnly;
                    setLocalStream(videoOnly);
                    setError('Microphone unavailable — continuing with video only.');
                    return videoOnly;
                } catch (videoErr) {
                    if (videoErr.name === 'NotAllowedError' || videoErr.name === 'PermissionDeniedError') {
                        throw new Error(
                            'Camera and microphone permissions are required to start the call.'
                        );
                    }
                    throw new Error('No camera available for this call.');
                }
            }
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                throw new Error(
                    'Camera and microphone permissions are required to start the call.'
                );
            }
            throw err;
        }
    }, []);

    const createAndSendOffer = useCallback(async () => {
        const pc = createPeerConnection();
        try {
            makingOfferRef.current = true;
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socketRef.current?.emit('call:offer', {
                callId,
                offer: pc.localDescription,
                targetUserId: peerUserIdRef.current || undefined,
            });
        } finally {
            makingOfferRef.current = false;
        }
    }, [callId, createPeerConnection]);

    const toggleMute = useCallback(() => {
        const stream = localStreamRef.current;
        if (!stream) return;
        const audioTracks = stream.getAudioTracks();
        if (!audioTracks.length) {
            setError('Microphone unavailable on this device.');
            return;
        }
        const currentlyEnabled = audioTracks[0].enabled;
        const enable = !currentlyEnabled;
        audioTracks.forEach((t) => {
            t.enabled = enable;
        });
        setIsMuted(!enable);
    }, []);

    const toggleSpeaker = useCallback(async () => {
        const next = !isSpeakerEnabled;
        setIsSpeakerEnabled(next);

        const el = remoteVideoRef.current;
        if (!el) return;

        el.muted = !next;

        if (typeof el.setSinkId === 'function') {
            try {
                // '' = default output; some browsers accept 'default'
                await el.setSinkId('');
            } catch (_) {
                /* sink change unsupported at runtime — mute fallback already applied */
            }
        }
    }, [isSpeakerEnabled]);

    const bindRemoteVideoEl = useCallback((el) => {
        remoteVideoRef.current = el;
        if (el && typeof el.setSinkId === 'function') {
            setSupportsSinkId(true);
        }
    }, []);

    useEffect(() => {
        if (!enabled || !callId) return undefined;

        if (!isWebRTCSupported()) {
            setCallState(CALL_STATES.FAILED);
            setError('Video calling is not supported by your browser.');
            return undefined;
        }

        endedRef.current = false;
        setCallState(CALL_STATES.CONNECTING);
        setError(null);

        let cancelled = false;
        let socket;

        const onOffer = async ({ callId: id, offer, fromUserId, fromName }) => {
            if (id !== callId || cancelled || endedRef.current) return;
            peerUserIdRef.current = fromUserId;
            setPeerInfo({ userId: fromUserId, name: fromName });

            const pc = createPeerConnection();
            const offerCollision =
                makingOfferRef.current || pc.signalingState !== 'stable';

            ignoreOfferRef.current = !politeRef.current && offerCollision;
            if (ignoreOfferRef.current) return;

            try {
                await pc.setRemoteDescription(offer);
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('call:answer', {
                    callId,
                    answer: pc.localDescription,
                    targetUserId: fromUserId,
                });
            } catch (err) {
                console.error('[webrtc] offer handling failed', err);
                setCallState(CALL_STATES.FAILED);
                setError('Unable to establish the video connection.');
            }
        };

        const onAnswer = async ({ callId: id, answer, fromUserId }) => {
            if (id !== callId || cancelled || endedRef.current) return;
            peerUserIdRef.current = fromUserId;
            const pc = pcRef.current;
            if (!pc) return;
            try {
                await pc.setRemoteDescription(answer);
            } catch (err) {
                console.error('[webrtc] answer failed', err);
            }
        };

        const onIce = async ({ callId: id, candidate }) => {
            if (id !== callId || cancelled || endedRef.current) return;
            const pc = pcRef.current;
            if (!pc || !candidate) return;
            try {
                await pc.addIceCandidate(candidate);
            } catch (err) {
                if (!ignoreOfferRef.current) {
                    console.warn('[webrtc] ice candidate error', err);
                }
            }
        };

        const onPeerJoined = async ({ callId: id, userId, name }) => {
            if (id !== callId || cancelled || endedRef.current) return;
            peerUserIdRef.current = userId;
            setPeerInfo({ userId, name });
            // First peer (initiator) creates the offer when second joins
            if (!politeRef.current) {
                await createAndSendOffer();
            }
        };

        const onEnded = ({ callId: id }) => {
            if (id !== callId || cancelled) return;
            endCall(false);
        };

        (async () => {
            try {
                socket = getSocket();
                socketRef.current = socket;

                await ensureLocalMedia();
                if (cancelled || endedRef.current) return;

                createPeerConnection();

                const joinResult = await new Promise((resolve, reject) => {
                    socket.emit('call:join', { callId }, (res) => {
                        if (!res?.ok) reject(new Error(res?.error || 'Failed to join call'));
                        else resolve(res);
                    });
                });

                if (cancelled || endedRef.current) return;

                // Initiator (first in room) is impolite / creates offer when peer joins
                politeRef.current = !joinResult.isInitiator;

                if (joinResult.peers?.length) {
                    peerUserIdRef.current = joinResult.peers[0];
                    // Second joiner waits for offer; if somehow first already waiting, initiator sends
                    if (joinResult.isInitiator) {
                        await createAndSendOffer();
                    }
                }

                socket.on('call:offer', onOffer);
                socket.on('call:answer', onAnswer);
                socket.on('call:ice-candidate', onIce);
                socket.on('call:peer-joined', onPeerJoined);
                socket.on('call:ended', onEnded);
            } catch (err) {
                if (cancelled) return;
                console.error('[webrtc] start failed', err);
                cleanupMedia();
                setCallState(CALL_STATES.FAILED);
                setError(err.message || 'Unable to establish the video connection.');
            }
        })();

        return () => {
            cancelled = true;
            if (socket) {
                socket.off('call:offer', onOffer);
                socket.off('call:answer', onAnswer);
                socket.off('call:ice-candidate', onIce);
                socket.off('call:peer-joined', onPeerJoined);
                socket.off('call:ended', onEnded);
                if (!endedRef.current && callId) {
                    socket.emit('call:end', { callId });
                }
            }
            cleanupMedia();
        };
    }, [
        callId,
        enabled,
        cleanupMedia,
        createAndSendOffer,
        createPeerConnection,
        endCall,
        ensureLocalMedia,
    ]);

    return {
        localStream,
        remoteStream,
        callState,
        isMuted,
        isSpeakerEnabled,
        supportsSinkId,
        error,
        peerInfo,
        toggleMute,
        toggleSpeaker,
        endCall,
        bindRemoteVideoEl,
        isSupported: isWebRTCSupported(),
    };
}

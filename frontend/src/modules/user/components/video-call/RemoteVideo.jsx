import { useEffect, useRef } from 'react';

export default function RemoteVideo({ stream, muted = false, onVideoRef, className = '' }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        el.srcObject = stream || null;
        onVideoRef?.(el);
    }, [stream, onVideoRef]);

    useEffect(() => {
        const el = videoRef.current;
        if (el) el.muted = muted;
    }, [muted]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`bg-[#1a0f10] object-cover ${className}`}
            aria-label="Remote participant"
        />
    );
}

import { useEffect, useRef } from 'react';

export default function LocalVideo({ stream, className = '' }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        el.srcObject = stream || null;
    }, [stream]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`bg-[#1a0f10] object-cover ${className}`}
            aria-label="Your camera"
        />
    );
}

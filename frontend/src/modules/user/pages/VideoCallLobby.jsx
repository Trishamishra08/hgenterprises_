import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * /video-call always opens the categorized video-call cart
 * (Jewellery + Tools & Machines) — never the admin panel.
 */
export default function VideoCallLobby() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/video-call-cart', { replace: true });
    }, [navigate]);

    return (
        <div className="min-h-[40vh] flex items-center justify-center text-[#3E2723]/50 text-sm bg-[#FDF5F6]">
            Opening video call cart...
        </div>
    );
}

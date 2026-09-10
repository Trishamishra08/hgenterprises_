import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import VideoCall from '../components/video-call/VideoCall';

/**
 * Authenticated call room route: /call/:callId
 */
export default function VideoCallRoom() {
    const { callId } = useParams();
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login', { replace: true, state: { from: `/call/${callId}` } });
        }
    }, [loading, user, navigate, callId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1a0f10] text-white/70">
                Preparing call...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FDF5F6] px-4">
                <p className="text-sm text-[#3E2723]/70">Sign in required for video calls.</p>
                <Link to="/login" className="text-sm font-medium text-[#6b252c] underline">
                    Go to login
                </Link>
            </div>
        );
    }

    if (!callId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Link to="/video-call" className="text-[#6b252c] underline text-sm">
                    Invalid call — back to lobby
                </Link>
            </div>
        );
    }

    return <VideoCall callId={callId} onLeavePath="/video-call" />;
}

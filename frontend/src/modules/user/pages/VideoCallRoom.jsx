import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import VideoCall from '../components/video-call/VideoCall';

/** Parses a slot's "YYYY-MM-DD" + "HH:MM" (24h) strings into a Date. */
function parseSlotTime(slot, timeField) {
    if (!slot?.date || !slot?.[timeField]) return null;
    const d = new Date(`${slot.date}T${slot[timeField]}:00`);
    return Number.isNaN(d.getTime()) ? null : d;
}

function formatCountdown(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/**
 * Authenticated call room route: /call/:callId
 */
export default function VideoCallRoom() {
    const { callId } = useParams();
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [bookingChecked, setBookingChecked] = useState(false);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login', { replace: true, state: { from: `/call/${callId}` } });
        }
    }, [loading, user, navigate, callId]);

    useEffect(() => {
        if (!user || !callId) return;
        let alive = true;
        (async () => {
            try {
                const { data } = await api.get(`/video-calls/bookings/by-call/${callId}`);
                if (alive) setBooking(data);
            } catch (_) {
                // No booking found for this call — fall through and allow the call
                // to proceed without a time gate rather than blocking it entirely.
            } finally {
                if (alive) setBookingChecked(true);
            }
        })();
        return () => { alive = false; };
    }, [user, callId]);

    const scheduledStart = useMemo(() => {
        if (!booking) return null;
        const slot = booking.slot || booking.customSlot;
        return parseSlotTime(slot, 'startTime');
    }, [booking]);

    const waitingForSlot = Boolean(scheduledStart && now < scheduledStart.getTime());

    // Tick every second while waiting so the room opens automatically at the
    // scheduled time, without needing a page refresh.
    useEffect(() => {
        if (!waitingForSlot) return undefined;
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [waitingForSlot]);

    if (loading || (user && callId && !bookingChecked)) {
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

    const leavePath = user.role === 'admin' ? '/admin/video-calls' : '/video-call';

    if (waitingForSlot) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#1a0f10] text-white px-4 text-center">
                <p className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Your call isn't open yet</p>
                <p className="text-sm text-white/70">
                    This call is scheduled for{' '}
                    {scheduledStart.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}.
                </p>
                <p className="text-4xl font-bold font-mono tracking-wider text-[#C5A059]">
                    {formatCountdown(scheduledStart.getTime() - now)}
                </p>
                <p className="text-xs text-white/50">The call room will open automatically at the scheduled time.</p>
                <Link to={leavePath} className="text-sm underline text-white/60 mt-2">
                    Back
                </Link>
            </div>
        );
    }

    return <VideoCall callId={callId} onLeavePath={leavePath} />;
}

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, Copy, LogIn } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

function createCallId() {
    const rand = Math.random().toString(36).slice(2, 8);
    return `call_${Date.now().toString(36)}_${rand}`;
}

/**
 * Lobby: create or join a 1-to-1 call room (requires login).
 */
export default function VideoCallLobby() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [joinId, setJoinId] = useState('');
    const [copied, setCopied] = useState(false);
    const [createdId, setCreatedId] = useState('');

    const shareUrl = useMemo(() => {
        if (!createdId) return '';
        return `${window.location.origin}/call/${createdId}`;
    }, [createdId]);

    const startNewCall = () => {
        const id = createCallId();
        setCreatedId(id);
        navigate(`/call/${id}`);
    };

    const joinExisting = (e) => {
        e.preventDefault();
        const id = joinId.trim();
        if (!id) return;
        navigate(`/call/${id.startsWith('call_') ? id : `call_${id}`}`);
    };

    const copyLink = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (_) {
            /* ignore */
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-[#3E2723]/70">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-lg mx-auto px-4 py-16 text-center">
                <Video className="w-12 h-12 mx-auto text-[#C5A059] mb-4" />
                <h1 className="font-serif text-3xl text-[#3E2723] mb-2">Video Call</h1>
                <p className="text-sm text-[#3E2723]/70 mb-6">
                    Please sign in to start or join a 1-to-1 video consultation.
                </p>
                <Link
                    to="/login"
                    state={{ from: '/video-call' }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3E2723] text-white text-sm font-medium hover:bg-[#4a322c] transition-colors"
                >
                    <LogIn className="w-4 h-4" /> Sign in
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-12 md:py-16">
            <div className="text-center mb-10">
                <Video className="w-12 h-12 mx-auto text-[#C5A059] mb-4" />
                <h1 className="font-serif text-3xl md:text-4xl text-[#3E2723] mb-2">
                    Video Call
                </h1>
                <p className="text-sm text-[#3E2723]/70">
                    Start a private 1-to-1 call and share the link with the other person.
                </p>
            </div>

            <div className="bg-white border border-[#EBCDD0] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                <div>
                    <h2 className="text-sm font-semibold text-[#3E2723] mb-3">Start a new call</h2>
                    <button
                        type="button"
                        onClick={startNewCall}
                        className="w-full py-3 rounded-full bg-[#3E2723] text-white text-sm font-medium hover:bg-[#4a322c] transition-colors"
                    >
                        Create call room
                    </button>
                </div>

                <div className="relative flex items-center gap-3 text-xs text-[#3E2723]/40">
                    <div className="flex-1 h-px bg-[#EBCDD0]" />
                    or join
                    <div className="flex-1 h-px bg-[#EBCDD0]" />
                </div>

                <form onSubmit={joinExisting}>
                    <h2 className="text-sm font-semibold text-[#3E2723] mb-3">Join with call ID</h2>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            value={joinId}
                            onChange={(e) => setJoinId(e.target.value)}
                            placeholder="call_..."
                            className="flex-1 px-4 py-2.5 rounded-full border border-[#EBCDD0] text-sm outline-none focus:border-[#C5A059] bg-[#FDF5F6]"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-full bg-[#C5A059] text-[#3E2723] text-sm font-semibold hover:bg-[#d4b06e] transition-colors"
                        >
                            Join
                        </button>
                    </div>
                </form>

                {createdId && (
                    <div className="rounded-xl bg-[#FDF5F6] border border-[#EBCDD0] p-4">
                        <p className="text-xs text-[#3E2723]/60 mb-1">Share this link</p>
                        <p className="text-sm break-all text-[#3E2723] mb-3">{shareUrl}</p>
                        <button
                            type="button"
                            onClick={copyLink}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6b252c]"
                        >
                            <Copy className="w-3.5 h-3.5" />
                            {copied ? 'Copied' : 'Copy link'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

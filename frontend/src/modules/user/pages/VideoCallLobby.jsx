<<<<<<< HEAD
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * /video-call always opens the categorized video-call cart
 * (Jewellery + Tools & Machines) — never the admin panel.
=======
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, LogIn, Loader2, PhoneOff, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getSocket } from '../../../utils/socket';

/**
 * User: send video-call request to admin and wait for accept/reject.
 * Admins are redirected to the admin incoming-calls inbox.
>>>>>>> dd7ddac858fbee0fccffc2de9ac0fb6323d953f9
 */
export default function VideoCallLobby() {
    const navigate = useNavigate();
<<<<<<< HEAD

    useEffect(() => {
        navigate('/video-call-cart', { replace: true });
    }, [navigate]);
=======
    const [status, setStatus] = useState('idle'); // idle | requesting | waiting | rejected
    const [requestId, setRequestId] = useState(null);
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        if (!loading && user?.role === 'admin') {
            navigate('/admin/video-calls', { replace: true });
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (!user || user.role === 'admin') return undefined;

        let socket;
        try {
            socket = getSocket();
        } catch (err) {
            setError(err.message);
            return undefined;
        }

        const onAccepted = ({ callId }) => {
            if (!callId) return;
            setStatus('idle');
            navigate(`/call/${callId}`, { replace: true });
        };

        const onRejected = ({ reason }) => {
            setStatus('rejected');
            setRequestId(null);
            setRejectReason(reason || 'Admin declined the call request.');
        };

        socket.on('call:accepted', onAccepted);
        socket.on('call:rejected', onRejected);

        return () => {
            socket.off('call:accepted', onAccepted);
            socket.off('call:rejected', onRejected);
        };
    }, [user, navigate]);

    const sendRequest = () => {
        setError('');
        setRejectReason('');
        setStatus('requesting');

        try {
            const socket = getSocket();
            socket.emit('call:request', { note: note.trim() }, (res) => {
                if (!res?.ok) {
                    setStatus('idle');
                    setError(res?.error || 'Could not send request');
                    return;
                }
                setRequestId(res.requestId);
                setStatus('waiting');
            });
        } catch (err) {
            setStatus('idle');
            setError(err.message || 'Could not connect');
        }
    };

    const cancelRequest = () => {
        if (!requestId) {
            setStatus('idle');
            return;
        }
        try {
            const socket = getSocket();
            socket.emit('call:cancel-request', { requestId }, () => {
                setRequestId(null);
                setStatus('idle');
            });
        } catch (_) {
            setRequestId(null);
            setStatus('idle');
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
                    Sign in to request a live video consultation with our team.
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
>>>>>>> dd7ddac858fbee0fccffc2de9ac0fb6323d953f9

    if (user.role === 'admin') {
        return null;
    }

    return (
<<<<<<< HEAD
        <div className="min-h-[40vh] flex items-center justify-center text-[#3E2723]/50 text-sm bg-[#FDF5F6]">
            Opening video call cart...
=======
        <div className="max-w-xl mx-auto px-4 py-12 md:py-16">
            <div className="text-center mb-10">
                <Video className="w-12 h-12 mx-auto text-[#C5A059] mb-4" />
                <h1 className="font-serif text-3xl md:text-4xl text-[#3E2723] mb-2">
                    Video Call
                </h1>
                <p className="text-sm text-[#3E2723]/70">
                    Send a request to HG Enterprises admin. When they accept, your call starts automatically.
                </p>
            </div>

            <div className="bg-white border border-[#EBCDD0] rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
                {status === 'waiting' || status === 'requesting' ? (
                    <div className="text-center py-6 space-y-4">
                        <div className="mx-auto w-14 h-14 rounded-full bg-[#FDF5F6] flex items-center justify-center">
                            {status === 'requesting' ? (
                                <Loader2 className="w-7 h-7 text-[#C5A059] animate-spin" />
                            ) : (
                                <Clock className="w-7 h-7 text-[#C5A059] animate-pulse" />
                            )}
                        </div>
                        <div>
                            <p className="text-base font-medium text-[#3E2723]">
                                {status === 'requesting' ? 'Sending request...' : 'Waiting for admin...'}
                            </p>
                            <p className="text-sm text-[#3E2723]/60 mt-1">
                                Please keep this page open. You will join the call when an admin accepts.
                            </p>
                        </div>
                        {status === 'waiting' && (
                            <button
                                type="button"
                                onClick={cancelRequest}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#EBCDD0] text-sm text-[#3E2723] hover:bg-[#FDF5F6] transition-colors"
                            >
                                <PhoneOff className="w-4 h-4" /> Cancel request
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {status === 'rejected' && (
                            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                                {rejectReason}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-[#3E2723] mb-2">
                                Message (optional)
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                                maxLength={200}
                                placeholder="e.g. Need help choosing a ring size"
                                className="w-full px-4 py-3 rounded-xl border border-[#EBCDD0] text-sm outline-none focus:border-[#C5A059] bg-[#FDF5F6] resize-none"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600">{error}</p>
                        )}

                        <button
                            type="button"
                            onClick={sendRequest}
                            className="w-full py-3 rounded-full bg-[#3E2723] text-white text-sm font-medium hover:bg-[#4a322c] transition-colors"
                        >
                            Request call with admin
                        </button>
                    </>
                )}
            </div>
>>>>>>> dd7ddac858fbee0fccffc2de9ac0fb6323d953f9
        </div>
    );
}

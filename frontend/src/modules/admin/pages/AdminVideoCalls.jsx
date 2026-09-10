import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Phone, PhoneOff, RefreshCw, User } from 'lucide-react';
import { getSocket } from '../../../utils/socket';

/**
 * Admin inbox for incoming user video-call requests.
 */
export default function AdminVideoCalls() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [busyId, setBusyId] = useState(null);

    const upsertRequest = useCallback((request) => {
        setRequests((prev) => {
            const without = prev.filter((r) => r.requestId !== request.requestId);
            return [request, ...without].sort((a, b) => b.createdAt - a.createdAt);
        });
    }, []);

    const removeRequest = useCallback((requestId) => {
        setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    }, []);

    useEffect(() => {
        let socket;
        try {
            socket = getSocket();
        } catch (err) {
            setError(err.message || 'Socket connection failed');
            return undefined;
        }

        const onIncoming = ({ request }) => {
            if (request) upsertRequest(request);
        };

        const onPendingList = ({ requests: list }) => {
            setRequests(Array.isArray(list) ? list : []);
        };

        const onCancelled = ({ requestId }) => {
            if (requestId) removeRequest(requestId);
        };

        const onResolved = ({ requestId }) => {
            if (requestId) removeRequest(requestId);
        };

        const onAccepted = ({ callId }) => {
            if (callId) navigate(`/call/${callId}`);
        };

        socket.on('call:incoming-request', onIncoming);
        socket.on('call:pending-list', onPendingList);
        socket.on('call:request-cancelled', onCancelled);
        socket.on('call:request-resolved', onResolved);
        socket.on('call:accepted', onAccepted);

        socket.emit('call:list-pending', (res) => {
            if (res?.ok) setRequests(res.requests || []);
            else if (res?.error) setError(res.error);
        });

        return () => {
            socket.off('call:incoming-request', onIncoming);
            socket.off('call:pending-list', onPendingList);
            socket.off('call:request-cancelled', onCancelled);
            socket.off('call:request-resolved', onResolved);
            socket.off('call:accepted', onAccepted);
        };
    }, [navigate, removeRequest, upsertRequest]);

    const accept = (requestId) => {
        setBusyId(requestId);
        setError('');
        try {
            const socket = getSocket();
            socket.emit('call:accept', { requestId }, (res) => {
                setBusyId(null);
                if (!res?.ok) {
                    setError(res?.error || 'Could not accept request');
                    return;
                }
                if (res.callId) navigate(`/call/${res.callId}`);
            });
        } catch (err) {
            setBusyId(null);
            setError(err.message);
        }
    };

    const reject = (requestId) => {
        setBusyId(requestId);
        setError('');
        try {
            const socket = getSocket();
            socket.emit('call:reject', { requestId }, (res) => {
                setBusyId(null);
                if (!res?.ok) {
                    setError(res?.error || 'Could not reject request');
                    return;
                }
                removeRequest(requestId);
            });
        } catch (err) {
            setBusyId(null);
            setError(err.message);
        }
    };

    const refresh = () => {
        try {
            const socket = getSocket();
            socket.emit('call:list-pending', (res) => {
                if (res?.ok) setRequests(res.requests || []);
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl">
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Video className="w-5 h-5 text-[#C5A059]" />
                        <h1 className="text-xl font-semibold text-[#3E2723]">Video Call Requests</h1>
                    </div>
                    <p className="text-sm text-gray-500">
                        When a customer requests a call, it appears here. Accept to start the video session.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={refresh}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {requests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
                    <User className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm font-medium text-gray-700">No pending call requests</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Keep this page open to see new requests instantly.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {requests.map((req) => (
                        <div
                            key={req.requestId}
                            className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center gap-4 justify-between"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#3E2723] truncate">
                                    {req.userName || 'Customer'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {req.userEmail}
                                    {req.userPhone ? ` · ${req.userPhone}` : ''}
                                </p>
                                {req.note ? (
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{req.note}</p>
                                ) : null}
                                <p className="text-[11px] text-gray-400 mt-2">
                                    {new Date(req.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    disabled={busyId === req.requestId}
                                    onClick={() => reject(req.requestId)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <PhoneOff className="w-3.5 h-3.5" /> Decline
                                </button>
                                <button
                                    type="button"
                                    disabled={busyId === req.requestId}
                                    onClick={() => accept(req.requestId)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3E2723] text-white text-xs font-semibold hover:bg-[#4a322c] disabled:opacity-50"
                                >
                                    <Phone className="w-3.5 h-3.5" /> Accept Call
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

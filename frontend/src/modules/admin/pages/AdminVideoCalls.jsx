<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Video, Plus, Trash2, Phone, Check, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';

function whenLabel(b) {
    if (b.slot) return `${b.slot.date} · ${b.slot.startTime} – ${b.slot.endTime}`;
    if (b.customSlot?.date) return `${b.customSlot.date} · ${b.customSlot.startTime} (custom)`;
    return 'Time TBD';
}

export default function AdminVideoCalls() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab') === 'slots' ? 'slots' : 'requests';
    const [slots, setSlots] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [form, setForm] = useState({ date: '', startTime: '', endTime: '', capacity: 1, note: '' });
    const [busyId, setBusyId] = useState(null);
    const [loading, setLoading] = useState(true);

    const setTab = (next) => setSearchParams({ tab: next });

    const load = async () => {
        try {
            const [s, b] = await Promise.all([
                api.get('/video-calls/slots/all'),
                api.get('/video-calls/bookings'),
            ]);
            setSlots(s.data || []);
            setBookings(b.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const createSlot = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/video-calls/slots', form);
            setSlots((prev) =>
                [...prev, data].sort((a, b) =>
                    `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)
                )
            );
            setForm({ date: '', startTime: '', endTime: '', capacity: 1, note: '' });
            toast.success('Slot created');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not create slot');
        }
    };

    const deleteSlot = async (id) => {
        try {
            await api.delete(`/video-calls/slots/${id}`);
            setSlots((prev) => prev.filter((s) => s._id !== id));
            toast.success('Slot deleted');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    const respond = async (id, action) => {
        setBusyId(id);
        try {
            const { data } = await api.post(`/video-calls/bookings/${id}/admin`, { action });
            setBookings((prev) => prev.map((b) => (b._id === id ? data : b)));
            toast.success(action === 'accept' ? 'Approved — waiting for user confirm' : 'Rejected');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setBusyId(null);
        }
    };

    if (loading) {
        return <div className="p-8 text-sm text-gray-500">Loading video call desk...</div>;
    }

    const pending = bookings.filter((b) => b.status === 'pending_admin');
    const ready = bookings.filter((b) => b.status === 'confirmed');

    return (
        <div className="p-4 md:p-8 max-w-5xl">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Video className="w-5 h-5 text-[#C5A059]" />
                        <h1 className="text-xl font-semibold text-[#3E2723]">Video Call Desk</h1>
                    </div>
                    <p className="text-sm text-gray-500">
                        Add timing slots, then review customer booking requests.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setTab('slots')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            tab === 'slots' ? 'bg-[#3E2723] text-white' : 'bg-white border text-gray-600'
                        }`}
                    >
                        Add TimeSlots
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('requests')}
                        className={`relative px-3 py-1.5 rounded-full text-xs font-semibold ${
                            tab === 'requests' ? 'bg-[#3E2723] text-white' : 'bg-white border text-gray-600'
                        }`}
                    >
                        User Requests
                        {pending.length > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">
                                {pending.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {tab === 'slots' ? (
                <div className="space-y-6">
                    <form
                        onSubmit={createSlot}
                        className="bg-white border border-gray-100 rounded-2xl p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
                    >
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">Date</label>
                            <input
                                type="date"
                                required
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">Start</label>
                            <input
                                type="time"
                                required
                                value={form.startTime}
                                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">End</label>
                            <input
                                type="time"
                                required
                                value={form.endTime}
                                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400">Capacity</label>
                            <input
                                type="number"
                                min={1}
                                value={form.capacity}
                                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#C5A059] text-[#3E2723] text-xs font-bold"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Slot
                        </button>
                    </form>

                    <div className="space-y-2">
                        {slots.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-10 border border-dashed rounded-2xl">
                                No slots yet. Create one above.
                            </p>
                        ) : (
                            slots.map((s) => (
                                <div
                                    key={s._id}
                                    className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                                >
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="w-4 h-4 text-[#C5A059]" />
                                        <span className="font-medium text-[#3E2723]">{s.date}</span>
                                        <span className="text-gray-500">
                                            {s.startTime} – {s.endTime}
                                        </span>
                                        <span className="text-[11px] text-gray-400">
                                            {s.bookedCount}/{s.capacity} booked
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => deleteSlot(s._id)}
                                        className="p-2 text-gray-400 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {ready.length > 0 && (
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
                                Ready to join
                            </h2>
                            <div className="space-y-2">
                                {ready.map((b) => (
                                    <div
                                        key={b._id}
                                        className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold">
                                                {b.contactName || b.user?.name || 'Customer'}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {b.contactEmail || b.user?.email}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {whenLabel(b)} · {b.products?.length || 0} designs
                                            </p>
                                        </div>
                                        {b.callId && (
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/call/${b.callId}`)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3E2723] text-white text-xs font-bold"
                                            >
                                                <Phone className="w-3.5 h-3.5" /> Join Call
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
                            Pending approval {pending.length > 0 ? `(${pending.length})` : ''}
                        </h2>
                        {pending.length === 0 ? (
                            <p className="text-sm text-gray-500 py-8 text-center border border-dashed rounded-2xl">
                                No pending requests
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {pending.map((b) => (
                                    <div key={b._id} className="bg-white border border-gray-100 rounded-2xl p-4">
                                        <div className="flex flex-wrap justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-semibold text-[#3E2723]">
                                                    {b.contactName || b.user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {b.contactEmail || b.user?.email} · {b.user?.phone}
                                                </p>
                                                <p className="text-sm mt-2">{whenLabel(b)}</p>
                                                {b.note && (
                                                    <p className="text-xs text-gray-500 mt-1">{b.note}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2 items-start">
                                                <button
                                                    type="button"
                                                    disabled={busyId === b._id}
                                                    onClick={() => respond(b._id, 'reject')}
                                                    className="inline-flex items-center gap-1 px-3 py-2 rounded-full border text-xs font-semibold"
                                                >
                                                    <X className="w-3.5 h-3.5" /> Decline
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={busyId === b._id}
                                                    onClick={() => respond(b._id, 'accept')}
                                                    className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-[#2E7D32] text-white text-xs font-bold"
                                                >
                                                    <Check className="w-3.5 h-3.5" /> Accept
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex gap-2 overflow-x-auto">
                                            {(b.products || []).map((p) => (
                                                <div key={p.product} className="shrink-0 w-16 text-center">
                                                    <img
                                                        src={p.image}
                                                        alt=""
                                                        className="w-16 h-16 object-contain bg-[#FAF8F5] rounded border"
                                                    />
                                                    <p className="text-[9px] text-gray-500 truncate mt-1">
                                                        {p.name}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                            All bookings
                        </h2>
                        <div className="space-y-2">
                            {bookings.map((b) => (
                                <div
                                    key={b._id}
                                    className="bg-white border border-gray-50 rounded-lg px-4 py-3 flex justify-between text-xs text-gray-600"
                                >
                                    <span>
                                        {b.contactName || b.user?.name || 'User'} · {whenLabel(b)}
                                    </span>
                                    <span className="uppercase font-semibold">
                                        {b.status.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
=======
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
>>>>>>> dd7ddac858fbee0fccffc2de9ac0fb6323d953f9
                </div>
            )}
        </div>
    );
}

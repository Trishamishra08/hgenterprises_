import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, Phone, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

function whenLabel(b) {
    if (b.slot) return `${b.slot.date} · ${b.slot.startTime} – ${b.slot.endTime}`;
    if (b.customSlot?.date) return `${b.customSlot.date} · ${b.customSlot.startTime}${b.customSlot.endTime ? ` – ${b.customSlot.endTime}` : ''}`;
    return 'Time TBD';
}

const statusStyle = {
    pending_admin: 'bg-amber-50 text-amber-700 border-amber-100',
    pending_user: 'bg-blue-50 text-blue-700 border-blue-100',
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rejected: 'bg-red-50 text-red-700 border-red-100',
    cancelled: 'bg-gray-50 text-gray-500 border-gray-100',
    completed: 'bg-gray-50 text-gray-600 border-gray-100',
};

/**
 * User bookings: confirm after admin approval, then join call.
 */
export default function VideoCallBookings() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);

    const load = async () => {
        try {
            const { data } = await api.get('/video-calls/bookings/mine');
            setBookings(data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login', { replace: true, state: { from: '/video-call/bookings' } });
            return;
        }
        load();
    }, [user, authLoading, navigate]);

    const confirm = async (id) => {
        setBusyId(id);
        try {
            const { data } = await api.post(`/video-calls/bookings/${id}/confirm`);
            toast.success('Call confirmed!');
            setBookings((prev) => prev.map((b) => (b._id === id ? data : b)));
            if (data.callId) navigate(`/call/${data.callId}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Confirm failed');
        } finally {
            setBusyId(null);
        }
    };

    const cancel = async (id) => {
        setBusyId(id);
        try {
            const { data } = await api.post(`/video-calls/bookings/${id}/cancel`);
            setBookings((prev) => prev.map((b) => (b._id === id ? data : b)));
            toast.success('Cancelled');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cancel failed');
        } finally {
            setBusyId(null);
        }
    };

    if (authLoading || loading) {
        return <div className="min-h-[40vh] flex items-center justify-center text-sm text-gray-500">Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-serif text-[#3E2723]">My Video Call Bookings</h1>
                    <p className="text-sm text-gray-500 mt-1">Track requests, confirm after admin approval, then join.</p>
                </div>
                <Link to="/video-call-cart" className="text-xs font-semibold text-[#2C6E9E] hover:underline">
                    Video Call Cart
                </Link>
            </div>

            {bookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                    <Video className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500 mb-4">No bookings yet</p>
                    <Link to="/shop" className="text-sm font-medium text-[#6b252c] underline">Browse products</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div key={b._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-[#3E2723]">{whenLabel(b)}</p>
                                    <p className="text-xs text-gray-500 mt-1">{b.products?.length || 0} design(s)</p>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${statusStyle[b.status] || ''}`}>
                                    {b.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="mt-3 flex gap-2 overflow-x-auto">
                                {(b.products || []).map((p) => (
                                    <img key={p.product} src={p.image} alt={p.name} className="w-14 h-14 rounded object-contain bg-[#FAF8F5] border border-gray-100" />
                                ))}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {b.status === 'pending_user' && (
                                    <button
                                        type="button"
                                        disabled={busyId === b._id}
                                        onClick={() => confirm(b._id)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2E7D32] text-white text-xs font-bold"
                                    >
                                        <Check className="w-3.5 h-3.5" /> Confirm & Join
                                    </button>
                                )}
                                {b.status === 'confirmed' && b.callId && (
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/call/${b.callId}`)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3E2723] text-white text-xs font-bold"
                                    >
                                        <Phone className="w-3.5 h-3.5" /> Join Call
                                    </button>
                                )}
                                {['pending_admin', 'pending_user'].includes(b.status) && (
                                    <button
                                        type="button"
                                        disabled={busyId === b._id}
                                        onClick={() => cancel(b._id)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-600"
                                    >
                                        <X className="w-3.5 h-3.5" /> Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { clearGuestVcCart, groupVcItemsByDepartment, readGuestVcCart } from '../../../utils/videoCallCart';

/**
 * Step 2: admin slots + booking details (name, email — no WhatsApp).
 */
export default function VideoCallSchedule() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const department = searchParams.get('department') || 'jewellery';

    const [slots, setSlots] = useState([]);
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [useCustom, setUseCustom] = useState(false);
    const [custom, setCustom] = useState({ date: '', startTime: '', endTime: '' });
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [note, setNote] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login', {
                replace: true,
                state: { from: `/video-call/schedule?department=${department}` },
            });
            return;
        }
        if (user.role === 'admin') {
            toast.error('Use a customer account to book');
            navigate('/video-call-cart', { replace: true });
            return;
        }

        setContactName(user.name || '');
        setContactEmail(user.email || '');

        (async () => {
            try {
                const guest = readGuestVcCart();
                if (guest.length) {
                    await api.post('/video-calls/cart/sync', {
                        productIds: guest.map((g) => g.product),
                    });
                    clearGuestVcCart();
                }
                const [slotsRes, cartRes] = await Promise.all([
                    api.get('/video-calls/slots'),
                    api.get('/video-calls/cart'),
                ]);
                setSlots(slotsRes.data || []);
                setCartItems(cartRes.data?.items || []);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to load');
            } finally {
                setLoading(false);
            }
        })();
    }, [user, authLoading, navigate, department]);

    const scopedItems = useMemo(() => {
        const { jewellery, toolsMachines } = groupVcItemsByDepartment(cartItems);
        return department === 'tools-machines' ? toolsMachines : jewellery;
    }, [cartItems, department]);

    const submit = async (e) => {
        e.preventDefault();
        if (!scopedItems.length) {
            toast.error('Cart is empty for this category');
            return;
        }
        if (!contactName.trim() || !contactEmail.trim()) {
            toast.error('Please enter your full name and email');
            return;
        }
        if (!useCustom && !selectedSlotId) {
            toast.error('Please select a time slot');
            return;
        }
        if (useCustom && (!custom.date || !custom.startTime)) {
            toast.error('Enter your preferred date and time');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/video-calls/bookings', {
                slotId: useCustom ? undefined : selectedSlotId,
                customSlot: useCustom ? custom : undefined,
                note,
                contactName: contactName.trim(),
                contactEmail: contactEmail.trim(),
                department: department === 'tools-machines' ? 'tools-machines' : 'jewellery',
                productIds: scopedItems.map((i) => i.product),
            });
            toast.success('Request sent to admin');
            navigate('/video-call/bookings');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-gray-500 text-sm">
                Loading...
            </div>
        );
    }

    const byDate = slots.reduce((acc, s) => {
        (acc[s.date] ||= []).push(s);
        return acc;
    }, {});

    return (
        <div className="bg-[#FDF5F6] min-h-[70vh]">
            <div className="border-b border-[#EBCDD0] bg-white">
                <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-center gap-3 text-[11px] md:text-xs font-semibold tracking-wide uppercase">
                    <span className="flex items-center gap-2 text-[#3E2723]">
                        <span className="w-6 h-6 rounded-full bg-[#3E2723] text-[#C5A059] flex items-center justify-center text-[10px]">✓</span>
                        Cart
                    </span>
                    <span className="w-10 h-px bg-[#EBCDD0]" />
                    <span className="flex items-center gap-2 text-[#3E2723]">
                        <span className="w-6 h-6 rounded-full bg-[#3E2723] text-[#C5A059] flex items-center justify-center text-[10px]">2</span>
                        Book Video Call
                    </span>
                    <span className="w-10 h-px bg-[#EBCDD0]" />
                    <span className="flex items-center gap-2 text-[#3E2723]/35">
                        <span className="w-6 h-6 rounded-full border border-[#EBCDD0] flex items-center justify-center text-[10px]">3</span>
                        Confirmation
                    </span>
                </div>
            </div>

            <form onSubmit={submit} className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                <div>
                    <h1 className="text-2xl font-serif text-[#222] mb-1">Choose a time slot</h1>
                    <p className="text-sm text-gray-500">
                        Booking for {department === 'tools-machines' ? 'Tools & Machines' : 'Jewellery'} ({scopedItems.length} item
                        {scopedItems.length === 1 ? '' : 's'})
                    </p>
                </div>

                <div className="flex gap-2">
                    <button type="button" onClick={() => setUseCustom(false)} className={`px-4 py-2 rounded-full text-xs font-semibold ${!useCustom ? 'bg-[#3E2723] text-white' : 'bg-gray-100 text-gray-600'}`}>
                        Admin slots
                    </button>
                    <button type="button" onClick={() => setUseCustom(true)} className={`px-4 py-2 rounded-full text-xs font-semibold ${useCustom ? 'bg-[#3E2723] text-white' : 'bg-gray-100 text-gray-600'}`}>
                        Enter my preferred time
                    </button>
                </div>

                {!useCustom ? (
                    Object.keys(byDate).length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                            No slots available. Enter your preferred time, or ask admin to add slots.
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {Object.entries(byDate).map(([date, list]) => (
                                <div key={date}>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#C5A059] mb-2 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> {date}
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {list.map((slot) => {
                                            const selected = selectedSlotId === slot._id;
                                            const left = slot.capacity - slot.bookedCount;
                                            return (
                                                <button
                                                    key={slot._id}
                                                    type="button"
                                                    onClick={() => setSelectedSlotId(slot._id)}
                                                    className={`text-left px-3 py-3 rounded-xl border text-sm transition-colors ${
                                                        selected ? 'border-[#124935] bg-[#E8F5E9] text-[#1B5E20]' : 'border-gray-200 hover:border-[#C5A059]'
                                                    }`}
                                                >
                                                    <span className="flex items-center gap-1.5 font-medium">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {slot.startTime} – {slot.endTime}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 mt-1 block">{left} left</span>
                                                    {selected && <CheckCircle2 className="w-4 h-4 text-[#124935] mt-1" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                            <input type="date" required value={custom.date} onChange={(e) => setCustom((c) => ({ ...c, date: e.target.value }))} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Start</label>
                            <input type="time" required value={custom.startTime} onChange={(e) => setCustom((c) => ({ ...c, startTime: e.target.value }))} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">End</label>
                            <input type="time" value={custom.endTime} onChange={(e) => setCustom((c) => ({ ...c, endTime: e.target.value }))} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>
                )}

                {/* Booking details — BlueStone style, no WhatsApp */}
                <div className="pt-2 border-t border-gray-100">
                    <h2 className="text-xl font-serif text-[#222] mb-1">Enter your details</h2>
                    <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-5">Booking information</p>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                required
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                placeholder="Your Full Name"
                                className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-3 text-sm outline-none focus:border-[#2E7D32]"
                            />
                        </div>
                        <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                required
                                type="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-3 text-sm outline-none focus:border-[#2E7D32]"
                            />
                        </div>
                    </div>

                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        maxLength={300}
                        placeholder="Optional note for the consultant..."
                        className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting || !scopedItems.length}
                    className="w-full py-3.5 rounded-full bg-[#3E2723] hover:bg-[#4a322c] text-white text-sm font-bold tracking-wide disabled:opacity-60"
                >
                    {submitting ? 'Sending...' : 'BOOK VIDEO CALL'}
                </button>
            </form>
        </div>
    );
}

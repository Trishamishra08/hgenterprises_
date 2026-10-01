import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle2, Cog, Gem, Wrench, User, Phone, MapPin, Store, ShoppingCart, LocateFixed } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import { useShop } from '../../../context/ShopContext';
import { STORE_CITIES } from '../data/storeLocatorData';

const SEEN_KEY = 'hg_welcome_popup_seen';
const SHOW_DELAY_MS = 1500;

// What the visitor is enquiring about (replaces a single product name in the enquiry card)
const INTERESTS = [
    { id: 'machines', label: 'Machines', icon: Cog },
    { id: 'jewellery', label: 'Jewellery', icon: Gem },
    { id: 'tools', label: 'Tools', icon: Wrench },
];

const BUY_PLANS = ['Immediately', 'Within 1 week', 'Within 1 month', '1 – 3 months', 'Just exploring'];

// Offer shown under the interest picker. Machines has a fixed service offer; the others use the best active coupon.
const MACHINE_OFFER = '10% Off on Machine Assembly & Service Charges.';

const readSeen = () => {
    try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
};
const markSeen = () => {
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* private mode */ }
};

/**
 * Shown once per browser session shortly after the site opens.
 * Step 1: "Get updates" prompt (Not now / Allow) → Step 2: details + enquiry form.
 * Submissions are stored through the existing /suggestions endpoint (visible in Admin → Suggestions).
 */
const WelcomePopup = () => {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState('prompt'); // 'prompt' | 'form' | 'done'
    const [submitting, setSubmitting] = useState(false);
    const { coupons } = useShop();
    const [interest, setInterest] = useState('machines');
    const [detecting, setDetecting] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', location: '', store: '', plan: '' });

    const bestCoupon = (coupons || [])
        .filter((c) => c.active && c.type === 'percent' && (!c.validUntil || new Date(c.validUntil) > new Date()))
        .sort((a, b) => b.value - a.value)[0];
    const offer = interest === 'machines'
        ? { headline: MACHINE_OFFER, badge: 'Save 10%' }
        : bestCoupon
            ? { headline: `${bestCoupon.value}% off on Making Charges: Use ${bestCoupon.code}`, badge: `Save ${bestCoupon.value}%` }
            : null;

    const detectLocation = () => {
        if (!navigator.geolocation) return toast.error('Location is not supported on this device');
        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`);
                    const data = await res.json();
                    const a = data.address || {};
                    const place = [a.suburb || a.neighbourhood, a.city || a.town || a.village || a.state_district, a.state].filter(Boolean).join(', ');
                    setForm((f) => ({ ...f, location: place || `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}` }));
                } catch {
                    setForm((f) => ({ ...f, location: `${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}` }));
                } finally {
                    setDetecting(false);
                }
            },
            () => { setDetecting(false); toast.error('Could not detect your location. Please type it.'); },
            { timeout: 8000 }
        );
    };

    useEffect(() => {
        if (readSeen()) return undefined;
        const t = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
        return () => clearTimeout(t);
    }, []);

    const close = () => {
        markSeen();
        setOpen(false);
    };

    const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        if (!/^[0-9+\-\s]{8,15}$/.test(form.phone.trim())) return toast.error('Please enter a valid phone number');
        try {
            setSubmitting(true);
            await api.post('/suggestions', {
                name: form.name.trim(),
                phone: form.phone.trim(),
                source: 'welcome-popup',
                message: [
                    `[Welcome enquiry] Interested in: ${INTERESTS.find((i) => i.id === interest).label}`,
                    `Phone: ${form.phone.trim()}`,
                    `Location: ${form.location.trim()}`,
                    form.store ? `Preferred store: ${form.store}` : '',
                    form.plan ? `Plans to buy: ${form.plan}` : '',
                ].filter(Boolean).join(' | '),
            });
            markSeen();
            setStep('done');
            setTimeout(() => setOpen(false), 2200);
        } catch (err) {
            toast.error('Could not send your details. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = 'w-full border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[#8B4356] bg-white';

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[400] flex items-start justify-center bg-black/55 px-4 pt-[12vh]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Get updates and enquiry"
                        className="w-full max-w-[440px] bg-white rounded-lg overflow-hidden shadow-2xl"
                        initial={{ y: -24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -24, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="bg-[#8B4356] text-white px-5 py-5 flex items-center justify-between">
                            <h2 className="text-base tracking-[0.15em] uppercase font-medium">
                                {step === 'form' ? 'Enquire Now' : step === 'done' ? 'Thank You' : 'Get Updates'}
                            </h2>
                            {step === 'form' ? (
                                <button onClick={close} aria-label="Close" className="text-white/70 hover:text-white"><X size={18} /></button>
                            ) : (
                                <Bell size={18} className="text-white/70" />
                            )}
                        </div>

                        {step === 'prompt' && (
                            <>
                                <p className="px-5 pt-7 pb-6 text-[15px] text-zinc-700 leading-relaxed">
                                    We promise to only send you relevant content and give you updates on your orders, offers and enquiries.
                                </p>
                                <div className="grid grid-cols-2 border-t border-zinc-100 bg-zinc-50">
                                    <button onClick={close} className="py-4 text-zinc-400 hover:text-zinc-600 text-lg tracking-wide border-r border-zinc-200">Not now</button>
                                    <button onClick={() => setStep('form')} className="py-4 text-zinc-900 hover:bg-zinc-100 text-lg tracking-wide">Allow</button>
                                </div>
                            </>
                        )}

                        {step === 'form' && (
                            <form onSubmit={submit} className="p-5 space-y-4 max-h-[78vh] overflow-y-auto">
                                <div>
                                    <p className="text-[13px] text-zinc-500">Fill in the data to get a callback</p>
                                </div>

                                {/* Interest: Machines / Jewellery / Tools */}
                                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="I am interested in">
                                    {INTERESTS.map(({ id, label, icon: Icon }) => (
                                        <button
                                            key={id}
                                            type="button"
                                            role="radio"
                                            aria-checked={interest === id}
                                            onClick={() => setInterest(id)}
                                            className={`flex flex-col items-center gap-1 py-2.5 border text-xs font-semibold transition-colors ${interest === id ? 'border-[#8B4356] bg-[#8B4356]/5 text-[#8B4356]' : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                                        >
                                            <Icon size={20} /> {label}
                                        </button>
                                    ))}
                                </div>

                                {offer && (
                                    <div className="flex items-center justify-between gap-3 bg-[#8B4356]/5 border border-[#8B4356]/20 px-3 py-2.5">
                                        <p className="text-[12.5px] text-zinc-700 leading-snug">{offer.headline}</p>
                                        <span className="shrink-0 text-[11px] font-bold text-white bg-[#8B4356] px-2 py-1">{offer.badge}</span>
                                    </div>
                                )}

                                <label className="flex items-center gap-3 border-b border-zinc-300 pb-2">
                                    <User size={18} className="text-[#8B4356] shrink-0" />
                                    <input required className="flex-1 outline-none text-sm bg-transparent" placeholder="Name *" value={form.name} onChange={update('name')} />
                                </label>
                                <label className="flex items-center gap-3 border-b border-zinc-300 pb-2">
                                    <Phone size={18} className="text-[#8B4356] shrink-0" />
                                    <input required className="flex-1 outline-none text-sm bg-transparent" placeholder="Mobile Number *" inputMode="tel" value={form.phone} onChange={update('phone')} />
                                </label>
                                <div className="flex items-center gap-3 border-b border-zinc-300 pb-2">
                                    <MapPin size={18} className="text-[#8B4356] shrink-0" />
                                    <input required className="flex-1 min-w-0 outline-none text-sm bg-transparent" placeholder="Location *" value={form.location} onChange={update('location')} />
                                    <span className="text-xs text-zinc-500">OR</span>
                                    <button type="button" onClick={detectLocation} disabled={detecting} className="flex items-center gap-1 border border-[#8B4356] text-[#8B4356] rounded-full px-2.5 py-1 text-xs font-semibold disabled:opacity-50">
                                        <LocateFixed size={13} /> {detecting ? '…' : 'Detect'}
                                    </button>
                                </div>
                                <label className="flex items-center gap-3 border-b border-zinc-300 pb-2">
                                    <Store size={18} className="text-[#8B4356] shrink-0" />
                                    <select className="flex-1 outline-none text-sm bg-transparent text-zinc-700" value={form.store} onChange={update('store')}>
                                        <option value="">Nearest HG store</option>
                                        {STORE_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </label>
                                <label className="flex items-center gap-3 border-b border-zinc-300 pb-2">
                                    <ShoppingCart size={18} className="text-[#8B4356] shrink-0" />
                                    <select className="flex-1 outline-none text-sm bg-transparent text-zinc-700" value={form.plan} onChange={update('plan')}>
                                        <option value="">When do you plan to buy?</option>
                                        {BUY_PLANS.map((o) => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </label>

                                <button type="submit" disabled={submitting} className="w-full py-3 text-sm font-semibold bg-[#8B4356] text-white hover:bg-[#6f3345] disabled:opacity-60">
                                    {submitting ? 'Sending…' : 'Request Callback'}
                                </button>
                                <button type="button" onClick={close} className="w-full text-xs text-zinc-400 hover:text-zinc-600">I'll do this later</button>
                            </form>
                        )}

                        {step === 'done' && (
                            <div className="px-5 py-10 text-center">
                                <CheckCircle2 className="mx-auto text-emerald-500 mb-3" size={40} />
                                <p className="text-zinc-700">We've received your details. Our team will call you back shortly.</p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomePopup;

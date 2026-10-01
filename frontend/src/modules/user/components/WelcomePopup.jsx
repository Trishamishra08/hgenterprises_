import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';

const SEEN_KEY = 'hg_welcome_popup_seen';
const SHOW_DELAY_MS = 1500;

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
    const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

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
                email: form.email.trim(),
                phone: form.phone.trim(),
                source: 'welcome-popup',
                message: `[Welcome enquiry] Phone: ${form.phone.trim()}${form.message.trim() ? ` — ${form.message.trim()}` : ''}`,
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
                                {step === 'form' ? 'Details & Enquiry' : step === 'done' ? 'Thank You' : 'Get Updates'}
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
                            <form onSubmit={submit} className="p-5 space-y-3">
                                <p className="text-[13px] text-zinc-500">Share your details and our team will reach out about products, pricing and custom requirements.</p>
                                <input required className={inputClass} placeholder="Your name" value={form.name} onChange={update('name')} />
                                <input required className={inputClass} placeholder="Phone number" inputMode="tel" value={form.phone} onChange={update('phone')} />
                                <input required type="email" className={inputClass} placeholder="Email address" value={form.email} onChange={update('email')} />
                                <textarea className={`${inputClass} resize-none`} rows={3} placeholder="What are you looking for? (optional)" value={form.message} onChange={update('message')} />
                                <div className="flex items-center gap-3 pt-1">
                                    <button type="button" onClick={close} className="flex-1 py-3 text-sm text-zinc-500 border border-zinc-200 hover:bg-zinc-50">Not now</button>
                                    <button type="submit" disabled={submitting} className="flex-1 py-3 text-sm font-semibold bg-[#8B4356] text-white hover:bg-[#6f3345] disabled:opacity-60">
                                        {submitting ? 'Sending…' : 'Send Enquiry'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 'done' && (
                            <div className="px-5 py-10 text-center">
                                <CheckCircle2 className="mx-auto text-emerald-500 mb-3" size={40} />
                                <p className="text-zinc-700">We've received your details and will be in touch shortly.</p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomePopup;

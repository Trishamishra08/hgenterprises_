import { useState } from 'react';
import { X, Phone } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Compact login popup for video-call schedule gate.
 * Phone OTP flow (same as site login).
 */
export default function LoginPopup({ open, onClose, onSuccess, title = 'Login to continue' }) {
    const { sendOTP, verifyOTP } = useAuth();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState('phone'); // phone | otp
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleSend = async (e) => {
        e.preventDefault();
        if (phone.replace(/\D/g, '').length < 10) {
            toast.error('Enter a valid 10-digit mobile number');
            return;
        }
        setLoading(true);
        const res = await sendOTP(phone);
        setLoading(false);
        if (!res.success) {
            toast.error(res.message || 'Failed to send OTP');
            return;
        }
        setStep('otp');
        toast.success('OTP sent');
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) {
            toast.error('Enter 6-digit OTP');
            return;
        }
        setLoading(true);
        const res = await verifyOTP({ phone, otp: code });
        setLoading(false);
        if (!res.success) {
            toast.error(res.message || 'Invalid OTP');
            return;
        }
        toast.success('Logged in');
        onSuccess?.();
        onClose?.();
    };

    const onOtpChange = (value, index) => {
        if (isNaN(value)) return;
        const next = [...otp];
        next[index] = value.slice(-1);
        setOtp(next);
        if (value && index < 5) {
            const el = document.getElementById(`vc-otp-${index + 1}`);
            el?.focus();
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close overlay"
                className="absolute inset-0 bg-[#3E2723]/50 backdrop-blur-[2px]"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md bg-[#FDF5F6] border border-[#EBCDD0] rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBCDD0] bg-white">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">HG Enterprises</p>
                        <h2 className="font-serif text-xl text-[#3E2723]">{title}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-[#FDF5F6] flex items-center justify-center text-[#3E2723]/60"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-5 md:p-6">
                    <p className="text-sm text-[#3E2723]/70 mb-5">
                        Sign in to schedule your video consultation with our team.
                    </p>

                    {step === 'phone' ? (
                        <form onSubmit={handleSend} className="space-y-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3E2723]/40">
                                Mobile number
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C5A059]" />
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="10-digit number"
                                    inputMode="numeric"
                                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-[#EBCDD0] bg-white text-sm text-[#3E2723] outline-none focus:border-[#C5A059]"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-full bg-[#3E2723] text-white text-sm font-semibold hover:bg-[#4a322c] disabled:opacity-60"
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-4">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#3E2723]/40">
                                Enter OTP
                            </label>
                            <div className="flex gap-2 justify-between">
                                {otp.map((d, i) => (
                                    <input
                                        key={i}
                                        id={`vc-otp-${i}`}
                                        value={d}
                                        onChange={(e) => onOtpChange(e.target.value, i)}
                                        maxLength={1}
                                        className="w-10 h-12 text-center rounded-lg border border-[#EBCDD0] bg-white text-sm font-bold text-[#3E2723] outline-none focus:border-[#C5A059]"
                                    />
                                ))}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-full bg-[#3E2723] text-white text-sm font-semibold hover:bg-[#4a322c] disabled:opacity-60"
                            >
                                {loading ? 'Verifying...' : 'Verify & Continue'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep('phone')}
                                className="w-full text-xs text-[#6b252c] hover:underline"
                            >
                                Change number
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

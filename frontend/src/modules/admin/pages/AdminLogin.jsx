import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, ArrowRight, Sparkles } from 'lucide-react';
import hgLogo from '../../user/assets/logo_final.jpg';
import { useAuth } from '../../../context/AuthContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await login(email, password);
            if (res.success) {
                // Verify if real admin
                const token = localStorage.getItem('hg_token');
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload.role === 'admin') {
                        localStorage.setItem('isAdminLoggedIn', 'true');
                        navigate('/admin');
                    } else {
                        setError('ACCESS DENIED: INSUFFICIENT PERMISSIONS');
                        setLoading(false);
                    }
                }
            } else {
                setError(res.message.toUpperCase());
                setLoading(false);
            }
        } catch (err) {
            setError('CRITICAL: CONNECTION UNSTABLE');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 font-outfit">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-[450px] relative z-10">
                {/* Login Card - High Density Geometric */}
                <div className="bg-white rounded-none shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10">
                    {/* Editorial Header */}
                    <div className="bg-black p-8 text-center relative border-b border-white/5">
                        <img
                            src={hgLogo}
                            alt="HG"
                            className="h-12 w-auto mx-auto mb-6 object-contain mix-blend-screen grayscale brightness-200"
                        />
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Shield size={12} className="text-gold" />
                            <span className="text-[8px] font-black text-gold uppercase tracking-[0.5em]">Security Protocol</span>
                        </div>
                        <h1 className="text-2xl font-serif font-black text-white tracking-tighter uppercase italic">Harshad Gauri</h1>
                        <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mt-1">Administrative Control Entry</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 rounded-none text-[9px] font-black uppercase tracking-widest animate-pulse">
                                {error}
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Registry Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ADMIN@HGENTERPRISES.COM"
                                    disabled={loading}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-black/5 rounded-none text-[10px] font-black uppercase tracking-widest text-black outline-none focus:bg-white focus:border-gold transition-all duration-300 disabled:opacity-50 placeholder:text-gray-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Access Cipher</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-black/5 rounded-none text-[10px] font-black tracking-widest text-black outline-none focus:bg-white focus:border-gold transition-all duration-300 disabled:opacity-50 placeholder:text-gray-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-none font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-gold hover:text-black transition-all duration-500 shadow-xl active:scale-[0.98] group overflow-hidden relative"
                        >
                            <div className="relative z-10 flex items-center gap-3">
                                {loading ? 'INITIATING...' : 'AUTHORIZE ENTRY'}
                                {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                            </div>
                            <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                        </button>
                    </form>

                    {/* Visual Credential Hint */}
                    <div className="px-8 pb-8 flex items-center justify-center gap-4">
                        <div className="h-[1px] flex-1 bg-black/5"></div>
                        <div className="flex items-center gap-1.5 text-[7px] font-black text-gray-300 uppercase tracking-widest">
                            <Sparkles size={8} /> Admin Tier Access Only
                        </div>
                        <div className="h-[1px] flex-1 bg-black/5"></div>
                    </div>
                </div>

                {/* Footer Footer */}
                <div className="mt-8 flex flex-col items-center gap-4">
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em]">
                        © 2026 HARSHAD GAURI ENTERPRISES • ENCRYPTED SESSION
                    </p>
                    <div className="flex gap-6">
                        <span className="text-[7px] font-black text-white/10 uppercase tracking-widest cursor-not-allowed">Protocol V4.2</span>
                        <span className="text-[7px] font-black text-white/10 uppercase tracking-widest cursor-not-allowed">Cloud Registry</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

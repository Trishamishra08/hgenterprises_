import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import loginBg from '../assets/admin-login-bg.png';
import logoName from '../../user/assets/logo_final.jpg';
import { useAuth } from '../../../context/AuthContext';

const AdminLogin = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        if (result.success) {
            localStorage.setItem('adminAuth', 'true'); // Keep this for the current fake AdminProtectedRoute
            navigate('/admin');
        } else {
            setError(result.message || 'Invalid credentials');
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center p-6 font-sans relative overflow-hidden bg-black">
            {/* Background Image with Zoom & Blur Animation */}
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${loginBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(10%) brightness(50%)'
                }}
            />

            {/* Design Gradients */}
            <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black via-black/40 to-transparent" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-[360px] w-full relative z-20"
            >
                {/* Branding Section */}
                <div className="text-center mb-6 flex flex-col items-center">
                    <motion.img
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        src={logoName}
                        alt="HG Enterprises"
                        className="h-10 md:h-12 w-auto object-contain mix-blend-screen drop-shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                    />
                    <div className="mt-4 flex items-center gap-3 w-full px-8">
                        <div className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                        <p className="text-gold/60 text-[8px] uppercase tracking-[0.8em] font-black whitespace-nowrap">Admin Portal</p>
                        <div className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                    </div>
                </div>

                {/* Premium Compact Card */}
                <div className="bg-white/95 backdrop-blur-3xl p-6 md:p-8 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/40 overflow-hidden group">
                    {/* Progress Bar for Loading */}
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                className="absolute top-0 left-0 h-1 bg-primary/40 z-30"
                            />
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                            <ShieldCheck size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Authenticate</h2>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="bg-red-50 border border-red-100 p-3 rounded-2xl flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-tight"
                                >
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-1 group">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Identity</label>
                            <div className="relative overflow-hidden rounded-2xl border border-gray-100 transition-all duration-300 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5">
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="hgenterprises@gmail.com"
                                    className="w-full bg-gray-50/50 py-3.5 pl-11 pr-4 text-xs font-bold text-gray-800 outline-none placeholder:text-gray-300"
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-1 group">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Security Key</label>
                            <div className="relative overflow-hidden rounded-2xl border border-gray-100 transition-all duration-300 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5">
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50/50 py-3.5 pl-11 pr-11 text-xs font-bold text-gray-800 outline-none placeholder:text-gray-300"
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#3E2723] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:opacity-70 group overflow-hidden relative"
                        >
                            <span className="relative z-10">{loading ? 'Verifying...' : 'Access Portal'}</span>
                            {!loading && <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform relative z-10" />}
                        </button>

                        <div className="pt-2 text-center">
                            <div className="bg-[#FCFAF8] p-3 rounded-2xl border border-[#EEE6DE] inline-block w-full">
                                <p className="text-[8px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Encrypted Credentials</p>
                                <p className="text-[10px] font-mono text-[#5D4037] font-black tracking-tight">
                                    hgenterprises@gmail.com / admin12345
                                </p>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Credits */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-8 text-[9px] text-white/40 font-bold tracking-[0.4em] uppercase"
                >
                    &copy; {new Date().getFullYear()} HG Enterprises &middot; Zero Trust Access
                </motion.p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;

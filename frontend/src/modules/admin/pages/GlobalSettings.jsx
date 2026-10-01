import React, { useState, useEffect } from 'react';
import { 
    Mail, 
    Lock, 
    Save, 
    ShieldCheck, 
    Eye, 
    EyeOff, 
    AlertCircle, 
    User,
    Key,
    Shield
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import toast from 'react-hot-toast';
import PageHeader from '../components/common/PageHeader';
import { useShop } from '../../../context/ShopContext';


const GlobalSettings = () => {
    const { user, setUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Deep link from the header account menu: /admin/settings#security
    useEffect(() => {
        if (window.location.hash === '#security') {
            setTimeout(() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' }), 150);
        }
    }, []);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Profile State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name,
                email: user.email,
                phone: user.phone
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const res = await api.put('/auth/profile', profileData);
            setUser(res.data.user);
            toast.success('Admin Profile Updated Successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Passwords do not match!');
        }

        setIsChangingPassword(true);
        try {
            await api.put('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Admin Password Changed Successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Password change failed');
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Dashboard Layout Handlers
    const moveSection = (index, direction) => {
        if (!settings.dashboardLayout) return;
        const newLayout = [...settings.dashboardLayout];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newLayout.length) return;

        [newLayout[index], newLayout[newIndex]] = [newLayout[newIndex], newLayout[index]];

        // Update orders
        const finalLayout = newLayout.map((s, i) => ({ ...s, order: i + 1 }));
        setSettings(prev => ({ ...prev, dashboardLayout: finalLayout }));
    };

    const toggleSection = (id) => {
        if (!settings.dashboardLayout) return;
        setSettings(prev => ({
            ...prev,
            dashboardLayout: prev.dashboardLayout.map(s =>
                s.id === id ? { ...s, enabled: !s.enabled } : s
            )
        }));
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 font-sans">
            {/* Page Header */}
            <div className="px-1">
                <PageHeader 
                    title="Admin Account Settings" 
                    subtitle="Manage your administrative credentials and access security"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Section */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-black/[0.02] overflow-hidden flex flex-col h-full">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-[#3E2723]">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-[#3E2723]">Profile Identity</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Admin Email & Basic Details</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="p-8 space-y-6 flex-1">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Admin Display Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#3E2723] transition-colors" />
                                        <input 
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#3E2723]/5 focus:border-[#3E2723]/20 transition-all"
                                            placeholder="Enter Admin Name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Admin Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#3E2723] transition-colors" />
                                        <input 
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#3E2723]/5 focus:border-[#3E2723]/20 transition-all"
                                            placeholder="hgenterprises@gmail.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Contact Phone</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 flex items-center justify-center font-bold text-[10px]">+91</div>
                                        <input 
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#3E2723]/5 focus:border-[#3E2723]/20 transition-all"
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSavingProfile}
                                className="w-full bg-[#3E2723] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#3E2723]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {isSavingProfile ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Update Profile</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Password Section */}
                <div className="lg:col-span-7 scroll-mt-20" id="security">
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-black/[0.02] overflow-hidden flex flex-col h-full">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-amber-600">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-[#3E2723]">Security & Access</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Manage Admin Passcode</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordChange} className="p-8 space-y-6 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Current Passcode</label>
                                    <div className="relative group">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-amber-500 transition-colors" />
                                        <input 
                                            type={showPasswords.current ? 'text' : 'password'}
                                            required
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                            className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500/20 transition-all"
                                            placeholder="Enter Current Passcode"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">New Passcode</label>
                                    <div className="relative group">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-amber-500 transition-colors" />
                                        <input 
                                            type={showPasswords.new ? 'text' : 'password'}
                                            required
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                            className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500/20 transition-all"
                                            placeholder="Create New"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confirm New</label>
                                    <div className="relative group">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-amber-500 transition-colors" />
                                        <input 
                                            type={showPasswords.confirm ? 'text' : 'password'}
                                            required
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                            className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500/20 transition-all"
                                            placeholder="Repeat New"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 p-5 rounded-[1.5rem] border border-amber-100 flex gap-4">
                                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-wider">
                                    Ensure your new passcode is strong. After updating, you may need to re-authenticate for security purposes.
                                </p>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isChangingPassword}
                                className="w-full bg-amber-600 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-amber-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {isChangingPassword ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Confirm Passcode Change</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalSettings;

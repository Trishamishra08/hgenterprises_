import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Search, Mail, Phone, Calendar,
    MoreHorizontal, Eye, UserX, UserCheck,
    Download, ArrowUpRight, Shield, ShoppingBag, Heart,
    ShieldCheck, ShieldOff, UserPlus, Users, ArrowRight
} from 'lucide-react';
import AdminStatsCard from '../components/AdminStatsCard';

import { useShop } from '../../../context/ShopContext';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const navigate = useNavigate();
    const { users, refreshOrders, orders } = useShop();
    const [searchTerm, setSearchTerm] = useState('');

    const toggleStatus = async (userId) => {
        try {
            await api.patch(`/auth/users/${userId}/status`);
            toast.success("User configuration updated");
            await refreshOrders(); // Refresh to get updated user list
        } catch (error) {
            toast.error("Failed to update user protocol");
        }
    };

    // Calculate user stats from orders
    const getUserMetrics = (userId) => {
        const userOrders = (orders || []).filter(o => (o.userId?._id || o.userId) === userId);
        const count = userOrders.length;
        const total = userOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);
        return { count, total };
    };

    const filteredUsers = (users || []).filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-3 animate-in fade-in duration-500 pb-20 font-outfit text-left">
            {/* Header Section */}
            <div className="bg-white p-3 border border-black/5 rounded-none shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight leading-none uppercase">User Registry</h1>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Global Authentication & Access Control Console</p>
                </div>
                <button className="px-5 py-2.5 bg-black text-white rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-black shadow-xl shadow-black/20 transition-all flex items-center gap-3 active:scale-95 group">
                    <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                    <span>Export User Statistics</span>
                </button>
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <AdminStatsCard
                    label="TOTAL REGISTERED USERS"
                    value={(users || []).length.toString().padStart(2, '0')}
                    icon={Users}
                    color="text-footerBg"
                    bgColor="bg-gray-50"
                />
                <AdminStatsCard
                    label="AUTHENTICATED ACCESS"
                    value={(users || []).filter(u => u.isActive !== false).length.toString().padStart(2, '0')}
                    icon={ShieldCheck}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <AdminStatsCard
                    label="RESTRICTED ACCOUNTS"
                    value={(users || []).filter(u => u.isActive === false).length.toString().padStart(2, '0')}
                    icon={ShieldOff}
                    color="text-red-600"
                    bgColor="bg-red-50"
                />
            </div>

            {/* Controls Console */}
            <div className="bg-white p-2 rounded-none border border-black/5 shadow-sm flex items-center gap-4 sticky top-14 z-20">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type="text"
                        placeholder="SEARCH BY NAME, EMAIL, OR PROTOCOL ID..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-none border border-transparent text-[9px] font-black uppercase tracking-widest text-footerBg outline-none focus:bg-white focus:border-black/10 transition-all placeholder:text-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden font-outfit">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-black/5">
                            <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest font-outfit">
                                <th className="px-6 py-3">Subject Profile</th>
                                <th className="px-6 py-3">Protocol Entry</th>
                                <th className="px-6 py-3 text-center">Cycle Volume</th>
                                <th className="px-6 py-3 text-center">Capital Flux</th>
                                <th className="px-6 py-3 text-center">Auth State</th>
                                <th className="px-6 py-3 text-right">Matrix Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 text-[10px] font-black uppercase tracking-tight text-gray-900 font-outfit">
                            {filteredUsers.map((user) => {
                                const metrics = getUserMetrics(user._id);
                                const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
                                const isActive = user.isActive !== false;

                                return (
                                    <tr key={user._id} className="hover:bg-[#FDF5F6]/20 transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-none bg-black flex items-center justify-center text-white font-black border border-white/10 shadow-lg text-[10px]">
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-black leading-none">{user.name || 'Anonymous'}</p>
                                                    <p className="text-[9px] text-gray-400 font-bold lowercase tracking-normal mt-1">{user.email || 'No email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-black tracking-widest tabular-nums">
                                                <Calendar className="w-3 h-3 text-gold" />
                                                {joinedDate}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-center font-black text-gray-400 tabular-nums">
                                            {metrics.count.toString().padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-3 text-center font-serif font-black text-black tabular-nums tracking-tighter text-sm">
                                            ₹{metrics.total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest border transition-all ${isActive
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-red-50 text-red-600 border-red-100'
                                                }`}>
                                                {isActive ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => navigate(`/admin/users/view/${user._id}`)}
                                                    className="p-1 px-2 border border-black/5 bg-white text-gray-400 hover:text-black hover:border-black transition-all shadow-sm active:scale-95"
                                                    title="Inspect Profile"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(user._id)}
                                                    className={`p-1 px-2 border border-black/5 bg-white transition-all shadow-sm active:scale-95 ${isActive
                                                        ? 'text-red-400 hover:text-red-600 hover:border-red-100'
                                                        : 'text-emerald-400 hover:text-emerald-600 hover:border-emerald-100'
                                                        }`}
                                                    title={isActive ? 'Revoke Access' : 'Restore Access'}
                                                >
                                                    {isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/admin/users/view/${user._id}`)}
                                                    className="ml-2 bg-black text-white p-1 px-3 rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all flex items-center gap-2 active:scale-95"
                                                >
                                                    VIEW <ArrowRight size={10} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;

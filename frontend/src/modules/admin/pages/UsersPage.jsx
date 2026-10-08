import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    ShieldOff,
    ShieldCheck,
    Mail,
    Phone,
    ArrowUpDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import Pagination from '../components/Pagination';

const UsersPage = () => {
    const navigate = useNavigate();
    const { orders, users, toggleUserStatus } = useShop();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Calculate user metrics
    const usersWithStats = useMemo(() => {
        return users.map(user => {
            const userId = user._id || user.id;
            const userOrders = Array.isArray(orders) ? orders.filter(o => o.userId === userId || o.userId?._id === userId) : [];
            const totalSpend = userOrders.reduce((acc, o) => acc + (o.total || o.amount || 0), 0);
            return {
                ...user,
                id: userId,
                totalOrders: userOrders.length,
                totalSpend
            };
        });
    }, [users, orders]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredUsers = useMemo(() => {
        return usersWithStats
            .filter(user => {
                const matchesSearch =
                    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.phone?.includes(searchTerm);

                const matchesStatus =
                    statusFilter === 'All' ||
                    (statusFilter === 'Active' && !user.isBlocked) ||
                    (statusFilter === 'Blocked' && user.isBlocked);

                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => b.id?.localeCompare(a.id) || 0);
    }, [usersWithStats, searchTerm, statusFilter]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handleToggleBlock = (userId) => {
        toggleUserStatus(userId);
    };

    const stats = [
        { label: 'Total Registered', value: users.length, icon: ShieldCheck },
        { label: 'Active Today', value: users.filter(u => !u.isBlocked).length, icon: Eye },
        { label: 'Flagged / Restricted', value: users.filter(u => u.isBlocked).length, icon: ShieldOff }
    ];

    return (
        <div className="space-y-8 text-left">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">User CRM</h1>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Manage customer profiles and account security</p>
                </div>
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {[
                    {
                        label: 'Active Users',
                        value: users.filter(u => !u.isBlocked).length,
                        icon: ShieldCheck,
                        color: 'bg-emerald-50 text-emerald-600',
                        border: 'border-emerald-100'
                    },
                    {
                        label: 'Disabled Users',
                        value: users.filter(u => u.isBlocked).length,
                        icon: ShieldOff,
                        color: 'bg-red-50 text-red-600',
                        border: 'border-red-100'
                    }
                ].map((stat, i) => (
                    <div key={i} className={`bg-white p-6 rounded-3xl border ${stat.border} shadow-sm flex items-center justify-between hover:shadow-md transition-all`}>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                            <p className="text-4xl font-black text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center`}>
                            <stat.icon size={28} strokeWidth={2} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-12 pr-4 text-sm font-semibold focus:bg-white focus:border-primary outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                        {['All', 'Active', 'Blocked'].map(f => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === f ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-footerBg'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50 bg-gray-50/50">
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Orders</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Spend</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#3E2723]/5 text-[#3E2723] rounded-full flex items-center justify-center font-bold text-sm border border-[#3E2723]/10">
                                                {user.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{user.name || 'Anonymous'}</p>
                                                <p className="text-[10px] text-gray-400 font-semibold tracking-wide mt-0.5">ID: #{user.id?.slice(-6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                                                <Mail size={12} className="text-gray-400" />
                                                {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500">
                                                <Phone size={12} className="text-gray-400" />
                                                {user.phone || 'No phone'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${user.isBlocked
                                            ? 'bg-red-50 text-red-600 border-red-100'
                                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-700 border border-gray-200">
                                            {user.totalOrders}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-left">
                                        <p className="font-black text-gray-900 text-sm tracking-tight">₹{user.totalSpend.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/users/${user.id}`)}
                                                className="p-2 text-gray-400 hover:text-[#3E2723] hover:bg-[#3E2723]/10 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleBlock(user.id)}
                                                className={`p-2 rounded-lg transition-all ${user.isBlocked
                                                    ? 'text-emerald-500 hover:bg-emerald-50'
                                                    : 'text-red-400 hover:bg-red-50'
                                                    }`}
                                                title={user.isBlocked ? 'Unblock User' : 'Block User'}
                                            >
                                                {user.isBlocked ? <ShieldCheck size={18} /> : <ShieldOff size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4 border border-dashed border-gray-200">
                                                <Search size={32} />
                                            </div>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No users found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    totalItems={filteredUsers.length}
                    itemsPerPage={itemsPerPage}
                />
            </div>
        </div>
    );
};

export default UsersPage;

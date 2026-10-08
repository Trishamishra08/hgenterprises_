import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Download,
    Trash2,
    CheckCircle2,
    Clock,
    DollarSign,
    Shield,
    XCircle,
    User,
    Compass,
    Sparkles,
    Calendar,
    RefreshCw
} from 'lucide-react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';
import Pagination from '../components/Pagination';
import AdminStatsCard from '../components/AdminStatsCard';

const SubscriptionList = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/subscriptions/admin/all');
            setSubscriptions(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch subscriptions');
            console.error('[FETCH SUBSCRIPTIONS ERROR]', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/subscriptions/admin/${id}/status`, { status });
            toast.success(`Subscription updated to ${status}`);
            fetchSubscriptions();
        } catch (error) {
            toast.error('Failed to update status');
            console.error('[UPDATE SUBSCRIPTION ERROR]', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subscription record? This action cannot be undone.')) return;
        try {
            await api.delete(`/subscriptions/admin/${id}`);
            toast.success('Subscription deleted successfully');
            fetchSubscriptions();
        } catch (error) {
            toast.error('Failed to delete subscription');
            console.error('[DELETE SUBSCRIPTION ERROR]', error);
        }
    };

    const filteredSubscriptions = useMemo(() => {
        return subscriptions.filter(s => {
            const matchesSearch =
                (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.productName || '').toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || s.status.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [subscriptions, searchTerm, statusFilter]);

    const stats = useMemo(() => {
        const totalAmount = subscriptions.reduce((sum, s) => sum + (s.monthlyInstallment || 0), 0);
        const projectedMaturity = subscriptions.reduce((sum, s) => sum + (s.maturityValue || 0), 0);
        return {
            total: subscriptions.length,
            staged: subscriptions.filter(s => s.status === 'Staged').length,
            active: subscriptions.filter(s => s.status === 'Active').length,
            completed: subscriptions.filter(s => s.status === 'Completed').length,
            monthlyRevenue: totalAmount,
            projectedMaturity: projectedMaturity
        };
    }, [subscriptions]);

    const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
    const paginatedItems = filteredSubscriptions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Staged': return 'bg-amber-100 text-amber-600 border border-amber-200';
            case 'Active': return 'bg-emerald-100 text-emerald-600 border border-emerald-200';
            case 'Completed': return 'bg-blue-100 text-blue-600 border border-blue-200';
            case 'Cancelled': return 'bg-red-100 text-red-500 border border-red-200';
            default: return 'bg-gray-100 text-gray-600 border border-gray-200';
        }
    };

    if (loading) return <div className="p-10 text-center font-bold uppercase tracking-widest text-[10px] text-zinc-500 animate-pulse">Loading subscriptions registry...</div>;

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-10 text-left font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 border border-black/5 shadow-sm gap-4">
                <div>
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gold-dark">Exclusive Savings Scheme</span>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight uppercase mt-1">10+1 Monthly Subscription Inquiries</h1>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Manage customer digital mandates and gold savings ledgers</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchSubscriptions} className="px-5 h-11 border border-gray-200 text-[8px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
                        <RefreshCw size={11} /> Refresh Registry
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AdminStatsCard
                    label="TOTAL ENROLLMENTS"
                    value={stats.total.toString().padStart(2, '0')}
                    icon={User}
                    color="text-blue-600"
                    bgColor="bg-blue-50/50"
                />
                <AdminStatsCard
                    label="STAGED INQUIRIES"
                    value={stats.staged.toString().padStart(2, '0')}
                    icon={Clock}
                    color="text-amber-500"
                    bgColor="bg-amber-50/50"
                />
                <AdminStatsCard
                    label="ACTIVE PLANS"
                    value={stats.active.toString().padStart(2, '0')}
                    icon={Shield}
                    color="text-emerald-500"
                    bgColor="bg-emerald-50/50"
                />
                <AdminStatsCard
                    label="ESTIMATED MONTHLY SAVINGS"
                    value={`₹${stats.monthlyRevenue.toLocaleString()}`}
                    icon={Sparkles}
                    color="text-gold-dark font-black"
                    bgColor="bg-yellow-50/50"
                />
            </div>

            {/* Controls */}
            <div className="bg-white p-4 border border-black/5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input
                        type="text"
                        placeholder="Search by subscriber, email, phone or jewelry..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent text-[9px] font-black uppercase tracking-widest text-black outline-none focus:bg-white focus:border-black/10 transition-all"
                    />
                </div>
                <div className="flex bg-gray-50 p-1 border border-black/5 overflow-x-auto rounded-none">
                    {['All', 'Staged', 'Active', 'Completed', 'Cancelled'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setStatusFilter(tab.toLowerCase() === 'all' ? 'all' : tab); setCurrentPage(1); }}
                            className={`px-5 py-2 text-[8px] font-black uppercase tracking-widest transition-all ${(statusFilter.toLowerCase() === tab.toLowerCase() || (tab === 'All' && statusFilter === 'all'))
                                    ? 'bg-white text-black shadow-sm border border-black/5'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Enrolled Date</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Patron / Contact</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Target Jewelry</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Monthly / Maturity Fund</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedItems.map((s) => (
                                <tr key={s._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-[10px] font-black text-black">
                                            {new Date(s.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">
                                            {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[10px] font-black text-black uppercase tracking-tight">{s.name}</div>
                                        <div className="text-[8px] text-gray-500 font-semibold">{s.email}</div>
                                        <div className="text-[8px] text-zinc-400 font-medium mt-0.5">Tel: {s.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[10px] font-black text-[#8B4356] uppercase tracking-tight">{s.productName}</div>
                                        <div className="text-[8px] text-zinc-500 font-medium mt-0.5">Price: ₹{(s.productPrice || 0).toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[10px] font-black text-black">₹{(s.monthlyInstallment || 0).toLocaleString()} <span className="text-[8px] text-zinc-400 font-bold uppercase">/ Mo</span></div>
                                        <div className="text-[8px] text-emerald-600 font-bold uppercase tracking-tight mt-0.5">Matures to: ₹{(s.maturityValue || 0).toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 text-[7.5px] font-black uppercase tracking-widest flex items-center gap-1 w-fit rounded-full ${getStatusColor(s.status)}`}>
                                            <div className="w-1 h-1 rounded-full bg-current" />
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2">
                                            {s.status === 'Staged' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(s._id, 'Active')}
                                                    className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all rounded shadow-sm border border-emerald-100 hover:border-transparent"
                                                    title="Activate Plan"
                                                >
                                                    <CheckCircle2 size={12} />
                                                </button>
                                            )}
                                            {s.status === 'Active' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(s._id, 'Completed')}
                                                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all rounded shadow-sm border border-blue-100 hover:border-transparent"
                                                    title="Mark Completed"
                                                >
                                                    <CheckCircle2 size={12} />
                                                </button>
                                            )}
                                            {s.status !== 'Cancelled' && s.status !== 'Completed' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(s._id, 'Cancelled')}
                                                    className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded shadow-sm border border-red-100 hover:border-transparent"
                                                    title="Cancel Plan"
                                                >
                                                    <XCircle size={12} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(s._id)}
                                                className="p-2 bg-gray-50 text-gray-500 hover:bg-black hover:text-white transition-all rounded shadow-sm border border-zinc-200 hover:border-transparent"
                                                title="Delete Inquiry"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedItems.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center text-gray-400 uppercase text-[9px] font-black tracking-widest opacity-50">
                                        No monthly saving plan records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredSubscriptions.length}
                itemsPerPage={itemsPerPage}
            />
        </div>
    );
};

export default SubscriptionList;

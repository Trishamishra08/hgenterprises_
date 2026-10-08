import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { useShop } from '../../../context/ShopContext';
import {
    Search,
    Filter,
    ArrowUpRight,
    MoreVertical,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    Package,
    Shield,
    Database,
    Cpu,
    AlertCircle,
    RotateCcw,
    IndianRupee,
    Eye
} from 'lucide-react';


const ReturnsPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useShop();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        try {
            const res = await api.get('/returns?type=return');
            setReturns(res.data);
        } catch (error) {
            console.error('[FETCH RETURNS ERROR]', error);
            showNotification("Failed to fetch return protocols.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED':
            case 'REFUNDED': return 'text-emerald-600 border-emerald-200 bg-emerald-50';
            case 'APPROVED': return 'text-blue-600 border-blue-200 bg-blue-50';
            case 'REJECTED': return 'text-red-500 border-red-200 bg-red-50';
            case 'PENDING': return 'text-amber-600 border-amber-200 bg-amber-50';
            default: return 'text-gray-400 border-gray-100 bg-gray-50';
        }
    };

    const filteredReturns = returns.filter(item => {
        const matchesSearch =
            item.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item._id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || item.status?.toUpperCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-4 font-outfit animate-in fade-in duration-500 text-left pb-10">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-black/5 pb-4">
                <div>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight leading-none uppercase">Return Protocol</h1>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Logistical Inversion Management • FY 24-25</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-5 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-none hover:bg-gold hover:text-black transition-all">
                        Generate Report
                    </button>
                    <button className="px-5 py-2 border border-black/5 bg-[#FDF5F6] text-black text-[9px] font-black uppercase tracking-widest rounded-none hover:bg-gold transition-all">
                        Export Data
                    </button>
                </div>
            </div>

            {/* Metrics Row - Geometric */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                    { label: 'Active Requests', value: returns.length, icon: RotateCcw, trend: 'Global' },
                    { label: 'Pending Action', value: returns.filter(r => r.status === 'Pending').length, icon: Clock, trend: 'Critical' },
                    { label: 'Reversal Volume', value: `₹${returns.reduce((acc, r) => acc + (r.refundAmount || 0), 0)}`, icon: IndianRupee, trend: 'Monthly' },
                    { label: 'System Health', value: '98%', icon: CheckCircle2, trend: 'Optimal' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-3 border border-black/5 rounded-none shadow-sm relative overflow-hidden group hover:border-gold/30 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-1.5 bg-[#FDF5F6] text-gold border border-black/5">
                                <stat.icon size={13} />
                            </div>
                            <span className="text-[7px] font-black text-gold uppercase tracking-tighter bg-gold/5 px-1.5 py-0.5">{stat.trend}</span>
                        </div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                        <h3 className="text-xl font-serif font-black text-black tabular-nums tracking-tighter">{stat.value}</h3>
                        <div className="absolute top-0 right-0 w-10 h-10 bg-gold/[0.03] group-hover:bg-gold/[0.08] rotate-45 translate-x-5 -translate-y-5 transition-all"></div>
                    </div>
                ))}
            </div>

            {/* High Density Filter & Discovery */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 bg-white p-2 border border-black/5 rounded-none shadow-sm">
                <div className="lg:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type="text"
                        placeholder="SEARCH REFERENCE OR DATA SOURCE..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FDF5F6]/50 rounded-none border border-black/5 text-[10px] font-black text-black focus:border-gold outline-none placeholder:text-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="lg:col-span-2 flex gap-1 bg-[#FDF5F6]/50 p-1">
                    {['ALL', 'PENDING', 'APPROVED', 'REFUNDED', 'REJECTED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`flex-1 py-1.5 rounded-none text-[8px] font-black uppercase tracking-widest transition-all ${statusFilter === status
                                ? 'bg-black text-white'
                                : 'text-gray-400 hover:text-black hover:bg-white'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Protocol Table */}
            <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto font-outfit">
                    <table className="w-full text-left">
                        <thead className="bg-[#FDF5F6] border-b border-black/5 font-black uppercase text-gold text-[8px] tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-3">REF ID</th>
                                <th className="px-6 py-3">Source Order</th>
                                <th className="px-6 py-3">Legal Name</th>
                                <th className="px-6 py-3">Reason Code</th>
                                <th className="px-6 py-3 text-center">Valuation</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Flux Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 text-[10px] text-black">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Synchronizing Protocol Matrix...</td>
                                </tr>
                            ) : filteredReturns.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">No matching protocols identified.</td>
                                </tr>
                            ) : filteredReturns.map((item, idx) => (
                                <tr key={idx} className="hover:bg-[#FDF5F6]/30 transition-colors group">
                                    <td className="px-6 py-3">
                                        <span className="font-serif font-black tracking-tight text-sm">#{item._id.slice(-5)}</span>
                                        <p className="text-[6px] font-black text-gray-400 mt-0.5 tracking-widest uppercase">{new Date(item.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-3 font-black text-gray-500 tracking-widest">#{item.orderId?.replace('ORD-', '')}</td>
                                    <td className="px-6 py-3 font-black uppercase truncate max-w-[120px]">{item.userId?.name || 'Patron Unknown'}</td>
                                    <td className="px-6 py-3 italic font-serif text-gray-500">{item.reason}</td>
                                    <td className="px-6 py-3 text-center font-serif font-black text-[#AD8E4F]">₹{(item.items?.reduce((acc, i) => acc + i.price, 0) || 0).toLocaleString()}</td>
                                    <td className="px-6 py-3 text-center">
                                        <span className={`px-2 py-0.5 rounded-none text-[7px] font-black uppercase tracking-[0.2em] border ${getStatusStyle(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/returns/${item._id}`)}
                                            className="px-4 py-1.5 border border-black/5 bg-white text-black hover:bg-gold hover:text-black transition-all font-black text-[9px] uppercase tracking-widest rounded-none shadow-sm active:scale-95 flex items-center gap-2 ml-auto"
                                        >
                                            <Eye size={12} className="text-gold" /> Protocol Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReturnsPage;

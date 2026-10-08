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
    RefreshCw,
    ArrowRight
} from 'lucide-react';

const AdminStatsCard = ({ label, value, icon: Icon, color, bgColor }) => (
    <div className={`${bgColor} p-4 border border-black/5 rounded-none shadow-sm flex items-center gap-4 group hover:border-gold/30 transition-all cursor-default`}>
        <div className={`p-2 rounded-none ${color} bg-white/50 border border-black/5 transition-transform group-hover:scale-110`}>
            <Icon size={18} />
        </div>
        <div>
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-xl font-serif font-black text-black leading-none">{value}</p>
        </div>
    </div>
);

const ReplacementsPage = () => {
    const navigate = useNavigate();
    const { showNotification } = useShop();
    const [searchTerm, setSearchTerm] = useState('');
    const [replacements, setReplacements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReplacements();
    }, []);

    const fetchReplacements = async () => {
        try {
            const res = await api.get('/returns?type=exchange');
            setReplacements(res.data);
        } catch (error) {
            console.error('[FETCH REPLACEMENTS ERROR]', error);
            showNotification("Failed to fetch exchange protocols.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'SHIPPED': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
            case 'APPROVED': return 'bg-blue-50 text-blue-600 border border-blue-100';
            case 'PENDING': return 'bg-amber-50 text-amber-600 border border-amber-100';
            case 'REJECTED': return 'bg-red-50 text-red-600 border border-red-100';
            default: return 'bg-gray-50 text-gray-600 border border-gray-100';
        }
    };

    const filteredReplacements = replacements.filter(item => {
        const matchesSearch =
            item.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item._id?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    return (
        <div className="space-y-4 animate-in fade-in duration-500 font-outfit text-left">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-3 border border-black/5 rounded-none shadow-sm gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight leading-none uppercase">Replacement Matrix</h1>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Logistical Exchange & Discrepancy Control</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-black text-white rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all flex items-center gap-2 active:scale-95 group border border-transparent">
                        <Filter size={12} className="group-hover:scale-110 transition-transform" />
                        <span>Filter Matrix</span>
                    </button>
                </div>
            </div>

            {/* Matrix Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <AdminStatsCard
                    label="TOTAL EXCHANGES"
                    value={replacements.length}
                    icon={RefreshCw}
                    color="text-footerBg"
                    bgColor="bg-gray-50"
                />
                <AdminStatsCard
                    label="PENDING PROTOCOLS"
                    value={replacements.filter(r => r.status === 'Pending').length}
                    icon={Clock}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
                <AdminStatsCard
                    label="DISPATCHED SHIPMENTS"
                    value={replacements.filter(r => r.status === 'Shipped').length}
                    icon={Truck}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
            </div>

            {/* Matrix Logic Table */}
            <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden">
                <div className="p-3 bg-gray-50/50 border-b border-black/5 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH BY ID OR NOMENCLATURE..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-black/5 rounded-none text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-gold transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FDF5F6] border-b border-black/5 font-black uppercase text-gold text-[8px] tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-3">REFERENCE ID</th>
                                <th className="px-6 py-3">ORIGIN ORDER</th>
                                <th className="px-6 py-3">SUBJECT USER</th>
                                <th className="px-6 py-3">DISCREPANCY REASON</th>
                                <th className="px-6 py-3">CHRONOLOGY</th>
                                <th className="px-6 py-3">PROTOCOL STATUS</th>
                                <th className="px-6 py-3 text-right">PROTOCOL ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 text-[10px] font-black uppercase tracking-tight text-gray-900 font-outfit">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Synchronizing Exchange Matrix...</td>
                                </tr>
                            ) : filteredReplacements.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">No exchange protocols identified.</td>
                                </tr>
                            ) : filteredReplacements.map((item, idx) => (
                                <tr key={idx} className="hover:bg-[#FDF5F6]/20 transition-colors group">
                                    <td className="px-6 py-3">
                                        <span className="font-serif font-black tracking-tight text-sm">#{item._id.slice(-5)}</span>
                                    </td>
                                    <td className="px-6 py-3 text-gold font-black tracking-widest">#{item.orderId?.replace('ORD-', '')}</td>
                                    <td className="px-6 py-3 font-black uppercase">{item.userId?.name || 'Patron Unknown'}</td>
                                    <td className="px-6 py-3 italic font-serif text-gray-500">{item.reason}</td>
                                    <td className="px-6 py-3 text-gray-400 font-serif font-black">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                                            <span className="w-1 h-1 rounded-none bg-current"></span>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/replacements/${item._id}`)}
                                            className="bg-black text-white px-3 py-1.5 rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all flex items-center justify-center gap-2 ml-auto active:scale-95"
                                        >
                                            INSPECT <ArrowRight size={10} />
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

export default ReplacementsPage;

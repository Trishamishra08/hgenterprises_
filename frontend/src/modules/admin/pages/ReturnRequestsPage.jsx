import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    ArrowLeft,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    Eye,
    MessageSquare,
    IndianRupee,
    Truck,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import Pagination from '../components/Pagination';
import AdminStatsCard from '../components/AdminStatsCard';

const ReturnRequestsPage = () => {
    const navigate = useNavigate();
    const { returns, getPackById } = useShop();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Flatten all returns from all users
    const allReturns = useMemo(() => {
        return Object.values(returns).flat().sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
    }, [returns]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredReturns = useMemo(() => {
        return allReturns.filter(ret => {
            const matchesSearch =
                ret.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ret.userName?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'All' || ret.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [allReturns, searchTerm, statusFilter]);

    const paginatedReturns = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredReturns.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredReturns, currentPage]);

    const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Completed':
            case 'Refunded': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Approved': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-400 border-gray-100';
        }
    };

    const handleAction = (retId, action) => {
        alert(`Request ${retId} ${action}! (Mock Action)`);
    };

    return (
        <div className="space-y-3 animate-in fade-in duration-500 pb-20 font-outfit text-left">
            {/* Header Section */}
            <div className="bg-white p-3 border border-black/5 rounded-none shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-black text-footerBg uppercase tracking-tighter leading-tight font-serif italic">Logistical Inversion Desk</h1>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5 font-outfit">Real-Time RMA, Return & Refund Protocol Registry</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-[#FDF5F6] px-4 py-2 rounded-none border border-black/5 shadow-sm flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-gold rounded-none animate-pulse"></span>
                        <span className="text-[9px] font-black text-black uppercase tracking-widest">{allReturns.filter(r => r.status === 'Pending').length} PRIORITY TASKS</span>
                    </div>
                </div>
            </div>

            {/* Matrix Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <AdminStatsCard
                    label="TOTAL VOLUME"
                    value={allReturns.length.toString().padStart(2, '0')}
                    icon={RefreshCw}
                    color="text-footerBg"
                    bgColor="bg-gray-50"
                />
                <AdminStatsCard
                    label="PENDING REVIEWS"
                    value={allReturns.filter(r => r.status === 'Pending').length.toString().padStart(2, '0')}
                    icon={Clock}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <AdminStatsCard
                    label="REFUNDS PROCESSED"
                    value={allReturns.filter(r => r.status === 'Refunded').length.toString().padStart(2, '0')}
                    icon={IndianRupee}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <AdminStatsCard
                    label="LOGISTICAL EXCHANGES"
                    value={allReturns.filter(r => r.type === 'replacement' && r.status === 'Approved').length.toString().padStart(2, '0')}
                    icon={Truck}
                    color="text-gold"
                    bgColor="bg-[#FDF5F6]"
                />
            </div>

            {/* Control Console */}
            <div className="bg-white p-2 rounded-none border border-black/5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="SEARCH BY ORDER ID OR SUBJECT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border border-transparent rounded-none py-2 pl-10 pr-4 text-[9px] font-black uppercase tracking-widest text-footerBg outline-none focus:bg-white focus:border-black/10 transition-all placeholder:text-gray-300"
                    />
                </div>
                <div className="flex bg-[#FDF5F6] p-1 border border-black/5 rounded-none overflow-x-auto max-w-full">
                    {['All', 'Pending', 'Approved', 'Refunded', 'Rejected'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-none text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${statusFilter === s ? 'bg-black text-white shadow-lg shadow-black/20' : 'text-gray-400 hover:text-black hover:bg-white'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Logic Matrix Table */}
            <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden font-outfit">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FDF5F6]/40 border-b border-black/5">
                            <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest font-outfit">
                                <th className="px-6 py-3">Metric Chain</th>
                                <th className="px-6 py-3">Subject User</th>
                                <th className="px-6 py-3">Inversion Detail</th>
                                <th className="px-6 py-3 w-[25%]">Nomenclature Reason</th>
                                <th className="px-6 py-3 text-center">Protocol State</th>
                                <th className="px-6 py-3 text-right">Matrix Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 text-[10px] font-black uppercase tracking-tight text-gray-900 font-outfit">
                            {paginatedReturns.map((ret) => {
                                const prod = getPackById(ret.packId);
                                return (
                                    <tr key={ret.id} className="hover:bg-[#FDF5F6]/20 transition-colors group">
                                        <td className="px-6 py-4 align-middle">
                                            <div className="space-y-1">
                                                <p className="font-black text-black leading-none italic tabular-nums">#{ret.orderId?.slice(-8)}</p>
                                                <p className="text-[8px] text-gray-300 font-bold tracking-widest">{(new Date(ret.requestDate)).toLocaleDateString()}</p>
                                                <span className={`inline-block px-1.5 py-0.5 rounded-none text-[7px] font-black uppercase tracking-[0.2em] mt-1 border ${ret.type === 'refund' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                    }`}>
                                                    {ret.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-black text-white border border-white/10 rounded-none flex items-center justify-center font-black text-[10px] shadow-lg">
                                                    {ret.userName?.charAt(0)}
                                                </div>
                                                <p className="font-black text-black truncate max-w-[120px]">{ret.userName}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-white border border-black/5 rounded-none p-1 shrink-0 shadow-sm">
                                                    <img src={prod?.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                                </div>
                                                <div className="max-w-[120px]">
                                                    <p className="font-black text-gold truncate leading-none">{prod?.name}</p>
                                                    <p className="text-[8px] text-gray-400 font-bold tracking-widest mt-1 uppercase">WT: {ret.variant?.weight}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex flex-col text-left">
                                                <p className="text-[10px] text-gray-600 font-serif italic normal-case tracking-normal leading-tight line-clamp-2">"{ret.reason}"</p>
                                                {ret.subReason && <p className="text-[8px] text-gray-300 font-bold tracking-widest mt-1">META: {ret.subReason}</p>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center align-middle">
                                            <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest border transition-all ${getStatusStyles(ret.status)}`}>
                                                {ret.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right align-middle">
                                            <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {ret.status === 'Pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(ret.id, 'Approved')}
                                                            className="p-1 px-2 border border-black/5 bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                            title="Authorize"
                                                        >
                                                            <CheckCircle2 size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(ret.id, 'Rejected')}
                                                            className="p-1 px-2 border border-black/5 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                            title="Revoke"
                                                        >
                                                            <XCircle size={12} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className="p-1 px-2 border border-black/5 bg-white text-gray-300 hover:text-black transition-all shadow-sm active:scale-95">
                                                        <Eye size={12} />
                                                    </button>
                                                )}
                                                <button 
                                                    className="ml-2 bg-black text-white p-1 px-3 rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all flex items-center gap-2 active:scale-95"
                                                >
                                                    INSPECT <ArrowRight size={10} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="p-3 bg-gray-50 border-t border-black/5">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                        }}
                        totalItems={filteredReturns.length}
                        itemsPerPage={itemsPerPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReturnRequestsPage;

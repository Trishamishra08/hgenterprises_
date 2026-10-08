import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, ArrowUpRight, ArrowDownLeft, RefreshCcw, FileText } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import api from '../../../../utils/api';
import toast from 'react-hot-toast';

const StockHistoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All'); // All, Adjustment, Order, Return
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products/admin/inventory/logs');
            const normalized = res.data.map(log => ({
                id: log._id,
                date: new Date(log.createdAt).toLocaleString('en-GB', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }),
                product: {
                    name: log.productId?.name || 'Unknown Asset',
                    image: log.productId?.image || 'https://via.placeholder.com/100'
                },
                type: log.reason.startsWith('Order') ? 'Order Fulfilled' :
                    log.reason.startsWith('Return') ? 'Return Restock' : 'Manual Adjustment',
                change: log.change,
                effect: { from: log.oldStock, to: log.newStock },
                user: log.adminId?.name || (log.reason.startsWith('Order') ? 'System' : 'Admin'),
                reason: log.reason
            }));
            setHistory(normalized);
        } catch (error) {
            console.error("Error fetching inventory history:", error);
            toast.error("Failed to load audit registry");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const getTypeStyle = (type) => {
        switch (type) {
            case 'Manual Adjustment': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'Order Fulfilled': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'Return Restock': return 'bg-amber-50 text-amber-600 border-amber-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Manual Adjustment': return <RefreshCcw size={10} />;
            case 'Order Fulfilled': return <ArrowUpRight size={10} />;
            case 'Return Restock': return <ArrowDownLeft size={10} />;
            default: return <FileText size={10} />;
        }
    };

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.reason.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterType === 'All' ||
            (filterType === 'Adjustment' && item.type === 'Manual Adjustment') ||
            (filterType === 'Order' && item.type === 'Order Fulfilled') ||
            (filterType === 'Return' && item.type === 'Return Restock');

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-4 font-outfit pb-12 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 border border-black/5 rounded-none shadow-sm gap-4">
                <div>
                    <h1 className="text-xl font-black text-footerBg uppercase tracking-tighter leading-tight">Stock History</h1>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Audit Trail of Global Inventory Movements</p>
                </div>
                <button className="px-5 py-2.5 bg-black text-white rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-primary shadow-xl shadow-black/20 transition-all flex items-center gap-3 active:scale-95 group">
                    <Download size={12} className="group-hover:translate-y-0.5 transition-transform" />
                    <span>Export Registry CSV</span>
                </button>
            </div>

            {/* Controls Consol */}
            <div className="bg-white p-2 rounded-none border border-black/5 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type="text"
                        placeholder="SEARCH BY PRODUCT OR PROTOCOL..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-none border border-transparent text-[9px] font-black uppercase tracking-widest text-footerBg outline-none focus:bg-white focus:border-black/10 transition-all placeholder:text-gray-400"
                    />
                </div>
                <div className="flex bg-gray-50 p-0.5 rounded-none w-full md:w-auto overflow-x-auto border border-black/5">
                    {['All', 'Adjustment', 'Order', 'Return'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilterType(tab)}
                            className={`px-4 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filterType === tab
                                ? 'bg-white text-footerBg shadow-sm border border-black/5'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Movement Ledger - High Density */}
            <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-black/5">
                                <th className="px-6 py-5 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Timestamp</th>
                                <th className="px-6 py-5 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Asset Profile</th>
                                <th className="px-6 py-5 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Classification</th>
                                <th className="px-6 py-5 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] text-center">Variance</th>
                                <th className="px-6 py-5 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] text-center">Progression</th>
                                <th className="px-6 py-5 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] text-right">Executor / Context</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 font-outfit">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-20 text-center font-serif italic text-gray-300 text-lg">Acquiring audit history...</td></tr>
                            ) : filteredHistory.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-20 text-center font-serif italic text-gray-300 text-lg">No movements recorded for this query.</td></tr>
                            ) : (
                                filteredHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-black text-footerBg tracking-tighter">{item.date.split(' ')[0]}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.date.split(' ')[1]}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-50 rounded-none border border-black/5 p-1 flex-shrink-0 transition-transform group-hover:scale-105">
                                                    <img src={item.product.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-footerBg tracking-tight line-clamp-1">{item.product.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-[8px] font-black uppercase tracking-[0.1em] border ${getTypeStyle(item.type)}`}>
                                                {getIcon(item.type)} {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-lg font-serif font-black ${item.change > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {item.change > 0 ? '+' : ''}{item.change.toString().padStart(2, '0')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2 text-sm font-serif font-black text-gray-400">
                                                <span>{item.effect.from.toString().padStart(2, '0')}</span>
                                                <span className="text-[10px] text-gray-200">→</span>
                                                <span className="text-footerBg">{item.effect.to.toString().padStart(2, '0')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="text-xs font-black text-footerBg uppercase tracking-tighter mb-1">{item.user}</p>
                                            <div className="inline-block px-2 py-0.5 bg-gray-100/50 border border-black/5">
                                                <p className="text-[9px] font-bold text-gray-400 italic leading-none">{item.reason}</p>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StockHistoryPage;

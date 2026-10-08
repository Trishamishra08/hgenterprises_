import React, { useState, useEffect } from 'react';
import { AlertTriangle, Zap, Package, XCircle, ArrowRight, Clock, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminStatsCard from '../../components/AdminStatsCard';
import api from '../../../../utils/api';
import toast from 'react-hot-toast';

const LowStockAlertsPage = () => {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products?adminView=true');
            const lowStockItems = res.data
                .map(p => ({
                    id: p._id,
                    name: p.name,
                    category: p.category,
                    stock: p.variants?.[0]?.stock || 0,
                    threshold: 10,
                    image: p.image || 'https://via.placeholder.com/100',
                    unit: p.unit || 'pcs'
                }))
                .filter(item => item.stock < 10);

            setAlerts(lowStockItems);
        } catch (error) {
            console.error("Error fetching alerts:", error);
            toast.error("Failed to sync inventory alerts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const outOfStockCount = alerts.filter(a => a.stock === 0).length;
    const lowStockCount = alerts.filter(a => a.stock > 0 && a.stock <= a.threshold).length;

    return (
        <div className="space-y-4 font-outfit animate-in fade-in duration-500 pb-12">
            {/* Header Section - Geometric & Ultra-Compact */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 border border-black/5 rounded-none shadow-sm">
                <div>
                    <h1 className="text-xl font-black text-footerBg uppercase tracking-tighter leading-tight">
                        Low Stock Alerts
                    </h1>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
                        Critical Inventory Warnings & Replenishment Staging
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admin/inventory/adjust')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none text-[9px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/10 transition-all flex items-center gap-2 group"
                >
                    <Zap size={12} fill="currentColor" strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                    <span>Quick Restock Protocol</span>
                </button>
            </div>

            {/* Summary Grid - Ultra Compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminStatsCard
                    label="TOTAL ALERTS"
                    value={alerts.length.toString().padStart(2, '0')}
                    icon={AlertTriangle}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
                <AdminStatsCard
                    label="OUT OF STOCK"
                    value={outOfStockCount.toString().padStart(2, '0')}
                    icon={Ban}
                    color="text-red-600"
                    bgColor="bg-red-50"
                />
                <AdminStatsCard
                    label="LOW STOCK WARNING"
                    value={lowStockCount.toString().padStart(2, '0')}
                    icon={Clock}
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                />
            </div>

            {/* Alerts Table - High Density Typography */}
            <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto text-[11px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-black/5">
                                <th className="px-6 py-3 text-gray-400 font-black uppercase tracking-[0.2em] text-[9px]">Product Overview</th>
                                <th className="px-6 py-3 text-gray-400 font-black uppercase tracking-[0.2em] text-[9px]">Sector</th>
                                <th className="px-6 py-3 text-gray-400 font-black uppercase tracking-[0.2em] text-[9px]">Registry Status</th>
                                <th className="px-6 py-3 text-gray-400 font-black uppercase tracking-[0.2em] text-[9px] text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center font-serif italic text-gray-300 text-lg">
                                        Initializing alerts...
                                    </td>
                                </tr>
                            ) : alerts.map((item) => {
                                const isOOS = item.stock === 0;
                                const percentage = Math.min((item.stock / item.threshold) * 100, 100);

                                return (
                                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 bg-gray-50 rounded-none border border-black/5 p-1 flex-shrink-0 transition-transform group-hover:scale-105 ${isOOS ? 'grayscale' : ''}`}>
                                                    <img src={item.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-footerBg tracking-tight mb-1">{item.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border border-black/5 px-2 py-0.5 rounded-none">REF-{item.id.toString().padStart(4, '0')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest border-b border-black/10 pb-1">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-[200px]">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                                    <span className={isOOS ? 'text-red-600' : 'text-primary'}>
                                                        {item.stock} <span className="font-serif italic capitalize">Units Remaining</span>
                                                    </span>
                                                    <span className="text-gray-400 opacity-50">Threshold {item.threshold}</span>
                                                </div>
                                                <div className="h-1 w-full bg-gray-100 rounded-none overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-700 ease-out ${isOOS ? 'bg-red-500' : 'bg-primary'}`}
                                                        style={{ width: `${isOOS ? 0 : percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => navigate('/admin/inventory/adjust')}
                                                className="px-4 py-2 bg-white border border-black/5 hover:border-black hover:bg-black hover:text-white rounded-none text-[9px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center gap-2 ml-auto"
                                            >
                                                Restock <ArrowRight size={12} strokeWidth={3} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {alerts.length === 0 && !loading && (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                        <Package size={48} className="text-gray-100" />
                        <p className="font-serif italic text-gray-400 text-lg px-6">All systems nominal. No critical inventory warnings at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LowStockAlertsPage;

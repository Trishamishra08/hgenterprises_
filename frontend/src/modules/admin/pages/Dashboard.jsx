import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Ticket, Clock, RotateCcw, AlertTriangle, Image as ImageIcon,
    Users, IndianRupee, ListTree, Package, ShoppingBag,
    Truck, MapPin, XCircle, Activity, Ban, BatteryWarning,
    RefreshCw, CheckCircle2, MessageSquare, TrendingUp,
    Calendar, ArrowUpRight, Diamond, Crown, Sparkles, Settings, PenTool, Video
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { orders, products, settings, users } = useShop();
    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Dynamic Analytics Data for Chart
    const chartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const last7Months = [];
        const revenuePerMonth = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last7Months.push(months[d.getMonth()]);

            const monthOrders = (orders || []).filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getMonth() === d.getMonth() && orderDate.getFullYear() === d.getFullYear();
            });

            const monthlyRevenue = monthOrders.reduce((sum, order) => sum + (order.total || 0), 0);
            revenuePerMonth.push(monthlyRevenue);
        }

        const maxRevenue = Math.max(...revenuePerMonth, 1000); // Min max of 1k for scaling
        const normalizedValues = revenuePerMonth.map(rev => (rev / maxRevenue) * 80 + 10); // Scale to 10-90% range

        const currentMonthRevenue = revenuePerMonth[6];
        const prevMonthRevenue = revenuePerMonth[5] || 0;
        const trend = prevMonthRevenue > 0 ? (((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100).toFixed(1) : (currentMonthRevenue > 0 ? '100' : '0');

        return { labels: last7Months, values: normalizedValues, rawValues: revenuePerMonth, trend };
    }, [orders]);

    const performanceData = chartData.values;

    const quickActions = [
        { label: 'ADD PRODUCT', icon: Plus, bg: 'bg-[#FDFBF7]', text: 'text-primary', path: '/admin/products/new' },
        { label: 'NEW COUPON', icon: Ticket, bg: 'bg-[#FDFBF7]', text: 'text-primary', path: '/admin/coupons/add' },
        { label: 'PENDING ORDERS', icon: Clock, bg: 'bg-[#FDFBF7]', text: 'text-primary', path: '/admin/orders?status=pending' },
        { label: 'CHECK RETURNS', icon: RotateCcw, bg: 'bg-[#FDFBF7]', text: 'text-primary', path: '/admin/returns' },
        { label: 'STOCK ALERTS', icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-600', path: '/admin/inventory/alerts' },
        { label: 'VIDEO CALL', icon: Video, bg: 'bg-[#FDFBF7]', text: 'text-primary', path: '/admin/video-calls' },
    ];

    // Calculate Stats
    const stats = useMemo(() => {
        const allOrders = Array.isArray(orders) ? orders : Object.values(orders || {}).flat();
        const totalRevenue = allOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);
        const activeCount = allOrders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;
        const pendingCount = allOrders.filter(o => o.status === 'Pending').length;

        return [
            { label: 'TOTAL REVENUE', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, trend: '+12.5%', color: 'text-gold', bgColor: 'bg-primary' },
            { label: 'ACTIVE ORDERS', value: activeCount.toString(), icon: ShoppingBag, trend: `${pendingCount} Pending`, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
            { label: 'TOTAL CUSTOMERS', value: (users || []).length.toString(), icon: Users, trend: '+0 today', color: 'text-blue-500', bgColor: 'bg-blue-50' },
            { label: 'CATALOG DEPTH', value: products?.length || '0', icon: Diamond, trend: 'Global Reach', color: 'text-gold', bgColor: 'bg-primary' },
        ];
    }, [orders, products, users]);

    const sectors = [
        { label: 'JEWELLERY', count: products?.filter(p => (p.category || p.Category)?.name?.toLowerCase() === 'jewellery').length || 0, icon: Diamond, unit: 'SKU', slug: 'jewellery' },
        { label: 'MACHINES', count: products?.filter(p => (p.category || p.Category)?.name?.toLowerCase() === 'machine').length || 0, icon: Settings, unit: 'UNITS', slug: 'machine' },
        { label: 'TOOLS', count: products?.filter(p => (p.category || p.Category)?.name?.toLowerCase() === 'tools').length || 0, icon: PenTool, unit: 'PART', slug: 'tools' },
    ];

    const defaultLayout = [
        { id: 'header', name: 'Editorial Header', enabled: true, order: 1 },
        { id: 'sectors', name: 'Sector Specifics', enabled: true, order: 2 },
        { id: 'stats', name: 'Metrics Grid', enabled: true, order: 3 },
        { id: 'analytics', name: 'Analytics & Alerts', enabled: true, order: 4 },
        { id: 'quickActions', name: 'Global Control Grid', enabled: true, order: 5 },
        { id: 'recentOrders', name: 'Fulfillment Section', enabled: true, order: 6 }
    ];

    const layout = settings?.dashboardLayout || defaultLayout;

    const renderSection = (sectionId) => {
        switch (sectionId) {
            case 'header':
                return (
                    <div key="header" className="relative overflow-hidden bg-black border border-white/5 rounded-none p-5 text-white shadow-lg group">
                        <div className="relative z-10 flex flex-row justify-between items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5 text-gold">
                                    <Crown size={12} />
                                    <span className="text-[8px] font-black uppercase tracking-[0.5em]">Operations Master</span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-serif font-black mb-0.5 leading-none tracking-tight uppercase">
                                    Welcome back, <span className="text-gold italic">{user?.name?.split(' ')[0] || 'hg'}</span>
                                </h1>
                                <p className="text-white/40 text-[8px] font-black uppercase tracking-[0.3em] mt-1.5">
                                    Harshad Gauri Enterprises • Admin Control Panel
                                </p>
                            </div>

                            <div className="hidden md:flex bg-white/5 border border-white/10 rounded-none p-3 items-center gap-4 backdrop-blur-sm">
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-gold uppercase tracking-widest mb-0.5 font-serif italic">{currentTime.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                    <p className="text-xl font-serif font-black tabular-nums tracking-tighter text-white">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                </div>
                                <div className="w-8 h-8 bg-gold text-black rounded-none flex items-center justify-center shadow-lg shadow-gold/10">
                                    <Calendar size={16} strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'sectors':
                return (
                    <div key="sectors" className="grid grid-cols-3 gap-2">
                        {sectors.map((sector, idx) => (
                            <div
                                key={idx}
                                onClick={() => navigate(`/admin/categories?department=${sector.slug}`)}
                                className="bg-[#FDF5F6]/50 border border-black/5 p-2 rounded-none flex justify-between items-center group hover:bg-[#FDF5F6] transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="p-1 bg-black text-white group-hover:bg-gold group-hover:text-black transition-all">
                                        <sector.icon size={12} />
                                    </div>
                                    <div>
                                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">{sector.label}</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xs font-serif font-black text-black tabular-nums">{sector.count}</span>
                                            <span className="text-[5px] font-black text-gray-400 uppercase">{sector.unit}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="h-0.5 w-10 bg-black/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gold" style={{ width: `${(sector.count / (products?.length || 300)) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'stats':
                return (
                    <div key="stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="p-3 rounded-none border border-black/5 shadow-sm transition-all hover:border-gold/30 group relative bg-white overflow-hidden">
                                <div className="flex justify-between items-start mb-1.5 relative z-10">
                                    <div className="p-1.5 border border-black/5 bg-[#FDF5F6]">
                                        <stat.icon size={14} className="text-gold" strokeWidth={2.5} />
                                    </div>
                                    <div className="flex items-center gap-1 text-[7px] font-serif font-black px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        {stat.trend.includes('+') && <ArrowUpRight size={8} />}
                                        {stat.trend}
                                    </div>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-[7.5px] font-black uppercase tracking-widest mb-0.5 text-gray-400">{stat.label}</p>
                                    <h3 className="text-lg font-serif font-black tracking-tighter tabular-nums text-black">{stat.value}</h3>
                                </div>
                                <div className="absolute top-0 right-0 w-12 h-12 bg-gold/5 rotate-45 translate-x-6 -translate-y-6 group-hover:bg-gold/10 transition-colors"></div>
                            </div>
                        ))}
                    </div>
                );
            case 'analytics':
                return (
                    <div key="analytics" className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <div className="lg:col-span-2 bg-white rounded-none border border-black/5 p-4 shadow-sm relative overflow-hidden group">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-[10px] font-black text-black uppercase tracking-widest">Revenue Growth</h2>
                                    <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Momentum Forecast</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                                        <span className="text-[7px] font-black text-black uppercase tracking-widest">Active Cycle</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[8px] font-black text-emerald-600 uppercase tracking-widest">
                                        <TrendingUp size={12} strokeWidth={2.5} /> {chartData.trend}%
                                    </div>
                                </div>
                            </div>

                            <div className="h-32 relative border-b border-black/5 pb-2 font-outfit">
                                <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="w-full border-t border-black border-dashed"></div>
                                    ))}
                                </div>

                                <svg className="w-full h-full overflow-visible relative z-10" viewBox="0 0 700 100" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#AD8E4F" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#AD8E4F" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d={`M 0,${100 - (performanceData[0] || 0)} ${performanceData.slice(1).map((val, i) => `L ${(i + 1) * 100},${100 - val}`).join(' ')}`}
                                        fill="none"
                                        stroke="#AD8E4F"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d={`M 0,${100 - (performanceData[0] || 0)} ${performanceData.slice(1).map((val, i) => `L ${(i + 1) * 100},${100 - val}`).join(' ')} V 100 H 0 Z`}
                                        fill="url(#chartGradient)"
                                    />
                                </svg>

                                <div className="absolute inset-0 flex justify-between px-0 overflow-visible z-20">
                                    {performanceData.map((val, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center justify-end relative group/marker">
                                            <div className="absolute inset-y-0 w-[1px] bg-gold/10 opacity-0 group-hover/marker:opacity-100 transition-opacity"></div>
                                            <div
                                                className="w-2.5 h-2.5 bg-white border-2 border-gold rounded-full shadow-lg z-30 transition-all group-hover/marker:scale-150 relative"
                                                style={{ bottom: `${val}%`, marginBottom: '-5px' }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black px-2 py-1 opacity-0 group-hover/marker:opacity-100 pointer-events-none transition-all whitespace-nowrap shadow-xl">
                                                    ₹ {(chartData.rawValues[i] / 1000).toFixed(1)}k <span className="text-gold selection:bg-gold/20">•</span> {chartData.labels[i]}
                                                </div>
                                            </div>
                                            <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest mt-2">{chartData.labels[i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-black/5 rounded-none p-4 flex flex-col justify-between relative overflow-hidden shadow-sm font-outfit">
                            <div>
                                <div className="flex items-center gap-3 mb-4 border-l-3 border-gold pl-3">
                                    <h2 className="text-[10px] font-black text-black uppercase tracking-widest">Immediate Alerts</h2>
                                </div>

                                <div className="space-y-2">
                                    {products?.filter(p => !p.variants || p.variants.some(v => v.stock < 10)).slice(0, 3).length > 0 ? (
                                        products?.filter(p => !p.variants || p.variants.some(v => v.stock < 10)).slice(0, 3).map((item, i) => (
                                            <div key={i} className="bg-[#FDF5F6] p-2.5 border border-black/5 flex justify-between items-center group hover:border-gold/50 transition-all cursor-pointer">
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <p className="text-[9px] font-black text-black uppercase tracking-tight truncate">{item.name}</p>
                                                    <p className="text-[7px] text-gray-400 font-bold mt-0.5 uppercase tracking-widest">id: {item.id?.slice(-8) || 'N/A'}</p>
                                                </div>
                                                <span className="text-[6px] font-black text-red-500 bg-white border border-red-100 px-1.5 py-0.5 shrink-0">LOW</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-[#FDF5F6] p-4 border border-dashed border-gold/20 flex flex-col items-center justify-center text-center">
                                            <Sparkles size={18} className="text-gold mb-1.5 opacity-50" />
                                            <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Inventory Stable</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className="mt-4 w-full bg-black text-white py-2.5 font-black text-[8px] uppercase tracking-widest hover:bg-gold hover:text-black transition-all">
                                Inventory Audit
                            </button>
                        </div>
                    </div>
                );
            case 'quickActions':
                return (
                    <div key="quickActions" className="mt-3 font-outfit">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 px-1">Global Control Grid</p>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => navigate(action.path)}
                                    className="bg-white p-3.5 flex flex-col items-center justify-center gap-2 hover:border-gold/50 transition-all active:scale-95 border border-black/5 group h-full shadow-sm"
                                >
                                    <div className="p-1.5 border border-black/5 group-hover:bg-gold/10 group-hover:border-gold/20 transition-all">
                                        <action.icon className="w-3.5 h-3.5 text-gold" />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-[0.1em] text-black text-center leading-tight">
                                        {action.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'recentOrders':
                return (
                    <div key="recentOrders" className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden font-outfit">
                        <div className="p-4 border-b border-black/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-[#FDF5F6]/30">
                            <div>
                                <h2 className="text-[10px] font-black text-black uppercase tracking-widest">Recent Orders</h2>
                                <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Live Processing Flow</p>
                            </div>
                            <button onClick={() => navigate('/admin/orders')} className="bg-black text-white px-5 py-2 text-[8px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all border border-black">
                                Master Log
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#FDF5F6]/80 text-gold">
                                        <th className="px-4 py-2 text-[7px] font-black uppercase tracking-[0.3em] border-b border-black/5">Ref ID</th>
                                        <th className="px-4 py-2 text-[7px] font-black uppercase tracking-[0.3em] border-b border-black/5">Customer</th>
                                        <th className="px-4 py-2 text-[7px] font-black uppercase tracking-[0.3em] border-b border-black/5 text-center">Revenue</th>
                                        <th className="px-4 py-2 text-[7px] font-black uppercase tracking-[0.3em] border-b border-black/5 text-center">Status</th>
                                        <th className="px-4 py-2 text-[7px] font-black uppercase tracking-[0.3em] border-b border-black/5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {(Array.isArray(orders) ? orders : Object.values(orders || {}).flat()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map((order) => {
                                        const refId = order.orderId || order._id || '';
                                        const displayId = refId.length > 6 ? refId.slice(-6).toUpperCase() : refId;
                                        const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
                                        const customerName = order.userId?.name || order.address?.name || 'Guest';

                                        return (
                                            <tr key={order._id} className="hover:bg-[#FDF5F6]/40 transition-colors group">
                                                <td className="px-4 py-2">
                                                    <p className="font-serif font-black text-black text-[9px] tracking-widest uppercase">#{displayId}</p>
                                                    <p className="text-[6px] text-gray-400 font-bold uppercase mt-0.5 tracking-widest">{orderDate}</p>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <p className="font-black text-black text-[8px] tracking-widest uppercase">{customerName}</p>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <p className="font-serif font-black text-gold text-[9px] tabular-nums tracking-tighter">₹ {(order.total || 0).toLocaleString()}</p>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <span className={`px-1.5 py-0.5 text-[6px] font-black uppercase tracking-widest border ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                        order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gold/10 text-gold border-gold/30'
                                                        }`}>
                                                        {order.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <button onClick={() => navigate(`/admin/orders/${order.orderId || order._id}`)} className="p-1 border border-black/5 hover:border-gold/50 transition-all text-black hover:text-gold bg-white">
                                                        <ImageIcon size={11} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-700 pb-8 text-left font-outfit">
            {layout
                .filter(s => s.enabled)
                .sort((a, b) => a.order - b.order)
                .map(section => renderSection(section.id))
            }
        </div>
    );
};

export default AdminDashboard;

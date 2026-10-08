import React, { useState, useMemo } from 'react';
import {
    Search,
    Download,
    Eye,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    CheckCircle2,
    Clock,
    Package,
    XCircle,
    Truck,
    Filter
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import Pagination from '../components/Pagination';
import AdminStatsCard from '../components/AdminStatsCard';

const OrderListPage = () => {
    const navigate = useNavigate();
    const { orders } = useShop();
    const [searchParams, useSearchParamsHook] = useSearchParams();
    const statusParam = searchParams.get('status') || 'all';
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter Logic
    const filteredOrders = useMemo(() => {
        const list = orders || [];
        return list.filter(order => {
            // Text Search (Safely handle potentially missing fields)
            const customerName = order.address?.name || 'Guest';
            const oid = order.orderId || order._id || '';

            const matchesSearch =
                oid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customerName.toLowerCase().includes(searchTerm.toLowerCase());

            // Status Filter matches (Tabs)
            let matchesStatus = true;
            if (statusParam !== 'all') {
                const currentStatus = (order.status || 'Pending').toLowerCase();
                if (statusParam === 'pending') matchesStatus = currentStatus === 'pending' || currentStatus === 'processing';
                else if (statusParam === 'shipped') matchesStatus = currentStatus === 'shipped';
                else if (statusParam === 'delivered') matchesStatus = currentStatus === 'delivered';
                else if (statusParam === 'cancelled') matchesStatus = currentStatus === 'cancelled' || currentStatus === 'rejected';
                else matchesStatus = currentStatus === statusParam;
            }

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusParam]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Stats Logic
    const stats = {
        total: (orders || []).length,
        pending: (orders || []).filter(o => (o.status || 'Pending').toLowerCase() === 'pending' || (o.status || 'Pending').toLowerCase() === 'processing').length,
        completed: (orders || []).filter(o => (o.status || 'Pending').toLowerCase() === 'delivered').length
    };

    const handleFilterChange = (status) => {
        useSearchParamsHook({ status });
        setCurrentPage(1);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-gray-100 text-gray-600';
            case 'processing': return 'bg-amber-100 text-amber-600';
            case 'shipped': return 'bg-blue-100 text-blue-600';
            case 'delivered': return 'bg-emerald-100 text-emerald-600';
            case 'cancelled': return 'bg-red-100 text-red-600';
            case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-3 animate-in fade-in duration-500 pb-10 font-outfit text-left">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-3 border border-black/5 rounded-none shadow-sm gap-3">
                <div>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight leading-none uppercase">Order Registry</h1>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Control Panel for Global Order Fulfillment</p>
                </div>
                <button className="px-4 py-2 bg-black text-white rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-primary shadow-xl shadow-black/20 transition-all flex items-center gap-2 active:scale-95 group">
                    <Download size={12} className="group-hover:translate-y-0.5 transition-transform" />
                    <span>Export Registry Reports</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <AdminStatsCard
                    label="TOTAL ORDER VOLUME"
                    value={stats.total.toString().padStart(2, '0')}
                    icon={Package}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <AdminStatsCard
                    label="STAGED FOR APPROVAL"
                    value={stats.pending.toString().padStart(2, '0')}
                    icon={Clock}
                    color="text-amber-500"
                    bgColor="bg-amber-50"
                />
                <AdminStatsCard
                    label="FULFILLMENT COMPLETED"
                    value={stats.completed.toString().padStart(2, '0')}
                    icon={CheckCircle2}
                    color="text-emerald-500"
                    bgColor="bg-emerald-50"
                />
            </div>

            {/* Controls Consol */}
            <div className="bg-white p-2 rounded-none border border-black/5 shadow-sm mb-2 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                    <input
                        type="text"
                        placeholder="SEARCH BY ORDER ID OR REGISTRY NAME..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-4 py-1.5 bg-gray-50 rounded-none border border-transparent text-[8px] font-black uppercase tracking-widest text-footerBg outline-none focus:bg-white focus:border-black/10 transition-all placeholder:text-gray-400"
                    />
                </div>
                <div className="flex bg-gray-50 p-0.5 rounded-none w-full md:w-auto overflow-x-auto border border-black/5">
                    {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => {
                        const active = statusParam === tab.toLowerCase();
                        return (
                            <button
                                key={tab}
                                onClick={() => handleFilterChange(tab.toLowerCase())}
                                className={`px-4 py-1.5 rounded-none text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${active
                                    ? 'bg-white text-footerBg shadow-sm border border-black/5'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-none border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest w-10 text-center">#</th>
                                <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Payment</th>
                                <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">Items</th>
                                <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Value</th>
                                <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 uppercase tracking-tighter text-[9px] text-footerBg font-outfit">
                            {paginatedOrders.map((order, idx) => {
                                const customerName = order.address?.name || 'Guest';
                                const oid = order.orderId || order._id || '';
                                const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
                                const payment = order.paymentMethod?.toUpperCase() || 'N/A';
                                const itemsCount = order.items?.length || 0;
                                const value = order.total || 0;
                                const status = order.status || 'Pending';

                                return (
                                    <tr key={oid} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-4 py-1.5 text-center text-[9px] font-black text-gray-300">
                                            {(currentPage - 1) * itemsPerPage + idx + 1}
                                        </td>
                                        <td className="px-4 py-1.5">
                                            <span className="font-black text-[9px] text-footerBg tracking-tight">#{oid.replace('ORD-', '')}</span>
                                        </td>
                                        <td className="px-4 py-1.5 text-[9px] font-bold text-gray-400">
                                            {date} <span className="text-[8px] font-black opacity-50 ml-1">{order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                        </td>
                                        <td className="px-4 py-1.5">
                                            <div className="font-black text-[9px] text-footerBg tracking-tight">{customerName}</div>
                                        </td>
                                        <td className="px-4 py-1.5">
                                            <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest ${order.type === 'Returning' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                                }`}>
                                                {order.type || 'New'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-1.5">
                                            <span className={`font-black text-[9px] ${payment === 'COD' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                {payment}
                                            </span>
                                        </td>
                                        <td className="px-4 py-1.5 text-center font-black text-[9px] text-gray-500">
                                            {itemsCount}
                                        </td>
                                        <td className="px-4 py-1.5 font-bold text-[10px] text-footerBg font-serif tabular-nums tracking-tighter">
                                            ₹{value.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-1.5">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest ${getStatusColor(status)}`}>
                                                <span className="w-1 h-1 rounded-full bg-current"></span>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-1.5 text-right">
                                            <button
                                                onClick={() => navigate(`/admin/orders/${oid}`)}
                                                className="px-3 py-1 bg-black text-white rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95"
                                            >
                                                Inspect
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan="11" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-50">
                                            <Package size={48} className="text-gray-300 mb-4" />
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No orders found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                totalItems={filteredOrders.length}
                itemsPerPage={itemsPerPage}
            />
        </div>
    );
};

export default OrderListPage;

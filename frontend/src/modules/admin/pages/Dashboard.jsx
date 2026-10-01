import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Ticket, Clock, RotateCcw, AlertTriangle, Users, IndianRupee, Package,
    ShoppingBag, Video, Diamond, Settings, PenTool, TrendingUp, TrendingDown, ChevronRight
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const inr = (n) => `₹${Math.round(n || 0).toLocaleString('en-IN')}`;
const compactInr = (n) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
    return `₹${Math.round(n || 0)}`;
};

const STATUS_STYLE = {
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
    Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
    'Out For Delivery': 'bg-blue-50 text-blue-700 border-blue-200',
};

const Card = ({ className = '', children }) => (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>{children}</div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { orders, products, settings, users } = useShop();
    const { user } = useAuth();

    const allOrders = useMemo(
        () => (Array.isArray(orders) ? orders : Object.values(orders || {}).flat()),
        [orders]
    );
    // Revenue only counts orders that are neither cancelled nor failed payments
    const countedOrders = useMemo(
        () => allOrders.filter((o) => o.status !== 'Cancelled' && o.paymentStatus !== 'Failed'),
        [allOrders]
    );

    const monthly = useMemo(() => {
        const now = new Date();
        const rows = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const revenue = countedOrders
                .filter((o) => {
                    const od = new Date(o.createdAt);
                    return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
                })
                .reduce((sum, o) => sum + (o.total || 0), 0);
            rows.push({ label: MONTHS[d.getMonth()], revenue });
        }
        const current = rows[5].revenue;
        const previous = rows[4].revenue;
        const change = previous > 0 ? ((current - previous) / previous) * 100 : null;
        return { rows, max: Math.max(...rows.map((r) => r.revenue), 1), change };
    }, [countedOrders]);

    const stats = useMemo(() => {
        const totalRevenue = countedOrders.reduce((a, o) => a + (o.total || 0), 0);
        const inProgress = allOrders.filter((o) => !['Delivered', 'Cancelled'].includes(o.status));
        const pending = allOrders.filter((o) => o.status === 'Pending').length;
        return [
            { label: 'Total revenue', value: compactInr(totalRevenue), hint: `${countedOrders.length} orders`, icon: IndianRupee },
            { label: 'Orders in progress', value: String(inProgress.length), hint: `${pending} pending`, icon: ShoppingBag },
            { label: 'Customers', value: String((users || []).length), hint: 'Registered accounts', icon: Users },
            { label: 'Products', value: String(products?.length || 0), hint: 'In catalogue', icon: Package },
        ];
    }, [countedOrders, allOrders, users, products]);

    const departments = useMemo(() => {
        const count = (dept) => (products || []).filter((p) => String(p.department || '').toLowerCase() === dept).length;
        return [
            { label: 'Jewellery', count: count('jewellery'), icon: Diamond, slug: 'jewellery' },
            { label: 'Machines', count: count('machines'), icon: Settings, slug: 'machine' },
            { label: 'Tools', count: count('tools'), icon: PenTool, slug: 'tools' },
        ];
    }, [products]);

    const lowStock = useMemo(
        () => (products || [])
            .filter((p) => (p.variants?.[0]?.stock ?? p.stock ?? 0) < 10)
            .slice(0, 5),
        [products]
    );

    const quickActions = [
        { label: 'Add product', icon: Plus, path: '/admin/products/new' },
        { label: 'New coupon', icon: Ticket, path: '/admin/coupons/add' },
        { label: 'Pending orders', icon: Clock, path: '/admin/orders?status=pending' },
        { label: 'Returns', icon: RotateCcw, path: '/admin/returns' },
        { label: 'Stock alerts', icon: AlertTriangle, path: '/admin/inventory/alerts' },
        { label: 'Video calls', icon: Video, path: '/admin/video-calls' },
    ];

    const recent = useMemo(
        () => [...allOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6),
        [allOrders]
    );

    const defaultLayout = [
        { id: 'header', enabled: true, order: 1 },
        { id: 'stats', enabled: true, order: 2 },
        { id: 'analytics', enabled: true, order: 3 },
        { id: 'sectors', enabled: true, order: 4 },
        { id: 'quickActions', enabled: true, order: 5 },
        { id: 'recentOrders', enabled: true, order: 6 },
    ];
    const layout = settings?.dashboardLayout || defaultLayout;

    const renderSection = (id) => {
        switch (id) {
            case 'header':
                return (
                    <div key={id} className="flex flex-wrap items-end justify-between gap-2">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}</h1>
                            <p className="text-sm text-gray-500 mt-1">Here is what is happening at Harshad Gauri Enterprises today.</p>
                        </div>
                        <p className="text-sm text-gray-500">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                );

            case 'stats':
                return (
                    <div key={id} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {stats.map((s) => (
                            <Card key={s.label} className="p-5 flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{s.label}</p>
                                    <p className="text-2xl font-semibold text-gray-900 mt-1 tabular-nums">{s.value}</p>
                                    <p className="text-xs text-gray-400 mt-1">{s.hint}</p>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <s.icon size={18} className="text-gray-700" />
                                </div>
                            </Card>
                        ))}
                    </div>
                );

            case 'analytics':
                return (
                    <div key={id} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <Card className="lg:col-span-2 p-5">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">Revenue</h2>
                                    <p className="text-xs text-gray-500">Last 6 months</p>
                                </div>
                                {monthly.change !== null && (
                                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${monthly.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {monthly.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        {Math.abs(monthly.change).toFixed(1)}% vs last month
                                    </span>
                                )}
                            </div>
                            <div className="flex items-end gap-3 h-44">
                                {monthly.rows.map((r) => (
                                    <div key={r.label} className="flex-1 h-full flex flex-col justify-end items-center gap-2 group">
                                        <span className="text-[11px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{compactInr(r.revenue)}</span>
                                        <div
                                            className="w-full max-w-[44px] rounded-t-md bg-gray-900/80 group-hover:bg-gray-900 transition-colors"
                                            style={{ height: `${Math.max((r.revenue / monthly.max) * 100, r.revenue > 0 ? 4 : 1)}%` }}
                                        />
                                        <span className="text-xs text-gray-500">{r.label}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-5 flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-semibold text-gray-900">Low stock</h2>
                                <button onClick={() => navigate('/admin/inventory/alerts')} className="text-xs text-gray-500 hover:text-gray-900 inline-flex items-center">
                                    View all <ChevronRight size={14} />
                                </button>
                            </div>
                            {lowStock.length === 0 ? (
                                <p className="text-sm text-gray-500 py-6 text-center">All products are well stocked.</p>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {lowStock.map((p) => (
                                        <li key={p._id || p.id} className="flex items-center justify-between gap-3 py-2.5">
                                            <p className="text-sm text-gray-800 truncate">{p.name}</p>
                                            <span className="shrink-0 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                                                {p.variants?.[0]?.stock ?? p.stock ?? 0} left
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    </div>
                );

            case 'sectors':
                return (
                    <div key={id} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {departments.map((d) => (
                            <button
                                key={d.label}
                                onClick={() => navigate(`/admin/categories?department=${d.slug}`)}
                                className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center gap-4 text-left hover:border-gray-400 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                    <d.icon size={18} className="text-gray-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{d.label}</p>
                                    <p className="text-xl font-semibold text-gray-900 tabular-nums">{d.count} <span className="text-sm font-normal text-gray-400">products</span></p>
                                </div>
                            </button>
                        ))}
                    </div>
                );

            case 'quickActions':
                return (
                    <div key={id}>
                        <h2 className="text-base font-semibold text-gray-900 mb-3">Quick actions</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                            {quickActions.map((a) => (
                                <button
                                    key={a.label}
                                    onClick={() => navigate(a.path)}
                                    className="bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-4 flex flex-col items-center gap-2 hover:border-gray-400 transition-colors"
                                >
                                    <a.icon size={18} className="text-gray-700" />
                                    <span className="text-sm text-gray-800 text-center">{a.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'recentOrders':
                return (
                    <Card key={id} className="overflow-hidden">
                        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">Recent orders</h2>
                                <p className="text-xs text-gray-500">Latest {recent.length} orders</p>
                            </div>
                            <button onClick={() => navigate('/admin/orders')} className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-black">
                                View all orders
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="text-gray-500 bg-gray-50">
                                        <th className="px-5 py-3 font-medium">Order</th>
                                        <th className="px-5 py-3 font-medium">Customer</th>
                                        <th className="px-5 py-3 font-medium text-right">Amount</th>
                                        <th className="px-5 py-3 font-medium">Payment</th>
                                        <th className="px-5 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recent.length === 0 && (
                                        <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-500">No orders yet.</td></tr>
                                    )}
                                    {recent.map((o) => {
                                        const ref = o.orderId || o._id || '';
                                        return (
                                            <tr
                                                key={o._id}
                                                onClick={() => navigate(`/admin/orders/${o.orderId || o._id}`)}
                                                className="hover:bg-gray-50 cursor-pointer"
                                            >
                                                <td className="px-5 py-3">
                                                    <p className="font-medium text-gray-900">#{ref.length > 8 ? ref.slice(-8) : ref}</p>
                                                    <p className="text-xs text-gray-400">{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : ''}</p>
                                                </td>
                                                <td className="px-5 py-3 text-gray-800">{o.userId?.name || o.address?.name || 'Guest'}</td>
                                                <td className="px-5 py-3 text-right font-medium text-gray-900 tabular-nums">{inr(o.total)}</td>
                                                <td className="px-5 py-3 text-gray-600">{o.paymentMethod === 'cod' ? 'COD' : 'Online'} · {o.paymentStatus || 'Pending'}</td>
                                                <td className="px-5 py-3">
                                                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${STATUS_STYLE[o.status] || 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                        {o.status || 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 pb-8 text-left">
            {layout
                .filter((s) => s.enabled)
                .sort((a, b) => a.order - b.order)
                .map((s) => renderSection(s.id))}
        </div>
    );
};

export default AdminDashboard;

import React, { useState, useMemo } from 'react';
import {
    Plus,
    Ticket,
    Activity,
    Clock,
    Edit2,
    Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import DataTable from '../components/common/DataTable';
import AdminStatsCard from '../components/AdminStatsCard';

const CouponListPage = () => {
    const navigate = useNavigate();
    const { coupons, deleteCoupon, loading } = useShop();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCoupons = useMemo(() => {
        return (coupons || [])
            .filter(c => {
                const search = searchTerm.toLowerCase();
                return (
                    c.code?.toLowerCase().includes(search) ||
                    c.description?.toLowerCase().includes(search)
                );
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [coupons, searchTerm]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            deleteCoupon(id);
        }
    };

    const getCouponStatus = (coupon) => {
        const now = new Date();
        if (!coupon.active) return { label: 'Inactive', color: 'bg-gray-100 text-gray-400 border-gray-200' };
        if (coupon.validUntil && new Date(coupon.validUntil) < now) return { label: 'Expired', color: 'bg-red-50 text-red-600 border-red-100' };
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return { label: 'Limit Reached', color: 'bg-amber-50 text-amber-600 border-amber-100' };
        return { label: 'Active', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    };

    const columns = [
        {
            header: 'Coupon Metadata',
            render: (coupon) => (
                <div className="flex items-center gap-4 text-left">
                    <div className="w-10 h-10 bg-black/5 text-black rounded-none flex items-center justify-center border border-black/5 shrink-0">
                        <Ticket size={18} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="font-black text-black text-xs uppercase tracking-widest">{coupon.code}</p>
                        <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] truncate font-bold uppercase">{coupon.description || 'No description provided'}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Configuration',
            render: (coupon) => (
                <div className="text-left py-1">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900 text-xs">
                        {coupon.type === 'percent' ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-none text-[9px] border border-emerald-100 font-black uppercase tracking-wider">
                                {coupon.value}% OFF
                            </span>
                        ) : (
                            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-none text-[9px] border border-blue-100 font-black uppercase tracking-wider">
                                ₹{coupon.value} FLAT
                            </span>
                        )}
                    </div>
                    <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-widest">MIN SPEND: <span className="text-black">₹{coupon.minOrderValue}</span></p>
                </div>
            )
        },
        {
            header: 'Validity Registry',
            render: (coupon) => (
                <div className="space-y-1 text-left">
                    <p className="text-[9px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1 h-1 rounded-none bg-red-500"></span>
                        Term: {new Date(coupon.validUntil).toLocaleDateString()}
                    </p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest flex items-center gap-2 font-bold">
                        <span className="w-1 h-1 rounded-none bg-emerald-500"></span>
                        Init: {new Date(coupon.validFrom).toLocaleDateString()}
                    </p>
                </div>
            )
        },
        {
            header: 'Efficiency',
            render: (coupon) => (
                <div className="text-left font-bold uppercase text-[9px] tracking-widest">
                    <p className="text-black">{coupon.usageCount} <span className="text-gray-400">/ {coupon.usageLimit}</span></p>
                    <div className="w-20 h-1 bg-gray-100 mt-1 overflow-hidden">
                        <div
                            className="h-full bg-primary"
                            style={{ width: `${Math.min((coupon.usageCount / coupon.usageLimit) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
            )
        },
        {
            header: 'System Status',
            render: (coupon) => {
                const status = getCouponStatus(coupon);
                return (
                    <span className={`px-3 py-1 rounded-none text-[8px] font-black uppercase tracking-[0.2em] border shadow-sm ${status.color}`}>
                        {status.label}
                    </span>
                );
            }
        },
        {
            header: 'Actions',
            render: (coupon) => (
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={() => navigate(`/admin/coupons/edit/${coupon._id || coupon.id}`)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-none transition-all"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => handleDelete(coupon._id || coupon.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-none transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )
        }
    ];

    if (loading) {
        return <div className="p-12 text-center font-serif text-[10px] uppercase tracking-[0.3em] animate-pulse text-gray-300">Synchronizing Marketing Data...</div>;
    }

    return (
        <div className="space-y-6 font-outfit animate-in fade-in duration-500 text-left pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 border border-black/5 shadow-sm">
                <div>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight leading-none uppercase">Marketing & Promos</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Conversion Protocol Optimization</p>
                </div>
                <button
                    onClick={() => navigate('/admin/coupons/add')}
                    className="bg-black text-white px-6 py-3 rounded-none font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-primary transition-all shadow-xl shadow-black/20 active:scale-95 group"
                >
                    <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                    <span>Initialize New Coupon</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <AdminStatsCard
                    label="Active Campaigns"
                    value={coupons.filter(c => c.active).length.toString().padStart(2, '0')}
                    icon={Activity}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <AdminStatsCard
                    label="Total Issuance"
                    value={coupons.length.toString().padStart(2, '0')}
                    icon={Ticket}
                    color="text-black"
                    bgColor="bg-gray-50"
                />
                <AdminStatsCard
                    label="Critical Expiry"
                    value={coupons.filter(c => {
                        if (!c.validUntil) return false;
                        const daysLeft = (new Date(c.validUntil) - new Date()) / (1000 * 60 * 60 * 24);
                        return daysLeft > 0 && daysLeft < 7;
                    }).length.toString().padStart(2, '0')}
                    icon={Clock}
                    color="text-red-600"
                    bgColor="bg-red-50"
                />
            </div>

            <DataTable
                columns={columns}
                data={filteredCoupons}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder="Search protocol codes..."
            />
        </div>
    );
};

export default CouponListPage;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin,
    ShoppingBag, Heart, ArrowLeft,
    Shield, CheckCircle2, XCircle,
    Calendar, Clock, ChevronRight,
    ArrowRight, Star, Wallet, Package, ExternalLink
} from 'lucide-react';

const UserView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock User Data
    const [user, setUser] = useState({
        id: id || 'USR-1001',
        name: 'Aditi Singh',
        email: 'aditi.s@gmail.com',
        phone: '+91 98123 45678',
        joinedDate: 'December 12, 2024',
        status: 'Active',
        totalOrders: 12,
        totalSpent: '45,690',
        addresses: [
            { type: 'Home', address: 'B-402, Sunshine Heights, Andheri West, Mumbai - 400053', isDefault: true },
            { type: 'Office', address: 'Times Square Tower, 8th Floor, BKC, Mumbai - 400051', isDefault: false }
        ],
        wishlist: [
            { id: 201, name: '925 Silver Chain', price: 1545, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200' },
            { id: 202, name: 'Minimalist Bangle', price: 2800, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200' }
        ],
        orderHistory: [
            { id: 'ORD-82741', date: 'Dec 26, 2024', total: 5544, status: 'Ordered' },
            { id: 'ORD-81120', date: 'Dec 10, 2024', total: 12000, status: 'Delivered' },
            { id: 'ORD-79943', date: 'Nov 28, 2024', total: 3500, status: 'Delivered' }
        ],
        cart: [
            { id: 301, name: 'Royal Solitaire Ring', price: 5999, quantity: 1, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200' },
            { id: 302, name: 'Classic Silver Earrings', price: 1200, quantity: 2, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200' }
        ]
    });

    const statusColors = {
        'Ordered': 'text-blue-500 bg-blue-50 border-blue-100',
        'Delivered': 'text-emerald-500 bg-emerald-50 border-emerald-100',
    };

    return (
        <div className="animate-in fade-in duration-500 pb-20 font-outfit text-left">
            {/* Minimalist Navigation Protocol */}
            <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center gap-1.5 text-gray-400 hover:text-black transition-all text-[7.5px] font-black uppercase tracking-[0.3em] mb-3 group"
            >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
                Global Registry Access
            </button>

            {/* Profile Strategic Core - Dashboard "Add Product" Style Headings */}
            <div className="bg-white p-3 border border-black/5 rounded-none shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-black text-white flex items-center justify-center font-black text-lg shadow-xl shadow-black/20">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl font-serif font-black text-black uppercase tracking-widest leading-none">{user.name}</h1>
                            <span className={`px-1.5 py-0.5 rounded-none text-[6.5px] font-black uppercase tracking-widest border ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                {user.status}
                            </span>
                        </div>
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] leading-none mt-1.5 flex items-center gap-2">
                            <Mail size={10} className="text-gold" />
                            {user.email} • <span className="text-black tabular-nums">{user.id}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-1.5">
                    <div className="bg-[#FDF5F6] px-3 py-1.5 border border-black/5 rounded-none shadow-sm flex flex-col justify-center">
                        <span className="text-[6.5px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1 text-center">TOTAL VOLUME</span>
                        <span className="text-xs font-black text-black tabular-nums leading-none text-center">₹{user.totalSpent}</span>
                    </div>
                    <div className="bg-black text-white px-3 py-1.5 border border-white/5 rounded-none shadow-xl flex flex-col justify-center">
                        <span className="text-[6.5px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-1 text-center">CREDENTIALING</span>
                        <span className="text-xs font-black text-gold uppercase tracking-widest leading-none text-center">VERIFIED USR</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
                {/* Protocol Info Sector */}
                <div className="lg:col-span-4 space-y-3">
                    <div className="bg-white border border-black/5 p-3 space-y-4 shadow-sm">
                        <h3 className="text-[10px] font-serif font-black text-black uppercase tracking-[0.2em] flex items-center gap-2 border-b border-black/5 pb-2">
                            <Shield size={12} className="text-gold" /> Identity Protocol
                        </h3>
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                    <Phone size={10} strokeWidth={3} /> Contact Port
                                </div>
                                <span className="text-[9px] font-black text-black tabular-nums tracking-tighter">{user.phone}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                    <Calendar size={10} strokeWidth={3} /> Creation Date
                                </div>
                                <span className="text-[9px] font-black text-black uppercase tracking-tight">{user.joinedDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-black/5 p-3 space-y-3 shadow-sm">
                        <h3 className="text-[10px] font-serif font-black text-black uppercase tracking-[0.2em] flex items-center gap-2 border-b border-black/5 pb-2">
                            <MapPin size={12} className="text-gold" strokeWidth={3} /> Geostatial Registry
                        </h3>
                        <div className="space-y-2">
                            {user.addresses.map((addr, idx) => (
                                <div key={idx} className="p-2.5 bg-gray-50 border border-black/5 rounded-none relative group hover:border-gold/30 transition-all">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[7px] font-black text-gray-300 uppercase tracking-[0.2em]">{addr.type}</span>
                                        {addr.isDefault && <span className="text-[6px] font-black text-emerald-500 bg-white px-1.5 py-0.5 border border-emerald-100 uppercase tracking-widest">Default</span>}
                                    </div>
                                    <p className="text-[8.5px] text-gray-500 leading-tight font-black uppercase tracking-tight">
                                        {addr.address}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Operations Sector */}
                <div className="lg:col-span-8 space-y-3">
                    <div className="bg-white border border-black/5 shadow-sm overflow-hidden">
                        <div className="px-3 py-2.5 border-b border-black/5 bg-[#FDF5F6]/40 flex items-center justify-between">
                            <h3 className="text-[10px] font-serif font-black text-black uppercase tracking-[0.2em] flex items-center gap-2">
                                <Package size={12} className="text-gold" /> Logistical Chain
                            </h3>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest tabular-nums">{user.orderHistory.length} ENTRIES REGISTERED</span>
                        </div>
                        <div className="divide-y divide-black/5">
                            {user.orderHistory.map((order) => (
                                <div key={order.id} className="py-2.5 px-4 flex items-center justify-between hover:bg-[#FDF5F6]/10 transition-colors group">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-8 h-8 bg-gray-50 border border-black/5 flex items-center justify-center">
                                            <ExternalLink size={14} className="text-gray-200 group-hover:text-gold transition-colors" strokeWidth={3} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-black tracking-tight leading-none mb-1 tabular-nums">#{order.id.split('-')[1]}</p>
                                            <p className="text-[7.5px] text-gray-300 font-black tracking-widest uppercase">{order.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-black tabular-nums tracking-widest">₹{order.total.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-1.5 py-0.5 rounded-none text-[6.5px] font-black uppercase tracking-widest border transition-all ${statusColors[order.status] || 'bg-gray-100 text-gray-300 border-gray-200'}`}>
                                            {order.status}
                                        </span>
                                        <button
                                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                                            className="p-1 px-2 border border-black/5 bg-white text-gray-300 hover:text-black transition-all shadow-sm group-hover:scale-105"
                                        >
                                            <ArrowRight size={12} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Pending Intent: Cart */}
                        <div className="bg-white border border-black/5 shadow-sm overflow-hidden flex flex-col">
                            <div className="px-3 py-2 border-b border-black/5 bg-blue-50/20 flex items-center justify-between">
                                <h3 className="text-[10px] font-serif font-black text-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Wallet size={12} className="text-blue-500" /> Pending Intent
                                </h3>
                                <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest tabular-nums">{user.cart.length} IN BAG</span>
                            </div>
                            <div className="divide-y divide-black/5">
                                {user.cart.map((item) => (
                                    <div key={item.id} className="p-2.5 flex items-center gap-3 group">
                                        <div className="w-10 h-10 bg-white border border-black/5 p-1 shrink-0">
                                            <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[8.5px] font-black text-black uppercase tracking-tighter truncate leading-none mb-1">{item.name}</h4>
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black text-gold tabular-nums tracking-widest">₹{item.price.toLocaleString()}</p>
                                                <p className="text-[7.5px] font-black text-gray-300 uppercase tracking-widest tabular-nums">Q: {item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual Interest: Wishlist */}
                        <div className="bg-white border border-black/5 shadow-sm overflow-hidden flex flex-col">
                            <div className="px-3 py-2 border-b border-black/5 bg-red-50/20 flex items-center justify-between">
                                <h3 className="text-[10px] font-serif font-black text-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Heart size={12} className="text-red-500" /> Interest Registry
                                </h3>
                                <span className="text-[8px] font-black text-red-600 uppercase tracking-widest tabular-nums">{user.wishlist.length} SAVED</span>
                            </div>
                            <div className="divide-y divide-black/5">
                                {user.wishlist.map((item) => (
                                    <div key={item.id} className="p-2.5 flex items-center gap-3 group">
                                        <div className="w-10 h-10 bg-white border border-black/5 p-1 shrink-0">
                                            <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[8.5px] font-black text-black uppercase tracking-tighter truncate leading-none mb-1">{item.name}</h4>
                                            <p className="text-[10px] font-black text-gold tabular-nums tracking-widest">₹{item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserView;

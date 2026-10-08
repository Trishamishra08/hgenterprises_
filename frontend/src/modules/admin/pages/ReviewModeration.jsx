import React, { useState } from 'react';
import {
    Star, Search, CheckCircle2,
    XCircle, Trash2, Eye, EyeOff,
    MessageSquare, User, Package, Calendar,
    ChevronRight, MoreHorizontal, Clock, ArrowRight
} from 'lucide-react';
import AdminStatsCard from '../components/AdminStatsCard';

import api from '../../../utils/api';

const ReviewModeration = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchReviews = async () => {
        try {
            const res = await api.get('/products/admin/reviews/all');
            const normalizedReviews = res.data.map(r => ({
                id: r._id,
                userName: r.userId?.name || 'Anonymous',
                productName: r.productId?.name || 'Unknown Product',
                rating: r.rating,
                comment: r.comment,
                date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: r.status,
                isVisible: r.isVisible
            }));
            setReviews(normalizedReviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchReviews();
    }, []);

    const handleStatusMove = async (id, newStatus) => {
        try {
            await api.patch(`/products/admin/reviews/${id}/status`, {
                status: newStatus,
                isVisible: newStatus === 'Approved'
            });
            setReviews(reviews.map(rev =>
                rev.id === id ? { ...rev, status: newStatus, isVisible: newStatus === 'Approved' } : rev
            ));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const toggleVisibility = async (id) => {
        const rev = reviews.find(r => r.id === id);
        try {
            await api.patch(`/products/admin/reviews/${id}/status`, {
                isVisible: !rev.isVisible,
                status: rev.status
            });
            setReviews(reviews.map(r =>
                r.id === id ? { ...r, isVisible: !r.isVisible } : r
            ));
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    const deleteReview = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this review?')) {
            try {
                await api.delete(`/products/reviews/${id}`);
                setReviews(reviews.filter(rev => rev.id !== id));
            } catch (error) {
                console.error("Error deleting review:", error);
            }
        }
    };

    const filteredReviews = reviews.filter(rev => {
        const matchesStatus = filterStatus === 'All' || rev.status === filterStatus;
        const matchesSearch = rev.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rev.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rev.comment.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusStyles = {
        'Approved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Rejected': 'bg-red-50 text-red-600 border-red-100',
        'Pending': 'bg-blue-50 text-blue-600 border-blue-100'
    };

    return (
        <div className="space-y-3 md:space-y-4 animate-in fade-in duration-500 pb-20 font-outfit text-left">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-3 border border-black/5 rounded-none shadow-sm gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight leading-none uppercase">Feedback Moderator</h1>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Manage Product Testimonials & Quality Control</p>
                </div>
                <div className="flex gap-2 bg-[#FDF5F6] p-1 border border-black/5">
                    {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-none transition-all ${filterStatus === status
                                ? 'bg-black text-white'
                                : 'text-gray-400 hover:text-black hover:bg-white'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Matrix Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <AdminStatsCard
                    label="TOTAL TESTIMONIALS"
                    value={reviews.length.toString().padStart(2, '0')}
                    icon={MessageSquare}
                    color="text-footerBg"
                    bgColor="bg-gray-50"
                />
                <AdminStatsCard
                    label="PENDING VERIFICATION"
                    value={reviews.filter(r => r.status === 'Pending').length.toString().padStart(2, '0')}
                    icon={Clock}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <AdminStatsCard
                    label="APPROVED ARCHIVE"
                    value={reviews.filter(r => r.status === 'Approved').length.toString().padStart(2, '0')}
                    icon={CheckCircle2}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
            </div>

            {/* Filters Row */}
            <div className="bg-white p-2 rounded-none border border-black/5 shadow-sm flex items-center gap-4 sticky top-14 z-20">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type="text"
                        placeholder="SEARCH FEEDBACK BY PRODUCT, USER OR KEYWORD..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-none border border-transparent text-[9px] font-black uppercase tracking-widest text-footerBg outline-none focus:bg-white focus:border-black/10 transition-all placeholder:text-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Reviews Matrix Table */}
            <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden font-outfit">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FDF5F6]/40 border-b border-black/5">
                            <tr className="text-[9px] font-black text-gray-400 uppercase tracking-widest font-outfit">
                                <th className="px-6 py-3 w-32">Metric Scale</th>
                                <th className="px-6 py-3">Subject User</th>
                                <th className="px-6 py-3">Catalog Item</th>
                                <th className="px-6 py-3 w-[35%]">Testimony Core</th>
                                <th className="px-6 py-3 text-center">Protocol</th>
                                <th className="px-6 py-3 text-right">Matrix Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 text-[10px] font-black uppercase tracking-tight text-gray-900 font-outfit">
                            {filteredReviews.map((rev) => (
                                <tr key={rev.id} className="hover:bg-[#FDF5F6]/20 transition-colors group">
                                    <td className="px-6 py-3 align-middle">
                                        <div className="space-y-1">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={10}
                                                        className={`${i < rev.rating ? 'fill-gold text-gold' : 'text-gray-100'}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[8px] font-black text-gray-300 tabular-nums uppercase">{rev.date}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-none bg-black flex items-center justify-center text-white font-black border border-white/10 shadow-sm text-[10px]">
                                                {rev.userName.charAt(0)}
                                            </div>
                                            <p className="font-black text-black truncate">{rev.userName}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 align-middle">
                                        <p className="font-black text-gold truncate max-w-[120px]">{rev.productName}</p>
                                    </td>
                                    <td className="px-6 py-3 align-middle">
                                        <div className="flex flex-col">
                                            <p className="text-[10px] text-gray-500 font-serif italic leading-tight line-clamp-2 normal-case tracking-normal">
                                                "{rev.comment}"
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-center align-middle">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest border ${statusStyles[rev.status]}`}>
                                                {rev.status}
                                            </span>
                                            <span className={`text-[7px] font-black uppercase tracking-[0.2em] ${rev.isVisible ? 'text-emerald-600' : 'text-gray-300'}`}>
                                                {rev.isVisible ? 'PUBLIC' : 'OVAL'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right align-middle">
                                        <div className="flex items-center justify-end gap-1.5 transition-opacity">
                                            {rev.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusMove(rev.id, 'Approved')}
                                                        className="p-1 px-2 border border-black/5 bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                        title="Authorize"
                                                    >
                                                        <CheckCircle2 size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusMove(rev.id, 'Rejected')}
                                                        className="p-1 px-2 border border-black/5 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                        title="Revoke"
                                                    >
                                                        <XCircle size={12} />
                                                    </button>
                                                </>
                                            )}
                                            {rev.status !== 'Pending' && (
                                                <button
                                                    onClick={() => toggleVisibility(rev.id)}
                                                    className={`p-1 px-2 border border-black/5 bg-white transition-all shadow-sm active:scale-95 ${rev.isVisible
                                                        ? 'text-gray-400 hover:text-black'
                                                        : 'text-gold hover:bg-gold hover:text-black'
                                                        }`}
                                                >
                                                    {rev.isVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteReview(rev.id)}
                                                className="p-1 px-2 border border-black/5 bg-white text-gray-300 hover:text-red-600 transition-all shadow-sm active:scale-95"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
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

export default ReviewModeration;

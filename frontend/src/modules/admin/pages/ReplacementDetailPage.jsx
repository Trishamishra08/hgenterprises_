import React, { useState, useEffect } from 'react';
import ReturnWorkflowPanel from '../components/ReturnWorkflowPanel';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ArrowLeft,
    Printer,
    Download,
    User,
    MapPin,
    Package,
    AlertCircle,
    Truck,
    CheckCircle2,
    History,
    RotateCcw,
    Box,
    Shield,
    Phone,
    Mail,
    AlertTriangle,
    Archive,
    Calendar,
    PenTool,
    Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import ringImg from '../../../assets/diamond_ring.png';
import necklaceImg from '../../../assets/gold_necklace.png';
import banglesImg from '../../../assets/gold_bangles.png';

import api from '../../../utils/api';
import { useShop } from '../../../context/ShopContext';

const ReplacementDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showNotification } = useShop();

    // State for Admin Actions
    const [adminComment, setAdminComment] = useState('');
    const [replacementMode, setReplacementMode] = useState('after_pickup');

    // Fetch Replacement Details
    const { data: currentData, isLoading, error } = useQuery({
        queryKey: ['replacement', id],
        queryFn: async () => {
            const res = await api.get(`/returns/${id}`);
            return res.data;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ comment, ...rest }) => {
            const res = await api.patch(`/returns/${id}`, { ...rest, adminComment: comment });
            return res.data;
        },
        onSuccess: (updatedRequest) => {
            queryClient.invalidateQueries({ queryKey: ['replacement', id] });
            toast.success(`Status updated to ${updatedRequest.status}`);
            setAdminComment('');
        },
        onError: (err) => {
            console.error('[UPDATE REPLACEMENT STATUS ERROR]', err);
            toast.error(err.response?.data?.message || 'Failed to update protocol status');
        }
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': case 'Requested': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Approved': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Pickup Scheduled': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'Pickup Completed': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Replacement Shipped': case 'Shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    if (isLoading) return <div className="p-20 text-center text-[10px] font-black uppercase tracking-widest animate-pulse">Establishing Secure Neural Link to Protocol...</div>;
    if (error) return <div className="p-20 text-center text-red-500 font-black text-[10px] uppercase tracking-widest">Neural Link Failure: Protocol {id} Not Located.</div>;
    if (!currentData) return <div className="p-10 text-center uppercase font-black text-[10px] text-gray-400">Protocol Void.</div>;

    return (
        <div className="space-y-4 pb-12 text-left font-outfit animate-in fade-in duration-500 max-w-[1400px] mx-auto px-4 md:px-0">
            {/* Navigation Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 pb-6">
                <div>
                    <button onClick={() => navigate('/admin/replacements')} className="flex items-center gap-2 text-gray-400 hover:text-black font-black text-[9px] uppercase tracking-widest transition-all group mb-2">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Log
                    </button>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight leading-none uppercase">Replacement Protocol</h1>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Internal Verification & Logistics Management</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-3 bg-[#FDF5F6] border border-black/5 rounded-none text-[9px] font-black uppercase tracking-widest text-black hover:bg-gold transition-all">
                        <Download size={14} /> Data Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-3 bg-black text-white rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all">
                        <Printer size={14} /> Slip Protocol
                    </button>
                </div>
            </div>

            {/* 1. REPLACEMENT SUMMARY - High Density Geometric */}
            <div className="bg-white p-3 rounded-none border border-black/5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border-r border-black/5 pr-4 text-left">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Reference ID</p>
                    <p className="text-sm font-serif font-black text-black tracking-tighter tabular-nums">#{currentData._id.slice(-8)}</p>
                </div>
                <div className="border-r border-black/5 pr-4 pl-2">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Origin Order</p>
                    <p className="text-[10px] font-black text-gold uppercase tracking-widest cursor-pointer hover:underline tabular-nums">{currentData.orderId}</p>
                </div>
                <div className="border-r border-black/5 pr-4 pl-2">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Chronology</p>
                    <p className="text-[11px] font-serif font-black text-black">{new Date(currentData.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="pl-2">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Protocol State</p>
                    <span className={`inline-block px-3 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest border ${getStatusColor(currentData.status)}`}>
                        {currentData.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* LEFT CONTENT */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Items Section (Original & Replacement) - Unified Geometric Table */}
                    <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden">
                        <div className="p-3 border-b border-black/5 bg-[#FDF5F6]/50">
                            <h3 className="text-[9px] font-black text-black uppercase tracking-widest flex items-center gap-2">
                                <RotateCcw size={14} className="text-gold" /> Inventory Flux (Old vs New)
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#FDF5F6]/30 text-[8px] uppercase font-black text-gold tracking-[0.2em] border-b border-black/5">
                                    <tr>
                                        <th className="px-5 py-2.5">Nomenclature</th>
                                        <th className="px-5 py-2.5 text-center">Qty</th>
                                        <th className="px-5 py-2.5 text-right">Valuation</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[10px]">
                                    {/* Original Item */}
                                    {currentData.items?.map((item, i) => (
                                        <tr key={`orig-${i}`} className="bg-red-50/20 border-b border-black/5 group">
                                            <td className="px-5 py-2.5 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-none border border-black/5 bg-white overflow-hidden shrink-0 shadow-sm">
                                                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-black uppercase">{item.name}</span>
                                                    <span className="text-[7px] text-red-400 font-bold uppercase tracking-widest mt-0.5">Discrepant Item</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-2.5 text-center font-serif font-black">{item.quantity || 1}</td>
                                            <td className="px-5 py-2.5 text-right font-serif font-black text-black">₹{item.price?.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {/* Replacement Item */}
                                    {currentData.status === 'Shipped' && (
                                        <tr className="bg-emerald-50/20 group">
                                            <td className="px-5 py-2.5 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-none border border-black/5 bg-white overflow-hidden shrink-0 shadow-sm italic text-gray-300 flex items-center justify-center">
                                                    NEW
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-black uppercase">REPLACEMENT SHIPMENT</span>
                                                    <span className="text-[7px] text-emerald-500 font-bold uppercase tracking-widest mt-0.5">In Transit (Gratis)</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-2.5 text-center font-serif font-black">1</td>
                                            <td className="px-5 py-2.5 text-right font-serif font-black text-emerald-600">FREE</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Evidence & Logic */}
                    <div className="bg-white rounded-none border border-black/5 shadow-sm p-3">
                        <h3 className="text-[9px] font-black text-black uppercase tracking-widest mb-3 flex items-center gap-2">
                            <AlertCircle size={14} className="text-gold" /> Discrepancy Evidence
                        </h3>
                        <div className="bg-[#FDF5F6]/50 p-3 border border-black/5">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer Testimony</p>
                            <div className="flex flex-col gap-1">
                                <span className="font-black text-black text-[10px] uppercase">{currentData.reason}</span>
                                <span className="text-[10px] text-gray-500 italic font-serif">"{currentData.comment || 'No commentary provided.'}"</span>
                            </div>
                        </div>
                        {currentData.evidence?.images?.length > 0 && (
                            <div className="mt-3">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Visual Verification</p>
                                <div className="flex gap-2">
                                    {currentData.evidence.images.map((img, i) => (
                                        <img key={i} src={img} alt="Proof" className="w-16 h-16 object-cover rounded-none border border-black/5 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN - Actions & Protocol */}
                <div className="space-y-4">
                    {/* Admin Actions Panel - Ultra Compact */}
                    {currentData.status?.toLowerCase() === 'pending' && (
                        <div className="bg-white p-3 rounded-none border border-black/5 shadow-sm space-y-3">
                            <h3 className="text-[9px] font-black text-black uppercase tracking-widest flex items-center gap-2">
                                <Shield size={14} className="text-gold" /> Decision Protocol
                            </h3>

                            <div className="space-y-3 text-left">
                                <textarea
                                    className="w-full bg-[#FDF5F6]/40 border border-black/5 rounded-none p-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-gold min-h-[70px] placeholder-gray-300"
                                    placeholder="Internal Log Comment..."
                                    value={adminComment}
                                    onChange={(e) => setAdminComment(e.target.value)}
                                ></textarea>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => updateStatusMutation.mutate({ status: 'Approved', comment: adminComment })}
                                        className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-none font-black text-[10px] uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-md active:scale-95"
                                    >
                                        {updateStatusMutation.isPending ? 'STAGING...' : <><Plus size={14} /> AUTHORIZE RETURN</>}
                                    </button>
                                    <button
                                        onClick={() => updateStatusMutation.mutate({ status: 'Rejected', comment: adminComment })}
                                        className="w-full flex items-center justify-center gap-2 bg-white text-red-500 border border-red-100 py-2 rounded-none font-black text-[9px] uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95"
                                    >
                                        DISMISS REQUEST
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manual workflow: pickup -> quality check -> replacement shipped */}
                    {currentData.status?.toLowerCase() !== 'pending' && (
                        <ReturnWorkflowPanel
                            key={currentData.status}
                            request={currentData}
                            busy={updateStatusMutation.isPending}
                            onUpdate={(payload) => updateStatusMutation.mutate(payload)}
                        />
                    )}

                    {/* Customer Logistics Card */}
                    <div className="bg-white p-4 rounded-none border border-black/5 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#FDF5F6] border border-black/5 rounded-none flex items-center justify-center font-serif font-black text-sm text-gold uppercase">
                                {currentData.userId?.name?.charAt(0) || '?'}
                            </div>
                            <div className="min-w-0 text-left">
                                <h3 className="font-serif font-black text-black text-sm uppercase leading-tight tabular-nums tracking-tight">{currentData.userId?.name || 'Patron Unknown'}</h3>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{currentData.userId?.phone || 'No Registry'}</p>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-black/5 text-left">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><MapPin size={10} /> Logistics Point</p>
                            <div className="bg-[#FDF5F6]/40 p-3 border border-black/5 text-[10px] font-black text-black uppercase tracking-tight leading-relaxed">
                                {currentData.address?.line1}<br />
                                <span className="text-gold">{currentData.address?.city}, {currentData.address?.state} - {currentData.address?.pincode}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReplacementDetailPage;

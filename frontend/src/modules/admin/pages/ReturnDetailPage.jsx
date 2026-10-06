import React, { useState, useEffect } from 'react';
import ReturnWorkflowPanel from '../components/ReturnWorkflowPanel';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ArrowLeft,
    Box,
    Truck,
    Clock,
    User,
    Phone,
    Mail,
    MapPin,
    AlertCircle,
    CheckCircle2,
    XCircle,
    FileText,
    Image as ImageIcon,
    Video,
    MessageSquare,
    ChevronDown,
    ChevronUp,
    IndianRupee,
    CreditCard,
    Check,
    X,
    Send,
    Printer,
    Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import ringImg from '../../../assets/diamond_ring.png';
import necklaceImg from '../../../assets/gold_necklace.png';
import banglesImg from '../../../assets/gold_bangles.png';

import api from '../../../utils/api';
import { useShop } from '../../../context/ShopContext';

const ReturnDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showNotification } = useShop();
    const [adminComment, setAdminComment] = useState('');

    // Fetch Return Details
    const { data: ret, isLoading, error } = useQuery({
        queryKey: ['return', id],
        queryFn: async () => {
            const res = await api.get(`/returns/${id}`);
            return res.data;
        }
    });

    // Update Status Mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ comment, ...rest }) => {
            const res = await api.patch(`/returns/${id}`, { ...rest, adminComment: comment });
            return res.data;
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries(['return', id]);
            toast.success(`Request status updated`);
            setAdminComment('');
            setRefundAmount('');
        },
        onError: (err) => {
            console.error('[UPDATE STATUS ERROR]', err);
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    });

    const [refundAmount, setRefundAmount] = useState('');


    if (isLoading) return <div className="p-20 text-center text-[10px] font-black uppercase tracking-widest animate-pulse">Establishing Secure Neural Link to Protocol...</div>;
    if (error) return <div className="p-20 text-center text-red-500 font-black text-[10px] uppercase tracking-widest">Neural Link Failure: Protocol {id} Not Located.</div>;
    if (!ret) return <div className="p-20 text-center text-gray-400 font-black text-[10px] uppercase tracking-widest">Protocol Matrix Empty.</div>;

    const isReplacement = ret.type?.toLowerCase() === 'exchange';

    const getStatusColor = (st) => {
        switch (st?.toLowerCase()) {
            case 'completed':
            case 'refunded':
            case 'shipped': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'approved': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'pending': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'rejected': return 'text-red-600 bg-red-50 border-red-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="space-y-4 font-outfit text-left pb-20 animate-in fade-in duration-500 relative">
            {/* Top Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <button
                    onClick={() => navigate('/admin/returns')}
                    className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest transition-all"
                >
                    <ArrowLeft size={14} /> Back to Requests
                </button>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-black/10 text-black rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-gold/10 transition-all shadow-sm">
                        <Download size={14} /> Download PDF
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-lg active:scale-95">
                        <Printer size={14} strokeWidth={2.5} /> Print Slip
                    </button>
                </div>
            </div>

            {/* 1. Return Summary (Top Card) - High Density */}
            <div className="bg-white p-4 rounded-none border border-black/5 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Protocol Ref</p>
                    <p className="text-xl font-serif font-black text-black">#{ret._id?.slice(-8)}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Ref</p>
                    <p
                        className="text-sm font-black text-gold hover:underline cursor-pointer tracking-tighter"
                        onClick={() => navigate(`/admin/orders/${ret.orderId}`)}
                    >
                        #{ret.orderId}
                    </p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
                    <span className={`inline-flex items-center px-3 py-0.5 rounded-none text-[9px] font-black uppercase tracking-widest border ${getStatusColor(ret.status)}`}>
                        {ret.status}
                    </span>
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Fiscal Flux</p>
                    <p className="text-2xl font-serif font-black text-gold tabular-nums tracking-tighter">₹{(ret.items?.reduce((acc, i) => acc + i.price, 0) || 0).toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column: Items, Breakup, Evidence */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Return Items Table */}
                    <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-black/5 flex items-center gap-2 bg-[#FDF5F6]/30">
                            <Box size={14} className="text-gold" />
                            <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Return Inventory ({ret.items?.length || 0})</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#FDF5F6]/80 text-gold border-b border-black/5">
                                    <tr>
                                        <th className="px-6 py-3 text-[8px] font-black uppercase tracking-[0.3em] w-1/2">Item Description</th>
                                        <th className="px-6 py-3 text-[8px] font-black uppercase tracking-[0.3em] text-center">Qty</th>
                                        <th className="px-6 py-3 text-[8px] font-black uppercase tracking-[0.3em] text-right">Price</th>
                                        <th className="px-6 py-3 text-[8px] font-black uppercase tracking-[0.3em]">Reason / Type</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {ret.items?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-[#FDF5F6]/40 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-none border border-black/5 p-1 shrink-0">
                                                        <img src={item.image} alt="" className="w-full h-full object-contain" />
                                                    </div>
                                                    <p className="text-[11px] font-black text-black tracking-tight line-clamp-1 uppercase">{item.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-center font-bold text-black text-[11px] tabular-nums">{item.quantity || 1}</td>
                                            <td className="px-6 py-3 text-right font-black text-gray-400 text-[11px] tabular-nums">₹{(item.price || 0).toLocaleString()}</td>
                                            <td className="px-6 py-3 font-black text-gray-400 text-[11px] tabular-nums">
                                                <span className="text-[9px] font-black text-gray-700 uppercase tracking-tight">{ret.reason}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Customer Evidence */}
                    <div className="bg-white rounded-none border border-black/5 shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-4 border-l-2 border-gold pl-3">
                            <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Inspection Evidence</h3>
                        </div>
                        <div className="bg-[#FDF5F6] p-4 rounded-none border border-gold/10 mb-4 flex gap-4">
                            <div className="w-8 h-8 bg-black rounded-none flex items-center justify-center text-gold shrink-0">
                                <MessageSquare size={16} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gold uppercase tracking-widest mb-1">Customer Observations</p>
                                <p className="text-xs font-bold text-black leading-relaxed italic uppercase tracking-tight">"{ret.comment || 'No additional commentary provided.'}"</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Verification Uploads</p>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {ret.evidence?.images?.map((img, i) => (
                                    <div key={i} className="w-24 h-24 rounded-none border border-black/5 overflow-hidden shrink-0 group cursor-pointer relative shadow-sm hover:border-gold/50 transition-all">
                                        <img src={img} alt="Proof" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <ImageIcon className="text-white" size={16} />
                                        </div>
                                    </div>
                                ))}
                                {(!ret.evidence?.images || ret.evidence.images.length === 0) && (
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">No visual evidence uploaded.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Refund Banking Information (New) */}
                    {!isReplacement && ret.bankDetails && (
                        <div className="bg-white rounded-none border border-black/5 shadow-sm p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 mb-4 border-l-2 border-emerald-500 pl-3">
                                <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Refund Banking Protocol</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FDF5F6]/30 p-6 border border-emerald-100">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Account Holder</p>
                                    <p className="text-sm font-black text-black uppercase">{ret.bankDetails.holderName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Account Number</p>
                                    <p className="text-sm font-black text-black tracking-widest select-all">{ret.bankDetails.accountNumber}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Bank Name</p>
                                    <p className="text-[11px] font-bold text-gray-700 uppercase">{ret.bankDetails.bankName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">IFSC Code</p>
                                    <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">{ret.bankDetails.ifscCode}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Customer, Timeline, Actions */}
                <div className="space-y-4">
                    {/* Admin Actions (Pending -> Approved/Rejected) */}
                    {ret.status?.toLowerCase() === 'pending' && (
                        <div className="bg-white p-4 rounded-none border border-black/5 shadow-sm animate-in slide-in-from-top-4">
                            <div className="flex items-center gap-2 mb-4 border-l-2 border-gold pl-3">
                                <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Protocol Decision</h3>
                            </div>
                            <textarea
                                className="w-full bg-[#FDF5F6]/50 border border-black/5 rounded-none p-3 text-[10px] font-bold text-gray-800 outline-none focus:border-gold min-h-[80px] resize-none mb-3 transition-all"
                                placeholder="Mandatory internal rationale..."
                                value={adminComment}
                                onChange={(e) => setAdminComment(e.target.value)}
                            ></textarea>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => updateStatusMutation.mutate({ status: 'Approved', comment: adminComment })}
                                    className="flex items-center justify-center gap-2 py-2 bg-black text-white rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-gold transition-all shadow-md active:scale-95"
                                >
                                    <CheckCircle2 size={14} strokeWidth={3} /> Approve
                                </button>
                                <button
                                    onClick={() => updateStatusMutation.mutate({ status: 'Rejected', comment: adminComment })}
                                    className="flex items-center justify-center gap-2 py-2 bg-[#FDF5F6] border border-black/10 text-gray-400 rounded-none text-[9px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all active:scale-95"
                                >
                                    <XCircle size={14} strokeWidth={3} /> Reject
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Manual workflow: pickup -> quality check -> refund */}
                    {ret.status?.toLowerCase() !== 'pending' && (
                        <ReturnWorkflowPanel
                            key={ret.status}
                            request={ret}
                            busy={updateStatusMutation.isPending}
                            onUpdate={(payload) => updateStatusMutation.mutate(payload)}
                        />
                    )}

                    {/* Decision Note (If resolved) */}
                    {(ret.status?.toLowerCase() === 'approved' || ret.status?.toLowerCase() === 'rejected' || ret.status?.toLowerCase() === 'refunded' || ret.status?.toLowerCase() === 'shipped') && (
                        <div className={`${ret.status === 'Approved' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'} p-4 rounded-none border shadow-sm`}>
                            <h3 className={`text-[9px] font-black ${ret.status === 'Approved' ? 'text-emerald-600' : 'text-red-500'} uppercase tracking-widest mb-2`}>
                                Official Rationale
                            </h3>
                            <p className={`text-[10px] font-bold leading-relaxed uppercase tracking-tight ${ret.status === 'Approved' ? 'text-emerald-800' : 'text-red-800'}`}>
                                {ret.adminComment || "Operational clearance provided without specific notation."}
                            </p>
                        </div>
                    )}

                    {/* Customer Portfolio */}
                    <div className="bg-white p-4 rounded-none border border-black/5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 border-l-2 border-gold pl-3">
                            <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Client Portfolio</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#FDF5F6] rounded-none border border-black/5 flex items-center justify-center font-black text-gold text-lg shadow-sm uppercase">
                                {ret.userId?.name?.charAt(0) || '?'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-black text-black text-[11px] uppercase tracking-widest truncate">{ret.userId?.name || 'Patron Unknown'}</h3>
                                <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest flex items-center gap-1">
                                    <Phone size={10} /> {ret.userId?.phone || 'No Registry'}
                                </p>
                                <p className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest flex items-center gap-1">
                                    <Mail size={10} /> {ret.userId?.email || 'No Identity'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pickup Address */}
                    <div className="bg-white p-4 rounded-none border border-black/5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 border-l-2 border-gold pl-3">
                            <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Logistics Disposition</h3>
                        </div>
                        <div className="bg-[#FDF5F6]/50 p-3 border border-black/5">
                            <p className="text-xs font-bold text-gray-600 leading-relaxed uppercase tracking-tight">
                                {ret.address?.line1}<br />
                                <span className="block mt-1 font-black text-black text-[11px]">
                                    {ret.address?.city}, {ret.address?.state} - {ret.address?.pincode}
                                </span>
                            </p>
                            <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between">
                                <p className="text-[8px] font-black text-gold uppercase tracking-[0.2em] flex items-center gap-1">
                                    <Truck size={10} /> Shiprocket Verified
                                </p>
                                <X size={10} className="text-gray-300" />
                            </div>
                        </div>
                    </div>

                    {/* Return Timeline */}
                    <div className="bg-white p-4 rounded-none border border-black/5 shadow-sm">
                        <div className="flex items-center gap-2 mb-5 border-l-2 border-gold pl-3">
                            <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Processing Chronology</h3>
                        </div>
                        <div className="space-y-5 relative pl-1.5 text-[10px] font-black text-black uppercase tracking-widest italic">
                            Protocol synchronized with Registry Cluster.
                        </div>
                    </div>

                    {/* Courier Tracking (If active) */}
                    {(ret.status?.toLowerCase() === 'approved' || ret.status?.toLowerCase() === 'completed' || ret.status?.toLowerCase() === 'refunded' || ret.status?.toLowerCase() === 'shipped') && (
                        <div className="bg-white p-4 rounded-none border border-black/5 border-l-2 border-l-gold shadow-sm">
                            <h3 className="text-[10px] font-black text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Truck size={14} className="text-gold" strokeWidth={2.5} /> Tracking Protocol
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Carrier</span>
                                    <span className="text-black font-black">Shiprocket / Internal</span>
                                </div>
                                <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>AWB Reference</span>
                                    <span className="text-black font-black select-all tracking-widest">AWAITING_MANIFEST</span>
                                </div>
                                <button className="w-full mt-2 py-2.5 bg-black text-white hover:bg-gold hover:text-black rounded-none text-[8px] font-black uppercase tracking-widest transition-all">
                                    Synchronize Logistics
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Operational Dispatch */}
                    <div className="grid grid-cols-2 gap-2">
                        <button className="flex items-center justify-center gap-2 py-2.5 bg-[#FDF5F6] text-black border border-black/5 rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                            <Send size={12} /> WhatsApp
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 bg-[#FDF5F6] text-black border border-black/5 rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                            <Mail size={12} /> Email Registry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnDetailPage;

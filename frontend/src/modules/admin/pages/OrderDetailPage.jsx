import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Printer,
    Download,
    CheckCircle2,
    Clock,
    Truck,
    Package,
    MapPin,
    User,
    CreditCard,
    Tag,
    MessageCircle,
    Mail,
    AlertCircle,
    XCircle,
    Check,
    X,
    Lock
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import toast from 'react-hot-toast';
import { useShop } from '../../../context/ShopContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generateInvoice } from '../../../utils/invoiceGenerator';
import hgLogoPremium from '../../user/assets/logo_final.jpg';

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { orders, refreshOrders } = useShop();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Approval Workflow State
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (!orders) return;
        const foundOrder = orders.find(o => o.orderId === id || o._id === id);

        if (foundOrder) {
            setOrder(foundOrder);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [id, orders]);

    const [shipForm, setShipForm] = useState({ courierName: '', trackingId: '', trackingUrl: '', estimatedDelivery: '' });

    const updateStatus = async (newStatus, extra = {}) => {
        try {
            setActionLoading(true);
            await api.patch(`/orders/${order._id || id}/status`, { status: newStatus, ...extra });
            toast.success(`Order status updated to ${newStatus}`);
            await refreshOrders();
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error(error.response?.data?.message || "Status update failed");
        } finally {
            setActionLoading(false);
        }
    };

    const generateInvoicePDF = (action = 'download') => {
        const img = new Image();
        img.src = hgLogoPremium;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            const doc = generateInvoice(order, dataUrl);
            if (action === 'print') {
                doc.autoPrint();
                window.open(doc.output('bloburl'), '_blank');
            } else {
                doc.save(`Invoice_${order.orderId || id}.pdf`);
            }
        };
        img.onerror = () => {
            const doc = generateInvoice(order);
            if (action === 'print') {
                doc.autoPrint();
                window.open(doc.output('bloburl'), '_blank');
            } else {
                doc.save(`Invoice_${order.orderId || id}.pdf`);
            }
        };
    };

    const confirmCancel = async () => {
        if (!rejectionReason.trim()) return;
        await updateStatus('Cancelled', { note: rejectionReason.trim() });
        setShowRejectInput(false);
        setRejectionReason('');
    };

    if (loading) return <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest">Loading Order Details...</div>;
    if (!order) return (
        <div className="p-10 text-center space-y-4">
            <div className="text-red-400 font-bold uppercase tracking-widest">Order not found</div>
            <button onClick={() => navigate('/admin/orders')} className="text-xs text-blue-500 underline">Back to list</button>
        </div>
    );

    const statusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
            case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'cancelled':
            case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
            case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'processing': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getTimeline = () => {
        const fmt = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '');
        const history = order.statusHistory || [];
        const steps = [{ status: 'Order Placed', completed: true, date: fmt(order.createdAt) }];
        const paid = order.paymentMethod === 'cod' || ['Completed', 'Refunded', 'Partially Refunded'].includes(order.paymentStatus);
        steps.push({ status: order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Payment Received', completed: paid, date: paid ? '' : 'Awaiting payment' });
        const at = (st) => fmt(history.find((h) => h.status === st)?.at);
        if (order.status === 'Cancelled') {
            steps.push({ status: 'Order Cancelled', completed: true, date: at('Cancelled'), isError: true });
        } else {
            const idx = ['Pending', 'Received', 'Processing', 'Shipped', 'Out For Delivery', 'Delivered'].indexOf(order.status);
            steps.push({ status: 'Processing', completed: idx >= 2, date: at('Processing') });
            steps.push({ status: 'Shipped', completed: idx >= 3, date: at('Shipped') });
            steps.push({ status: 'Out For Delivery', completed: idx >= 4, date: at('Out For Delivery') });
            steps.push({ status: 'Delivered', completed: idx >= 5, date: at('Delivered') });
        }
        return steps;
    };

    return (
        <div className="space-y-4 font-outfit text-left pb-20 animate-in fade-in duration-500 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-[0.2em] transition-all"
                >
                    <ArrowLeft size={14} /> Back to Orders
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => generateInvoicePDF('print')}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-black/10 text-black rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-gold/10 transition-all"
                    >
                        <Printer size={14} /> Print Invoice
                    </button>
                    <button
                        onClick={() => generateInvoicePDF('download')}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-lg active:scale-95"
                    >
                        <Download size={14} /> Download Slip
                    </button>
                </div>
            </div>

            {/* Info Strip - High Density */}
            <div className="bg-white p-4 rounded-none border border-black/5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Ref</p>
                    <p className="text-xl font-serif font-black text-black tracking-tighter">#{order.orderId || order._id}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Date & Time</p>
                    <p className="text-sm font-black text-black">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-none text-[9px] font-black uppercase tracking-widest border ${statusColor(order.status)}`}>
                        {order.status || 'Pending'}
                    </span>
                </div>
                <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Mode</p>
                    <p className={`text-xs font-black tracking-widest uppercase ${order.paymentMethod?.toLowerCase().includes('cod') ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {order.paymentMethod || 'PREPAID'}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Net Assets</p>
                    <p className="text-2xl font-serif font-black text-gold tabular-nums tracking-tighter">₹ {(order.total || 0).toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column: Items, Billing, Coupon */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-black/5 flex items-center gap-2 bg-[#FDF5F6]/30">
                            <Package size={14} className="text-gold" />
                            <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Order Items ({order.items?.length || 0})</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#FDF5F6]/80 text-gold border-b border-black/5">
                                    <tr>
                                        <th className="px-6 py-3 text-[8px] font-black uppercase tracking-[0.3em] w-1/2">Item Details</th>
                                        <th className="px-6 py-3 text-[8px] font-black uppercase tracking-[0.3em] text-center">Qty</th>
                                        <th className="px-6 py-3 text-[8px] font-black uppercase tracking-[0.3em] text-right">Price</th>
                                        <th className="px-6 py-3 text-[8px] font-black uppercase tracking-[0.3em] text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {(order.items || []).map((item, idx) => (
                                        <tr key={idx} className="hover:bg-[#FDF5F6]/40 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-none border border-black/5 p-1 flex-shrink-0">
                                                        <img src={item.image} alt="" className="w-full h-full object-contain" />
                                                    </div>
                                                    <p className="text-[11px] font-black text-black tracking-tight line-clamp-1 uppercase">{item.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-center font-bold text-black text-[11px] tabular-nums">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-3 text-right text-[10px] font-black text-gray-400 tabular-nums lowercase tracking-tighter">
                                                {item.quantity} x ₹ {item.price}
                                            </td>
                                            <td className="px-6 py-3 text-right font-black text-black text-[11px] tabular-nums">
                                                ₹ {(item.quantity * item.price).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-none border border-black/5 shadow-sm p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-2 border-l-2 border-gold pl-3">
                            <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Billing Summary</h3>
                        </div>
                        <div className="space-y-2.5 pt-1">
                            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Consignment Subtotal</span>
                                <span className="text-black font-black">₹ {(order.subtotal || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>GST (Included)</span>
                                <span className="text-black font-black">₹ {(order.gstAmount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Conveyance Fees</span>
                                <span className={order.shippingAmount > 0 ? "text-black font-black" : "text-emerald-600 font-black tracking-[0.2em] text-[10px]"}>
                                    {order.shippingAmount > 0 ? `₹ ${order.shippingAmount.toLocaleString()}` : "Free"}
                                </span>
                            </div>
                            <div className="border-t border-black/5 pt-3 flex justify-between items-center">
                                <span className="text-[10px] font-black text-black uppercase tracking-widest">Final Remittance</span>
                                <span className="text-2xl font-serif font-black text-black tabular-nums tracking-tighter">₹ {(order.total || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {(order.couponCode || order.discount > 0) && (
                        <div className="bg-[#FDF5F6] rounded-none border border-gold/10 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-black rounded-none flex items-center justify-center text-gold shadow-sm">
                                    <Tag size={16} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gold uppercase tracking-widest mb-0.5">Applied Code</p>
                                    <p className="text-md font-black text-black tracking-widest uppercase">{order.couponCode || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Coupon Saved</p>
                                <p className="text-xl font-serif font-black text-emerald-600 tabular-nums">₹ {order.discount || 0}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Steps, Customer, etc. */}
                <div className="space-y-4">

                    {/* ADMIN ACTIONS: Master Lifecycle Control */}
                    <div className="bg-white rounded-none border border-black/5 shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-4 border-l-2 border-gold pl-3">
                            <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Update order State</h3>
                        </div>

                        {['Pending', 'Received'].includes(order.status) && !showRejectInput && (
                            <div className="space-y-2">
                                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    Online payment has not been received for this order yet. It moves ahead automatically once the customer pays.
                                </p>
                                <button onClick={() => setShowRejectInput(true)} className="text-sm text-red-600 hover:underline">Cancel this order</button>
                            </div>
                        )}

                        {order.status === 'Processing' && !showRejectInput && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600">Book the courier outside the system, then enter its details. The customer is notified with the tracking ID.</p>
                                <div><label className="block text-xs font-medium text-gray-600 mb-1">Courier name *</label>
                                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 bg-white" value={shipForm.courierName} onChange={(e) => setShipForm({ ...shipForm, courierName: e.target.value })} placeholder="e.g. Blue Dart, Delhivery" /></div>
                                <div><label className="block text-xs font-medium text-gray-600 mb-1">Tracking ID *</label>
                                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 bg-white" value={shipForm.trackingId} onChange={(e) => setShipForm({ ...shipForm, trackingId: e.target.value })} /></div>
                                <div><label className="block text-xs font-medium text-gray-600 mb-1">Tracking link (optional)</label>
                                    <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 bg-white" value={shipForm.trackingUrl} onChange={(e) => setShipForm({ ...shipForm, trackingUrl: e.target.value })} placeholder="https://" /></div>
                                <div><label className="block text-xs font-medium text-gray-600 mb-1">Expected delivery date</label>
                                    <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900 bg-white" value={shipForm.estimatedDelivery} onChange={(e) => setShipForm({ ...shipForm, estimatedDelivery: e.target.value })} /></div>
                                <button
                                    onClick={() => updateStatus('Shipped', shipForm)}
                                    disabled={actionLoading || !shipForm.courierName.trim() || !shipForm.trackingId.trim()}
                                    className="w-full py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 bg-gray-900 text-white hover:bg-black flex items-center justify-center gap-2"
                                >
                                    <Truck size={14} /> {actionLoading ? 'Updating...' : 'Mark as shipped'}
                                </button>
                                <button onClick={() => setShowRejectInput(true)} className="text-sm text-red-600 hover:underline">Cancel this order</button>
                            </div>
                        )}

                        {order.status === 'Shipped' && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">Shipped via {order.courierName}, tracking {order.trackingId}.</p>
                                <button onClick={() => updateStatus('Out For Delivery')} disabled={actionLoading} className="w-full py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 border border-gray-300 text-gray-800 hover:bg-gray-50">Mark out for delivery</button>
                                <button onClick={() => updateStatus('Delivered')} disabled={actionLoading} className="w-full py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-2">
                                    <Check size={14} /> {actionLoading ? 'Updating...' : 'Mark as delivered'}
                                </button>
                            </div>
                        )}

                        {order.status === 'Out For Delivery' && (
                            <button onClick={() => updateStatus('Delivered')} disabled={actionLoading} className="w-full py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-2">
                                <Check size={14} /> {actionLoading ? 'Updating...' : 'Mark as delivered'}
                            </button>
                        )}

                        {showRejectInput && (
                            <div className="space-y-3">
                                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                    <label className="block text-xs font-medium text-red-700 mb-1">Reason for cancelling (the customer is told)</label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="w-full bg-white border border-red-200 rounded-lg p-2 text-sm focus:outline-none focus:border-red-400 min-h-[60px] resize-none"
                                        autoFocus
                                    />
                                    {order.paymentStatus === 'Completed' && order.paymentMethod === 'razorpay' && (
                                        <p className="text-xs text-red-700 mt-2">The online payment of ₹{order.total?.toLocaleString('en-IN')} will be refunded to the customer automatically.</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => setShowRejectInput(false)} className="py-2 rounded-lg border border-gray-300 text-sm">Back</button>
                                    <button onClick={confirmCancel} disabled={!rejectionReason.trim() || actionLoading} className="py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-50">
                                        {actionLoading ? 'Cancelling...' : 'Confirm cancel'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {['Delivered', 'Cancelled'].includes(order.status) && (
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center gap-3">
                                <Lock size={14} className="text-gray-400" />
                                <span className="text-sm text-gray-500">This order is closed. Returns and exchanges are handled from the Returns and Replacements pages.</span>
                            </div>
                        )}
                    </div>

                    {/* Ordered By */}
                    <div className="bg-white rounded-none border border-black/5 shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-4 border-l-2 border-gold pl-3">
                            <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Ordered By</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#FDF5F6] rounded-none flex items-center justify-center text-gold font-black border border-black/5 shadow-sm text-md">
                                {order.userId?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="font-black text-black text-[11px] tracking-widest uppercase">{order.userId?.name || 'Unknown User'}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{order.userId?.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Details */}
                    <div className="bg-white rounded-none border border-black/5 shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-4 border-l-2 border-gold pl-3">
                            <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Delivery Details</h3>
                        </div>
                        <div className="bg-[#FDF5F6]/50 rounded-none p-3 border border-black/5">
                            <p className="font-black text-[11px] text-black mb-1 uppercase tracking-widest">{order.address?.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mb-3 lowercase tracking-tighter">
                                <MessageCircle size={10} className="text-gold" /> {order.address?.phone || 'N/A'}
                            </p>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Shipping Address</p>
                            <p className="text-xs font-bold text-gray-600 leading-relaxed uppercase tracking-tight">
                                {order.address?.flatNo || order.address?.houseNo} {order.address?.street || order.address?.area}<br />
                                {order.address?.landmark && <span className="text-[10px] text-gray-400">Landmark: {order.address.landmark}<br /></span>}
                                {order.address?.city}, {order.address?.state} - {order.address?.zip || order.address?.pincode}
                            </p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-none border border-black/5 shadow-sm p-4">
                        <div className="flex items-center gap-2 mb-4 border-l-2 border-gold pl-3">
                            <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Order Timeline</h3>
                        </div>
                        <div className="space-y-4 relative pl-1.5">
                            {getTimeline().map((step, i, arr) => (
                                <div key={i} className="relative flex items-start gap-4 z-10">
                                    {/* Line */}
                                    {i !== arr.length - 1 && (
                                        <div className={`absolute left-[5px] top-5 bottom-[-20px] w-[1px] ${step.completed ? 'bg-gold' : 'bg-black/5'} -z-10`}></div>
                                    )}

                                    <div className={`w-2.5 h-2.5 rounded-none flex items-center justify-center rotate-45 border shrink-0 ${step.isError
                                        ? 'bg-red-500 border-red-500'
                                        : step.completed
                                            ? 'bg-gold border-gold'
                                            : 'bg-white border-black/10'
                                        }`}>
                                    </div>
                                    <div className="-mt-1">
                                        <p className={`text-[9px] font-black uppercase tracking-widest ${step.isError ? 'text-red-600' : 'text-black'}`}>{step.status}</p>
                                        <p className="text-[8px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">{step.date || 'Pending'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;

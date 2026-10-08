import React, { useState } from 'react';
import {
    Bell, Settings, Send, Tag, ShoppingBag,
    Eye, EyeOff, Trash2, Filter, AlertCircle,
    CheckCircle2, Clock, Smartphone, Globe, Shield,
    Layout, ChevronRight, X, Plus
} from 'lucide-react';

const GlobalNotificationManager = () => {
    // Mock for System-wide notifications (Announcements/Offers)
    const [systemNotifications, setSystemNotifications] = useState([
        {
            id: 'SN-001',
            type: 'Offer',
            title: 'Flat 20% Off - Weekend Special',
            message: 'Use code WEEKEND20 on all silver jewelry. Valid till Sunday midnight!',
            status: 'Enabled',
            target: 'All Platforms',
            timestamp: 'Created: Oct 24, 2024'
        },
        {
            id: 'SN-002',
            type: 'System',
            title: 'New Collection Live',
            message: 'Our "Heritage Series" is now available. Explore 50+ new designs.',
            status: 'Disabled',
            target: 'App Only',
            timestamp: 'Created: Oct 20, 2024'
        }
    ]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newNotif, setNewNotif] = useState({
        type: 'Offer',
        title: '',
        message: '',
        target: 'All Platforms'
    });

    const toggleNotifStatus = (id) => {
        setSystemNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, status: n.status === 'Enabled' ? 'Disabled' : 'Enabled' } : n
        ));
    };

    const deleteNotif = (id) => {
        if (window.confirm('Delete this system notification?')) {
            setSystemNotifications(prev => prev.filter(n => n.id !== id));
        }
    };

    const handleCreate = (e) => {
        e.preventDefault();
        const created = {
            ...newNotif,
            id: `SN-00${systemNotifications.length + 1}`,
            status: 'Enabled',
            timestamp: `Created: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        };
        setSystemNotifications([created, ...systemNotifications]);
        setIsCreateModalOpen(false);
        setNewNotif({ type: 'Offer', title: '', message: '', target: 'All Platforms' });
    };

    const typeIcons = {
        'Offer': <Tag className="w-3.5 h-3.5 text-amber-600" />,
        'System': <Settings className="w-3.5 h-3.5 text-gray-600" />,
        'Order Update': <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
    };

    return (
        <div className="space-y-3 md:space-y-4 animate-in fade-in duration-500 pb-20 font-outfit text-left">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-3 border border-black/5 rounded-none shadow-sm gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight leading-none uppercase">Messaging Registry</h1>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Manage System-Wide Alerts & Strategic Updates</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center justify-center gap-3 px-6 py-2.5 bg-black text-white rounded-none text-[9px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-gold hover:text-black transition-all active:scale-95 group"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    <span>ADD NOTIFICATION</span>
                </button>
            </div>

            {/* Notifications Table */}
            <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden font-outfit">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 uppercase tracking-widest text-[9px] font-black border-b border-black/5">
                                <th className="px-4 py-3 text-center w-16">Type</th>
                                <th className="px-4 py-3">Notification Details</th>
                                <th className="px-4 py-3">Target</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {systemNotifications.map((notif) => (
                                <tr
                                    key={notif.id}
                                    className={`group hover:bg-gray-50/50 transition-colors ${notif.status === 'Disabled' ? 'bg-gray-50/30' : ''}`}
                                >
                                    <td className="px-4 py-3 text-center align-middle">
                                        <div className="bg-white p-1.5 rounded-none border border-black/5 shadow-sm inline-flex items-center justify-center">
                                            {typeIcons[notif.type] || <Bell className="w-3.5 h-3.5 text-gray-400" />}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                        <div className="flex flex-col">
                                            <h4 className="text-[11px] font-black text-black uppercase tracking-tight">
                                                {notif.title}
                                            </h4>
                                            <p className="text-[9px] text-gray-400 font-serif italic leading-tight mt-0.5">
                                                {notif.message}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                            <Smartphone className="w-3 h-3" />
                                            <span>{notif.target}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-middle">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest tabular-nums">
                                            <Clock className="w-3 h-3" />
                                            <span>{notif.timestamp.replace('Created: ', '')}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center align-middle">
                                        <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest border transition-all ${notif.status === 'Enabled'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-gray-100 text-gray-400 border-gray-200'
                                            }`}>
                                            {notif.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right align-middle">
                                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => toggleNotifStatus(notif.id)}
                                                className="p-1 px-2 bg-white border border-black/5 rounded-none text-gray-400 hover:text-black hover:border-black transition-all shadow-sm"
                                                title={notif.status === 'Enabled' ? 'Disable' : 'Enable'}
                                            >
                                                {notif.status === 'Enabled' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                            </button>
                                            <button
                                                onClick={() => deleteNotif(notif.id)}
                                                className="p-1 px-2 bg-white border border-black/5 rounded-none text-gray-400 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {systemNotifications.length === 0 && (
                    <div className="py-20 text-center bg-gray-50/20">
                        <div className="bg-white border border-black/5 w-12 h-12 rounded-none flex items-center justify-center mx-auto mb-4 rotate-45 shadow-sm">
                            <Bell className="w-6 h-6 text-gray-200 -rotate-45" />
                        </div>
                        <h3 className="text-black font-black text-[10px] uppercase tracking-[0.3em] mb-1">Alert Matrix Null</h3>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest italic leading-none">Initialize new communications to populate registry.</p>
                    </div>
                )}
            </div>

            {/* Create Modal - Ultra Modern Geometric */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-none w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-black/10">
                        <div className="p-4 border-b border-black/5 flex items-center justify-between bg-gray-50">
                            <h3 className="text-xs font-serif font-black text-black uppercase tracking-widest">Initialize Alert Protocol</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-1.5 hover:bg-gray-200 rounded-none text-gray-400 transition-all border border-transparent hover:border-black/10">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Class Type</label>
                                    <select
                                        className="w-full p-2 bg-gray-50 border border-black/5 rounded-none text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-gold transition-all appearance-none cursor-pointer"
                                        value={newNotif.type}
                                        onChange={(e) => setNewNotif({ ...newNotif, type: e.target.value })}
                                    >
                                        <option>Offer</option>
                                        <option>Order Update</option>
                                        <option>System</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Deployment Target</label>
                                    <div className="relative">
                                        <select
                                            className="w-full p-2 bg-gray-50 border border-black/5 rounded-none text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-gold transition-all appearance-none cursor-pointer"
                                            value={newNotif.target}
                                            onChange={(e) => setNewNotif({ ...newNotif, target: e.target.value })}
                                        >
                                            <option value="All Platforms">All Platforms</option>
                                            <option value="App Only">App Only</option>
                                            <option value="Web Only">Web Only</option>
                                        </select>
                                        <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-90 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Alert Headline</label>
                                <input
                                    type="text"
                                    placeholder="E.G. HERITAGE COLLECTION LIVE..."
                                    className="w-full p-2.5 bg-gray-50 border border-black/5 rounded-none text-[10px] font-black uppercase tracking-tight focus:outline-none focus:border-gold transition-all placeholder:text-gray-300"
                                    value={newNotif.title}
                                    onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Technical Core Message</label>
                                <textarea
                                    placeholder="Enter exhaustive message details here..."
                                    className="w-full p-2.5 bg-gray-50 border border-black/5 rounded-none text-[10px] font-serif italic h-20 resize-none focus:outline-none focus:border-gold transition-all placeholder:text-gray-300 leading-relaxed"
                                    value={newNotif.message}
                                    onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-white border border-black/5 text-gray-400 rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                                >
                                    Dismiss
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-black text-white rounded-none text-[9px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-gold hover:text-black transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <Send className="w-3 h-3" />
                                    Launch Protocol
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalNotificationManager;

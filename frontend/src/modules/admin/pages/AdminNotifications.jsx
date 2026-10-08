import React, { useState } from 'react';
import {
    Bell, ShoppingBag, UserPlus, Star,
    AlertTriangle, Check, Trash2,
    Filter, MoreVertical, Clock, Package,
    CheckCircle2, Eye, X, Shield, Info
} from 'lucide-react';
import AdminStatsCard from '../components/AdminStatsCard';

const AdminNotifications = () => {
    // Mock Admin Notifications Data
    const [notifications, setNotifications] = useState([
        {
            id: 'NOT-001',
            type: 'Order',
            title: 'New Order Received',
            message: 'Order #ORD-82745 has been placed by Aditi Singh.',
            time: '2 mins ago',
            isRead: false,
            priority: 'High'
        },
        {
            id: 'NOT-002',
            type: 'Inventory',
            title: 'Low Stock Alert',
            message: 'Classic Solitaire Ring is down to 2 units in stock.',
            time: '45 mins ago',
            isRead: false,
            priority: 'Urgent'
        },
        {
            id: 'NOT-003',
            type: 'Review',
            title: 'New Review Submitted',
            message: 'Sneha Kapoor left a 5-star review for Infinity Bracelet.',
            time: '2 hours ago',
            isRead: true,
            priority: 'Medium'
        },
        {
            id: 'NOT-004',
            type: 'User',
            title: 'New User Registered',
            message: 'Rahul Verma has just created an account.',
            time: '5 hours ago',
            isRead: true,
            priority: 'Low'
        }
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const typeIcons = {
        'Order': <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />,
        'Inventory': <AlertTriangle className="w-3.5 h-3.5 text-red-600" />,
        'Review': <Star className="w-3.5 h-3.5 text-amber-600" />,
        'User': <UserPlus className="w-3.5 h-3.5 text-green-600" />
    };

    const priorityStyles = {
        'Urgent': 'bg-red-50 text-red-600 border-red-100',
        'High': 'bg-orange-50 text-orange-600 border-orange-100',
        'Medium': 'bg-blue-50 text-blue-600 border-blue-100',
        'Low': 'bg-gray-50 text-gray-400 border-gray-100'
    };

    const stats = {
        total: notifications.length,
        unread: notifications.filter(n => !n.isRead).length,
        urgent: notifications.filter(n => n.priority === 'Urgent').length
    };

    return (
        <div className="space-y-3 animate-in fade-in duration-500 pb-10 font-outfit text-left">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-3 border border-black/5 rounded-none shadow-sm gap-3">
                <div>
                    <h1 className="text-lg font-black text-footerBg uppercase tracking-tighter leading-tight font-serif italic">Notification Registry</h1>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5 font-outfit">Control Hub for Real-Time Operational Alerts</p>
                </div>
                <button 
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-black text-white rounded-none text-[8px] font-black uppercase tracking-widest hover:bg-gold hover:text-black shadow-xl shadow-black/20 transition-all flex items-center gap-2 active:scale-95 group"
                >
                    <CheckCircle2 size={12} className="group-hover:scale-110 transition-transform" /> 
                    <span>Archive All Cycles</span>
                </button>
            </div>

            {/* Matrix Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <AdminStatsCard
                    label="TOTAL ALERTS"
                    value={stats.total.toString().padStart(2, '0')}
                    icon={Bell}
                    color="text-footerBg"
                    bgColor="bg-gray-50"
                />
                <AdminStatsCard
                    label="ACTIVE UNREAD"
                    value={stats.unread.toString().padStart(2, '0')}
                    icon={Info}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <AdminStatsCard
                    label="CRITICAL URGENT"
                    value={stats.urgent.toString().padStart(2, '0')}
                    icon={AlertTriangle}
                    color="text-red-600"
                    bgColor="bg-red-50"
                />
            </div>

            {/* Notifications Table */}
            <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-black/5">
                                <th className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest w-12 text-center font-outfit">Class</th>
                                <th className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest font-outfit">Chronology Details</th>
                                <th className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest w-20 font-outfit">Priority</th>
                                <th className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest w-24 font-outfit">Timestamp</th>
                                <th className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest w-20 text-center font-outfit">Protocol</th>
                                <th className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest w-20 text-right font-outfit">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 font-outfit">
                            {notifications.map((notif) => (
                                <tr
                                    key={notif.id}
                                    className={`group hover:bg-gray-50/80 transition-colors ${!notif.isRead ? 'bg-[#FDFBF7]' : ''}`}
                                >
                                    <td className="px-4 py-2 text-center align-middle">
                                        <div className="bg-white p-1.5 border border-black/5 inline-flex items-center justify-center shadow-sm">
                                            {typeIcons[notif.type]}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 align-middle">
                                        <div className="flex flex-col">
                                            <h4 className={`text-[10px] uppercase font-black tracking-tight ${!notif.isRead ? 'text-black' : 'text-gray-400'}`}>
                                                {notif.title}
                                            </h4>
                                            <p className="text-[9px] text-gray-400 leading-tight font-serif italic mt-0.5">
                                                {notif.message}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 align-middle">
                                        <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest border ${priorityStyles[notif.priority]}`}>
                                            {notif.priority}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 align-middle">
                                        <div className="flex items-center gap-1.5 text-[8px] font-black text-gray-400 uppercase tracking-widest tabular-nums">
                                            <Clock className="w-3 h-3" />
                                            <span>{notif.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-center align-middle">
                                        {notif.isRead ? (
                                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Archived</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-600 text-white text-[7px] font-black uppercase tracking-[0.2em] animate-pulse">
                                                LIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-right align-middle">
                                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!notif.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notif.id)}
                                                    className="p-1 px-2 border border-black/5 bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                    title="Archive"
                                                >
                                                    <Check size={10} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notif.id)}
                                                className="p-1 px-2 border border-black/5 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                title="Purge"
                                            >
                                                <Trash2 size={10} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {notifications.length === 0 && (
                    <div className="py-20 text-center bg-gray-50/30">
                        <div className="bg-white w-12 h-12 border border-black/5 flex items-center justify-center mx-auto mb-4 rotate-45">
                            <Bell className="w-6 h-6 text-gray-100 -rotate-45" />
                        </div>
                        <h3 className="text-black font-black text-[10px] uppercase tracking-[0.3em] mb-1">Matrix Clear</h3>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest italic">All administrative pulses archived</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;

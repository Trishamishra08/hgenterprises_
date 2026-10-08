import React, { useState } from 'react';
import { Send, MessageSquare, Users, Bell, ChevronRight, X, Sparkles } from 'lucide-react';

const AddNotification = () => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        audience: 'Send to All Users'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Notification Blast Sent Successfully!');
        setFormData({ title: '', message: '', audience: 'Send to All Users' });
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-20 font-outfit text-left max-w-[800px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 border border-black/5 rounded-none shadow-sm gap-4">
                <div>
                    <h1 className="text-xl font-black text-footerBg uppercase tracking-tighter leading-tight font-serif italic">Initialize Pulse Protocol</h1>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5 font-outfit">Deploy Real-Time Notifications to Global Registry</p>
                </div>
                <div className="p-2 bg-gray-50 border border-black/5 rounded-none">
                    <Sparkles className="w-4 h-4 text-gold" />
                </div>
            </div>

            <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-black/5 bg-[#FDF5F6]/30">
                    <h3 className="text-[10px] font-black text-black flex items-center gap-2 uppercase tracking-widest font-outfit">
                        <Send size={14} className="text-gold" /> Compose Strategic Message
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title Field */}
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Alert Headline</label>
                        <input
                            type="text"
                            placeholder="E.G. FLASH SALE LIVE..."
                            className="w-full p-2.5 bg-gray-50 border border-black/5 rounded-none text-[10px] font-black uppercase tracking-tight focus:outline-none focus:border-gold transition-all placeholder:text-gray-200"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* Message Field */}
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Technical Core Message</label>
                        <textarea
                            placeholder="Type your message here..."
                            className="w-full p-2.5 bg-gray-50 border border-black/5 rounded-none text-[10px] font-serif italic h-24 resize-none focus:outline-none focus:border-gold transition-all placeholder:text-gray-200 leading-relaxed"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        />
                    </div>

                    {/* Audience Field */}
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Deployment Target</label>
                        <div className="relative">
                            <select
                                className="w-full p-2.5 bg-gray-50 border border-black/5 rounded-none text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-gold transition-all appearance-none cursor-pointer"
                                value={formData.audience}
                                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                            >
                                <option>Send to All Users</option>
                                <option>Active Customers</option>
                                <option>Recent Registrations</option>
                            </select>
                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rotate-90 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Preview Box - High Density Geometric */}
                    <div className="p-4 bg-[#FDF5F6]/40 border border-black/5 rounded-none flex items-start gap-3">
                        <div className="w-8 h-8 rounded-none border border-black/5 bg-black flex items-center justify-center shrink-0 shadow-lg">
                            <Bell className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="space-y-1 min-w-0">
                            <p className="text-[9px] font-black text-black uppercase tracking-tight truncate">
                                {formData.title || "Headline Protocol Preview"}
                            </p>
                            <p className="text-[9px] text-gray-400 leading-tight font-serif italic truncate">
                                {formData.message || "Message core preview will appear in this sector..."}
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3.5 rounded-none font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gold hover:text-black shadow-xl shadow-black/20 transition-all active:scale-95 group"
                    >
                        <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        LAUNCH PROTOCOL BLAST
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddNotification;

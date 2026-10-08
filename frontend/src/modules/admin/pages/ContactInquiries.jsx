import React, { useState } from 'react';
import { Eye, Trash2, Mail, MessageSquare, Calendar, CheckCircle, Clock, Inbox, AlertCircle, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import AdminStatsCard from '../components/AdminStatsCard';

const ContactInquiries = () => {
    // Mock Data mimicking submissions from the Homepage "ChitChat" form
    const [inquiries, setInquiries] = useState([
        {
            id: 'INQ-1001',
            name: 'Anjali Gupta',
            email: 'anjali.g@example.com',
            message: 'Hi, I saw your heritage collection on Instagram. Do you ship to Dubai? I am very interested in purchasing a set for my wedding.',
            date: '2024-10-25T08:45:00',
            status: 'Unread'
        },
        {
            id: 'INQ-1002',
            name: 'Rohan Mehta',
            email: 'rohan.designs@example.com',
            message: 'I am a jewelry designer looking for collaboration opportunities. Who can I contact?',
            date: '2024-10-24T16:20:00',
            status: 'Read'
        },
        {
            id: 'INQ-1003',
            name: 'Sarah Jenkins',
            email: 'sarah.j@example.com',
            message: 'Is the "Moonlight Pendant" available in gold polish?',
            date: '2024-10-23T11:00:00',
            status: 'Read'
        },
        {
            id: 'INQ-1004',
            name: 'Vikram Singh',
            email: 'vikram.s@example.com',
            message: 'Do you have a physical store I can visit in Mumbai?',
            date: '2024-10-22T09:15:00',
            status: 'Unread'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedInquiry, setSelectedInquiry] = useState(null); // For Modal

    const handleDelete = (id) => {
        if (window.confirm('Delete this inquiry?')) {
            setInquiries(prev => prev.filter(i => i.id !== id));
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
    };

    const filteredInquiries = inquiries.filter(i => {
        const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const totalInquiries = inquiries.length;
    const unreadInquiries = inquiries.filter(i => i.status === 'Unread').length;
    const readInquiries = inquiries.filter(i => i.status === 'Read').length;

    const columns = [
        {
            header: 'Date',
            render: (item) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-black font-bold text-xs">
                        <Calendar className="w-3.5 h-3.5 text-[#3E2723]" />
                        <span>{new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'User',
            render: (item) => (
                <div>
                    <span className="text-sm font-bold text-black block">{item.name}</span>
                    <span className="text-xs text-gray-500 font-medium block">{item.email}</span>
                </div>
            )
        },
        {
            header: 'Status',
            align: 'center',
            render: (item) => (
                <select
                    value={item.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className={`text-[10px] font-bold uppercase tracking-wider bg-transparent border-none focus:ring-0 cursor-pointer ${item.status === 'Unread' ? 'text-red-700' : 'text-green-700'
                        }`}
                >
                    <option value="Unread">Unread</option>
                    <option value="Read">Read</option>
                </select>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            render: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => setSelectedInquiry(item)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#3E2723] hover:bg-[#3E2723]/5 rounded-lg transition-all"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Inquiry"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const filters = [
        {
            options: [
                { label: 'All', value: 'All' },
                { label: 'Unread', value: 'Unread' },
                { label: 'Read', value: 'Read' }
            ],
            onChange: (val) => setStatusFilter(val)
        }
    ];

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-10 font-outfit text-left">
            {/* Header Section */}
            <div className="bg-white p-4 border border-black/5 rounded-none shadow-sm">
                <h1 className="text-xl font-black text-footerBg uppercase tracking-tighter leading-tight">Inquiry Registry</h1>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Customer Correspondence & Lead Management</p>
            </div>

            {/* Matrix Console - High Density */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminStatsCard
                    label="TOTAL COMMUNICATIONS"
                    value={totalInquiries.toString().padStart(2, '0')}
                    icon={Inbox}
                    color="text-footerBg"
                    bgColor="bg-gray-50"
                />
                <AdminStatsCard
                    label="WAITING FOR RESPONSE"
                    value={unreadInquiries.toString().padStart(2, '0')}
                    icon={AlertCircle}
                    color="text-red-600"
                    bgColor="bg-red-50"
                />
                <AdminStatsCard
                    label="PROTOCOL COMPLETED"
                    value={readInquiries.toString().padStart(2, '0')}
                    icon={CheckCircle2}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
            </div>

            <DataTable
                columns={columns}
                data={filteredInquiries}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder="Search name, email, or message..."
                filters={filters}
            />

            {/* Inquiry View Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
                        {/* Header */}
                        <div className="bg-[#3E2723] px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 p-2 rounded-lg">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-white text-lg">Inquiry Details</h3>
                            </div>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* User Info */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#3E2723] flex items-center justify-center text-white text-lg font-bold shadow-md">
                                        {selectedInquiry.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">{selectedInquiry.name}</h2>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <Mail className="w-3.5 h-3.5" />
                                            <span>{selectedInquiry.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${selectedInquiry.status === 'Unread' ? 'text-red-700 bg-red-50 border-red-100' :
                                    'text-green-700 bg-green-50 border-green-100'
                                    }`}>
                                    {selectedInquiry.status}
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message Content</label>
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-sm text-gray-700 font-medium leading-relaxed">
                                    {selectedInquiry.message}
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 pt-2">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Received on {new Date(selectedInquiry.date).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all w-full md:w-auto"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactInquiries;

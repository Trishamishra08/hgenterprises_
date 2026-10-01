import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Download,
    Trash2,
    CheckCircle2,
    Clock,
    MessageSquare,
    Archive,
    Filter,
    MoreVertical
} from 'lucide-react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';
import Pagination from '../components/Pagination';
import AdminStatsCard from '../components/AdminStatsCard';

const SuggestionList = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const response = await api.get('/suggestions/admin/all');
            setSuggestions(response.data);
        } catch (error) {
            toast.error('Failed to fetch suggestions');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/suggestions/admin/${id}/status`, { status });
            toast.success(`Marked as ${status}`);
            fetchSuggestions();
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this suggestion?')) return;
        try {
            await api.delete(`/suggestions/admin/${id}`);
            toast.success('Deleted successfully');
            fetchSuggestions();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const filteredSuggestions = useMemo(() => {
        return suggestions.filter(s => {
            const matchesSearch =
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.message.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [suggestions, searchTerm, statusFilter]);

    const stats = {
        total: suggestions.length,
        new: suggestions.filter(s => s.status === 'New').length,
        read: suggestions.filter(s => s.status === 'Read').length
    };

    const totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);
    const paginatedItems = filteredSuggestions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-amber-100 text-amber-600';
            case 'Read': return 'bg-emerald-100 text-emerald-600';
            case 'Archived': return 'bg-gray-100 text-gray-500';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) return <div className="p-10 text-center">Loading suggestions...</div>;

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-10 text-left">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 border border-black/5 shadow-sm gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight uppercase">User Suggestions</h1>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Feedback and ideas from your customer registry</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchSuggestions} className="px-4 py-2 border border-gray-200 text-[8px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                        Refresh List
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminStatsCard
                    label="TOTAL SUGGESTIONS"
                    value={stats.total.toString().padStart(2, '0')}
                    icon={MessageSquare}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <AdminStatsCard
                    label="NEW FEEDBACK"
                    value={stats.new.toString().padStart(2, '0')}
                    icon={Clock}
                    color="text-amber-500"
                    bgColor="bg-amber-50"
                />
                <AdminStatsCard
                    label="REVIEWED"
                    value={stats.read.toString().padStart(2, '0')}
                    icon={CheckCircle2}
                    color="text-emerald-500"
                    bgColor="bg-emerald-50"
                />
            </div>

            {/* Controls */}
            <div className="bg-white p-3 border border-black/5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or message..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent text-[9px] font-black uppercase tracking-widest text-black outline-none focus:bg-white focus:border-black/10 transition-all"
                    />
                </div>
                <div className="flex bg-gray-50 p-1 border border-black/5 overflow-x-auto">
                    {['All', 'New', 'Read', 'Archived'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setStatusFilter(tab.toLowerCase() === 'all' ? 'all' : tab); setCurrentPage(1); }}
                            className={`px-6 py-2 text-[8px] font-black uppercase tracking-widest transition-all ${(statusFilter === tab || (tab === 'All' && statusFilter === 'all'))
                                    ? 'bg-white text-black shadow-sm border border-black/5'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">User Info</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Suggestion Message</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedItems.map((s) => (
                                <tr key={s._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-[10px] font-black text-black">
                                            {new Date(s.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">
                                            {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[10px] font-black text-black uppercase tracking-tight">{s.name}</div>
                                        <div className="text-[8px] text-gray-500 font-medium">{s.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-[10px] text-gray-600 font-medium leading-relaxed max-w-md line-clamp-2 italic">
                                            "{s.message}"
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 w-fit ${getStatusColor(s.status)}`}>
                                            <div className="w-1 h-1 rounded-full bg-current" />
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2">
                                            {s.status === 'New' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(s._id, 'Read')}
                                                    className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all rounded shadow-sm"
                                                    title="Mark as Read"
                                                >
                                                    <CheckCircle2 size={12} />
                                                </button>
                                            )}
                                            {s.status !== 'Archived' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(s._id, 'Archived')}
                                                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all rounded shadow-sm"
                                                    title="Archive"
                                                >
                                                    <Archive size={12} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(s._id)}
                                                className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded shadow-sm"
                                                title="Delete"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedItems.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400 uppercase text-[9px] font-black tracking-widest opacity-50">
                                        No suggestions found entry
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredSuggestions.length}
                itemsPerPage={itemsPerPage}
            />
        </div>
    );
};

export default SuggestionList;

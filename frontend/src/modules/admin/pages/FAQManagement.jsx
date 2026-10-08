import React, { useState } from 'react';
import {
    HelpCircle, Plus, Search, Filter,
    Edit3, Trash2, ChevronDown, ChevronUp,
    Save, X, GripVertical, CheckCircle2,
    LayoutGrid, List, MessageSquare, AlertCircle
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AdminStatsCard from '../components/AdminStatsCard';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const FAQManagement = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [formData, setFormData] = useState({
        category: 'Orders',
        question: '',
        answer: '',
        status: 'Active'
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['Orders', 'Returns', 'Payments', 'Shopping', 'General'];

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/faqs');
            setFaqs(res.data);
        } catch (error) {
            console.error('Failed to fetch FAQs:', error);
            toast.error('Failed to load help center registry');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchFaqs();
    }, []);

    const handleOpenModal = (faq = null) => {
        if (faq) {
            setEditingFaq(faq);
            setFormData({
                category: faq.category,
                question: faq.question,
                answer: faq.answer,
                status: faq.status
            });
        } else {
            setEditingFaq(null);
            setFormData({
                category: 'Orders',
                question: '',
                answer: '',
                status: 'Active'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingFaq) {
                await api.put(`/faqs/${editingFaq._id || editingFaq.id}`, formData);
                toast.success('Protocol updated successfully');
            } else {
                await api.post('/faqs', formData);
                toast.success('New registry committed');
            }
            fetchFaqs();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save FAQ:', error);
            toast.error('Failed to commit protocol');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this FAQ?')) {
            try {
                await api.delete(`/faqs/${id}`);
                toast.success('Registry deleted');
                fetchFaqs();
            } catch (error) {
                console.error('Failed to delete FAQ:', error);
                toast.error('Deletion protocol failed');
            }
        }
    };

    const filteredFaqs = faqs.filter(f => {
        const matchesSearch = f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // Stats
    const statsData = [
        { label: 'Total FAQs', value: faqs.length, icon: MessageSquare, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { label: 'Active', value: faqs.filter(f => f.status === 'Active').length, icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { label: 'Categories', value: categories.length, icon: LayoutGrid, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-4 animate-in fade-in duration-500 pb-10">
            {/* Header & Stats */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/5 pb-4">
                    <PageHeader
                        title="FAQ Management"
                        subtitle="Create and manage help center questions"
                    />
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-black text-white rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all active:scale-95 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add New FAQ
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {statsData.map((stat, index) => (
                        <AdminStatsCard
                            key={index}
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="bg-white p-2 rounded-none border border-black/5 shadow-sm flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                        <input
                            type="text"
                            placeholder="SEARCH QUESTIONS OR ANSWERS..."
                            className="w-full pl-12 pr-4 py-2 bg-[#FDF5F6] border-none rounded-none text-[10px] font-black tracking-widest text-black focus:outline-none placeholder:text-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories Tabs */}
                <div className="flex gap-1 overflow-x-auto scrollbar-hide bg-[#FDF5F6]/50 p-1">
                    {['All', ...categories].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex-1 px-4 py-2 rounded-none text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat
                                ? 'bg-black text-white shadow-sm'
                                : 'text-gray-400 hover:text-black hover:bg-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* FAQ List Cards */}
                <div className="grid grid-cols-1 gap-2">
                    {filteredFaqs.map((faq) => (
                        <div key={faq.id} className="bg-white rounded-none border border-black/5 shadow-sm hover:border-gold/30 transition-all group overflow-hidden">
                            <div className="p-3 flex flex-col md:flex-row gap-4 items-start">
                                {/* Content */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-none text-[7px] font-black uppercase tracking-widest border ${faq.status === 'Active'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-gray-50 text-gray-400 border-gray-100'
                                            }`}>
                                            {faq.status}
                                        </span>
                                        <span className="px-2 py-0.5 bg-amber-50 text-[#AD8E4F] border border-amber-100 rounded-none text-[7px] font-black uppercase tracking-widest">
                                            {faq.category}
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-black text-black leading-tight uppercase tracking-tight">
                                        {faq.question}
                                    </h3>

                                    <div className="bg-[#FDF5F6]/50 rounded-none p-2.5 border border-black/5">
                                        <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row md:flex-col items-center md:items-end gap-1.5 w-full md:w-auto shrink-0 md:pt-0">
                                    <button
                                        onClick={() => handleOpenModal(faq)}
                                        className="flex-1 md:flex-none w-full flex items-center justify-center gap-1.5 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-black bg-[#FDF5F6] hover:bg-gold hover:text-black rounded-none border border-black/5 transition-all"
                                    >
                                        <Edit3 className="w-3 h-3" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        className="flex-1 md:flex-none w-full flex items-center justify-center gap-1.5 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-none border border-red-100 transition-all"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredFaqs.length === 0 && (
                        <div className="py-20 text-center bg-white rounded-none border border-dashed border-black/10">
                            <div className="bg-[#FDF5F6] w-16 h-16 rounded-none flex items-center justify-center mx-auto mb-4 border border-black/5">
                                <Search className="w-6 h-6 text-gold" />
                            </div>
                            <h3 className="text-base font-serif font-black text-black uppercase tracking-tight">No results matched</h3>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                                Adjust filters or search criteria
                            </p>
                            <button
                                onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                                className="mt-4 text-gold font-black text-[10px] uppercase tracking-widest hover:underline"
                            >
                                Reset Dataset
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white rounded-none w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-black/10">

                        {/* Modal Header */}
                        <div className="bg-black p-4 flex items-center justify-between border-b border-white/10">
                            <div>
                                <h3 className="text-lg font-serif font-black text-white tracking-tight uppercase">
                                    {editingFaq ? 'Protocol Edit' : 'New Registry'}
                                </h3>
                                <p className="text-gold/60 text-[8px] font-black uppercase tracking-[0.2em] mt-1">FAQ Management Module</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 bg-white/5 hover:bg-white/10 text-white transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSave} className="p-6 space-y-4 bg-white">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 text-left">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Category</label>
                                    <div className="relative">
                                        <select
                                            className="w-full p-2.5 bg-[#FDF5F6] border border-black/5 rounded-none text-[10px] font-black text-black focus:border-gold outline-none appearance-none transition-all cursor-pointer uppercase tracking-widest"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gold pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-1.5 text-left">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Status</label>
                                    <div className="relative">
                                        <select
                                            className="w-full p-2.5 bg-[#FDF5F6] border border-black/5 rounded-none text-[10px] font-black text-black focus:border-gold outline-none appearance-none transition-all cursor-pointer uppercase tracking-widest"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gold pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5 text-left">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Question</label>
                                <input
                                    type="text"
                                    placeholder="ENTER QUESTION ARCHETYPE..."
                                    className="w-full p-2.5 bg-[#FDF5F6] border border-black/5 rounded-none text-[10px] font-black text-black placeholder:text-gray-300 focus:border-gold outline-none transition-all uppercase tracking-widest"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5 text-left">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Answer</label>
                                <textarea
                                    placeholder="SPECIFY RESOLUTION PROTOCOL..."
                                    className="w-full p-2.5 bg-[#FDF5F6] border border-black/5 rounded-none text-[11px] font-medium text-gray-900 placeholder:text-gray-300 focus:border-gold outline-none transition-all h-24 resize-none leading-relaxed"
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="pt-4 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3 bg-[#FDF5F6] hover:bg-gray-100 text-black border border-black/5 rounded-none text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-black hover:bg-gold hover:text-black text-white rounded-none text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Commit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FAQManagement;

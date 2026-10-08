import React, { useState, useEffect } from 'react';
import { Search, HelpCircle, ShoppingBag, Truck, CreditCard, RefreshCw, MessageCircle, ChevronRight, Phone, Mail, Clock, Send, Ticket, ArrowLeft, MapPin } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const SupportForm = ({ onCancel, initialOrder = '' }) => {
    const { createTicket } = useShop();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        subject: '',
        orderId: initialOrder,
        category: 'General',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createTicket({
            ...formData,
            userEmail: user?.email,
            userName: user?.name
        });
        onCancel(); // Return to FAQ/Main view
    };

    return (
        <div className="bg-white/80 backdrop-blur-md p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-white/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl md:text-3xl font-display font-bold text-black mb-6 tracking-tight">Create <span className="italic font-serif font-normal text-[#8B4356]">Support Ticket</span></h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2">Subject</label>
                        <input
                            required
                            type="text"
                            placeholder="Brief description of issue"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B4356]/30 focus:border-[#8B4356] transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2">Order ID (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. 1735123456"
                            value={formData.orderId}
                            onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                            className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B4356]/30 focus:border-[#8B4356] transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B4356]/30 focus:border-[#8B4356] transition-all"
                    >
                        <option>General Enquiry</option>
                        <option>Order Tracking</option>
                        <option>Payment Issue</option>
                        <option>Returns & Refunds</option>
                        <option>Product Feedback</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2">Detailed Message</label>
                    <textarea
                        required
                        rows="4"
                        placeholder="Please describe your problem in detail..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B4356]/30 focus:border-[#8B4356] resize-none transition-all"
                    ></textarea>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        type="submit"
                        className="flex-grow bg-[#8B4356] text-white py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-[#a64e66] transition-all shadow-lg text-sm"
                    >
                        <Send className="w-4 h-4" />
                        Submit Request
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-10 py-4 rounded-full border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-all text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

const HelpCenter = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { orders, showNotification } = useShop();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [view, setView] = useState('home');
    const [prefilledOrder, setPrefilledOrder] = useState('');

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/faqs');
            // Support only active FAQs for users
            setFaqs(res.data.filter(f => f.status === 'Active'));
        } catch (error) {
            console.error('Failed to fetch FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Smooth scroll to top when view changes (FAQ vs Support Form)
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [view]);

    useEffect(() => {
        fetchFaqs();
    }, []);

    // Handle incoming navigation with order context (from Order Details page)
    useEffect(() => {
        const stateData = window.history.state?.usr;
        if (stateData?.orderId) {
            const oid = stateData.orderId;
            setPrefilledOrder(oid.includes('-') ? oid.split('-')[1] : oid);
            setView('contact');
        }
    }, []);

    const categories = [
        { id: 'orders', icon: <ShoppingBag className="w-6 h-6" />, title: 'Orders', description: 'Tracking, shipping, and delivery details' },
        { id: 'payments', icon: <CreditCard className="w-6 h-6" />, title: 'Payments', description: 'Pricing, billing, and payment methods' },
        { id: 'returns', icon: <RefreshCw className="w-6 h-6" />, title: 'Returns & Refunds', description: 'Policies and process for returns' },
        { id: 'shopping', icon: <Truck className="w-6 h-6" />, title: 'Shopping', description: 'Product info, stock, and sizing' },
    ];

    const filteredFaqs = searchQuery
        ? faqs.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase()))
        : activeCategory === 'all'
            ? faqs
            : faqs.filter(f => f.category.toLowerCase() === activeCategory.toLowerCase());

    const handleNeedHelpWithOrder = (orderId) => {
        if (!user) {
            showNotification("Please login to create a support ticket.");
            return;
        }
        setPrefilledOrder(orderId.includes('-') ? orderId.split('-')[1] : orderId);
        setView('contact');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fdf2f8] via-[#eecad5] to-[#fdf2f8] font-body pb-10 md:pb-20 selection:bg-[#8B4356] selection:text-white relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-white/40 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[40%] right-[0%] w-[50%] h-[50%] bg-[#8B4356]/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Back Button */}
            <div className="container mx-auto px-4 pt-4 mb-2 relative z-20">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-black hover:text-[#8B4356] transition-all group font-bold uppercase tracking-[0.3em] text-[10px]"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
            </div>

            {/* Hero Section - Boutique Interior Styled */}
            <div className="py-8 md:py-16 px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-serif text-black tracking-tight leading-tight mb-10 md:mb-14">
                        How can we <span className="italic text-[#8B4356]">help you?</span>
                    </h1>
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Describe your inquiry..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/90 backdrop-blur-md border border-white/50 text-gray-900 rounded-full py-3.5 px-10 md:py-4 md:px-14 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4356]/30 focus:border-[#8B4356] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                {/* Category Grid - Floating Cards */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                setView('home');
                            }}
                            className={`p-5 md:p-8 rounded-[2.5rem] transition-all text-left group relative overflow-hidden ${activeCategory === cat.id && view === 'home' ? 'bg-[#2a2a2a] text-white shadow-2xl translate-y-[-4px]' : 'bg-white/40 backdrop-blur-md border border-white/50 text-black hover:bg-white hover:shadow-xl hover:-translate-y-1'}`}
                        >
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${activeCategory === cat.id && view === 'home' ? 'bg-[#8B4356] text-white scale-110 shadow-[0_0_20px_rgba(139,67,86,0.4)]' : 'bg-white shadow-sm text-[#8B4356] group-hover:bg-[#8B4356] group-hover:text-white group-hover:shadow-lg'}`}>
                                {cat.icon}
                            </div>
                            <h3 className="text-base md:text-lg font-normal font-serif tracking-tight mb-2 group-hover:text-[#8B4356] transition-colors">{cat.title}</h3>
                            <p className={`text-[11px] md:text-xs leading-relaxed hidden md:block font-serif ${activeCategory === cat.id && view === 'home' ? 'text-gray-300' : 'text-gray-500'}`}>{cat.description}</p>

                            {/* Status Accent */}
                            {activeCategory === cat.id && view === 'home' && (
                                <div className="absolute top-6 right-6 w-2 h-2 bg-[#8B4356] rounded-full animate-pulse"></div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        {view === 'home' ? (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                                <div className="flex justify-between items-end mb-6 md:mb-8 border-b border-black/5 pb-4">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-serif text-black tracking-tight">Handpicked Solutions</h2>
                                        <p className="text-[10px] md:text-xs font-serif italic text-gray-500">Most frequent inquiries and expert answers</p>
                                    </div>
                                    {activeCategory !== 'all' && (
                                        <button onClick={() => setActiveCategory('all')} className="text-[#8B4356] text-[10px] font-bold uppercase tracking-widest hover:text-black transition-colors underline pb-1">Reset</button>
                                    )}
                                </div>

                                <div className="space-y-4 md:space-y-5">
                                    {filteredFaqs.length > 0 ? (
                                        filteredFaqs.map((faq, idx) => (
                                            <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/40 overflow-hidden transition-all hover:bg-white hover:shadow-xl hover:border-[#8B4356]/30 group">
                                                <details className="group">
                                                    <summary className="flex items-center justify-between p-5 md:p-8 cursor-pointer list-none">
                                                        <h4 className="text-sm md:text-lg font-normal text-black pr-4 font-serif transition-all group-hover:text-[#8B4356]">{faq.question}</h4>
                                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all group-open:bg-[#8B4356] group-open:text-white group-open:rotate-90">
                                                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-open:text-white" />
                                                        </div>
                                                    </summary>
                                                    <div className="px-5 pb-5 md:px-8 md:pb-8 text-xs md:text-base text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-2 font-serif border-t border-gray-50 pt-6">
                                                        {faq.answer}
                                                    </div>
                                                </details>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-16 bg-white/40 backdrop-blur-md rounded-3xl border border-dashed border-gray-200">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Search className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-sm md:text-base text-gray-500 font-serif italic">No matching inquiries found in our archive.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <SupportForm
                                onCancel={() => {
                                    setView('home');
                                    setPrefilledOrder('');
                                }}
                                initialOrder={prefilledOrder}
                            />
                        )}
                    </div>

                    {/* Support Sidebar - Premium Dark Anchor */}
                    <div className="space-y-6 md:space-y-10">
                        {/* Contact Card - Luxury Dark Style */}
                        <div className="bg-[#0a0a0a] text-white p-6 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/5 group/card">
                            <div className="relative z-10">
                                <h3 className="text-2xl md:text-3xl font-serif mb-3 tracking-tight leading-tight">
                                    Need closer <br className="hidden md:block" />
                                    <span className="italic text-[#8B4356]">assistance?</span>
                                </h3>
                                <p className="text-zinc-400 mb-10 text-xs md:text-sm leading-relaxed font-serif">Our concierge is available daily to ensure your Harshad Gauri experience is essentially flawless.</p>

                                <div className="space-y-8">
                                    <button
                                        onClick={() => {
                                            if (!user) return showNotification("Please login to contact support.");
                                            setView('contact');
                                        }}
                                        className="w-full bg-[#8B4356] text-white py-4.5 rounded-full font-bold flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(139,67,86,0.2)] hover:shadow-[0_0_35px_rgba(139,67,86,0.5)] hover:bg-[#a64e66] hover:scale-[1.02] active:scale-95 text-sm md:text-base border border-transparent"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Contact Support
                                    </button>

                                    <div className="pt-2 space-y-6">
                                        <div className="flex items-center gap-4 group/item">
                                            <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover/item:border-[#8B4356]/40 group-hover/item:bg-[#8B4356]/10 transition-all duration-500">
                                                <Phone className="w-5 h-5 text-[#8B4356]" />
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">Priority Line</p>
                                                <p className="text-white text-sm font-medium tracking-wide">+91 90083 81564</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group/item">
                                            <div className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover/item:border-[#8B4356]/40 group-hover/item:bg-[#8B4356]/10 transition-all duration-500">
                                                <Mail className="w-5 h-5 text-[#8B4356]" />
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold">Direct Email</p>
                                                <p className="text-white text-sm font-medium tracking-wide">support@hgjewels.com</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Shard */}
                            <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-[#8B4356]/5 rounded-full blur-[70px] pointer-events-none"></div>
                        </div>

                        {/* Recent Orders - Designer Styled */}
                        {user && orders.length > 0 && (
                            <div className="bg-white/40 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-white/60 shadow-sm relative overflow-hidden group">
                                <h3 className="text-base md:text-xl font-bold text-black mb-6 flex items-center gap-3 font-display">
                                    <div className="w-2 h-2 bg-[#8B4356] rounded-full"></div>
                                    Recent Orders
                                </h3>
                                <div className="space-y-5 relative z-10">
                                    {orders.slice(0, 2).map((order) => {
                                        const oid = order.orderId || order._id || order.id || '';
                                        const displayId = oid.includes('-') ? oid.split('-')[1] : oid.slice(-8);
                                        return (
                                            <div
                                                key={oid}
                                                onClick={() => handleNeedHelpWithOrder(oid)}
                                                className="p-4 rounded-2xl bg-white border border-gray-100 group/order cursor-pointer hover:border-[#8B4356] hover:shadow-lg transition-all"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{displayId}</span>
                                                    <span className="text-[10px] font-bold text-[#8B4356] opacity-60 italic">{new Date(order.date || order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-xs text-gray-800 font-medium line-clamp-1 mb-3">{order.items[0]?.name || 'Unknown Product'}</p>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B4356] flex items-center gap-2 group-hover/order:translate-x-1 transition-transform">
                                                    Raise Ticket
                                                    <ChevronRight className="w-3 h-3" />
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Link to="/profile/orders" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-8 block text-center hover:text-black hover:tracking-[0.3em] transition-all">Archive Insight</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;

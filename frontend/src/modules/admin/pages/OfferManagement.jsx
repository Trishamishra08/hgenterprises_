import React, { useState, useEffect } from 'react';
import {
    Tag, Plus, Trash2, Eye, EyeOff,
    Clock, Link as LinkIcon, Edit3,
    Zap, Sparkles, Gift, Percent, X,
    ArrowRight, Loader2, Palette
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../utils/api';
import { useShop } from '../../../context/ShopContext';

const OfferManagement = () => {
    const { showNotification } = useShop();
    const [offers, setOffers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOffers();
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchOffers = async () => {
        try {
            const res = await api.get('/offers?adminView=true');
            setOffers(res.data);
        } catch (error) {
            console.error("Error fetching offers:", error);
            if (showNotification) showNotification("Failed to load offers.");
        } finally {
            setLoading(false);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        discount: '',
        description: '',
        tag: 'FLASH',
        expiry: '',
        color: 'bg-zinc-950',
        accent: 'text-gold',
        category: 'trending',
        path: '/shop?offers=true',
        isActive: true,
        icon: 'Zap',
        image: ''
    });

    const openAddModal = () => {
        setEditingOffer(null);
        setFormData({
            title: '',
            discount: '',
            description: '',
            tag: 'FLASH',
            expiry: '',
            color: 'bg-zinc-950',
            accent: 'text-gold',
            category: 'trending',
            path: '/shop?offers=true',
            isActive: true,
            icon: 'Zap',
            image: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (offer) => {
        setEditingOffer(offer._id);
        setFormData({
            ...offer,
            expiry: offer.expiry ? new Date(offer.expiry).toISOString().split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const handleSaveOffer = async (e) => {
        e.preventDefault();
        try {
            if (editingOffer) {
                const res = await api.put(`/offers/${editingOffer}`, formData);
                setOffers(offers.map(o => o._id === editingOffer ? res.data : o));
                if (showNotification) showNotification("Offer updated successfully!");
            } else {
                const res = await api.post('/offers', formData);
                setOffers([res.data, ...offers]);
                if (showNotification) showNotification("Offer created successfully!");
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving offer:", error);
            if (showNotification) showNotification("Failed to save offer.");
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const res = await api.put(`/offers/${id}`, { isActive: !currentStatus });
            setOffers(offers.map(o => o._id === id ? res.data : o));
            if (showNotification) showNotification("Status updated.");
        } catch (error) {
            if (showNotification) showNotification("Failed to update status.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this offer permanently?')) {
            try {
                await api.delete(`/offers/${id}`);
                setOffers(offers.filter(o => o._id !== id));
                if (showNotification) showNotification("Offer deleted.");
            } catch (error) {
                if (showNotification) showNotification("Failed to delete offer.");
            }
        }
    };

    const iconMap = { Zap, Sparkles, Gift, Tag, Percent };

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-20 font-outfit text-left">
            <div className="bg-white p-4 border border-black/5 rounded-none shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight leading-none uppercase">Offers Registry</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-2">Manage marketing campaigns & dynamic flash deals</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-xl active:scale-95 whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    <span>INITIALIZE NEW OFFER</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer) => (
                    <div key={offer._id} className={`relative rounded-[1.5rem] overflow-hidden ${offer.color} p-6 shadow-lg border border-white/5 flex flex-col group transition-all duration-500`}>
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className={`text-[8px] font-black tracking-[0.2em] uppercase px-2 py-0.5 bg-white/10 rounded-full border border-white/10 ${offer.accent}`}>
                                {offer.tag}
                            </span>
                        </div>

                        <div className="absolute top-4 right-4 flex gap-2">
                            <button onClick={() => openEditModal(offer)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"><Edit3 size={14} /></button>
                            <button onClick={() => handleDelete(offer._id)} className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-full text-white transition-all"><Trash2 size={14} /></button>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <div className="flex-grow">
                                <div className="mb-2">
                                    {(() => {
                                        const IconComp = iconMap[offer.icon] || Tag;
                                        return <IconComp className={`w-5 h-5 ${offer.accent}`} />;
                                    })()}
                                </div>
                                <h3 className="text-xl font-serif text-white mb-1 leading-tight">{offer.title}</h3>
                                <div className={`text-3xl font-black mb-3 italic ${offer.accent}`}>{offer.discount}</div>
                                <p className="text-white/40 text-[11px] font-serif leading-relaxed line-clamp-2">{offer.description}</p>
                            </div>

                            {offer.image && (
                                <div className="w-24 h-32 bg-white/5 rounded-2xl overflow-hidden shrink-0 border border-white/10 p-2 group-hover:bg-white/10 transition-all duration-500">
                                    <img src={offer.image} alt="" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            )}
                        </div>


                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/30 text-[9px] font-black uppercase tracking-widest">
                                <Clock size={12} />
                                {offer.expiry ? new Date(offer.expiry).toLocaleDateString() : 'NO EXPIRY'}
                            </div>
                            <button
                                onClick={() => toggleStatus(offer._id, offer.isActive)}
                                className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${offer.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
                            >
                                {offer.isActive ? 'ACTIVE' : 'PAUSED'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.98, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-none shadow-2xl overflow-hidden font-outfit"
                        >
                            <div className="p-4 border-b border-black/5 bg-[#FDF5F6] flex items-center justify-between">
                                <h2 className="text-sm font-black text-black uppercase tracking-widest">Configure Offer Strategy</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSaveOffer} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaign Title</label>
                                        <input
                                            className="w-full bg-[#FDF5F6] border-none px-4 py-3 text-xs font-bold uppercase tracking-widest"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount Figure</label>
                                        <input
                                            className="w-full bg-[#FDF5F6] border-none px-4 py-3 text-xs font-black italic text-gold"
                                            value={formData.discount}
                                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                            placeholder="E.G. 30% OFF or ₹5000 OFF"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Strategic Narrative</label>
                                    <textarea
                                        className="w-full bg-[#FDF5F6] border-none px-4 py-3 text-xs font-serif leading-relaxed h-20"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visual Badge</label>
                                        <input
                                            className="w-full bg-[#FDF5F6] border-none px-4 py-3 text-[10px] font-black uppercase tracking-widest"
                                            value={formData.tag}
                                            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Icon Symbol</label>
                                        <select
                                            className="w-full bg-[#FDF5F6] border-none px-4 py-3 text-[10px] font-black uppercase tracking-widest"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        >
                                            <option value="Zap">Zap</option>
                                            <option value="Sparkles">Sparkles</option>
                                            <option value="Gift">Gift</option>
                                            <option value="Tag">Tag</option>
                                            <option value="Percent">Percent</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tier Category</label>
                                        <select
                                            className="w-full bg-[#FDF5F6] border-none px-4 py-3 text-[10px] font-black uppercase tracking-widest"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="trending">Trending</option>
                                            <option value="limited">Limited Edition</option>
                                            <option value="all">Global Tier</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Color (Tailwind)</label>
                                        <input
                                            className="w-full bg-[#FDF5F6] border-none px-4 py-3 text-[10px] font-black tracking-widest"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            placeholder="bg-zinc-950"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accent Color (Tailwind)</label>
                                        <input
                                            className="w-full bg-[#FDF5F6] border-none px-4 py-3 text-[10px] font-black tracking-widest"
                                            value={formData.accent}
                                            onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                                            placeholder="text-gold"
                                        />
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Strategic Visual</label>
                                        <div className="flex items-center gap-4 p-4 bg-[#FDF5F6] border border-black/5">
                                            <div className="w-20 h-24 bg-white shrink-0 shadow-sm overflow-hidden flex items-center justify-center">
                                                {formData.image ? (
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                                                ) : (
                                                    <Palette className="w-6 h-6 text-gray-200" />
                                                )}
                                            </div>
                                            <div className="flex-grow space-y-2">
                                                <input
                                                    className="w-full bg-white border border-black/5 px-3 py-2 text-[10px] font-black tracking-widest"
                                                    value={formData.image}
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                    placeholder="URL will auto-populate"
                                                />
                                                <p className="text-[7px] text-gray-400 uppercase tracking-[0.2em] italic">The visual above will be deployed as the primary asset for this campaign.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry Timeline</label>
                                        <input
                                            type="date"
                                            className="w-full bg-[#FDF5F6] border-none px-4 py-3 text-xs font-bold"
                                            value={formData.expiry}
                                            onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Path (Manual or Select Product Below)</label>
                                        <input
                                            className="w-full bg-[#FDF5F6] border-none px-4 py-3 text-xs font-bold tracking-tight lowercase"
                                            value={formData.path}
                                            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                                            placeholder="/shop?offers=true or /product/ID"
                                        />

                                        <div className="mt-4 border border-black/5 p-4 bg-gray-50/50">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">Quick Selection: Products</p>
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                className="w-full bg-white border border-black/5 px-3 py-2 text-[10px] uppercase tracking-widest mb-2"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                                                {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                                                    <button
                                                        key={product._id}
                                                        type="button"
                                                        onClick={() => {
                                                            const imgUrl = product.images && product.images[0] ? (product.images[0].url || product.images[0]) : '';
                                                            setFormData({ ...formData, path: `/product/${product._id}`, image: imgUrl });
                                                        }}
                                                        className="w-full flex items-center gap-3 px-3 py-2 bg-white hover:bg-gold/10 text-[9px] font-bold uppercase tracking-tighter text-left border border-black/5 transition-all"
                                                    >
                                                        <div className="w-8 h-10 bg-gray-100 shrink-0 overflow-hidden border border-black/5">
                                                            {product.images && product.images[0] ? (
                                                                <img
                                                                    src={product.images[0].url || product.images[0]}
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[6px]">NO IMG</div>
                                                            )}
                                                        </div>
                                                        <span className="truncate flex-grow">{product.name}</span>
                                                        <span className="text-gold shrink-0">SELECT PATH</span>
                                                    </button>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, path: '/shop?offers=true' })}
                                                    className="w-full flex items-center justify-between px-3 py-2 bg-black text-white hover:bg-gold hover:text-black text-[9px] font-bold uppercase tracking-tighter text-left transition-all mt-4"
                                                >
                                                    <span className="truncate pr-2">Link To Shop (All Offers)</span>
                                                    <span className="shrink-0">DEFAULT</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-black/5"
                                    >
                                        ABORT
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-2 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gold hover:text-black transition-all shadow-2xl active:scale-95"
                                    >
                                        DEPLOY STRATEGY
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OfferManagement;

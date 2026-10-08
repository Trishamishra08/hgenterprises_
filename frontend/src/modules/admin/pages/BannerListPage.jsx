import React, { useState } from 'react';
import { useShop } from '../../../context/ShopContext';
import { Plus, Trash2, Edit2, Image as ImageIcon, X, ExternalLink, Layout, Monitor, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BannerListPage = () => {
    const { banners, addBanner, deleteBanner, updateBanner, getBannersBySection } = useShop();
    const [activeSection, setActiveSection] = useState('hero'); // 'hero' or 'promo'

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image: '',
        badgeText: '',
        ctaText: '',
        link: ''
    });

    const activeBanners = getBannersBySection(activeSection);

    const handleOpenModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title || '',
                subtitle: banner.subtitle || '',
                image: banner.image || '',
                badgeText: banner.badgeText || '',
                ctaText: banner.ctaText || '',
                link: banner.link || ''
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: '',
                subtitle: '',
                image: '',
                badgeText: '',
                ctaText: '',
                link: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const bannerData = {
            ...formData,
            section: activeSection
        };

        if (editingBanner) {
            updateBanner(editingBanner.id, bannerData);
        } else {
            addBanner(bannerData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this slide?')) {
            deleteBanner(id);
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500 font-outfit text-left pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-3 border border-black/5 rounded-none shadow-sm gap-4">
                <div>
                    <h1 className="text-xl font-black text-footerBg uppercase tracking-tighter leading-tight font-serif italic">Banner Registry</h1>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5 font-outfit">Manage Global Interface Sliders & Promotional Visuals</p>
                </div>
                <div className="flex p-1 bg-[#FDF5F6] border border-black/5 rounded-none">
                    <button
                        onClick={() => setActiveSection('hero')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-none text-[8px] font-black uppercase tracking-widest transition-all ${activeSection === 'hero'
                            ? 'bg-black text-white shadow-xl shadow-black/20'
                            : 'text-gray-400 hover:text-black hover:bg-white'
                            }`}
                    >
                        <Monitor size={12} />
                        Hero (Top)
                    </button>
                    <button
                        onClick={() => setActiveSection('promo')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-none text-[8px] font-black uppercase tracking-widest transition-all ${activeSection === 'promo'
                            ? 'bg-black text-white shadow-xl shadow-black/20'
                            : 'text-gray-400 hover:text-black hover:bg-white'
                            }`}
                    >
                        <Layout size={12} />
                        Promo (Bottom)
                    </button>
                </div>
            </div>

            {/* Banner List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Add New Protocol Card */}
                <button
                    onClick={() => handleOpenModal()}
                    className="group relative flex flex-col items-center justify-center h-[280px] bg-white border border-black/5 rounded-none hover:border-gold hover:bg-[#FDF5F6]/30 transition-all text-gray-300 hover:text-gold shadow-sm"
                >
                    <div className="w-12 h-12 rounded-none bg-white border border-black/5 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-90 transition-transform shadow-md">
                        <Plus size={20} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest font-outfit">Initialize New Slide</span>
                </button>

                {/* Banner Matrix Cards */}
                {activeBanners.map((banner) => (
                    <div key={banner.id} className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden flex flex-col group hover:border-gold/30 transition-all">
                        {/* Image Preview Area */}
                        <div className="relative h-32 w-full bg-gray-50 overflow-hidden">
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[0.2] group-hover:grayscale-0"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/600x400?text=Registry+Image+Missing';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            
                            {/* Actions Overlay */}
                            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenModal(banner)}
                                    className="p-1.5 bg-black/80 backdrop-blur-md text-white rounded-none hover:bg-gold hover:text-black transition-all border border-white/10"
                                >
                                    <Edit2 size={12} />
                                </button>
                                <button
                                    onClick={() => handleDelete(banner.id)}
                                    className="p-1.5 bg-red-600/80 backdrop-blur-md text-white rounded-none hover:bg-white hover:text-red-600 transition-all border border-white/10"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            
                            {banner.badgeText && (
                                <span className="absolute bottom-2 left-2 bg-gold text-black text-[7px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-none shadow-lg">
                                    {banner.badgeText}
                                </span>
                            )}
                        </div>

                        {/* Content Sector */}
                        <div className="p-4 flex-1 flex flex-col font-outfit">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">{banner.id}</span>
                                <div className="h-[1px] flex-1 bg-black/5"></div>
                            </div>
                            <h3 className="font-black text-black text-[11px] uppercase tracking-tight mb-1 line-clamp-1 group-hover:text-gold transition-colors">{banner.title}</h3>
                            <p className="text-gray-400 text-[9px] font-serif italic line-clamp-2 leading-relaxed mb-4 flex-1">
                                {banner.subtitle}
                            </p>

                            <div className="pt-3 border-t border-black/5 mt-auto flex items-center justify-between">
                                <span className="text-[8px] font-black text-black bg-[#FDF5F6] px-2 py-1 border border-black/5 rounded-none uppercase tracking-widest">
                                    {banner.ctaText}
                                </span>
                                {banner.link && (
                                    <span className="flex items-center gap-1.5 text-[8px] uppercase font-black text-gray-300 tracking-widest">
                                        LINK <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Matrix Creation/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.98, opacity: 0 }}
                            className="relative bg-white w-full max-w-lg rounded-none shadow-2xl overflow-hidden border border-black/10 font-outfit"
                        >
                            <div className="p-4 border-b border-black/5 bg-gray-50 flex items-center justify-between">
                                <h2 className="text-xs font-black text-black uppercase tracking-widest font-serif italic">
                                    {editingBanner ? 'Update Slide Protocol' : 'Initialize New Slide Protocol'}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1.5 hover:bg-gray-200 rounded-none transition-all text-gray-400 border border-transparent hover:border-black/5"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Visual Core Source</label>
                                        <div className="w-full h-28 bg-gray-50 border border-black/5 rounded-none overflow-hidden flex flex-col items-center justify-center text-gray-300 relative group transition-colors hover:border-gold/30 shadow-inner">
                                            {formData.image ? (
                                                <>
                                                    <img
                                                        src={formData.image}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://placehold.co/600x400?text=Invalid+Image+Source';
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, image: '' })}
                                                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 p-2">
                                                    <ImageIcon size={16} />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Select Visual Data or Paste URL</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setFormData({ ...formData, image: reader.result });
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <input
                                            type="url"
                                            value={formData.image.startsWith('data:') ? '' : formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="OR PASTE EXTERNAL CDN SOURCE URL..."
                                            className="w-full bg-gray-50 border border-black/5 rounded-none py-2 px-3 font-black text-[9px] uppercase tracking-widest outline-none focus:border-gold transition-all text-black placeholder:text-gray-200 mt-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Badge Nomenclature</label>
                                            <input
                                                type="text"
                                                value={formData.badgeText}
                                                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                                                placeholder="E.G. NEW ARRIVAL..."
                                                className="w-full bg-gray-50 border border-black/5 rounded-none px-3 py-2 text-[9px] font-black uppercase tracking-widest outline-none focus:border-gold transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">CTA Protocol</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.ctaText}
                                                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                                placeholder="E.G. SHOP NOW..."
                                                className="w-full bg-gray-50 border border-black/5 rounded-none px-3 py-2 text-[9px] font-black uppercase tracking-widest outline-none focus:border-gold transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Headline Strategy</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="E.G. SUMMER EXCLUSIVE SERIES..."
                                            className="w-full bg-gray-50 border border-black/5 rounded-none px-3 py-2 text-[10px] font-black uppercase tracking-tight outline-none focus:border-gold transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">Strategy Narrative</label>
                                        <textarea
                                            rows="2"
                                            required
                                            value={formData.subtitle}
                                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                            placeholder="E.G. ACCESS PREMIUM DESIGNS WITH OPTIMAL VALUATION..."
                                            className="w-full bg-gray-50 border border-black/5 rounded-none px-3 py-2 text-[10px] font-serif italic outline-none focus:border-gold transition-all resize-none leading-tight"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-3 rounded-none font-black text-[9px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-black/20 hover:bg-gold hover:text-black active:scale-95 flex items-center justify-center gap-3 group"
                                >
                                    <Sparkles size={12} className="group-hover:rotate-12 transition-transform" />
                                    {editingBanner ? 'UPDATE REGISTRY' : 'INITIALIZE PROTOCOL'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BannerListPage;

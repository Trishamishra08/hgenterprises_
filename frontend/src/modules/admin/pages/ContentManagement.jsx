import React, { useState, useEffect } from 'react';
import {
    Save, Info, Image as ImageIcon,
    Plus, Trash2, Edit3, Check
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

import { useShop } from '../../../context/ShopContext';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const ContentManagement = () => {
    const { settings, setSettings } = useShop();
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [aboutContent, setAboutContent] = useState({
        heroTitle: 'About Us',
        heroSubtitle: 'Welcome to Sands Ornaments, where elegance meets timeless tradition.',
        mainStory: 'Our journey began with a passion for bringing handcrafted 925 Sterling Silver pieces to the modern woman.',
        missionStatement: 'At Sands Ornaments, we are committed to sustainability and ethical sourcing.',
        images: [
            { id: 1, url: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516', label: 'Landscape' },
            { id: 2, url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a', label: 'Bracelet' },
            { id: 3, url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed', label: 'Necklace Wear' }
        ],
        features: [
            { id: 1, title: 'Free Shipping', description: 'Enjoy free and fast delivery on all orders above ₹2000.' },
            { id: 2, title: 'Premium Quality', description: 'Our jewellery is crafted with 100% authentic 925 Sterling Silver.' },
            { id: 3, title: 'Secure Checkout', description: 'Shop with confidence using our encrypted payment gateways.' }
        ],
        instagramImages: [
            { id: 1, url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705' },
            { id: 2, url: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a' },
            { id: 3, url: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584' },
            { id: 4, url: 'https://images.unsplash.com/photo-1615655114865-4cc1bda5901e' }
        ]
    });

    useEffect(() => {
        if (settings?.aboutContent) {
            setAboutContent(settings.aboutContent);
        }
    }, [settings]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await api.post('/settings', {
                ...settings,
                aboutContent
            });
            setSettings(res.data);
            toast.success("Content saved successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving content:", error);
            toast.error("Failed to save content.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFeatureChange = (id, field, value) => {
        const updatedFeatures = aboutContent.features.map(f => f.id === id ? { ...f, [field]: value } : f);
        setAboutContent({ ...aboutContent, features: updatedFeatures });
    };

    const handleImageChange = (section, id, newUrl) => {
        const updatedImages = aboutContent[section].map(img => img.id === id ? { ...img, url: newUrl } : img);
        setAboutContent({ ...aboutContent, [section]: updatedImages });
    };

    const addInstagramImage = () => {
        const newId = aboutContent.instagramImages.length + 1;
        setAboutContent({
            ...aboutContent,
            instagramImages: [...aboutContent.instagramImages, { id: newId, url: 'https://via.placeholder.com/400' }]
        });
    };

    const removeInstagramImage = (id) => {
        setAboutContent({
            ...aboutContent,
            instagramImages: aboutContent.instagramImages.filter(img => img.id !== id)
        });
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-2 animate-in fade-in duration-500 pb-6 font-sans">
            <PageHeader title="About Us Management" subtitle="Registry Control Node" backPath="/admin" />

            <div className="bg-white border border-black/5 shadow-sm">
                <div className="p-3 md:p-5 space-y-4 md:space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-black/5 pb-3">
                        <div>
                            <h3 className="text-lg font-serif font-black text-black uppercase tracking-tight">System Configuration</h3>
                            <p className="text-[7px] text-gray-400 font-black uppercase tracking-[0.2em]">Narrative Registry</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {isEditing ? (
                                <>
                                    <button onClick={() => setIsEditing(false)} disabled={isSaving} className="px-4 py-1.5 bg-[#FDF5F6] text-[9px] font-black uppercase tracking-widest text-black border border-black/5 hover:bg-gray-100 transition-all">Abort</button>
                                    <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1.5 px-4 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-sm">
                                        {isSaving ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                                        <span>{isSaving ? 'Committed' : 'Commit'}</span>
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-black/5 text-black text-[9px] font-black uppercase tracking-widest hover:bg-[#FDF5F6] transition-all shadow-sm">
                                    <Edit3 className="w-3.5 h-3.5 text-gold" />
                                    <span>Edit Section</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h3 className="text-[9px] font-black text-black uppercase tracking-widest border-l-2 border-gold pl-2.5">Hero Header</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-1 text-left">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                                    <input className="w-full p-2 bg-[#FDF5F6] border border-black/5 text-base font-serif font-black text-black focus:outline-none focus:border-gold disabled:opacity-50" value={aboutContent.heroTitle} onChange={(e) => setAboutContent({ ...aboutContent, heroTitle: e.target.value })} disabled={!isEditing} />
                                </div>
                                <div className="space-y-1 text-left">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Subtitle Abstract</label>
                                    <textarea className="w-full p-2 bg-[#FDF5F6] border border-black/5 text-[10px] font-medium text-gray-600 h-16 resize-none leading-tight tracking-tight focus:outline-none focus:border-gold disabled:opacity-50 uppercase" value={aboutContent.heroSubtitle} onChange={(e) => setAboutContent({ ...aboutContent, heroSubtitle: e.target.value })} disabled={!isEditing} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-[9px] font-black text-black uppercase tracking-widest border-l-2 border-gold pl-2.5">Core Narrative</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-1 text-left">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Main Storyline</label>
                                    <textarea className="w-full p-2 bg-[#FDF5F6] border border-black/5 text-[10px] font-medium text-gray-600 h-16 resize-none leading-tight tracking-tight focus:outline-none focus:border-gold disabled:opacity-50 uppercase" value={aboutContent.mainStory} onChange={(e) => setAboutContent({ ...aboutContent, mainStory: e.target.value })} disabled={!isEditing} />
                                </div>
                                <div className="space-y-1 text-left">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Mission Statement</label>
                                    <input className="w-full p-2 bg-[#FDF5F6] border border-black/5 text-[10px] font-black text-black focus:outline-none focus:border-gold disabled:opacity-50 uppercase tracking-tight" value={aboutContent.missionStatement} onChange={(e) => setAboutContent({ ...aboutContent, missionStatement: e.target.value })} disabled={!isEditing} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-black/5">
                        <h3 className="text-[9px] font-black text-black uppercase tracking-widest border-l-2 border-gold pl-2.5">Feature Nodes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {aboutContent.features.map((feature) => (
                                <div key={feature.id} className="bg-[#FDF5F6]/50 p-2 border border-black/5 space-y-1.5">
                                    <div className="space-y-1 text-left">
                                        <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Heading</label>
                                        <input className="w-full p-1.5 bg-white border border-black/5 text-[9px] font-black text-black focus:border-gold outline-none" value={feature.title} onChange={(e) => handleFeatureChange(feature.id, 'title', e.target.value)} disabled={!isEditing} />
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Abstract</label>
                                        <textarea className="w-full p-1.5 bg-white border border-black/5 text-[8px] text-gray-500 h-12 resize-none focus:border-gold outline-none uppercase leading-none" value={feature.description} onChange={(e) => handleFeatureChange(feature.id, 'description', e.target.value)} disabled={!isEditing} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-black/5 text-left">
                        <h3 className="text-[9px] font-black text-black uppercase tracking-widest border-l-2 border-gold pl-2.5">Media Dataset</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {aboutContent.images.map((img) => (
                                <div key={img.id} className="group relative overflow-hidden border border-black/5 shadow-sm aspect-video bg-gray-50">
                                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <button onClick={() => {
                                                const nu = prompt("URL:", img.url);
                                                if (nu) handleImageChange('images', img.id, nu);
                                            }} className="p-1.5 bg-white text-black hover:bg-gold"><Edit3 size={12} /></button>
                                        </div>
                                    )}
                                    <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/80 text-white text-[6px] font-black uppercase tracking-widest">{img.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-black/5 text-left">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[9px] font-black text-black uppercase tracking-widest border-l-2 border-gold pl-2.5">Social Registry</h3>
                            {isEditing && (
                                <button onClick={addInstagramImage} className="text-[8px] font-black text-gold hover:underline uppercase tracking-widest">+ Add entry</button>
                            )}
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                            {aboutContent.instagramImages.map((img) => (
                                <div key={img.id} className="group relative overflow-hidden border border-black/5 shadow-sm aspect-square bg-gray-50">
                                    <img src={img.url} alt="Instagram" className="w-full h-full object-cover" />
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1">
                                            <button onClick={() => {
                                                const nu = prompt("URL:", img.url);
                                                if (nu) handleImageChange('instagramImages', img.id, nu);
                                            }} className="p-1 bg-white text-black hover:bg-gold"><Edit3 size={10} /></button>
                                            <button onClick={() => removeInstagramImage(img.id)} className="p-1 bg-red-500 text-white hover:bg-red-600"><Trash2 size={10} /></button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;

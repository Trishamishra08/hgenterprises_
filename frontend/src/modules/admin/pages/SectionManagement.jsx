import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { ArrowLeft, Edit2, CheckCircle, Image as ImageIcon } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const SectionManagement = () => {
    const navigate = useNavigate();
    const { homepageSections } = useShop();

    return (
        <div className="min-h-screen bg-[#FDF5F6] flex flex-col">
            <div className="max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 p-4 md:p-6">
                <PageHeader
                    title="Homepage Sections"
                    subtitle="Manage content and layout of your homepage"
                    backPath="/admin"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.values(homepageSections || {})
                        .filter(section => section.id !== 'category-showcase')
                        .map(section => (
                            <div key={section.id} className="bg-white border border-black/5 rounded-none p-4 shadow-sm hover:border-gold/30 transition-all group">
                                <div className="flex items-start justify-between mb-3 text-left">
                                    <div className="h-8 w-8 rounded-none bg-[#FDF5F6] text-gold flex items-center justify-center border border-black/5">
                                        <ImageIcon size={16} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        Active
                                    </span>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-serif text-base font-black text-black mb-1 uppercase tracking-tight">{section.label}</h3>
                                    <p className="text-gray-400 text-[9px] font-black mb-4 line-clamp-1 uppercase tracking-[0.2em]">
                                        Configuration Node
                                    </p>

                                    <button
                                        onClick={() => navigate(`/admin/sections/${section.id}`)}
                                        className="w-full py-2 bg-black text-white font-black text-[9px] uppercase tracking-widest hover:bg-gold hover:text-black transition-all flex items-center justify-center gap-2 rounded-none"
                                    >
                                        <Edit2 size={12} /> Edit Content
                                    </button>
                                </div>
                            </div>
                        ))}

                    {/* Placeholder for future sections */}
                    {[].map((name, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-6 opacity-60">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
                                    <ImageIcon size={20} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-gray-200 text-gray-500">
                                    Coming Soon
                                </span>
                            </div>
                            <h3 className="font-display text-lg font-bold text-gray-400 mb-2">{name}</h3>
                            <p className="text-gray-400 text-sm mb-6">This section is not yet manageable.</p>
                            <button disabled className="w-full py-2.5 rounded-lg bg-gray-200 text-gray-400 font-bold text-xs cursor-not-allowed">
                                Manage
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SectionManagement;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../../utils/api';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { resolveCatalogImage, CATALOG } from '../data/catalogImages';

const getSubcategoryImage = (sub, catName) =>
    resolveCatalogImage(sub.image, `${catName || ''} ${sub.name || ''}`, catName);

const CollectionSubcategories = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await api.get(`/categories/${categoryId}`);
                const catData = res.data;
                setCategory(catData);
                
                // If there are no subcategories, redirect to shop with this category filter
                if (catData && (!catData.subcategories || catData.subcategories.length === 0)) {
                    const isTools = catData.name?.toLowerCase().includes('tool') || catData.id?.toLowerCase().includes('tool');
                    const isMachines = catData.name?.toLowerCase().includes('machine') || catData.id?.toLowerCase().includes('machine');
                    
                    if (!isTools && !isMachines) {
                        navigate(`/shop?category=${encodeURIComponent(catData.name)}`, { replace: true });
                    }
                }
            } catch (err) {
                console.error("Failed to load collection:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
        window.scrollTo(0, 0);
    }, [categoryId, navigate]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <p className="font-serif italic text-gray-400 animate-pulse tracking-[0.5em] uppercase text-xs">Initializing Collection...</p>
        </div>
    );

    if (!category) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="font-serif text-gray-500">Collection Not Found</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Elegant minimalist Back Button */}
            <div className="max-w-4xl mx-auto px-6 pt-6 flex justify-start">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-zinc-400 hover:text-black uppercase tracking-widest transition-all group"
                >
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span>Back</span>
                </button>
            </div>

            {/* Elegant Compact Header */}
            <header className="pt-3 pb-1 px-6 text-center border-b border-gray-100/80 max-w-4xl mx-auto">
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[8px] md:text-[9px] font-black tracking-[0.3em] uppercase text-gold mb-0.5"
                >
                    Discover The Edit
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-black lowercase tracking-tight mb-1"
                >
                    {category.name}
                </motion.h1>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 24 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="h-[1px] bg-gold/40 mx-auto"
                />
            </header>

            {/* Subcategory Grid - Compact & Elegant */}
            {(() => {
                let subcategoriesToRender = category.subcategories || [];
                const isToolsCategory = category.name?.toLowerCase().includes('tool') || category.id?.toLowerCase().includes('tool');
                const isMachinesCategory = category.name?.toLowerCase().includes('machine') || category.id?.toLowerCase().includes('machine');
                
                if (subcategoriesToRender.length === 0 && isToolsCategory) {
                    subcategoriesToRender = [
                        { name: "Measurement & Calibration", image: CATALOG.tools.measurement, path: "measurement" },
                        { name: "Precision Cutting & Piercing", image: CATALOG.tools.cutting, path: "cutting" },
                        { name: "Polishing & Refinement", image: CATALOG.tools.polishing, path: "polishing" },
                        { name: "Setting & Forging", image: CATALOG.tools.setting, path: "setting" }
                    ];
                } else if (subcategoriesToRender.length === 0 && isMachinesCategory) {
                    subcategoriesToRender = [
                        { name: "Laser Welding Systems", image: CATALOG.machines.laser, path: "laser-welding" },
                        { name: "Fiber Laser Engravers", image: CATALOG.machines.laser, path: "fiber-laser" },
                        { name: "Induction Casting Units", image: CATALOG.machines.casting, path: "induction-casting" },
                        { name: "3D Wax Printing", image: CATALOG.machines.printer, path: "3d-printing" }
                    ];
                }

                return (
                    <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 md:py-5">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                            {subcategoriesToRender && subcategoriesToRender.length > 0 ? (
                                subcategoriesToRender.filter(sub => sub.status !== 'Hidden').map((sub, idx) => {
                                    const imageUrl = getSubcategoryImage(sub, categoryId);
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group"
                                        >
                                            <Link to={`/shop?category=${category.name.toLowerCase()}&subcategory=${sub.name.toLowerCase()}`} className="block relative">
                                                {/* Premium Asymmetric Corner Image Container (Sharp on one side, rounded on the other) */}
                                                <div className="aspect-[4/5] overflow-hidden bg-gray-50 relative border border-gray-100/80 shadow-md rounded-tl-2xl rounded-br-2xl md:rounded-tl-[2.5rem] md:rounded-br-[2.5rem] rounded-tr-none rounded-bl-none transition-all duration-700 group-hover:shadow-2xl group-hover:scale-[1.01]">
                                                    <img
                                                        src={imageUrl}
                                                        alt={sub.name}
                                                        className="w-full h-full object-contain bg-white group-hover:scale-105 transition-all duration-700"
                                                        crossOrigin="anonymous"
                                                    />
                                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />

                                                    {/* Hover Overlay Text */}
                                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0">
                                                        <span className="text-white text-[8px] font-black tracking-[0.3em] uppercase">Show Collection</span>
                                                        <ChevronRight className="text-white w-3 h-3" />
                                                    </div>
                                                </div>

                                                {/* Minimalist Label */}
                                                <div className="mt-3 text-center">
                                                    <h3 className="font-serif text-base md:text-lg lg:text-xl text-black italic group-hover:text-gold transition-colors duration-500 lowercase underline-offset-8 decoration-gold/0 group-hover:decoration-gold/100 leading-tight">
                                                        {sub.name}
                                                    </h3>
                                                    <p className="mt-1 text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em]">Essential Curation</p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full py-16 text-center text-gray-300 font-serif italic text-xs tracking-widest uppercase">
                                    Architecture Pending Finalization
                                </div>
                            )}
                        </div>
                    </section>
                );
            })()}

            {/* Bottom Accent */}
            <div className="py-10 flex justify-center">
                <Link
                    to="/shop"
                    className="text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-[0.5em] transition-all border-b border-transparent hover:border-black pb-1"
                >
                    View All Masterpieces
                </Link>
            </div>
        </div>
    );
};

export default CollectionSubcategories;

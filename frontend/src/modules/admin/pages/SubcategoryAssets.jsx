import React, { useState, useEffect } from 'react';
import { Upload, ImageIcon, CheckCircle, AlertCircle, Search, Edit3, Plus, Trash2, X, ChevronDown } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import api from '../../../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SubcategoryAssets = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDept, setActiveDept] = useState('all');
    const [selectedCatId, setSelectedCatId] = useState('all');
    const [uploadingId, setUploadingId] = useState(null);

    // Modal State
    const [modal, setModal] = useState({
        isOpen: false,
        type: '',
        title: '',
        value: '',
        extraValue: '',
        targetId: null,
        oldName: ''
    });

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
            if (res.data.length > 0 && selectedCatId === 'all') {
                // Optionally auto-select first one, but 'all' is fine for overview
            }
        } catch (err) {
            toast.error("Failed to load hierarchy");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openModal = (type, title, targetId = null, oldName = '') => {
        setModal({
            isOpen: true,
            type,
            title,
            value: oldName,
            extraValue: activeDept === 'all' ? 'jewellery' : activeDept,
            targetId,
            oldName
        });
    };

    const closeModal = () => setModal({ ...modal, isOpen: false });

    const handleModalSubmit = async () => {
        const { type, value, extraValue, targetId, oldName } = modal;
        if (!value) return toast.error("Name is required");

        const tid = toast.loading("Processing...");
        try {
            if (type === 'category') {
                const id = value.toLowerCase().replace(/\s+/g, '-');
                await api.post('/categories', {
                    name: value,
                    id,
                    department: extraValue.toLowerCase(),
                    subcategories: [],
                    image: ''
                });
                toast.success("Category established", { id: tid });
            }
            else if (type === 'subnode') {
                const catRes = await api.get(`/categories/${targetId}`);
                const category = catRes.data;
                const newNode = {
                    name: value,
                    path: value.toLowerCase().replace(/\s+/g, '-'),
                    image: '',
                    status: 'Active'
                };
                const updatedSubs = [...(category.subcategories || []), newNode];
                await api.put(`/categories/${targetId}`, { subcategories: updatedSubs });
                toast.success("Node added", { id: tid });
            }
            else if (type === 'rename') {
                const catRes = await api.get(`/categories/${targetId}`);
                const category = catRes.data;
                const updatedSubs = category.subcategories.map(s =>
                    s.name === oldName ? { ...s, name: value, path: value.toLowerCase().replace(/\s+/g, '-') } : s
                );
                await api.put(`/categories/${targetId}`, { subcategories: updatedSubs });
                toast.success("Identity updated", { id: tid });
            }

            fetchCategories();
            closeModal();
        } catch (error) {
            toast.error("Execution failed", { id: tid });
        }
    };

    const handleImageUpload = async (catId, subName, file) => {
        const uploadKey = `${catId}-${subName}`;
        setUploadingId(uploadKey);
        const tid = toast.loading(`Uploading asset...`);

        try {
            const formData = new FormData();
            formData.append('image', file);
            const uploadRes = await api.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const imageUrl = uploadRes.data.imageUrl || uploadRes.data.url;

            const catRes = await api.get(`/categories/${catId}`);
            const category = catRes.data;
            const updatedSubs = category.subcategories.map(s =>
                s.name === subName ? { ...s, image: imageUrl } : s
            );
            await api.put(`/categories/${catId}`, { subcategories: updatedSubs });

            toast.success("Asset live", { id: tid });
            fetchCategories();
        } catch (error) {
            toast.error("Upload failed", { id: tid });
        } finally {
            setUploadingId(null);
        }
    };

    const handleDeleteSubNode = async (catId, subName) => {
        if (!window.confirm(`Delete sub-node "${subName}"?`)) return;
        const tid = toast.loading(`Deleting...`);
        try {
            const catRes = await api.get(`/categories/${catId}`);
            const category = catRes.data;
            const updatedSubs = (category.subcategories || []).filter(s => s.name !== subName);
            await api.put(`/categories/${catId}`, { subcategories: updatedSubs });
            toast.success("Node removed", { id: tid });
            fetchCategories();
        } catch (error) {
            toast.error("Deletion failed", { id: tid });
        }
    };

    const deptCategories = categories.filter(cat =>
        activeDept === 'all' || cat.department.toLowerCase() === activeDept.toLowerCase()
    );

    const activeCategory = selectedCatId === 'all'
        ? null
        : deptCategories.find(c => (c.id === selectedCatId || c._id === selectedCatId));

    const displayList = activeCategory ? [activeCategory] : deptCategories;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 font-outfit">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <PageHeader
                    title="VISUAL CONTENT ARCHITECTURE"
                    subtitle="Streamlined management for global taxonomies and assets"
                />
                <button
                    onClick={() => openModal('category', 'Create Main Category')}
                    className="px-6 py-3 bg-black text-gold border border-gold/30 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-gold hover:text-black transition-all active:scale-95"
                >
                    + Create Main Category
                </button>
            </div>

            {/* Department Navigation */}
            <div className="flex border-b border-black/5 overflow-x-auto scrollbar-hide bg-white shadow-sm">
                {['all', 'jewellery', 'machine', 'tools'].map(dept => (
                    <button
                        key={dept}
                        onClick={() => { setActiveDept(dept); setSelectedCatId('all'); }}
                        className={`px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] transition-all relative shrink-0 ${activeDept === dept ? 'text-black bg-gold/5' : 'text-gray-400 hover:text-black'
                            }`}
                    >
                        {dept}
                        {activeDept === dept && (
                            <motion.div layoutId="deptUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />
                        )}
                    </button>
                ))}
            </div>

            {/* Selection Dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 border border-black/5 shadow-md">
                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Jump to Classification</label>
                    <div className="relative group">
                        <select
                            value={selectedCatId}
                            onChange={(e) => setSelectedCatId(e.target.value)}
                            className="w-full appearance-none bg-[#FDF5F6] border border-black/5 p-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-gold transition-all cursor-pointer pr-10"
                        >
                            <option value="all">VIEW ALL CATEGORIES</option>
                            {deptCategories.map(cat => (
                                <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold group-hover:scale-110 transition-transform pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Hierarchy Visualization */}
            <div className="space-y-12">
                {displayList.map(cat => (
                    <div key={cat.id || cat._id} className="space-y-6">
                        <div className="flex items-center gap-4 bg-black text-white p-4 shadow-xl">
                            <div className="flex flex-col">
                                <span className="text-[7px] font-bold tracking-[0.4em] uppercase text-gold/60">{cat.department}</span>
                                <h2 className="font-serif font-black text-2xl uppercase tracking-tighter italic leading-none mt-1">{cat.name}</h2>
                            </div>
                            <div className="h-[1px] flex-1 bg-gold/10 mx-6"></div>
                            <button
                                onClick={() => openModal('subnode', `Add to ${cat.name}`, cat.id || cat._id)}
                                className="px-6 py-2 border border-gold/30 text-[9px] font-black uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-black transition-all shadow-lg flex items-center gap-2"
                            >
                                <Plus size={14} /> Add sub-node
                            </button>
                        </div>

                        {cat.subcategories && cat.subcategories.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {cat.subcategories.map((sub, idx) => {
                                    const uploadKey = `${cat.id || cat._id}-${sub.name}`;
                                    const isUploading = uploadingId === uploadKey;

                                    return (
                                        <div key={idx} className="bg-white border border-black/5 p-3 flex flex-col group hover:border-gold/30 transition-all shadow-sm">
                                            <div className="aspect-[3/4] bg-[#FDF5F6] border border-black/5 relative overflow-hidden flex items-center justify-center">
                                                {sub.image ? (
                                                    <img
                                                        src={sub.image}
                                                        alt={sub.name}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 opacity-20">
                                                        <ImageIcon className="w-8 h-8" />
                                                        <span className="text-[8px] font-black uppercase tracking-widest">No Asset</span>
                                                    </div>
                                                )}

                                                {isUploading && (
                                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                )}

                                                <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-all bg-black/40 flex items-center justify-center">
                                                    <div className="text-white flex flex-col items-center gap-2 scale-90 group-hover:scale-100 transition-transform">
                                                        <Upload className="w-6 h-6 text-gold" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Upload Image</span>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => e.target.files[0] && handleImageUpload(cat.id || cat._id, sub.name, e.target.files[0])}
                                                        disabled={isUploading}
                                                    />
                                                </label>
                                            </div>

                                            <div className="py-4 px-1 flex flex-col gap-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-black truncate pr-2">{sub.name}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => openModal('rename', 'Update Identity', cat.id || cat._id, sub.name)}
                                                            className="p-1.5 text-gray-300 hover:text-gold transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Edit3 className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteSubNode(cat.id || cat._id, sub.name)}
                                                            className="p-1.5 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                        {sub.image ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <AlertCircle className="w-3 h-3 text-orange-400" />}
                                                    </div>
                                                </div>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{sub.status || 'Active'}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-16 border border-dashed border-black/5 bg-white/50 flex flex-col items-center justify-center gap-3">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Empty Classification Subset</p>
                                <button
                                    onClick={() => openModal('subnode', `Add to ${cat.name}`, cat.id || cat._id)}
                                    className="text-[8px] font-black text-gold underline tracking-widest uppercase"
                                >
                                    Initialize First Node
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {displayList.length === 0 && !loading && (
                    <div className="py-40 text-center bg-white border border-dashed border-black/10">
                        <p className="font-serif italic text-gray-400 tracking-[0.4em] uppercase text-[10px]">No classification segments discovered</p>
                    </div>
                )}
            </div>

            {/* CUSTOM PREMIUM MODAL */}
            <AnimatePresence>
                {modal.isOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white w-full max-w-md relative z-10 border border-gold/10 shadow-2xl overflow-hidden"
                        >
                            <div className="bg-black p-6 flex justify-between items-center">
                                <div>
                                    <p className="text-[8px] font-black tracking-[0.4em] text-gold/60 uppercase mb-1">Architecture Entry</p>
                                    <h2 className="font-serif font-black text-white text-xl uppercase italic tracking-tight">{modal.title}</h2>
                                </div>
                                <button onClick={closeModal} className="text-white/30 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Node Designation</label>
                                    <input
                                        type="text"
                                        value={modal.value}
                                        onChange={(e) => setModal({ ...modal, value: e.target.value })}
                                        placeholder="Enter name..."
                                        autoFocus
                                        className="w-full bg-[#FDF5F6] border border-black/5 p-4 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-gold transition-all"
                                    />
                                </div>

                                {modal.type === 'category' && (
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Operational Domain</label>
                                        <select
                                            value={modal.extraValue}
                                            onChange={(e) => setModal({ ...modal, extraValue: e.target.value })}
                                            className="w-full bg-[#FDF5F6] border border-black/5 p-4 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-gold transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="jewellery">JEWELLERY DEPARTMENT</option>
                                            <option value="machine">MACHINES DEPARTMENT</option>
                                            <option value="tools">TOOLS DEPARTMENT</option>
                                        </select>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 py-4 border border-black/5 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleModalSubmit}
                                        className="flex-1 py-4 bg-black text-gold text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-gold hover:text-black transition-all transform active:scale-95"
                                    >
                                        Commit Entry
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubcategoryAssets;

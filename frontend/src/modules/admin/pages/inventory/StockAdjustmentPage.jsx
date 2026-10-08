import React, { useState, useEffect } from 'react';
import { Search, Save, RotateCcw, Plus, Minus, AlertCircle, CheckCircle2, Package } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import api from '../../../../utils/api';
import toast from 'react-hot-toast';

const StockAdjustmentPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [adjustments, setAdjustments] = useState({}); // { productId: adjustmentAmount }
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedDept, setSelectedDept] = useState('all');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products?adminView=true');
            const normalized = res.data.map(p => ({
                id: p._id || p.id,
                name: p.name,
                category: p.category,
                department: p.department || 'jewellery',
                stock: p.stock ?? (p.variants?.[0]?.stock) ?? 0,
                unit: p.unit || 'pcs',
                image: p.image || (p.images?.[0]) || 'https://via.placeholder.com/100'
            }));
            setProducts(normalized);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load inventory registry");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAdjustmentChange = (id, value) => {
        const val = parseInt(value) || 0;
        if (val === 0) {
            const newAdjustments = { ...adjustments };
            delete newAdjustments[id];
            setAdjustments(newAdjustments);
        } else {
            setAdjustments({ ...adjustments, [id]: val });
        }
    };

    const handleSave = async () => {
        if (Object.keys(adjustments).length === 0) return;

        setSaving(true);
        try {
            await api.patch('/products/admin/inventory/bulk-adjust', { adjustments });
            toast.success("Inventory reconciliation complete");
            await fetchProducts();
            setAdjustments({});
        } catch (error) {
            toast.error("Reconciliation failed");
        } finally {
            setSaving(false);
        }
    };

    const resetAdjustments = () => {
        setAdjustments({});
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === 'all' || p.department?.toLowerCase() === selectedDept.toLowerCase();
        return matchesSearch && matchesDept;
    });

    const pendingCount = Object.keys(adjustments).length;

    return (
        <div className="space-y-4 font-outfit pb-24 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 border border-black/5 rounded-none shadow-sm gap-4">
                <div>
                    <h1 className="text-xl font-black text-footerBg uppercase tracking-tighter leading-tight">Stock Adjustment</h1>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Manual Inventory Reconciliation Protocol</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={resetAdjustments}
                        disabled={pendingCount === 0 || saving}
                        className="px-3 py-2 bg-white border border-black/10 text-gray-400 rounded-none text-[9px] font-black uppercase tracking-widest hover:border-black hover:text-black hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        <RotateCcw size={12} /> <span>Reset Protocol</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={pendingCount === 0 || saving}
                        className="px-4 py-2 bg-black text-white rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-primary shadow-xl shadow-black/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={12} fill="currentColor" strokeWidth={2} />
                        )}
                        <span>Sync Changes</span>
                    </button>
                </div>
            </div>

            {/* Search Consol - High Density */}
            <div className="bg-white p-3 rounded-none border border-black/5 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4 sticky top-4 z-20">
                <div className="flex bg-gray-50 p-0.5 rounded-none w-full md:w-auto border border-black/5">
                    {['all', 'jewellery', 'tools', 'machines'].map((dept) => (
                        <button
                            key={dept}
                            onClick={() => setSelectedDept(dept)}
                            className={`px-4 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex-1 md:flex-none ${selectedDept === dept
                                ? 'bg-white text-footerBg shadow-sm border border-black/5'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                        type="text"
                        placeholder="SEARCH PRODUCT REGISTRY (NAME OR CATEGORY)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-none border border-transparent text-[9px] font-black uppercase tracking-widest text-footerBg outline-none focus:bg-white focus:border-black/10 transition-all placeholder:text-gray-400"
                    />
                </div>
                {pendingCount > 0 && (
                    <div className="px-3 py-1.5 bg-primary/5 text-primary rounded-none border border-primary/20 flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                        <span className="w-1 h-1 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]"></span>
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">{pendingCount} Staged</span>
                    </div>
                )}
            </div>

            {/* Adjustment Consol - Geometric Table */}
            <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-black/5">
                                <th className="px-6 py-5 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] w-[50%]">Inventory Asset</th>
                                <th className="px-6 py-5 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] text-center">Available Stock</th>
                                <th className="px-6 py-5 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] text-center">Adjustment (+/-)</th>
                                <th className="px-6 py-5 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] text-right">Final Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center font-serif italic text-gray-300 text-lg">Initializing registry...</td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center font-serif italic text-gray-300 text-lg">No assets matched your query.</td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const adjustment = adjustments[product.id] || 0;
                                    const finalStock = product.stock + adjustment;
                                    const isModified = adjustment !== 0;

                                    return (
                                        <tr key={product.id} className={`hover:bg-gray-50/80 transition-colors group ${isModified ? 'bg-primary/5' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-none border border-black/5 p-1 flex-shrink-0 transition-transform group-hover:scale-105">
                                                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-footerBg tracking-tight mb-1">{product.name}</p>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className={`text-2xl font-serif font-black ${product.stock === 0 ? 'text-red-500' : 'text-footerBg'}`}>
                                                        {product.stock.toString().padStart(2, '0')}
                                                    </span>
                                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{product.unit}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center justify-center relative group-adjustment">
                                                    <input
                                                        type="number"
                                                        value={adjustment === 0 ? '' : adjustment}
                                                        onChange={(e) => handleAdjustmentChange(product.id, e.target.value)}
                                                        placeholder="0"
                                                        className={`w-28 px-4 py-2.5 text-center rounded-none border text-lg font-serif font-black outline-none transition-all
                                                            ${adjustment > 0 ? 'bg-emerald-50 border-emerald-500/20 text-emerald-600 placeholder:text-emerald-300' : ''}
                                                            ${adjustment < 0 ? 'bg-red-50 border-red-500/20 text-red-600 placeholder:text-red-300' : ''}
                                                            ${adjustment === 0 ? 'bg-white border-black/5 text-footerBg placeholder:text-gray-100 focus:border-black/20' : ''}
                                                        `}
                                                    />
                                                    {adjustment > 0 && <span className="absolute left-3 text-emerald-500 font-black">+</span>}
                                                    {adjustment < 0 && <span className="absolute left-3 text-red-500 font-black">-</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <span className={`text-2xl font-serif font-black transition-all ${finalStock < 0 ? 'text-red-600' :
                                                        finalStock !== product.stock ? 'text-primary' : 'text-footerBg'
                                                        }`}>
                                                        {finalStock.toString().padStart(2, '0')}
                                                        <span className="text-[8px] ml-1 opacity-50">{product.unit}</span>
                                                    </span>
                                                    {isModified && (
                                                        <span className="text-[9px] font-black text-white bg-primary px-1.5 py-0.5 rounded-none uppercase tracking-tighter">FINAL</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Floating Review Consol */}
            {pendingCount > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-footerBg p-4 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex items-center gap-6 z-50 animate-in slide-in-from-bottom-6 border border-black/10 w-[90%] md:w-auto max-w-2xl">
                    <div className="flex items-center gap-4 border-r border-black/5 pr-6">
                        <div className="w-10 h-10 rounded-none bg-primary text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20">
                            {pendingCount.toString().padStart(2, '0')}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-footerBg">STAGED MODIFICATIONS</p>
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em]">Reconcile Batch Operations</p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-1 md:flex-initial">
                        <button
                            onClick={resetAdjustments}
                            className="px-4 py-2 border border-black/10 hover:border-black rounded-none text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all"
                        >
                            Wipe Protocol
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 bg-black text-white rounded-none text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-primary transition-all flex items-center gap-3 group"
                        >
                            <span>{saving ? 'RECOGNIZING...' : 'COMMIT RECONCILIATION'}</span>
                            <CheckCircle2 size={16} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockAdjustmentPage;

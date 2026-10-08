import React, { useState, useMemo } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    MoreVertical,
    Package,
    Tag as TagIcon,
    ArrowUpDown,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Copy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import Pagination from '../components/Pagination';
import AdminStatsCard from '../components/AdminStatsCard';

const ProductListPage = () => {
    const navigate = useNavigate();
    const { products, deleteProduct, updateProduct, bulkSetActive } = useShop();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredProducts = useMemo(() => {
        return products
            .filter(product => {
                const matchesSearch =
                    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.brand?.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesCategory = filterCategory === 'All' || product.category === filterCategory;

                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => (b.id?.localeCompare(a.id) || 0)); // Assuming higher ID is newer
    }, [products, searchTerm, filterCategory]);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const categories = ['All', ...new Set(products.map(p => p.category))];

    const getStockStatus = (variants) => {
        if (!variants || variants.length === 0) return { label: 'No Variants', color: 'text-gray-400 bg-gray-50' };
        const totalStock = variants.reduce((acc, v) => acc + (v.stock || 0), 0);
        const hasOutOfStock = variants.some(v => (v.stock || 0) === 0);

        if (totalStock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50 border-red-100' };
        if (hasOutOfStock) return { label: 'Partially In Stock', color: 'text-amber-600 bg-amber-50 border-amber-100' };
        return { label: 'In Stock', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    // Jewellery (gold/silver/diamond/platinum pieces) vs. Hand Tools / Laser Machines —
    // used for the BIS-compliance bulk hide/restore below.
    const isJewelleryCategory = (category) => !/tool|laser|machine/i.test(category || '');
    const jewelleryProducts = useMemo(() => products.filter(p => isJewelleryCategory(p.category)), [products]);
    const hiddenJewelleryCount = jewelleryProducts.filter(p => p.isActive === false).length;

    const handleHideJewellery = async () => {
        const liveIds = jewelleryProducts.filter(p => p.isActive !== false).map(p => p.id || p._id);
        if (liveIds.length === 0) return;
        if (!window.confirm(`Hide all ${liveIds.length} jewellery products from the storefront? Tools/Machines won't be affected. You can restore them anytime.`)) return;
        await bulkSetActive(liveIds, false);
    };

    const handleRestoreJewellery = async () => {
        const hiddenIds = jewelleryProducts.filter(p => p.isActive === false).map(p => p.id || p._id);
        if (hiddenIds.length === 0) return;
        if (!window.confirm(`Make all ${hiddenIds.length} hidden jewellery products live again?`)) return;
        await bulkSetActive(hiddenIds, true);
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-700 pb-8 text-left font-outfit">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <div>
                    <h1 className="text-xl md:text-2xl font-serif font-black text-black uppercase tracking-widest leading-none">Inventory Vault</h1>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1.5">Harshad Gauri enterprises • Product Catalog</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {hiddenJewelleryCount > 0 && (
                        <button
                            onClick={handleRestoreJewellery}
                            className="border border-emerald-600 text-emerald-700 px-4 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-50 transition-all active:scale-95"
                        >
                            <CheckCircle2 size={14} /> Restore Jewellery ({hiddenJewelleryCount})
                        </button>
                    )}
                    <button
                        onClick={handleHideJewellery}
                        title="Hides all jewellery (gold/silver/diamond/platinum) products from the storefront — e.g. pending BIS hallmark certification. Hand Tools / Laser Machines are not affected."
                        className="border border-red-600 text-red-700 px-4 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-50 transition-all active:scale-95"
                    >
                        <XCircle size={14} /> Hide Jewellery (No BIS)
                    </button>
                    <button
                        onClick={() => navigate('/admin/products/add')}
                        className="bg-black text-white px-5 py-2.5 rounded-none text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gold hover:text-black transition-all shadow-md active:scale-95"
                    >
                        <Plus size={14} /> Initialize Product
                    </button>
                </div>
            </div>

            {/* Stats Overview Gradient */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminStatsCard
                    label="Active SKUs"
                    value={products.reduce((acc, p) => acc + (p.variants?.length || 0), 0)}
                    icon={Package}
                />
                <AdminStatsCard
                    label="Live Assets"
                    value={products.filter(p => p.isActive !== false).length}
                    icon={CheckCircle2}
                />
                <AdminStatsCard
                    label="Low Stock Alert"
                    value={products.filter(p => p.variants?.some(v => (v.stock || 0) < 10)).length}
                    icon={AlertCircle}
                    badgeColor="text-red-600"
                />
            </div>

            {/* Advanced Filters Grid */}
            <div className="bg-white p-3 rounded-none border border-black/5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                        type="text"
                        placeholder="SEARCH INVENTORY..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#FDF5F6] border border-transparent rounded-none py-2 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-gold/30 transition-all font-serif"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-[#FDF5F6] border border-transparent text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-none outline-none focus:bg-white focus:border-gold/30 cursor-pointer font-serif italic"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat.replace(/-/g, ' ')}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Master Inventory Grid */}
            <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FDF5F6]/50 border-b border-black/5">
                            <tr>
                                <th className="px-6 py-4 text-[7px] font-serif font-black uppercase tracking-[0.4em] pr-2 text-black">Asset Detail</th>
                                <th className="px-6 py-4 text-[7px] font-serif font-black uppercase tracking-[0.4em] text-black">Ref/Category</th>
                                <th className="px-6 py-4 text-[7px] font-serif font-black uppercase tracking-[0.4em] text-black">Value</th>
                                <th className="px-6 py-4 text-[7px] font-serif font-black uppercase tracking-[0.4em] text-center text-black">Volume</th>
                                <th className="px-6 py-4 text-[7px] font-serif font-black uppercase tracking-[0.4em] text-center text-black">Visibility</th>
                                <th className="px-6 py-4 text-[7px] font-serif font-black uppercase tracking-[0.4em] text-right text-black">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 font-serif italic">
                            {paginatedProducts.map((product) => {
                                const status = getStockStatus(product.variants);
                                const bestVariant = product.variants?.[0];

                                return (
                                    <tr key={product.id} className="hover:bg-[#FDF5F6]/40 transition-colors group">
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#FDF5F6] rounded-none border border-black/5 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform">
                                                    <img src={product.image} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{product.brand}</p>
                                                    <p className="font-black text-black text-[11px] uppercase tracking-tight line-clamp-1">{product.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="px-1.5 py-0.5 bg-white text-[6px] font-black text-gold uppercase border border-gold/30 tracking-widest">{product.tag || 'EXCLUSIVE'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[10px] font-black text-black uppercase tracking-tight font-serif lowercase italic">{product.category}</p>
                                            <p className="text-[7px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">{product.subcategory}</p>
                                        </td>
                                        <td className="px-6 py-5 text-left">
                                            {bestVariant ? (
                                                <div className="space-y-0.5">
                                                    <p className="font-black text-black text-[11px] tabular-nums tracking-tighter">₹{bestVariant.price?.toLocaleString()}</p>
                                                    <p className="text-[8px] font-bold text-gray-400 line-through tabular-nums">₹{bestVariant.mrp?.toLocaleString()}</p>
                                                </div>
                                            ) : (
                                                <p className="text-[8px] font-black text-red-400 uppercase tracking-widest">Pricing Pending</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="text-[9px] font-black text-black tabular-nums border border-black/5 px-2 py-1 bg-[#FDF5F6]/50">
                                                {product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button
                                                onClick={() => {
                                                    const currentStatus = product.isActive !== false;
                                                    updateProduct(product.id, { isActive: !currentStatus });
                                                }}
                                                className={`relative inline-flex h-4 w-8 items-center rounded-none transition-all focus:outline-none ${product.isActive !== false ? 'bg-gold' : 'bg-gray-200'}`}
                                            >
                                                <span
                                                    className={`${product.isActive !== false ? 'translate-x-4' : 'translate-x-1'} inline-block h-2.5 w-2.5 transform rounded-none bg-white transition-transform shadow-sm`}
                                                />
                                            </button>
                                            <p className={`text-[6px] font-black mt-1 uppercase tracking-widest ${product.isActive !== false ? 'text-gold' : 'text-gray-400'}`}>
                                                {product.isActive !== false ? 'LIVE' : 'ARCHIVED'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                                    className="p-1.5 border border-black/5 hover:border-gold/50 transition-all text-black hover:text-gold bg-white"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1.5 border border-black/5 hover:border-red-400 transition-all text-black hover:text-red-500 bg-white"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-white border-t border-black/5">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        totalItems={filteredProducts.length}
                        itemsPerPage={itemsPerPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;

import React, { useState, useMemo } from 'react';
import { X, Search, Check, Filter } from 'lucide-react';
import { useShop } from '../../../../context/ShopContext';
import { PRODUCTS } from '../../../../mockData/data'; // Fallback / Mock Data

const ProductBrowserModal = ({ isOpen, onClose, onSelect, selectedIds = [], maxSelection = 1 }) => {
    if (!isOpen) return null;

    const { products } = useShop(); // Use context products (which includes admin updates) or fallback to mock
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [localSelectedIds, setLocalSelectedIds] = useState(selectedIds);

    // Combine context products with mock products if context is empty (just in case)
    const allProducts = products && products.length > 0 ? products : PRODUCTS;

    const categories = ['All', ...new Set(allProducts.map(p => p.category))];

    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, allProducts]);

    const toggleSelection = (product) => {
        setLocalSelectedIds(prev => {
            if (prev.includes(product.id)) {
                return prev.filter(id => id !== product.id);
            } else {
                // If maxSelection is 1, replace the current selection
                if (maxSelection === 1) {
                    return [product.id];
                }
                // Otherwise, add to selection
                return [...prev, product.id];
            }
        });
    };

    const handleConfirm = () => {
        // Find full product objects for selected IDs
        const selectedProducts = allProducts.filter(p => localSelectedIds.includes(p.id));

        // Transform to item format
        const items = selectedProducts.map(product => ({
            id: product.id,
            name: product.name,
            path: `/product/${product.id}`,
            image: product.image || product.images?.[0] || '',
            tag: product.discount || ''
        }));

        onSelect(items); // Pass array of items
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="font-display text-xl font-bold text-gray-800">Select Products</h3>
                        <p className="text-sm text-gray-500">Choose products to feature ({localSelectedIds.length} selected)</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex gap-4 shrink-0">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E2723]/20 focus:border-[#3E2723]"
                        />
                    </div>
                    <div className="relative min-w-[150px]">
                        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E2723]/20 focus:border-[#3E2723] appearance-none cursor-pointer bg-white"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Product List - Table View */}
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium sticky top-0 bg-gray-50 z-10">
                            <tr>
                                <th className="px-6 py-3 w-12 text-center">
                                    <div className="sr-only">Select</div>
                                </th>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map(product => {
                                const isSelected = localSelectedIds.includes(product.id);
                                const image = product.image || product.images?.[0]; // Handle different structures

                                return (
                                    <tr
                                        key={product.id}
                                        onClick={() => toggleSelection(product)}
                                        className={`
                                            group cursor-pointer transition-colors hover:bg-gray-50
                                            ${isSelected ? 'bg-[#3E2723]/5' : ''}
                                        `}
                                    >
                                        <td className="px-6 py-4 text-center">
                                            <div className={`
                                                w-5 h-5 rounded border flex items-center justify-center transition-all mx-auto
                                                ${isSelected
                                                    ? 'bg-[#3E2723] border-[#3E2723] text-white'
                                                    : 'border-gray-300 bg-white group-hover:border-[#3E2723]'
                                                }
                                            `}>
                                                {isSelected && <Check size={12} strokeWidth={3} />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 relative">
                                                    <img
                                                        src={image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 group-hover:text-[#3E2723] transition-colors">{product.name}</div>
                                                    {product.discount && (
                                                        <span className="inline-block mt-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">
                                                            {product.discount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <span className="px-2 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            {product.price ? `₹${product.price.toLocaleString()}` : '-'}
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-400">
                                        No products found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-white hover:shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-8 py-2.5 rounded-xl bg-[#3E2723] text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                        Add {localSelectedIds.length} Products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductBrowserModal;

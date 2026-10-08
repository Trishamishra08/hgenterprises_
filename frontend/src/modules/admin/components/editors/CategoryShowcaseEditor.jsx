import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Link as LinkIcon, Image as ImageIcon, Tag, Search, CheckCircle, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../common/FormControls';
import api from '../../../../utils/api';
import toast from 'react-hot-toast';
import ProductBrowserModal from './ProductBrowserModal';

// Import default assets
import catPendant from '../../../user/assets/cat_pendant_wine.png';
import catRing from '../../../user/assets/cat_ring_wine.png';
import catEarrings from '../../../user/assets/cat_earrings_wine.png';
import catBracelet from '../../../user/assets/cat_bracelet_wine.png';
import catAnklet from '../../../user/assets/cat_anklet_wine.png';
import catChain from '../../../user/assets/cat_chain_wine.png';

const CategoryShowcaseEditor = ({ sectionData, onSave, defaultItems = [] }) => {
    const navigate = useNavigate();
    const sectionId = sectionData?.id || 'category-showcase';

    // 1. Initial Items Logic (Allow empty items list if section exists)
    const initialItemsFromProps = sectionData.items
        ? sectionData.items
        : (defaultItems.length > 0 ? defaultItems : [
            { id: '1', name: 'Pendants', path: '/category/pendants', image: catPendant, tag: '' },
            { id: '2', name: 'Rings', path: '/category/rings', image: catRing, tag: '' },
            { id: '3', name: 'Earrings', path: '/category/earrings', image: catEarrings, tag: '' },
            { id: '4', name: 'Bracelets', path: '/category/bracelets', image: catBracelet, tag: '' },
            { id: '5', name: 'Anklets', path: '/category/anklets', image: catAnklet, tag: '' },
            { id: '6', name: 'Chains', path: '/category/chains', image: catChain, tag: '' }
        ]);

    const [items, setItems] = useState(initialItemsFromProps);
    const [editingId, setEditingId] = useState(null);
    const [uploadingId, setUploadingId] = useState(null);

    // Product Browser Modal State
    const [isProductBrowserOpen, setIsProductBrowserOpen] = useState(false);
    const [targetItemId, setTargetItemId] = useState(null);

    // Section Settings State
    const [sectionLabel, setSectionLabel] = useState(sectionData?.label || 'Latest Drops');
    const [sectionSubtitle, setSectionSubtitle] = useState(sectionData?.subtitle || 'Fresh Arrivals');

    const handleSaveMetadata = () => {
        onSave({ items, label: sectionLabel, subtitle: sectionSubtitle });
        toast.success("Section settings saved!");
    };

    // Update items if initial items are completely refreshed from the server
    useEffect(() => {
        setItems(initialItemsFromProps);
    }, [initialItemsFromProps]);

    const handleItemChange = (id, field, value) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                // If field is an index of extraImages, e.g., 'extraImage_0'
                if (field.startsWith('extraImage_')) {
                    const index = parseInt(field.split('_')[1]);
                    const newExtraImages = [...(item.extraImages || ['', '', ''])];
                    newExtraImages[index] = value;
                    return { ...item, extraImages: newExtraImages };
                }
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const handleImageUpload = async (id, file, field = 'image') => {
        if (!file) return;

        setUploadingId(`${id}_${field}`);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data } = await api.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            handleItemChange(id, field, data.url);
            toast.success('Media Synchronized');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Upload failed');
        } finally {
            setUploadingId(null);
        }
    };

    const removeItem = (id) => {
        const newItems = items.filter(item => item.id !== id);
        setItems(newItems);
        if (editingId === id) setEditingId(null);
        onSave({ items: newItems });
    };

    const handleOpenProductBrowser = (itemId = null) => {
        setTargetItemId(itemId);
        setIsProductBrowserOpen(true);
    };

    const moveItem = (index, direction) => {
        const newItems = [...items];
        const nextIndex = index + direction;
        if (nextIndex >= 0 && nextIndex < newItems.length) {
            [newItems[index], newItems[nextIndex]] = [newItems[nextIndex], newItems[index]];
            setItems(newItems);
            onSave({ items: newItems });
        }
    };

    // SPECIAL UI FOR LATEST DROP (Streamlined List + Add Button)
    if (sectionId === 'latest-drop') {
        return (
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
                {/* Section Settings (Dynamic Label & Subtitle) */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-display font-bold text-gray-800 text-lg">Section Settings</h3>
                        <button
                            onClick={handleSaveMetadata}
                            className="bg-[#3E2723] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#2a1a17] transition-all flex items-center gap-2"
                        >
                            <CheckCircle size={14} /> Save Settings
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Section Title"
                            value={sectionLabel}
                            onChange={(e) => setSectionLabel(e.target.value)}
                            placeholder="e.g. Latest Drops"
                        />
                        <Input
                            label="Section Subtitle"
                            value={sectionSubtitle}
                            onChange={(e) => setSectionSubtitle(e.target.value)}
                            placeholder="e.g. Fresh Arrivals"
                        />
                    </div>
                </div>

                {/* Simplified Header with Add Button */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm gap-4">
                    <div className="text-center md:text-left">
                        <h3 className="font-display font-bold text-gray-800 text-lg">Featured Products</h3>
                        <p className="text-xs text-gray-400">{items.length} products currently displayed</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleOpenProductBrowser()}
                        className="flex items-center justify-center gap-2 bg-[#722F37] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#5a252c] transition-all shadow-md active:scale-95"
                    >
                        <Plus size={18} /> Add New Product
                    </button>
                </div>

                {/* List View of Products */}
                <div className="grid grid-cols-1 gap-4">
                    {items.length === 0 ? (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl py-12 text-center">
                            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400 font-medium">No products added yet.</p>
                            <button
                                onClick={() => handleOpenProductBrowser()}
                                className="text-[#722F37] text-sm font-bold mt-2 hover:underline"
                            >
                                Click here to add your first product
                            </button>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between group hover:shadow-xl hover:border-[#722F37]/20 transition-all animate-in slide-in-from-left-4 duration-300"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="relative group/img">
                                        <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 shadow-inner">
                                            <img src={item.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        {item.tag && (
                                            <span className="absolute -top-2 -left-2 bg-gold text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-lg">
                                                {item.tag}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base group-hover:text-[#722F37] transition-colors">{item.name}</h4>
                                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                            {item.price && <span className="text-[11px] font-black text-[#722F37] bg-[#722F37]/5 px-2 py-0.5 rounded-md">{item.price}</span>}
                                            {item.productId && (
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                                    SKU: {item.productId.slice(-8)}
                                                </span>
                                            )}
                                            <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Live</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {/* Reordering Controls */}
                                    <div className="hidden md:flex flex-col mr-2">
                                        <button
                                            type="button"
                                            disabled={index === 0}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveItem(index, -1);
                                            }}
                                            className={`p-1 rounded-md transition-colors cursor-pointer ${index === 0 ? 'text-gray-200 pointer-events-none' : 'text-gray-400 hover:text-black hover:bg-gray-100'}`}
                                        >
                                            <ChevronUp size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            disabled={index === items.length - 1}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveItem(index, 1);
                                            }}
                                            className={`p-1 rounded-md transition-colors cursor-pointer ${index === items.length - 1 ? 'text-gray-200 pointer-events-none' : 'text-gray-400 hover:text-black hover:bg-gray-100'}`}
                                        >
                                            <ChevronDown size={14} />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenProductBrowser(item.id);
                                        }}
                                        className="p-3 text-gray-400 hover:text-[#722F37] hover:bg-[#722F37]/5 rounded-xl transition-all cursor-pointer z-10"
                                        title="Change Product"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeItem(item.id);
                                            toast.success('Product removed from section');
                                        }}
                                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer z-10"
                                        title="Remove"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <p className="text-center text-gray-400 text-[10px] uppercase tracking-[0.2em] pt-4">
                        End of featured curated list
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => {
                    const isEditing = editingId === item.id;

                    return (
                        <div key={item.id} className={`bg-white border rounded-xl p-4 shadow-sm relative group animate-in zoom-in-95 duration-200 transition-all ${isEditing ? 'border-[#3E2723] ring-1 ring-[#3E2723]' : 'border-gray-200 hover:shadow-md'}`}>

                            {/* Header: Item # + Edit/Save Button */}
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${isEditing ? 'bg-[#3E2723] text-white' : 'text-[#3E2723] bg-[#3E2723]/5'}`}>
                                    Item #{index + 1}
                                </span>
                                <div className="flex gap-2">
                                    {isEditing && (
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (isEditing) {
                                                onSave({ items });
                                            }
                                            setEditingId(isEditing ? null : item.id);
                                        }}
                                        className={`p-1.5 rounded-lg transition-colors ${isEditing ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                        title={isEditing ? "Save" : "Edit"}
                                    >
                                        {isEditing ? <CheckCircle size={16} /> : <Edit2 size={16} />}
                                    </button>
                                </div>
                            </div>

                            {isEditing ? (
                                /* EDIT MODE */
                                <div className="space-y-4">
                                    {/* Main Image */}
                                    <div className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative group/img">
                                        {item.image ? (
                                            <>
                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                <button onClick={() => handleItemChange(item.id, 'image', '')} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center p-4">
                                                {uploadingId === `${item.id}_image` ? (
                                                    <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
                                                ) : (
                                                    <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                )}
                                                <label className="cursor-pointer px-3 py-1.5 bg-[#3E2723] text-white text-xs font-bold rounded-lg block">
                                                    {uploadingId === `${item.id}_image` ? 'Syncing...' : 'Upload Main'}
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(item.id, e.target.files[0])} />
                                                </label>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-white/95 p-2 border-t border-gray-100">
                                            <Input placeholder="URL..." value={item.image} onChange={(e) => handleItemChange(item.id, 'image', e.target.value)} className="text-xs h-8" />
                                        </div>
                                    </div>

                                    {/* Select Product Button */}
                                    <button
                                        onClick={() => handleOpenProductBrowser(item.id)}
                                        className="w-full py-2 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center gap-2 uppercase tracking-widest"
                                    >
                                        <Search size={14} /> Product Link
                                    </button>

                                    <div className="space-y-3">
                                        <Input
                                            label={sectionId === 'style-it-your-way' ? "Title" : "Name"}
                                            value={item.name}
                                            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                            placeholder="Name"
                                        />
                                        <Input
                                            label={sectionId === 'style-it-your-way' ? "Subtitle" : "Badge"}
                                            value={item.tag}
                                            onChange={(e) => handleItemChange(item.id, 'tag', e.target.value)}
                                            placeholder="..."
                                        />

                                        {sectionId === 'style-it-your-way' && (
                                            <div className="pt-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">3 Mini Photos</label>
                                                <div className="flex gap-2">
                                                    {[0, 1, 2].map((i) => (
                                                        <div key={i} className="flex-1 aspect-square rounded-lg border border-dashed border-gray-300 relative group/mini overflow-hidden bg-gray-50">
                                                            {item.extraImages?.[i] ? (
                                                                <>
                                                                    <img src={item.extraImages[i]} className="w-full h-full object-cover" alt="" />
                                                                    <button onClick={() => handleItemChange(item.id, `extraImage_${i}`, '')} className="absolute inset-0 bg-red-500/20 opacity-0 group-hover/mini:opacity-100 flex items-center justify-center">
                                                                        <Trash2 size={12} className="text-white bg-red-500 p-1 rounded-full shadow-lg" />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <label className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-gray-100">
                                                                    {uploadingId === `${item.id}_extraImage_${i}` ? (
                                                                        <div className="w-3 h-3 border border-gold border-t-transparent rounded-full animate-spin"></div>
                                                                    ) : (
                                                                        <Plus size={14} className="text-gray-400" />
                                                                    )}
                                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(item.id, e.target.files[0], `extraImage_${i}`)} />
                                                                </label>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* VIEW MODE */
                                <div className="space-y-3 p-4">
                                    {sectionId === 'style-it-your-way' ? (
                                        <div className="space-y-4">
                                            <div className="aspect-[16/9] md:aspect-[4/3] rounded-xl bg-gray-100 overflow-hidden relative shadow-sm border border-gray-100">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                {(item.extraImages || ['', '', '']).map((img, i) => (
                                                    <div key={i} className="w-10 h-10 md:w-16 md:h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shadow-sm">
                                                        {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[#C9A24D] text-[10px] font-bold uppercase tracking-widest">{item.tag}</p>
                                                <h3 className="font-bold text-gray-800 text-sm md:text-base">{item.name}</h3>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden relative">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <ProductBrowserModal
                isOpen={isProductBrowserOpen}
                onClose={() => setIsProductBrowserOpen(false)}
                onSelect={(selectedProducts) => {
                    if (selectedProducts && selectedProducts.length > 0) {
                        const product = selectedProducts[0];
                        const newItemData = {
                            productId: product.id || product.productId, // ProductBrowserModal returns items format
                            name: product.name,
                            path: product.path || `/product/${product.id}`,
                            image: product.image || (product.images && product.images[0]) || '',
                            tag: product.tag || ''
                        };

                        let newItems;
                        if (targetItemId) {
                            newItems = items.map(item => item.id === targetItemId ? { ...item, ...newItemData } : item);
                        } else {
                            newItems = [...items, { id: Date.now().toString() + Math.random().toString(36).substr(2, 9), ...newItemData }];
                        }
                        setItems(newItems);
                        onSave({ items: newItems, label: sectionLabel, subtitle: sectionSubtitle });
                    }
                }}
            />
        </div>
    );
};

export default CategoryShowcaseEditor;

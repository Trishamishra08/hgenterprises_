import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Upload, X, Plus } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { FormSection, Input, Select } from '../components/common/FormControls';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../../utils/api';
import toast from 'react-hot-toast';
import { FILTER_CATEGORIES, MACHINE_FILTERS, TOOL_FILTERS } from '../../user/data/filterData';

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
    ],
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'link', 'image'
];

const ItemEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Dynamic Categories from Database
    const [dbCategories, setDbCategories] = useState([]);
    const [loadingCats, setLoadingCats] = useState(true);

    // Determine context
    const isCategory = location.pathname.includes('/categories');
    const isSubcategory = location.pathname.includes('/subcategories');
    const isProduct = location.pathname.includes('/products');
    const isViewMode = location.pathname.includes('/view/');

    const resourceType = isCategory ? 'Category' : (isSubcategory ? 'Subcategory' : 'Product');
    const backPath = isCategory ? '/admin/categories' : (isSubcategory ? '/admin/subcategories' : '/admin/products');

    const isEditMode = Boolean(id) && !isViewMode;

    const [formData, setFormData] = useState({
        name: '',
        parentId: '',
        department: 'jewellery',
        subCategoryId: '',
        description: '',
        stylingTips: '',
        showInCollection: true,
        showInNavbar: true,
        cardLabel: '',
        cardBadge: '',
        material: '925 Silver',
        specifications: '',
        supplierInfo: '',
        originalPrice: '',
        sellingPrice: '',
        discount: 0,
        stock: '',
        status: 'Active',
        images: [],
        sizes: [],
        variantStock: {},
        categories: [{ id: Date.now(), category: '', subcategory: '' }],
        targetGroup: 'Unisex',
        metal: 'Gold',
        offers: 'None',
        goldPurity: '18k',
        stones: 'None',
        occasion: 'Everyday Wear',
        numOfStones: 'Single Stone',
        design: 'Classic',
        stoneColor: 'White',
        zodiac: 'None',
        stoneShape: 'Round',
        collection: 'None',
        tanmaniya: 'None',
        characteristics: 'None',
        machineType: 'None',
        condition: 'New',
        country: 'India',
        operation: 'Automatic',
        horsepower: 'None',
        phase: 'None',
        brand: 'None',
        toolType: 'None',
        subTool: 'None',
        hoverImage: '',
        tags: {
            isNewArrival: false,
            isMostGifted: false,
            isNewLaunch: false
        }
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setDbCategories(res.data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoadingCats(false);
            }
        };

        const fetchResource = async () => {
            if (!isEditMode && !isViewMode) {
                const searchParams = new URLSearchParams(location.search);
                const dept = searchParams.get('department');
                if (dept) setFormData(prev => ({ ...prev, department: dept }));
                return;
            }

            try {
                const endpoint = isCategory ? `/categories/${id}` : (isSubcategory ? `/subcategories/${id}` : `/products/${id}`);
                const res = await api.get(endpoint);
                const data = res.data;

                const normalizedData = {
                    ...data,
                    parentId: data.parentId || '',
                    hoverImage: data.hoverImage || '',
                    images: data.images?.length > 0 ? data.images : (data.image ? [data.image] : []),
                    categories: data.categories?.length > 0 ? data.categories : [{
                        id: Date.now(),
                        category: data.category || '',
                        subcategory: data.subcategory || ''
                    }]
                };

                if (isProduct && data.variants?.length > 0) {
                    normalizedData.originalPrice = data.variants[0].mrp;
                    normalizedData.sellingPrice = data.variants[0].price;
                    normalizedData.stock = data.variants[0].stock;
                }

                setFormData(normalizedData);
            } catch (error) {
                console.error("Error fetching resource:", error);
                toast.error("Failed to load details");
            }
        };

        fetchCategories();
        fetchResource();
    }, [id, isEditMode, isViewMode, isCategory, isSubcategory, isProduct]);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        toast.loading('Uploading assets...', { id: 'upload' });
        try {
            const uploadedUrls = [];
            for (const file of files) {
                const formDataUpload = new FormData();
                formDataUpload.append('image', file);
                const res = await api.post('/upload/image', formDataUpload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedUrls.push(res.data.imageUrl || res.data.url);
            }
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls].slice(0, 5)
            }));
            toast.success('Assets uploaded successfully', { id: 'upload' });
        } catch (error) {
            console.error("Upload error:", error);
            toast.error('Failed to upload some assets', { id: 'upload' });
        }
    };

    const handleHoverImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        toast.loading('Uploading hover asset...', { id: 'hover-upload' });
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);
            const res = await api.post('/upload/image', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({
                ...prev,
                hoverImage: res.data.imageUrl || res.data.url
            }));
            toast.success('Hover asset uploaded successfully', { id: 'hover-upload' });
        } catch (error) {
            console.error("Hover upload error:", error);
            toast.error('Failed to upload hover asset', { id: 'hover-upload' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isCategory ? '/categories' : (isSubcategory ? '/subcategories' : '/products');

            let data = { ...formData };

            // Map simple fields to variant collection for Product schema compatibility
            if (isProduct) {
                data.variants = [{
                    name: 'Default',
                    mrp: Number(formData.originalPrice) || 0,
                    price: Number(formData.sellingPrice) || 0,
                    stock: Number(formData.stock) || 0,
                    sold: formData.variants?.[0]?.sold || 0
                }];
                data.image = formData.images[0] || '';
                data.hoverImage = formData.hoverImage || '';
                data.unit = formData.unit || 'pcs';

                // CRITICAL: Map selected category/subcategory for backend validation
                data.category = formData.categories[0]?.category;
                data.subcategory = formData.categories[0]?.subcategory;
                data.department = formData.department || 'jewellery';
                data.brand = formData.brand || 'HG JEWELS';

                // Clean up transient UI fields
                delete data.originalPrice;
                delete data.sellingPrice;
                delete data.stock;
                delete data.categories;
                if (typeof data.specifications === 'string') data.specifications = [];
            } else if (isCategory || isSubcategory) {
                // Categories and Subcategories use a single 'image' string field
                data.image = formData.images[0] || '';
                // Ensure ID is generated for new categories if not present
                if (!isEditMode && !data.id) {
                    data.id = data.name.toLowerCase().replace(/\s+/g, '-');
                }
            }

            if (isEditMode) {
                await api.put(`${endpoint}/${id}`, data);
                toast.success(`${resourceType} updated successfully`);
            } else {
                await api.post(endpoint, data);
                toast.success(`${resourceType} created successfully`);
            }
            navigate(backPath);
        } catch (error) {
            console.error("Error saving resource:", error);
            toast.error(`Error: ${error.response?.data?.message || 'Failed to save resource'}`);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const addCategory = () => {
        setFormData(prev => ({
            ...prev,
            categories: [...prev.categories, { id: Date.now(), category: '', subcategory: '' }]
        }));
    };

    const removeCategory = (id) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c.id !== id)
        }));
    };

    const handleCategoryChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.map(c => {
                if (c.id === id) {
                    if (field === 'category') {
                        return { ...c, category: value, subcategory: '' };
                    }
                    return { ...c, [field]: value };
                }
                return c;
            })
        }));
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
            <div className="max-w-[1500px] mx-auto w-full">
                <PageHeader
                    title={isViewMode ? `Overview: ${resourceType}` : (isEditMode ? `Edit: ${resourceType}` : `Create ${resourceType}`)}
                    subtitle={isViewMode ? `Detailed record for ${formData.name || id}` : (isEditMode ? `Ref: ${id || 'N/A'}` : `Initialize new ${resourceType.toLowerCase()} specifications`)}
                    backPath={backPath}
                    action={!isViewMode ? {
                        label: isEditMode ? 'Commit Changes' : `Finalize ${resourceType}`,
                        onClick: handleSubmit
                    } : undefined}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-4 space-y-6">
                        <FormSection title={isProduct ? "Visual Assets (Max 5)" : "Cover Asset"}>
                            <div className="grid grid-cols-2 gap-2">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-none overflow-hidden group border border-black/5 shadow-sm">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        {!isViewMode && (
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 p-1 bg-black text-white rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {!isViewMode && formData.images.length < (isProduct ? 5 : 1) && (
                                    <label className="aspect-square rounded-none bg-white border border-dashed border-black/10 flex flex-col items-center justify-center cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all group">
                                        <Upload className="w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                                        <span className="text-[8px] font-black text-gray-400 mt-2 uppercase tracking-widest font-serif italic">Upload Asset</span>
                                        <input type="file" multiple={isProduct} className="hidden" onChange={handleImageUpload} accept="image/*" disabled={isViewMode} />
                                    </label>
                                )}
                            </div>
                        </FormSection>

                        {isProduct && (
                            <FormSection title="Hover State Image (Secondary)">
                                <div className="grid grid-cols-1 gap-2">
                                    {formData.hoverImage ? (
                                        <div className="relative aspect-square rounded-none overflow-hidden group border border-black/5 shadow-sm w-full">
                                            <img src={formData.hoverImage} alt="Hover asset" className="w-full h-full object-cover" />
                                            {!isViewMode && (
                                                <button
                                                    onClick={() => setFormData(prev => ({ ...prev, hoverImage: '' }))}
                                                    className="absolute top-1 right-1 p-1 bg-black text-white rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <label className="aspect-square rounded-none bg-white border border-dashed border-black/10 flex flex-col items-center justify-center cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all group w-full">
                                            <Upload className="w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                                            <span className="text-[8px] font-black text-gray-400 mt-2 uppercase tracking-widest font-serif italic">Upload Hover Image</span>
                                            <input type="file" className="hidden" onChange={handleHoverImageUpload} accept="image/*" disabled={isViewMode} />
                                        </label>
                                    )}
                                </div>
                            </FormSection>
                        )}

                        {isProduct && (
                            <FormSection title="Specifications & Pricing" className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <Input
                                        label="Original Price (₹)"
                                        type="number"
                                        value={formData.originalPrice}
                                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                        disabled={isViewMode}
                                    />
                                    <Input
                                        label="Offer Price (₹)"
                                        type="number"
                                        value={formData.sellingPrice}
                                        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                                        disabled={isViewMode}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Stock Quantity"
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            disabled={isViewMode}
                                            placeholder="0"
                                        />
                                        <Select
                                            label="Unit"
                                            value={formData.unit || 'pcs'}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            options={[
                                                { label: 'Pieces (pcs)', value: 'pcs' },
                                                { label: 'Grams (g)', value: 'g' },
                                                { label: 'Kilograms (kg)', value: 'kg' },
                                                { label: 'Sets (set)', value: 'set' },
                                                { label: 'Meters (m)', value: 'm' }
                                            ]}
                                            disabled={isViewMode}
                                        />
                                    </div>
                                </div>
                            </FormSection>
                        )}
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <FormSection title="Core Information" className="space-y-6">
                            <Input
                                label={isCategory ? "Category Name" : (isSubcategory ? "Subcategory Name" : "Product Title")}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={isViewMode}
                            />

                            {isProduct && (
                                <div className="space-y-6">
                                    <Select
                                        label="Target Department"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        options={[
                                            { label: 'Jewellery', value: 'jewellery' },
                                            { label: 'Tools', value: 'tools' },
                                            { label: 'Machines', value: 'machines' }
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select
                                            label="Main Category"
                                            value={formData.categories?.[0]?.category || ''}
                                            onChange={(e) => handleCategoryChange(formData.categories?.[0]?.id, 'category', e.target.value)}
                                            options={[
                                                { label: 'Select Category', value: '' },
                                                ...dbCategories.map(cat => ({
                                                    label: cat.name.toUpperCase(),
                                                    value: cat.id
                                                }))
                                            ]}
                                            disabled={isViewMode || loadingCats}
                                        />
                                        <Select
                                            label="Sub-Category"
                                            value={formData.categories?.[0]?.subcategory || ''}
                                            onChange={(e) => handleCategoryChange(formData.categories?.[0]?.id, 'subcategory', e.target.value)}
                                            options={[
                                                { label: 'Select Sub-Category', value: '' },
                                                ...(dbCategories.find(c => c.id === formData.categories?.[0]?.category)?.subcategories || []).map(sub => ({
                                                    label: sub.name,
                                                    value: sub.name
                                                }))
                                            ]}
                                            disabled={isViewMode || !formData.categories?.[0]?.category || loadingCats}
                                        />
                                    </div>
                                    <Select
                                        label="Target Group"
                                        value={formData.targetGroup}
                                        onChange={(e) => setFormData({ ...formData, targetGroup: e.target.value })}
                                        options={[
                                            { label: 'Male', value: 'Male' },
                                            { label: 'Female', value: 'Female' },
                                            { label: 'Children', value: 'Children' },
                                            { label: 'Unisex', value: 'Unisex' }
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select
                                            label="Main Category"
                                            value={formData.categories?.[0]?.category || ''}
                                            onChange={(e) => handleCategoryChange(formData.categories?.[0]?.id, 'category', e.target.value)}
                                            options={[
                                                { label: 'Select Category', value: '' },
                                                ...Object.keys(CATEGORY_HIERARCHY).map(cat => ({
                                                    label: cat.toUpperCase(),
                                                    value: cat
                                                }))
                                            ]}
                                            disabled={isViewMode}
                                        />
                                        <Select
                                            label="Sub-Category"
                                            value={formData.categories?.[0]?.subcategory || ''}
                                            onChange={(e) => handleCategoryChange(formData.categories?.[0]?.id, 'subcategory', e.target.value)}
                                            options={[
                                                { label: 'Select Sub-Category', value: '' },
                                                ...(CATEGORY_HIERARCHY[formData.categories?.[0]?.category] || []).map(sub => ({
                                                    label: sub,
                                                    value: sub
                                                }))
                                            ]}
                                            disabled={isViewMode || !formData.categories[0]?.category}
                                        />
                                    </div>
                                </div>
                            )}

                            {isProduct && (
                                <FormSection title="Extended Categorization" className="grid grid-cols-2 gap-4">
                                    <Select
                                        label="Metal"
                                        value={formData.metal}
                                        onChange={(e) => setFormData({ ...formData, metal: e.target.value })}
                                        options={[
                                            { label: 'Select Metal', value: 'None' },
                                            ...FILTER_CATEGORIES.METAL.options.map(m => ({ label: m, value: m }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Gold Purity"
                                        value={formData.goldPurity}
                                        onChange={(e) => setFormData({ ...formData, goldPurity: e.target.value })}
                                        options={[
                                            { label: 'Select Purity', value: 'None' },
                                            ...FILTER_CATEGORIES.GOLD_PURITY.options.map(p => ({ label: p, value: p }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Offers"
                                        value={formData.offers}
                                        onChange={(e) => setFormData({ ...formData, offers: e.target.value })}
                                        options={[
                                            { label: 'Select Offer', value: 'None' },
                                            ...FILTER_CATEGORIES.OFFERS.options.map(o => ({ label: o, value: o }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Stones"
                                        value={formData.stones}
                                        onChange={(e) => setFormData({ ...formData, stones: e.target.value })}
                                        options={[
                                            { label: 'Select Stone', value: 'None' },
                                            ...FILTER_CATEGORIES.STONES.options.map(s => ({ label: s, value: s }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Occasion"
                                        value={formData.occasion}
                                        onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                                        options={[
                                            { label: 'Select Occasion', value: 'None' },
                                            ...FILTER_CATEGORIES.OCCASION.options.map(o => ({ label: o, value: o }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Number of Stones"
                                        value={formData.numOfStones}
                                        onChange={(e) => setFormData({ ...formData, numOfStones: e.target.value })}
                                        options={[
                                            { label: 'Select Number', value: 'None' },
                                            ...FILTER_CATEGORIES.NUM_OF_STONES.options.map(n => ({ label: n, value: n }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Design"
                                        value={formData.design}
                                        onChange={(e) => setFormData({ ...formData, design: e.target.value })}
                                        options={[
                                            { label: 'Select Design', value: 'None' },
                                            ...FILTER_CATEGORIES.DESIGN.options.map(d => ({ label: d, value: d }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Stone Color"
                                        value={formData.stoneColor}
                                        onChange={(e) => setFormData({ ...formData, stoneColor: e.target.value })}
                                        options={[
                                            { label: 'Select Color', value: 'None' },
                                            ...FILTER_CATEGORIES.STONE_COLOR.options.map(c => ({ label: c, value: c }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Zodiac"
                                        value={formData.zodiac}
                                        onChange={(e) => setFormData({ ...formData, zodiac: e.target.value })}
                                        options={[
                                            { label: 'Select Zodiac', value: 'None' },
                                            ...FILTER_CATEGORIES.ZODIAC.options.map(z => ({ label: z, value: z }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Stone Shape"
                                        value={formData.stoneShape}
                                        onChange={(e) => setFormData({ ...formData, stoneShape: e.target.value })}
                                        options={[
                                            { label: 'Select Shape', value: 'None' },
                                            ...FILTER_CATEGORIES.STONE_SHAPE.options.map(s => ({ label: s, value: s }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Collection"
                                        value={formData.collection}
                                        onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                                        options={[
                                            { label: 'Select Collection', value: 'None' },
                                            ...FILTER_CATEGORIES.COLLECTIONS.options.map(c => ({ label: c, value: c }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Tanmaniya"
                                        value={formData.tanmaniya}
                                        onChange={(e) => setFormData({ ...formData, tanmaniya: e.target.value })}
                                        options={[
                                            { label: 'Select Tanmaniya', value: 'None' },
                                            ...FILTER_CATEGORIES.TANMANIYA.options.map(t => ({ label: t, value: t }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Characteristics"
                                        value={formData.characteristics}
                                        onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
                                        options={[
                                            { label: 'Select Characteristics', value: 'None' },
                                            ...FILTER_CATEGORIES.CHARACTERISTICS.options.map(c => ({ label: c, value: c }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                </FormSection>
                            )}

                            {isProduct && formData.department === 'machines' && (
                                <FormSection title="Machine Specifications" className="grid grid-cols-2 gap-4">
                                    <Select
                                        label="Machine Type"
                                        value={formData.machineType}
                                        onChange={(e) => setFormData({ ...formData, machineType: e.target.value })}
                                        options={[
                                            { label: 'Select Machine Type', value: 'None' },
                                            ...MACHINE_FILTERS.MACHINE_TYPE.options.map(t => ({ label: t, value: t }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Condition"
                                        value={formData.condition}
                                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                        options={[
                                            { label: 'Select Condition', value: 'None' },
                                            ...MACHINE_FILTERS.CONDITION.options.map(c => ({ label: c, value: c }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Country of Origin"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        options={[
                                            { label: 'Select Country', value: 'None' },
                                            ...MACHINE_FILTERS.COUNTRY.options.map(c => ({ label: c, value: c }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Operation Mode"
                                        value={formData.operation}
                                        onChange={(e) => setFormData({ ...formData, operation: e.target.value })}
                                        options={[
                                            { label: 'Select Mode', value: 'None' },
                                            ...MACHINE_FILTERS.OPERATION.options.map(o => ({ label: o, value: o }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Horsepower"
                                        value={formData.horsepower}
                                        onChange={(e) => setFormData({ ...formData, horsepower: e.target.value })}
                                        options={[
                                            { label: 'Select HP', value: 'None' },
                                            ...MACHINE_FILTERS.HORSEPOWER.options.map(h => ({ label: h, value: h }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Electrical Phase"
                                        value={formData.phase}
                                        onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                                        options={[
                                            { label: 'Select Phase', value: 'None' },
                                            ...MACHINE_FILTERS.PHASE.options.map(p => ({ label: p, value: p }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Input
                                        label="Brand Name"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        disabled={isViewMode}
                                        placeholder="Enter brand name..."
                                    />
                                </FormSection>
                            )}

                            {isProduct && formData.department === 'tools' && (
                                <FormSection title="Tool Specifications" className="grid grid-cols-2 gap-4">
                                    <Select
                                        label="Tool Category"
                                        value={formData.toolType}
                                        onChange={(e) => setFormData({ ...formData, toolType: e.target.value })}
                                        options={[
                                            { label: 'Select Tool Category', value: 'None' },
                                            ...TOOL_FILTERS.TOOL_TYPE.options.map(t => ({ label: t, value: t }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Specific Tool"
                                        value={formData.subTool}
                                        onChange={(e) => setFormData({ ...formData, subTool: e.target.value })}
                                        options={[
                                            { label: 'Select Specific Tool', value: 'None' },
                                            ...TOOL_FILTERS.SUB_TOOLS.options.map(t => ({ label: t, value: t }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Tool Brand"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        options={[
                                            { label: 'Select Brand', value: 'None' },
                                            ...TOOL_FILTERS.BRANDS.options.map(b => ({ label: b, value: b }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <Select
                                        label="Country of Origin"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        options={[
                                            { label: 'Select Country', value: 'None' },
                                            ...TOOL_FILTERS.COUNTRY.options.map(c => ({ label: c, value: c }))
                                        ]}
                                        disabled={isViewMode}
                                    />
                                </FormSection>
                            )}

                            {isCategory && (
                                <Select
                                    label="Target Department"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    options={[
                                        { label: 'Jewellery', value: 'jewellery' },
                                        { label: 'Tools', value: 'tools' },
                                        { label: 'Machines', value: 'machines' }
                                    ]}
                                    disabled={isViewMode}
                                />
                            )}

                            {isCategory && (
                                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all flex-1 ${formData.showInCollection ? 'border-primary bg-primary/5' : 'border-gray-200'} ${isViewMode ? 'pointer-events-none' : ''}`}>
                                        <input type="checkbox" checked={formData.showInCollection} onChange={(e) => setFormData({ ...formData, showInCollection: e.target.checked })} className="w-4 h-4" />
                                        <span className="text-sm">Show in Collection</span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all flex-1 ${formData.showInNavbar ? 'border-primary bg-primary/5' : 'border-gray-200'} ${isViewMode ? 'pointer-events-none' : ''}`}>
                                        <input type="checkbox" checked={formData.showInNavbar} onChange={(e) => setFormData({ ...formData, showInNavbar: e.target.checked })} className="w-4 h-4" />
                                        <span className="text-sm">Show in Navbar</span>
                                    </label>
                                </div>
                            )}
                        </FormSection>

                        <FormSection title="Product Narrative">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description</label>
                                <ReactQuill theme="snow" value={formData.description} onChange={(val) => setFormData({ ...formData, description: val })} readOnly={isViewMode} modules={quillModules} formats={quillFormats} style={{ height: '200px', marginBottom: '50px' }} />
                            </div>
                        </FormSection>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemEditor;

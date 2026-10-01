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
import { MACHINE_FILTERS, TOOL_FILTERS } from '../../user/data/filterData';
import { emptyJewellery, parseTags } from '../../../utils/jewelleryDetails';
import ProductAttributesEditor from '../components/editors/ProductAttributesEditor';

const emptyDiamondRow = () => ({ count: '', shape: '', size: '', settingType: '' });

const defaultJewelleryDetails = () => {
    const base = emptyJewellery();
    return {
        ...base,
        diamondDetails: {
            ...base.diamondDetails,
            rows: [emptyDiamondRow()],
        },
    };
};

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
        jewelleryDetails: defaultJewelleryDetails(),
        attributeOptions: [],
        tagsInput: '',
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

                const jd = data.jewelleryDetails || {};
                const normalizedJd = {
                    ...defaultJewelleryDetails(),
                    ...jd,
                    productDetails: {
                        ...defaultJewelleryDetails().productDetails,
                        ...(jd.productDetails || {}),
                    },
                    diamondDetails: {
                        ...defaultJewelleryDetails().diamondDetails,
                        ...(jd.diamondDetails || {}),
                        rows:
                            Array.isArray(jd.diamondDetails?.rows) && jd.diamondDetails.rows.length > 0
                                ? jd.diamondDetails.rows.map((r) => ({
                                    count: r.count || '',
                                    shape: r.shape || '',
                                    size: r.size || '',
                                    settingType: r.settingType || '',
                                }))
                                : [emptyDiamondRow()],
                    },
                    metalDetails: {
                        ...defaultJewelleryDetails().metalDetails,
                        ...(jd.metalDetails || {}),
                    },
                    priceBreakup: {
                        ...defaultJewelleryDetails().priceBreakup,
                        ...(jd.priceBreakup || {}),
                    },
                    tags: Array.isArray(jd.tags) ? jd.tags : [],
                };

                const normalizedData = {
                    ...data,
                    parentId: data.parentId || '',
                    hoverImage: data.hoverImage || '',
                    department: data.department || 'jewellery',
                    images: data.images?.length > 0 ? data.images : (data.image ? [data.image] : []),
                    categories: data.categories?.length > 0 ? data.categories : [{
                        id: Date.now(),
                        category: data.category || '',
                        subcategory: data.subcategory || ''
                    }],
                    jewelleryDetails: normalizedJd,
                    attributeOptions: Array.isArray(data.attributeOptions) ? data.attributeOptions : [],
                    tagsInput: (normalizedJd.tags || []).join(', '),
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

                if (formData.department === 'jewellery') {
                    const jd = formData.jewelleryDetails || defaultJewelleryDetails();
                    const tagsFromInput = parseTags(formData.tagsInput);
                    const pb = jd.priceBreakup || {};
                    const gold = Number(pb.gold) || 0;
                    const diamond = Number(pb.diamond) || 0;
                    const makingCharge = Number(pb.makingCharge) || 0;
                    const gst = Number(pb.gst) || 0;
                    const total = Number(pb.total) || gold + diamond + makingCharge + gst;

                    data.jewelleryDetails = {
                        productDetails: {
                            productCode: jd.productDetails?.productCode || '',
                            height: jd.productDetails?.height || '',
                            width: jd.productDetails?.width || '',
                            productWeight: jd.productDetails?.productWeight || '',
                        },
                        diamondDetails: {
                            totalWeight: jd.diamondDetails?.totalWeight || '',
                            totalNoOfDiamonds: jd.diamondDetails?.totalNoOfDiamonds || '',
                            rows: (jd.diamondDetails?.rows || [])
                                .filter((r) => r.count || r.shape || r.size || r.settingType)
                                .map((r) => ({
                                    count: r.count || '',
                                    shape: r.shape || '',
                                    size: r.size || '',
                                    settingType: r.settingType || '',
                                })),
                        },
                        metalDetails: {
                            type: jd.metalDetails?.type || '',
                            weight: jd.metalDetails?.weight || '',
                        },
                        priceBreakup: { gold, diamond, makingCharge, gst, total },
                        tags: tagsFromInput.length ? tagsFromInput : (jd.tags || []),
                    };
                }

                // Clean up transient UI fields
                delete data.originalPrice;
                delete data.sellingPrice;
                delete data.stock;
                delete data.categories;
                delete data.tagsInput;
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

    const updateJewellery = (path, value) => {
        setFormData((prev) => {
            const jd = { ...(prev.jewelleryDetails || defaultJewelleryDetails()) };
            const parts = path.split('.');
            if (parts.length === 2) {
                const [section, key] = parts;
                jd[section] = { ...(jd[section] || {}), [key]: value };
            } else if (parts.length === 1) {
                jd[parts[0]] = value;
            }
            return { ...prev, jewelleryDetails: jd };
        });
    };

    const updateDiamondRow = (index, field, value) => {
        setFormData((prev) => {
            const jd = { ...(prev.jewelleryDetails || defaultJewelleryDetails()) };
            const rows = [...(jd.diamondDetails?.rows || [])];
            rows[index] = { ...(rows[index] || emptyDiamondRow()), [field]: value };
            jd.diamondDetails = { ...(jd.diamondDetails || {}), rows };
            return { ...prev, jewelleryDetails: jd };
        });
    };

    const addDiamondRow = () => {
        setFormData((prev) => {
            const jd = { ...(prev.jewelleryDetails || defaultJewelleryDetails()) };
            const rows = [...(jd.diamondDetails?.rows || []), emptyDiamondRow()];
            jd.diamondDetails = { ...(jd.diamondDetails || {}), rows };
            return { ...prev, jewelleryDetails: jd };
        });
    };

    const removeDiamondRow = (index) => {
        setFormData((prev) => {
            const jd = { ...(prev.jewelleryDetails || defaultJewelleryDetails()) };
            let rows = (jd.diamondDetails?.rows || []).filter((_, i) => i !== index);
            if (rows.length === 0) rows = [emptyDiamondRow()];
            jd.diamondDetails = { ...(jd.diamondDetails || {}), rows };
            return { ...prev, jewelleryDetails: jd };
        });
    };

    const updatePriceBreakup = (field, value) => {
        const num = value === '' ? '' : Number(value);
        setFormData((prev) => {
            const jd = { ...(prev.jewelleryDetails || defaultJewelleryDetails()) };
            const pb = { ...(jd.priceBreakup || {}) };
            pb[field] = num === '' || Number.isNaN(num) ? 0 : num;
            if (field !== 'total') {
                const gold = Number(field === 'gold' ? pb.gold : pb.gold) || 0;
                const diamond = Number(field === 'diamond' ? pb.diamond : pb.diamond) || 0;
                const making = Number(field === 'makingCharge' ? pb.makingCharge : pb.makingCharge) || 0;
                const gst = Number(field === 'gst' ? pb.gst : pb.gst) || 0;
                pb.total = gold + diamond + making + gst;
            }
            jd.priceBreakup = pb;
            return { ...prev, jewelleryDetails: jd };
        });
    };

    const jd = formData.jewelleryDetails || defaultJewelleryDetails();
    const isJewelleryDept = formData.department === 'jewellery';

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

                            {isProduct && isJewelleryDept && (
                                <>
                                    <FormSection title="Product Details" className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Product Code"
                                            value={jd.productDetails?.productCode || ''}
                                            onChange={(e) => updateJewellery('productDetails.productCode', e.target.value)}
                                            disabled={isViewMode}
                                            placeholder="e.g. 041481-9553555"
                                        />
                                        <Input
                                            label="Height"
                                            value={jd.productDetails?.height || ''}
                                            onChange={(e) => updateJewellery('productDetails.height', e.target.value)}
                                            disabled={isViewMode}
                                            placeholder="e.g. 19.28 mm"
                                        />
                                        <Input
                                            label="Width"
                                            value={jd.productDetails?.width || ''}
                                            onChange={(e) => updateJewellery('productDetails.width', e.target.value)}
                                            disabled={isViewMode}
                                            placeholder="e.g. 13.6 mm"
                                        />
                                        <Input
                                            label="Product Weight"
                                            value={jd.productDetails?.productWeight || ''}
                                            onChange={(e) => updateJewellery('productDetails.productWeight', e.target.value)}
                                            disabled={isViewMode}
                                            placeholder="e.g. 4.72 Gram"
                                        />
                                    </FormSection>

                                    <FormSection title="Diamond Details">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <Input
                                                label="Total Weight"
                                                value={jd.diamondDetails?.totalWeight || ''}
                                                onChange={(e) => updateJewellery('diamondDetails.totalWeight', e.target.value)}
                                                disabled={isViewMode}
                                                placeholder="e.g. 0.134 Ct"
                                            />
                                            <Input
                                                label="Total No. Of Diamonds"
                                                value={jd.diamondDetails?.totalNoOfDiamonds || ''}
                                                onChange={(e) => updateJewellery('diamondDetails.totalNoOfDiamonds', e.target.value)}
                                                disabled={isViewMode}
                                                placeholder="e.g. 21"
                                            />
                                        </div>
                                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                                                    <tr>
                                                        <th className="px-3 py-2 font-bold">Count</th>
                                                        <th className="px-3 py-2 font-bold">Shape</th>
                                                        <th className="px-3 py-2 font-bold">Size</th>
                                                        <th className="px-3 py-2 font-bold">Setting Type</th>
                                                        {!isViewMode && <th className="px-2 py-2 w-10" />}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(jd.diamondDetails?.rows || [emptyDiamondRow()]).map((row, idx) => (
                                                        <tr key={idx} className="border-t border-gray-100">
                                                            <td className="p-1.5">
                                                                <input
                                                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-primary"
                                                                    value={row.count}
                                                                    onChange={(e) => updateDiamondRow(idx, 'count', e.target.value)}
                                                                    disabled={isViewMode}
                                                                    placeholder="18"
                                                                />
                                                            </td>
                                                            <td className="p-1.5">
                                                                <input
                                                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-primary"
                                                                    value={row.shape}
                                                                    onChange={(e) => updateDiamondRow(idx, 'shape', e.target.value)}
                                                                    disabled={isViewMode}
                                                                    placeholder="Round"
                                                                />
                                                            </td>
                                                            <td className="p-1.5">
                                                                <input
                                                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-primary"
                                                                    value={row.size}
                                                                    onChange={(e) => updateDiamondRow(idx, 'size', e.target.value)}
                                                                    disabled={isViewMode}
                                                                    placeholder="1.1 mm"
                                                                />
                                                            </td>
                                                            <td className="p-1.5">
                                                                <input
                                                                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-primary"
                                                                    value={row.settingType}
                                                                    onChange={(e) => updateDiamondRow(idx, 'settingType', e.target.value)}
                                                                    disabled={isViewMode}
                                                                    placeholder="Plate Prong"
                                                                />
                                                            </td>
                                                            {!isViewMode && (
                                                                <td className="p-1.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeDiamondRow(idx)}
                                                                        className="p-1.5 text-gray-400 hover:text-red-500"
                                                                        title="Remove row"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {!isViewMode && (
                                            <button
                                                type="button"
                                                onClick={addDiamondRow}
                                                className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                            >
                                                <Plus size={14} /> Add diamond row
                                            </button>
                                        )}
                                    </FormSection>

                                    <FormSection title="Metal Details" className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Type"
                                            value={jd.metalDetails?.type || ''}
                                            onChange={(e) => updateJewellery('metalDetails.type', e.target.value)}
                                            disabled={isViewMode}
                                            placeholder="e.g. 18kt Gold"
                                        />
                                        <Input
                                            label="Weight"
                                            value={jd.metalDetails?.weight || ''}
                                            onChange={(e) => updateJewellery('metalDetails.weight', e.target.value)}
                                            disabled={isViewMode}
                                            placeholder="e.g. 4.7 gram"
                                        />
                                    </FormSection>

                                    <FormSection title="Price Breakup" className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Gold (₹)"
                                            type="number"
                                            value={jd.priceBreakup?.gold ?? ''}
                                            onChange={(e) => updatePriceBreakup('gold', e.target.value)}
                                            disabled={isViewMode}
                                            placeholder="55590"
                                        />
                                        <Input
                                            label="Diamond (₹)"
                                            type="number"
                                            value={jd.priceBreakup?.diamond ?? ''}
                                            onChange={(e) => updatePriceBreakup('diamond', e.target.value)}
                                            disabled={isViewMode}
                                            placeholder="16657"
                                        />
                                        <Input
                                            label="Making Charge (₹)"
                                            type="number"
                                            value={jd.priceBreakup?.makingCharge ?? ''}
                                            onChange={(e) => updatePriceBreakup('makingCharge', e.target.value)}
                                            disabled={isViewMode}
                                            placeholder="25571"
                                        />
                                        <Input
                                            label="GST (₹)"
                                            type="number"
                                            value={jd.priceBreakup?.gst ?? ''}
                                            onChange={(e) => updatePriceBreakup('gst', e.target.value)}
                                            disabled={isViewMode}
                                            placeholder="2935"
                                        />
                                        <Input
                                            label="Total (₹)"
                                            type="number"
                                            value={jd.priceBreakup?.total ?? ''}
                                            onChange={(e) => updatePriceBreakup('total', e.target.value)}
                                            disabled={isViewMode}
                                            placeholder="100753"
                                        />
                                    </FormSection>

                                    <FormSection title="Tags">
                                        <Input
                                            label="Search tags (comma separated)"
                                            value={formData.tagsInput || ''}
                                            onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                                            disabled={isViewMode}
                                            placeholder="White Rings, 18k Rings, Diamond Rings, ..."
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            These appear as the Tags cloud on the product page.
                                        </p>
                                    </FormSection>
                                </>
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

                        {isProduct && (
                            <FormSection title="Colours, Sizes & Other Attributes">
                                <ProductAttributesEditor
                                    value={formData.attributeOptions}
                                    onChange={(attributeOptions) => setFormData((prev) => ({ ...prev, attributeOptions }))}
                                    department={formData.department}
                                    disabled={isViewMode}
                                />
                            </FormSection>
                        )}

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

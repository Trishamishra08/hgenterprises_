import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Save,
    Info,
    CheckCircle2,
    Calendar,
    Settings,
    ShieldCheck
} from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import PageHeader from '../components/common/PageHeader';
import { FormSection, Input, Select, TextArea } from '../components/common/FormControls';
import toast from 'react-hot-toast';

const CouponFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, coupons, createCoupon, updateCoupon, categories } = useShop();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        code: '',
        type: 'flat',
        value: '',
        minOrderValue: '',
        maxDiscount: '',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        usageLimit: 1000,
        perUserLimit: 1,
        active: true,
        userEligibility: 'all',
        description: '',
        applicabilityType: 'all',
        targetItems: []
    });

    useEffect(() => {
        if (isEdit && coupons.length > 0) {
            const coupon = coupons.find(c => c._id === id || c.id === id);
            if (coupon) {
                setFormData({
                    ...coupon,
                    validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
                    validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
                    applicabilityType: coupon.applicableCategories?.length > 0 ? 'category' : 'all',
                    targetItems: coupon.applicableCategories || []
                });
            }
        }
    }, [id, isEdit, coupons]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleTargetItem = (itemValue) => {
        setFormData(prev => {
            const current = prev.targetItems || [];
            if (current.includes(itemValue)) {
                return { ...prev, targetItems: current.filter(i => i !== itemValue) };
            } else {
                return { ...prev, targetItems: [...current, itemValue] };
            }
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!formData.code || !formData.value || !formData.validUntil) {
            toast.error("Please fill in required fields (Code, Value, Expiry)");
            return;
        }

        const payload = {
            ...formData,
            value: Number(formData.value),
            minOrderValue: Number(formData.minOrderValue) || 0,
            maxDiscount: Number(formData.maxDiscount) || null,
            usageLimit: Number(formData.usageLimit) || 1000,
            perUserLimit: Number(formData.perUserLimit) || 1,
            applicableCategories: formData.applicabilityType === 'category' ? formData.targetItems : []
        };

        let result;
        if (isEdit) {
            result = await updateCoupon(id, payload);
        } else {
            result = await createCoupon(payload);
        }

        if (result) {
            navigate('/admin/coupons');
        }
    };

    const handleSaveAction = {
        label: isEdit ? 'Update Coupon' : 'Deploy Coupon',
        icon: <Save size={16} />,
        onClick: handleSave
    };

    return (
        <div className="space-y-10 pb-20 text-left animate-in fade-in duration-500">
            <PageHeader
                title={isEdit ? 'Configure Coupon' : 'New Promo Campaign'}
                subtitle={isEdit ? `Modifying settings for ${formData.code}` : 'Design a new high-conversion discount code'}
                backPath="/admin/coupons"
                action={handleSaveAction}
            />

            <form className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <FormSection title="Core Settings" icon={<Info size={18} className="text-gray-400" />}>
                        <div className="space-y-5">
                            <div className="flex flex-col gap-1.5">
                                <Input
                                    label="Promotional Code"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    placeholder="e.g., WELCOME50"
                                />
                                <div className="text-right">
                                    <button
                                        type="button"
                                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                        onClick={() => setFormData({ ...formData, code: `SALE${Math.floor(Math.random() * 900) + 100}` })}
                                    >
                                        Auto-Generate Code
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Select
                                    label="Discount Type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'flat', label: 'Flat Amount (₹)' },
                                        { value: 'percent', label: 'Percentage (%)' }
                                    ]}
                                />
                                <Input
                                    label="Discount Value"
                                    type="number"
                                    name="value"
                                    value={formData.value}
                                    onChange={handleChange}
                                    placeholder={formData.type === 'percent' ? 'e.g., 20' : 'e.g., 500'}
                                />
                            </div>

                            <TextArea
                                label="Campaign Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Explain the offer to customers..."
                            />
                        </div>
                    </FormSection>

                    <FormSection title="Coupon Scope" icon={<ShieldCheck size={18} className="text-gray-400" />}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Targeting Matrix</span>
                            {formData.targetItems.length > 0 && (
                                <span className="text-[10px] font-bold text-white bg-black px-2 py-1 rounded">
                                    {formData.targetItems.length} SELECTIONS
                                </span>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="flex p-1 bg-gray-100 rounded-none space-x-1 overflow-x-auto">
                                {[
                                    { id: 'all', label: 'All Orders' },
                                    { id: 'category', label: 'By Category' }
                                ].map(scope => {
                                    const isActive = formData.applicabilityType === scope.id;

                                    return (
                                        <button
                                            key={scope.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, applicabilityType: scope.id, targetItems: [] })}
                                            className={`flex-1 py-2 px-3 rounded-none text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${isActive
                                                ? 'bg-black text-white shadow-lg'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            {scope.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="border border-black/5 rounded-none overflow-hidden min-h-[150px] max-h-[400px] overflow-y-auto p-4 bg-gray-50/50">
                                {formData.applicabilityType === 'all' && (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-8 space-y-2">
                                        <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-black mb-2 border border-black/5">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <p className="text-[10px] font-black text-black uppercase tracking-widest">Global Protocol</p>
                                        <p className="text-xs text-gray-400 max-w-xs font-medium">This coupon applies to any combination across the inventory.</p>
                                    </div>
                                )}

                                {formData.applicabilityType === 'category' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {categories.map(cat => (
                                            <label key={cat.id} className="flex items-center gap-3 p-3 bg-white rounded-none border border-black/5 cursor-pointer hover:border-black/20 transition-all select-none">
                                                <div className={`w-4 h-4 rounded-none border flex items-center justify-center transition-all ${formData.targetItems.includes(cat.id || cat._id) ? 'bg-black border-black' : 'border-gray-300'}`}>
                                                    {formData.targetItems.includes(cat.id || cat._id) && <CheckCircle2 size={10} className="text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={formData.targetItems.includes(cat.id || cat._id)}
                                                    onChange={() => toggleTargetItem(cat.id || cat._id)}
                                                />
                                                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">{cat.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </FormSection>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <FormSection title="Validity Period" icon={<Calendar size={18} className="text-gray-400" />}>
                        <div className="space-y-4">
                            <Input
                                label="Activation Date"
                                type="date"
                                name="validFrom"
                                value={formData.validFrom}
                                onChange={handleChange}
                            />
                            <Input
                                label="Termination Date"
                                type="date"
                                name="validUntil"
                                value={formData.validUntil}
                                onChange={handleChange}
                            />
                        </div>
                    </FormSection>

                    <FormSection title="Parameters" icon={<Settings size={18} className="text-gray-400" />}>
                        <div className="space-y-4">
                            <Input
                                label="Floor Value (₹)"
                                type="number"
                                name="minOrderValue"
                                value={formData.minOrderValue}
                                onChange={handleChange}
                                placeholder="Min spend required"
                            />
                            {formData.type === 'percent' && (
                                <Input
                                    label="Max Ceiling (₹)"
                                    type="number"
                                    name="maxDiscount"
                                    value={formData.maxDiscount}
                                    onChange={handleChange}
                                    placeholder="Upper limit"
                                />
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Total Usage"
                                    type="number"
                                    name="usageLimit"
                                    value={formData.usageLimit}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Per User"
                                    type="number"
                                    name="perUserLimit"
                                    value={formData.perUserLimit}
                                    onChange={handleChange}
                                />
                            </div>
                            <Select
                                label="User Eligibility"
                                name="userEligibility"
                                value={formData.userEligibility}
                                onChange={handleChange}
                                options={[
                                    { value: 'all', label: 'All Customers' },
                                    { value: 'new', label: 'First Time Buyers' },
                                    { value: 'existing', label: 'Loyal Customers' }
                                ]}
                            />
                        </div>

                        <div className="h-px bg-gray-100 my-6"></div>

                        <div className="flex items-center justify-between p-1">
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Protocol Active</span>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, active: !formData.active })}
                                className={`w-12 h-6 rounded-none transition-all relative ${formData.active ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-none transition-all ${formData.active ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </FormSection>
                </div>
            </form>
        </div>
    );
};

export default CouponFormPage;

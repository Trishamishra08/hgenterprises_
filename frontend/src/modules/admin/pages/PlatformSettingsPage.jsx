import React, { useState, useEffect } from 'react';
import { useShop } from '../../../context/ShopContext';
import api from '../../../utils/api';
import { Percent, Truck, Save, RefreshCcw, ShieldCheck, AlertCircle, FileText, Building2, Phone, Mail, Globe, Palette, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PlatformSettingsPage = () => {
    const { settings } = useShop();
    const [gstPercentage, setGstPercentage] = useState(18);
    const [shippingCharge, setShippingCharge] = useState(50);
    const [codMaxAmount, setCodMaxAmount] = useState(50000);
    const [returnWindowDays, setReturnWindowDays] = useState(7);
    const [exchangeWindowDays, setExchangeWindowDays] = useState(10);
    const [saving, setSaving] = useState(false);
    const [savingPdf, setSavingPdf] = useState(false);
    const [pdfExpanded, setPdfExpanded] = useState(true);

    const [pdfBrochure, setPdfBrochure] = useState({
        companyName:      'HARSHAD GAURI ENTERPRISES',
        companyTagline:   'PRECISION MACHINERY & TOOLING SOLUTIONS',
        address:          '45/2, Golden Plaza, Business District, Mumbai - 400 001',
        phone:            '+91 022 4028 3883 / 022 4028 3885',
        email:            'sales@hgenterprises.com',
        website:          'www.hgenterprises.com',
        footerBgColor:    '#8B4356',
        featuresHeading:  'FEATURES :',
        certificationText:'ISO 9001:2015 Certified',
        footerDisclaimer: 'This is an authentic technical brochure of Harshad Gauri Enterprises.'
    });

    useEffect(() => {
        if (settings) {
            setGstPercentage(settings.gstPercentage || 18);
            setShippingCharge(settings.shippingCharge || 50);
            setCodMaxAmount(settings.codMaxAmount ?? 50000);
            setReturnWindowDays(settings.returnWindowDays ?? 7);
            setExchangeWindowDays(settings.exchangeWindowDays ?? 10);
            if (settings.pdfBrochure) {
                setPdfBrochure(prev => ({ ...prev, ...settings.pdfBrochure }));
            }
        }
    }, [settings]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('/settings', {
                gstPercentage: Number(gstPercentage),
                shippingCharge: Number(shippingCharge),
                codMaxAmount: Number(codMaxAmount),
                returnWindowDays: Number(returnWindowDays),
                exchangeWindowDays: Number(exchangeWindowDays)
            });
            toast.success("Platform configurations updated successfully");
        } catch (error) {
            console.error("Error updating settings:", error);
            toast.error("Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    const handleSavePdf = async () => {
        setSavingPdf(true);
        try {
            await api.post('/settings', { pdfBrochure });
            toast.success("PDF Brochure settings saved successfully!");
        } catch (error) {
            console.error("Error saving PDF settings:", error);
            toast.error("Failed to save PDF Brochure settings");
        } finally {
            setSavingPdf(false);
        }
    };

    const pdfField = (key, label, type = 'text', hint = '') => (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{label}</label>
            <input
                type={type}
                value={pdfBrochure[key]}
                onChange={e => setPdfBrochure(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium text-gray-800 focus:border-[#8B4356] focus:ring-4 focus:ring-[#8B4356]/5 outline-none transition-all"
            />
            {hint && <p className="text-[9px] text-gray-400 ml-1 font-medium">{hint}</p>}
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* ── HEADER ──────────────────────────────────────────────── */}
            <div className="relative overflow-hidden bg-black p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B4356]/10 blur-[100px] rounded-full -mr-20 -mt-20" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#8B4356]/20 rounded-xl border border-[#8B4356]/30">
                                <ShieldCheck className="w-6 h-6 text-[#D39A9F]" />
                            </div>
                            <h1 className="text-3xl font-serif font-black text-white tracking-widest uppercase">Global Control</h1>
                        </div>
                        <p className="text-gray-400 text-sm font-serif italic max-w-md">
                            Manage platform-wide tax rates, delivery policies, and PDF brochure configurations.
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-3 bg-[#D39A9F] hover:bg-[#c98a90] text-black px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : "Save Configuration"}
                    </button>
                </div>
            </div>

            {/* ── TAX + SHIPPING ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* GST */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/[0.02] space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                            <Percent className="w-6 h-6 text-[#D39A9F]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-black uppercase tracking-wider">GST Settings</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Taxation Compliance</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">GST Percentage (%)</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    value={gstPercentage}
                                    onChange={e => setGstPercentage(e.target.value)}
                                    placeholder="e.g. 18"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xl font-bold text-black focus:border-[#D39A9F] focus:ring-4 focus:ring-[#D39A9F]/5 outline-none transition-all placeholder:text-gray-200"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">%</div>
                            </div>
                        </div>
                        <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                            <p className="text-[11px] text-amber-700 leading-relaxed font-medium capitalize">
                                Changes will be applied in real-time to all orders at checkout.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Shipping */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/[0.02] space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                            <Truck className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-black uppercase tracking-wider">Shipping Settings</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Delivery Charges</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Fixed Shipping Charge (₹)</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    value={shippingCharge}
                                    onChange={e => setShippingCharge(e.target.value)}
                                    placeholder="e.g. 50"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xl font-bold text-black focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-gray-200"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">₹</div>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Cash on Delivery limit (₹)</label>
                            <input
                                type="number"
                                value={codMaxAmount}
                                onChange={e => setCodMaxAmount(e.target.value)}
                                placeholder="e.g. 50000"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xl font-bold text-black focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-gray-200"
                            />
                            <p className="text-[11px] text-gray-400 ml-1">Orders above this amount must be paid online.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Return window (days)</label>
                                <input type="number" min="0" value={returnWindowDays} onChange={e => setReturnWindowDays(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-lg font-bold text-black outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Exchange window (days)</label>
                                <input type="number" min="0" value={exchangeWindowDays} onChange={e => setExchangeWindowDays(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-lg font-bold text-black outline-none" />
                            </div>
                        </div>
                        <p className="text-[11px] text-gray-400 ml-1">Counted from the delivery date. Customers cannot request after this.</p>
                        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                            <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
                                First-order free shipping is enabled by default. This charge applies to all subsequent orders.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── PDF BROCHURE SETTINGS ─────────────────────────────────── */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/[0.02] overflow-hidden">
                {/* Section Header */}
                <button
                    onClick={() => setPdfExpanded(p => !p)}
                    className="w-full flex items-center justify-between p-8 hover:bg-gray-50/50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                            <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-xl font-bold text-black uppercase tracking-wider">PDF Brochure Settings</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Customize machine & tools product datasheets</p>
                        </div>
                    </div>
                    <div className="text-gray-400">
                        {pdfExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </button>

                {pdfExpanded && (
                    <div className="px-8 pb-8 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Preview strip */}
                        <div
                            className="rounded-2xl p-5 flex items-center justify-between"
                            style={{ backgroundColor: pdfBrochure.footerBgColor || '#8B4356' }}
                        >
                            <div>
                                <p className="text-white font-black text-sm tracking-wider">{pdfBrochure.companyName || 'Company Name'}</p>
                                <p className="text-white/70 text-[10px] tracking-widest mt-0.5">{pdfBrochure.companyTagline}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/80 text-[10px] font-bold">{pdfBrochure.certificationText}</p>
                                <p className="text-white/50 text-[9px] mt-0.5">Footer Preview</p>
                            </div>
                        </div>

                        {/* Company Info */}
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <Building2 className="w-3.5 h-3.5" /> Company Identity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pdfField('companyName',    'Company Name',    'text', 'Appears bold in header and footer')}
                                {pdfField('companyTagline', 'Company Tagline', 'text', 'Subtitle shown below company name')}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5" /> Contact Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pdfField('address', 'Company Address', 'text')}
                                {pdfField('phone',   'Phone Number',    'text')}
                                {pdfField('email',   'Email Address',   'email')}
                                {pdfField('website', 'Website URL',     'text')}
                            </div>
                        </div>

                        {/* Brochure Text */}
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <Award className="w-3.5 h-3.5" /> Brochure Text
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pdfField('featuresHeading',   'Features Section Heading', 'text', 'e.g. "FEATURES :" or "KEY BENEFITS"')}
                                {pdfField('certificationText', 'Certification Badge Text',  'text', 'e.g. "ISO 9001:2015 Certified"')}
                                <div className="md:col-span-2">
                                    {pdfField('footerDisclaimer', 'Footer Disclaimer Text', 'text', 'Small disclaimer text shown in the footer')}
                                </div>
                            </div>
                        </div>

                        {/* Color */}
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <Palette className="w-3.5 h-3.5" /> Brand Color
                            </h3>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={pdfBrochure.footerBgColor}
                                    onChange={e => setPdfBrochure(prev => ({ ...prev, footerBgColor: e.target.value }))}
                                    className="w-14 h-14 rounded-2xl border border-gray-200 cursor-pointer p-1 bg-white"
                                />
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{pdfBrochure.footerBgColor}</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Used for header strip, footer, table headers, and bullet arrows in the PDF</p>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSavePdf}
                            disabled={savingPdf}
                            className="w-full flex items-center justify-center gap-3 bg-[#8B4356] hover:bg-[#7a394b] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#8B4356]/20 active:scale-[0.99] disabled:opacity-50"
                        >
                            {savingPdf ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {savingPdf ? 'Saving PDF Settings...' : 'Save PDF Brochure Settings'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlatformSettingsPage;

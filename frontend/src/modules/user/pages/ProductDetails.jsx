import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import ProductCard from '../components/ProductCard';
import {
    Heart, ShoppingBag, Star, Share2, Plus, Minus, Truck,
    ShieldCheck, Smile, Gift, ChevronDown, SlidersHorizontal,
    X, Camera, Check, ArrowLeft, ChevronRight, Info,
    Clock, RefreshCw, Award, Zap, Search, UserCircle, Home, Download, FileText, Sparkles,
    Percent, Video, RotateCcw, CreditCard, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import watermarkLogo from '../../../assets/WhatsApp_Image_2026-03-12_at_1.38.09_PM__1_-removebg-preview.png';
import PopularSearchTags from '../components/PopularSearchTags';
import { getProductDepartment, buildPopularSearchLink, parseTagsString, getDepartmentLabel, resolveDepartmentFromCategory } from '../data/popularSearchData';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { products, addToCart, wishlist, addToWishlist, removeFromWishlist, showNotification, coupons, addToRecentlyViewed } = useShop();
    const product = products.find(p => p.id === id || p._id === id);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const categoryName = (product?.category?.name || product?.category || '').toString();
    const categoryNameLower = categoryName.toLowerCase();

    const productDepartment = product?.department
        ? resolveDepartmentFromCategory(product.department, null)
        : getProductDepartment(categoryNameLower);

    const isJewelleryProduct = productDepartment === 'jewellery';

    const departmentLabel = getDepartmentLabel(productDepartment);
    const departmentShopLink = `/shop?category=${encodeURIComponent(departmentLabel)}`;
    const productCategoryLabel = categoryName || product?.subCategory || product?.subcategory || 'Collection';
    const productSubCategory = product?.subcategory || product?.subCategory || product?.type || null;

    // Reviews states & handlers
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState('');
    const [reviewImage, setReviewImage] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [activeReviewIdx, setActiveReviewIdx] = useState(0);

    // 10+1 Monthly Plan states
    const [showMonthlyPlanModal, setShowMonthlyPlanModal] = useState(false);
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [monthlyInstallment, setMonthlyInstallment] = useState(5000);
    const [isSubscribedPlan, setIsSubscribedPlan] = useState(false);
    const [planForm, setPlanForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '' });
    const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);

    // Sizing state
    const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);

    // Dynamic pincode checking states
    const [pincodeVal, setPincodeVal] = useState('');
    const [pincodeStatus, setPincodeStatus] = useState('');

    // Interactive video call modal states
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [videoForm, setVideoForm] = useState({ date: 'Today', time: '11:00 AM', phone: '', name: user?.name || '' });
    const [isVideoSubmitting, setIsVideoSubmitting] = useState(false);

    // Interactive customization states
    const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
    const [customPurity, setCustomPurity] = useState('18Kt');
    const [customDiamond, setCustomDiamond] = useState('SI-JK');

    const handleCheckPincode = () => {
        if (!pincodeVal) {
            setPincodeStatus('✕ Please enter a pincode.');
            return;
        }
        if (pincodeVal.length !== 6) {
            setPincodeStatus('✕ Please enter a valid 6-digit pincode.');
            return;
        }
        setPincodeStatus('✓ Delivery by Sunday, May 17. Cash on Delivery is available!');
    };

    const handleVideoCallSubmit = (e) => {
        e.preventDefault();
        if (!videoForm.phone || videoForm.phone.length < 10) {
            showNotification({ message: 'Please enter a valid 10-digit mobile number.', type: 'error' });
            return;
        }
        setIsVideoSubmitting(true);
        setTimeout(() => {
            setIsVideoSubmitting(false);
            setIsVideoModalOpen(false);
            showNotification({ message: `Video call booked successfully for ${videoForm.date} at ${videoForm.time}! We will contact you via WhatsApp.`, type: 'success' });
        }, 1200);
    };

    const getCustomizedPrice = (price) => {
        if (!isJewelleryProduct) return price;
        let factor = 1.0;
        if (customPurity === '14Kt') factor -= 0.15;
        if (customPurity === '22Kt') factor += 0.15;
        if (customDiamond === 'VS-GH') factor += 0.05;
        if (customDiamond === 'VVS-EF') factor += 0.10;
        return Math.round(price * factor);
    };

    const getProductSummaryLabel = () => {
        if (!isJewelleryProduct) {
            const cat = product?.category || 'Product';
            const sub = product?.subcategory || product?.subCategory || '';
            const brand = product?.brand || 'HG Enterprises';
            return `${brand} Premium ${cat}${sub ? ` - ${sub}` : ''}`;
        }
        
        const subCat = product.subCategory || product.subcategory || product.category || 'Ring';
        const capitalizedSubCat = subCat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

        let metalWeight = '';
        let diamondCt = '';

        if (product.specifications && product.specifications.length > 0) {
            product.specifications.forEach(spec => {
                const lbl = spec.label.toUpperCase();
                const val = spec.value;
                if (lbl.includes('GOLD WEIGHT') || lbl.includes('METAL WEIGHT') || lbl.includes('PRODUCT WEIGHT')) {
                    metalWeight = val;
                }
                if (lbl.includes('DIAMOND WEIGHT') || lbl.includes('TOTAL DIAMOND') || lbl.includes('TOTAL WEIGHT') || lbl.includes('CT')) {
                    diamondCt = val;
                }
            });
        }

        if (!metalWeight) metalWeight = product.weight || '3.25 gram';
        if (!diamondCt) diamondCt = '0.2650 Ct';

        let label = `${capitalizedSubCat} In ${customPurity} Yellow Gold (${metalWeight})`;
        if (product.name?.toLowerCase().includes('diamond') || product.description?.toLowerCase().includes('diamond')) {
            label += ` With Diamonds (${diamondCt})`;
        }
        return label;
    };

    useEffect(() => {
        if (user) {
            setPlanForm(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const res = await api.get(`/products/${id}/reviews`);
            setReviews(res.data || []);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setLoadingReviews(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchReviews();
        }
    }, [id]);

    useEffect(() => {
        if (product?.id || product?._id) {
            addToRecentlyViewed(product.id || product._id);
        }
    }, [product?.id, product?._id, addToRecentlyViewed]);

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!user) {
            showNotification({ message: 'Please login to write a review', type: 'error' });
            return;
        }
        if (!userComment.trim()) {
            showNotification({ message: 'Please enter a review comment', type: 'error' });
            return;
        }
        try {
            setIsSubmittingReview(true);
            const reviewData = {
                productId: id,
                rating: userRating,
                comment: userComment,
                images: reviewImage ? [reviewImage] : []
            };
            await api.post('/products/reviews', reviewData);
            showNotification({ message: 'Review submitted for moderation! It will appear once approved.', type: 'success' });
            setUserComment('');
            setUserRating(5);
            setReviewImage('');
            setShowReviewForm(false);
            fetchReviews();
        } catch (err) {
            console.error("Error submitting review:", err);
            showNotification({ message: err.response?.data?.message || 'Failed to submit review', type: 'error' });
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // Gallery State
    const [selectedImgIdx, setSelectedImgIdx] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!isZoomed) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePos({ x, y });
    };

    const productImages = product?.images && product.images.length > 0
        ? product.images
        : [product?.image, product?.image, product?.image];

    // UI states
    const [showSuccessSheet, setShowSuccessSheet] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [openSection, setOpenSection] = useState('about');
    const isWishlisted = wishlist.some(item => item.id === product?.id);
    const originalPrice = getCustomizedPrice(product?.originalPrice || product?.price || 0);
    const currentPrice = getCustomizedPrice(product?.price || 0);
    const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

    // Accordion expand/collapse states matching the screenshot (Image 1 and 2)
    const [expandedSections, setExpandedSections] = useState({
        'PRODUCT DETAILS':         true,
        'SOLITAIRE DETAILS':       true,
        'DIAMOND DETAILS':         true,
        'METAL DETAILS':           true,
        'PRICE BREAKUP':           true,
        'TECHNICAL SPECIFICATIONS':true,
        'TAGS':                    false
    });

    const toggleSection = (secName) => {
        setExpandedSections(prev => ({
            ...prev,
            [secName]: !prev[secName]
        }));
    };

    // Helper to group specs for jewellery details accordion
    const getGroupedSpecs = () => {
        if (!isJewelleryProduct) {
            // For machines and other non-jewellery, group everything under "TECHNICAL SPECIFICATIONS"
            if (!product?.specifications || product.specifications.length === 0) return {};
            return {
                'TECHNICAL SPECIFICATIONS': product.specifications
            };
        }

        const grouped = {
            'PRODUCT DETAILS':   [],
            'SOLITAIRE DETAILS': [],
            'DIAMOND DETAILS':   [],
            'METAL DETAILS':     [],
            'PRICE BREAKUP':     [],
            'TAGS':              []
        };

        const other = {};

        if (product?.specifications && product.specifications.length > 0) {
            product.specifications.forEach(spec => {
                const labelUpper = spec.label.toUpperCase();

                if (
                    labelUpper.includes('PRODUCT CODE') ||
                    labelUpper.includes('HEIGHT') ||
                    labelUpper.includes('WIDTH') ||
                    labelUpper.includes('PRODUCT WEIGHT')
                ) {
                    let cleanLabel = spec.label;
                    if (labelUpper.includes('PRODUCT CODE')) cleanLabel = 'Product Code';
                    if (labelUpper.includes('HEIGHT')) cleanLabel = 'Height';
                    if (labelUpper.includes('WIDTH')) cleanLabel = 'Width';
                    if (labelUpper.includes('PRODUCT WEIGHT')) cleanLabel = 'Product Weight';
                    grouped['PRODUCT DETAILS'].push({ label: cleanLabel, value: spec.value });
                }
                else if (
                    labelUpper.includes('SOLITAIRE') ||
                    labelUpper.includes('CLARITY') ||
                    labelUpper.includes('FLUORESCENCE') ||
                    labelUpper.includes('CUT-POLISH') ||
                    labelUpper.includes('CUT POLISH') ||
                    (labelUpper.includes('COLOR') && !labelUpper.includes('GOLD')) ||
                    (labelUpper.includes('SHAPE') && !labelUpper.includes('DIAMOND')) ||
                    (labelUpper.includes('TOTAL') && labelUpper.includes('SOLITAIRE'))
                ) {
                    grouped['SOLITAIRE DETAILS'].push({ label: spec.label, value: spec.value });
                }
                else if (
                    labelUpper.includes('DIAMOND') ||
                    (labelUpper.includes('TOTAL WEIGHT') && !labelUpper.includes('SOLITAIRE')) ||
                    labelUpper.includes('TOTAL NO. OF DIAMONDS') ||
                    labelUpper.includes('COUNT') ||
                    (labelUpper.includes('SHAPE') && labelUpper.includes('DIAMOND')) ||
                    labelUpper.includes('SETTING TYPE') ||
                    labelUpper.includes('SETTING')
                ) {
                    let cleanLabel = spec.label;
                    if (labelUpper.includes('TOTAL WEIGHT') || labelUpper.includes('DIAMOND WEIGHT')) cleanLabel = 'Total Weight';
                    if (labelUpper.includes('TOTAL NO.') || labelUpper.includes('DIAMOND COUNT') || labelUpper.includes('TOTAL DIAMONDS')) cleanLabel = 'Total No. Of Diamonds';
                    grouped['DIAMOND DETAILS'].push({ label: cleanLabel, value: spec.value });
                }
                else if (labelUpper.includes('METAL') || labelUpper.includes('TYPE') || labelUpper.includes('GOLD WEIGHT')) {
                    let cleanLabel = spec.label;
                    if (labelUpper.includes('TYPE')) cleanLabel = 'Type';
                    if (labelUpper.includes('WEIGHT')) cleanLabel = 'Weight';
                    grouped['METAL DETAILS'].push({ label: cleanLabel, value: spec.value });
                }
                else if (labelUpper.includes('PRICE') || labelUpper.includes('GOLD') || labelUpper.includes('MAKING') || labelUpper.includes('GST') || labelUpper.includes('TOTAL')) {
                    let cleanLabel = spec.label;
                    if (labelUpper.includes('GOLD')) cleanLabel = 'Gold';
                    if (labelUpper.includes('DIAMOND')) cleanLabel = 'Diamond';
                    if (labelUpper.includes('MAKING')) cleanLabel = 'Making Charges';
                    if (labelUpper.includes('GST')) cleanLabel = 'GST';
                    if (labelUpper.includes('TOTAL')) cleanLabel = 'Total';
                    grouped['PRICE BREAKUP'].push({ label: cleanLabel, value: spec.value });
                }
                else if (labelUpper.includes('TAGS') || labelUpper.includes('TAG')) {
                    grouped['TAGS'].push({ label: 'Tags', value: spec.value });
                }
                else {
                    const parts = spec.label.split(' ');
                    const group = parts.length > 1 ? parts.slice(0, -1).join(' ').toUpperCase() : 'GENERAL';
                    if (!other[group]) other[group] = [];
                    other[group].push({ label: spec.label, value: spec.value });
                }
            });
        }

        // Merge any other categories
        Object.entries(other).forEach(([cat, items]) => {
            grouped[cat] = items;
        });

        // Generate realistic price breakup if empty (critical to show dynamic pricing values)
        if (grouped['PRICE BREAKUP'].length === 0) {
            const hasDiamonds = (product?.specifications || []).some(s => s.label.toUpperCase().includes('DIAMOND')) || 
                                (product?.name || '').toUpperCase().includes('DIAMOND');
            
            const gst = Math.round(currentPrice * 0.03);
            const making = Math.round(currentPrice * 0.12);
            const diamondValue = hasDiamonds ? Math.round(currentPrice * 0.25) : 0;
            const metalValue = currentPrice - gst - making - diamondValue;

            grouped['PRICE BREAKUP'] = [
                { label: 'Gold Price', value: `₹${metalValue.toLocaleString()}` },
                ...(hasDiamonds ? [{ label: 'Diamond Price', value: `₹${diamondValue.toLocaleString()}` }] : []),
                { label: 'Making Charges', value: `₹${making.toLocaleString()}` },
                { label: 'GST (3%)', value: `₹${gst.toLocaleString()}` },
                { label: 'Total', value: `₹${currentPrice.toLocaleString()}` }
            ];
        }

        // Filter out empty sections
        return Object.fromEntries(
            Object.entries(grouped).filter(([_, items]) => items && items.length > 0)
        );
    };

    const [selectedSize, setSelectedSize] = useState(9);
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (showMonthlyPlanModal || showSizeGuide || showSuccessSheet) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showMonthlyPlanModal, showSizeGuide, showSuccessSheet]);

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF5F6] p-10 text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Product Not Found</h2>
            <Link to="/shop" className="bg-[#8B4356] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg">Back to Shop</Link>
        </div>
    );

    const handleAddToCart = () => {
        addToCart({ ...product, selectedSize });
        setShowSuccessSheet(true);
    };

    const handleBuyNow = () => {
        // Direct buy flow: add to cart first then navigate
        addToCart({ ...product, selectedSize });
        navigate('/checkout', { state: { directBuy: true, product: { ...product, selectedSize } } });
    };

    const handleWishlist = () => {
        if (isWishlisted) removeFromWishlist(product.id);
        else addToWishlist(product);
    };

    const handleDownloadImage = async () => {
        try {
            const imageUrl = productImages[selectedImgIdx] || product?.image;
            if (!imageUrl) return;

            showNotification('Preparing high-quality PNG download...');

            // Fetch image as blob
            const response = await fetch(imageUrl, { mode: 'cors' });
            const blob = await response.blob();

            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = URL.createObjectURL(blob);

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Load and overlay the transparent brand logo at the bottom-left corner
                const watermark = new Image();
                watermark.src = watermarkLogo;
                watermark.onload = () => {
                    // Center watermark
                    const wmWidth = canvas.width * 0.30;
                    const wmHeight = watermark.naturalHeight * (wmWidth / watermark.naturalWidth);

                    // Center position
                    const x = (canvas.width - wmWidth) / 2;
                    const y = (canvas.height - wmHeight) / 2;

                    const fontSize = Math.round(canvas.width * 0.035);

                    // Draw logo at low opacity
                    ctx.globalAlpha = 0.45;
                    ctx.drawImage(watermark, x, y, wmWidth, wmHeight);

                    // Draw brand text below the logo with white fill + dark shadow for readability on any bg
                    ctx.globalAlpha = 1.0;
                    ctx.font = `bold ${fontSize}px "Cinzel", "Georgia", serif`;
                    ctx.textAlign = 'center';
                    // Shadow pass
                    ctx.fillStyle = 'rgba(0,0,0,0.25)';
                    ctx.fillText('HG ENTERPRISES', canvas.width / 2 + 2, y + wmHeight + fontSize + 2);
                    // Actual text in gold
                    ctx.fillStyle = '#D4AF37';
                    ctx.fillText('HG ENTERPRISES', canvas.width / 2, y + wmHeight + fontSize);

                    // Reset
                    ctx.globalAlpha = 1.0;

                    // Export to PNG data URL
                    const pngUrl = canvas.toDataURL('image/png');

                    const link = document.createElement('a');
                    link.href = pngUrl;
                    link.download = `${product.name.toLowerCase().replace(/\s+/g, '-')}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    showNotification('Downloaded successfully with brand watermark!');
                };
            };
        } catch (error) {
            console.error('Download error:', error);
            // Fallback: direct download link if fetch fails
            try {
                const link = document.createElement('a');
                link.href = productImages[selectedImgIdx] || product?.image;
                link.target = '_blank';
                link.download = `${product.name}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showNotification('Downloaded image file');
            } catch (e) {
                window.open(productImages[selectedImgIdx] || product?.image, '_blank');
            }
        }
    };

    const handleDownloadPDF = async () => {
        try {
            showNotification('Generating Technical PDF Brochure...');

            // Fetch brochure settings from backend
            const settingsRes = await api.get('/settings').catch(() => ({ data: null }));
            const brochure = settingsRes?.data?.pdfBrochure || {};

            const companyName = brochure.companyName || 'HARSHAD GAURI ENTERPRISES';
            const companyTagline = brochure.companyTagline || 'PRECISION MACHINERY & TOOLING SOLUTIONS';
            const address = brochure.address || '45/2, Golden Plaza, Business District, Mumbai - 400 001';
            const phone = brochure.phone || '+91 022 4028 3883';
            const email = brochure.email || 'sales@hgenterprises.com';
            const website = brochure.website || 'www.hgenterprises.com';
            const featuresHdr = brochure.featuresHeading || 'FEATURES :';
            const certText = brochure.certificationText || 'ISO 9001:2015 Certified';
            const disclaimer = brochure.footerDisclaimer || 'This is an authentic technical brochure of Harshad Gauri Enterprises.';

            // Parse hex footer color → RGB
            const hex = (brochure.footerBgColor || '#8B4356').replace('#', '');
            const fR = parseInt(hex.substring(0, 2), 16);
            const fG = parseInt(hex.substring(2, 4), 16);
            const fB = parseInt(hex.substring(4, 6), 16);

            const doc = new jsPDF({ unit: 'mm', format: 'a4' });
            const pageW = 210;
            const pageH = 297;

            // ── HEADER STRIP ──────────────────────────────────────────
            doc.setFillColor(fR, fG, fB);
            doc.rect(0, 0, pageW, 32, 'F');

            // Try to embed logo in top-right of header (directly on maroon background)
            const logoW = 24;
            const logoH = 24;
            const logoX = pageW - 14 - logoW;
            const logoY = 4;
            try {
                const logoResp = await fetch(watermarkLogo, { mode: 'cors' });
                const logoBlob = await logoResp.blob();
                const logoDataUrl = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(logoBlob);
                });
                // No white box — logo sits directly on the header strip
                doc.addImage(logoDataUrl, 'PNG', logoX, logoY, logoW, logoH);
            } catch {
                // Logo not available, skip it gracefully
            }

            // Company name (left-aligned in header)
            doc.setTextColor(255, 255, 255);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(16);
            doc.text(companyName, 14, 13);

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(240, 220, 225);
            doc.text(companyTagline, 14, 20);

            // Date (below logo area, right-aligned)
            const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
            doc.setFontSize(7.5);
            doc.setTextColor(255, 220, 230);
            doc.text(dateStr, pageW - 14, 27, { align: 'right' });

            // ── PRODUCT TITLE BAND ────────────────────────────────────
            doc.setFillColor(245, 230, 232);
            doc.rect(0, 32, pageW, 14, 'F');

            const catLabel = product?.category?.name || product?.category || 'Precision Tooling';
            doc.setTextColor(fR, fG, fB);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            doc.text(catLabel.toUpperCase(), pageW - 14, 38, { align: 'right' });

            doc.setTextColor(30, 20, 25);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(17);
            doc.text(product?.name || 'Product Datasheet', 14, 42);

            // ── TWO-COLUMN BODY ───────────────────────────────────────
            // Left col: product image (45mm wide)
            const imgColX = 14;
            const imgColY = 50;
            const imgW = 62;
            const imgH = 62;

            // Embed product image if possible
            const imageUrl = productImages[selectedImgIdx] || product?.image;
            if (imageUrl) {
                try {
                    const imgResp = await fetch(imageUrl, { mode: 'cors' });
                    const imgBlob = await imgResp.blob();
                    const imgDataUrl = await new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(imgBlob);
                    });
                    // Border behind image
                    doc.setDrawColor(225, 200, 205);
                    doc.setLineWidth(0.5);
                    doc.rect(imgColX, imgColY, imgW, imgH);
                    doc.addImage(imgDataUrl, 'JPEG', imgColX + 0.5, imgColY + 0.5, imgW - 1, imgH - 1);
                } catch {
                    // Draw placeholder box on error
                    doc.setFillColor(240, 230, 232);
                    doc.rect(imgColX, imgColY, imgW, imgH, 'F');
                    doc.setTextColor(180, 150, 155);
                    doc.setFontSize(8);
                    doc.text('Image Not Available', imgColX + imgW / 2, imgColY + imgH / 2, { align: 'center' });
                }
            }

            // QR code → opens this product's page when scanned
            const productId = product?.id || product?._id || id;
            const productUrl = `${window.location.origin}/product/${productId}`;
            const qrSize = 28;
            const qrX = imgColX + (imgW - qrSize) / 2;
            const qrY = imgColY + imgH + 4;
            try {
                const qrDataUrl = await QRCode.toDataURL(productUrl, {
                    width: 256,
                    margin: 1,
                    color: { dark: '#1a1a1a', light: '#ffffff' },
                    errorCorrectionLevel: 'M',
                });
                doc.setDrawColor(225, 200, 205);
                doc.setLineWidth(0.3);
                doc.setFillColor(255, 255, 255);
                doc.rect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2, 'FD');
                doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
                doc.setFont('Helvetica', 'normal');
                doc.setFontSize(6.5);
                doc.setTextColor(fR, fG, fB);
                doc.text('Scan to view product online', imgColX + imgW / 2, qrY + qrSize + 4, { align: 'center' });
            } catch (qrErr) {
                console.warn('QR generation skipped:', qrErr);
            }

            // Right col: description
            const rightColX = imgColX + imgW + 6;
            const rightColW = pageW - rightColX - 14;
            let rightY = imgColY;

            // Description
            const rawDesc = product?.description || 'No description available.';
            const cleanDesc = rawDesc.replace(/<[^>]*>/g, '').trim();
            doc.setTextColor(55, 65, 81);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            const splitDesc = doc.splitTextToSize(cleanDesc, rightColW);
            const descLinesToShow = Math.min(splitDesc.length, 16);
            doc.text(splitDesc.slice(0, descLinesToShow), rightColX, rightY + 4);
            rightY += 4 + descLinesToShow * 4.2 + 2;

            // If jewelry product, fetch specs and price breakup details
            const groupedSpecs = getGroupedSpecs();
            const priceBreakupList = groupedSpecs['PRICE BREAKUP'] || [];

            // Specs table in right column (compact)
            const specsData = [];
            if (product?.specifications?.length > 0) {
                // Filter out tags & price breakup from normal specs table in right column to keep it clean!
                product.specifications
                    .filter(spec => {
                        const lbl = spec.label.toUpperCase();
                        return !lbl.includes('GOLD') && !lbl.includes('DIAMOND') && !lbl.includes('MAKING') && !lbl.includes('GST') && !lbl.includes('TOTAL') && !lbl.includes('PRICE') && !lbl.includes('TAG');
                    })
                    .slice(0, 8)
                    .forEach(spec => specsData.push([spec.label, spec.value]));
            }
            if (specsData.length > 0) {
                autoTable(doc, {
                    startY: rightY,
                    head: [['Specification', 'Value']],
                    body: specsData,
                    theme: 'plain',
                    headStyles: { fillColor: [fR, fG, fB], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8, cellPadding: 2 },
                    bodyStyles: { fontSize: 8, cellPadding: 2 },
                    alternateRowStyles: { fillColor: [253, 245, 246] },
                    columnStyles: { 0: { fontStyle: 'bold', textColor: [40, 40, 40] }, 1: { textColor: [80, 80, 80] } },
                    margin: { left: rightColX, right: 14 },
                    tableWidth: rightColW,
                });
                rightY = doc.lastAutoTable.finalY + 4;
            }

            // Price Breakup table right below specifications
            if (isJewelleryProduct && priceBreakupList.length > 0) {
                // jsPDF doesn't render ₹ — replace with Rs. for proper display
                const pbData = priceBreakupList.map(item => [
                    item.label,
                    String(item.value).replace('₹', 'Rs. ').replace(/^Rs\.\s*/, 'Rs. ')
                ]);
                autoTable(doc, {
                    startY: rightY,
                    head: [['Price Component', 'Amount']],
                    body: pbData,
                    theme: 'plain',
                    headStyles: {
                        fillColor: [fR, fG, fB],
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        fontSize: 8,
                        cellPadding: 2
                    },
                    bodyStyles: { fontSize: 8, cellPadding: 2 },
                    alternateRowStyles: { fillColor: [253, 245, 246] },
                    columnStyles: {
                        0: { fontStyle: 'bold', textColor: [40, 40, 40], halign: 'left' },
                        1: { textColor: [fR, fG, fB], fontStyle: 'bold', halign: 'right' }
                    },
                    didParseCell: (data) => {
                        if (data.section === 'head' && data.column.index === 1) {
                            data.cell.styles.halign = 'right';
                        }
                    },
                    margin: { left: rightColX, right: 14 },
                    tableWidth: rightColW,
                });
                rightY = doc.lastAutoTable.finalY + 4;
            }

            // ── FEATURES SECTION (full width, below image/QR + table) ────
            const leftColBottom = imgColY + imgH + qrSize + 12; // image + QR + label gap
            let featY = Math.max(leftColBottom, rightY + 2);

            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(30, 20, 25);
            doc.text(featuresHdr, 14, featY);
            featY += 5;

            const benefitsList = product?.benefits?.length > 0
                ? product.benefits
                : ['High-performance engineering for precision operations', 'Built with premium-grade industrial alloys', 'Easy maintenance and long operational lifespan', 'Compact design for optimal workspace efficiency'];

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(55, 65, 81);
            const halfLen = Math.ceil(benefitsList.length / 2);
            const colW2 = (pageW - 28) / 2;
            benefitsList.forEach((b, i) => {
                const colX = i < halfLen ? 14 : 14 + colW2;
                const row = i < halfLen ? i : i - halfLen;
                const lineY = featY + row * 6;
                doc.setDrawColor(fR, fG, fB);
                doc.setFillColor(fR, fG, fB);
                // Square bullet (doc.triangle doesn't exist in modern jsPDF)
                doc.rect(colX, lineY - 1.5, 2, 2, 'F');
                const bText = doc.splitTextToSize(b, colW2 - 8);
                doc.text(bText[0], colX + 4, lineY);
            });

            const featBlockH = halfLen * 6 + 4;

            // ── SPECS TABLE (full width, below features) ───────────────
            const allSpecs = product?.specifications || [];
            if (allSpecs.length > 8) {
                let specY = featY + featBlockH + 4;
                doc.setFont('Helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(30, 20, 25);
                doc.text('TECHNICAL SPECIFICATIONS', 14, specY);
                specY += 4;
                const fullSpecsData = allSpecs.map(s => [s.label, s.value]);
                autoTable(doc, {
                    startY: specY,
                    head: [['Specification', 'Value']],
                    body: fullSpecsData,
                    theme: 'striped',
                    headStyles: { fillColor: [fR, fG, fB], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
                    bodyStyles: { fontSize: 8 },
                    alternateRowStyles: { fillColor: [253, 245, 246] },
                    margin: { left: 14, right: 14 },
                });
            }

            // ── BRANDED FOOTER (every page) ───────────────────────────
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);

                // Footer band
                const footerY = pageH - 22;
                doc.setFillColor(fR, fG, fB);
                doc.rect(0, footerY, pageW, 22, 'F');

                // Company name
                doc.setTextColor(255, 255, 255);
                doc.setFont('Helvetica', 'bold');
                doc.setFontSize(9);
                doc.text(companyName, 14, footerY + 7);

                // Address, phone, email, website
                doc.setFont('Helvetica', 'normal');
                doc.setFontSize(7);
                doc.setTextColor(240, 220, 225);
                doc.text(address, 14, footerY + 12);
                doc.text(`\u260E ${phone}   \u2709 ${email}   \u{1F310} ${website}`, 14, footerY + 17);

                // Cert + page
                doc.setFont('Helvetica', 'bold');
                doc.setFontSize(7);
                doc.setTextColor(255, 240, 245);
                doc.text(certText, pageW - 14, footerY + 10, { align: 'right' });
                doc.setFont('Helvetica', 'normal');
                doc.setFontSize(7);
                doc.text(`Page ${i} / ${pageCount}`, pageW - 14, footerY + 16, { align: 'right' });
            }

            doc.save(`${product.name.toLowerCase().replace(/\s+/g, '-')}-datasheet.pdf`);
            showNotification('Technical PDF downloaded successfully!');
        } catch (error) {
            console.error('PDF Download error:', error);
            showNotification('Failed to generate PDF. Please try again.');
        }
    };

    const handleApplyCoupon = (coupon) => {
        setAppliedCoupon(coupon);
        showNotification(`${coupon.code} applied! Check final price.`);
    };

    const getDiscountedPrice = () => {
        if (!appliedCoupon) return currentPrice;
        if (appliedCoupon.type === 'percent') {
            return currentPrice - (currentPrice * appliedCoupon.value / 100);
        } else {
            return Math.max(0, currentPrice - appliedCoupon.value);
        }
    };

    const finalPrice = getDiscountedPrice();

    const renderProductDetailsAccordion = () => {
        const hasSpecs = product.specifications && product.specifications.length > 0;
        const groupedSpecs = hasSpecs ? getGroupedSpecs() : {};

        // Sub-component: a single label–value row (safe, no hooks)
        const SpecRow = ({ label, value, isTotal = false }) => (
            <div className={`grid grid-cols-2 gap-2 py-1.5 px-2 text-[10.5px] border-b border-zinc-100 last:border-0
                ${isTotal ? 'bg-[#FDF5F6]' : 'hover:bg-zinc-50/60'}
            `}>
                <span className={`leading-snug ${isTotal ? 'text-[#8B4356] font-black' : 'text-zinc-500 font-medium'}`}>
                    {label}
                </span>
                <span className={`leading-snug text-right ${isTotal ? 'text-[#1a1a1a] font-black text-[11.5px]' : 'text-[#1D5C8A] font-semibold'}`}>
                    {value}
                </span>
            </div>
        );

        // Accordion section — uses shared expandedSections + toggleSection (no useState inside render)
        const AccordionSection = ({ sectionKey, title, items, isTagSection = false }) => {
            const isOpen = expandedSections[sectionKey] !== false; // default open unless explicitly false
            return (
                <div className="border-b border-zinc-200 last:border-0">
                    <button
                        onClick={() => toggleSection(sectionKey)}
                        className="w-full flex items-center justify-between py-2 px-2.5 bg-zinc-50 hover:bg-[#FDF5F6] transition-colors"
                    >
                        <span className="text-[10px] font-black text-[#1a1a1a] tracking-[0.2em] uppercase">{title}</span>
                        <span className={`text-[#8B4356] font-black text-base leading-none transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    <AnimatePresence initial={false}>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="overflow-hidden"
                            >
                                {isTagSection ? (
                                    <div className="px-3 py-3 text-[10.5px] text-[#2C6E9E] font-medium leading-relaxed tracking-wide">
                                        {parseTagsString(items[0]?.value).length > 0 ? (
                                            parseTagsString(items[0]?.value).map((tag, i, arr) => (
                                                <span key={`${tag}-${i}`}>
                                                    <Link
                                                        to={buildPopularSearchLink(productDepartment, tag, productSubCategory ? { subcategory: productSubCategory } : {})}
                                                        className="hover:underline"
                                                    >
                                                        {tag}
                                                    </Link>
                                                    {i < arr.length - 1 && ', '}
                                                </span>
                                            ))
                                        ) : (
                                            items[0]?.value
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        {items.map((item, i) => {
                                            const isTotal = item.label.toUpperCase() === 'TOTAL';
                                            return <SpecRow key={i} label={item.label} value={item.value} isTotal={isTotal} />;
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            );
        };

        if (!hasSpecs) {
            return (
                <div className="p-4 bg-white border border-[#F5E6E8] text-xs text-zinc-500 leading-relaxed">
                    No additional specifications listed for this {isJewelleryProduct ? 'collection' : 'product'}.
                </div>
            );
        }

        // Section title
        const mainTitle = isJewelleryProduct ? 'Product Details' : 'Technical Specifications';

        // The sections to render in order
        const knownSections = [
            { key: 'PRODUCT DETAILS',         label: 'Product Details',           open: true  },
            { key: 'SOLITAIRE DETAILS',        label: 'Solitaire Details',         open: true  },
            { key: 'DIAMOND DETAILS',          label: 'Diamond Details',           open: true  },
            { key: 'METAL DETAILS',            label: 'Metal Details',             open: true  },
            { key: 'PRICE BREAKUP',            label: 'Price Breakup',             open: true  },
            { key: 'TAGS',                     label: 'Tags',                      open: false, isTag: true },
            { key: 'TECHNICAL SPECIFICATIONS', label: 'Technical Specifications',  open: true  },
        ];

        const renderedKeys = new Set();

        return (
            <div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#333] mb-3 pb-2 border-b-2 border-[#8B4356]/20">
                    {mainTitle}
                </h4>

                <div className="border border-zinc-200 rounded-sm overflow-hidden divide-y divide-zinc-200">
                    {knownSections.map(({ key, label, isTag }) => {
                        const items = groupedSpecs[key];
                        if (!items || items.length === 0) return null;
                        renderedKeys.add(key);
                        return (
                            <AccordionSection
                                key={key}
                                sectionKey={key}
                                title={label}
                                items={items}
                                isTagSection={!!isTag}
                            />
                        );
                    })}

                    {/* Catch-all for any ungrouped extra sections */}
                    {Object.entries(groupedSpecs)
                        .filter(([k]) => !renderedKeys.has(k) && groupedSpecs[k]?.length > 0)
                        .map(([k, items]) => (
                            <AccordionSection key={k} sectionKey={k} title={k} items={items} />
                        ))
                    }
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#FDF5F6] font-body text-[#1A1A1A] pb-12 selection:bg-[#8B4356] selection:text-white overflow-x-hidden">
            <main className="w-full px-3 lg:px-6 pt-4 lg:pt-6">
                {/* Full-width Left-Aligned Heading & Breadcrumbs */}
                <div className="w-full space-y-2 pb-3 mb-1 border-b border-[#F5E6E8]/40">
                    <div className="flex flex-wrap items-center gap-1.5 text-[9.5px] md:text-[10px] uppercase tracking-[0.18em] font-normal font-assistant text-[#709dbd]">
                        <Link to="/" className="hover:text-[#8B4356] transition-colors">Home</Link>
                        <span className="opacity-50">/</span>
                        <Link to={departmentShopLink} className="hover:text-[#8B4356] transition-colors">{departmentLabel}</Link>
                        <span className="opacity-50">/</span>
                        <Link
                            to={`/shop?category=${encodeURIComponent(productCategoryLabel)}`}
                            className="hover:text-[#8B4356] transition-colors"
                        >
                            {productCategoryLabel}
                        </Link>
                        <span className="opacity-50">/</span>
                        <span className="text-black font-assistant">{product.name}</span>
                    </div>

                    <h1 className="text-[22px] md:text-[26px] lg:text-[30px] font-assistant font-semibold leading-snug text-zinc-800 tracking-wide">
                        {product.name ? (product.name === product.name.toUpperCase() ? product.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : product.name) : ''}
                    </h1>

                    {isJewelleryProduct && (
                        <p className="text-[11px] md:text-[12px] text-zinc-500 font-medium font-assistant">
                            From <span className="text-[#1D5C8A] hover:underline cursor-pointer">{product.collection || 'The Precious Promise Collection'}</span>
                        </p>
                    )}
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-2 items-start pt-3 lg:pt-4">

                    {/* 2. Left Column: Image Gallery - Sticky & Sharp Corners */}
                    <div className="lg:col-span-5 lg:sticky lg:top-20 w-full space-y-1.5 lg:pl-6">
                        <div className="lg:pl-10 xl:pl-14">
                        <div className="px-4 lg:px-0">
                            <div
                                onClick={() => setIsZoomed(!isZoomed)}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={() => setIsZoomed(false)}
                                className={`aspect-[1/1] bg-white rounded-[36px_4px_36px_4px] overflow-hidden shadow-sm relative group border border-[#F5E6E8]/30 max-h-[350px] mx-auto lg:mx-0 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                            >
                                <motion.img
                                    key={selectedImgIdx}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={productImages[selectedImgIdx]}
                                    style={{
                                        transformOrigin: isZoomed ? `${mousePos.x}% ${mousePos.y}%` : 'center',
                                    }}
                                    className={`w-full h-full object-cover transition-transform duration-250 ${isZoomed ? 'scale-[2.2]' : 'scale-100'} rounded-[36px_4px_36px_4px]`}
                                />
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleWishlist(); }}
                                    className="absolute top-4 right-4 flex items-center justify-center p-1.5 active:scale-90 transition-all z-10 text-zinc-600 hover:text-red-500 hover:scale-115"
                                >
                                    <Heart className={`w-5.5 h-5.5 transition-all drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.15)] ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} strokeWidth={2} />
                                </button>
                                {isJewelleryProduct ? (
                                     <>
                                         <button
                                             onClick={(e) => { e.stopPropagation(); handleDownloadImage(); }}
                                             title="Download Product Image as PNG"
                                             className="absolute top-13 right-4 flex items-center justify-center p-1.5 active:scale-90 transition-all z-10 text-zinc-600 hover:text-[#8B4356] hover:scale-115"
                                         >
                                             <Download className="w-5.5 h-5.5 transition-all drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.15)]" strokeWidth={2} />
                                         </button>
                                         <button
                                             onClick={(e) => { e.stopPropagation(); handleDownloadPDF(); }}
                                             title="Download Technical PDF Brochure"
                                             className="absolute top-22 right-4 flex items-center justify-center p-1.5 active:scale-90 transition-all z-10 text-zinc-600 hover:text-[#8B4356] hover:scale-115"
                                         >
                                             <FileText className="w-5.5 h-5.5 transition-all drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.15)]" strokeWidth={2} />
                                         </button>
                                     </>
                                 ) : (
                                     <button
                                         onClick={(e) => { e.stopPropagation(); handleDownloadPDF(); }}
                                         title="Download Technical PDF Brochure"
                                         className="absolute top-13 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 shadow-md border border-red-100 active:scale-90 transition-all z-10 hover:bg-red-50 hover:scale-110"
                                     >
                                         <FileText className="w-4 h-4 text-red-600 transition-all" strokeWidth={2} />
                                     </button>
                                 )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-[#8B4356] text-white text-[6px] font-black uppercase tracking-[.3em] px-2 py-0.5 rounded-[4px_1px_4px_1px]">New Arrival</span>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Selector - Sharp & Compact */}
                        <div className="flex justify-center lg:justify-start gap-2 py-1 px-4 lg:px-0">
                            {['FRONT', 'SIDE', 'DETAIL'].map((label, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImgIdx(idx % productImages.length)}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <div className={`w-10 h-10 rounded-none overflow-hidden border transition-all p-0.5 ${selectedImgIdx === (idx % productImages.length) ? 'border-[#8B4356] scale-105' : 'border-white'}`}>
                                        <img src={productImages[idx % productImages.length]} className="w-full h-full object-cover rounded-none" />
                                    </div>
                                    <span className={`text-[5.5px] font-black uppercase tracking-widest transition-colors ${selectedImgIdx === (idx % productImages.length) ? 'text-[#8B4356]' : 'text-zinc-300'}`}>{label}</span>
                                </button>
                            ))}
                        </div>
                        </div>

                        {/* Seeker's Guide - Beautiful Trust badging card under image gallery */}
                        <div className="pt-3 px-4 lg:px-0">
                            <h4 className="text-[10px] font-black uppercase tracking-[.4em] text-[#8B4356]/60 mb-2 flex items-center gap-3">Seeker's Guide <div className="h-[1px] flex-grow bg-zinc-150"></div></h4>
                            <div className="bg-[#FFF9F6]/40 p-3 rounded-none border border-[#F5E6E8]/40 space-y-2 shadow-sm">
                                <ul className="space-y-1.5">
                                    {(product.benefits && product.benefits.length > 0 ? product.benefits : [
                                        "BIS Hallmarked Gold: 100% certified pure metal.",
                                        "Hand-Set Settings: Exquisite craftsmanship.",
                                        "Complimentary Resizing: Free forever on all rings.",
                                        "Insured Shipping: Secure delivery to your doorstep."
                                    ]).map((point, pIdx) => (
                                        <li key={pIdx} className="flex gap-2 text-[10px] md:text-[10.5px] leading-snug text-zinc-500 font-medium">
                                            <div className="shrink-0 w-1 h-1 rounded-none bg-[#8B4356] mt-1.5 opacity-40"></div>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 3. Right Column: Product Detail Info - Sticky Details Flow */}
                    <div className="px-5 lg:px-0 lg:pt-0 lg:col-span-7 space-y-4 w-full">
                        <div className="space-y-3">

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-[#FFF9F6] border border-[#FDF2ED] px-2 py-0.5 rounded-none shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                    <span className="text-[11px] font-black text-zinc-800 leading-none">{product.rating || 4.5}</span>
                                    <Star className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                                </div>
                                <span className="text-[10.5px] font-black text-zinc-400 tracking-wider uppercase">{product.reviews || '880'} reviews</span>
                                <div className="h-3.5 w-[1px] bg-zinc-200"></div>
                                <span className="text-[10.5px] font-black text-[#8B4356] tracking-wider uppercase">5K+ Monthly Seekers</span>
                                {product.weight && (
                                    <>
                                        <div className="h-3 w-[1px] bg-zinc-200"></div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] font-black uppercase text-[#8B4356]/40 tracking-widest">Weight:</span>
                                            <span className="text-[10.5px] font-black text-black tracking-wider uppercase">{product.weight}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Pricing Section - Bluestone Style */}
                        <div className="bg-transparent p-0 border-none relative shadow-none space-y-1">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-baseline leading-none">
                                    <span className={`text-[22px] font-bold tracking-wide ${appliedCoupon ? 'text-emerald-600' : 'text-[#333333]'}`}>
                                        ₹{finalPrice.toLocaleString()}
                                    </span>
                                    {(originalPrice > currentPrice || appliedCoupon) && (
                                        <span className="text-sm font-medium text-zinc-400 line-through ml-2 leading-none">
                                            ₹{currentPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                {/* Right Side: Interactive Share Action */}
                                <div className="flex items-center text-[#709dbd]">
                                    <button
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: product.name,
                                                    text: `Check out ${product.name} on HG Enterprises!`,
                                                    url: window.location.href,
                                                }).catch(err => console.log(err));
                                            } else {
                                                navigator.clipboard.writeText(window.location.href);
                                                showNotification("Product link copied to clipboard!");
                                            }
                                        }}
                                        className="hover:text-blue-800 transition-colors p-1"
                                        title="Share Product"
                                    >
                                        <Share2 className="w-4 h-4" strokeWidth={2} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-[11px] font-medium text-[#7a7a7a]">MRP incl. of all taxes</p>

                            <div className="flex items-center gap-2 pt-1">
                                    <Video className="w-4 h-4 text-[#2E7D32]" />
                                    <span className="text-[12px] text-[#333]">Schedule video call</span>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const productId = product._id || product.id;
                                            const dept = getProductDepartment(product.department || product.category || product.name || '');
                                            const snapshot = {
                                                product: productId,
                                                name: product.name,
                                                image: product.image || '',
                                                code: String(productId).slice(-8),
                                                metal: '',
                                                stone: '',
                                                department: dept === 'machines' || dept === 'tools' ? dept : 'jewellery',
                                                category: product.category || '',
                                            };
                                            try {
                                                if (user && user.role !== 'admin') {
                                                    await api.post('/video-calls/cart', { productId });
                                                } else {
                                                    const { addGuestVcItem } = await import('../../../utils/videoCallCart');
                                                    addGuestVcItem(snapshot);
                                                }
                                                showNotification('Added to Video Call Cart');
                                                navigate('/video-call-cart');
                                            } catch (err) {
                                                showNotification(
                                                    err.response?.data?.message || err.message || 'Could not add to video call cart'
                                                );
                                            }
                                        }}
                                        className="text-[12px] font-semibold text-[#2C6E9E] hover:underline"
                                    >
                                        Book Now
                                    </button>
                                </div>

                            {appliedCoupon && (
                                <div className="flex mt-1">
                                    <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 border border-emerald-100/50 flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        <span className="text-[10px] font-semibold">{appliedCoupon.code} Applied (Saved ₹{(currentPrice - finalPrice).toLocaleString()})</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interactive dynamic segments */}
                        {/* Product Specifications Label Bar - ALWAYS RENDERED FOR ALL PRODUCTS */}
                        <div className="text-[12px] font-assistant font-bold text-zinc-700 tracking-wide pt-1 pb-0.5 leading-snug">
                            {getProductSummaryLabel()}
                        </div>

                        {isJewelleryProduct && (
                            <div className="space-y-2.5 pt-3.5 border-t border-zinc-100 mt-3">

                                {/* Functional Pincode Box */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-[#333333] mb-0.5">
                                        <span>Pincode:</span>
                                    </div>
                                    <div className="flex items-center max-w-[220px] border-b border-zinc-200">
                                        <input
                                            type="text"
                                            placeholder="Enter Pincode"
                                            value={pincodeVal}
                                            onChange={(e) => setPincodeVal(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="py-1 text-[12px] font-medium w-full focus:outline-none placeholder-[#a9a9a9] text-[#333333] bg-transparent"
                                        />
                                        <button
                                            onClick={handleCheckPincode}
                                            className="text-[#709dbd] hover:text-blue-800 px-2 py-1 text-[11px] font-bold transition-colors"
                                        >
                                            Update
                                        </button>
                                    </div>
                                    {pincodeStatus && (
                                        <p className={`text-[10px] font-medium ${pincodeStatus.includes('✓') ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            {pincodeStatus}
                                        </p>
                                    )}
                                    <p className="text-[9.5px] text-zinc-400 mt-0.5 leading-snug">
                                        Provide pincode for delivery date & nearby stores!
                                    </p>
                                </div>

                                {/* Customize design accordion */}
                                <div className="border-t border-b border-zinc-150 py-2 my-0.5">
                                    <button
                                        onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
                                        className="w-full flex items-center justify-between text-left focus:outline-none group"
                                    >
                                        <span className="text-[12px] font-assistant font-bold text-zinc-700 tracking-wide">Customize this design</span>
                                        {isCustomizeOpen ? (
                                            <Minus className="w-4 h-4 text-zinc-500 group-hover:text-zinc-700 transition-colors" />
                                        ) : (
                                            <Plus className="w-4 h-4 text-zinc-500 group-hover:text-zinc-700 transition-colors" />
                                        )}
                                    </button>
                                    <AnimatePresence>
                                        {isCustomizeOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="grid grid-cols-2 gap-4 pt-3 pb-1">
                                                    <div className="space-y-1">
                                                        <span className="text-[10.5px] font-assistant font-bold text-zinc-400 uppercase tracking-wider">Metal Purity</span>
                                                        <div className="flex gap-2">
                                                            {['14Kt', '18Kt', '22Kt'].map((pur) => (
                                                                <button
                                                                    key={pur}
                                                                    onClick={() => setCustomPurity(pur)}
                                                                    className={`px-2.5 py-1 text-[11.5px] font-assistant font-bold border transition-all ${customPurity === pur
                                                                            ? 'border-[#EF5F3F] text-[#EF5F3F] bg-[#EF5F3F]/[0.02]'
                                                                            : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                                                                        }`}
                                                                >
                                                                    {pur}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10.5px] font-assistant font-bold text-zinc-400 uppercase tracking-wider">Diamond Clarity</span>
                                                        <div className="flex gap-2">
                                                            {['SI-JK', 'VS-GH', 'VVS-EF'].map((dia) => (
                                                                <button
                                                                    key={dia}
                                                                    onClick={() => setCustomDiamond(dia)}
                                                                    className={`px-2.5 py-1 text-[11.5px] font-assistant font-bold border transition-all ${customDiamond === dia
                                                                            ? 'border-[#EF5F3F] text-[#EF5F3F] bg-[#EF5F3F]/[0.02]'
                                                                            : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                                                                        }`}
                                                                >
                                                                    {dia}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}

                        {/* Conditional Action Card: Sizes for Jewelry vs PDF Downloads for Machines/Tools */}
                        {isJewelleryProduct ? (
                            <div className="flex flex-col gap-1 py-1.5 mt-1 border-b border-zinc-100/50 pb-2.5">
                                <div className="flex items-center justify-between w-full max-w-[280px]">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Select Ring Size</span>
                                    <button
                                        onClick={() => setShowSizeGuide(true)}
                                        className="text-[10.5px] font-bold text-[#709dbd] hover:text-blue-800 transition-colors uppercase tracking-wider outline-none"
                                    >
                                        Size Guide
                                    </button>
                                </div>
                                
                                <div className="relative w-full max-w-[280px] mt-0.5">
                                    <select
                                        value={selectedSize}
                                        onChange={(e) => setSelectedSize(Number(e.target.value))}
                                        className="w-full bg-white border border-zinc-200 py-2 px-3 pr-8 text-[12px] font-assistant font-bold text-zinc-800 focus:outline-none focus:border-[#8B4356] transition-all rounded-none appearance-none cursor-pointer"
                                    >
                                        {[
                                            { size: 5, mm: '44.8 mm', status: 'Made to Order' },
                                            { size: 6, mm: '45.9 mm', status: 'Only 2 left!' },
                                            { size: 7, mm: '47.1 mm', status: 'Only 2 left!' },
                                            { size: 8, mm: '48.1 mm', status: 'Only 5 left!' },
                                            { size: 9, mm: '49.0 mm', status: 'In Stock' },
                                            { size: 10, mm: '50.0 mm', status: 'In Stock' },
                                            { size: 11, mm: '50.9 mm', status: 'Only 1 left!' },
                                            { size: 12, mm: '51.8 mm', status: 'In Stock' },
                                            { size: 13, mm: '52.8 mm', status: 'In Stock' },
                                            { size: 14, mm: '54.0 mm', status: 'In Stock' }
                                        ].map((opt) => (
                                            <option key={opt.size} value={opt.size}>
                                                Size {opt.size} ({opt.mm}) — {opt.status}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-500">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowSizeGuide(true)}
                                    className="text-[10px] font-semibold text-[#2C6E9E] hover:text-[#1d4f73] underline tracking-wide transition-colors focus:outline-none text-left mt-1 self-start"
                                >
                                    Not sure about the size?
                                </button>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-white to-[#FDF5F6] p-4 rounded-3xl border border-[#F5E6E8] shadow-sm group transition-all duration-300 hover:shadow-md">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500">
                                            <FileText className="w-6 h-6 text-red-600" strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-800">TECHNICAL DATASHEET</h4>
                                            <p className="text-[9px] font-medium text-zinc-400 leading-tight max-w-[200px]">
                                                Manual, specs, and blueprints (PDF).
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="h-11 px-6 bg-[#8B4356] hover:bg-[#7a394b] text-white rounded-2xl font-black uppercase tracking-[.2em] text-[8.5px] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm active:scale-95 group-hover:translate-y-[-2px]"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Stock & Delivery - Compact & Frameless */}
                        {isJewelleryProduct ? (
                            <div className="space-y-3.5 py-2 mt-1">
                                <div className="flex flex-col gap-3">
                                    {/* Side by side Buy Now and 10+1 Monthly Plan buttons matching Image 1 & 2 exactly */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={handleBuyNow}
                                            className="bg-[#8B4356] hover:bg-[#7a394b] text-white h-[42px] rounded-none font-bold uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-sm focus:outline-none flex items-center justify-center"
                                        >
                                            Buy Now
                                        </button>
                                        <button
                                            onClick={() => {
                                                const recommended = Math.max(1000, Math.round((currentPrice / 11) / 500) * 500);
                                                setMonthlyInstallment(recommended);
                                                setShowInquiryForm(false);
                                                setShowMonthlyPlanModal(true);
                                            }}
                                            className="border border-[#8B4356] text-[#8B4356] bg-white hover:bg-[#8B4356]/5 h-[42px] rounded-none font-bold uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-sm focus:outline-none flex items-center justify-center"
                                        >
                                            10+1 Monthly Plan
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-zinc-100">
                                    <p className="text-[9px] font-semibold text-zinc-400 leading-snug tracking-wide uppercase">
                                        FREE Delivery by <span className="text-[#8B4356] font-bold">Sunday</span>. Order in <span className="text-black font-black">2 hrs 56 mins</span>.
                                    </p>
                                </div>

                                {/* Three-Column Trust Badges Row from Image 1 & 2 */}
                                <div className="grid grid-cols-3 divide-x divide-zinc-200 border-t border-b border-zinc-200/50 py-3 my-3">
                                    <div className="flex flex-col items-center justify-center text-center px-2">
                                        <RotateCcw className="w-4.5 h-4.5 text-zinc-500 mb-1 stroke-[1.5]" />
                                        <span className="text-[10px] md:text-[10.5px] font-assistant font-bold text-zinc-600 leading-tight uppercase tracking-wider">30 Day Returnable</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center text-center px-2">
                                        <RefreshCw className="w-4.5 h-4.5 text-zinc-500 mb-1 stroke-[1.5]" />
                                        <span className="text-[10px] md:text-[10.5px] font-assistant font-bold text-zinc-600 leading-tight uppercase tracking-wider">Lifetime Exchange</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center text-center px-2">
                                        <Award className="w-4.5 h-4.5 text-zinc-500 mb-1 stroke-[1.5]" />
                                        <span className="text-[10px] md:text-[10.5px] font-assistant font-bold text-zinc-600 leading-tight uppercase tracking-wider">Certified Jewellery</span>
                                    </div>
                                </div>

                                {/* Any Questions & WhatsApp Chat matching Bluestone style perfectly */}
                                <div className="text-center py-2 bg-[#FFF9F6]/50 border border-[#F5E6E8]/30 mt-2">
                                    <p className="text-[10.5px] md:text-[11px] font-assistant text-zinc-500 font-medium flex items-center justify-center gap-1.5 flex-wrap">
                                        Any Questions? Please feel free to reach out to us at:
                                        <a
                                            href="https://wa.me/919076062592"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#8B4356] hover:text-[#5C3F30] font-bold inline-flex items-center gap-1 hover:underline transition-all"
                                        >
                                            <svg className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500 shrink-0" viewBox="0 0 24 24">
                                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.47l-6.256 1.638zm6.54-3.32a9.774 9.774 0 0 0 5.41 1.605c5.493 0 9.961-4.42 9.965-9.864.002-2.637-1.019-5.117-2.877-6.98-1.858-1.863-4.327-2.887-6.963-2.888-5.49 0-9.957 4.422-9.961 9.869-.001 1.993.521 3.94 1.512 5.66l-.991 3.616 3.705-.968zm10.745-6.398c-.297-.148-1.758-.867-2.03-.967-.273-.099-.471-.148-.669.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.011c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                            </svg>
                                            90760 62592
                                        </a>
                                    </p>
                                </div>

                            </div>
                        ) : (
                            <>
                                <div className="bg-white p-2.5 lg:p-3 rounded-none border border-[#F5E6E8] shadow-sm space-y-2.5">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="text-[9.5px] font-black text-emerald-600 uppercase tracking-widest">In Stock Now</span>
                                        </div>
                                        <span className="text-[12px] font-black text-black tracking-tighter">₹{currentPrice.toLocaleString()}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={handleAddToCart}
                                            className="bg-[#2a2a2a] text-white h-9 rounded-none font-black uppercase tracking-[.2em] text-[9px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all duration-300 hover:bg-[#5C3F30]"
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2.5} /> Add to Bag
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            className="bg-[#8B4356] text-white h-9 rounded-none font-black uppercase tracking-[.2em] text-[9px] transition-all hover:bg-[#7a394b] active:scale-95 shadow-sm"
                                        >
                                            Buy Now
                                        </button>
                                    </div>

                                </div>
                                
                                {/* Technical Specifications Accordion explicitly in right column for non-jewellery */}
                                <div className="mt-6 pt-6 border-t border-[#F5E6E8]/60">
                                    {renderProductDetailsAccordion()}
                                </div>
                            </>
                        )}
                    </div> {/* Close Right Column (col-span-6) */}
                </div> {/* Close Main Purchase Grid (grid-cols-12) */}

                {/* 4. Specifications & Customer Feedback Side-by-Side Row */}
                <div className="mt-8 border-t border-[#F5E6E8]/60 pt-8 px-4 lg:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        
                        {/* Left Column: Product Details Accordions (lg:col-span-6) - Only for Jewellery */}
                        {isJewelleryProduct && (
                            <div className="lg:col-span-6 space-y-4">
                                {renderProductDetailsAccordion()}
                            </div>
                        )}

                        {/* Right Column: Customer Feedback & Promises (lg:col-span-6) */}
                        <div className="lg:col-span-6 space-y-6">
                            {/* Customer Speak / Ratings & Reviews Section - Compact & Beautiful */}
                            {(() => {
                                const allReviewsList = [...reviews, ...[
                                    {
                                        _id: 'default-1',
                                        userId: { name: 'Manisha Lalwani', userImage: '' },
                                        rating: 5,
                                        comment: 'Thank you Harshad Gauri for such a lovely collection and delivering it on time. Just loved the stuff gifted by my darling hubby.',
                                        createdAt: '2025-09-05T00:00:00.000Z',
                                        images: [productImages[0] || product?.image]
                                    },
                                    {
                                        _id: 'default-2',
                                        userId: { name: 'Anushka Sharma', userImage: '' },
                                        rating: 5,
                                        comment: 'Absolutely stunning craftsmanship. The shine under sunlight is breathtaking. Highly recommend Harshad Gauri!',
                                        createdAt: '2026-04-18T00:00:00.000Z',
                                        images: [productImages[1] || product?.image]
                                    },
                                    {
                                        _id: 'default-3',
                                        userId: { name: 'Rahul Verma', userImage: '' },
                                        rating: 5,
                                        comment: 'Good product. Elegant build, stellar packaging. Completely matches the collection guides.',
                                        createdAt: '2026-04-02T00:00:00.000Z',
                                        images: [productImages[2] || product?.image]
                                    }
                                ]];

                                const currReview = allReviewsList[activeReviewIdx % allReviewsList.length] || allReviewsList[0];

                                return (
                                    <div className="pb-4 w-full space-y-6">
                                        <div className="bg-transparent p-1">
                                            <div className="flex items-center justify-between border-b border-[#2C6E9E] pb-3 mb-6">
                                                <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-black">Customer Speak</h3>
                                                <button
                                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-[#8B4356] hover:underline outline-none"
                                                >
                                                    {showReviewForm ? 'Cancel' : 'Write a Review'}
                                                </button>
                                            </div>

                                            {/* Write a Review Form */}
                                            <AnimatePresence>
                                                {showReviewForm && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden bg-white border border-zinc-200 p-4 sm:p-6 mb-6 shadow-sm"
                                                    >
                                                        <form onSubmit={handleAddReview} className="space-y-4">
                                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8B4356]">Submit Your Testimony</h4>

                                                            <div>
                                                                <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-500 mb-2">Your Rating</label>
                                                                <div className="flex gap-1.5">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <button
                                                                            key={star}
                                                                            type="button"
                                                                            onClick={() => setUserRating(star)}
                                                                            className="p-1 hover:scale-110 transition-transform outline-none"
                                                                        >
                                                                            <Star
                                                                                className={`w-6 h-6 ${star <= userRating ? 'fill-[#8B4356] text-[#8B4356]' : 'text-zinc-200'}`}
                                                                            />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-500 mb-1">Your Review</label>
                                                                <textarea
                                                                    value={userComment}
                                                                    onChange={(e) => setUserComment(e.target.value)}
                                                                    placeholder="Tell us what you love about this item..."
                                                                    rows={4}
                                                                    className="w-full border border-zinc-200 p-3 text-[11px] font-medium outline-none focus:border-[#8B4356]/40 bg-white"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-500 mb-1">Image URL (Optional)</label>
                                                                <div className="flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={reviewImage}
                                                                        onChange={(e) => setReviewImage(e.target.value)}
                                                                        placeholder="Paste a photo link of your unboxing box..."
                                                                        className="flex-1 border border-zinc-200 p-3 text-[11px] font-medium outline-none focus:border-[#8B4356]/40 bg-white"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="px-4 border border-zinc-200 text-zinc-400 hover:text-[#8B4356] transition-colors flex items-center justify-center bg-white outline-none"
                                                                        title="Mock camera upload"
                                                                    >
                                                                        <Camera className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <button
                                                                type="submit"
                                                                disabled={isSubmittingReview}
                                                                className="bg-black text-white py-3 px-8 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-md outline-none"
                                                            >
                                                                {isSubmittingReview ? 'Submitting...' : 'Post Testimonial'}
                                                            </button>
                                                        </form>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Carousel View */}
                                            <div className="flex items-center justify-between gap-1 md:gap-2">
                                                <button
                                                    onClick={() => setActiveReviewIdx(prev => prev === 0 ? allReviewsList.length - 1 : prev - 1)}
                                                    className="p-1.5 text-[#1D5C8A] hover:scale-125 transition-transform outline-none shrink-0"
                                                >
                                                    <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 stroke-[3px]" />
                                                </button>

                                                <div className="flex-1 text-center px-1 overflow-hidden">
                                                    <AnimatePresence mode="wait">
                                                        <motion.div
                                                            key={activeReviewIdx}
                                                            initial={{ opacity: 0, scale: 0.98 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.98 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="flex flex-col items-center w-full text-center"
                                                        >
                                                            <div className="w-44 h-44 md:w-52 md:h-52 bg-white mb-5 mx-auto overflow-hidden border border-zinc-200 p-1 shadow-sm">
                                                                <img
                                                                    src={currReview.images?.[0] || productImages[0] || product?.image}
                                                                    alt="Customer View"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>

                                                            <p className="text-sm md:text-base font-medium font-assistant text-zinc-800 max-w-sm mx-auto leading-relaxed text-center">
                                                                "{currReview.comment}"
                                                            </p>

                                                            <div className="w-10 h-0.5 bg-[#2C6E9E] my-4 mx-auto"></div>

                                                            <span className="font-serif text-sm md:text-base text-zinc-900 font-bold text-center">
                                                                {currReview.userId?.name || 'Anonymous'}
                                                            </span>
                                                        </motion.div>
                                                    </AnimatePresence>
                                                </div>

                                                <button
                                                    onClick={() => setActiveReviewIdx(prev => prev === allReviewsList.length - 1 ? 0 : prev + 1)}
                                                    className="p-1.5 text-[#1D5C8A] hover:scale-125 transition-transform outline-none shrink-0"
                                                >
                                                    <ChevronRight className="w-6 h-6 md:w-7 md:h-7 stroke-[3px]" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Manufacturer & Country Card directly underneath */}
                                        <div className="bg-transparent border-t border-zinc-200 pt-5 space-y-3 text-xs font-assistant">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-3 gap-1">
                                                <span className="text-zinc-500 font-medium">Manufacturer</span>
                                                <span className="text-[#1D5C8A] font-semibold sm:text-right">Harshad Gauri Enterprises Limited<br /><span className="text-[10px] text-zinc-400 font-normal">302, Golden Plaza, Business District, Mumbai-400001</span></span>
                                            </div>
                                            <div className="flex items-center justify-between pt-0.5">
                                                <span className="text-zinc-500 font-medium">Country of Origin</span>
                                                <span className="text-[#1D5C8A] font-semibold">India</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Brand Promises & Certificate Section */}
                            <div className="space-y-4 mt-8 pt-8 border-t border-zinc-200/50">
                                {/* Box 1: Brand Promises */}
                                <div className="bg-white border border-zinc-200 p-4.5 md:p-5 shadow-sm">
                                    <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#333333] mb-4 text-center sm:text-left">
                                        The Harshad Gauri Promise
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-3">
                                        <div className="flex items-center gap-2">
                                            <RotateCcw className="w-4 h-4 text-[#8B4356] shrink-0" strokeWidth={2.2} />
                                            <span className="text-[10px] font-bold text-[#8B4356] uppercase tracking-wider leading-tight">30 Day Returnable</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4 text-[#8B4356] shrink-0" strokeWidth={2.2} />
                                            <span className="text-[10px] font-bold text-[#8B4356] uppercase tracking-wider leading-tight">Lifetime Exchange & Buy-Back</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Award className="w-4 h-4 text-[#8B4356] shrink-0" strokeWidth={2.2} />
                                            <span className="text-[10px] font-bold text-[#8B4356] uppercase tracking-wider leading-tight">Certified Jewellery</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-[#8B4356] shrink-0" strokeWidth={2.2} />
                                            <span className="text-[10px] font-bold text-[#8B4356] uppercase tracking-wider leading-tight">100% Refund</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Truck className="w-4 h-4 text-[#8B4356] shrink-0" strokeWidth={2.2} />
                                            <span className="text-[10px] font-bold text-[#8B4356] uppercase tracking-wider leading-tight">Free Shipping</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Heart className="w-4 h-4 text-[#8B4356] shrink-0" strokeWidth={2.2} />
                                            <span className="text-[10px] font-bold text-[#8B4356] uppercase tracking-wider leading-tight">Free Returns</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Box 2: Certificate of Authenticity */}
                                <div className="bg-[#788896] text-white p-6 text-center shadow-sm">
                                    <h4 className="font-serif text-base tracking-wider mb-2">CERTIFICATE OF AUTHENTICITY</h4>
                                    <p className="text-[11px] leading-relaxed font-assistant opacity-90 max-w-sm mx-auto">
                                        Every piece of jewellery that we make is certified for authenticity by third-party international laboratories like SGL, IGI, BIS, GIA, and GSI.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                    {/* Popular search tags — jewellery, tools & machines */}
                    <div className="mt-6 px-4 lg:px-0">
                        <PopularSearchTags
                            department={productDepartment}
                            subCategory={productSubCategory}
                        />
                    </div>

                    {/* Related Products Section - Compact Gallery */}
                    <div className="mt-8 px-4 lg:px-0 mb-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[.6em] text-zinc-300 mb-5 flex items-center gap-3 px-1">Curated Seek <div className="h-[1px] flex-grow bg-zinc-100/20"></div></h3>
                        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide px-1">
                            {products.filter(p => p.id !== product.id).slice(0, 6).map(rel => (
                                <div key={rel.id} className="shrink-0 w-[160px] md:w-[240px]">
                                    <ProductCard product={rel} />
                                </div>
                            ))}
                        </div>
                    </div>

            </main>

            {/* Floating Action Bar - Compact & Sharp */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-xl border-t border-[#F5E6E8] p-2 z-[110] flex gap-2 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] rounded-none items-center">
                <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#2a2a2a] text-white h-full rounded-none font-black uppercase tracking-[.2em] text-[9.5px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all duration-300 hover:bg-[#5C3F30]"
                >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                </button>
                <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#8B4356] text-white h-full rounded-none font-black uppercase tracking-[.2em] text-[9.5px] transition-all hover:bg-[#7a394b] active:scale-95 shadow-sm"
                >
                    Buy Now
                </button>
            </div>
            {/* Mobile Success Sheet - Immersive Swipe Up */}
            <AnimatePresence>
                {showSuccessSheet && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSuccessSheet(false)}
                            className="fixed inset-0 bg-black/60 z-[140] backdrop-blur-[4px]"
                        />

                        {/* Swipe Up Sheet */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 z-[150] bg-white rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] pb-[calc(1rem+env(safe-area-inset-bottom))] p-6 lg:hidden"
                        >
                            {/* Drag Indicator */}
                            <div className="w-12 h-1.5 bg-zinc-100 rounded-full mx-auto mb-6"></div>

                            {/* Success Context */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-20 h-20 bg-[#FDF5F6] rounded-2xl overflow-hidden border border-[#F5E6E8]/50 p-1">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center p-0.5">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-[12px] font-black text-emerald-600 uppercase tracking-widest">Added to Bag</span>
                                    </div>
                                    <span className="font-display font-black text-black text-lg tracking-tighter leading-none">{product.name}</span>
                                    <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1.5">{product.subCategory}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="w-full bg-[#8B4356] text-white h-14 rounded-2xl font-black uppercase tracking-[.25em] text-[10px] shadow-xl active:scale-95 transition-all"
                                >
                                    View My Bag
                                </button>
                                <button
                                    onClick={() => setShowSuccessSheet(false)}
                                    className="w-full bg-white text-zinc-400 h-14 rounded-2xl font-black uppercase tracking-[.25em] text-[10px] border border-zinc-100 hover:bg-zinc-50 active:scale-95 transition-all"
                                >
                                    Continue Shopping
                                </button>

                                <div className="flex items-center justify-between px-2 mt-4 pt-4 border-t border-zinc-50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Bag Subtotal</span>
                                        <span className="text-xl font-display font-black text-black tracking-tighter">₹{product.price.toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="bg-[#8B4356] text-white h-12 px-8 rounded-full font-black uppercase tracking-widest text-[9px] shadow-lg active:scale-95 transition-all"
                                    >
                                        Place Order
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Discovery Sidebar Drawer */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#FFF0F2] z-[201] shadow-2xl flex flex-col border-l border-[#8B4356]/10"
                        >
                            <div className="pt-5 pb-6 px-6 border-b border-[#8B4356]/10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B4356] mb-1">Our World</span>
                                        <h3 className="font-serif text-3xl md:text-3xl text-black leading-tight italic">Curated <span className="text-[#8B4356] not-italic">Discovery</span></h3>
                                    </div>
                                    <button
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="p-2.5 hover:bg-[#8B4356]/10 rounded-full transition-all hover:rotate-90 group border border-transparent hover:border-[#8B4356]/20"
                                    >
                                        <X className="w-5 h-5 text-zinc-400 group-hover:text-black" />
                                    </button>
                                </div>
                                <p className="text-[10px] font-serif italic text-zinc-400 leading-relaxed">Explore our signature manifests and heritage collections carefully selected for the modern patron.</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6">
                                {[
                                    {
                                        category: "Signature Collections",
                                        items: [
                                            { name: "Bridal Heritage", path: "bridal" },
                                            { name: "Daily Minimalist", path: "minimalist" },
                                            { name: "Vintage Charm", path: "vintage" },
                                            { name: "Contemporary", path: "modern" }
                                        ]
                                    },
                                    {
                                        category: "Elite Gifts",
                                        items: [
                                            { name: "For Her", path: "for-her" },
                                            { name: "For Him", path: "for-him" },
                                            { name: "Anniversary Special", path: "anniversary" }
                                        ]
                                    }
                                ].map((group, gIdx) => (
                                    <div key={gIdx} className="space-y-3">
                                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8B4356]/40 border-b border-[#8B4356]/10 pb-2">{group.category}</h4>
                                        <div className="grid grid-cols-1 gap-1.5">
                                            {group.items.map((item, iIdx) => (
                                                <Link
                                                    key={iIdx}
                                                    to={`/shop?tag=${item.name.split(' ')[0]}`}
                                                    onClick={() => setIsDrawerOpen(false)}
                                                    className="flex items-center justify-between group py-3.5 px-4 rounded-xl bg-white hover:bg-[#8B4356]/[0.05] transition-all border border-[#8B4356]/5 hover:border-[#8B4356]/10 shadow-sm"
                                                >
                                                    <span className="text-[13px] font-serif font-bold text-zinc-800 group-hover:text-[#8B4356] transition-colors">{item.name}</span>
                                                    <ChevronRight className="w-3.5 h-3.5 text-zinc-200 group-hover:text-[#8B4356] group-hover:translate-x-1 transition-all" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-[#8B4356]/10 bg-[#8B4356]/[0.02]">
                                <Link
                                    to="/shop"
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="w-full h-12 bg-black text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[10px] shadow-lg hover:shadow-black/10 active:scale-95 transition-all"
                                >
                                    Explore Full Catalog
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Size Guide Modal */}
            <AnimatePresence>
                {showSizeGuide && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSizeGuide(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300]"
                        />

                        {/* Modal Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-x-4 bottom-4 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md bg-white rounded-3xl z-[301] shadow-2xl p-6 flex flex-col max-h-[85vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#8B4356] mb-1">Patron Sizing</span>
                                    <h3 className="font-serif text-2xl text-black leading-tight italic">Ring <span className="text-[#8B4356] not-italic">Size Guide</span></h3>
                                </div>
                                <button
                                    onClick={() => setShowSizeGuide(false)}
                                    className="p-2 hover:bg-zinc-50 rounded-full transition-all"
                                >
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Use our comprehensive conversion chart below to find your correct ring size based on your finger circumference or diameter measurements.</p>

                                {/* Size Conversion Table */}
                                <div className="border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                                <th className="py-2.5 px-3 text-[9px] font-black text-black uppercase tracking-wider">Ring Size</th>
                                                <th className="py-2.5 px-3 text-[9px] font-black text-black uppercase tracking-wider">Inside Diameter</th>
                                                <th className="py-2.5 px-3 text-[9px] font-black text-black uppercase tracking-wider">Circumference</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-50 text-[10px]">
                                            {[
                                                { size: '5', diameter: '15.7 mm', circumference: '49.3 mm' },
                                                { size: '6', diameter: '16.5 mm', circumference: '51.8 mm' },
                                                { size: '7', diameter: '17.3 mm', circumference: '54.4 mm' },
                                                { size: '8', diameter: '18.2 mm', circumference: '56.9 mm' },
                                                { size: '9', diameter: '19.0 mm', circumference: '59.5 mm' },
                                                { size: '10', diameter: '19.8 mm', circumference: '62.1 mm' },
                                                { size: '11', diameter: '20.6 mm', circumference: '64.6 mm' },
                                                { size: '12', diameter: '21.3 mm', circumference: '67.2 mm' },
                                                { size: '13', diameter: '22.2 mm', circumference: '69.7 mm' },
                                                { size: '14', diameter: '23.0 mm', circumference: '72.3 mm' }
                                            ].map((row, idx) => (
                                                <tr key={idx} className="hover:bg-zinc-50/30 transition-colors">
                                                    <td className="py-2 px-3 font-bold text-[#8B4356]">{row.size}</td>
                                                    <td className="py-2 px-3 font-semibold text-zinc-600">{row.diameter}</td>
                                                    <td className="py-2 px-3 font-semibold text-zinc-600">{row.circumference}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* How to Measure section */}
                                <div className="bg-[#FDF5F6] p-4 rounded-2xl border border-[#F5E6E8]/60">
                                    <h4 className="text-[9px] font-black text-[#8B4356] uppercase tracking-widest mb-2">How to Measure at Home</h4>
                                    <ol className="list-decimal list-inside space-y-2 text-[9.5px] leading-relaxed text-zinc-600 font-medium">
                                        <li>Wrap a piece of thin string or paper strip snugly around the base of your finger.</li>
                                        <li>Mark the exact spot where the ends meet.</li>
                                        <li>Measure the paper length in millimeters with a ruler to get the <span className="font-bold text-black">circumference</span>.</li>
                                        <li>Match your measurement to the table above to choose the perfect size!</li>
                                    </ol>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowSizeGuide(false)}
                                className="mt-5 w-full h-11 bg-[#8B4356] text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-md hover:bg-[#7a394b] active:scale-95 transition-all"
                            >
                                Got it, Thank you
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* 10+1 Monthly Plan Modal */}
            <AnimatePresence>
                {showMonthlyPlanModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowMonthlyPlanModal(false);
                                setIsSubscribedPlan(false);
                                setShowInquiryForm(false);
                            }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
                        />

                        {/* Modal Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-x-4 bottom-4 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-4xl bg-white rounded-none z-[301] shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh] overflow-y-auto border border-zinc-200 w-[calc(100%-2rem)]"
                        >
                            {/* Header (Matching User's Mockup) */}
                            <div className="bg-white px-6 py-6 border-b border-zinc-100 flex flex-col items-center relative text-center">
                                {/* Close button */}
                                <button
                                    onClick={() => {
                                        setShowMonthlyPlanModal(false);
                                        setIsSubscribedPlan(false);
                                        setShowInquiryForm(false);
                                    }}
                                    className="absolute right-5 top-5 p-2 hover:bg-zinc-50 rounded-full transition-all text-zinc-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <h3 className="font-serif text-3xl font-normal text-[#0F2942] tracking-wide">
                                    Gold Mine 10+1 Plan
                                </h3>

                                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 mt-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider font-assistant">
                                    <div>Selected Product: <span className="text-[#0F2942] font-black">{product?.name}</span></div>
                                    <div className="hidden md:block w-px h-3 bg-zinc-200" />
                                    <div>Product Value: <span className="text-[#0F2942] font-black">₹{currentPrice.toLocaleString()}</span></div>
                                    <div className="hidden md:block w-px h-3 bg-zinc-200" />
                                    <div>Recommended Monthly Amount: <span className="text-[#0F2942] font-black">₹{Math.max(1000, Math.round((currentPrice / 11) / 100) * 100).toLocaleString()}</span></div>
                                </div>
                            </div>

                            {!isSubscribedPlan ? (
                                !showInquiryForm ? (
                                    /* MAIN CALCULATOR CARD (Matching User's Mockup) */
                                    <>
                                        {/* Gray Content Area */}
                                        <div className="bg-[#F4F4F4] p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                                            {/* Left side: Step-by-Step Timeline */}
                                            <div className="md:col-span-6 space-y-7 relative pl-8 py-2">
                                                {/* Timeline dotted connector line */}
                                                <div className="absolute left-3.5 top-6 bottom-6 w-0.5 border-l border-dashed border-[#1B5299]/40" />

                                                {/* Step 1 */}
                                                <div className="flex items-start gap-4 relative text-left">
                                                    <div className="absolute -left-[29px] top-1.5 w-[14px] h-[14px] rounded-full bg-[#1B5299] text-white flex items-center justify-center text-[8px] font-black border-2 border-[#F4F4F4] z-10 shadow-sm">1</div>
                                                    <div className="w-11 h-11 rounded-full bg-[#1B5299] flex items-center justify-center shrink-0 shadow-md">
                                                        <CreditCard className="w-5 h-5 text-white stroke-[2px]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[12.5px] font-extrabold text-[#0F2942] uppercase tracking-wide font-assistant">Pay Monthly</h4>
                                                        <p className="text-[11px] text-zinc-500 font-medium leading-normal mt-0.5 font-assistant">10 month installments with easy payment options</p>
                                                    </div>
                                                </div>

                                                {/* Step 2 */}
                                                <div className="flex items-start gap-4 relative text-left">
                                                    <div className="absolute -left-[29px] top-1.5 w-[14px] h-[14px] rounded-full bg-[#1B5299] text-white flex items-center justify-center text-[8px] font-black border-2 border-[#F4F4F4] z-10 shadow-sm">2</div>
                                                    <div className="w-11 h-11 rounded-full bg-[#1B5299] flex items-center justify-center shrink-0 shadow-md">
                                                        <Tag className="w-5 h-5 text-white stroke-[2px]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[12.5px] font-extrabold text-[#0F2942] uppercase tracking-wide font-assistant">Get Special Discount</h4>
                                                        <p className="text-[11px] text-zinc-500 font-medium leading-normal mt-0.5 font-assistant">Get 1 monthly installment for FREE in the 11th month</p>
                                                    </div>
                                                </div>

                                                {/* Step 3 */}
                                                <div className="flex items-start gap-4 relative text-left">
                                                    <div className="absolute -left-[29px] top-1.5 w-[14px] h-[14px] rounded-full bg-[#1B5299] text-white flex items-center justify-center text-[8px] font-black border-2 border-[#F4F4F4] z-10 shadow-sm">3</div>
                                                    <div className="w-11 h-11 rounded-full bg-[#1B5299] flex items-center justify-center shrink-0 shadow-md">
                                                        <ShoppingBag className="w-5 h-5 text-white stroke-[2px]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[12.5px] font-extrabold text-[#0F2942] uppercase tracking-wide font-assistant">Redeem & Purchase</h4>
                                                        <p className="text-[11px] text-zinc-500 font-medium leading-normal mt-0.5 font-assistant">Redeem final amount after 11 months to purchase the jewellery of your choice</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right side: White calculation Card */}
                                            <div className="md:col-span-6 bg-white p-5 md:p-6 shadow-md border border-zinc-150 flex flex-col justify-between space-y-4 font-assistant text-left">
                                                {/* Interactive Slider customizer inside calculation card */}
                                                <div className="border-b border-zinc-100 pb-3">
                                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                                                        <span>Customize Monthly Amount:</span>
                                                        <span className="text-[#EF5F3F] bg-[#EF5F3F]/10 px-2 py-0.5 rounded-full font-bold">Interactive</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min={1000}
                                                        max={50000}
                                                        step={500}
                                                        value={monthlyInstallment}
                                                        onChange={(e) => setMonthlyInstallment(Number(e.target.value))}
                                                        className="w-full h-1.5 bg-zinc-100 accent-[#EF5F3F] cursor-pointer rounded-lg mb-1"
                                                    />
                                                    <div className="flex justify-between text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                                                        <span>Min: ₹1,000</span>
                                                        <span>Max: ₹50,000</span>
                                                    </div>
                                                </div>

                                                {/* Calculation details layout */}
                                                <div className="space-y-4 text-xs text-zinc-600">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-semibold text-zinc-500 text-[11px]">Recommended Monthly Amount</span>
                                                        <span className="font-extrabold text-black text-xs md:text-sm">₹{monthlyInstallment.toLocaleString()}</span>
                                                    </div>

                                                    <div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-semibold text-zinc-500 text-[11px]">Your total payment</span>
                                                            <span className="font-extrabold text-black text-xs md:text-sm">₹{(monthlyInstallment * 10).toLocaleString()}</span>
                                                        </div>
                                                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wide">Period of 10 months</span>
                                                    </div>

                                                    <div>
                                                        <div className="flex justify-between items-center text-[#EF5F3F]">
                                                            <span className="font-extrabold text-[11px]">100% Discount on 11th installment</span>
                                                            <span className="font-black text-xs md:text-sm">₹{monthlyInstallment.toLocaleString()}</span>
                                                        </div>
                                                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wide">100% of 1 month installment value</span>
                                                    </div>

                                                    <div className="border-t border-zinc-100 pt-4">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-extrabold text-[#0F2942] text-[11px]">Buy any jewellery worth</span>
                                                            <span className="font-black text-sm text-black">₹{(monthlyInstallment * 11).toLocaleString()}</span>
                                                        </div>
                                                        <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wide">After 11th month</span>
                                                    </div>

                                                    <div className="flex justify-between items-center border-t border-zinc-100 pt-4">
                                                        <div>
                                                            <span className="font-semibold text-[#0F2942] text-[11px] block">You effectively pay</span>
                                                            <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wide block mt-0.5">(for ₹{(monthlyInstallment * 11).toLocaleString()} value)</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="font-black text-base text-[#0F2942] block">₹{(monthlyInstallment * 10).toLocaleString()}</span>
                                                            <span className="inline-block bg-[#10853F] text-white text-[8px] font-black uppercase px-2 py-0.5 tracking-wider mt-1 rounded-sm">9.09% discount!</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer (Matching User's Mockup) */}
                                        <div className="bg-white px-6 py-5 border-t border-zinc-150 flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <div className="text-left max-w-lg">
                                                <span className="text-[10px] font-black text-[#EF5F3F] uppercase tracking-wider block mb-0.5 font-assistant">Please Note:</span>
                                                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed font-assistant">
                                                    You can purchase any jewellery using the accumulated amount after 11 months* <span className="text-[#EF5F3F] font-black cursor-pointer underline hover:text-[#d0492a]">T&C</span>
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setShowInquiryForm(true)}
                                                className="w-full sm:w-auto px-10 h-11 bg-[#EF5F3F] text-white uppercase font-black tracking-widest text-[10px] hover:bg-[#d84d2f] active:scale-95 transition-all shadow-md font-assistant"
                                            >
                                                SUBSCRIBE NOW
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    /* SAVINGS ENROLLMENT INQUIRY FORM (Toggled after clicking SUBSCRIBE NOW) */
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (!planForm.phone.trim()) {
                                                showNotification({ message: 'Please enter a phone number', type: 'error' });
                                                return;
                                            }
                                            setIsSubmittingPlan(true);
                                            api.post('/subscriptions/create', {
                                                name: planForm.name,
                                                email: planForm.email,
                                                phone: planForm.phone,
                                                productId: product.id || product._id,
                                                productName: product.name,
                                                productPrice: currentPrice,
                                                monthlyInstallment: monthlyInstallment,
                                                maturityValue: monthlyInstallment * 11
                                            })
                                                .then((res) => {
                                                    setIsSubmittingPlan(false);
                                                    setIsSubscribedPlan(true);
                                                    showNotification({ message: 'Inquiry submitted successfully!', type: 'success' });
                                                })
                                                .catch((err) => {
                                                    setIsSubmittingPlan(false);
                                                    console.error('[SUBMIT SUBSCRIPTION PLAN ERROR]', err);
                                                    showNotification({
                                                        message: err.response?.data?.message || 'Failed to submit inquiry. Please try again.',
                                                        type: 'error'
                                                    });
                                                });
                                        }}
                                        className="p-6 md:p-8 bg-[#F4F4F4] text-left space-y-5"
                                    >
                                        <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-[#0F2942] font-assistant">Provide Enrollment Details</h4>
                                            <button
                                                type="button"
                                                onClick={() => setShowInquiryForm(false)}
                                                className="text-xs text-[#EF5F3F] font-bold uppercase tracking-wider hover:underline"
                                            >
                                                ← Back to Calculator
                                            </button>
                                        </div>

                                        <div className="bg-white p-4.5 border border-zinc-150 space-y-3 shadow-sm">
                                            <div>
                                                <label className="block text-[8px] font-black uppercase tracking-wider text-zinc-500 mb-1 font-assistant">Your Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={planForm.name}
                                                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                                                    placeholder="Enter your full name"
                                                    className="w-full border border-zinc-200 p-2.5 text-[10.5px] font-medium outline-none focus:border-[#EF5F3F] bg-zinc-50/20 font-assistant"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[8px] font-black uppercase tracking-wider text-zinc-500 mb-1 font-assistant">Email Address</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={planForm.email}
                                                    onChange={(e) => setPlanForm({ ...planForm, email: e.target.value })}
                                                    placeholder="Enter your email"
                                                    className="w-full border border-zinc-200 p-2.5 text-[10.5px] font-medium outline-none focus:border-[#EF5F3F] bg-zinc-50/20 font-assistant"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[8px] font-black uppercase tracking-wider text-zinc-500 mb-1 font-assistant">Mobile Number</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={planForm.phone}
                                                    onChange={(e) => setPlanForm({ ...planForm, phone: e.target.value })}
                                                    placeholder="Enter 10-digit mobile number"
                                                    className="w-full border border-zinc-200 p-2.5 text-[10.5px] font-medium outline-none focus:border-[#EF5F3F] bg-zinc-50/20 font-assistant"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-[#FFFDF3] border border-[#F3EBBA] p-3 text-center">
                                            <p className="text-[10px] text-zinc-600 font-semibold font-assistant leading-normal">
                                                By submitting, you enroll in a 10+1 scheme with a monthly amount of <span className="font-bold text-[#0F2942]">₹{monthlyInstallment.toLocaleString()}</span>. Target Maturity gold fund: <span className="font-extrabold text-[#EF5F3F]">₹{(monthlyInstallment * 11).toLocaleString()}</span>.
                                            </p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmittingPlan}
                                            className="w-full h-11 bg-[#EF5F3F] hover:bg-[#d84d2f] text-white rounded-none font-black uppercase tracking-widest text-[10px] shadow-md transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 font-assistant"
                                        >
                                            {isSubmittingPlan ? 'Processing Inquiry...' : 'Submit 10+1 Scheme Inquiry'}
                                        </button>
                                    </form>
                                )
                            ) : (
                                /* CONGRATULATIONS / SUCCESS RECEIPT */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 md:p-8 bg-[#F4F4F4] text-center space-y-6"
                                >
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-sm border border-emerald-100">
                                        <Check className="w-8 h-8 text-emerald-500 stroke-[3px]" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-serif font-black text-black italic">Congratulations!</h4>
                                        <p className="text-[11px] font-black text-[#EF5F3F] uppercase tracking-widest leading-none font-assistant">Your Savings Plan Staged Successfully</p>
                                    </div>

                                    {/* Plan Summary Receipt */}
                                    <div className="max-w-sm mx-auto bg-white border border-dashed border-zinc-300 p-4.5 rounded-none text-left space-y-2 font-mono text-[10px] md:text-[11px] text-zinc-600 relative overflow-hidden shadow-sm">
                                        <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#EF5F3F]/5 rounded-full rotate-45"></div>
                                        <div className="border-b border-zinc-200/60 pb-2 text-center font-bold text-black uppercase tracking-wider text-[9px] mb-1">
                                            SAVINGS SCHEME RECEIPT
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Patron Name:</span>
                                            <span className="font-bold text-black">{planForm.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Mobile Contact:</span>
                                            <span className="font-bold text-black">{planForm.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Target Jewelry:</span>
                                            <span className="font-bold text-black truncate max-w-[180px]">{product.name}</span>
                                        </div>
                                        <div className="border-t border-zinc-200/60 my-2"></div>
                                        <div className="flex justify-between font-bold text-zinc-800">
                                            <span>Monthly Installment:</span>
                                            <span>₹{monthlyInstallment.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-zinc-500">
                                            <span>Installment Period:</span>
                                            <span>10 Months</span>
                                        </div>
                                        <div className="flex justify-between text-emerald-600 font-bold">
                                            <span>HG Bonus Gift (Month 11):</span>
                                            <span>₹{monthlyInstallment.toLocaleString()}</span>
                                        </div>
                                        <div className="border-t border-zinc-200/60 my-2"></div>
                                        <div className="flex justify-between text-black font-extrabold text-xs md:text-sm">
                                            <span>Maturity Gold Fund:</span>
                                            <span className="text-[#EF5F3F]">₹{(monthlyInstallment * 11).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-zinc-500 max-w-sm mx-auto leading-relaxed font-assistant">
                                        We have sent a confirmation details brochure of terms and conditions to your email <span className="font-bold text-black">{planForm.email}</span>. Our expert gold concierge will reach out to you within 24 hours at your mobile number <span className="font-bold text-black">{planForm.phone}</span> to finalize your digital mandate and activate the account!
                                    </p>

                                    <button
                                        onClick={() => {
                                            setShowMonthlyPlanModal(false);
                                            setIsSubscribedPlan(false);
                                            setShowInquiryForm(false);
                                        }}
                                        className="w-full h-11 bg-[#0F2942] text-white rounded-none font-black uppercase tracking-widest text-[9px] shadow-md hover:bg-zinc-800 active:scale-95 transition-all max-w-sm mx-auto block font-assistant"
                                    >
                                        Done, Back to Product
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Interactive Video Call Booking Modal */}
            <AnimatePresence>
                {isVideoModalOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsVideoModalOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
                        />

                        {/* Modal Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-x-4 bottom-4 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md bg-white rounded-none z-[301] shadow-2xl p-6 md:p-8 flex flex-col max-h-[90vh] overflow-y-auto border border-[#F5E6E8] w-[calc(100%-2rem)]"
                        >
                            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#EF5F3F] mb-1">Live Consultation</span>
                                    <h3 className="font-serif text-2xl text-black leading-tight italic">Schedule <span className="text-[#EF5F3F] not-italic">Video Call</span></h3>
                                </div>
                                <button
                                    onClick={() => setIsVideoModalOpen(false)}
                                    className="p-2 hover:bg-zinc-50 rounded-full transition-all"
                                >
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>

                            {!isVideoSubmitting ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setIsVideoSubmitting(true);
                                        setTimeout(() => {
                                            setIsVideoSubmitting(false);
                                            setIsVideoModalOpen(false);
                                            showNotification("Video consultation booked successfully! Check email for the link.");
                                        }, 1000);
                                    }}
                                    className="space-y-4"
                                >
                                    <p className="text-[11.5px] font-assistant font-medium text-zinc-500 leading-relaxed mb-2">
                                        Speak directly with our premium jewelry consultants from the comfort of your home. View the <span className="font-bold text-black">{product.name}</span> in detail, ask questions, and explore sizing live.
                                    </p>

                                    <div>
                                        <label className="block text-[8px] font-black uppercase tracking-wider text-zinc-500 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={videoForm.name}
                                            onChange={(e) => setVideoForm({ ...videoForm, name: e.target.value })}
                                            placeholder="Enter your name"
                                            className="w-full border border-zinc-150 p-2.5 text-[10.5px] font-medium outline-none focus:border-[#EF5F3F] rounded-none bg-zinc-50/20"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[8px] font-black uppercase tracking-wider text-zinc-500 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={videoForm.email}
                                            onChange={(e) => setVideoForm({ ...videoForm, email: e.target.value })}
                                            placeholder="Enter your email"
                                            className="w-full border border-zinc-150 p-2.5 text-[10.5px] font-medium outline-none focus:border-[#EF5F3F] rounded-none bg-zinc-50/20"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[8px] font-black uppercase tracking-wider text-zinc-500 mb-1">Preferred Date</label>
                                            <input
                                                type="date"
                                                required
                                                value={videoForm.date}
                                                onChange={(e) => setVideoForm({ ...videoForm, date: e.target.value })}
                                                className="w-full border border-zinc-150 p-2.5 text-[10.5px] font-medium outline-none focus:border-[#EF5F3F] rounded-none bg-zinc-50/20 text-zinc-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[8px] font-black uppercase tracking-wider text-zinc-500 mb-1">Preferred Time</label>
                                            <select
                                                required
                                                value={videoForm.time}
                                                onChange={(e) => setVideoForm({ ...videoForm, time: e.target.value })}
                                                className="w-full border border-zinc-150 p-2.5 text-[10.5px] font-medium outline-none focus:border-[#EF5F3F] rounded-none bg-zinc-50/20 text-zinc-800"
                                            >
                                                <option value="">Select slot</option>
                                                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                                                <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                                                <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                                                <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                                                <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full h-12 bg-black hover:bg-zinc-800 text-white rounded-none font-black uppercase tracking-[0.2em] text-[9.5px] shadow-md transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 mt-2"
                                    >
                                        Confirm Reservation
                                    </button>
                                </form>
                            ) : (
                                <div className="py-8 text-center space-y-4">
                                    <div className="w-12 h-12 rounded-full border-2 border-t-[#EF5F3F] border-zinc-100 animate-spin mx-auto"></div>
                                    <p className="text-[11px] font-black text-[#EF5F3F] uppercase tracking-widest">Reserving Your Slot...</p>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetails;

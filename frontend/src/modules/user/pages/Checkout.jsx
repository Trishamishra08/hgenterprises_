import React, { useState, useEffect } from 'react';
import { useShop } from '../../../context/ShopContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Truck, CreditCard, Banknote, ShieldCheck, Lock, Plus, Check, MapPin, ChevronRight, LayoutDashboard, Gift, ArrowRight, X, Tag } from 'lucide-react';
import api from '../../../utils/api';

const Checkout = () => {
    const {
        cart,
        placeOrder,
        user,
        addresses,
        addAddress,
        defaultAddressId,
        coupons,
        sendOTP,
        verifyOTP,
        showNotification,
        registerPaidOrder,
        settings,
        orders
    } = useShop();

    const navigate = useNavigate();
    const location = useLocation();
    const isDirectBuy = location.state?.directBuy;

    // Login State
    const [loginStep, setLoginStep] = useState(1); // 1: Phone, 2: OTP
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digit OTP

    // Checkout Form State
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        houseNo: '',
        area: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('online');
    const [loading, setLoading] = useState(false);
    const [addressSelection, setAddressSelection] = useState('new');
    const [selectedId, setSelectedId] = useState(null);
    const [saveNewAddress, setSaveNewAddress] = useState(false);

    const [showCouponModal, setShowCouponModal] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);

    // Checkout Items
    const checkoutItems = isDirectBuy && location.state?.buyNowProduct
        ? [{ ...location.state.buyNowProduct, quantity: 1 }]
        : cart;

    // Calculate totals
    const subtotal = checkoutItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    // First Order Free Logic
    const isFirstOrder = !location.state?.directBuy && (cart.length > 0 && (!orders || orders.length === 0));
    // Fallback: If user is logged in, use orders array length
    const finalIsFirstOrder = user ? (orders && orders.length === 0) : true;
    const shipping = finalIsFirstOrder ? 0 : (settings?.shippingCharge || 0);

    const gstRate = (settings?.gstPercentage || 18) / 100;
    const gstAmount = Math.round(subtotal - (subtotal / (1 + gstRate)));
    const total = subtotal + shipping - discount;

    // Cash on Delivery limit is admin-configurable (Settings > codMaxAmount)
    const COD_LIMIT = settings?.codMaxAmount ?? 30000;
    const codAvailable = total <= COD_LIMIT;

    useEffect(() => {
        if (!codAvailable && paymentMethod === 'cod') {
            setPaymentMethod('online');
        }
    }, [codAvailable, paymentMethod]);

    // Get active coupons from context
    const availableCoupons = coupons ? coupons.filter(c => c.active) : [];

    const handleApplyCoupon = (coupon) => {
        const minVal = coupon.minOrderValue || 0;
        const discountVal = (coupon.type === 'percent') ? (subtotal * coupon.value) / 100 : (coupon.value || 0);

        if (subtotal < minVal) {
            showNotification(`Min order value of ₹${minVal} required`);
            return;
        }
        setAppliedCoupon(coupon);
        setDiscount(discountVal > subtotal ? subtotal : discountVal);
        setShowCouponModal(false);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setDiscount(0);
        setCouponCode('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Login Handlers ---
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (phoneNumber.length === 10) {
            setLoading(true);
            const res = await sendOTP(phoneNumber);
            setLoading(false);
            if (res.success) {
                setLoginStep(2);
                showNotification("OTP Sent!");
            }
        } else {
            showNotification("Full phone number required");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length === 6) {
            setLoading(true);
            const res = await verifyOTP({ phone: phoneNumber, otp: enteredOtp });
            setLoading(false);
            if (res.success) {
                showNotification("Logged in!");
            }
        } else {
            showNotification("6-digit OTP required");
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;

        let newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    // --- Checkout Handler ---
    const handleBuyNow = (product) => {
        addToCart(product);
        // Using state to inform Checkout that this is a direct buy flow to prevent premature empty-cart redirects
        navigate('/checkout', { state: { directBuy: true, buyNowProduct: product } });
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (addressSelection === 'new' && saveNewAddress) {
            await addAddress(formData);
        }

        // Prices, discount, shipping and GST are recomputed by the server; only these fields are sent
        const orderData = {
            items: checkoutItems,
            shippingAddress: formData,
            paymentMethod: paymentMethod === 'online' ? 'razorpay' : 'cod',
            couponCode: appliedCoupon?.code
        };

        // Cash on Delivery: server confirms the order immediately
        if (paymentMethod !== 'online') {
            const orderId = await placeOrder(orderData);
            setLoading(false);
            if (orderId) navigate('/order-success');
            return;
        }

        // Online: 1) server creates the order + gateway order, 2) customer pays, 3) server verifies the signature
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            showNotification("Razorpay SDK failed to load. Check your connection.");
            setLoading(false);
            return;
        }

        let created;
        try {
            const res = await api.post('/orders/place', orderData);
            created = res.data;
        } catch (error) {
            showNotification(error.response?.data?.message || "Could not start payment");
            setLoading(false);
            return;
        }

        const { order, razorpay } = created;
        let settled = false;

        const options = {
            key: razorpay.key,
            amount: razorpay.amount,
            currency: razorpay.currency,
            name: "HG Enterprises",
            description: `Order ${order.orderId}`,
            order_id: razorpay.orderId,
            handler: async (response) => {
                settled = true;
                try {
                    const verifyRes = await api.post('/payments/razorpay/verify', response);
                    if (verifyRes.data.success) {
                        registerPaidOrder(verifyRes.data.order);
                        navigate('/order-success');
                    }
                } catch (err) {
                    showNotification("Payment received but verification failed. Please contact support with order " + order.orderId);
                } finally {
                    setLoading(false);
                }
            },
            modal: {
                // Closed without paying → release the unpaid order
                ondismiss: async () => {
                    if (!settled) {
                        try { await api.post('/payments/razorpay/failed', { razorpay_order_id: razorpay.orderId }); } catch (_) { /* ignore */ }
                        showNotification("Payment cancelled");
                        setLoading(false);
                    }
                },
            },
            prefill: { name: formData.name, email: formData.email, contact: formData.phone },
            theme: { color: "#8B4356" },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', (response) => {
            showNotification("Payment failed: " + response.error.description + " You can retry.");
        });
        paymentObject.open();
    };

    // Pre-fill default address or existing selection
    useEffect(() => {
        if (user && addresses.length > 0) {
            const target = addresses.find(a => a._id === selectedId || a.id === selectedId) ||
                addresses.find(a => a.isDefault) ||
                addresses[0];

            if (target) {
                setFormData({
                    name: target.name || user.name,
                    phone: target.phone || user.phone,
                    email: user.email || '',
                    houseNo: target.houseNo || target.flatNo || '',
                    area: target.area || '',
                    city: target.city || '',
                    state: target.state || '',
                    pincode: target.pincode || ''
                });
                setAddressSelection('saved');
                setSelectedId(target._id || target.id);
            }
        }
    }, [user, addresses]);

    useEffect(() => {
        // Only redirect to cart if the cart is genuinely empty AND we aren't in a direct-buy flow
        if (cart.length === 0 && !isDirectBuy) {
            navigate('/cart');
        }
    }, [cart, navigate, isDirectBuy]);

    if (cart.length === 0 && !isDirectBuy) {
        return null; // Or redirect
    }

    // --- 1. Login View (If not logged in) ---
    if (!user) {
        return (
            <div className="container mx-auto px-4 py-12 md:py-24 flex justify-center items-center min-h-[70vh] bg-white animate-in fade-in duration-700">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                            <Lock className="w-6 h-6 text-black" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-black mb-2">
                            {loginStep === 1 ? 'Login to Checkout' : 'Verify Phone Number'}
                        </h2>
                        <p className="text-gray-500 text-sm font-serif">
                            {loginStep === 1
                                ? 'Please enter your phone number to proceed with your order'
                                : `Enter the 6-digit code sent to +91 ${phoneNumber}`
                            }
                        </p>
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-black/5 border border-gray-100">
                        {loginStep === 1 ? (
                            <form onSubmit={handleSendOtp} className="space-y-6">
                                <div className="flex border border-gray-200 rounded-xl overflow-hidden transition-all focus-within:ring-1 focus-within:ring-black focus-within:border-black bg-gray-50/50">
                                    <div className="bg-gray-50 px-4 flex items-center border-r border-gray-200">
                                        <span className="text-gray-500 font-bold text-sm">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        className="flex-1 py-3 px-4 text-sm outline-none bg-transparent placeholder-gray-400 font-medium"
                                        placeholder="Enter Phone Number"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-3.5 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-[#D39A9F] transition-all shadow-lg shadow-black/10 active:scale-95 transform"
                                >
                                    Send OTP
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="flex justify-center gap-2">
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            value={data}
                                            onChange={(e) => handleOtpChange(e.target, index)}
                                            onFocus={(e) => e.target.select()}
                                            className="w-12 h-14 border border-gray-200 rounded-xl text-center text-xl font-bold focus:ring-black focus:border-black outline-none bg-gray-50/50 transition-all font-display"
                                        />
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-3.5 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-[#D39A9F] transition-all shadow-lg shadow-black/10 active:scale-95 transform"
                                >
                                    Verify & Proceed
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLoginStep(1)}
                                    className="text-xs text-gray-400 hover:text-black font-bold uppercase tracking-wider block mx-auto transition-colors"
                                >
                                    Change Phone Number
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- 2. Checkout View (If logged in) ---
    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl animate-in fade-in duration-700 bg-white min-h-screen">
            <h1 className="text-2xl md:text-4xl font-display font-bold text-black mb-8 md:mb-12 text-center uppercase tracking-widest">
                Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Shipping Address */}
                    <div className="bg-white p-0 md:p-6 rounded-2xl md:border md:border-gray-100 md:shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-black flex items-center gap-3 font-display uppercase tracking-wide">
                                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">1</span>
                                Shipping Details
                            </h2>
                        </div>

                        {/* Saved Addresses List */}
                        {addresses.length > 0 && (
                            <div className="mb-8 p-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Saved Addresses</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr._id || addr.id}
                                            onClick={() => {
                                                setFormData({
                                                    name: addr.name,
                                                    email: user.email || '',
                                                    phone: addr.phone,
                                                    houseNo: addr.houseNo || addr.flatNo || '',
                                                    area: addr.area,
                                                    city: addr.city,
                                                    state: addr.state,
                                                    pincode: addr.pincode
                                                });
                                                setAddressSelection('saved');
                                                setSelectedId(addr._id || addr.id);
                                            }}
                                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all relative ${selectedId === (addr._id || addr.id) ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-black/30'}`}
                                        >
                                            <div className="flex justify-between mb-3">
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-gray-200 text-black rounded-sm">{addr.type}</span>
                                                    {addr.isDefault && (
                                                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#D39A9F] text-white rounded-sm">Default</span>
                                                    )}
                                                </div>
                                                {selectedId === (addr._id || addr.id) && <div className="bg-black text-white rounded-full p-0.5"><Check className="w-3 h-3" /></div>}
                                            </div>
                                            <p className="font-bold text-black text-sm mb-1">{addr.name}</p>
                                            <p className="text-xs text-gray-500 leading-relaxed font-serif">{addr.houseNo || addr.flatNo}, {addr.area}, {addr.city}</p>
                                            <p className="text-xs text-gray-500 font-serif">{addr.pincode}</p>
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => {
                                            setFormData({
                                                name: '',
                                                email: user.email || '',
                                                phone: '',
                                                houseNo: '',
                                                area: '',
                                                city: '',
                                                state: '',
                                                pincode: ''
                                            });
                                            setAddressSelection('new');
                                            setSelectedId(null);
                                        }}
                                        className={`p-5 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50 min-h-[140px] ${addressSelection === 'new' ? 'border-black bg-gray-50' : 'border-gray-200 text-gray-400'}`}
                                    >
                                        <Plus className="w-6 h-6 mb-2 text-[#D39A9F]" />
                                        <span className="text-xs font-bold uppercase tracking-widest text-black">New Address</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 bg-gray-50/50 p-3 md:p-5 rounded-2xl border border-gray-100">
                            <div className="md:col-span-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    {addressSelection === 'new' || addresses.length === 0 ? 'Delivery Address' : 'Selected Address Details'}
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Flat / House / Building</label>
                                <input
                                    required
                                    type="text"
                                    name="houseNo"
                                    value={formData.houseNo}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white font-serif italic"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Area / Street / Sector</label>
                                <input
                                    required
                                    type="text"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white font-serif italic"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Landmark (Optional)</label>
                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white font-serif italic"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">City</label>
                                <input
                                    required
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white font-serif italic"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">State</label>
                                <input
                                    required
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white font-serif italic"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Pincode</label>
                                <input
                                    required
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm bg-white font-serif italic"
                                />
                            </div>
                            {(addressSelection === 'new' || addresses.length === 0) && (
                                <div className="md:col-span-2 flex items-center gap-3 pt-2">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            id="save-address"
                                            checked={saveNewAddress}
                                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-black checked:bg-black focus:outline-none"
                                        />
                                        <Check
                                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                                            size={12}
                                            strokeWidth={3}
                                        />
                                    </div>
                                    <label htmlFor="save-address" className="text-sm text-gray-600 cursor-pointer font-medium select-none">Save this address for future orders</label>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-0 md:p-6 rounded-2xl md:border md:border-gray-100 md:shadow-sm">
                        <h2 className="text-lg md:text-xl font-bold text-black mb-6 flex items-center gap-3 font-display uppercase tracking-wide">
                            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">2</span>
                            Payment Method
                        </h2>

                        <div className="space-y-4">
                            <label className={`flex items-center gap-4 border p-4 rounded-xl cursor-pointer transition-all border-black bg-gray-50`}>
                                <div className="relative flex items-center">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="online"
                                        checked={true}
                                        readOnly
                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-black checked:bg-black focus:outline-none"
                                    />
                                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                                </div>
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="bg-[#EBCDD0] p-2.5 rounded-full text-black">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm md:text-base text-black font-display uppercase tracking-wide">SwiftPay</p>
                                        <p className="text-xs text-gray-500 font-serif">Fast and secure online payment</p>
                                    </div>
                                </div>
                            </label>

                            {codAvailable ? (
                                <label
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`flex items-center gap-4 border p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                                >
                                    <div className="relative flex items-center">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={() => setPaymentMethod('cod')}
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-black checked:bg-black focus:outline-none"
                                        />
                                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                                    </div>
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="bg-[#EBCDD0] p-2.5 rounded-full text-black">
                                            <Banknote size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm md:text-base text-black font-display uppercase tracking-wide">Cash on Delivery</p>
                                            <p className="text-xs text-gray-500 font-serif">Pay when your order arrives</p>
                                        </div>
                                    </div>
                                </label>
                            ) : (
                                <div className="flex items-center gap-4 border border-gray-100 p-4 rounded-xl bg-gray-50 opacity-60 cursor-not-allowed">
                                    <div className="bg-gray-200 p-2.5 rounded-full text-gray-400">
                                        <Banknote size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm md:text-base text-gray-400 font-display uppercase tracking-wide">Cash on Delivery</p>
                                        <p className="text-xs text-gray-400 font-serif">Unavailable for orders above ₹{COD_LIMIT.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-[#FDFBF7] p-6 md:p-8 rounded-2xl border border-[#EBCDD0] sticky top-24 shadow-sm">
                        <h2 className="font-display font-bold text-xl text-black mb-6 uppercase tracking-widest border-b border-[#EBCDD0] pb-4">Order Process</h2>

                        {/* Mini Cart in Summary */}
                        <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-5 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-black line-clamp-2 font-display uppercase tracking-wide text-[11px]">{item.name}</p>
                                        <p className="text-xs text-gray-500 mt-1 font-serif">Qty: {item.quantity || 1}</p>
                                        <p className="text-sm font-bold text-black mt-1">₹{(item.price * (item.quantity || 1)).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mb-6">
                            {!appliedCoupon ? (
                                <div
                                    onClick={() => setShowCouponModal(true)}
                                    className="bg-gray-50 border-2 border-dashed border-[#EBCDD0] p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:border-[#D39A9F] transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Gift className="w-4 h-4 text-[#D39A9F]" />
                                        <span className="text-xs font-bold text-black uppercase tracking-wider">Apply Coupon</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                                </div>
                            ) : (
                                <div className="bg-[#EBCDD0]/20 border border-[#EBCDD0] p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#D39A9F] p-1.5 rounded text-white">
                                            <Tag className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-black uppercase tracking-wider">{appliedCoupon.code}</p>
                                            <p className="text-[10px] text-gray-500">₹{parseFloat(discount).toFixed(0)} saved</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={removeCoupon}
                                        className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wider"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 text-sm text-gray-600 mb-6 pt-4 border-t border-[#EBCDD0]">
                            <div className="flex justify-between items-center">
                                <span className="font-serif">Subtotal</span>
                                <span className="text-black font-bold font-sans">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-serif">Shipping</span>
                                <span className="font-sans font-bold">
                                    {shipping === 0 ? (
                                        <div className="flex flex-col items-end">
                                            <span className="text-emerald-600">Free</span>
                                            {finalIsFirstOrder && <span className="text-[8px] text-emerald-500 uppercase">First Order Special</span>}
                                        </div>
                                    ) : `₹${shipping}`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400">
                                <span className="font-serif">GST ({settings?.gstPercentage || 18}% Included)</span>
                                <span className="font-sans font-bold">₹{gstAmount.toLocaleString()}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between items-center text-[#D39A9F]">
                                    <span className="font-serif">Discount</span>
                                    <span className="font-bold font-sans">- ₹{parseFloat(discount).toFixed(0)}</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-[#EBCDD0] pt-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg text-black font-display uppercase tracking-wide">Total</span>
                                <span className="font-bold text-2xl text-black font-sans">₹{total.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 text-right font-medium uppercase tracking-wider">Inclusive of all taxes</p>
                        </div>

                        <div className="bg-white p-4 rounded-xl text-xs text-gray-500 mb-6 flex gap-3 border border-gray-100 shadow-sm">
                            <ShieldCheck className="w-5 h-5 text-[#D39A9F] flex-shrink-0" />
                            <p className="font-serif leading-relaxed">Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</p>
                        </div>

                        <button
                            form="checkout-form"
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-[#EBCDD0] text-black py-4 rounded-xl font-bold hover:bg-[#D39A9F] hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-lg uppercase tracking-widest text-sm ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    {paymentMethod === 'online' ? 'Redirecting...' : 'Processing...'}
                                </span>
                            ) : (
                                <span>{paymentMethod === 'online' ? 'Pay Now' : 'Place Order'}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {/* Coupon Modal */}
            {
                showCouponModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-white">
                                <h3 className="font-bold text-sm font-display uppercase tracking-widest text-[#4a1d1d]">Available Coupons</h3>
                                <button
                                    onClick={() => setShowCouponModal(false)}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-5 space-y-5 bg-white">
                                {/* Manual Input - Compact */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder={appliedCoupon ? "Coupon already applied" : "Enter Coupon Code"}
                                        value={couponCode}
                                        disabled={!!appliedCoupon}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className={`flex-1 border rounded-xl px-4 py-2 text-xs outline-none font-bold uppercase placeholder:normal-case h-10 ${appliedCoupon ? 'bg-gray-50 border-gray-100 text-gray-400' : 'border-gray-200 focus:border-black'}`}
                                    />
                                    <button
                                        onClick={() => {
                                            if (appliedCoupon) return;
                                            const found = availableCoupons.find(c => c.code === couponCode);
                                            if (found) {
                                                handleApplyCoupon(found);
                                            } else {
                                                alert("Invalid coupon code");
                                            }
                                        }}
                                        disabled={!!appliedCoupon}
                                        className={`px-5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all h-10 ${appliedCoupon ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-[#D39A9F]'}`}
                                    >
                                        Apply
                                    </button>
                                </div>

                                {/* List - Compact Heritage Style */}
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Personalized Offers</p>
                                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                                        {availableCoupons.length > 0 ? availableCoupons.map((coupon, idx) => {
                                            const isApplied = appliedCoupon?.code === coupon.code;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`border rounded-2xl p-4 transition-all group flex flex-col gap-2 ${isApplied ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-100 bg-gray-50/30 hover:bg-white hover:shadow-lg hover:border-[#D39A9F]/30'}`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className={`px-3 py-1 rounded-lg font-bold text-[10px] tracking-widest border ${isApplied ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-[#f0dae4] text-[#8b4356] border-[#f0dae4]'}`}>
                                                            {coupon.code}
                                                        </div>
                                                        {isApplied ? (
                                                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                                                                <Check className="w-3.5 h-3.5" />
                                                                Applied
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleApplyCoupon(coupon)}
                                                                disabled={!!appliedCoupon}
                                                                className={`font-bold text-[10px] uppercase tracking-widest transition-all ${appliedCoupon ? 'text-gray-300 cursor-not-allowed' : 'text-[#8b4356] hover:scale-105'}`}
                                                            >
                                                                {appliedCoupon ? 'Coupon Applied' : 'Tap to Apply'}
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-black mb-1">
                                                            {coupon.type === 'percent'
                                                                ? `${coupon.value}% OFF`
                                                                : `Save ₹${(coupon.value || 0).toLocaleString()}`
                                                            }
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 font-serif italic leading-relaxed">{coupon.description || coupon.desc}</p>
                                                    </div>
                                                </div>
                                            );
                                        }) : (
                                            <p className="text-center py-6 text-xs text-gray-400 font-serif italic">No coupons available at the moment.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Checkout;
